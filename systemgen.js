// --- Helper Functions ---
function weightedRandom(choices) {
  let totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0);
  let randomNum = Math.random() * totalWeight;
  for (let choice of choices) {
    if (randomNum < choice.weight) {
      return choice.value !== undefined ? choice.value : choice.name;
    }
    randomNum -= choice.weight;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Convert integer 1-6 to roman numeral
function toRoman(num) {
  const romans = ["I", "II", "III", "IV", "V", "VI"];
  return romans[num - 1] || num;
}

// Generate a random alphanumeric code (like "AX11B2")
function generateSystemCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  let code = "";
  code += letters.charAt(randomInt(0, letters.length - 1));
  code += letters.charAt(randomInt(0, letters.length - 1));
  code += digits.charAt(randomInt(0, digits.length - 1));
  code += digits.charAt(randomInt(0, digits.length - 1));
  code += letters.charAt(randomInt(0, letters.length - 1));
  code += digits.charAt(randomInt(0, digits.length - 1));
  return code;
}

// --- Data Definitions ---
// Expanded settlement name parts (grounded, with minimal overly “scifi” letters)
const settlementPrefix = [
  { name: "Cor", weight: 1 },
  { name: "Ald", weight: 1 },
  { name: "Nab", weight: 1 },
  { name: "Tar", weight: 1 },
  { name: "Ven", weight: 1 },
  { name: "Lor", weight: 1 },
  { name: "Ryl", weight: 1 },
  { name: "Mar", weight: 1 },
  { name: "Dorn", weight: 1 },
  { name: "Kess", weight: 1 },
  { name: "Vel", weight: 1 },
  { name: "Kael", weight: 1 },
  { name: "Ord", weight: 1 },
  { name: "Mal", weight: 1 },
  { name: "Jed", weight: 1 },
  { name: "Beln", weight: 1 },
  { name: "Cas", weight: 1 },
  { name: "Din", weight: 1 },
  { name: "Eld", weight: 1 },
  { name: "Forn", weight: 1 },
  { name: "Gald", weight: 1 },
  { name: "Hal", weight: 1 },
  { name: "Ish", weight: 1 },
  { name: "Jor", weight: 1 },
  { name: "Kelm", weight: 1 },
  { name: "Lorn", weight: 1 },
  { name: "Merr", weight: 1 },
  { name: "Nol", weight: 1 },
  { name: "Ost", weight: 1 },
  { name: "Per", weight: 1 },
  { name: "Quin", weight: 1 },
  { name: "Rhon", weight: 1 },
  { name: "Sarn", weight: 1 },
  { name: "Thal", weight: 1 },
  { name: "Uld", weight: 1 },
  { name: "Vern", weight: 1 },
  { name: "Wes", weight: 1 },
  { name: "Yor", weight: 1 }
];

const settlementCore = [
  { name: "anta", weight: 1 },
  { name: "osis", weight: 1 },
  { name: "ar", weight: 1 },
  { name: "osa", weight: 1 },
  { name: "ion", weight: 1 },
  { name: "oran", weight: 1 },
  { name: "is", weight: 1 },
  { name: "endra", weight: 1 },
  { name: "era", weight: 1 },
  { name: "elis", weight: 1 },
  { name: "eta", weight: 1 },
  { name: "ora", weight: 1 },
  { name: "ander", weight: 1 },
  { name: "ulia", weight: 1 },
  { name: "onis", weight: 1 },
  { name: "on", weight: 1 },
  { name: "ionis", weight: 1 },
  { name: "arith", weight: 1 },
  { name: "evar", weight: 1 },
  { name: "irum", weight: 1 },
  { name: "enor", weight: 1 },
  { name: "alus", weight: 1 },
  { name: "enus", weight: 1 }
];

