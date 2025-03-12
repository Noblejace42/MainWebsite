/* galaxygen.js */

// CONFIGURATION VARIABLES
const NUM_HEXES = 500;
const EDGE_COLOR_PROBS = { green: 0.4, blue: 0.4, red: 0.2 };
const HEX_EDGE_LENGTH = 50; // side length per hex

// For flat-topped hexagons:
// width = 2 * HEX_EDGE_LENGTH, height = sqrt(3) * HEX_EDGE_LENGTH
const hexWidth = 2 * HEX_EDGE_LENGTH;
const hexHeight = Math.sqrt(3) * HEX_EDGE_LENGTH;

// GLOBALS
let canvas, ctx;
let offsetX = 0, offsetY = 0, scale = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;
let hexGrid = []; // array of hex objects
let activeHex = null; // currently selected hex
let activeStarship = null; // { starship, hex } if a starship is selected

// Hex definition
class Hex {
  constructor(row, col, centerX, centerY) {
    this.row = row;
    this.col = col;
    this.centerX = centerX;
    this.centerY = centerY;
    this.edges = new Array(6); // each edge has color "green","blue","red"
    this.hexName = `Hex ${row},${col}`;
    this.notes = ""; // user-editable text
    this.starships = [];
  }
}

// Starship definition
class Starship {
  constructor() {
    this.id = Date.now() + Math.floor(Math.random() * 1000);
    this.name = "Unnamed Ship";
    this.notes = "";
    this.orbitAngle = Math.random() * Math.PI * 2; // radians
  }
}

// INIT
window.addEventListener("load", init);
function init() {
  canvas = document.getElementById("hexMapCanvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();

  // Generate the hex map
  generateHexGrid();
  drawGrid();

  // Set up event listeners
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);
  canvas.addEventListener("wheel", onWheel);
  window.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("click", onCanvasClick);

  // Control panel
  document.getElementById("saveMap").addEventListener("click", saveMap);
  document.getElementById("loadMap").addEventListener("click", () => {
    document.getElementById("loadInput").click();
  });
  document.getElementById("loadInput").addEventListener("change", loadMap);
  document.getElementById("regenerateMap").addEventListener("click", regenerateMap);

  // Left sidebar: starships
  document.getElementById("addStarship").addEventListener("click", addStarshipToActiveHex);

  // Right sidebar: notes
  document.getElementById("notesEditor").addEventListener("blur", onNotesBlur);
}

// Resize canvas to fill container
window.addEventListener("resize", resizeCanvas);
function resizeCanvas() {
  const container = document.getElementById("hexMapContainer");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  drawGrid();
}

// REGENERATE THE ENTIRE MAP
function regenerateMap() {
  hexGrid = [];
  generateHexGrid();
  drawGrid();
  activeHex = null;
  updateNotesSidebar();
  updateShipSidebar();
}

// Generate the hex grid
function generateHexGrid() {
  const cols = Math.ceil(Math.sqrt(NUM_HEXES));
  const rows = Math.ceil(NUM_HEXES / cols);
  let count = 0;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      let centerX = c * (hexWidth * 0.75) + HEX_EDGE_LENGTH;
      let centerY = r * hexHeight + hexHeight / 2;
      if (c % 2 === 1) {
        centerY += hexHeight / 2;
      }
      const hex = new Hex(r, c, centerX, centerY);

      // For each edge, share color with neighbor if possible
      for (let edge = 0; edge < 6; edge++) {
        let neighbor = getNeighbor(hex, edge);
        if (neighbor && neighbor.edges[oppositeEdge(edge)] !== undefined) {
          hex.edges[edge] = neighbor.edges[oppositeEdge(edge)];
        } else {
          hex.edges[edge] = weightedEdgeColor();
        }
      }

      hexGrid.push(hex);
      count++;
      if (count >= NUM_HEXES) break;
    }
    if (count >= NUM_HEXES) break;
  }
}

// Weighted random color for edges
function weightedEdgeColor() {
  let r = Math.random();
  if (r < EDGE_COLOR_PROBS.green) return "green";
  else if (r < EDGE_COLOR_PROBS.green + EDGE_COLOR_PROBS.blue) return "blue";
  else return "red";
}

// Opposite edge index
function oppositeEdge(e) {
  return (e + 3) % 6;
}

