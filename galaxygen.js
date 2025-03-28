/********************************************************
 * galaxygen.js - A simplified honeycomb hex generator
 * with starships, bisecting lines, renameable hex, notes,
 * a bottom control panel, and new features:
 *  1) Ships are draggable to move them between hexes
 *  2) Lines are thicker and clearly drawn
 *  3) Zooming is centered on the mouse
 *  4) 1/6 chance a hex is "empty" (no edges, no star)
 ********************************************************/

/* CONFIG */
const NUM_HEXES = 500;
const EDGE_COLOR_PROBS = { green: 0.4, blue: 0.3, red: 0.3 };
const HEX_EDGE_LENGTH = 60;
const hexWidth = 2 * HEX_EDGE_LENGTH;
const hexHeight = Math.sqrt(3) * HEX_EDGE_LENGTH;

/* GLOBALS */
let canvas, ctx;
let offsetX = 0, offsetY = 0, scale = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;
let hexGrid = []; // array of hex objects
let activeHex = null; // currently selected hex
let activeStarship = null; // { starship, hex }
let draggingStarship = null; // { starship, fromHex, offsetAngle, originalAngle }

/* CLASS: Hex */
class Hex {
  constructor(row, col, centerX, centerY) {
    this.row = row;
    this.col = col;
    this.centerX = centerX;
    this.centerY = centerY;
    this.edges = new Array(6); // each edge color or null
    this.isEmpty = false;      // if true, no edges, no star, no name
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

  // Ensure the right/left sidebars float above the canvas
  document.getElementById("rightSidebar").style.zIndex = 9999;
  document.getElementById("leftSidebar").style.zIndex = 9999;

  resizeCanvas();
  generateHexGrid();
  drawGrid();

  // Mouse events
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);

  // Wheel for zoom (centered on mouse)
  canvas.addEventListener("wheel", onWheel, { passive: false });

  // Keyboard panning
  window.addEventListener("keydown", onKeyDown);

  // Click to select hex or starship
  canvas.addEventListener("click", onCanvasClick);

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

