/********************************************
 * GALAXYGEN.JS
 ********************************************/

// Store all data about the galaxy in one object
let galaxyData = {
  clusters: [],     // {id, center:{x,y}, radius, nodeIDs:[]}
  nodes: [],        // {id, x, y, name, systemText, ships:[], clusterId}
  connections: [],  // {nodeA, nodeB, type: 'A'|'B'|'C'}
  view: {           // for panning & zooming
    offsetX: 0,
    offsetY: 0,
    scale: 1.0
  }
};

// Keep track of UI state
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let currentNode = null; // Reference to the node whose sidebar is open

//-------------------------------------
// Initialize on page load
//-------------------------------------
window.onload = function() {
  initializeGalaxyGenerator();
  generateGalaxy();
};

//-------------------------------------
// MAIN INITIALIZATION
//-------------------------------------
function initializeGalaxyGenerator() {
  const canvas = document.getElementById('galaxyCanvas');
  // Store references to important elements
  canvas.onmousedown = handleMouseDown;
  canvas.onmousemove = handleMouseMove;
  canvas.onmouseup   = handleMouseUp;
  canvas.onwheel     = handleMouseWheel;

  document.getElementById('resetViewBtn').onclick = handleResetView;

  document.getElementById('nodeSearchBtn').onclick = handleNodeSearch;
  document.getElementById('shipSearchBtn').onclick = handleShipSearch;
  document.getElementById('saveMapBtn').onclick = handleSaveMap;
  document.getElementById('loadMapInput').onchange = handleLoadMap;

  document.getElementById('closeSidebarBtn').onclick = closeSidebar;
  document.getElementById('regenerateSystemBtn').onclick = handleRegenerateSystem;
  document.getElementById('addShipBtn').onclick = handleAddShip;

  // Start continuous rendering
  requestAnimationFrame(animationLoop);
}

//-------------------------------------
// GALAXY GENERATION
//-------------------------------------
function generateGalaxy() {
  clearGalaxyData();

  // Randomly decide number of clusters
  let numberOfClusters = randomIntInRange(5, 10);

  // Create clusters
  for (let i = 0; i < numberOfClusters; i++) {
    createCluster(i);
  }

  // Place a total of 500 nodes distributed among clusters
  placeNodesInClusters(500);

  // Optionally place some "outer" stars outside clusters
  placeOuterStars();

  // Assign system data to each node
  galaxyData.nodes.forEach((node) => {
    let sysText = generateSystemText(); // from systemgen.js
    // let sysObj = generateSystem();    // also possible if you need extra data
    node.systemText = sysText;
    node.name = parseFirstLine(sysText);
    node.ships = [];
  });

  // Connect nodes
  connectClustersWithGreen();
  connectClustersWithBlue();
  connectClustersWithRedRandomly();

  // Ensure no overlapping green lines (same color overlap check)
  removeOverlappingConnectionsOfSameColor();
}

// Wipes out old data
function clearGalaxyData() {
  galaxyData.clusters = [];
  galaxyData.nodes = [];
  galaxyData.connections = [];
}

//-------------------------------------
// CLUSTER & NODE PLACEMENT
//-------------------------------------
function createCluster(clusterId) {
  let clusterCenter = {
    x: randomIntInRange(200, 1000),
    y: randomIntInRange(200, 600)
  };
  let clusterRadius = randomIntInRange(80, 200);

  galaxyData.clusters.push({
    id: clusterId,
    center: clusterCenter,
    radius: clusterRadius,
    nodeIDs: []
  });
}

// Distribute totalNodes among all clusters
function placeNodesInClusters(totalNodes) {
  let clusterCount = galaxyData.clusters.length;
  
  // Simple approach: just divide total equally (or add small random offset)
  let baseNodesPerCluster = Math.floor(totalNodes / clusterCount);

  galaxyData.clusters.forEach((cluster) => {
    let nodeCount = baseNodesPerCluster + randomIntInRange(-5, 5);
    if (nodeCount < 1) nodeCount = 1;

    for (let i = 0; i < nodeCount; i++) {
      // random angle & distance from the cluster center
      let angle = Math.random() * Math.PI * 2;
      let dist  = Math.random() * cluster.radius;
      let xPos  = cluster.center.x + Math.cos(angle) * dist;
      let yPos  = cluster.center.y + Math.sin(angle) * dist;

      let nodeId = galaxyData.nodes.length;
      galaxyData.nodes.push({
        id: nodeId,
        x: xPos,
        y: yPos,
        name: "",
        systemText: "",
        ships: [],
        clusterId: cluster.id
      });

      cluster.nodeIDs.push(nodeId);
    }
  });
}

