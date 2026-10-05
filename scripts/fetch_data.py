#!/usr/bin/env python3
"""
Script to download and process Kaya identity indicators from Our World in Data (OWID),
World Bank GDP projections, and country metadata (ISO codes, French translations, flags, continents).

Kaya Identity:
CO2 = POP * (GDP / POP) * (Energy / GDP) * (CO2 / Energy)
  - X = GDP / POP (GDP per capita in $ / person)
  - Y = Energy / GDP (Energy intensity of GDP in kWh / $)
  - Z = CO2 / Energy (Carbon intensity of energy in g CO2 / kWh)
  - Volume metrics:
      1. Population (persons)
      2. CO2 emissions per capita (tonnes CO2 / person)
      3. Total CO2 emissions (Million tonnes CO2)

Years covered: 1980 to 2024 (1980 is the first year with >= 100 complete countries).
Missing data is completed by mathematical calculation whenever possible.
Countries with absent data for a given year are omitted for that specific year.
"""

import urllib.request
import csv
import io
import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

# 1. Fetch country regional & linguistic metadata
print("1/4 Loading country metadata (translations, continents, flags)...")
url_countries = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'
req = urllib.request.Request(url_countries, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=20) as resp:
    countries_meta = json.loads(resp.read().decode('utf-8'))

region_fr_map = {
    'Africa': 'Afrique',
    'Americas': 'Amériques',
    'Asia': 'Asie',
    'Europe': 'Europe',
    'Oceania': 'Océanie',
    'Antarctic': 'Antarctique'
}

geo_info = {}
for item in countries_meta:
    cca3 = item.get('cca3')
    if not cca3:
        continue
    name_fr = item.get('translations', {}).get('fra', {}).get('common') or item.get('name', {}).get('common')
    name_en = item.get('name', {}).get('common')
    reg = item.get('region', 'Autre')
    flag = item.get('flag', '')
    geo_info[cca3] = {
        'name_en': name_en,
        'name_fr': name_fr,
        'region': reg,
        'region_fr': region_fr_map.get(reg, reg),
        'flag': flag
    }

# 2. Fetch World Bank GDP growth rates for recent post-2022 years (2023 & 2024)
print("2/4 Fetching World Bank GDP growth rates for 2023 & 2024...")
def fetch_wb_growth(year):
    url = f'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.KD.ZG?date={year}&format=json&per_page=300'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    growth_map = {}
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            payload = json.loads(resp.read().decode('utf-8'))
            if len(payload) > 1 and payload[1]:
                for entry in payload[1]:
                    iso = entry.get('countryiso3code')
                    val = entry.get('value')
                    if iso and val is not None:
                        growth_map[iso] = float(val)
    except Exception as e:
        print(f"  Warning: World Bank API error for {year}: {e}")
    return growth_map

growth_2023 = fetch_wb_growth(2023)
growth_2024 = fetch_wb_growth(2024)
print(f"  Loaded World Bank growth rates: {len(growth_2023)} countries (2023), {len(growth_2024)} countries (2024)")

# 3. Fetch OWID CO2 dataset (from cache or download)
csv_cache_path = os.path.join(SCRIPT_DIR, 'owid-co2-data.csv')
if not os.path.exists(csv_cache_path):
    print("3/4 Downloading OWID CO2 dataset (~14 MB)...")
    url_owid = 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv'
    req_owid = urllib.request.Request(url_owid, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_owid, timeout=60) as resp_owid:
        with open(csv_cache_path, 'wb') as f_out:
            f_out.write(resp_owid.read())
else:
    print("3/4 Reading cached OWID CO2 dataset...")

