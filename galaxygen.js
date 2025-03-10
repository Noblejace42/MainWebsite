/***********************************************
 * galaxygen.js
 * Hex-based Galaxy Generator Implementation
 ***********************************************/

// A global store of all relevant data
let galaxyData = {
  rows: 10,      // default or update as needed
  cols: 10,      // default or update as needed
  hexSize: 40,   // radius in pixels for each hex
  hexes: [],     // array of hex tile objects
  view: {
    offsetX: 0,
    offsetY: 0,
    scale: 1.0
  }
};

let currentHex = null;  // reference to the hex currently open in the sidebar
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

//----------------------------------------------
// Data Structures
//----------------------------------------------
/*
  Each hex object:
  {
    row: number,
    col: number,
    center: {x, y},
    systemName: string,
    systemText: string,
    edges: [ "none"/"green"/"blue"/"red", ... 6 total ],
    ships: []
  }

  Each ship object:
  {
    name: string,
    orbitRadius: number,
    angle: number,
    speed: number,
    x: number,
    y: number
  }
*/

// Called once the window is loaded
window.onload = function() {
  initializeGalaxyGenerator();
};

//----------------------------------------------
// MAIN INITIALIZATION
//----------------------------------------------
function initializeGalaxyGenerator() {
  const canvas = document.getElementById('galaxyCanvas');

  // Mouse and wheel events for panning/zooming
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('wheel', handleMouseWheel, { passive: false });

  // UI events
  document.getElementById('resetViewBtn').onclick = handleResetView;
  document.getElementById('nodeSearchBtn').onclick = handleNodeSearch;
  document.getElementById('shipSearchBtn').onclick = handleShipSearch;
  document.getElementById('saveMapBtn').onclick = handleSaveMap;
  document.getElementById('loadMapInput').onchange = handleLoadMap;

  document.getElementById('closeSidebarBtn').onclick = closeSidebar;
  document.getElementById('regenerateSystemBtn').onclick = handleRegenerateSystem;
  document.getElementById('addShipBtn').onclick = handleAddShip;

  // Generate the hex grid
  generateHexMap();

  // Start the animation loop
  requestAnimationFrame(animationLoop);
}

//----------------------------------------------
// HEX MAP GENERATION
//----------------------------------------------
function generateHexMap() {
  galaxyData.hexes = [];

  for (let r = 0; r < galaxyData.rows; r++) {
    for (let c = 0; c < galaxyData.cols; c++) {
      let center = hexToPixel(c, r, galaxyData.hexSize);
      let systemText = generateSystemText(); // from systemgen.js
      let systemName = parseFirstLine(systemText);

      let hexTile = {
        row: r,
        col: c,
        center: center,
        systemName: systemName,
        systemText: systemText,
        edges: [ "none","none","none","none","none","none" ],
        ships: []
      };

      // Assign random edges (checking neighbor if it exists)
      assignEdges(hexTile);

      galaxyData.hexes.push(hexTile);
    }
  }
}

//----------------------------------------------
// EDGE ASSIGNMENT
//----------------------------------------------
function assignEdges(hexTile) {
  for (let edgeIndex = 0; edgeIndex < 6; edgeIndex++) {
    // Check if neighbor has already assigned a matching edge
    let neighbor = findNeighborHex(hexTile.row, hexTile.col, edgeIndex);
    if (neighbor) {
      // Opposite edge index
      let oppEdge = (edgeIndex + 3) % 6;
      // If neighbor has something besides "none", copy it
      if (neighbor.edges[oppEdge] !== "none") {
        hexTile.edges[edgeIndex] = neighbor.edges[oppEdge];
        continue;
      }
    }
    // Otherwise random assignment
    hexTile.edges[edgeIndex] = randomEdgeJumpType();
  }
}

function randomEdgeJumpType() {
  // Example probabilities:
  // "none": 60%
  // "green": 25%
  // "blue": 10%
  // "red": 5%
  let r = Math.random();
  if (r < 0.60) return "none";
  else if (r < 0.85) return "green";
  else if (r < 0.95) return "blue";
  else return "red";
}

//----------------------------------------------
// INTERACTIVITY: CLICK DETECTION
//----------------------------------------------
function handleMouseDown(e) {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function handleMouseMove(e) {
  if (!isDragging) return;

  let deltaX = e.clientX - lastMouseX;
  let deltaY = e.clientY - lastMouseY;
  galaxyData.view.offsetX += deltaX;
  galaxyData.view.offsetY += deltaY;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function handleMouseUp(e) {
  isDragging = false;

  // If this was a click (small movement), test for hex
  let dx = e.clientX - lastMouseX;
  let dy = e.clientY - lastMouseY;
  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
    // Convert from screen coords to map coords
    let canvas = document.getElementById('galaxyCanvas');
    let rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left) - galaxyData.view.offsetX;
    let y = (e.clientY - rect.top)  - galaxyData.view.offsetY;
    x /= galaxyData.view.scale;
    y /= galaxyData.view.scale;

    let clickedHex = findHexAtPosition(x, y);
    if (clickedHex) {
      openSidebar(clickedHex);
    }
  }
}