// Draw everything
function drawGrid() {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);

  // Draw hexes
  hexGrid.forEach((hex) => drawHex(hex));

  // Draw bisecting lines
  ctx.lineWidth = 2;
  for (let i = 0; i < hexGrid.length; i++) {
    const hex = hexGrid[i];
    for (let edge = 0; edge < 6; edge++) {
      const neighbor = getNeighbor(hex, edge);
      if (neighbor && i < hexGrid.indexOf(neighbor)) {
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

// Draw one hex
function drawHex(hex) {
  const vertices = computeVertices(hex);

  // Outline edges
  for (let i = 0; i < 6; i++) {
    const start = vertices[i];
    const end = vertices[(i + 1) % 6];
    ctx.beginPath();
    ctx.strokeStyle = hex.edges[i];
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Center star
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(hex.centerX, hex.centerY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Hex name below center
  ctx.fillStyle = "#ccc";
  ctx.font = "12px Orbitron, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(hex.hexName, hex.centerX, hex.centerY + HEX_EDGE_LENGTH * 0.6);

  // Starships
  hex.starships.forEach(ship => {
    drawStarship(hex, ship);
  });
}

// Compute vertices for a flat-topped hex
function computeVertices(hex) {
  let v = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    const x = hex.centerX + HEX_EDGE_LENGTH * Math.cos(angle);
    const y = hex.centerY + HEX_EDGE_LENGTH * Math.sin(angle);
    v.push({ x, y });
  }
  return v;
}

// Draw starship as a triangle orbiting the center
function drawStarship(hex, ship) {
  const orbitRadius = HEX_EDGE_LENGTH * 0.8;
  const posX = hex.centerX + orbitRadius * Math.cos(ship.orbitAngle);
  const posY = hex.centerY + orbitRadius * Math.sin(ship.orbitAngle);
  const size = 8;
  const angle = ship.orbitAngle;

  const v0 = { x: posX + size * Math.cos(angle),     y: posY + size * Math.sin(angle) };
  const v1 = { x: posX + size * Math.cos(angle+2.5), y: posY + size * Math.sin(angle+2.5) };
  const v2 = { x: posX + size * Math.cos(angle-2.5), y: posY + size * Math.sin(angle-2.5) };

  ctx.beginPath();
  ctx.fillStyle = (activeStarship && activeStarship.starship.id === ship.id) ? "#FF0000" : "#00FFFF";
  ctx.moveTo(v0.x, v0.y);
  ctx.lineTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.closePath();
  ctx.fill();
}

// Get neighbor for an edge
function getNeighbor(hex, edgeIndex) {
  const vertices = computeVertices(hex);
  const v1 = vertices[edgeIndex];
  const v2 = vertices[(edgeIndex + 1) % 6];
  const mid = { x: (v1.x + v2.x)/2, y: (v1.y + v2.y)/2 };

  for (let other of hexGrid) {
    if (other === hex) continue;
    const dx = other.centerX - mid.x;
    const dy = other.centerY - mid.y;
    if (Math.hypot(dx, dy) < HEX_EDGE_LENGTH * 0.5) {
      return other;
    }
  }
  return null;
}

// MOUSE & KEY HANDLERS
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
  const zoomFactor = (e.deltaY < 0) ? 1.1 : 0.9;
  scale *= zoomFactor;
  drawGrid();
}
function onKeyDown(e) {
  const panStep = 20;
  switch(e.key) {
    case "ArrowUp":    offsetY += panStep; break;
    case "ArrowDown":  offsetY -= panStep; break;
    case "ArrowLeft":  offsetX += panStep; break;
    case "ArrowRight": offsetX -= panStep; break;
  }
  drawGrid();
}

// Canvas click: check starships, or else select a hex
canvasClick = null; // declared above in init
function onCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / scale;
  const y = (e.clientY - rect.top - offsetY) / scale;
  const clickPt = { x, y };

  // Check starships first
  const shipHit = findClickedStarship(clickPt);
  if (shipHit) {
    activeStarship = shipHit;
    updateShipSidebar();
    drawGrid();
    return;
  }

  // Otherwise find which hex was clicked
  let foundHex = null;
  for (let h of hexGrid) {
    if (pointInHex(clickPt, h)) {
      foundHex = h;
      break;
    }
  }

  // If a starship is active and user clicks an adjacent hex, move it
  if (activeStarship && foundHex && foundHex !== activeStarship.hex) {
    const neighbors = getNeighborsOfHex(activeStarship.hex);
    if (neighbors.includes(foundHex)) {
      // Move starship
      const idx = activeStarship.hex.starships.indexOf(activeStarship.starship);
      if (idx >= 0) activeStarship.hex.starships.splice(idx, 1);
      foundHex.starships.push(activeStarship.starship);
      activeStarship.hex = foundHex;
      updateShipSidebar();
      drawGrid();
      activeStarship = null;
      return;
    }
  }

  // Otherwise, select the hex
  activeHex = foundHex;
  activeStarship = null;
  updateNotesSidebar();
  updateShipSidebar();
}

// Basic point in hex test (ray casting)
function pointInHex(pt, hex) {
  const verts = computeVertices(hex);
  return pointInPolygon(pt, verts);
}
function pointInPolygon(pt, verts) {
  let inside = false;
  for (let i=0, j=verts.length-1; i<verts.length; j=i++) {
    const xi = verts[i].x, yi = verts[i].y;
    const xj = verts[j].x, yj = verts[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
                      (pt.x < (xj - xi)*(pt.y - yi)/(yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Find starship under click
function findClickedStarship(pt) {
  for (let hex of hexGrid) {
    const orbitR = HEX_EDGE_LENGTH*0.8;
    for (let ship of hex.starships) {
      const sx = hex.centerX + orbitR*Math.cos(ship.orbitAngle);
      const sy = hex.centerY + orbitR*Math.sin(ship.orbitAngle);
      // Triangle bounding box
      if (Math.hypot(sx - pt.x, sy - pt.y) < 15) {
        // More accurate check:
        if (pointInTriangle(pt, getShipTriangleVertices(sx, sy, ship.orbitAngle))) {
          return { starship: ship, hex };
        }
      }
    }
  }
  return null;
}
function getShipTriangleVertices(cx, cy, angle) {
  const size = 8;
  const v0 = { x: cx + size*Math.cos(angle),     y: cy + size*Math.sin(angle) };
  const v1 = { x: cx + size*Math.cos(angle+2.5), y: cy + size*Math.sin(angle+2.5) };
  const v2 = { x: cx + size*Math.cos(angle-2.5), y: cy + size*Math.sin(angle-2.5) };
  return [v0,v1,v2];
}
function pointInTriangle(pt, [v0,v1,v2]) {
  // Barycentric or area method
  const area = triArea(v0, v1, v2);
  const area1 = triArea(pt, v1, v2);
  const area2 = triArea(v0, pt, v2);
  const area3 = triArea(v0, v1, pt);
  const diff = Math.abs(area - (area1+area2+area3));
  return diff < 0.01;
}
function triArea(a,b,c) {
  return Math.abs(a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y-b.y))/2;
}

// Get neighbors
function getNeighborsOfHex(hex) {
  const result = [];
  for (let i=0; i<6; i++) {
    const n = getNeighbor(hex, i);
    if (n) result.push(n);
  }
  return result;
}

// LEFT SIDEBAR: starships
function updateShipSidebar() {
  const shipSidebar = document.getElementById("shipSidebar");
  if (!activeHex) {
    shipSidebar.style.display = "none";
    return;
  }
  shipSidebar.style.display = "block";
  const list = document.getElementById("starshipList");
  list.innerHTML = "";
  activeHex.starships.forEach(ship => {
    const div = document.createElement("div");
    div.className = "starship";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = ship.name;
    nameInput.addEventListener("change", e => {
      ship.name = e.target.value;
      drawGrid();
    });

    const notesArea = document.createElement("textarea");
    notesArea.value = ship.notes;
    notesArea.addEventListener("change", e => {
      ship.notes = e.target.value;
    });

    const selectBtn = document.createElement("button");
    selectBtn.textContent = "Select";
    selectBtn.addEventListener("click", () => {
      activeStarship = { starship: ship, hex: activeHex };
      updateShipSidebar();
      drawGrid();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const idx = activeHex.starships.indexOf(ship);
      if (idx >= 0) {
        activeHex.starships.splice(idx,1);
        updateShipSidebar();
        drawGrid();
      }
    });

    div.appendChild(document.createTextNode("Name:"));
    div.appendChild(nameInput);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createTextNode("Notes:"));
    div.appendChild(notesArea);
    div.appendChild(document.createElement("br"));
    div.appendChild(selectBtn);
    div.appendChild(deleteBtn);

    list.appendChild(div);
  });
}
function addStarshipToActiveHex() {
  if (!activeHex) return;
  const ship = new Starship();
  activeHex.starships.push(ship);
  updateShipSidebar();
  drawGrid();
}

// RIGHT SIDEBAR: notes
function updateNotesSidebar() {
  const notesSidebar = document.getElementById("notesSidebar");
  if (!activeHex) {
    notesSidebar.style.display = "none";
    return;
  }
  notesSidebar.style.display = "block";
  document.getElementById("notesEditor").value = activeHex.notes;
}
function onNotesBlur() {
  if (activeHex) {
    activeHex.notes = document.getElementById("notesEditor").value;
  }
}

// SAVE/LOAD
function saveMap() {
  const data = { hexGrid };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
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
  reader.onload = evt => {
    const data = JSON.parse(evt.target.result);
    hexGrid = data.hexGrid || [];
    drawGrid();
  };
  reader.readAsText(file);
}