const settlementSuffix = [
  { name: "Prime", weight: 1 },
  { name: "Major", weight: 1 },
  { name: "Minor", weight: 1 },
  { name: "Outpost", weight: 1 },
  { name: "Spire", weight: 1 },
  { name: "Haven", weight: 1 },
  { name: "Hold", weight: 1 },
  { name: "Reach", weight: 1 },
  { name: "Gate", weight: 1 },
  { name: "Basin", weight: 1 },
  { name: "Stronghold", weight: 1 },
  { name: "Station", weight: 1 },
  { name: "Anchorage", weight: 1 },
  { name: "Post", weight: 1 },
  { name: "Verge", weight: 1 },
  { name: "Citadel", weight: 1 },
  { name: "Retreat", weight: 1 },
  { name: "Landing", weight: 1 },
  { name: "", weight: 10 },
  { name: "I", weight: 1 },
  { name: "II", weight: 1 },
  { name: "III", weight: 1 },
  { name: "IV", weight: 1 }
];

// Expanded first and last name parts
const firstNamePrefixes = [
  { name: "Xan", weight: 1 },
  { name: "Tal", weight: 1 },
  { name: "Ver", weight: 1 },
  { name: "Mar", weight: 1 },
  { name: "Sel", weight: 1 },
  { name: "Ste", weight: 1 },
  { name: "Kal", weight: 1 },
  { name: "Dal", weight: 1 },
  { name: "Ada", weight: 1 },
  { name: "Hon", weight: 1 },
  { name: "Kag", weight: 1 },
  { name: "Rem", weight: 1 },
  { name: "Em", weight: 1 },
  { name: "Vin", weight: 1 },
  { name: "Wan", weight: 1 },
  { name: "Kry", weight: 1 },
  { name: "Zan", weight: 1 },
  { name: "Mor", weight: 1 },
  { name: "Rex", weight: 1 },
  { name: "Fen", weight: 1 },
  { name: "Tyr", weight: 1 },
  { name: "Zel", weight: 1 },
  { name: "Lor", weight: 1 },
  { name: "Gar", weight: 1 },
  { name: "Vex", weight: 1 },
  { name: "Tor", weight: 1 },
  { name: "Sar", weight: 1 },
  { name: "Jas", weight: 1 },
  { name: "Ren", weight: 1 },
  { name: "Cas", weight: 1 },
  { name: "Ery", weight: 1 },
  { name: "Mal", weight: 1 },
  { name: "Jor", weight: 1 },
  { name: "Vor", weight: 1 },
  { name: "Hal", weight: 1 },
  { name: "Nor", weight: 1 },
  { name: "Syl", weight: 1 },
  { name: "Bex", weight: 1 },
  { name: "Kai", weight: 1 },
  { name: "Dren", weight: 1 },
  { name: "Ard", weight: 1 },
  { name: "Bram", weight: 1 },
  { name: "Ced", weight: 1 },
  { name: "Dac", weight: 1 },
  { name: "Eld", weight: 1 },
  { name: "Fenn", weight: 1 },
  { name: "Gor", weight: 1 },
  { name: "Hend", weight: 1 },
  { name: "Isen", weight: 1 },
  { name: "Jor", weight: 1 },
  { name: "Kell", weight: 1 },
  { name: "Lom", weight: 1 },
  { name: "Merr", weight: 1 },
  { name: "Ner", weight: 1 },
  { name: "Odin", weight: 1 },
  { name: "Perr", weight: 1 },
  { name: "Quen", weight: 1 },
  { name: "Rald", weight: 1 },
  { name: "Sven", weight: 1 },
  { name: "Tren", weight: 1 },
  { name: "Ulric", weight: 1 },
  { name: "Varn", weight: 1 }
];

const firstNameSuffixes = [
  { name: "dor", weight: 1 },
  { name: "en", weight: 1 },
  { name: "ix", weight: 1 },
  { name: "ar", weight: 1 },
  { name: "os", weight: 1 },
  { name: "son", weight: 1 },
  { name: "sen", weight: 1 },
  { name: "dar", weight: 1 },
  { name: "ne", weight: 1 },
  { name: "ily", weight: 1 },
  { name: "ud", weight: 1 },
  { name: "acka", weight: 1 },
  { name: "moran", weight: 1 },
  { name: "endros", weight: 1 },
  { name: "torus", weight: 1 },
  { name: "ton", weight: 1 },
  { name: "dell", weight: 1 },
  { name: "", weight: 5 },
  { name: "ward", weight: 1 },
  { name: "bert", weight: 1 },
  { name: "rick", weight: 1 },
  { name: "ford", weight: 1 },
  { name: "man", weight: 1 },
  { name: "ley", weight: 1 },
  { name: "field", weight: 1 }
];