// Optional: place extra stars far from clusters
function placeOuterStars() {
  for (let i = 0; i < 20; i++) {
    let nodeId = galaxyData.nodes.length;
    galaxyData.nodes.push({
      id: nodeId,
      x: randomIntInRange(50, 1150),
      y: randomIntInRange(50, 750),
      name: "",
      systemText: "",
      ships: [],
      clusterId: null  // indicates it's an "outer" star
    });
  }
}

//-------------------------------------
// CONNECTIONS
//-------------------------------------

// Intra-cluster: type A (green)
function connectClustersWithGreen() {
  galaxyData.clusters.forEach((cluster) => {
    let nodeIDs = cluster.nodeIDs;

    nodeIDs.forEach((nodeId) => {
      // find 1-3 nearest neighbors in the same cluster
      let nearest = findNearestNeighbors(nodeId, nodeIDs, 3);
      nearest.forEach((neighborId) => {
        // create a connection if none already exists
        if (!connectionExists(nodeId, neighborId)) {
          galaxyData.connections.push({
            nodeA: nodeId,
            nodeB: neighborId,
            type: 'A'
          });
        }
      });
    });
  });
}

// Between clusters: type B (blue)
function connectClustersWithBlue() {
  // For each cluster, link to the 2 nearest cluster centers
  galaxyData.clusters.forEach((cluster) => {
    let nearestTwo = findNearestClusters(cluster, 2);
    nearestTwo.forEach((c2) => {
      // pick a node near each cluster center to connect
      let nodeFromThisCluster = findClosestNodeToCenter(cluster);
      let nodeFromOtherCluster = findClosestNodeToCenter(c2);
      if (!connectionExists(nodeFromThisCluster.id, nodeFromOtherCluster.id)) {
        galaxyData.connections.push({
          nodeA: nodeFromThisCluster.id,
          nodeB: nodeFromOtherCluster.id,
          type: 'B'
        });
      }
    });
  });
}

// Distant: type C (red) – random far-apart clusters
function connectClustersWithRedRandomly() {
  if (galaxyData.clusters.length < 2) return;

  // Just pick a random number of long-distance connections
  let redConnectionsCount = randomIntInRange(1, 3);

  for (let i = 0; i < redConnectionsCount; i++) {
    let c1 = galaxyData.clusters[randomIntInRange(0, galaxyData.clusters.length - 1)];
    let c2 = galaxyData.clusters[randomIntInRange(0, galaxyData.clusters.length - 1)];
    if (c1.id === c2.id) continue; // pick another if same

    let node1 = findClosestNodeToCenter(c1);
    let node2 = findClosestNodeToCenter(c2);
    if (!connectionExists(node1.id, node2.id)) {
      galaxyData.connections.push({
        nodeA: node1.id,
        nodeB: node2.id,
        type: 'C'
      });
    }
  }
}

// Ensure no overlapping green lines (same color)
function removeOverlappingConnectionsOfSameColor() {
  let removed = [];
  for (let i = 0; i < galaxyData.connections.length; i++) {
    let connA = galaxyData.connections[i];
    for (let j = i+1; j < galaxyData.connections.length; j++) {
      let connB = galaxyData.connections[j];
      // only compare if same type
      if (connA.type === connB.type && connA.type === 'A') {
        // check if they overlap
        if (segmentsOverlap(connA, connB)) {
          removed.push(connB);
        }
      }
    }
  }
  // filter out the removed
  galaxyData.connections = galaxyData.connections.filter((c) => !removed.includes(c));
}

//-------------------------------------
// NODE SEARCH & NEIGHBOR HELPERS
//-------------------------------------

function findNearestNeighbors(nodeId, candidateIDs, maxNeighbors) {
  let origin = galaxyData.nodes[nodeId];
  // sort candidateIDs by distance
  let sorted = candidateIDs
    .filter(id => id !== nodeId)
    .sort((a, b) => {
      let distA = distanceBetweenNodes(origin, galaxyData.nodes[a]);
      let distB = distanceBetweenNodes(origin, galaxyData.nodes[b]);
      return distA - distB;
    });
  return sorted.slice(0, maxNeighbors);
}

