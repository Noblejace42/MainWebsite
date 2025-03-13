/********************************************************
 * galaxygen.js - A simplified honeycomb hex generator
 * with starships, bisecting lines, renameable hex, notes,
 * and a bottom control panel. No system generator needed.
 ********************************************************/

/* CONFIG */
const NUM_HEXES = 500;
const EDGE_COLOR_PROBS = { green: 0.4, blue: 0.4, red: 0.2 };
const HEX_EDGE_LENGTH = 50;
const hexWidth = 2 * HEX_EDGE_LENGTH;
const hexHeight = Math.sqrt(3) * HEX_EDGE_LENGTH;

/* GLOBALS */
let canvas, ctx;
let offsetX = 0, offsetY = 0, scale = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;
let hexGrid = []; // array of hex objects
let activeHex = null; // currently selected hex
let activeStarship = null; // { starship, hex }

/* CLASS: Hex */
class Hex {
  constructor(row, col, centerX, centerY) {
    this.row = row;
    this.col = col;
    this.centerX = centerX;
    this.centerY = centerY;
    this.edges = new Array(6); // each edge color
    this.hexName = `Hex ${row},${col}`;
    this.notes = ""; // user editable
    this.starships = [];
  }
}

/* CLASS: Starship */
class Starship {
  constructor() {
    this.id = Date.now() + Math.floor(Math.random() * 1000);
    this.name = "Unnamed Ship";
    this.notes = "";
    this.orbitAngle = Math.random() * Math.PI * 2;
  }
}

/***************************
 * Initialization
 ***************************/
window.addEventListener("load", init);
window.addEventListener("resize", resizeCanvas);

function init() {
  canvas = document.getElementById("galaxyCanvas");
  ctx = canvas.getContext("2d");

  resizeCanvas();
  generateHexGrid();
  drawGrid();

  // Mouse events
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);
  canvas.addEventListener("wheel", onWheel);
  canvas.addEventListener("click", onCanvasClick);
  window.addEventListener("keydown", onKeyDown);

  // Bottom control panel
  document.getElementById("saveMapBtn").addEventListener("click", saveMap);
  document.getElementById("loadMapBtn").addEventListener("click", () => {
    document.getElementById("loadInput").click();
  });
  document.getElementById("loadInput").addEventListener("change", loadMap);
  document.getElementById("regenerateMapBtn").addEventListener("click", regenerateMap);

  // Left sidebar: starships
  document.getElementById("addStarshipBtn").addEventListener("click", addStarshipToActiveHex);

  // Right sidebar: rename & notes
  document.getElementById("hexNameInput").addEventListener("change", onHexNameChange);
  document.getElementById("hexNotes").addEventListener("blur", onHexNotesBlur);
}

function resizeCanvas() {
  const container = document.getElementById("canvasContainer");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  drawGrid();
}

/***************************
 * Generate & Draw
 ***************************/
