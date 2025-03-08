// --- Helper Functions ---
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRandom(options) {
  let totalWeight = options.reduce((acc, option) => acc + (option.weight || 1), 0);
  let random = Math.random() * totalWeight;
  for (let option of options) {
    let weight = option.weight || 1;
    if (random < weight) return option;
    random -= weight;
  }
  return options[options.length - 1];
}

function toRoman(num) {
  const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
  let roman = "";
  for (let i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

// --- Data Arrays ---
const settlementPrefix = [
  { value: "New", weight: 3 },
  { value: "Old", weight: 1 },
  { value: "Fort", weight: 2 },
  { value: "Port", weight: 2 }
];

const settlementCore = [
  { value: "Hope", weight: 3 },
  { value: "Unity", weight: 2 },
  { value: "Liberty", weight: 1 },
  { value: "Valor", weight: 1 }
];

const settlementSuffix = [
  { value: "Base", weight: 2 },
  { value: "Station", weight: 3 },
  { value: "Outpost", weight: 2 },
  { value: "Haven", weight: 1 }
];

const developmentLevels = [
  { value: 1, weight: 3 },
  { value: 2, weight: 3 },
  { value: 3, weight: 2 },
  { value: 4, weight: 1 },
  { value: 5, weight: 1 }
];

const governments = [
  { value: "Democracy", weight: 3 },
  { value: "Republic", weight: 2 },
  { value: "Autocracy", weight: 1 },
  { value: "Collective", weight: 1 }
];

const jobTitles = [
  { value: "Mayor", weight: 3 },
  { value: "Governor", weight: 2 },
  { value: "Prefect", weight: 1 },
  { value: "Administrator", weight: 1 }
];

const firstNamePrefixes = ["Al", "Be", "Cor", "Dan", "El"];
const firstNameSuffixes = ["ton", "rick", "fred", "drew", "son"];
const lastNamePrefixes = ["Mc", "Van", "De", "O'"];
const lastNameSuffixes = ["Smith", "Jones", "Brown", "Taylor"];

const settlementConditions = [
  "Radiation",
  "Severe Weather",
  "Resource Shortage",
  "Trade Disruptions"
];

const poiSettlement = [
  "Ancient Ruins",
  "Secret Bunker",
  "Hidden Laboratory",
  "Abandoned Factory",
  "Smuggler's Cove"
];

const systemConditionsList = [
  "High Solar Activity",
  "Nebula Interference",
  "Space Pirates",
  "Temporal Anomalies",
  "Cosmic Radiation"
];

// Expanded and more granular planet biomes (more grounded, hard scifi)
const planetBiomes = [
  "Arid Rocky Plateau",
  "Icy Salt Flats",
  "Lush Jungle Canopy",
  "Misty Swamp Marshes",
  "Overgrown Megaflora Expanse",
  "Scattered Archipelago",
  "Wind-Swept Steppe",
  "Crumbling Mountain Range",
  "Perpetually Cloud-Covered Realm",
  "Submerged Flooded Basin",
  "Dry Savanna Plains",
  "Glittering Crystal Fields",
  "Deep Canyon Wastes",
  "Rugged Karst Formations",
  "Boreal Taiga Forest",
  "Churning Gas Giant Expanse",
  "Vast Oceanic World",
  "Dense Temperate Forest",
  "Frigid Arctic Tundra",
  "Unstable Volcanic Belt",
  "Expansive Dune Desert",
  "Mild Temperate Zone",
  "Cratered Lunar Surface",
  "Metallic Rocky Outcrop",
  "Dusty Red Expanse",
  "Irradiated Wasteland",
  "Frozen Glacial World",
  "Eroded Plateau",
  "Verdant Highland Meadows",
  "Subterranean Cave World",
  "Acidic Marshlands",
  "Barren Iron World"
];

// Rare exports moved out of the highDev exports list (placeholders removed)
const rareExports = [
  "Quantum Flux Regulators",
  "Dark Matter Conduits",
  "Exotic Particle Synthesizers",
  "Antimatter Containment Units",
  "Neutrino Emitters",
  "Singularity Core Modules",
  "Hyperfine Alloy Components",
  "Subspace Frequency Modulators"
];

// Exports – low and high development arrays
const lowDevExports = [
  "Copper Wiring",
  "Iron Ingots",
  "Aluminum Sheeting",
  "Nickel Ingots",
  "Lead Bullion",
  "Zinc Sheeting",
  "Tin Bullion",
  "Cobalt Powder",
  "Unrefined Titanium Bars",
  "Lithium Batteries",
  "Crude Oil",
  "Refined Petroleum",
  "Natural Gas",
  "Coal",
  "Processed Timber",
  "Cellulose Bulk",
  "Industrial-Grade Glass",
  "Concrete",
  "Steel Bars",
  "High-Carbon Steel Bars",
  "Plastics",
  "Synthetic Rubber",
  "Processed Textiles",
  "Transistors",
  "Sulfur Dust",
  "Fertilizer",
  "Alcohol",
  "Preservatives",
  "Rations",
  "Canned Goods",
  "Ammunition",
  "Explosive Ammunition",
  "Sugar Crates",
  "Salt Blocks",
  "Livestock",
  "Industrial Chemicals",
  "Bandages",
  "Medical Supplies",
  "Simple Circuit Boards",
  "Photovoltaic Cells",
  "Hydraulics",
  "Pure Water Barrels",
  "Basic Machine Parts",
  "Unrefined Rare Earth Minerals",
  "Ceramic Tiling",
  "Raw Bauxite",
  "Power Cells",
  "Handheld Weapons",
  "Armor",
  "Mining Equipment",
  "Agriculture Equipment",
  "Land Vehicles",
  "Slaves"
];

const highDevExports = [
  "U-235 Fuel Rods",
  "Solar Cells",
  "Advanced Processors",
  "Superconducting Wire",
  "Microelectronic Controllers",
  "Zero-Point Batteries",
  "Ship Structural Components",
  "Starship Frame Alloys",
  "Ship Hardpoints",
  "Energy Hardpoint Emitters",
  "Kinetic Launch Tubes",
  "Hardpoint Barrels",
  "Plasma Tubing",
  "Laser Tracking Systems",
  "Autonomous Processors",
  "Plasteel",
  "Axial Components",
  "Starship Fuel",
  "Starship Engines",
  "Coolant Tubing",
  "Combat Exo-Tech",
  "Advanced Handheld Weapons",
  "Drone Assemblies",
  "Cybernetics",
  "Hypercapacity Diodes",
  "EM Spectrum Sensor Nodes",
  "Skip Transmitters",
  "Active Armor Plating",
  "Advanced Medical Supplies",
  "Weapons-Grade Capacitors",
  "Speciality Hardpoint Ammunition",
  "High Quality Ammunition",
  "Liquid Oxygen Tanks",
  "Carbonfiber Frames",
  "Pressurized Sheeting",
  "Robotics Components",
  "Refined Titanium",
  "Structural Nanites",
  "Medical Nanites",
  "Genome Chips",
  "Artificial Organ Packs",
  "Robotic Assistants",
  "Ionizing Gas Canisters",
  "Habitat Components",
  "Shield Generators",
  "Analytics Cores",
  "Cartographic Processors",
  "Gyroscopic Navigators",
  "Advanced AI Cores",
  "Advanced Stimulants"
];

// --- Settlement Generation Function ---
// forcedStation: if true, override suffix to "Station"
function generateSettlementData(forcedStation = false) {
  const prefix = weightedRandom(settlementPrefix).value;
  const core = weightedRandom(settlementCore).value;
  let suffix;
  if (forcedStation) {
    suffix = "Station";
  } else {
    suffix = weightedRandom(settlementSuffix).value;
  }
  const name = prefix + " " + core + " " + suffix;
  const development = weightedRandom(developmentLevels).value;
  const isStation = suffix === "Station";
  const maxPop = isStation ? 100 : Math.min(1000 * development, 10000);
  const population = randomInt(20, maxPop);
  const government = weightedRandom(governments).value;
  const jobTitle = weightedRandom(jobTitles).value;
  const firstName =
    weightedRandom(firstNamePrefixes) + weightedRandom(firstNameSuffixes);
  const lastName =
    weightedRandom(lastNamePrefixes) + weightedRandom(lastNameSuffixes);
  const importantFigure = `${jobTitle} ${firstName} ${lastName}`;

  // --- New Export Generation Logic ---
  // Always generate exactly 5 exports, initially all chosen from lowDevExports.
  const numExports = 5;
  let exportsGenerated = [];
  let lowDevPool = lowDevExports.slice();
  lowDevPool.sort(() => Math.random() - 0.5);
  exportsGenerated = lowDevPool.slice(0, numExports);
  // For each 2 development levels, replace one export with a highDev export.
  const numReplacements = Math.floor(development / 2);
  for (let i = 0; i < numReplacements; i++) {
    let highDev = highDevExports[randomInt(0, highDevExports.length - 1)];
    // 10% chance to replace the highDev export with a rare export from our new rareExports list.
    if (Math.random() < 0.1) {
      highDev = rareExports[randomInt(0, rareExports.length - 1)];
    }
    exportsGenerated[i] = highDev;
  }

  // Make settlement conditions a bit rarer.
  const condCount = randomInt(0, 1);
  let conds = settlementConditions
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, condCount);
  const poiCount = randomInt(0, 5);
  let poi = poiSettlement
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, poiCount);

  // Generate military data for this settlement.
  const military = generateMilitaryData(population, forcedStation);

  return {
    name,
    development,
    population,
    government,
    importantFigure,
    exports: exportsGenerated,
    conditions: conds,
    pointsOfInterest: poi,
    military
  };
}

