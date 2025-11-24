const nameInput = document.getElementById('nameInput');
const initInput = document.getElementById('initInput');
const hpInput = document.getElementById('hpInput');
const typeInput = document.getElementById('typeInput');
const addBtn = document.getElementById('addBtn');
const combatList = document.getElementById('combatList');
const nextTurnBtn = document.getElementById('nextTurnBtn');
const clearBtn = document.getElementById('clearBtn');

let combatants = [];
let currentTurnIndex = -1;

addBtn.addEventListener('click', addCombatant);
nextTurnBtn.addEventListener('click', nextTurn);
clearBtn.addEventListener('click', clearEncounter);

function addCombatant() {
    const name = nameInput.value.trim();
    const init = parseInt(initInput.value) || 0;
    const maxHp = parseInt(hpInput.value) || 10;
    const type = typeInput.value;

    if (!name) return;

    const combatant = {
        id: Date.now(),
        name,
        init,
        maxHp,
        currentHp: maxHp,
        type
    };

    combatants.push(combatant);
    sortCombatants();
    render();

    // Clear inputs
    nameInput.value = '';
    initInput.value = '';
    hpInput.value = '';
    nameInput.focus();
}

function sortCombatants() {
    combatants.sort((a, b) => b.init - a.init);
}

function nextTurn() {
    if (combatants.length === 0) return;
    currentTurnIndex++;
    if (currentTurnIndex >= combatants.length) {
        currentTurnIndex = 0;
    }
    render();
}

function clearEncounter() {
    if (confirm('Clear all combatants?')) {
        combatants = [];
        currentTurnIndex = -1;
        render();
    }
}

function updateHP(id, newHp) {
    const c = combatants.find(x => x.id === id);
    if (c) {
        c.currentHp = parseInt(newHp);
        // Optional: Visual feedback for low HP
    }
}

function removeCombatant(id) {
    combatants = combatants.filter(c => c.id !== id);
    if (currentTurnIndex >= combatants.length) currentTurnIndex = 0;
    render();
}

function render() {
    combatList.innerHTML = '';

    combatants.forEach((c, index) => {
        const li = document.createElement('li');
        li.className = `combatant-item ${c.type}`;
        if (index === currentTurnIndex) {
            li.style.borderLeft = '5px solid #fff';
            li.style.backgroundColor = '#333';
        }

        li.innerHTML = `
            <div style="flex: 1;">
                <span style="font-weight: bold; font-size: 1.1em;">${c.name}</span>
                <span style="color: #888; margin-left: 10px;">(Init: ${c.init})</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="number" value="${c.currentHp}" 
                    onchange="updateHP(${c.id}, this.value)"
                    style="width: 60px; background: #111; border: 1px solid #555; color: #fff; padding: 5px;">
                <span style="color: #666;">/ ${c.maxHp}</span>
                <button onclick="removeCombatant(${c.id})" style="background: none; border: none; color: #666; cursor: pointer;">&times;</button>
            </div>
        `;
        combatList.appendChild(li);
    });
}

// Expose functions to global scope for inline onclick handlers
window.updateHP = updateHP;
window.removeCombatant = removeCombatant;