function handleMouseWheel(e) {
  e.preventDefault();
  let oldScale = galaxyData.view.scale;
  let zoomFactor = 1.1;

  if (e.deltaY < 0) {
    galaxyData.view.scale *= zoomFactor;
  } else {
    galaxyData.view.scale /= zoomFactor;
  }

  // Adjust offset so zoom is centered on mouse pointer
  let canvas = document.getElementById('galaxyCanvas');
  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;

  let newScale = galaxyData.view.scale;
  galaxyData.view.offsetX = mouseX - ((mouseX - galaxyData.view.offsetX) * (newScale / oldScale));
  galaxyData.view.offsetY = mouseY - ((mouseY - galaxyData.view.offsetY) * (newScale / oldScale));
}

//----------------------------------------------
// SIDEBAR LOGIC
//----------------------------------------------
function openSidebar(hexTile) {
  currentHex = hexTile;
  document.getElementById('systemTextArea').value = hexTile.systemText;
  document.getElementById('systemDetailsSidebar').style.display = "block";
}

function closeSidebar() {
  // If user edited text, update
  if (currentHex) {
    let newText = document.getElementById('systemTextArea').value;
    currentHex.systemText = newText;
    currentHex.systemName = parseFirstLine(newText);
  }
  document.getElementById('systemDetailsSidebar').style.display = "none";
  currentHex = null;
}

function handleRegenerateSystem() {
  if (!currentHex) return;
  let newText = generateSystemText(); // from systemgen.js
  currentHex.systemText = newText;
  currentHex.systemName = parseFirstLine(newText);
  document.getElementById('systemTextArea').value = newText;
}

function handleAddShip() {
  if (!currentHex) return;
  let shipName = prompt("Enter ship name:") || ("Ship-" + Math.floor(Math.random()*1000));
  let newShip = {
    name: shipName,
    orbitRadius: 15 + Math.random()*15,
    angle: 0,
    speed: 0.01 + Math.random()*0.02,
    x: currentHex.center.x,
    y: currentHex.center.y
  };
  currentHex.ships.push(newShip);
}

//----------------------------------------------
// SEARCH FUNCTIONALITY
//----------------------------------------------
function handleNodeSearch() {
  let query = document.getElementById('nodeSearchInput').value.trim().toLowerCase();
  if (!query) return;
  let foundHex = galaxyData.hexes.find(h => h.systemName.toLowerCase().includes(query));
  if (foundHex) {
    centerViewOn(foundHex.center.x, foundHex.center.y);
    openSidebar(foundHex);
  }
}

function handleShipSearch() {
  let query = document.getElementById('shipSearchInput').value.trim().toLowerCase();
  if (!query) return;
  let found = null;
  let foundHex = null;
  for (let hex of galaxyData.hexes) {
    for (let s of hex.ships) {
      if (s.name.toLowerCase().includes(query)) {
        found = s;
        foundHex = hex;
        break;
      }
    }
    if (found) break;
  }
  if (found && foundHex) {
    centerViewOn(foundHex.center.x, foundHex.center.y);
    openSidebar(foundHex);
  }
}