// --- Military Generation ---
// Generates military data based on population and whether the settlement is forced to be a Station.
function generateMilitaryData(population, forcedStation) {
  // Soldiers: roughly 5-15% of the population.
  const minSoldiers = Math.floor(population * 0.05);
  const maxSoldiers = Math.floor(population * 0.15);
  const soldiers = randomInt(minSoldiers, maxSoldiers);

  // Armored vehicles: roughly 1 vehicle per 20-40 soldiers (at least 1).
  const minVehicles = Math.max(1, Math.floor(soldiers / 40));
  const maxVehicles = Math.max(1, Math.floor(soldiers / 20));
  const armoredVehicles = randomInt(minVehicles, maxVehicles);

  // Ships: Ships are super rare.
  // If forcedStation, minimum 2 ships; if population >= 1000, 1-3 ships; otherwise, 0.
  let totalShips = 0;
  if (forcedStation) {
    totalShips = randomInt(2, 6);
  } else if (population >= 1000) {
    totalShips = randomInt(1, 4);
  } else {
    totalShips = 0;
  }

  // Distribute totalShips among types.
  const shipTypes = [
    { value: "Fighter", weight: 5 },
    { value: "Gunship", weight: 3 },
    { value: "Frigate", weight: 1 },
    { value: "Cruiser", weight: 0.2 }
  ];
  let ships = { Fighter: 0, Gunship: 0, Frigate: 0, Cruiser: 0 };
  for (let i = 0; i < totalShips; i++) {
    let type = weightedRandom(shipTypes).value;
    ships[type] += 1;
  }
  return { soldiers, armoredVehicles, ships };
}