with open(csv_cache_path, 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

# Historical range starting from first year with >= 100 complete countries (1980) up to latest (2024)
MIN_YEAR = 1980
MAX_YEAR = 2024

# First pass: map 2022 GDP per country to project 2023 and 2024 GDP
gdp_2022_map = {}
for r in rows:
    iso = r['iso_code']
    if len(iso) == 3 and not iso.startswith('OWID') and r['year'] == '2022' and r['gdp']:
        try:
            gdp_2022_map[iso] = float(r['gdp'])
        except ValueError:
            pass

countries = {}

for r in rows:
    iso = r['iso_code']
    if len(iso) != 3 or iso.startswith('OWID'):
        continue

    try:
        year = int(r['year'])
    except ValueError:
        continue

    if year < MIN_YEAR or year > MAX_YEAR:
        continue

    # Extract raw fields
    pop = float(r['population']) if r['population'] else None
    gdp = float(r['gdp']) if r['gdp'] else None
    e_gdp = float(r['energy_per_gdp']) if r['energy_per_gdp'] else None
    primary_e = float(r['primary_energy_consumption']) if r['primary_energy_consumption'] else None
    e_pc = float(r['energy_per_capita']) if r['energy_per_capita'] else None
    co2_e = float(r['co2_per_unit_energy']) if r['co2_per_unit_energy'] else None
    co2 = float(r['co2']) if r['co2'] else None
    co2_pc = float(r['co2_per_capita']) if r['co2_per_capita'] else None

    # Derive missing GDP for 2023 & 2024 using World Bank annual real GDP growth rate
    if gdp is None and iso in gdp_2022_map:
        if year == 2023 and iso in growth_2023:
            gdp = gdp_2022_map[iso] * (1.0 + growth_2023[iso] / 100.0)
        elif year == 2024 and iso in growth_2023 and iso in growth_2024:
            gdp = gdp_2022_map[iso] * (1.0 + growth_2023[iso] / 100.0) * (1.0 + growth_2024[iso] / 100.0)

    # Need valid population and GDP for X
    if not (pop and gdp and pop > 0 and gdp > 0):
        continue

    gdp_pc = gdp / pop

    # Calculate Y (Energy / GDP in kWh/$)
    y_val = e_gdp
    if y_val is None and primary_e and gdp > 0:
        # primary_e is in TWh (1 TWh = 10^9 kWh)
        y_val = (primary_e * 1e9) / gdp
    elif y_val is None and e_pc and gdp_pc > 0:
        # energy_per_capita (kWh/hab) / gdp_per_capita ($/hab) = kWh/$
        y_val = e_pc / gdp_pc

    if not y_val or y_val <= 0:
        continue

    # Calculate Z (CO2 / Energy in g CO2 / kWh)
    z_val = co2_e
    if z_val is None and co2 and primary_e and primary_e > 0:
        # co2 in Mt (10^12 g) / primary_e in TWh (10^9 kWh) = 1000 * co2 / primary_e
        z_val = (co2 * 1e3) / primary_e
    elif z_val is None and co2_pc and e_pc and e_pc > 0:
        # co2_pc in tonnes (10^6 g) / energy_per_capita in kWh = 10^6 * co2_pc / e_pc
        z_val = (co2_pc * 1e6) / e_pc

    if not z_val or z_val <= 0:
        continue

    # Calculate Total CO2 (Mt)
    if co2 is None:
        if co2_pc is not None:
            co2 = (co2_pc * pop) / 1e6
        else:
            # Kaya Identity: CO2 (g) = POP * (GDP/POP) * (E/GDP) * (CO2/E)
            # CO2 (Mt) = CO2(g) / 10^12
            co2 = (pop * gdp_pc * y_val * z_val) / 1e12

    # Calculate CO2 per capita (tonnes/person)
    if co2_pc is None:
        if co2 is not None and pop > 0:
            co2_pc = (co2 * 1e6) / pop
        else:
            co2_pc = (gdp_pc * y_val * z_val) / 1e6

    if co2 is None or co2 < 0 or co2_pc is None or co2_pc < 0:
        continue

    # Initialize country metadata entry if not already present
    if iso not in countries:
        meta = geo_info.get(iso, {
            'name_en': r.get('country', iso),
            'name_fr': r.get('country', iso),
            'region': 'Autre',
            'region_fr': 'Autre',
            'flag': '🌐'
        })
        countries[iso] = {
            'iso': iso,
            'name': meta['name_fr'],
            'name_en': meta['name_en'] or r.get('country', iso),
            'region': meta['region_fr'],
            'region_en': meta['region'],
            'flag': meta['flag'],
            'data': {}
        }

    countries[iso]['data'][str(year)] = {
        'x': round(gdp_pc, 1),           # PIB / POP ($ / hab)
        'y': round(y_val, 3),            # E / PIB (kWh / $)
        'z': round(z_val, 1),            # CO2 / E (g CO2 / kWh)
        'pop': int(pop),                 # POP (habitants)
        'co2_pc': round(co2_pc, 2),      # CO2 / POP (tonnes / hab)
        'co2': round(co2, 2)             # CO2 total (Mt CO2)
    }

# Keep only countries that have at least 1 valid year of data
valid_countries = [
    c for c in countries.values()
    if len(c['data']) > 0
]

# Sort alphabetically by French name
valid_countries.sort(key=lambda c: c['name'])

# Global min/max ranges for scaling and UI
all_x = [d['x'] for c in valid_countries for d in c['data'].values()]
all_y = [d['y'] for c in valid_countries for d in c['data'].values()]
all_z = [d['z'] for c in valid_countries for d in c['data'].values()]
all_pop = [d['pop'] for c in valid_countries for d in c['data'].values()]
all_co2_pc = [d['co2_pc'] for c in valid_countries for d in c['data'].values()]
all_co2 = [d['co2'] for c in valid_countries for d in c['data'].values()]

metadata = {
    'updated': '2026',
    'source': 'Our World in Data (OWID) & World Bank',
    'min_year': MIN_YEAR,
    'max_year': MAX_YEAR,
    'default_year': 1980,
    'countries_count': len(valid_countries),
    'ranges': {
        'x': {'min': min(all_x), 'max': max(all_x), 'unit': '$/hab', 'label': 'PIB par habitant'},
        'y': {'min': min(all_y), 'max': max(all_y), 'unit': 'kWh/$', 'label': 'Intensité énergétique du PIB'},
        'z': {'min': min(all_z), 'max': max(all_z), 'unit': 'g CO₂/kWh', 'label': 'Intensité carbone de l’énergie'},
        'pop': {'min': min(all_pop), 'max': max(all_pop), 'unit': 'habitants', 'label': 'Population'},
        'co2_pc': {'min': min(all_co2_pc), 'max': max(all_co2_pc), 'unit': 't CO₂/hab', 'label': 'Émissions CO₂ par habitant'},
        'co2': {'min': min(all_co2), 'max': max(all_co2), 'unit': 'Mt CO₂', 'label': 'Émissions CO₂ totales'}
    },
    'continents': ['Afrique', 'Amériques', 'Asie', 'Europe', 'Océanie']
}

output_payload = {
    'metadata': metadata,
    'countries': valid_countries
}

# 4. Save output files
print(f"4/4 Saving {len(valid_countries)} countries data spanning {MIN_YEAR} to {MAX_YEAR}...")
json_path = os.path.join(DATA_DIR, 'kaya_data.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(output_payload, f, ensure_ascii=False, separators=(',', ':'))

js_path = os.path.join(DATA_DIR, 'kaya_data.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write('/* Kaya Identity Dataset - Our World in Data & World Bank */\n')
    f.write('window.KAYA_DATA = ')
    json.dump(output_payload, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')

json_size_kb = os.path.getsize(json_path) / 1024
print(f"Done! Successfully generated:\n  -> {json_path} ({json_size_kb:.1f} KB)\n  -> {js_path}")