function findNearestClusters(cluster, maxCount) {
  let centerA = cluster.center;
  let others = galaxyData.clusters.filter(c => c.id !== cluster.id);
  others.sort((c1, c2) => {
    let d1 = dist(centerA.x, centerA.y, c1.center.x, c1.center.y);
    let d2 = dist(centerA.x, centerA.y, c2.center.x, c2.center.y);
    return d1 - d2;
  });
  return others.slice(0, maxCount);
}

function findClosestNodeToCenter(cluster) {
  let closestNode = null;
  let minDist = Infinity;
  cluster.nodeIDs.forEach(nodeId => {
    let node = galaxyData.nodes[nodeId];
    let d = dist(cluster.center.x, cluster.center.y, node.x, node.y);
    if (d < minDist) {
      minDist = d;
      closestNode = node;
    }
  });
  return closestNode;
}

function connectionExists(nodeA, nodeB) {
  return galaxyData.connections.some(conn => {
    return (conn.nodeA === nodeA && conn.nodeB === nodeB) ||
           (conn.nodeA === nodeB && conn.nodeB === nodeA);
  });
}

//-------------------------------------
// INTERACTIVITY & SIDEBAR
//-------------------------------------

function openSidebar(nodeId) {
  let node = galaxyData.nodes[nodeId];
  currentNode = node;

  document.getElementById('systemTextArea').value = node.systemText;
  document.getElementById('systemDetailsSidebar').style.display = "block";
}

function closeSidebar() {
  // If user has edited text, update the node name from the first line
  if (currentNode) {
    let newText = document.getElementById('systemTextArea').value;
    currentNode.systemText = newText;
    currentNode.name = parseFirstLine(newText);
  }
  document.getElementById('systemDetailsSidebar').style.display = "none";
  currentNode = null;
}

// Regenerate the current node’s system details
function handleRegenerateSystem() {
  if (!currentNode) return;
  let newText = generateSystemText(); // from systemgen.js
  currentNode.systemText = newText;
  currentNode.name = parseFirstLine(newText);
  document.getElementById('systemTextArea').value = newText;
}

// Add ship to current node
function handleAddShip() {
  if (!currentNode) return;
  let newShipName = prompt("Enter ship name:") || ("Ship-" + Math.floor(Math.random()*1000));
  let newShip = {
    name: newShipName,
    orbitRadius: randomIntInRange(15, 30),
    angle: 0,
    speed: Math.random() * 0.02 + 0.01, // small random speed
    x: currentNode.x,
    y: currentNode.y
  };
  currentNode.ships.push(newShip);
}

//-------------------------------------
// SHIP ORBITS
//-------------------------------------
function updateShipOrbits() {
  // Each frame, increment angles and update positions
  galaxyData.nodes.forEach(node => {
    node.ships.forEach(ship => {
      ship.angle += ship.speed;
      ship.x = node.x + Math.cos(ship.angle) * ship.orbitRadius;
      ship.y = node.y + Math.sin(ship.angle) * ship.orbitRadius;
    });
  });
}

//-------------------------------------
// SEARCHING
//-------------------------------------
function handleNodeSearch() {
  let query = document.getElementById('nodeSearchInput').value.trim().toLowerCase();
  if (!query) return;
  let foundNode = galaxyData.nodes.find(n => n.name.toLowerCase().includes(query));
  if (foundNode) {
    centerViewOn(foundNode.x, foundNode.y);
    // Open sidebar to highlight or just show the node
    openSidebar(foundNode.id);
  }
}

function handleShipSearch() {
  let query = document.getElementById('shipSearchInput').value.trim().toLowerCase();
  if (!query) return;

  let found = null;
  galaxyData.nodes.forEach(node => {
    node.ships.forEach(ship => {
      if (ship.name.toLowerCase().includes(query)) {
        found = { node, ship };
      }
    });
  });

  if (found) {
    centerViewOn(found.node.x, found.node.y);
    // Optionally open sidebar on node
    openSidebar(found.node.id);
  }
}

//-------------------------------------
// PANNING & ZOOMING
//-------------------------------------
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
}

function handleMouseWheel(e) {
  e.preventDefault();
  let zoomFactor = 1.1;
  let oldScale = galaxyData.view.scale;
  let mouseX = e.clientX;
  let mouseY = e.clientY;

  if (e.deltaY < 0) {
    galaxyData.view.scale *= zoomFactor;
  } else {
    galaxyData.view.scale /= zoomFactor;
  }

  // Center zoom on the mouse position
  let newScale = galaxyData.view.scale;
  // adjust offsets so the (mouseX, mouseY) stays in the same place
  galaxyData.view.offsetX = mouseX - ((mouseX - galaxyData.view.offsetX) * (newScale / oldScale));
  galaxyData.view.offsetY = mouseY - ((mouseY - galaxyData.view.offsetY) * (newScale / oldScale));
}

