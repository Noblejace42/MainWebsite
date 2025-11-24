let journeyData = null;
let journeyLog = []; // Stores all legs and days
let currentLegIndex = 0;

// DOM Elements
const daysInput = document.getElementById('daysInput');
const biomeInput = document.getElementById('biomeInput');
const popInput = document.getElementById('popInput');
const harshInput = document.getElementById('harshInput');
const timeline = document.getElementById('timeline');

// Buttons
document.getElementById('generateBtn').addEventListener('click', () => startNewJourney());
document.getElementById('appendBtn').addEventListener('click', () => appendLeg());
document.getElementById('exportBtn').addEventListener('click', () => exportLog());

// Load Data
fetch('../assets/data/journey_data.json')
    .then(r => r.json())
    .then(data => {
        journeyData = data;
        console.log("Journey Data Loaded");
    })
    .catch(err => console.error("Failed to load journey data", err));

function startNewJourney() {
    journeyLog = [];
    timeline.innerHTML = '';
    currentLegIndex = 0;
    generateLeg();
}

function appendLeg() {
    currentLegIndex++;
    generateLeg();
}

function generateLeg() {
    if (!journeyData) return alert("Data not loaded yet!");

    const days = parseInt(daysInput.value);
    const biomeKey = biomeInput.value;
    const popKey = popInput.value;
    const harshKey = harshInput.value;

    const biome = journeyData.biomes[biomeKey];

    // Create Leg Header
    const legHeader = document.createElement('div');
    legHeader.innerHTML = `<h3 style="color: var(--accent-gold); border-bottom: 2px solid #444; margin-top: 30px;">Leg ${currentLegIndex + 1}: ${days} Days in ${biomeKey.toUpperCase()} (${harshKey})</h3>`;
    timeline.appendChild(legHeader);

    const legData = {
        index: currentLegIndex,
        biome: biomeKey,
        population: popKey,
        harshness: harshKey,
        days: []
    };

    let previousWeather = null;

    for (let i = 1; i <= days; i++) {
        const dayData = generateDay(i, biome, popKey, harshKey, previousWeather);
        previousWeather = dayData.weatherRaw; // Store for persistence check
        legData.days.push(dayData);
        renderDay(dayData);
    }

    journeyLog.push(legData);
}

function generateDay(dayNum, biome, popKey, harshKey, prevWeather) {
    // 1. Terrain
    const terrain = getRandom(biome.terrain);

    // 2. Weather
    let weatherType = 'neutral';
    let weatherDesc = '';

    // Simple persistence check (30% chance to keep previous weather)
    if (prevWeather && Math.random() < 0.3) {
        weatherDesc = prevWeather + " (Continuing)";
        weatherType = 'neutral'; // Simplified for persistence
    } else {
        const roll = Math.random();
        let thresholds = { pos: 0.33, neg: 0.66 }; // Default Moderate

        if (harshKey === 'safe') thresholds = { pos: 0.6, neg: 0.9 };
        if (harshKey === 'rugged') thresholds = { pos: 0.4, neg: 0.8 };
        if (harshKey === 'dangerous') thresholds = { pos: 0.2, neg: 0.6 };
        if (harshKey === 'deadly') thresholds = { pos: 0.1, neg: 0.4 };

        if (roll < thresholds.pos) weatherType = 'positive';
        else if (roll < thresholds.neg) weatherType = 'neutral';
        else weatherType = 'negative';

        // 50% Global, 50% Biome
        if (Math.random() < 0.5) {
            weatherDesc = getRandom(journeyData.weather[weatherType]);
        } else {
            weatherDesc = getRandom(biome.weather);
        }
    }

    // 3. Encounters (Multiple with Decay)
    let encounters = [];

    const popChances = { desolate: 0.05, sparse: 0.15, moderate: 0.3, dense: 0.6 };
    const combatChances = { safe: 0.05, rugged: 0.15, dangerous: 0.3, deadly: 0.5 };

    // Biome modifier
    let baseCombatChance = combatChances[harshKey] + (biome.danger_mod * 0.05);
    let baseSocialChance = popChances[popKey];

    // Loop for multiple encounters
    let eventChance = Math.max(baseCombatChance, baseSocialChance);

    let keepChecking = true;
    let loopCount = 0;

    while (keepChecking && loopCount < 5) { // Cap at 5
        if (Math.random() < eventChance) {
            // Event triggered! Determine type.
            const totalWeight = baseCombatChance + baseSocialChance;
            const roll = Math.random() * totalWeight;

            let encounterObj = null;

            if (roll < baseCombatChance) {
                // Combat
                const diffIndex = Math.min(5, Math.floor(Math.random() * 6) + (biome.danger_mod));
                const safeDiffIndex = Math.max(0, Math.min(5, diffIndex));

                const difficulty = journeyData.encounters.difficulties[safeDiffIndex];
                const modifier = getRandom(journeyData.encounters.combat_modifiers);
                encounterObj = { type: 'combat', text: `${difficulty} Combat - ${modifier}` };
            } else {
                // Social / Structure
                if (Math.random() < 0.5) {
                    // Structure
                    const struct = journeyData.encounters.structures.find(s => checkPop(s.min_pop, popKey) && Math.random() > 0.3) || getRandom(journeyData.encounters.structures);
                    encounterObj = { type: 'structure', text: `Structure: ${struct.name}` };
                } else {
                    // NPC
                    const npc = journeyData.encounters.npcs.find(n => checkPop(n.min_pop, popKey) && Math.random() > 0.3) || getRandom(journeyData.encounters.npcs);
                    encounterObj = { type: 'npc', text: `NPC: ${npc.name}` };
                }
            }

            encounters.push(encounterObj);

            // Decay chance for next encounter
            eventChance *= 0.5;
            loopCount++;
        } else {
            keepChecking = false;
        }
    }

    return {
        day: dayNum,
        terrain,
        weather: weatherDesc,
        weatherType,
        weatherRaw: weatherDesc.replace(" (Continuing)", ""),
        encounters
    };
}

