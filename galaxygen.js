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
let hexGrid = []; // array of hexagon objects
let activeHex = null; // hex currently selected in sidebar

// Hexagon class definition
class Hex {
  constructor(row, col, centerX, centerY) {
    this.row = row;
    this.col = col;
    this.centerX = centerX;
    this.centerY = centerY;
    this.edges = new Array(6); // each edge will store a color string ("green", "blue", or "red")
    this.systemName = ""; // system name (generated via systemgen.js)
    this.systemData = null; // full system data (generated via systemgen.js)
  }
}

// INITIALIZATION
window.addEventListener('load', init);
window.addEventListener('resize', resizeCanvas);

function init() {
  canvas = document.getElementById("hexMapCanvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();

  // Generate the honeycomb grid of hexagons
  generateHexGrid();
  drawGrid();

  // Set up event listeners for panning, zooming, and clicking
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', onMouseUp);
  canvas.addEventListener('wheel', onWheel);
  window.addEventListener('keydown', onKeyDown);
  canvas.addEventListener('click', onCanvasClick);

  // Set up control panel buttons for saving and loading the map state
  document.getElementById("saveMap").addEventListener('click', saveMap);
  document.getElementById("loadMap").addEventListener('click', () => {
    document.getElementById("loadInput").click();
  });
  document.getElementById("loadInput").addEventListener('change', loadMap);

  // Sidebar events for system editing and regeneration
  document.getElementById("systemEditor").addEventListener('blur', onSystemEditorBlur);
  document.getElementById("regenerateSystem").addEventListener('click', regenerateSystemForActiveHex);
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
    // Use angles 0, 60, 120, ... 300 degrees
    let angleRad = Math.PI / 180 * (60 * i);
    vertices.push({
      x: hex.centerX + HEX_EDGE_LENGTH * Math.cos(angleRad),
      y: hex.centerY + HEX_EDGE_LENGTH * Math.sin(angleRad)
    });
  }
  return vertices;
}

// GENERATE HEX GRID
function generateHexGrid() {
  hexGrid = [];
  // Determine grid dimensions (columns and rows) to cover NUM_HEXES
  const cols = Math.ceil(Math.sqrt(NUM_HEXES));
  const rows = Math.ceil(NUM_HEXES / cols);

  // Loop over columns and rows to place hexagons in a honeycomb grid.
  // For flat-topped hexagons, use: 
  //   centerX = col * (hexWidth * 0.75) + HEX_EDGE_LENGTH
  //   centerY = row * hexHeight + hexHeight/2 + (col % 2 ? hexHeight/2 : 0)
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let centerX = col * (hexWidth * 0.75) + HEX_EDGE_LENGTH;
      let centerY = row * hexHeight + hexHeight / 2;
      if (col % 2 === 1) {
        centerY += hexHeight / 2;
      }
      let hex = new Hex(row, col, centerX, centerY);

      // For each edge, assign a color. If a neighboring hex exists and already has its shared edge defined, copy that color.
      for (let edge = 0; edge < 6; edge++) {
        let neighbor = getNeighbor(hex, edge);
        if (neighbor && neighbor.edges[oppositeEdge(edge)] !== undefined) {
          hex.edges[edge] = neighbor.edges[oppositeEdge(edge)];
        } else {
          hex.edges[edge] = weightedEdgeColor();
        }
      }

      // Generate system data using functions from systemgen.js (if available)
      if (typeof generateSystemName === 'function') {
        hex.systemName = generateSystemName();
      } else {
        hex.systemName = "System" + (hexGrid.length + 1);
      }
      if (typeof generateFullSystem === 'function') {
        hex.systemData = generateFullSystem();
      } else {
        hex.systemData = { info: "Full system data for " + hex.systemName };
      }

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

  // Draw each hexagon
  hexGrid.forEach((hex) => {
    drawHex(hex);
  });

  // Draw bisecting lines (from star center to neighbor star) for each shared edge
  for (let i = 0; i < hexGrid.length; i++) {
    let hex = hexGrid[i];
    for (let edge = 0; edge < 6; edge++) {
      let neighbor = getNeighbor(hex, edge);
      if (neighbor) {
        // To avoid drawing the same line twice, only draw if current hex comes first in the array.
        if (hexGrid.indexOf(hex) < hexGrid.indexOf(neighbor)) {
          ctx.beginPath();
          ctx.strokeStyle = hex.edges[edge];
          ctx.moveTo(hex.centerX, hex.centerY);
          ctx.lineTo(neighbor.centerX, neighbor.centerY);
          ctx.stroke();
        }
      }
    }
  }

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

  // Draw a star (a small filled circle) at the center
  ctx.fillStyle = "#FFD700"; // Gold color
  ctx.beginPath();
  ctx.arc(hex.centerX, hex.centerY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw the system name centered in the hex (if space permits)
  ctx.fillStyle = "#ccc";
  ctx.font = "12px Orbitron, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(hex.systemName, hex.centerX, hex.centerY + HEX_EDGE_LENGTH * 0.6);
}

// UTILITY: Get neighbor hex for a given edge by checking the midpoint of that edge
function getNeighbor(hex, edgeIndex) {
  let vertices = computeVertices(hex);
  let v1 = vertices[edgeIndex];
  let v2 = vertices[(edgeIndex + 1) % 6];
  let mid = { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2 };

  // Look through hexGrid for a hex whose center is near this midpoint.
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

// UTILITY: Return opposite edge index (edge + 3 modulo 6)
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

// PANNING & ZOOMING EVENT HANDLERS
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

// POINT-IN-POLYGON TEST (Ray-casting algorithm)
function pointInPolygon(point, vertices) {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    let xi = vertices[i].x,
      yi = vertices[i].y;
    let xj = vertices[j].x,
      yj = vertices[j].y;
    let intersect =
      (yi > point.y) !== (yj > point.y) &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// CANVAS CLICK HANDLER: Open sidebar if a hexagon is clicked
function onCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / scale;
  const y = (e.clientY - rect.top - offsetY) / scale;

  for (let hex of hexGrid) {
    let vertices = computeVertices(hex);
    if (pointInPolygon({ x, y }, vertices)) {
      openSidebar(hex);
      return;
    }
  }
}

// SIDEBAR FUNCTIONS
function openSidebar(hex) {
  activeHex = hex;
  const sidebar = document.getElementById("sidebar");
  sidebar.style.display = "block";
  document.getElementById("systemEditor").value = generateSystemTextForHex(hex);
}

function onSystemEditorBlur() {
  if (activeHex) {
    // Save the edited system details from the textarea back into the active hex’s systemData
    activeHex.systemData = document.getElementById("systemEditor").value;
  }
}

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
    document.getElementById("systemEditor").value = generateSystemTextForHex(activeHex);
    drawGrid();
  }
}

function generateSystemTextForHex(hex) {
  return "System: " + hex.systemName + "\n" + JSON.stringify(hex.systemData, null, 2);
}

// SAVE AND LOAD MAP STATE
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

function loadMap(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    let data = JSON.parse(event.target.result);
    // Restore hexGrid from the loaded JSON data
    hexGrid = data.hexGrid;
    drawGrid();
  };
  reader.readAsText(file);
}