const lastNamePrefixes = [
  { name: "Xan", weight: 1 },
  { name: "Tal", weight: 1 },
  { name: "Ver", weight: 1 },
  { name: "Mar", weight: 1 },
  { name: "Sel", weight: 1 },
  { name: "Ste", weight: 1 },
  { name: "Kal", weight: 1 },
  { name: "Dal", weight: 1 },
  { name: "Ada", weight: 1 },
  { name: "Hon", weight: 1 },
  { name: "Kag", weight: 1 },
  { name: "Rem", weight: 1 },
  { name: "Em", weight: 1 },
  { name: "Vin", weight: 1 },
  { name: "Wan", weight: 1 },
  { name: "Kry", weight: 1 },
  { name: "Zan", weight: 1 },
  { name: "Mor", weight: 1 },
  { name: "Rex", weight: 1 },
  { name: "Fen", weight: 1 },
  { name: "Tyr", weight: 1 },
  { name: "Zel", weight: 1 },
  { name: "Lor", weight: 1 },
  { name: "Gar", weight: 1 },
  { name: "Vex", weight: 1 },
  { name: "Tor", weight: 1 },
  { name: "Sar", weight: 1 },
  { name: "Jas", weight: 1 },
  { name: "Ren", weight: 1 },
  { name: "Cas", weight: 1 },
  { name: "Ery", weight: 1 },
  { name: "Mal", weight: 1 },
  { name: "Jor", weight: 1 },
  { name: "Vor", weight: 1 },
  { name: "Hal", weight: 1 },
  { name: "Nor", weight: 1 },
  { name: "Syl", weight: 1 },
  { name: "Bex", weight: 1 },
  { name: "Kai", weight: 1 },
  { name: "Dren", weight: 1 },
  { name: "Bram", weight: 1 },
  { name: "Ced", weight: 1 },
  { name: "Dorn", weight: 1 },
  { name: "Evan", weight: 1 },
  { name: "Falk", weight: 1 },
  { name: "Garr", weight: 1 },
  { name: "Holt", weight: 1 },
  { name: "Ivor", weight: 1 },
  { name: "Joss", weight: 1 }
];

const lastNameSuffixes = [
  { name: "dor", weight: 1 },
  { name: "en", weight: 1 },
  { name: "ix", weight: 1 },
  { name: "ar", weight: 1 },
  { name: "os", weight: 1 },
  { name: "son", weight: 1 },
  { name: "sen", weight: 1 },
  { name: "dar", weight: 1 },
  { name: "ne", weight: 1 },
  { name: "ily", weight: 1 },
  { name: "ud", weight: 1 },
  { name: "acka", weight: 1 },
  { name: "moran", weight: 1 },
  { name: "endros", weight: 1 },
  { name: "torus", weight: 1 },
  { name: "ton", weight: 1 },
  { name: "dell", weight: 1 },
  { name: "", weight: 5 },
  { name: "ward", weight: 1 },
  { name: "berg", weight: 1 },
  { name: "stein", weight: 1 },
  { name: "field", weight: 1 },
  { name: "wood", weight: 1 },
  { name: "man", weight: 1 }
];

// Development levels 1–10 (lower numbers are more common)
const developmentLevels = [];
for (let i = 1; i <= 10; i++) {
  developmentLevels.push({ value: i, weight: 11 - i });
}

// Government types
const governments = [
  { name: "Elected Governor", weight: 10 },
  { name: "Corporate Oligarchy", weight: 5 },
  { name: "Military Junta", weight: 5 },
  { name: "Ruling Council", weight: 5 },
  { name: "Feudal Dominion", weight: 3 },
  { name: "Theocracy", weight: 3 },
  { name: "Pirate Den", weight: 5 },
  { name: "Monarchy", weight: 5 },
  { name: "Shadow Government", weight: 1 },
  { name: "Anarchic Gathering", weight: 1 },
  { name: "Puppet Settlement", weight: 1 },
  { name: "Merchant Republic", weight: 5 },
  { name: "Parliamentary Republic", weight: 3 },
  { name: "People's Ruler", weight: 3 }
];