// --- Global System Data ---
let systemData = null;

// --- Generate a Six-Digit System Code ---
function generateSystemCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += randomInt(0, 9);
  }
  return code;
}

// --- Generate the entire system ---
function generateSystem() {
  const code = generateSystemCode();
  const sysDesignation = weightedRandom(settlementPrefix).value + " " + weightedRandom(settlementCore).value;
  const systemName = code + " " + sysDesignation;

  // --- Generate Asteroid Belt Information ---
  const asteroidTypes = ["Barren Asteroid Belt", "Asteroid Belt"];
  const chosenAsteroidBelt = asteroidTypes[randomInt(0, asteroidTypes.length - 1)];
  let asteroidBeltInfo = { type: chosenAsteroidBelt };
  if (chosenAsteroidBelt === "Asteroid Belt") {
    const oresList = [
      { value: "iron ore", weight: 10 },
      { value: "high purity crystals", weight: 3 },
      { value: "aluminum ore", weight: 8 },
      { value: "copper ore", weight: 8 },
      { value: "lead ore", weight: 7 },
      { value: "zinc ore", weight: 7 },
      { value: "silver ore", weight: 4 },
      { value: "axial fuel deposits", weight: 2 },
      { value: "rare earth metals", weight: 2 },
      { value: "titanium ore", weight: 5 },
      { value: "gold ore", weight: 2 },
      { value: "cobalt ore", weight: 3 },
      { value: "hydrocarbons", weight: 9 }
    ];
    const numOres = randomInt(1, 3);
    let ores = [];
    for (let i = 0; i < numOres; i++) {
      ores.push(weightedRandom(oresList).value);
    }
    asteroidBeltInfo.ores = ores;
  }

  // Number of planets: now at least 1 and up to 8
  const numPlanets = randomInt(1, 8);
  let planets = [];
  for (let i = 1; i <= numPlanets; i++) {
    const biome = planetBiomes[randomInt(0, planetBiomes.length - 1)];
    planets.push({
      name: sysDesignation + " " + toRoman(i),
      biome,
      settlements: []
    });
  }

  // Number of settlements: 0-10 with >3 being super unlikely.
  const settlementOptions = [];
  for (let i = 0; i <= 10; i++) {
    settlementOptions.push({ value: i, weight: i <= 3 ? 3 : 1 });
  }
  let numSettlements = weightedRandom(settlementOptions).value;
  let forcedStation = false;
  if (numPlanets === 0) {
    numSettlements = 1;
    forcedStation = true;
  }

  let settlements = [];
  for (let i = 0; i < numSettlements; i++) {
    settlements.push(generateSettlementData(forcedStation));
  }
  // Distribute settlements across planets.
  planets.forEach((planet) => (planet.settlements = []));
  settlements.forEach((s) => {
    const idx = randomInt(0, numPlanets - 1);
    planets[idx].settlements.push(s);
  });

  const sysCondCount = randomInt(0, 3);
  let sysConditions = systemConditionsList
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, sysCondCount);

  systemData = {
    systemName,
    planets,
    settlements: numPlanets === 0 ? settlements : null,
    sysConditions,
    asteroidBelt: asteroidBeltInfo,
    systemCode: code // store the six-digit system code
  };

  renderSystem();
}

