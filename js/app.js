/**
 * Kaya 3D - Visualisation 3D de l'Identité de Kaya
 * Based on Our World in Data (OWID) and Three.js
 */

(function () {
  'use strict';

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
    year: 2022,
    metric: 'pop',       // 'pop' | 'co2_pc' | 'co2'
    scaleMode: 'log',    // 'log' | 'linear'
    isPlaying: false,
    selectedCountry: null,
    hoveredCountry: null,
    activeContinents: new Set(['Afrique', 'Amériques', 'Asie', 'Europe', 'Océanie']),
    boxSize: 80,         // 3D bounding box dimension
    animationTimer: null
  };

  // Three.js variables
  let scene, camera, renderer, controls;
  let countryMeshes = new Map();
  let axesGroup, gridGroup, labelsGroup;
  let raycaster, mouse;
  let container;
  let data = null;

  // DOM Elements
  const tooltip = document.getElementById('tooltip');
  const yearSlider = document.getElementById('year-slider');
  const yearDisplay = document.getElementById('current-year-display');
  const btnPlay = document.getElementById('btn-play');
  const metricSelect = document.getElementById('metric-select');
  const countrySearch = document.getElementById('country-search');
  const datalistCountries = document.getElementById('countries-datalist');
  const btnHelp = document.getElementById('btn-help');
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
        const resp = await fetch('data/kaya_data.json');
        data = await resp.json();
      } catch (err) {
        console.error('Failed to load Kaya data:', err);
        return;
      }
    }

    state.year = data.metadata.default_year || 2022;
    yearSlider.min = data.metadata.min_year;
    yearSlider.max = data.metadata.max_year;
    yearSlider.value = state.year;
    yearDisplay.textContent = state.year;

    setupThreeScene();
    setupAxesAndGrids();
    createCountrySpheres();
    setupEventListeners();
    populateSearchList();

    animate();
  }

  // Three.js Scene Setup
  function setupThreeScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f19);
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.0035);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(90, 80, 110);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 350;
    controls.minDistance = 20;
    controls.target.set(0, 0, 0);

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

  // Create Text Billboards / Sprites
  function createTextSprite(text, color = '#ffffff', fontSize = 32, fontWeight = 'bold') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(24, 6, 1);
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

    // Z Axis line (Cyan/Blue)
    const zPoints = [origin, new THREE.Vector3(-halfS, -halfS, halfS + 6)];
    const zGeo = new THREE.BufferGeometry().setFromPoints(zPoints);
    const zLine = new THREE.Line(zGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3 }));
    axesGroup.add(zLine);

    // Axis Title Sprites
    const xTitle = createTextSprite('X : PIB / habitant ($)', '#f87171', 28);
    xTitle.position.set(halfS + 14, -halfS - 3, -halfS);
    labelsGroup.add(xTitle);

    const yTitle = createTextSprite('Y : Intensité Énergétique (kWh/$)', '#34d399', 28);
    yTitle.position.set(-halfS - 8, halfS + 12, -halfS);
    labelsGroup.add(yTitle);

    const zTitle = createTextSprite('Z : Intensité Carbone (g CO₂/kWh)', '#60a5fa', 28);
    zTitle.position.set(-halfS, -halfS - 3, halfS + 14);
    labelsGroup.add(zTitle);

    // Tick labels based on linear vs log
    createAxisTicks(origin, halfS);
  }

  function createAxisTicks(origin, halfS) {
    const isLog = state.scaleMode === 'log';
    const ranges = data.metadata.ranges;

    // X Ticks
    const xValues = isLog ? [1000, 5000, 20000, 100000] : [1000, 40000, 80000, 140000];
    xValues.forEach(val => {
      const norm = normalizeValue(val, ranges.x.min, ranges.x.max, isLog);
      const posX = -halfS + norm * (halfS * 2);
      const text = val >= 1000 ? `${val / 1000}k$` : `${val}$`;
      const sprite = createTextSprite(text, '#9ca3af', 20, 'normal');
      sprite.scale.set(12, 3, 1);
      sprite.position.set(posX, -halfS - 4, -halfS);
      labelsGroup.add(sprite);
    });

    // Y Ticks (Energy / GDP in kWh/$)
    const yValues = isLog ? [0.2, 0.5, 1.0, 3.0] : [0.2, 1.0, 2.5, 5.0];
    yValues.forEach(val => {
      const norm = normalizeValue(val, ranges.y.min, ranges.y.max, isLog);
      const posY = -halfS + norm * (halfS * 2);
      const sprite = createTextSprite(`${val} kWh`, '#9ca3af', 20, 'normal');
      sprite.scale.set(14, 3, 1);
      sprite.position.set(-halfS - 10, posY, -halfS);
      labelsGroup.add(sprite);
    });

    // Z Ticks (CO2 / Energy in g CO2 / kWh)
    const zValues = isLog ? [60, 150, 300, 600] : [60, 250, 500, 800];
    zValues.forEach(val => {
      const norm = normalizeValue(val, ranges.z.min, ranges.z.max, isLog);
      const posZ = -halfS + norm * (halfS * 2);
      const sprite = createTextSprite(`${val} g`, '#9ca3af', 20, 'normal');
      sprite.scale.set(12, 3, 1);
      sprite.position.set(-halfS, -halfS - 4, posZ);
      labelsGroup.add(sprite);
    });
  }

  // Normalize a value between [0, 1]
  function normalizeValue(val, minVal, maxVal, isLog) {
    if (isLog) {
      const safeVal = Math.max(val, 0.001);
      const safeMin = Math.max(minVal, 0.001);
      const safeMax = Math.max(maxVal, safeMin * 1.01);
      const logVal = Math.log10(safeVal);
      const logMin = Math.log10(safeMin);
      const logMax = Math.log10(safeMax);
      return Math.min(Math.max((logVal - logMin) / (logMax - logMin), 0), 1);
    } else {
      return Math.min(Math.max((val - minVal) / (maxVal - minVal), 0), 1);
    }
  }

  // Compute 3D position from country data for a specific year
  function getCountryPosition(countryRecord) {
    const ranges = data.metadata.ranges;
    const isLog = state.scaleMode === 'log';
    const halfS = state.boxSize / 2;

    const normX = normalizeValue(countryRecord.x, ranges.x.min, ranges.x.max, isLog);
    const normY = normalizeValue(countryRecord.y, ranges.y.min, ranges.y.max, isLog);
    const normZ = normalizeValue(countryRecord.z, ranges.z.min, ranges.z.max, isLog);

    return new THREE.Vector3(
      -halfS + normX * state.boxSize,
      -halfS + normY * state.boxSize,
      -halfS + normZ * state.boxSize
    );
  }

  // Compute sphere radius based on selected volume metric:
  // Volume V proportional to value -> Radius r proportional to cbrt(value)
  function getSphereRadius(countryRecord) {
    const metric = state.metric;
    const ranges = data.metadata.ranges[metric];
    const val = countryRecord[metric] || ranges.min;

    const minCbrt = Math.cbrt(ranges.min);
    const maxCbrt = Math.cbrt(ranges.max);
    const valCbrt = Math.cbrt(val);

    const norm = (valCbrt - minCbrt) / (maxCbrt - minCbrt);
    // Radius between 0.9 and 6.5 units
    return 0.9 + Math.max(0, norm) * 5.6;
  }

  // Create country spheres
  function createCountrySpheres() {
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);

    data.countries.forEach(country => {
      const yearData = country.data[state.year] || country.data['2022'];
      if (!yearData) return;

      const colorHex = CONTINENT_COLORS[country.region] || CONTINENT_COLORS['Autre'];

      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.35,
        metalness: 0.15,
        emissive: colorHex,
        emissiveIntensity: 0.08
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      const pos = getCountryPosition(yearData);
      mesh.position.copy(pos);

      const r = getSphereRadius(yearData);
      mesh.scale.set(r, r, r);

      mesh.userData = {
        iso: country.iso,
        name: country.name,
        name_en: country.name_en,
        region: country.region,
        flag: country.flag,
        targetPos: pos.clone(),
        targetScale: r,
        colorHex: colorHex
      };

      scene.add(mesh);
      countryMeshes.set(country.iso, mesh);
    });
  }

  // Update spheres when year, metric or scale changes
  function updateCountrySpheres(immediate = false) {
    const isContinentActive = (region) => state.activeContinents.has(region);

    data.countries.forEach(country => {
      const mesh = countryMeshes.get(country.iso);
      if (!mesh) return;

      const yearData = country.data[state.year];
      const visible = yearData && isContinentActive(country.region);

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

    if (state.hoveredCountry) {
      updateTooltipContent(state.hoveredCountry);
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
  }

  // Raycaster & Interactivity
  function onPointerMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const visibleMeshes = Array.from(countryMeshes.values()).filter(m => m.visible);
    const intersects = raycaster.intersectObjects(visibleMeshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      if (state.hoveredCountry !== hitMesh) {
        resetHover();
        state.hoveredCountry = hitMesh;
        hitMesh.material.emissiveIntensity = 0.55;
        document.body.style.cursor = 'pointer';
      }
      positionTooltip(event.clientX, event.clientY);
      updateTooltipContent(hitMesh);
    } else {
      if (state.hoveredCountry) {
        resetHover();
      }
    }
  }

  function resetHover() {
    if (state.hoveredCountry) {
      state.hoveredCountry.material.emissiveIntensity = 0.08;
      state.hoveredCountry = null;
    }
    tooltip.classList.remove('visible');
    document.body.style.cursor = 'default';
  }

  function onPointerClick() {
    if (state.hoveredCountry) {
      focusOnCountry(state.hoveredCountry.userData.iso);
    }
  }

  function positionTooltip(clientX, clientY) {
    tooltip.style.left = `${clientX}px`;
    tooltip.style.top = `${clientY - 12}px`;
    tooltip.classList.add('visible');
  }

  function updateTooltipContent(mesh) {
    const country = data.countries.find(c => c.iso === mesh.userData.iso);
    if (!country) return;
    const yearData = country.data[state.year];
    if (!yearData) return;

    const flagEl = document.getElementById('tooltip-flag');
    const nameEl = document.getElementById('tooltip-name');
    const continentEl = document.getElementById('tooltip-continent');
    const xValEl = document.getElementById('tooltip-x');
    const yValEl = document.getElementById('tooltip-y');
    const zValEl = document.getElementById('tooltip-z');
    const popValEl = document.getElementById('tooltip-pop');
    const co2PcValEl = document.getElementById('tooltip-co2-pc');
    const co2TotValEl = document.getElementById('tooltip-co2-tot');

    flagEl.textContent = country.flag || '🌐';
    nameEl.textContent = country.name;
    continentEl.textContent = country.region;
    continentEl.style.backgroundColor = `rgba(${hexToRgb(mesh.userData.colorHex)}, 0.25)`;
    continentEl.style.color = `#${mesh.userData.colorHex.toString(16).padStart(6, '0')}`;

    xValEl.textContent = `${yearData.x.toLocaleString('fr-FR')} $/hab`;
    yValEl.textContent = `${yearData.y.toLocaleString('fr-FR')} kWh/$`;
    zValEl.textContent = `${yearData.z.toLocaleString('fr-FR')} g/kWh`;
    popValEl.textContent = yearData.pop.toLocaleString('fr-FR');
    co2PcValEl.textContent = `${yearData.co2_pc.toLocaleString('fr-FR')} t/hab`;
    co2TotValEl.textContent = `${yearData.co2.toLocaleString('fr-FR')} Mt`;
  }

  function hexToRgb(hex) {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return `${r}, ${g}, ${b}`;
  }

  // Focus camera on a country
  function focusOnCountry(iso) {
    const mesh = countryMeshes.get(iso);
    if (!mesh) return;

    controls.target.copy(mesh.position);
    controls.update();

    // Pulse effect
    mesh.material.emissiveIntensity = 0.9;
    setTimeout(() => {
      if (mesh.material) mesh.material.emissiveIntensity = 0.08;
    }, 700);
  }

  // Camera presets
  function setView(viewType) {
    const S = state.boxSize;
    controls.target.set(0, 0, 0);

    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewType);
    });

    switch (viewType) {
      case 'xy':
        // X-Y plane (PIB vs Energy) from Z positive
        camera.position.set(0, 0, S * 1.6);
        break;
      case 'xz':
        // X-Z plane (PIB vs Carbon) from Y positive (top down)
        camera.position.set(0, S * 1.6, 0);
        break;
      case 'yz':
        // Y-Z plane (Energy vs Carbon) from X positive
        camera.position.set(S * 1.6, 0, 0);
        break;
      case '3d':
      default:
        camera.position.set(S * 1.1, S * 1.0, S * 1.3);
        break;
    }
    controls.update();
  }

  // Search autocomplete setup
  function populateSearchList() {
    datalistCountries.innerHTML = '';
    data.countries.forEach(country => {
      const opt = document.createElement('option');
      opt.value = country.name;
      datalistCountries.appendChild(opt);
    });
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
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onPointerClick);

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

    // Scale mode buttons (log vs linear)
    document.querySelectorAll('[data-scale]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.scale;
        if (state.scaleMode === mode) return;
        state.scaleMode = mode;
        document.querySelectorAll('[data-scale]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setupAxesAndGrids();
        updateCountrySpheres();
      });
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

    // Country Search
    countrySearch.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) return;

      const match = data.countries.find(c => 
        c.name.toLowerCase() === q || 
        c.name_en.toLowerCase() === q || 
        c.iso.toLowerCase() === q
      );

      if (match) {
        focusOnCountry(match.iso);
      }
    });

    // Modal Help
    btnHelp.addEventListener('click', () => modalHelp.classList.add('open'));
    modalClose.addEventListener('click', () => modalHelp.classList.remove('open'));
    modalHelp.addEventListener('click', (e) => {
      if (e.target === modalHelp) modalHelp.classList.remove('open');
    });
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
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