function generateHexGrid() {
  hexGrid = [];
  const cols = Math.ceil(Math.sqrt(NUM_HEXES));
  const rows = Math.ceil(NUM_HEXES / cols);
  let count = 0;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const centerX = c * (hexWidth * 0.75) + HEX_EDGE_LENGTH;
      let centerY = r * hexHeight + hexHeight / 2;
      if (c % 2 === 1) centerY += hexHeight / 2;

      const hex = new Hex(r, c, centerX, centerY);

      // Edges (shared if neighbor already has it)
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

function drawGrid() {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);

  // Draw each hex
  hexGrid.forEach(hex => drawHex(hex));

  // Bisecting lines
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

function drawHex(hex) {
  const vertices = computeHexVertices(hex);

  // Fill the hex with a subtle color
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < 6; i++) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = "#111"; // dark fill
  ctx.fill();

  // Draw each edge
  for (let i = 0; i < 6; i++) {
    const start = vertices[i];
    const end = vertices[(i + 1) % 6];
    ctx.shadowBlur = 0;
    ctx.strokeStyle = hex.edges[i];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Draw star in center with glow
  ctx.save();
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#FFD700";
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(hex.centerX, hex.centerY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Hex name below center
  ctx.fillStyle = "#ccc";
  ctx.font = "12px Orbitron, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(hex.hexName, hex.centerX, hex.centerY + HEX_EDGE_LENGTH * 0.6);

  // Draw starships
  hex.starships.forEach(ship => drawStarship(hex, ship));
}

function computeHexVertices(hex) {
  const verts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    const x = hex.centerX + HEX_EDGE_LENGTH * Math.cos(angle);
    const y = hex.centerY + HEX_EDGE_LENGTH * Math.sin(angle);
    verts.push({ x, y });
  }
  return verts;
}

function drawStarship(hex, ship) {
  const orbitRadius = HEX_EDGE_LENGTH * 0.8;
  const posX = hex.centerX + orbitRadius * Math.cos(ship.orbitAngle);
  const posY = hex.centerY + orbitRadius * Math.sin(ship.orbitAngle);
  const size = 8;
  const angle = ship.orbitAngle;

  // Triangle
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

/***************************
 * Utility & geometry
 ***************************/
function weightedEdgeColor() {
  let r = Math.random();
  if (r < EDGE_COLOR_PROBS.green) return "green";
  else if (r < EDGE_COLOR_PROBS.green + EDGE_COLOR_PROBS.blue) return "blue";
  else return "red";
}
function oppositeEdge(edge) {
  return (edge + 3) % 6;
}
function getNeighbor(hex, edgeIndex) {
  const verts = computeHexVertices(hex);
  const v1 = verts[edgeIndex];
  const v2 = verts[(edgeIndex + 1) % 6];
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

/***************************
 * Panning & Zooming
 ***************************/
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
  let factor = (e.deltaY < 0) ? 1.1 : 0.9;
  scale *= factor;
  drawGrid();
}
function onKeyDown(e) {
  const step = 20;
  switch(e.key) {
    case "ArrowUp": offsetY += step; break;
    case "ArrowDown": offsetY -= step; break;
    case "ArrowLeft": offsetX += step; break;
    case "ArrowRight": offsetX -= step; break;
  }
  drawGrid();
}

/***************************
 * Clicking & Selection
 ***************************/
function onCanvasClick(e) {
  if (isDragging) return; // ignore clicks while dragging
  const rect = canvas.getBoundingClientRect();
  const clickX = (e.clientX - rect.left - offsetX) / scale;
  const clickY = (e.clientY - rect.top - offsetY) / scale;

  // Check starships
  const starshipHit = findClickedStarship({ x: clickX, y: clickY });
  if (starshipHit) {
    activeStarship = starshipHit;
    updateLeftSidebar();
    drawGrid();
    return;
  }

  // Otherwise find which hex was clicked
  let clickedHex = null;
  for (let h of hexGrid) {
    if (pointInHex({ x: clickX, y: clickY }, h)) {
      clickedHex = h;
      break;
    }
  }

  // If a starship is active and user clicked an adjacent hex, move it
  if (activeStarship && clickedHex && clickedHex !== activeStarship.hex) {
    const neighbors = getNeighborsOfHex(activeStarship.hex);
    if (neighbors.includes(clickedHex)) {
      // move starship
      const idx = activeStarship.hex.starships.indexOf(activeStarship.starship);
      if (idx >= 0) activeStarship.hex.starships.splice(idx, 1);
      clickedHex.starships.push(activeStarship.starship);
      activeStarship.hex = clickedHex;
      activeStarship = null;
      updateLeftSidebar();
      drawGrid();
      return;
    }
  }

  // Otherwise just select the clicked hex
  activeHex = clickedHex;
  activeStarship = null;
  updateRightSidebar();
  updateLeftSidebar();
}

function findClickedStarship(pt) {
  for (let hex of hexGrid) {
    const orbitR = HEX_EDGE_LENGTH*0.8;
    for (let ship of hex.starships) {
      const sx = hex.centerX + orbitR*Math.cos(ship.orbitAngle);
      const sy = hex.centerY + orbitR*Math.sin(ship.orbitAngle);
      // quick bounding check
      if (Math.hypot(sx - pt.x, sy - pt.y) < 12) {
        // more precise check with triangle?
        if (pointInTriangle(pt, sx, sy, ship.orbitAngle)) {
          return { starship: ship, hex };
        }
      }
    }
  }
  return null;
}
function pointInTriangle(pt, cx, cy, angle) {
  const size = 8;
  const v0 = { x: cx + size*Math.cos(angle),     y: cy + size*Math.sin(angle) };
  const v1 = { x: cx + size*Math.cos(angle+2.5), y: cy + size*Math.sin(angle+2.5) };
  const v2 = { x: cx + size*Math.cos(angle-2.5), y: cy + size*Math.sin(angle-2.5) };
  const area = triArea(v0, v1, v2);
  const area1 = triArea(pt, v1, v2);
  const area2 = triArea(v0, pt, v2);
  const area3 = triArea(v0, v1, pt);
  return Math.abs(area - (area1+area2+area3)) < 0.5;
}
function triArea(a,b,c) {
  return Math.abs(a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y-b.y))/2;
}
function pointInHex(pt, hex) {
  const verts = computeHexVertices(hex);
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
function getNeighborsOfHex(hex) {
  const arr = [];
  for (let i=0; i<6; i++) {
    const n = getNeighbor(hex, i);
    if (n) arr.push(n);
  }
  return arr;
}

/***************************
 * Left Sidebar: Starships
 ***************************/
function updateLeftSidebar() {
  const leftBar = document.getElementById("leftSidebar");
  if (!activeHex) {
    leftBar.style.display = "none";
    return;
  }
  leftBar.style.display = "block";
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
      updateLeftSidebar();
      drawGrid();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const idx = activeHex.starships.indexOf(ship);
      if (idx >= 0) {
        activeHex.starships.splice(idx,1);
        updateLeftSidebar();
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
  ship.name = "Starship " + (activeHex.starships.length + 1);
  activeHex.starships.push(ship);
  updateLeftSidebar();
  drawGrid();
}

/***************************
 * Right Sidebar: Rename + Notes
 ***************************/
function updateRightSidebar() {
  const rightBar = document.getElementById("rightSidebar");
  if (!activeHex) {
    rightBar.style.display = "none";
    return;
  }
  rightBar.style.display = "block";
  document.getElementById("hexNameInput").value = activeHex.hexName;
  document.getElementById("hexNotes").value = activeHex.notes;
}
function onHexNameChange(e) {
  if (activeHex) {
    activeHex.hexName = e.target.value;
    drawGrid();
  }
}
function onHexNotesBlur(e) {
  if (activeHex) {
    activeHex.notes = e.target.value;
  }
}

/***************************
 * Map Regeneration
 ***************************/
function regenerateMap() {
  hexGrid = [];
  generateHexGrid();
  drawGrid();
  activeHex = null;
  activeStarship = null;
  updateLeftSidebar();
  updateRightSidebar();
}

/***************************
 * Save/Load
 ***************************/
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
    activeHex = null;
    activeStarship = null;
    updateLeftSidebar();
    updateRightSidebar();
  };
  reader.readAsText(file);
}