function renderDay(dayData) {
    const card = document.createElement('div');
    card.className = 'day-card';

    let encounterHtml = '';
    if (dayData.encounters && dayData.encounters.length > 0) {
        dayData.encounters.forEach(enc => {
            const typeClass = `encounter-${enc.type}`;
            encounterHtml += `<div class="encounter-text ${typeClass}">• ${enc.text}</div>`;
        });
    } else {
        encounterHtml = `<div class="encounter-text" style="color: #666;">Uneventful travel.</div>`;
    }

    card.innerHTML = `
        <div class="day-header">
            <span class="day-title">Day ${dayData.day}</span>
            <button class="btn btn-small" onclick="regenerateDay(this, ${dayData.day})">Regenerate</button>
        </div>
        <div>
            <span class="tag">Terrain: ${dayData.terrain}</span>
            <span class="tag weather-${dayData.weatherType}">${dayData.weather}</span>
        </div>
        <div style="margin-top: 10px;">
            ${encounterHtml}
        </div>
    `;
    timeline.appendChild(card);
}

function regenerateDay(btn, dayNum) {
    const card = btn.closest('.day-card');

    // Ideally we store biome on the card or look up in log.
    // Let's grab biome from the current leg in log
    const currentLeg = journeyLog[journeyLog.length - 1];
    const biome = journeyData.biomes[currentLeg.biome];

    const newData = generateDay(dayNum, biome, currentLeg.population, currentLeg.harshness, null);

    // Update DOM
    let encounterHtml = '';
    if (newData.encounters && newData.encounters.length > 0) {
        newData.encounters.forEach(enc => {
            const typeClass = `encounter-${enc.type}`;
            encounterHtml += `<div class="encounter-text ${typeClass}">• ${enc.text}</div>`;
        });
    } else {
        encounterHtml = `<div class="encounter-text" style="color: #666;">Uneventful travel.</div>`;
    }

    card.innerHTML = `
        <div class="day-header">
            <span class="day-title">Day ${newData.day}</span>
            <button class="btn btn-small" onclick="regenerateDay(this, ${newData.day})">Regenerate</button>
        </div>
        <div>
            <span class="tag">Terrain: ${newData.terrain}</span>
            <span class="tag weather-${newData.weatherType}">${newData.weather}</span>
        </div>
        <div style="margin-top: 10px;">
            ${encounterHtml}
        </div>
    `;
}

function exportLog() {
    let text = "JOURNEY LOG\n===========\n\n";

    journeyLog.forEach(leg => {
        text += `LEG ${leg.index + 1}: ${leg.days.length} Days in ${leg.biome.toUpperCase()}\n`;
        text += `Conditions: ${leg.population} population, ${leg.harshness} harshness.\n`;
        text += "--------------------------------------------------\n";

        leg.days.forEach(d => {
            text += `Day ${d.day}: Traveled through ${d.terrain}. Weather was ${d.weather}.\n`;
            if (d.encounters && d.encounters.length > 0) {
                d.encounters.forEach(enc => {
                    text += `   > ENCOUNTER: ${enc.text}\n`;
                });
            }
            text += "\n";
        });
        text += "\n";
    });

    // Create download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'journey_log.txt';
    a.click();
}

// Helpers
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function checkPop(minPop, currentPop) {
    const levels = ['desolate', 'sparse', 'moderate', 'dense'];
    return levels.indexOf(currentPop) >= levels.indexOf(minPop);
}

// Expose to window
window.regenerateDay = regenerateDay;