// Render the entire system.
function renderSystem() {
  const outputDiv = document.getElementById("systemOutput");
  let html = `
      <div class="section">
        <h2>System: ${systemData.systemName}</h2>
        <p>
          <strong>System Conditions:</strong>
          ${systemData.sysConditions.join(", ") || "None"}
        </p>
        <p>
          <strong>Asteroid Belt:</strong>
          ${systemData.asteroidBelt.type}${
    systemData.asteroidBelt.ores
      ? " (Ores: " + systemData.asteroidBelt.ores.join(", ") + ")"
      : ""
  }
        </p>
        <p>
          <strong>Number of Planets:</strong> ${systemData.planets.length}
        </p>
        <p>
          <strong>Number of Settlements:</strong>
          ${
            systemData.planets.length > 0
              ? systemData.planets.reduce(
                  (sum, p) => sum + p.settlements.length,
                  0
                )
              : systemData.settlements.length
          }
        </p>
      </div>`;

  systemData.planets.forEach((planet, pIndex) => {
    html += `
          <div class="section planet">
            <h3>Planet: ${planet.name}</h3>
            <p><strong>Biome:</strong> ${planet.biome}</p>
            <button onclick="regeneratePlanet(${pIndex})">Regenerate Planet</button>`;
    if (planet.settlements.length > 0) {
      planet.settlements.forEach((settlement, sIndex) => {
        html += renderSettlement(settlement, pIndex, sIndex);
      });
    } else {
      html += `<p>No settlements on this planet.</p>`;
    }
    html += `</div>`;
  });
  outputDiv.innerHTML = html;
}