// Important figure name parts
const jobTitles = [
  { name: "Governor", weight: 12 },
  { name: "Commander", weight: 5 },
  { name: "Overseer", weight: 3 },
  { name: "Chancellor", weight: 8 },
  { name: "Director", weight: 8 },
  { name: "Custodian", weight: 5 },
  { name: "Ruler", weight: 5 },
  { name: "Leader", weight: 8 },
  { name: "Sir", weight: 8 },
  { name: "Prime", weight: 5 },
  { name: "Lord", weight: 5 },
  { name: "General", weight: 2 },
  { name: "Trader", weight: 2 },
  { name: "Captain", weight: 3 },
  { name: "Admiral", weight: 3 }
];

// Settlement conditions – made rarer and appended with 10 additional low-impact, grounded conditions
const settlementConditions = [
  "Occupied by a hostile military operation",
  "Cut off from astral trade by means of a blockade",
  "In an exceptionally dangerous environment.",
  "Unusually busy with traders",
  "Undergoing a large construction project",
  "Mobilizing an army for a special military operation",
  "Under siege by a hostile faction",
  "Critically low on an important resource",
  "Holding a massive surplus of an export",
  "Harboring a reputation as a haven for known criminals",
  "Filled with crime and social chaos",
  "Raided by bandits",
  "Suffering from crippling power failures",
  "Constructing new defenses",
  "Hiring mercenaries for jobs",
  "Minor traffic congestion",
  "Occasional supply delays",
  "Subtle energy fluctuations",
  "Outdated infrastructure in need of repair",
  "Aging public facilities",
  "Limited local entertainment options",
  "Small maintenance backlogs",
  "Low-level bureaucratic inefficiencies",
  "Minor cultural disputes",
  "Seasonal weather disruptions"
];

// Points of interest (for settlements)
const poiSettlement = [
  "Orbital Trade Docks",
  "Shipyard",
  "Black Market",
  "Bounty Center",
  "Research Labs",
  "University",
  "Cartography Guild",
  "Archive",
  "Astral Telecomm Array",
  "Cargo Docks",
  "Military Citadel",
  "Mineral Refinery",
  "Advanced Fabricators",
  "Hydroponic Farms",
  "Quarries",
  "Bazaar",
  "Customs and Trade Bureau",
  "Central Bank",
  "Medical Center",
  "Cybernetics Clinic",
  "Genomics Lab",
  "Police Outpost",
  "Barracks Complex",
  "Military Training Grounds",
  "Starship Mechanic",
  "Vehicle Mechanic",
  "Private Hangars",
  "Salvage Yard",
  "Scrap Processing Facility",
  "Fueling Station",
  "Open Land Lots",
  "Casino",
  "Saloon",
  "Trade Guild",
  "Embassy",
  "Government Offices",
  "Legislative Assembly Building",
  "Slums",
  "Luxury District",
  "Holo-Theater",
  "Robotics Foundry",
  "Weapons Testing Center",
  "Museum",
  "Gladiator Arena",
  "Anti-Air Turrets",
  "Observatory",
  "Sniper Nests",
  "Intersystem Courier",
  "Orbital Turrets",
  "Private Estate",
  "Noble's Manor",
  "Corporate Offices",
  "Mercenary Guild",
  "Supply Depot",
  "Outfitter",
  "Artifact Repository",
  "Prison",
  "Temple",
  "Criminal Syndicate Hideout",
  "Defensive Bunkers",
  "Artillery Deployment",
  "Old Battlefield",
  "Outer Wall",
  "Missile Silo",
  "Raider Outpost",
  "Military Academy",
  "Large Generator",
  "Solar Farms",
  "Oil Derricks",
  "Derelict Structure",
  "Tavern",
  "Hydroelectric Dam",
  "River",
  "Lake",
  "Open Farmland",
  "Open Real-Estate"
];