      // 1/6 chance to be empty
      if (Math.random() < 1/6) {
        hex.isEmpty = true;
        // no edges, skip neighbor logic
        for (let e = 0; e < 6; e++) {
          hex.edges[e] = null;
        }
      } else {
        // normal edges
        for (let edge = 0; edge < 6; edge++) {
          let neighbor = getNeighbor(hex, edge);
          if (neighbor && !neighbor.isEmpty && neighbor.edges[oppositeEdge(edge)] !== undefined) {
            hex.edges[edge] = neighbor.edges[oppositeEdge(edge)];
          } else {
            hex.edges[edge] = weightedEdgeColor();
          }
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

  // Bisecting lines - thicker for clarity
  ctx.lineWidth = 3;
  for (let i = 0; i < hexGrid.length; i++) {
    const hex = hexGrid[i];
    if (hex.isEmpty) continue; // skip empty hex
    for (let edge = 0; edge < 6; edge++) {
      const neighbor = getNeighbor(hex, edge);
      if (!hex.edges[edge]) continue; // no edge color
      // Draw line once for each pair (to avoid doubling)
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
  if (hex.isEmpty) {
    // draw a pure black hex so it stands out
    ctx.save();
    ctx.beginPath();
    const vertices = computeHexVertices(hex);
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < 6; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();
    return; // no star, no name, no starships
  }

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
    const color = hex.edges[i];
    if (!color) continue;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = color;
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

  // Triangle shape for the ship
  const v0 = { x: posX + size * Math.cos(angle),     y: posY + size * Math.sin(angle) };
  const v1 = { x: posX + size * Math.cos(angle+2.5), y: posY + size * Math.sin(angle+2.5) };
  const v2 = { x: posX + size * Math.cos(angle-2.5), y: posY + size * Math.sin(angle-2.5) };

  ctx.beginPath();
  let fillColor = (activeStarship && activeStarship.starship.id === ship.id) ? "#FF0000" : "#00FFFF";
  if (draggingStarship && draggingStarship.starship.id === ship.id) {
    fillColor = "#FF0000";
  }
  ctx.fillStyle = fillColor;
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
  if (hex.isEmpty) return null;
  const verts = computeHexVertices(hex);
  const v1 = verts[edgeIndex];
  const v2 = verts[(edgeIndex + 1) % 6];
  const mid = { x: (v1.x + v2.x)/2, y: (v1.y + v2.y)/2 };
  for (let other of hexGrid) {
    if (other === hex || other.isEmpty) continue;
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
  // Convert screen coords to “world” coords
  const rect = canvas.getBoundingClientRect();
  const worldX = (e.clientX - rect.left - offsetX) / scale;
  const worldY = (e.clientY - rect.top - offsetY) / scale;
  // Check if user clicked a starship for drag
  const starshipHit = findClickedStarship({ x: worldX, y: worldY });

  if (starshipHit) {
    // Begin starship dragging
    draggingStarship = {
      starship: starshipHit.starship,
      fromHex: starshipHit.hex,
      originalAngle: starshipHit.starship.orbitAngle
    };
    isDragging = false; // don't pan if we're dragging a starship
  } else {
    // Begin panning
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  }
}

function onMouseMove(e) {
  if (draggingStarship) {
    // Update starship orbitAngle to follow mouse
    const rect = canvas.getBoundingClientRect();
    const worldX = (e.clientX - rect.left - offsetX) / scale;
    const worldY = (e.clientY - rect.top - offsetY) / scale;
    const hex = draggingStarship.fromHex;
    // angle from hex.center to mouse
    const dx = worldX - hex.centerX;
    const dy = worldY - hex.centerY;
    draggingStarship.starship.orbitAngle = Math.atan2(dy, dx);
    drawGrid();
  } else if (isDragging) {
    // Pan
    offsetX += e.clientX - dragStartX;
    offsetY += e.clientY - dragStartY;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    drawGrid();
  }
}

function onMouseUp(e) {
  if (draggingStarship) {
    // Check if we can drop starship in a new hex
    const rect = canvas.getBoundingClientRect();
    const worldX = (e.clientX - rect.left - offsetX) / scale;
    const worldY = (e.clientY - rect.top - offsetY) / scale;
    let dropHex = null;
    for (let h of hexGrid) {
      if (!h.isEmpty && pointInHex({ x: worldX, y: worldY }, h)) {
        dropHex = h;
        break;
      }
    }
    if (dropHex && dropHex !== draggingStarship.fromHex) {
      // Move starship to dropHex
      const oldHex = draggingStarship.fromHex;
      const idx = oldHex.starships.indexOf(draggingStarship.starship);
      if (idx >= 0) oldHex.starships.splice(idx, 1);
      dropHex.starships.push(draggingStarship.starship);
    } else {
      // Revert angle if not placed in a new hex
      draggingStarship.starship.orbitAngle = draggingStarship.originalAngle;
    }
    draggingStarship = null;
    drawGrid();
  }
  isDragging = false;
}

function onWheel(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  // current mouse world coords
  const mouseWorldX = (e.clientX - rect.left - offsetX) / scale;
  const mouseWorldY = (e.clientY - rect.top - offsetY) / scale;

  let factor = (e.deltaY < 0) ? 1.1 : 0.9;
  scale *= factor;

  // new screen coords of the same world point
  const newScreenX = mouseWorldX * scale + offsetX;
  const newScreenY = mouseWorldY * scale + offsetY;

  // adjust offset so mouse stays in place
  offsetX += (e.clientX - rect.left) - newScreenX;
  offsetY += (e.clientY - rect.top) - newScreenY;

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
  if (isDragging || draggingStarship) return; // ignore if still dragging
  const rect = canvas.getBoundingClientRect();
  const clickX = (e.clientX - rect.left - offsetX) / scale;
  const clickY = (e.clientY - rect.top - offsetY) / scale;

  // Check if a starship was clicked
  const starshipHit = findClickedStarship({ x: clickX, y: clickY });
  if (starshipHit) {
    activeStarship = starshipHit; // {starship, hex}
    // In this code, starships are edited via the left sidebar
    updateLeftSidebar();
    drawGrid();
    return;
  }

  // Otherwise find which hex was clicked
  let clickedHex = null;
  for (let h of hexGrid) {
    if (!h.isEmpty && pointInHex({ x: clickX, y: clickY }, h)) {
      clickedHex = h;
      break;
    }
  }

  // Select the hex
  activeHex = clickedHex;
  activeStarship = null;
  updateRightSidebar();
  updateLeftSidebar();
}

/***************************
 * Left Sidebar: Starships
 ***************************/
function updateLeftSidebar() {
  const leftBar = document.getElementById("leftSidebar");

  // If no hex is selected or the hex is empty, hide the left sidebar
  if (!activeHex || activeHex.isEmpty) {
    leftBar.style.display = "none";
    return;
  }
  // Show it
  leftBar.style.display = "block";

  const list = document.getElementById("starshipList");
  list.innerHTML = "";

  activeHex.starships.forEach(ship => {
    const div = document.createElement("div");
    div.className = "starship";

    const nameLabel = document.createElement("div");
    nameLabel.textContent = "Name:";
    div.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = ship.name;
    nameInput.addEventListener("change", e => {
      ship.name = e.target.value;
      drawGrid();
    });
    div.appendChild(nameInput);

    div.appendChild(document.createElement("br"));

    const notesLabel = document.createElement("div");
    notesLabel.textContent = "Notes:";
    div.appendChild(notesLabel);

    const notesArea = document.createElement("textarea");
    notesArea.value = ship.notes;
    notesArea.addEventListener("change", e => {
      ship.notes = e.target.value;
    });
    div.appendChild(notesArea);

    div.appendChild(document.createElement("br"));

    const selectBtn = document.createElement("button");
    selectBtn.textContent = "Select";
    selectBtn.addEventListener("click", () => {
      activeStarship = { starship: ship, hex: activeHex };
      updateLeftSidebar();
      drawGrid();
    });
    div.appendChild(selectBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const idx = activeHex.starships.indexOf(ship);
      if (idx >= 0) {
        activeHex.starships.splice(idx, 1);
        updateLeftSidebar();
        drawGrid();
      }
    });
    div.appendChild(deleteBtn);

    list.appendChild(div);
  });
}

function addStarshipToActiveHex() {
  if (!activeHex || activeHex.isEmpty) return;
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

  // If no hex is selected or the hex is empty, hide the right sidebar
  if (!activeHex || activeHex.isEmpty) {
    rightBar.style.display = "none";
    return;
  }
  // Show it
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
  draggingStarship = null;
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
    draggingStarship = null;
    updateLeftSidebar();
    updateRightSidebar();
  };
  reader.readAsText(file);
}

/********************************************************
 * FIXED FUNCTIONS BELOW
 * 1) findClickedStarship(point): Locates starship near
 *    the clicked point.
 * 2) pointInHex(point, hex): Checks if point is inside
 *    the 6-sided polygon for that hex.
 * 3) pointInPolygon(pt, vertices): Standard raycast test.
 ********************************************************/

// 1) Finds a starship if the user clicks near its triangle center
function findClickedStarship(point) {
  for (let h of hexGrid) {
    if (h.isEmpty) continue;
    for (let s of h.starships) {
      // Compute the starship's center
      const orbitRadius = HEX_EDGE_LENGTH * 0.8;
      const sx = h.centerX + orbitRadius * Math.cos(s.orbitAngle);
      const sy = h.centerY + orbitRadius * Math.sin(s.orbitAngle);

      // Check distance from click to starship center
      const dx = point.x - sx;
      const dy = point.y - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // 15px is a small “hit box” radius around the triangle
      if (dist < 15) {
        return { starship: s, hex: h };
      }
    }
  }
  return null;
}

// 2) Check if point lies inside hex
function pointInHex(point, hex) {
  // Get hex vertices
  const vertices = computeHexVertices(hex);
  return pointInPolygon(point, vertices);
}

// 3) Standard “point in polygon” using ray-casting
function pointInPolygon(pt, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
      (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