// Render a settlement's details along with its own "Regenerate Settlement" button.
function renderSettlement(settlement, planetIndex, settlementIndex) {
  // Build a string for ships.
  let shipStr = "";
  for (let type in settlement.military.ships) {
    if (settlement.military.ships[type] > 0) {
      shipStr += `${type} x${settlement.military.ships[type]} `;
    }
  }
  if (shipStr === "") shipStr = "None";

  return `
      <div class="settlement" id="settlement-${planetIndex}-${settlementIndex}">
        <div class="settlement-output">
          [Name] ${settlement.name}<br />
          Development: ${settlement.development}<br />
          Population: ${settlement.population}<br />
          Government: ${settlement.government}<br />
          Important Figure: ${settlement.importantFigure}<br />
          Exports: ${settlement.exports.join(", ") || "None"}<br />
          Conditions: ${settlement.conditions.join(", ") || "None"}<br />
          Points of Interest: ${
            settlement.pointsOfInterest.join(", ") || "None"
          }<br />
          Military:<br />
          &nbsp;&nbsp;Soldiers: ${settlement.military.soldiers}<br />
          &nbsp;&nbsp;Armored Vehicles: ${settlement.military.armoredVehicles}<br />
          &nbsp;&nbsp;Ships: ${shipStr}
        </div>
        <button onclick="regenerateSettlement(${planetIndex}, ${settlementIndex})">
          Regenerate Settlement
        </button>
      </div>`;
}

// Regenerate an individual settlement.
function regenerateSettlement(planetIndex, settlementIndex) {
  if (systemData.planets.length > 0) {
    systemData.planets[planetIndex].settlements[settlementIndex] = generateSettlementData();
    renderSystem();
  } else {
    systemData.settlements[settlementIndex] = generateSettlementData(true);
    renderSystem();
  }
}

// Regenerate an entire planet (its biome and all its settlements).
function regeneratePlanet(planetIndex) {
  let planet = systemData.planets[planetIndex];
  planet.biome = planetBiomes[randomInt(0, planetBiomes.length - 1)];
  let numSetts = planet.settlements.length;
  planet.settlements = [];
  for (let i = 0; i < numSetts; i++) {
    planet.settlements.push(generateSettlementData());
  }
  renderSystem();
}

// --- Download System Info as a Plaintext File ---
function generateSystemText() {
  let text = "";
  text += "System: " + systemData.systemName + "\n";
  text += "System Conditions: " + (systemData.sysConditions.join(", ") || "None") + "\n";
  text += "Asteroid Belt: " + systemData.asteroidBelt.type;
  if (systemData.asteroidBelt.ores) {
    text += " (Ores: " + systemData.asteroidBelt.ores.join(", ") + ")";
  }
  text += "\n";
  text += "Number of Planets: " + systemData.planets.length + "\n";
  systemData.planets.forEach((planet, pIndex) => {
    text += "\nPlanet " + (pIndex + 1) + ": " + planet.name + "\n";
    text += "  Biome: " + planet.biome + "\n";
    if (planet.settlements.length > 0) {
      planet.settlements.forEach((settlement, sIndex) => {
        text += "  Settlement " + (sIndex + 1) + ": " + settlement.name + "\n";
        text += "    Development: " + settlement.development + "\n";
        text += "    Population: " + settlement.population + "\n";
        text += "    Government: " + settlement.government + "\n";
        text += "    Important Figure: " + settlement.importantFigure + "\n";
        text += "    Exports: " + (settlement.exports.join(", ") || "None") + "\n";
        text += "    Conditions: " + (settlement.conditions.join(", ") || "None") + "\n";
        text += "    Points of Interest: " + (settlement.pointsOfInterest.join(", ") || "None") + "\n";
        text += "    Military: Soldiers: " + settlement.military.soldiers +
                ", Armored Vehicles: " + settlement.military.armoredVehicles +
                ", Ships: " +
                Object.entries(settlement.military.ships)
                  .filter(([k, v]) => v > 0)
                  .map(([k, v]) => `${k} x${v}`)
                  .join(" ") + "\n";
      });
    } else {
      text += "  No settlements on this planet.\n";
    }
  });
  return text;
}

function downloadSystemInfo() {
  if (!systemData) {
    alert("No system data to download. Please generate a system first.");
    return;
  }
  const text = generateSystemText();
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // Use the six-digit system code as the file name
  a.download = systemData.systemCode + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