// System conditions (for the entire system)
const systemConditionsList = [
  "Derelict Station",
  "Distress Beacon",
  "Unstable Skip Difraction",
  "Drifting Cargo Pods",
  "Old Navigation Beacon",
  "Inactive Defense Satellite",
  "Ancient Wreckage Field",
  "Volatile Gas Clouds",
  "Filled With Pirates",
  "Radio Jamming", 
  "Busy Travel Route",
  "Gravity Distorting Star",
  "Hidden Asteroid Cache",
  "Long-Dead Ship Graveyard",
  "Fluctuating Power Signature",
  "Unmapped Gravity Well",
  "Neutron Star",
  "Black Hole",
  "Orbital Fueling Station",
  "Orbital Debris Cluster",
  "Residual Weapon Signatures",
  "Rogue Sentinels",
  "Comet Storm",
  "Destroyed Planet",
  "Binary Star",
  "EMP Storms",
  "Many Skip Routes",
  "Strange Asteroids",
  "Frozen Fuel Reserves",
  "Strange Radio Signals",
  "Failed Terraforming Attempt",
  "Ancient Navigation Markers",
  "Long-Inactive Mining Rig",
  "Deep-Space Listening Post",
  "Abandoned Space Station",
  "Fossilized Space Organism",
  "Persistent EMP Interference",
  "Trinary Star",
  "Ancient Battlefield",
  "Invading Fleet",
  "Starship Mercenary Platoon",
  "Under-construction Station",
  "Migrating Deep Space Lifeforms",
  "Mining Guild",
  "Unstable Skip Route",
  "Anomalous Debris",
  "Partially Intact Megastructure",
  "Violent Solar Flares"
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
  const prefix = weightedRandom(settlementPrefix);
  const core = weightedRandom(settlementCore);
  let suffix;
  if (forcedStation) {
    suffix = "Station";
  } else {
    suffix = weightedRandom(settlementSuffix);
  }
  const name = prefix + core + " " + suffix;
  const development = weightedRandom(developmentLevels);
  const isStation = suffix === "Station";
  const maxPop = isStation ? 100 : Math.min(1000 * development, 10000);
  const population = randomInt(20, maxPop);
  const government = weightedRandom(governments);
  const jobTitle = weightedRandom(jobTitles);
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
    { name: "Fighter", weight: 5 },
    { name: "Gunship", weight: 3 },
    { name: "Frigate", weight: 1 },
    { name: "Cruiser", weight: 0.2 }
  ];
  let ships = { Fighter: 0, Gunship: 0, Frigate: 0, Cruiser: 0 };
  for (let i = 0; i < totalShips; i++) {
    let type = weightedRandom(shipTypes);
    ships[type] += 1;
  }
  return { soldiers, armoredVehicles, ships };
}

// --- Global System Data ---
let systemData = null;

// --- Generate the entire system ---
function generateSystem() {
  const code = generateSystemCode();
  const sysDesignation = weightedRandom(settlementPrefix) + weightedRandom(settlementCore);
  const systemName = code + " " + sysDesignation;

  // --- Generate Asteroid Belt Information ---
  const asteroidTypes = ["Barren Asteroid Belt", "Asteroid Belt"];
  const chosenAsteroidBelt = asteroidTypes[randomInt(0, asteroidTypes.length - 1)];
  let asteroidBeltInfo = { type: chosenAsteroidBelt };
  if (chosenAsteroidBelt === "Asteroid Belt") {
    const oresList = [
      { name: "iron ore", weight: 10 },
      { name: "high purity crystals", weight: 3 },
      { name: "aluminum ore", weight: 8 },
      { name: "copper ore", weight: 8 },
      { name: "lead ore", weight: 7 },
      { name: "zinc ore", weight: 7 },
      { name: "silver ore", weight: 4 },
      { name: "axial fuel deposits", weight: 2 },
      { name: "rare earth metals", weight: 2 },
      { name: "titanium ore", weight: 5 },
      { name: "gold ore", weight: 2 },
      { name: "cobalt ore", weight: 3 },
      { name: "hydrocarbons", weight: 9 }
    ];
    const numOres = randomInt(1, 3);
    let ores = [];
    for (let i = 0; i < numOres; i++) {
      ores.push(weightedRandom(oresList));
    }
    asteroidBeltInfo.ores = ores;
  }

  // Number of planets: now at least 1 and up to 8
  const numPlanets = randomInt(0, 8);
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
  let numSettlements = weightedRandom(settlementOptions);
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
    systemCode: code // store the system code for use in the filename
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
  // Use the generated system code for the filename.
  a.download = systemData.systemCode + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
