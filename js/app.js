/**
 * Kaya 3D - Visualisation 3D de l'Identité de Kaya / 3D Visualization of the Kaya Identity
 * Based on Our World in Data (OWID) and Three.js
 */

(function () {
  'use strict';

  // Translations
  const I18N = {
    fr: {
      pageTitle: "Identité de Kaya - Visualisation 3D Interactive",
      pageDesc: "Visualisation 3D interactive de chaque pays selon l'identité de Kaya : PIB par habitant, intensité énergétique et intensité carbone de l'énergie.",
      appTitle: "Identité de Kaya 3D",
      appSubtitle: "Positionnement 3D des pays selon l'équation de Kaya. Rotation à la souris, zoom à la molette.",
      btnHelpTitle: "Explication de l'identité de Kaya",
      btnLangNext: "EN",
      btnLangTitle: "Switch to English",
      volumeLabel: "Volume de la sphère",
      optPop: "Population (habitants)",
      optCo2Pc: "Émissions de CO₂ par habitant (t/hab)",
      optCo2Tot: "Émissions de CO₂ totales (Mt)",
      optConsCo2Tot: "Émissions totales basées sur la consommation (Mt)",
      optConsCo2Pc: "Émissions basées sur la consommation par habitant (t/hab)",
      yearLabel: "Année",
      btnPlayTitle: "Lancer / Pause l'animation temporelle",
      searchLabel: "Rechercher un pays",
      searchPlaceholder: "Ex: France, Chine, Suisse...",
      continentsLabel: "Filtrer par continent",
      continent_Afrique: "Afrique",
      continent_Amériques: "Amériques",
      continent_Asie: "Asie",
      continent_Europe: "Europe",
      continent_Océanie: "Océanie",
      viewsLabel: "Vues de projection",
      view3d: "3D",
      viewXY: "X - Y",
      viewXZ: "X - Z",
      viewYZ: "Y - Z",
      legendTitle: "Axes de l'espace 3D",
      legendDescX: "PIB / habitant",
      legendFormulaX: "(Niveau de vie moyen, $/hab)",
      legendDescY: "Énergie / PIB",
      legendFormulaY: "(Intensité énergétique, kWh/$)",
      legendDescZ: "CO₂ / Énergie",
      legendFormulaZ: "(Intensité carbone, g CO₂/kWh)",
      axisTitleX: "X : PIB / habitant ($)",
      axisTitleY: "Y : Intensité Énergétique (kWh/$)",
      axisTitleZ: "Z : Intensité Carbone (g CO₂/kWh)",
      unitX: "$/hab",
      unitY: "kWh/$",
      unitZ: "g/kWh",
      unitCo2Pc: "t/hab",
      unitCo2Tot: "Mt",
      tooltipPopLabel: "Population :",
      tooltipCo2PcLabel: "CO₂ / habitant :",
      tooltipCo2TotLabel: "CO₂ total :",
      tooltipConsCo2TotLabel: "CO₂ conso. total :",
      tooltipConsCo2PcLabel: "CO₂ conso. / habitant :",
      modalTitle: "L'Identité de Kaya",
      modalP1: "L'<strong>identité de Kaya</strong> relie les émissions mondiales ou nationales de dioxyde de carbone (CO₂) à des facteurs démographiques, économiques et énergétiques :",
      modalPopDesc: "Population humaine du pays ou de la région.",
      modalXDesc: "Produit intérieur brut par habitant, mesure standard du niveau de vie moyen ($ constants).",
      modalYDesc: "Intensité énergétique du PIB : quantité d'énergie nécessaire pour générer un dollar de richesse (kWh / $).",
      modalZDesc: "Intensité carbone du mix énergétique : masse de CO₂ émise par unité d'énergie consommée (g CO₂ / kWh).",
      modalP2: "Remarquez que le produit des 3 coordonnées de l'espace donne les émissions par habitant :",
      modalP3: "Données issues de <a href=\"https://ourworldindata.org\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #60a5fa;\">Our World in Data (OWID)</a>.",
      modalArticleLink: "Voir sur drgoulu.com",
      modalSourceLink: "Code source",
      modalLicense: "Licence MIT",
      btnToggleTitle: "Afficher / masquer les paramètres",
      clearSelection: "Tout effacer",
      removeCountryTitle: "Retirer de la sélection"
    },
    en: {
      pageTitle: "Kaya Identity - 3D Interactive Visualization",
      pageDesc: "Interactive 3D visualization of countries following the Kaya identity: GDP per capita, energy intensity, and carbon intensity of energy.",
      appTitle: "Kaya Identity 3D",
      appSubtitle: "3D positioning of countries according to the Kaya equation. Left drag to rotate, wheel to zoom.",
      btnHelpTitle: "Explanation of the Kaya identity",
      btnLangNext: "FR",
      btnLangTitle: "Passer en Français",
      volumeLabel: "Sphere volume",
      optPop: "Population (people)",
      optCo2Pc: "CO₂ emissions per capita (t/person)",
      optCo2Tot: "Total CO₂ emissions (Mt)",
      optConsCo2Tot: "Total consumption-based CO₂ emissions (Mt)",
      optConsCo2Pc: "Consumption-based CO₂ emissions per capita (t/person)",
      yearLabel: "Year",
      btnPlayTitle: "Play / Pause timeline animation",
      searchLabel: "Search country",
      searchPlaceholder: "Ex: France, China, United States...",
      continentsLabel: "Filter by continent",
      continent_Afrique: "Africa",
      continent_Amériques: "Americas",
      continent_Asie: "Asia",
      continent_Europe: "Europe",
      continent_Océanie: "Oceania",
      viewsLabel: "Projection views",
      view3d: "3D",
      viewXY: "X - Y",
      viewXZ: "X - Z",
      viewYZ: "Y - Z",
      legendTitle: "3D Coordinate Axes",
      legendDescX: "GDP / capita",
      legendFormulaX: "(Living standards, $/person)",
      legendDescY: "Energy / GDP",
      legendFormulaY: "(Energy intensity, kWh/$)",
      legendDescZ: "CO₂ / Energy",
      legendFormulaZ: "(Carbon intensity, g CO₂/kWh)",
      axisTitleX: "X: GDP / capita ($)",
      axisTitleY: "Y: Energy Intensity (kWh/$)",
      axisTitleZ: "Z: Carbon Intensity (g CO₂/kWh)",
      unitX: "$/person",
      unitY: "kWh/$",
      unitZ: "g/kWh",
      unitCo2Pc: "t/person",
      unitCo2Tot: "Mt",
      tooltipPopLabel: "Population:",
      tooltipCo2PcLabel: "CO₂ / capita:",
      tooltipCo2TotLabel: "Total CO₂:",
      tooltipConsCo2TotLabel: "Total consumption CO₂:",
      tooltipConsCo2PcLabel: "Consumption CO₂ / capita:",
      modalTitle: "The Kaya Identity",
      modalP1: "The <strong>Kaya identity</strong> expresses total carbon dioxide (CO₂) emissions as the product of demographic, economic, and energy factors:",
      modalPopDesc: "Human population of the country or region.",
      modalXDesc: "Gross domestic product per capita, a standard metric of living standards (constant $).",
      modalYDesc: "Energy intensity of GDP: amount of energy needed to generate one dollar of GDP (kWh / $).",
      modalZDesc: "Carbon intensity of energy: mass of CO₂ emitted per unit of energy consumed (g CO₂ / kWh).",
      modalP2: "Note that the product of the 3 spatial coordinates equals emissions per capita:",
      modalP3: "Data from <a href=\"https://ourworldindata.org\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #60a5fa;\">Our World in Data (OWID)</a>.",
      modalArticleLink: "View on drgoulu.com",
      modalSourceLink: "Source code",
      modalLicense: "MIT License",
      btnToggleTitle: "Show / hide settings",
      clearSelection: "Clear all",
      removeCountryTitle: "Remove from selection"
    }
  };

  // Detect language: URL param -> localStorage -> browser language
  function detectInitialLanguage() {
    const urlParam = new URLSearchParams(window.location.search).get('lang');
    if (urlParam && (urlParam === 'fr' || urlParam === 'en')) {
      return urlParam;
    }
    const stored = localStorage.getItem('kaya_lang');
    if (stored && (stored === 'fr' || stored === 'en')) {
      return stored;
    }
    const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return browserLang.startsWith('fr') ? 'fr' : 'en';
  }

  // Continent color mapping
  const CONTINENT_COLORS = {
    'Afrique': 0xf59e0b,
    'Amériques': 0xef4444,
    'Asie': 0x10b981,
    'Europe': 0x38bdf8,
    'Océanie': 0xa855f7,
    'Autre': 0x94a3b8
  };

  // State
  const state = {
    lang: detectInitialLanguage(),
    year: 1980,
    metric: 'co2',       // 'pop' | 'co2_pc' | 'co2' | 'cons_co2' | 'cons_co2_pc'
    isPlaying: false,
    selectedCountry: null,
    hoveredCountry: null,
    searchedCountries: new Set(), // Set of ISO codes that stay opaque
    activeContinents: new Set(['Afrique', 'Amériques', 'Asie', 'Europe', 'Océanie']),
    boxSize: 80,         // 3D bounding box dimension
    animationTimer: null
  };

  // Linear scale bounds for 3D axes
  const LINEAR_BOUNDS = {
    x: { min: 0, max: 140000 },  // $/hab
    y: { min: 0, max: 5.0 },     // kWh/$
    z: { min: 0, max: 800 }      // g CO2/kWh
  };

  // Three.js variables
  let scene, camera, renderer, controls;
  let countryMeshes = new Map();
  let worldMesh = null;
  let axesGroup, gridGroup, labelsGroup;
  let raycaster, mouse;
  let container;
  let data = null;
  let cameraAnimation = null;

  // DOM Elements
  const tooltip = document.getElementById('tooltip');
  const yearSlider = document.getElementById('year-slider');
  const yearDisplay = document.getElementById('current-year-display');
  const btnPlay = document.getElementById('btn-play');
  const metricSelect = document.getElementById('metric-select');
  const countrySearch = document.getElementById('country-search');
  const selectedTagsContainer = document.getElementById('selected-countries-tags');
  const datalistCountries = document.getElementById('countries-datalist');
  const btnHelp = document.getElementById('btn-help');
  const btnLang = document.getElementById('btn-lang');
  const modalHelp = document.getElementById('help-modal');
  const modalClose = document.getElementById('modal-close');

  // Detect embed mode
  if (window.location.search.includes('embed=true') || window.location.search.includes('embed=1') || window.self !== window.top) {
    document.body.classList.add('is-embedded');
  }

  // Initial loader
  async function init() {
    container = document.getElementById('canvas-container');

    // Load data from global KAYA_DATA or fetch JSON
    if (window.KAYA_DATA) {
      data = window.KAYA_DATA;
    } else {
      try {
        const resp = await fetch('data/kaya_data.json?v=consumption_co2', { cache: 'no-cache' });
        data = await resp.json();
      } catch (err) {
        console.error('Failed to load Kaya data:', err);
        return;
      }
    }

    state.year = data.metadata.min_year || 1980;
    yearSlider.min = data.metadata.min_year;
    yearSlider.max = data.metadata.max_year;
    yearSlider.value = state.year;
    yearDisplay.textContent = state.year;
    metricSelect.value = state.metric;

    setupThreeScene();
    setupAxesAndGrids();
    createCountrySpheres();
    setupEventListeners();

    // Apply active language to DOM and 3D labels
    applyLanguage(state.lang);

    // Start timeline animation by default
    togglePlay();

    animate();
  }

  // Three.js Scene Setup
  function setupThreeScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f19);
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.0035);

    const w = container && container.clientWidth ? container.clientWidth : window.innerWidth;
    const h = container && container.clientHeight ? container.clientHeight : window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
    camera.position.set(90, 80, 110);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 1.2;
    controls.maxDistance = 500;
    controls.minDistance = 15;
    controls.target.set(0, 0, 0);

    // Cancel programmatic camera transition on manual user interaction
    controls.addEventListener('start', () => {
      cameraAnimation = null;
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(60, 100, 60);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.4);
    dirLight2.position.set(-60, -40, -60);
    scene.add(dirLight2);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    axesGroup = new THREE.Group();
    gridGroup = new THREE.Group();
    labelsGroup = new THREE.Group();

    scene.add(gridGroup);
    scene.add(axesGroup);
    scene.add(labelsGroup);
  }

  // Create Text Billboards / Sprites (doubled size with high-resolution canvas)
  function createTextSprite(text, color = '#ffffff', fontSize = 56, fontWeight = 'bold', scaleX = 48, scaleY = 12) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;

    ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 512, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(scaleX, scaleY, 1);
    return sprite;
  }

  // 3D Bounding Box, Grids and Axes Setup
  function setupAxesAndGrids() {
    // Clear previous
    while (axesGroup.children.length) axesGroup.remove(axesGroup.children[0]);
    while (gridGroup.children.length) gridGroup.remove(gridGroup.children[0]);
    while (labelsGroup.children.length) labelsGroup.remove(labelsGroup.children[0]);

    const S = state.boxSize;
    const halfS = S / 2;

    // Outer bounding frame lines (subtle dark grid box)
    const boxGeo = new THREE.BoxGeometry(S, S, S);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxMat = new THREE.LineBasicMaterial({
      color: 0x1f293d,
      transparent: true,
      opacity: 0.8
    });
    const boxLine = new THREE.LineSegments(boxEdges, boxMat);
    gridGroup.add(boxLine);

    // Floor grid (XZ at Y = -halfS)
    const floorGrid = new THREE.GridHelper(S, 8, 0x374151, 0x1e293b);
    floorGrid.position.set(0, -halfS, 0);
    gridGroup.add(floorGrid);

    // Back wall grid (XY at Z = -halfS)
    const backGrid = new THREE.GridHelper(S, 8, 0x374151, 0x1e293b);
    backGrid.rotation.x = Math.PI / 2;
    backGrid.position.set(0, 0, -halfS);
    gridGroup.add(backGrid);

    // Left wall grid (YZ at X = -halfS)
    const leftGrid = new THREE.GridHelper(S, 8, 0x374151, 0x1e293b);
    leftGrid.rotation.z = Math.PI / 2;
    leftGrid.position.set(-halfS, 0, 0);
    gridGroup.add(leftGrid);

    // Main 3 Primary Axes lines originating at (-halfS, -halfS, -halfS)
    const origin = new THREE.Vector3(-halfS, -halfS, -halfS);

    // X Axis line (Red/Coral)
    const xPoints = [origin, new THREE.Vector3(halfS + 6, -halfS, -halfS)];
    const xGeo = new THREE.BufferGeometry().setFromPoints(xPoints);
    const xLine = new THREE.Line(xGeo, new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 }));
    axesGroup.add(xLine);

    // Y Axis line (Green/Emerald)
    const yPoints = [origin, new THREE.Vector3(-halfS, halfS + 6, -halfS)];
    const yGeo = new THREE.BufferGeometry().setFromPoints(yPoints);
    const yLine = new THREE.Line(yGeo, new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 }));
    axesGroup.add(yLine);

    // Z Axis line (Darker Cobalt Blue)
    const zPoints = [origin, new THREE.Vector3(-halfS, -halfS, halfS + 6)];
    const zGeo = new THREE.BufferGeometry().setFromPoints(zPoints);
    const zLine = new THREE.Line(zGeo, new THREE.LineBasicMaterial({ color: 0x1d4ed8, linewidth: 3 }));
    axesGroup.add(zLine);

    // Render localized titles & ticks
    createAxisLabelsAndTicks(halfS);
  }

  function createAxisLabelsAndTicks(halfS) {
    // Clear previous label sprites
    while (labelsGroup.children.length) labelsGroup.remove(labelsGroup.children[0]);

    const t = I18N[state.lang];

    // Axis Title Sprites (doubled size: 48x12 scale, 56px font)
    const xTitle = createTextSprite(t.axisTitleX, '#f87171', 56, 'bold', 48, 12);
    xTitle.position.set(halfS + 24, -halfS - 5, -halfS);
    labelsGroup.add(xTitle);

    const yTitle = createTextSprite(t.axisTitleY, '#34d399', 56, 'bold', 48, 12);
    yTitle.position.set(-halfS - 14, halfS + 18, -halfS);
    labelsGroup.add(yTitle);

    const zTitle = createTextSprite(t.axisTitleZ, '#2563eb', 56, 'bold', 48, 12);
    zTitle.position.set(-halfS, -halfS - 5, halfS + 24);
    labelsGroup.add(zTitle);

    // X Ticks (PIB/hab in $) - doubled size: 24x6 scale, 40px font
    const xValues = [20000, 40000, 60000, 80000, 100000, 120000];
    xValues.forEach(val => {
      const norm = normalizeValue(val, LINEAR_BOUNDS.x.min, LINEAR_BOUNDS.x.max);
      const posX = -halfS + norm * (halfS * 2);
      const text = `${val / 1000}k$`;
      const sprite = createTextSprite(text, '#9ca3af', 40, 'normal', 24, 6);
      sprite.position.set(posX, -halfS - 6, -halfS);
      labelsGroup.add(sprite);
    });

    // Y Ticks (Energy / GDP in kWh/$) - doubled size: 28x6 scale, 40px font
    const yValues = [1.0, 2.0, 3.0, 4.0, 5.0];
    yValues.forEach(val => {
      const norm = normalizeValue(val, LINEAR_BOUNDS.y.min, LINEAR_BOUNDS.y.max);
      const posY = -halfS + norm * (halfS * 2);
      const sprite = createTextSprite(`${val} kWh`, '#9ca3af', 40, 'normal', 28, 6);
      sprite.position.set(-halfS - 16, posY, -halfS);
      labelsGroup.add(sprite);
    });

    // Z Ticks (CO2 / Energy in g CO2 / kWh) - doubled size: 24x6 scale, 40px font
    const zValues = [200, 400, 600, 800];
    zValues.forEach(val => {
      const norm = normalizeValue(val, LINEAR_BOUNDS.z.min, LINEAR_BOUNDS.z.max);
      const posZ = -halfS + norm * (halfS * 2);
      const sprite = createTextSprite(`${val} g`, '#9ca3af', 40, 'normal', 24, 6);
      sprite.position.set(-halfS, -halfS - 6, posZ);
      labelsGroup.add(sprite);
    });
  }

  // Linear normalization between [0, 1]
  function normalizeValue(val, minVal, maxVal) {
    return Math.min(Math.max((val - minVal) / (maxVal - minVal), 0), 1);
  }

  // Compute 3D position from country data for a specific year (linear scale)
  function getCountryPosition(countryRecord) {
    const halfS = state.boxSize / 2;

    const normX = normalizeValue(countryRecord.x, LINEAR_BOUNDS.x.min, LINEAR_BOUNDS.x.max);
    const normY = normalizeValue(countryRecord.y, LINEAR_BOUNDS.y.min, LINEAR_BOUNDS.y.max);
    const normZ = normalizeValue(countryRecord.z, LINEAR_BOUNDS.z.min, LINEAR_BOUNDS.z.max);

    return new THREE.Vector3(
      -halfS + normX * state.boxSize,
      -halfS + normY * state.boxSize,
      -halfS + normZ * state.boxSize
    );
  }

  // Compute sphere radius based on selected volume metric:
  // Strict linear volume: Volume V is directly proportional to the value (V = k * val)
  // Since V = (4/3) * pi * r^3, radius r is strictly proportional to cbrt(val):
  // r = R_max * (val / maxVal)^(1/3)
  function getSphereRadius(countryRecord) {
    const metric = state.metric;
    const range = data.metadata.ranges[metric];
    const maxVal = range ? range.max : 1;
    const rawVal = countryRecord ? countryRecord[metric] : null;

    // Maximum radius for the country with highest value (China for pop/co2/cons_co2, Qatar/Trinidad for co2_pc/cons_co2_pc)
    const R_max = (metric === 'co2_pc' || metric === 'cons_co2_pc') ? 5.5 : 7.0;

    if (rawVal == null || rawVal <= 0) {
      // If data is unavailable (e.g. consumption data before 1990), show as minimal threshold
      return 0.35;
    }

    // Strict linear volume: V proportional to val => r proportional to cbrt(val)
    const linearR = R_max * Math.cbrt(rawVal / maxVal);

    // Minor minimum threshold (0.35) so tiny islands remain visible and clickable
    return Math.max(0.35, linearR);
  }

  // Create country spheres
  function createCountrySpheres() {
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);

    data.countries.forEach(country => {
      // Find initial data for state.year, or any available year to initialize mesh
      const yearData = country.data[state.year];
      const anyYearData = yearData || Object.values(country.data)[0];
      if (!anyYearData) return;

      const colorHex = CONTINENT_COLORS[country.region] || CONTINENT_COLORS['Autre'];

      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.35,
        metalness: 0.15,
        emissive: colorHex,
        emissiveIntensity: 0.08,
        transparent: true,
        opacity: 1.0,
        depthWrite: true
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      const pos = getCountryPosition(anyYearData);
      mesh.position.copy(pos);

      const r = getSphereRadius(anyYearData);
      mesh.scale.set(r, r, r);

      // Only display the country if data exists for the considered year and continent is active
      const isVisible = Boolean(yearData) && state.activeContinents.has(country.region);
      mesh.visible = isVisible;

      mesh.userData = {
        iso: country.iso,
        name: country.name,
        name_en: country.name_en,
        region: country.region,
        region_en: country.region_en,
        flag: country.flag,
        targetPos: pos.clone(),
        targetScale: r,
        colorHex: colorHex
      };

      scene.add(mesh);
      countryMeshes.set(country.iso, mesh);
    });

    // Create World transparent white bubble (non-selectable global reference)
    if (data.world && data.world.data) {
      const worldGeo = new THREE.SphereGeometry(1, 36, 36);
      const worldMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.15,
        metalness: 0.05,
        transparent: true,
        opacity: 0.20,
        depthWrite: false,
        side: THREE.FrontSide,
        emissive: 0xffffff,
        emissiveIntensity: 0.10
      });
      worldMesh = new THREE.Mesh(worldGeo, worldMat);
      worldMesh.renderOrder = 10;

      // Subtle translucent wireframe overlay
      const worldWireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
        depthWrite: false
      });
      const worldWire = new THREE.Mesh(worldGeo, worldWireMat);
      worldMesh.add(worldWire);

      const wYearData = data.world.data[state.year] || Object.values(data.world.data)[0];
      if (wYearData) {
        const wPos = getCountryPosition(wYearData);
        worldMesh.position.copy(wPos);
        const wR = getSphereRadius(wYearData);
        worldMesh.scale.set(wR, wR, wR);

        worldMesh.userData = {
          isWorld: true,
          iso: 'WLD',
          name: data.world.name || 'Monde',
          name_en: data.world.name_en || 'World',
          region: 'Monde',
          region_en: 'World',
          flag: '🌍',
          targetPos: wPos.clone(),
          targetScale: wR,
          colorHex: 0xffffff
        };

        worldMesh.visible = Boolean(data.world.data[state.year]);
        scene.add(worldMesh);
      }
    }
  }

  // Update spheres when year, metric or active continents change
  function updateCountrySpheres(immediate = false) {
    const isContinentActive = (region) => state.activeContinents.has(region);

    data.countries.forEach(country => {
      const mesh = countryMeshes.get(country.iso);
      if (!mesh) return;

      const yearData = country.data[state.year];
      const visible = Boolean(yearData) && isContinentActive(country.region);

      mesh.visible = visible;
      if (!visible) return;

      const targetPos = getCountryPosition(yearData);
      const targetRadius = getSphereRadius(yearData);

      mesh.userData.targetPos = targetPos;
      mesh.userData.targetScale = targetRadius;

      if (immediate) {
        mesh.position.copy(targetPos);
        mesh.scale.set(targetRadius, targetRadius, targetRadius);
      }
    });

    // Update World transparent bubble
    if (worldMesh && data.world && data.world.data) {
      const wYearData = data.world.data[state.year];
      if (wYearData) {
        worldMesh.visible = true;
        const targetPos = getCountryPosition(wYearData);
        const targetRadius = getSphereRadius(wYearData);
        worldMesh.userData.targetPos = targetPos;
        worldMesh.userData.targetScale = targetRadius;
        if (immediate) {
          worldMesh.position.copy(targetPos);
          worldMesh.scale.set(targetRadius, targetRadius, targetRadius);
        }
      } else {
        worldMesh.visible = false;
      }
    }

    if (state.hoveredCountry) {
      if (!state.hoveredCountry.visible) {
        resetHover();
      } else {
        updateTooltipContent(state.hoveredCountry);
      }
    }
  }

  // Smooth lerp in animation loop
  function animateSpheres() {
    countryMeshes.forEach(mesh => {
      if (!mesh.visible) return;

      mesh.position.lerp(mesh.userData.targetPos, 0.1);
      const currentScale = mesh.scale.x;
      const targetScale = mesh.userData.targetScale;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      mesh.scale.set(newScale, newScale, newScale);
    });

    if (worldMesh && worldMesh.visible) {
      worldMesh.position.lerp(worldMesh.userData.targetPos, 0.1);
      const currentScale = worldMesh.scale.x;
      const targetScale = worldMesh.userData.targetScale;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      worldMesh.scale.set(newScale, newScale, newScale);
    }
  }

  // Opacity and selection management for searched countries
  function updateCountryOpacities() {
    const hasSelection = state.searchedCountries.size > 0;
    countryMeshes.forEach((mesh, iso) => {
      const isSearched = state.searchedCountries.has(iso);
      if (hasSelection) {
        if (isSearched) {
          mesh.material.opacity = 1.0;
          mesh.material.depthWrite = true;
          mesh.material.emissiveIntensity = 0.35;
        } else {
          mesh.material.opacity = 0.18;
          mesh.material.depthWrite = false;
          mesh.material.emissiveIntensity = 0.04;
        }
      } else {
        mesh.material.opacity = 1.0;
        mesh.material.depthWrite = true;
        mesh.material.emissiveIntensity = 0.08;
      }
    });
    renderSelectedTags();
  }

  function renderSelectedTags() {
    if (!selectedTagsContainer) return;
    selectedTagsContainer.innerHTML = '';
    if (state.searchedCountries.size === 0) return;

    const t = I18N[state.lang];
    const isEn = state.lang === 'en';

    state.searchedCountries.forEach(iso => {
      const c = data.countries.find(x => x.iso === iso);
      if (!c) return;

      const name = isEn ? (c.name_en || c.name) : c.name;
      const tag = document.createElement('span');
      tag.className = 'country-tag';
      tag.innerHTML = `<span>${c.flag || '🌐'}</span><span>${name}</span><button type="button" class="tag-remove" data-iso="${iso}" title="${t.removeCountryTitle}">&times;</button>`;
      tag.querySelector('.tag-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        removeSearchedCountry(iso);
      });
      tag.addEventListener('click', () => {
        focusOnCountry(iso);
      });
      selectedTagsContainer.appendChild(tag);
    });

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'btn-clear-tags';
    clearBtn.textContent = t.clearSelection;
    clearBtn.addEventListener('click', () => {
      clearSearchedCountries();
    });
    selectedTagsContainer.appendChild(clearBtn);
  }

  function addSearchedCountry(iso) {
    if (!iso) return;
    state.searchedCountries.add(iso);
    updateCountryOpacities();
    focusOnCountry(iso);
    if (countrySearch) {
      countrySearch.value = '';
    }
  }

  function removeSearchedCountry(iso) {
    state.searchedCountries.delete(iso);
    updateCountryOpacities();
  }

  function clearSearchedCountries() {
    state.searchedCountries.clear();
    updateCountryOpacities();
  }

  // Raycaster & Interactivity
  function onPointerMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Prioritize country spheres
    const visibleMeshes = Array.from(countryMeshes.values()).filter(m => m.visible);
    const intersects = raycaster.intersectObjects(visibleMeshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      if (state.hoveredCountry !== hitMesh) {
        resetHover();
        state.hoveredCountry = hitMesh;
        hitMesh.material.emissiveIntensity = 0.55;
        if (state.searchedCountries.size > 0 && !state.searchedCountries.has(hitMesh.userData.iso)) {
          hitMesh.material.opacity = 0.75;
        }
        document.body.style.cursor = 'pointer';
      }
      positionTooltip(event.clientX, event.clientY);
      updateTooltipContent(hitMesh);
    } else if (worldMesh && worldMesh.visible) {
      // Hovering the World bubble shows its stats but keeps cursor default (non-selectable)
      const worldIntersects = raycaster.intersectObject(worldMesh);
      if (worldIntersects.length > 0) {
        if (state.hoveredCountry !== worldMesh) {
          resetHover();
          state.hoveredCountry = worldMesh;
          worldMesh.material.emissiveIntensity = 0.35;
          document.body.style.cursor = 'default';
        }
        positionTooltip(event.clientX, event.clientY);
        updateTooltipContent(worldMesh);
      } else {
        if (state.hoveredCountry) {
          resetHover();
        }
      }
    } else {
      if (state.hoveredCountry) {
        resetHover();
      }
    }
  }

  function resetHover() {
    if (state.hoveredCountry) {
      if (state.hoveredCountry === worldMesh) {
        worldMesh.material.emissiveIntensity = 0.10;
      } else {
        const iso = state.hoveredCountry.userData.iso;
        const isSearched = state.searchedCountries.has(iso);
        if (state.searchedCountries.size > 0) {
          state.hoveredCountry.material.opacity = isSearched ? 1.0 : 0.18;
          state.hoveredCountry.material.emissiveIntensity = isSearched ? 0.35 : 0.04;
        } else {
          state.hoveredCountry.material.opacity = 1.0;
          state.hoveredCountry.material.emissiveIntensity = 0.08;
        }
      }
      state.hoveredCountry = null;
    }
    tooltip.classList.remove('visible');
    document.body.style.cursor = 'default';
  }

  function positionTooltip(clientX, clientY) {
    tooltip.style.left = `${clientX}px`;
    tooltip.style.top = `${clientY - 12}px`;
    tooltip.classList.add('visible');
  }

  function updateTooltipContent(mesh) {
    let yearData;
    let name;
    let region;
    let flag;
    let colorHex;

    const t = I18N[state.lang];
    const isEn = state.lang === 'en';
    const numLocale = isEn ? 'en-US' : 'fr-FR';

    if (mesh === worldMesh || (mesh && mesh.userData && mesh.userData.isWorld)) {
      if (!data.world || !data.world.data) return;
      yearData = data.world.data[state.year];
      if (!yearData) return;
      name = isEn ? (data.world.name_en || 'World') : (data.world.name || 'Monde');
      region = isEn ? 'Global Total & Average' : 'Total et moyenne mondiale';
      flag = '🌍';
      colorHex = 0xffffff;
    } else {
      const country = data.countries.find(c => c.iso === mesh.userData.iso);
      if (!country) return;
      yearData = country.data[state.year];
      if (!yearData) return;

      name = isEn ? (country.name_en || country.name) : country.name;
      region = isEn ? (country.region_en || country.region) : country.region;
      flag = country.flag || '🌐';
      colorHex = mesh.userData.colorHex;
    }

    const flagEl = document.getElementById('tooltip-flag');
    const nameEl = document.getElementById('tooltip-name');
    const continentEl = document.getElementById('tooltip-continent');
    const xValEl = document.getElementById('tooltip-x');
    const yValEl = document.getElementById('tooltip-y');
    const zValEl = document.getElementById('tooltip-z');
    const popValEl = document.getElementById('tooltip-pop');
    const co2PcValEl = document.getElementById('tooltip-co2-pc');
    const co2TotValEl = document.getElementById('tooltip-co2-tot');
    const consCo2TotValEl = document.getElementById('tooltip-cons-co2-tot');
    const consCo2PcValEl = document.getElementById('tooltip-cons-co2-pc');

    flagEl.textContent = flag;
    nameEl.textContent = name;
    continentEl.textContent = region;
    continentEl.style.backgroundColor = `rgba(${hexToRgb(colorHex)}, 0.25)`;
    continentEl.style.color = `#${colorHex.toString(16).padStart(6, '0')}`;

    xValEl.textContent = `${yearData.x.toLocaleString(numLocale)} ${t.unitX}`;
    yValEl.textContent = `${yearData.y.toLocaleString(numLocale)} ${t.unitY}`;
    zValEl.textContent = `${yearData.z.toLocaleString(numLocale)} ${t.unitZ}`;
    popValEl.textContent = yearData.pop.toLocaleString(numLocale);
    co2PcValEl.textContent = `${yearData.co2_pc.toLocaleString(numLocale)} ${t.unitCo2Pc}`;
    co2TotValEl.textContent = `${yearData.co2.toLocaleString(numLocale)} ${t.unitCo2Tot}`;

    if (consCo2TotValEl) {
      consCo2TotValEl.textContent = (yearData.cons_co2 != null)
        ? `${yearData.cons_co2.toLocaleString(numLocale)} ${t.unitCo2Tot}`
        : (isEn ? 'N/A' : 'N/D');
    }
    if (consCo2PcValEl) {
      consCo2PcValEl.textContent = (yearData.cons_co2_pc != null)
        ? `${yearData.cons_co2_pc.toLocaleString(numLocale)} ${t.unitCo2Pc}`
        : (isEn ? 'N/A' : 'N/D');
    }
  }

  function hexToRgb(hex) {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return `${r}, ${g}, ${b}`;
  }

  // Focus camera on a country
  function focusOnCountry(iso) {
    cameraAnimation = null;
    const mesh = countryMeshes.get(iso);
    if (!mesh || !mesh.visible) return;

    controls.target.copy(mesh.position);
    controls.update();

    // Pulse effect
    mesh.material.emissiveIntensity = 0.9;
    setTimeout(() => {
      if (mesh.material) mesh.material.emissiveIntensity = 0.08;
    }, 700);
  }

  // Easing function for camera animation
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Smooth orbital camera animation
  function startCameraAnimation(destPos, destTarget = new THREE.Vector3(0, 0, 0), duration = 1000) {
    // Reset residual damping momentum
    controls.enableDamping = false;
    controls.update();
    controls.enableDamping = true;

    const startTarget = controls.target.clone();
    const endTarget = destTarget.clone();

    const startOffset = camera.position.clone().sub(startTarget);
    const endOffset = destPos.clone().sub(endTarget);

    const startSpherical = new THREE.Spherical().setFromVector3(startOffset);
    const endSpherical = new THREE.Spherical().setFromVector3(endOffset);

    // Guard phi from gimbal lock singularities
    startSpherical.phi = Math.max(0.0001, Math.min(Math.PI - 0.0001, startSpherical.phi));
    endSpherical.phi = Math.max(0.0001, Math.min(Math.PI - 0.0001, endSpherical.phi));

    // Shortest angular path around azimuth theta
    let dTheta = (endSpherical.theta - startSpherical.theta) % (2 * Math.PI);
    if (dTheta > Math.PI) dTheta -= 2 * Math.PI;
    if (dTheta < -Math.PI) dTheta += 2 * Math.PI;

    cameraAnimation = {
      startTime: performance.now(),
      duration,
      startTarget,
      endTarget,
      startSpherical,
      endSpherical,
      dTheta,
      destPos
    };
  }

  function updateCameraAnimation(now) {
    if (!cameraAnimation) return;

    const elapsed = now - cameraAnimation.startTime;
    const progress = Math.min(elapsed / cameraAnimation.duration, 1);
    const ease = easeInOutCubic(progress);

    const currentTarget = new THREE.Vector3().lerpVectors(
      cameraAnimation.startTarget,
      cameraAnimation.endTarget,
      ease
    );

    const currentRadius = THREE.MathUtils.lerp(
      cameraAnimation.startSpherical.radius,
      cameraAnimation.endSpherical.radius,
      ease
    );

    const currentPhi = THREE.MathUtils.lerp(
      cameraAnimation.startSpherical.phi,
      cameraAnimation.endSpherical.phi,
      ease
    );

    const currentTheta = cameraAnimation.startSpherical.theta + cameraAnimation.dTheta * ease;

    const currentSpherical = new THREE.Spherical(currentRadius, currentPhi, currentTheta);
    const currentOffset = new THREE.Vector3().setFromSpherical(currentSpherical);

    camera.position.copy(currentTarget).add(currentOffset);
    controls.target.copy(currentTarget);
    camera.lookAt(controls.target);

    if (progress >= 1) {
      camera.position.copy(cameraAnimation.destPos);
      controls.target.copy(cameraAnimation.endTarget);
      controls.update();
      cameraAnimation = null;
    }
  }

  // Camera presets
  function setView(viewType) {
    const S = state.boxSize;

    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewType);
    });

    let destPos;
    switch (viewType) {
      case 'xy':
        // X-Y plane (PIB vs Energy) from Z positive
        destPos = new THREE.Vector3(0, 0, S * 1.6);
        break;
      case 'xz':
        // X-Z plane (PIB vs Carbon) from Y positive
        destPos = new THREE.Vector3(0, S * 1.6, 0.001);
        break;
      case 'yz':
        // Y-Z plane (Energy vs Carbon) from X positive
        destPos = new THREE.Vector3(S * 1.6, 0, 0.001);
        break;
      case '3d':
      default:
        destPos = new THREE.Vector3(S * 1.1, S * 1.0, S * 1.3);
        break;
    }

    startCameraAnimation(destPos, new THREE.Vector3(0, 0, 0), 1000);
  }

  // Search autocomplete setup
  function populateSearchList() {
    datalistCountries.innerHTML = '';
    const isEn = state.lang === 'en';
    data.countries.forEach(country => {
      const opt = document.createElement('option');
      opt.value = isEn ? (country.name_en || country.name) : country.name;
      datalistCountries.appendChild(opt);
    });
  }

  // Language management
  function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'fr';
    state.lang = lang;
    localStorage.setItem('kaya_lang', lang);
    document.documentElement.lang = lang;

    const t = I18N[lang];

    // Document head
    document.title = t.pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t.pageDesc;

    // Static text nodes with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // Static HTML nodes with data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    });

    // Titles / tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      if (t[key] !== undefined) {
        el.title = t[key];
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key] !== undefined) {
        el.placeholder = t[key];
      }
    });

    // Language toggle button text and title
    if (btnLang) {
      btnLang.textContent = t.btnLangNext;
      btnLang.title = t.btnLangTitle;
    }

    // Update 3D axis title sprites
    if (labelsGroup) {
      createAxisLabelsAndTicks(state.boxSize / 2);
    }

    // Refresh datalist options in the selected language
    if (data) {
      populateSearchList();
    }

    // Refresh tooltip if visible
    if (state.hoveredCountry) {
      updateTooltipContent(state.hoveredCountry);
    }

    // Refresh selected tags in new language
    renderSelectedTags();
  }

  function toggleLanguage() {
    const nextLang = state.lang === 'fr' ? 'en' : 'fr';
    applyLanguage(nextLang);
  }

  // Year timeline play/pause
  function togglePlay() {
    state.isPlaying = !state.isPlaying;
    btnPlay.innerHTML = state.isPlaying ? '❚❚' : '▶';

    if (state.isPlaying) {
      state.animationTimer = setInterval(() => {
        let nextYear = state.year + 1;
        if (nextYear > data.metadata.max_year) {
          nextYear = data.metadata.min_year;
        }
        setYear(nextYear);
      }, 700);
    } else {
      clearInterval(state.animationTimer);
    }
  }

  function setYear(yr) {
    state.year = yr;
    yearSlider.value = yr;
    yearDisplay.textContent = yr;
    updateCountrySpheres();
  }

  // Event Listeners
  function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);

    let pointerDownPos = { x: 0, y: 0 };
    let isDrag = false;

    renderer.domElement.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      isDrag = false;
    });

    renderer.domElement.addEventListener('pointermove', (e) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 5) {
        isDrag = true;
      }
      onPointerMove(e);
    });

    renderer.domElement.addEventListener('pointerup', () => {
      if (!isDrag && state.hoveredCountry && state.hoveredCountry !== worldMesh) {
        addSearchedCountry(state.hoveredCountry.userData.iso);
      }
    });

    // Language switcher button
    if (btnLang) {
      btnLang.addEventListener('click', toggleLanguage);
    }

    // Year slider
    yearSlider.addEventListener('input', (e) => {
      if (state.isPlaying) togglePlay();
      setYear(parseInt(e.target.value, 10));
    });

    // Play button
    btnPlay.addEventListener('click', togglePlay);

    // Metric select
    metricSelect.addEventListener('change', (e) => {
      state.metric = e.target.value;
      updateCountrySpheres();
    });

    // View buttons
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => setView(btn.dataset.view));
    });

    // Continent filter pills
    document.querySelectorAll('.continent-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const region = pill.dataset.continent;
        if (state.activeContinents.has(region)) {
          if (state.activeContinents.size > 1) {
            state.activeContinents.delete(region);
            pill.classList.remove('active');
          }
        } else {
          state.activeContinents.add(region);
          pill.classList.add('active');
        }
        updateCountrySpheres();
      });
    });

    // Country Search (matches French name, English name, and ISO code)
    countrySearch.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) return;

      const match = data.countries.find(c => 
        (c.name && c.name.toLowerCase() === q) || 
        (c.name_en && c.name_en.toLowerCase() === q) || 
        c.iso.toLowerCase() === q
      );

      if (match) {
        addSearchedCountry(match.iso);
      }
    });

    countrySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = countrySearch.value.trim().toLowerCase();
        if (!q) return;

        const match = data.countries.find(c => 
          (c.name && c.name.toLowerCase() === q) || 
          (c.name_en && c.name_en.toLowerCase() === q) || 
          c.iso.toLowerCase() === q ||
          (c.name && c.name.toLowerCase().startsWith(q)) || 
          (c.name_en && c.name_en.toLowerCase().startsWith(q))
        );

        if (match) {
          addSearchedCountry(match.iso);
        }
      }
    });

    // Modal Help
    btnHelp.addEventListener('click', () => modalHelp.classList.add('open'));
    modalClose.addEventListener('click', () => modalHelp.classList.remove('open'));
    modalHelp.addEventListener('click', (e) => {
      if (e.target === modalHelp) modalHelp.classList.remove('open');
    });

    // ResizeObserver on canvas container
    if (window.ResizeObserver && container) {
      const ro = new ResizeObserver(() => {
        onWindowResize();
      });
      ro.observe(container);
    }
  }

  function onWindowResize() {
    if (!renderer || !camera || !container) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  // Animation Loop
  function animate(timestamp) {
    requestAnimationFrame(animate);

    if (cameraAnimation) {
      updateCameraAnimation(timestamp || performance.now());
    } else {
      controls.update();
    }

    animateSpheres();
    renderer.render(scene, camera);
  }

  // Bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
