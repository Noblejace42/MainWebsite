/* galaxygen.js */
 
// CONFIGURATION VARIABLES
const NUM_HEXES = 500;
const EDGE_COLOR_PROBS = { green: 0.4, blue: 0.4, red: 0.2 }; // adjustable probabilities
const HEX_EDGE_LENGTH = 50; // side length for each hexagon

// For flat-topped hexagons:
// width = 2 * HEX_EDGE_LENGTH, height = sqrt(3) * HEX_EDGE_LENGTH
const hexWidth = 2 * HEX_EDGE_LENGTH;
const hexHeight = Math.sqrt(3) * HEX_EDGE_LENGTH;

// GLOBAL VARIABLES
let canvas, ctx;
let offsetX = 0,
  offsetY = 0,
  scale = 1;
let isDragging = false,
  dragStartX = 0,
  dragStartY = 0;
let hexGrid = []; // array of Hex objects
let activeHex = null; // currently selected hex (system)
let activeStarship = null; // { starship, hex } currently selected

// Hexagon class definition
class Hex {
  constructor(row, col, centerX, centerY) {
    this.row = row;
    this.col = col;
    this.centerX = centerX;
    this.centerY = centerY;
    this.edges = new Array(6); // each edge stores a color ("green", "blue", or "red")
    this.systemName = ""; // generated system name
    this.systemData = null; // structured system data (object)
    this.systemText = ""; // plaintext representation of system data
    this.starships = []; // array of starship objects
  }
}

// Starship class definition
class Starship {
  constructor() {
    this.id = Date.now() + Math.floor(Math.random() * 1000);
    this.name = "Unnamed Ship";
    this.notes = "";
    this.orbitAngle = Math.random() * Math.PI * 2; // radians
  }
}

// INITIALIZATION
window.addEventListener("load", init);
window.addEventListener("resize", resizeCanvas);

function init() {
  canvas = document.getElementById("hexMapCanvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();

  // Generate honeycomb grid
  generateHexGrid();
  drawGrid();

  // Event listeners for panning, zooming, clicking
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);
  canvas.addEventListener("wheel", onWheel);
  window.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("click", onCanvasClick);

  // Control panel: save/load map state
  document.getElementById("saveMap").addEventListener("click", saveMap);
  document.getElementById("loadMap").addEventListener("click", () => {
    document.getElementById("loadInput").click();
  });
  document.getElementById("loadInput").addEventListener("change", loadMap);

  // Right sidebar: system details editing
  document.getElementById("systemEditor").addEventListener("blur", onSystemEditorBlur);
  document.getElementById("regenerateSystem").addEventListener("click", regenerateSystemForActiveHex);

  // Left sidebar: starships editing
  document.getElementById("addStarship").addEventListener("click", addStarshipToActiveHex);
}

// RESIZE CANVAS
function resizeCanvas() {
  const container = document.getElementById("hexMapContainer");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  drawGrid();
}

// Compute vertices for a flat-topped hexagon
function computeVertices(hex) {
  let vertices = [];
  for (let i = 0; i < 6; i++) {
    let angleRad = Math.PI / 180 * (60 * i);
    vertices.push({
      x: hex.centerX + HEX_EDGE_LENGTH * Math.cos(angleRad),
      y: hex.centerY + HEX_EDGE_LENGTH * Math.sin(angleRad)
    });
  }
  return vertices;
}