//----------------------------------------------
// SAVE & LOAD
//----------------------------------------------
function handleSaveMap() {
  let dataStr = JSON.stringify(galaxyData, null, 2);
  let blob = new Blob([dataStr], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement('a');
  a.href = url;
  a.download = "hexMap.json";
  a.click();
  URL.revokeObjectURL(url);
}

function handleLoadMap(e) {
  let file = e.target.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = function(evt) {
    let content = evt.target.result;
    let parsed = JSON.parse(content);
    galaxyData = parsed;
  };
  reader.readAsText(file);
}

//----------------------------------------------
// DRAWING & ANIMATION
//----------------------------------------------
function animationLoop() {
  let canvas = document.getElementById('galaxyCanvas');
  let ctx = canvas.getContext('2d');

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply transformations
  ctx.save();
  ctx.translate(galaxyData.view.offsetX, galaxyData.view.offsetY);
  ctx.scale(galaxyData.view.scale, galaxyData.view.scale);

  // Update ship orbits
  updateShipOrbits();

  // Draw the hex map
  for (let hex of galaxyData.hexes) {
    drawHexTile(ctx, hex);
  }

  ctx.restore();

  requestAnimationFrame(animationLoop);
}

function updateShipOrbits() {
  for (let hex of galaxyData.hexes) {
    for (let ship of hex.ships) {
      ship.angle += ship.speed;
      ship.x = hex.center.x + Math.cos(ship.angle)*ship.orbitRadius;
      ship.y = hex.center.y + Math.sin(ship.angle)*ship.orbitRadius;
    }
  }
}

function drawHexTile(ctx, hex) {
  // Draw the hex boundary
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    let corner = hexCorner(hex.center, galaxyData.hexSize, i);
    if (i === 0) ctx.moveTo(corner.x, corner.y);
    else ctx.lineTo(corner.x, corner.y);
  }
  ctx.closePath();
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw edges according to jump color
  for (let i = 0; i < 6; i++) {
    if (hex.edges[i] !== "none") {
      let c1 = hexCorner(hex.center, galaxyData.hexSize, i);
      let c2 = hexCorner(hex.center, galaxyData.hexSize, (i+1)%6);
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);

      if (hex.edges[i] === "green") ctx.strokeStyle = "green";
      else if (hex.edges[i] === "blue") ctx.strokeStyle = "blue";
      else ctx.strokeStyle = "red";

      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Draw system name in the center
  ctx.fillStyle = "#FFF";
  ctx.font = "12px Arial";
  ctx.fillText(hex.systemName, hex.center.x - 20, hex.center.y+4);

  // Draw ships
  for (let ship of hex.ships) {
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, 3, 0, 2*Math.PI);
    ctx.fillStyle = "#FF9900";
    ctx.fill();
    // Label
    ctx.fillStyle = "#FF9900";
    ctx.fillText(ship.name, ship.x+5, ship.y-5);
  }
}

//----------------------------------------------
// HELPER FUNCTIONS
//----------------------------------------------

// Convert hex row, col to pixel center (simple "odd-r" horizontal layout)
function hexToPixel(col, row, size) {
  let offsetX = (row % 2 === 1) ? size : 0;
  let x = col * (size * 2) + offsetX + size;
  let y = row * (size * 1.5) + size;
  return { x, y };
}

// Return the corner for a given hex center, size, and corner index [0..5]
function hexCorner(center, size, i) {
  // Each corner is 60 degrees apart
  let angleDeg = 60 * i - 30; // offset so flat top is horizontal
  let angleRad = Math.PI / 180 * angleDeg;
  let x = center.x + size * Math.cos(angleRad);
  let y = center.y + size * Math.sin(angleRad);
  return { x, y };
}

// Find the neighbor for a given hex (row, col) + edgeIndex
function findNeighborHex(row, col, edgeIndex) {
  // For "odd-r" horizontal layout:
  // edgeIndex goes 0..5 around
  let offsetsOdd = [
    [ 0, +1],  // E
    [+1, +1],  // SE
    [+1,  0],  // SW
    [ 0, -1],  // W
    [-1,  0],  // NW
    [-1, +1]   // NE
  ];
  let offsetsEven = [
    [ 0, +1],  // E
    [+1,  0],  // SE
    [ 0, -1],  // SW
    [ 0, -1],  // W
    [-1, -1],  // NW
    [ 0,  0]   // NE  (this might need refining)
  ];
  // This is a simplified example. The offsets differ for even vs odd rows.
  // You can refine for your chosen coordinate system.
  
  let rowIsOdd = (row % 2 === 1);
  let offsets = rowIsOdd ? offsetsOdd : offsetsEven;
  let nr = row + offsets[edgeIndex][0];
  let nc = col + offsets[edgeIndex][1];

  // Check bounds
  if (nr < 0 || nr >= galaxyData.rows || nc < 0 || nc >= galaxyData.cols) {
    return null;
  }
  // Find that hex from galaxyData.hexes
  return galaxyData.hexes.find(h => h.row === nr && h.col === nc);
}

// Find which hex was clicked
function findHexAtPosition(px, py) {
  // Simple approach: loop all hexes, check distance from center.
  // For bigger grids, you'd optimize with a hash or transform approach.
  for (let hex of galaxyData.hexes) {
    let dist = distance(px, py, hex.center.x, hex.center.y);
    if (dist < galaxyData.hexSize * 0.9) {
      // Found a likely hex
      return hex;
    }
  }
  return null;
}

function distance(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx*dx + dy*dy);
}

// Center the view on a given coordinate
function centerViewOn(x, y) {
  let canvas = document.getElementById('galaxyCanvas');
  galaxyData.view.offsetX = (canvas.width/2) - x*galaxyData.view.scale;
  galaxyData.view.offsetY = (canvas.height/2) - y*galaxyData.view.scale;
}

// Reset the view
function handleResetView() {
  galaxyData.view.offsetX = 0;
  galaxyData.view.offsetY = 0;
  galaxyData.view.scale = 1.0;
}

// Utility to parse the first line as the system name
function parseFirstLine(text) {
  return text.split('\n')[0] || "";
}
