const LIFEPATHS = {
  // "Refugee", "Slave", etc. can also be starting red squares
  "Starting_1": {
    name: "Red Square #1",
    ageIncrease: 5,
    events: [
      {
        description: "You narrowly escape your homeworld’s destruction.",
        bond: "I still have nightmares of the cataclysm I fled.",
        items: ["Small keepsake from home"],
        skillPoints: 2, // or talents to increase, up to you
        woundChance: 0.1, // 10% chance to roll a wound
      },
      {
        description: "You survived in a refugee camp for years.",
        bond: "I met a lifelong friend in that camp.",
        items: ["Tattered ID papers"],
        skillPoints: 1,
        woundChance: 0.0,
        // If you want different next paths specifically for this event:
        // nextPathsOverride: ["LaborPath", "CrimePath"]
      },
    ],
    // If no event-based branching, these are the default next paths:
    nextPaths: ["WarPath", "LaborPath", "ResearchPath"]
  },

  "WarPath": {
    name: "War Path",
    ageIncrease: 5,
    events: [
      {
        description: "You distinguished yourself in a major battle.",
        bond: "I won the respect of my commanding officer.",
        items: ["Medal of Valor", "Standard Issue Light Pistol"],
        skillPoints: 2,
        woundChance: 0.0,
      },
      {
        description: "A brutal campaign left you scarred—physically or mentally.",
        bond: "I saw horrors I can never forget.",
        items: ["Combat Knife"],
        skillPoints: 1,
        woundChance: 0.3, // 30% chance to roll a wound
      }
    ],
    nextPaths: ["OfficerPath", "DeserterPath"]
  },

  // ...Add more lifepaths (Labor, Crime, etc.) here...
};



/***** lifepath.js *****/

// -- Global State --
let currentAge = 15;
let currentPath = null;     // The key in LIFEPATHS (e.g. "Starting_1", "WarPath", etc.)
let rolledEvent = null;     // The event object once we roll
let pathHistory = [];       // If you want to store the order of paths the user took

// 1. Called by <button onclick="startLifepath()"> in lifepath.html
function startLifepath() {
  currentAge = 15;
  currentPath = null;
  rolledEvent = null;
  pathHistory = [];

  // Show a list of "red square" paths (the real ones from your diagram).
  // For demonstration, let's pick all that start with "Starting_"
  const startKeys = Object.keys(LIFEPATHS).filter(key => key.startsWith("Starting_"));
  
  // Build some HTML to display these starts
  let html = `<h2>Choose Your Starting Lifepath</h2>`;
  startKeys.forEach(key => {
    const pathData = LIFEPATHS[key];
    html += `
      <button onclick="choosePath('${key}')">${pathData.name}</button>
    `;
  });

  document.getElementById("lifepathOutput").innerHTML = html;
}

// 2. Called when user picks a path from the displayed buttons
function choosePath(pathKey) {
  currentPath = pathKey;
  pathHistory.push(pathKey);
  
  // Increase age by the path's standard age increase
  currentAge += LIFEPATHS[currentPath].ageIncrease;

  // Let the user roll an event
  const pathName = LIFEPATHS[currentPath].name;
  let html = `
    <h2>You chose: ${pathName}</h2>
    <p>Current Age: ${currentAge}</p>
    <button onclick="rollEvent()">Roll for Event</button>
  `;
  document.getElementById("lifepathOutput").innerHTML = html;
}

// 3. Roll an event from the chosen path
function rollEvent() {
  const pathData = LIFEPATHS[currentPath];
  if (!pathData || !pathData.events || pathData.events.length === 0) {
    // No events? Then just move on
    proceedToNextPath();
    return;
  }

  // Pick a random event from the array
  const randomIndex = Math.floor(Math.random() * pathData.events.length);
  rolledEvent = pathData.events[randomIndex];

  // Possibly roll a wound if there's a chance
  let woundResult = "";
  if (rolledEvent.woundChance && Math.random() < rolledEvent.woundChance) {
    // For now, just display a message; you could call a separate function to handle wound tables
    woundResult = "<strong>Wound incurred!</strong> (Roll on your Wound Table!)";
  }

  // Display the event details
  let html = `
    <h2>Event Rolled</h2>
    <p><strong>Description:</strong> ${rolledEvent.description}</p>
    <p><strong>Bond:</strong> ${rolledEvent.bond}</p>
    <p><strong>Items:</strong> ${rolledEvent.items.join(", ") || "None"}</p>
    <p><strong>Skill Points (or Talent Points):</strong> ${rolledEvent.skillPoints || 0}</p>
    <p>${woundResult}</p>
    <p>Current Age: ${currentAge}</p>
    <button onclick="proceedToNextPath()">Proceed</button>
  `;
  document.getElementById("lifepathOutput").innerHTML = html;
}

// 4. Move to next path (based on the chosen path’s "nextPaths" or event override)
function proceedToNextPath() {
  const pathData = LIFEPATHS[currentPath];

  // Check if the event itself has a special nextPathsOverride
  const override = rolledEvent && rolledEvent.nextPathsOverride;
  let nextPaths = override ? override : pathData.nextPaths;

  if (!nextPaths || nextPaths.length === 0) {
    // No further paths; lifepath ends
    document.getElementById("lifepathOutput").innerHTML = `
      <h2>Lifepath Complete</h2>
      <p>Final Age: ${currentAge}</p>
      <p>Path History: ${pathHistory.join(" → ")}</p>
      <p><em>Write down your final details on your character sheet!</em></p>
    `;
    return;
  }

  // Display next path options
  let html = `
    <h2>Choose Your Next Path</h2>
    <p>Current Age: ${currentAge}</p>
  `;
  nextPaths.forEach(pathKey => {
    const np = LIFEPATHS[pathKey];
    html += `<button onclick="choosePath('${pathKey}')">${np.name}</button>`;
  });

  document.getElementById("lifepathOutput").innerHTML = html;
}