function handleResetView() {
  galaxyData.view.offsetX = 0;
  galaxyData.view.offsetY = 0;
  galaxyData.view.scale = 1.0;
}

//-------------------------------------
// ANIMATION LOOP
//-------------------------------------
function animationLoop() {
  let canvas = document.getElementById('galaxyCanvas');
  let ctx = canvas.getContext('2d');

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // apply pan/zoom transformations
  ctx.save();
  ctx.translate(galaxyData.view.offsetX, galaxyData.view.offsetY);
  ctx.scale(galaxyData.view.scale, galaxyData.view.scale);

  // draw connections
  galaxyData.connections.forEach(conn => {
    drawConnection(ctx, conn);
  });

  // update ship orbits
  updateShipOrbits();

  // draw nodes & ships
  galaxyData.nodes.forEach(node => {
    drawNode(ctx, node);
    node.ships.forEach(ship => {
      drawShip(ctx, ship);
    });
  });

  ctx.restore();

  requestAnimationFrame(animationLoop);
}

//-------------------------------------
// DRAWING FUNCTIONS
//-------------------------------------
function drawNode(ctx, node) {
  ctx.beginPath();
  ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  // Optionally draw node name
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "12px Arial";
  ctx.fillText(node.name, node.x + 6, node.y - 6);
}

function drawConnection(ctx, conn) {
  let nodeA = galaxyData.nodes[conn.nodeA];
  let nodeB = galaxyData.nodes[conn.nodeB];
  if (!nodeA || !nodeB) return;

  let strokeColor;
  if (conn.type === 'A') strokeColor = "green";
  else if (conn.type === 'B') strokeColor = "blue";
  else strokeColor = "red";

  ctx.beginPath();
  ctx.moveTo(nodeA.x, nodeA.y);
  ctx.lineTo(nodeB.x, nodeB.y);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawShip(ctx, ship) {
  ctx.beginPath();
  ctx.arc(ship.x, ship.y, 2, 0, 2 * Math.PI);
  ctx.fillStyle = "#FF9900";
  ctx.fill();

  // ship label
  ctx.fillStyle = "#FF9900";
  ctx.font = "10px Arial";
  ctx.fillText(ship.name, ship.x + 3, ship.y - 3);
}

//-------------------------------------
// SAVE & LOAD
//-------------------------------------
function handleSaveMap() {
  let dataStr = JSON.stringify(galaxyData, null, 2);
  let blob = new Blob([dataStr], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement('a');
  a.href = url;
  a.download = "galaxyMap.json";
  a.click();
  URL.revokeObjectURL(url);
}

function handleLoadMap(e) {
  let file = e.target.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = function(evt) {
    let content = evt.target.result;
    let obj = JSON.parse(content);
    galaxyData = obj; // Overwrite the global
  };
  reader.readAsText(file);
}

//-------------------------------------
// UTILITY
//-------------------------------------
function centerViewOn(x, y) {
  // Attempt to center the view so that (x, y) is in the middle of canvas
  let canvas = document.getElementById('galaxyCanvas');
  galaxyData.view.offsetX = (canvas.width / 2) - x * galaxyData.view.scale;
  galaxyData.view.offsetY = (canvas.height / 2) - y * galaxyData.view.scale;
}

function parseFirstLine(text) {
  return text.split('\n')[0] || "";
}

function distanceBetweenNodes(n1, n2) {
  return dist(n1.x, n1.y, n2.x, n2.y);
}

function segmentsOverlap(connA, connB) {
  // Simplistic check: if the endpoints are the same or they cross
  // This can be made more robust by line intersection formulas
  let A1 = galaxyData.nodes[connA.nodeA];
  let A2 = galaxyData.nodes[connA.nodeB];
  let B1 = galaxyData.nodes[connB.nodeA];
  let B2 = galaxyData.nodes[connB.nodeB];

  // Example: if any share endpoints, consider it "overlap"
  if (A1 === B1 || A1 === B2 || A2 === B1 || A2 === B2) {
    return true;
  }
  // Or do a line intersection test. For brevity, we’ll treat shared endpoints as overlap
  return false;
}

// Basic distance function
function dist(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx*dx + dy*dy);
}

// Return an integer in [min, max]
function randomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
