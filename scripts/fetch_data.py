#!/usr/bin/env python3
"""
Script to download and process Kaya identity indicators from Our World in Data (OWID)
and country metadata (ISO codes, French translations, flags, continents).

Kaya Identity:
CO2 = POP * (GDP / POP) * (Energy / GDP) * (CO2 / Energy)
  - X = GDP / POP (GDP per capita in $ / person)
  - Y = Energy / GDP (Energy intensity of GDP in kWh / $)
  - Z = CO2 / Energy (Carbon intensity of energy in g CO2 / kWh)
  - Volume metrics:
      1. Population (persons)
      2. CO2 emissions per capita (tonnes CO2 / person)
      3. Total CO2 emissions (Million tonnes CO2)
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
print("1/3 Loading country metadata (translations, continents, flags)...")
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

# 2. Fetch OWID CO2 dataset
print("2/3 Downloading OWID CO2 dataset (~14 MB)...")
url_owid = 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv'
req_owid = urllib.request.Request(url_owid, headers={'User-Agent': 'Mozilla/5.0'})
resp_owid = urllib.request.urlopen(req_owid, timeout=45)

reader = csv.reader(io.TextIOWrapper(resp_owid, encoding='utf-8'))
header = next(reader)
col_idx = {name: i for i, name in enumerate(header)}

# Filter years 2000 to 2022
MIN_YEAR = 2000
MAX_YEAR = 2022

countries = {}

for row in reader:
    iso = row[col_idx['iso_code']]
    if len(iso) != 3 or iso.startswith('OWID'):
        continue
    
    year_str = row[col_idx['year']]
    try:
        year = int(year_str)
    except ValueError:
        continue
        
    if year < MIN_YEAR or year > MAX_YEAR:
        continue

    gdp_s = row[col_idx['gdp']]
    pop_s = row[col_idx['population']]
    e_gdp_s = row[col_idx['energy_per_gdp']]
    co2_e_s = row[col_idx['co2_per_unit_energy']]
    co2_s = row[col_idx['co2']]
    co2_pc_s = row[col_idx['co2_per_capita']]

    if gdp_s and pop_s and e_gdp_s and co2_e_s:
        try:
            gdp = float(gdp_s)
            pop = float(pop_s)
            e_gdp = float(e_gdp_s)
            co2_e = float(co2_e_s)
            
            # gdp / pop
            gdp_pc = gdp / pop
            
            # Total CO2 in Mt (million tonnes)
            if co2_s:
                co2 = float(co2_s)
            else:
                # E in TWh = (e_gdp * gdp) / 10^9 if e_gdp in kWh/$ ...
                co2 = (pop * gdp_pc * e_gdp * co2_e) / 1e9
                
            # CO2 per capita in tonnes
            if co2_pc_s:
                co2_pc = float(co2_pc_s)
            else:
                co2_pc = (gdp_pc * e_gdp * co2_e) / 1e6

            if iso not in countries:
                meta = geo_info.get(iso, {
                    'name_en': row[col_idx['country']],
                    'name_fr': row[col_idx['country']],
                    'region': 'Autre',
                    'region_fr': 'Autre',
                    'flag': '🌐'
                })
                countries[iso] = {
                    'iso': iso,
                    'name': meta['name_fr'],
                    'name_en': meta['name_en'] or row[col_idx['country']],
                    'region': meta['region_fr'],
                    'region_en': meta['region'],
                    'flag': meta['flag'],
                    'data': {}
                }

            countries[iso]['data'][str(year)] = {
                'x': round(gdp_pc, 1),           # PIB / POP ($ / hab)
                'y': round(e_gdp, 3),            # E / PIB (kWh / $)
                'z': round(co2_e, 1),            # CO2 / E (g CO2 / kWh)
                'pop': int(pop),                 # POP (habitants)
                'co2_pc': round(co2_pc, 2),      # CO2 / POP (tonnes / hab)
                'co2': round(co2, 2)             # CO2 total (Mt CO2)
            }
        except (ValueError, ZeroDivisionError):
            pass

# Filter countries that have at least 2022 data
valid_countries = [
    c for c in countries.values() 
    if '2022' in c['data']
]

# Sort by name
valid_countries.sort(key=lambda c: c['name'])

# Calculate global min/max for scaling
all_x = [d['x'] for c in valid_countries for d in c['data'].values()]
all_y = [d['y'] for c in valid_countries for d in c['data'].values()]
all_z = [d['z'] for c in valid_countries for d in c['data'].values()]
all_pop = [d['pop'] for c in valid_countries for d in c['data'].values()]
all_co2_pc = [d['co2_pc'] for c in valid_countries for d in c['data'].values()]
all_co2 = [d['co2'] for c in valid_countries for d in c['data'].values()]

metadata = {
    'updated': '2025/2026',
    'source': 'Our World in Data (OWID)',
    'min_year': MIN_YEAR,
    'max_year': MAX_YEAR,
    'default_year': MAX_YEAR,
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

# 3. Output files
print(f"3/3 Saving {len(valid_countries)} countries data...")
json_path = os.path.join(DATA_DIR, 'kaya_data.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(output_payload, f, ensure_ascii=False, separators=(',', ':'))

js_path = os.path.join(DATA_DIR, 'kaya_data.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write('/* Kaya Identity Dataset - Our World in Data */\n')
    f.write('window.KAYA_DATA = ')
    json.dump(output_payload, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')

json_size_kb = os.path.getsize(json_path) / 1024
print(f"Done! Saved:\n  -> {json_path} ({json_size_kb:.1f} KB)\n  -> {js_path}")
