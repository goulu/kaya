# 3D Visualization of the Kaya Identity

Interactive 3D visualization of countries based on the [Kaya Identity](https://en.wikipedia.org/wiki/Kaya_identity).

$$ \displaystyle \mathrm {CO} _{2}=\mathrm {POP} \times {\frac {\mathrm {GDP} }{\mathrm {POP} }}\times {\frac {\mathrm {E} }{\mathrm {GDP} }}\times {\frac {\mathrm {CO} _{2}}{\mathrm {E} }} $$

Each country is represented by a sphere in a 3D coordinate system:

- **X = GDP / POP**: Gross Domestic Product per capita, a measure of average living standards (constant $ / person);
- **Y = E / GDP**: Energy intensity of GDP, the amount of energy used to produce one dollar of economic output (kWh / $);
- **Z = CO2 / E**: Carbon intensity of energy, the quantity of CO2 emitted per unit of energy consumed (g CO₂ / kWh).

The **volume of each sphere** can be dynamically toggled between:
1. **Population** (number of people)
2. **CO₂ emissions per capita** (tonnes of CO₂ / person)
3. **Total CO₂ emissions** (million tonnes of CO₂)

The **color of each sphere** corresponds to its continent:
- 🟡 **Africa** (`#f59e0b`)
- 🔴 **Americas** (`#ef4444`)
- 🟢 **Asia** (`#10b981`)
- 🔵 **Europe** (`#38bdf8`)
- 🟣 **Oceania** (`#a855f7`)

---

## Data Sources

Data is retrieved from official datasets by **Our World in Data (OWID)**:

- GDP per capita: [OWID - GDP per capita](https://ourworldindata.org/gdp-per-capita)
- Energy intensity of GDP: [OWID - Energy intensity of GDP](https://ourworldindata.org/energy-intensity-of-gdp)
- CO2 per unit of energy: [OWID - CO2 per unit of energy](https://ourworldindata.org/co2-per-unit-of-energy)
- Population: [OWID - Population](https://ourworldindata.org/population)

---

## Features

- **3D Scene with Three.js**: Orbital mouse rotation, scroll wheel zoom, right-click pan.
- **Linear scale**: Spatial coordinates directly proportional to the physical Kaya terms.
- **Bilingual Interface (FR / EN)**: Automatically detects browser language and includes a manual toggle button (`FR` / `EN`).
- **Animated Timeline (2000 – 2022)**: Interactive year slider and Play/Pause button to observe the historical trajectories of nations.
- **Hover & Selection**: Detailed glassmorphic tooltip (national flag, GDP/capita, energy intensity, carbon intensity, population, and CO₂ metrics).
- **Country Search & Comparison**: Search one or several countries (or click directly on spheres); searched countries remain fully opaque while non-searched countries fade to semi-transparency for clear visual comparison.
- **Continent Filters**: Toggle individual continents on and off.
- **Camera Presets**: 3D perspective, projection X-Y, projection X-Z, projection Y-Z.

---

## Static Web Page Embedding

This project is 100% static (HTML/CSS/JS, no build step or backend server required).

### 1. Embedding via `<iframe>`

You can embed the visualization into any static website, CMS, or blog (Jekyll, Hugo, WordPress, etc.):

```html
<div style="position: relative; width: 100%; height: 620px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
  <iframe 
    src="index.html?embed=true" 
    style="width: 100%; height: 100%; border: none;"
    title="3D Visualization of the Kaya Identity"
    loading="lazy"
    allowfullscreen>
  </iframe>
</div>
```

The `?embed=true` URL parameter adjusts the UI into a compact layout tailored for iframes and article containers. See [embed_example.html](file:///home/goulu/Documents/develop/kaya/embed_example.html) for a complete example.

### 2. Local Testing

To test the visualization locally:

```bash
# Start a lightweight static server
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## Project Structure

```
kaya/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automated GitHub Pages deployment workflow
├── index.html              # Main interactive 3D visualization page
├── embed_example.html      # Static embed example (iframe demo)
├── README.md               # Project documentation
├── css/
│   └── style.css           # Glassmorphism dark theme and responsive layout
├── js/
│   └── app.js              # Three.js engine, controls, and multilingual logic
├── data/
│   ├── kaya_data.json      # OWID dataset for 164 countries (2000–2022) in JSON
│   └── kaya_data.js        # Bundled dataset (for local file:// execution without CORS)
├── vendor/
│   ├── three.min.js        # Three.js library (r128)
│   └── OrbitControls.js    # Three.js camera controls
└── scripts/
    └── fetch_data.py       # Python script to download and update OWID data
```

---

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

To enable GitHub Pages:
1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Every push to the `main` branch will automatically deploy the site to:  
   👉 **`https://goulu.github.io/kaya/`**

---

## Updating Data

To re-fetch and generate fresh data from Our World in Data:

```bash
python3 scripts/fetch_data.py
```