// GENERATE HEX GRID (honeycomb layout)
function generateHexGrid() {
  hexGrid = [];
  const cols = Math.ceil(Math.sqrt(NUM_HEXES));
  const rows = Math.ceil(NUM_HEXES / cols);

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let centerX = col * (hexWidth * 0.75) + HEX_EDGE_LENGTH;
      let centerY = row * hexHeight + hexHeight / 2;
      if (col % 2 === 1) {
        centerY += hexHeight / 2;
      }
      let hex = new Hex(row, col, centerX, centerY);

      // Set edge colors, sharing with neighbors when applicable
      for (let edge = 0; edge < 6; edge++) {
        let neighbor = getNeighbor(hex, edge);
        if (neighbor && neighbor.edges[oppositeEdge(edge)] !== undefined) {
          hex.edges[edge] = neighbor.edges[oppositeEdge(edge)];
        } else {
          hex.edges[edge] = weightedEdgeColor();
        }
      }

      // Generate system data (using functions from systemgen.js if available)
      if (typeof generateSystemName === "function") {
        hex.systemName = generateSystemName();
      } else {
        hex.systemName = "System" + (hexGrid.length + 1);
      }
      if (typeof generateFullSystem === "function") {
        hex.systemData = generateFullSystem();
      } else {
        hex.systemData = { info: "Full system data for " + hex.systemName };
      }
      // Use plaintext generator from systemgen.js if available
      if (typeof generateSystemText === "function") {
        hex.systemText = generateSystemText(hex.systemData);
      } else {
        hex.systemText = "System: " + hex.systemName + "\n" + JSON.stringify(hex.systemData, null, 2);
      }

      // Initialize starships array as empty
      hex.starships = [];

      hexGrid.push(hex);
      if (hexGrid.length >= NUM_HEXES) break;
    }
    if (hexGrid.length >= NUM_HEXES) break;
  }
}

// DRAW THE GRID
function drawGrid() {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);

  // Draw hexes and their content
  hexGrid.forEach((hex) => {
    drawHex(hex);
  });

  // Draw bisecting lines between neighboring hex centers (using a thicker line for visibility)
  ctx.lineWidth = 2;
  for (let i = 0; i < hexGrid.length; i++) {
    let hex = hexGrid[i];
    for (let edge = 0; edge < 6; edge++) {
      let neighbor = getNeighbor(hex, edge);
      if (neighbor && hexGrid.indexOf(hex) < hexGrid.indexOf(neighbor)) {
        ctx.beginPath();
        ctx.strokeStyle = hex.edges[edge];
        ctx.moveTo(hex.centerX, hex.centerY);
        ctx.lineTo(neighbor.centerX, neighbor.centerY);
        ctx.stroke();
      }
    }
  }
  ctx.lineWidth = 1;
  ctx.restore();
}

