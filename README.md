# Visualisation 3D de l'Identité de Kaya

Visualisation interactive 3D de chaque pays selon l'[identité de Kaya](https://fr.wikipedia.org/wiki/Identit%C3%A9_de_Kaya).

$$ \displaystyle \mathrm {CO} _{2}=\mathrm {POP} \times {\frac {\mathrm {PIB} }{\mathrm {POP} }}\times {\frac {\mathrm {E} }{\mathrm {PIB} }}\times {\frac {\mathrm {CO} _{2}}{\mathrm {E} }} $$

Chaque pays est représenté par une sphère aux coordonnées 3D :

- **X = PIB / POP** : produit intérieur brut par habitant, une mesure du niveau de vie moyen ($ constants / hab) ;
- **Y = E / PIB** : intensité énergétique du PIB, la quantité d'énergie utilisée pour produire un dollar de biens ou services (kWh / $) ;
- **Z = CO2 / E** : intensité carbone de l'énergie, la quantité de CO2 émise pour disposer d'une quantité d'énergie donnée (g CO₂ / kWh).

Le **volume de la sphère** peut être choisi dynamiquement entre :
1. **POPulation** (nombre d'habitants)
2. **Émission de CO₂ par habitant** (tonnes de CO₂ / hab)
3. **Émission de CO₂ totale** (millions de tonnes de CO₂)

La **couleur de la sphère** dépend du continent :
- 🟡 **Afrique** (`#f59e0b`)
- 🔴 **Amériques** (`#ef4444`)
- 🟢 **Asie** (`#10b981`)
- 🔵 **Europe** (`#38bdf8`)
- 🟣 **Océanie** (`#a855f7`)

---

## Sources des données

Les données proviennent des séries officielles de **Our World in Data (OWID)** :

- GDP per capita: [OWID - GDP per capita](https://ourworldindata.org/gdp-per-capita)
- Energy intensity of GDP: [OWID - Energy intensity of GDP](https://ourworldindata.org/energy-intensity-of-gdp)
- CO2 per unit of energy: [OWID - CO2 per unit of energy](https://ourworldindata.org/co2-per-unit-of-energy)
- Population: [OWID - Population](https://ourworldindata.org/population)

---

## Fonctionnalités

- **Scène 3D avec Three.js** : rotation orbitale à la souris, zoom molette, pan clic droit.
- **Échelle linéaire** : coordonnées proportionnelles aux composantes physiques de l'identité de Kaya.
- **Ligne temporelle animée (2000 - 2022)** : slider interactif et bouton lecture/pause pour observer l'évolution historique des trajectoires nationales.
- **Survol et sélection** : infobulle glassmorphic détaillée (drapeau, PIB/hab, intensité énergétique, intensité carbone, population, CO₂).
- **Recherche de pays** : autocomplétion pour cibler et zoomer directement sur un pays.
- **Filtres par continent** : activation / désactivation à la volée.
- **Préréglages de caméra** : vue 3D perspective, projection X-Y, projection X-Z, projection Y-Z.

---

## Intégration sur une page web statique

Le projet est conçu pour être 100% statique (HTML/CSS/JS, sans serveur d'application ni compilation requise).

### 1. Intégration via `<iframe>`

Vous pouvez insérer la visualisation dans n'importe quel site ou article statique :

```html
<div style="position: relative; width: 100%; height: 620px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
  <iframe 
    src="index.html?embed=true" 
    style="width: 100%; height: 100%; border: none;"
    title="Visualisation 3D de l'Identité de Kaya"
    loading="lazy"
    allowfullscreen>
  </iframe>
</div>
```

Le paramètre `?embed=true` adapte automatiquement l'interface pour un affichage compact dans un conteneur ou un article de blog. Voir [embed_example.html](file:///home/goulu/Documents/develop/kaya/embed_example.html) pour une démonstration complète.

### 2. Test en local

Pour tester localement la visualisation :

```bash
# Lancer un serveur statique léger
python3 -m http.server 8000
```

Puis ouvrir dans votre navigateur : `http://localhost:8000`

---

## Structure du projet

```
kaya/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Workflow de déploiement automatique sur GitHub Pages
├── index.html              # Page principale de visualisation 3D
├── embed_example.html      # Exemple d'intégration dans une page web statique
├── README.md               # Documentation du projet
├── css/
│   └── style.css           # Thème sombre glassmorphic et responsive
├── js/
│   └── app.js              # Moteur Three.js, contrôles et interactivité
├── data/
│   ├── kaya_data.json      # Données des 164 pays (2000-2022) au format JSON
│   └── kaya_data.js        # Données injectées (support local file:// sans restriction CORS)
├── vendor/
│   ├── three.min.js        # Bibliothèque Three.js (r128)
│   └── OrbitControls.js    # Contrôles de caméra Three.js
└── scripts/
    └── fetch_data.py       # Script d'extraction et de mise à jour des données OWID
```

---

## Déploiement GitHub Pages

Le projet inclut un workflow GitHub Actions automatisé ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

Pour activer la publication sur GitHub Pages :
1. Sur GitHub, rendez-vous dans **Settings** > **Pages** de votre dépôt.
2. Sous **Build and deployment** > **Source**, choisissez **GitHub Actions**.
3. À chaque `push` sur la branche `main`, le site sera automatiquement déployé à l'adresse :  
   👉 **`https://goulu.github.io/kaya/`**

---

## Mise à jour des données

Pour retélécharger et regénérer les données depuis Our World in Data :

```bash
python3 scripts/fetch_data.py
```
    