// DRAW A SINGLE HEXAGON
function drawHex(hex) {
  let vertices = computeVertices(hex);

  // Draw each edge with its specific color
  for (let i = 0; i < 6; i++) {
    let start = vertices[i];
    let end = vertices[(i + 1) % 6];
    ctx.beginPath();
    ctx.strokeStyle = hex.edges[i];
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Draw center star
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(hex.centerX, hex.centerY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw system name below center
  ctx.fillStyle = "#ccc";
  ctx.font = "12px Orbitron, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(hex.systemName, hex.centerX, hex.centerY + HEX_EDGE_LENGTH * 0.6);

  // Draw starships orbiting the star
  hex.starships.forEach((ship) => {
    drawStarship(hex, ship);
  });
}

// DRAW A STARSHIP AS A TRIANGLE
function drawStarship(hex, ship) {
  const orbitRadius = HEX_EDGE_LENGTH * 0.8;
  const posX = hex.centerX + orbitRadius * Math.cos(ship.orbitAngle);
  const posY = hex.centerY + orbitRadius * Math.sin(ship.orbitAngle);

  // Draw a triangle centered at (posX, posY)
  const size = 8; // size of the starship
  // Triangle vertices (pointing outward from the star)
  let angle = ship.orbitAngle;
  let vertices = [
    { x: posX + size * Math.cos(angle), y: posY + size * Math.sin(angle) },
    { x: posX + size * Math.cos(angle + 2.5), y: posY + size * Math.sin(angle + 2.5) },
    { x: posX + size * Math.cos(angle - 2.5), y: posY + size * Math.sin(angle - 2.5) }
  ];
  ctx.beginPath();
  ctx.fillStyle = (activeStarship && activeStarship.starship.id === ship.id) ? "#FF0000" : "#00FFFF";
  ctx.moveTo(vertices[0].x, vertices[0].y);
  ctx.lineTo(vertices[1].x, vertices[1].y);
  ctx.lineTo(vertices[2].x, vertices[2].y);
  ctx.closePath();
  ctx.fill();
}

// UTILITY: Get neighbor hex for a given edge (using midpoint search)
function getNeighbor(hex, edgeIndex) {
  let vertices = computeVertices(hex);
  let v1 = vertices[edgeIndex];
  let v2 = vertices[(edgeIndex + 1) % 6];
  let mid = { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2 };

  for (let other of hexGrid) {
    if (other === hex) continue;
    let dx = other.centerX - mid.x;
    let dy = other.centerY - mid.y;
    if (Math.hypot(dx, dy) < HEX_EDGE_LENGTH * 0.5) {
      return other;
    }
  }
  return null;
}

// UTILITY: Opposite edge index
function oppositeEdge(edge) {
  return (edge + 3) % 6;
}

// UTILITY: Weighted random selection for edge color
function weightedEdgeColor() {
  let r = Math.random();
  if (r < EDGE_COLOR_PROBS.green) return "green";
  else if (r < EDGE_COLOR_PROBS.green + EDGE_COLOR_PROBS.blue) return "blue";
  else return "red";
}

// PANNING & ZOOMING HANDLERS
function onMouseDown(e) {
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
}

function onMouseMove(e) {
  if (isDragging) {
    offsetX += e.clientX - dragStartX;
    offsetY += e.clientY - dragStartY;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    drawGrid();
  }
}

function onMouseUp(e) {
  isDragging = false;
}

function onWheel(e) {
  e.preventDefault();
  let delta = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= delta;
  drawGrid();
}

function onKeyDown(e) {
  const panStep = 20;
  switch (e.key) {
    case "ArrowUp":
      offsetY += panStep;
      break;
    case "ArrowDown":
      offsetY -= panStep;
      break;
    case "ArrowLeft":
      offsetX += panStep;
      break;
    case "ArrowRight":
      offsetX -= panStep;
      break;
  }
  drawGrid();
}

// POINT-IN-POLYGON (ray-casting algorithm)
function pointInPolygon(point, vertices) {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    let xi = vertices[i].x, yi = vertices[i].y;
    let xj = vertices[j].x, yj = vertices[j].y;
    let intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// UTILITY: Point in triangle test
function pointInTriangle(p, p0, p1, p2) {
  let A = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
  let sign = A < 0 ? -1 : 1;
  let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
  let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
  return s >= 0 && t >= 0 && (s + t) <= 2 * A * sign;
}

// GET CLICKED STARSHIP (if any)
function getClickedStarship(clickPoint) {
  for (let hex of hexGrid) {
    const orbitRadius = HEX_EDGE_LENGTH * 0.8;
    for (let ship of hex.starships) {
      const posX = hex.centerX + orbitRadius * Math.cos(ship.orbitAngle);
      const posY = hex.centerY + orbitRadius * Math.sin(ship.orbitAngle);
      // Define triangle for starship (similar to drawStarship)
      const size = 8;
      let angle = ship.orbitAngle;
      let v0 = { x: posX + size * Math.cos(angle), y: posY + size * Math.sin(angle) };
      let v1 = { x: posX + size * Math.cos(angle + 2.5), y: posY + size * Math.sin(angle + 2.5) };
      let v2 = { x: posX + size * Math.cos(angle - 2.5), y: posY + size * Math.sin(angle - 2.5) };
      if (pointInTriangle(clickPoint, v0, v1, v2)) {
        return { starship: ship, hex: hex };
      }
    }
  }
  return null;
}

// CANVAS CLICK HANDLER
function onCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const clickX = (e.clientX - rect.left - offsetX) / scale;
  const clickY = (e.clientY - rect.top - offsetY) / scale;
  const clickPoint = { x: clickX, y: clickY };

  // Check if a starship was clicked
  let clickedShip = getClickedStarship(clickPoint);
  if (clickedShip) {
    activeStarship = clickedShip;
    updateShipSidebar();
    drawGrid();
    return;
  }

  // If a starship is active and the clicked hex is adjacent to its current hex, move the starship there.
  let clickedHex = null;
  for (let hex of hexGrid) {
    let vertices = computeVertices(hex);
    if (pointInPolygon(clickPoint, vertices)) {
      clickedHex = hex;
      break;
    }
  }
  if (activeStarship && clickedHex && clickedHex !== activeStarship.hex) {
    // Check if clickedHex is a neighbor of activeStarship.hex
    let neighbors = [];
    for (let i = 0; i < 6; i++) {
      let n = getNeighbor(activeStarship.hex, i);
      if (n) neighbors.push(n);
    }
    if (neighbors.includes(clickedHex)) {
      // Move starship to the clicked hex
      let idx = activeStarship.hex.starships.findIndex(s => s.id === activeStarship.starship.id);
      if (idx !== -1) {
        activeStarship.hex.starships.splice(idx, 1);
      }
      // Add to new hex and update reference
      clickedHex.starships.push(activeStarship.starship);
      activeStarship.hex = clickedHex;
      updateShipSidebar();
      drawGrid();
      activeStarship = null;
      return;
    }
  }

  // Otherwise, select the hex and update the system sidebar and ship sidebar
  activeHex = clickedHex;
  activeStarship = null;
  updateSystemSidebar();
  updateShipSidebar();
}

// RIGHT SIDEBAR: System details
function updateSystemSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (activeHex) {
    sidebar.style.display = "block";
    document.getElementById("systemEditor").value = activeHex.systemText;
  } else {
    sidebar.style.display = "none";
  }
}

// When system editor loses focus, update system name and text
function onSystemEditorBlur() {
  if (activeHex) {
    let text = document.getElementById("systemEditor").value;
    activeHex.systemText = text;
    // Parse first line to update systemName if it starts with "System: "
    let lines = text.split("\n");
    if (lines[0].startsWith("System: ")) {
      activeHex.systemName = lines[0].substring(8).trim();
    }
    drawGrid();
  }
}

// Regenerate system for active hex
function regenerateSystemForActiveHex() {
  if (activeHex) {
    if (typeof generateSystemName === "function") {
      activeHex.systemName = generateSystemName();
    } else {
      activeHex.systemName = "System" + (hexGrid.indexOf(activeHex) + 1);
    }
    if (typeof generateFullSystem === "function") {
      activeHex.systemData = generateFullSystem();
    } else {
      activeHex.systemData = { info: "Updated system data for " + activeHex.systemName };
    }
    if (typeof generateSystemText === "function") {
      activeHex.systemText = generateSystemText(activeHex.systemData);
    } else {
      activeHex.systemText = "System: " + activeHex.systemName + "\n" + JSON.stringify(activeHex.systemData, null, 2);
    }
    document.getElementById("systemEditor").value = activeHex.systemText;
    drawGrid();
  }
}

// LEFT SIDEBAR: Update ship sidebar with starships from active hex
function updateShipSidebar() {
  const shipSidebar = document.getElementById("shipSidebar");
  if (activeHex) {
    shipSidebar.style.display = "block";
    const list = document.getElementById("starshipList");
    list.innerHTML = "";
    activeHex.starships.forEach((ship) => {
      let div = document.createElement("div");
      div.className = "starship";
      // Name input
      let nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.value = ship.name;
      nameInput.addEventListener("change", (e) => {
        ship.name = e.target.value;
        drawGrid();
      });
      // Notes textarea
      let notesArea = document.createElement("textarea");
      notesArea.value = ship.notes;
      notesArea.addEventListener("change", (e) => {
        ship.notes = e.target.value;
      });
      // Button to select this starship
      let selectBtn = document.createElement("button");
      selectBtn.textContent = "Select";
      selectBtn.addEventListener("click", () => {
        activeStarship = { starship: ship, hex: activeHex };
        updateShipSidebar();
        drawGrid();
      });
      div.appendChild(document.createTextNode("Name:"));
      div.appendChild(nameInput);
      div.appendChild(document.createElement("br"));
      div.appendChild(document.createTextNode("Notes:"));
      div.appendChild(notesArea);
      div.appendChild(document.createElement("br"));
      div.appendChild(selectBtn);
      list.appendChild(div);
    });
  } else {
    shipSidebar.style.display = "none";
  }
}

// Add a new starship to the active hex
function addStarshipToActiveHex() {
  if (activeHex) {
    let ship = new Starship();
    activeHex.starships.push(ship);
    updateShipSidebar();
    drawGrid();
  }
}

// SAVE MAP STATE (all hex data)
function saveMap() {
  const data = { hexGrid };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "galaxyMap.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// LOAD MAP STATE
function loadMap(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    let data = JSON.parse(event.target.result);
    hexGrid = data.hexGrid;
    // (Note: starship objects and other fields should be restored correctly)
    drawGrid();
  };
  reader.readAsText(file);
}
