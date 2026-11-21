// Headless stress test for the Gear Forge engine (run: node _geargen_test.js)
const fs = require('fs');
const path = require('path');

// --- DOM stubs ---
const fakeEl = () => ({
  innerHTML: '', value: '', style: {}, textContent: '',
  classList: { toggle() { }, add() { }, remove() { } },
  scrollIntoView() { }
});
const els = {};
global.document = {
  getElementById: id => (els[id] || (els[id] = fakeEl())),
  createElement: () => ({ style: {}, click() { }, select() { }, remove() { }, set value(v) { }, href: '', download: '' }),
  body: { appendChild() { } },
  execCommand() { return true; }
};
global.window = { matchMedia: () => ({ matches: true }) };
global.navigator = {};
global.URL = { createObjectURL: () => '', revokeObjectURL: () => { } };
global.Blob = class { constructor() { } };

// --- load data + engine ---
const dataSrc = fs.readFileSync(path.join(__dirname, 'geardata.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, 'geargen.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 1) throw new Error('Expected exactly 1 inline script, got ' + scripts.length);

// In a browser, top-level consts are shared across <script> tags via the global
// lexical scope; emulate that by evaluating both sources together, and export
// the bits the test needs.
const exported = (0, eval)(dataSrc + '\n' + scripts[0] + `
;({ generateItem, structText, tagTip, toSheetObject, forgeItemFrom, WEAPONS, ERA_WEAPON_WEIGHTS, WEARABLES, TOOLS,
   quickGenerate, forgeGenerate, renderResults, copyAll, clearAll, setMode, addSupplyItem, supplyItem, SUPPLY_OBJECTS, items: () => items });
`);
const { generateItem, structText, tagTip, toSheetObject, forgeItemFrom, WEAPONS, ERA_WEAPON_WEIGHTS, WEARABLES, TOOLS,
  quickGenerate, forgeGenerate, renderResults, copyAll, clearAll, setMode, addSupplyItem, supplyItem, SUPPLY_OBJECTS, items: getItems } = exported;

// --- stress test ---
const eras = ['medieval', 'fantasy', 'modern', 'scifi', 'any'];
const types = ['weapon', 'tool', 'wearable', 'attachment', 'any'];
const tiers = ['crude', 'standard', 'fine', 'masterwork', 'legendary', 'random'];

let n = 0, structSamples = [];
const fail = (msg, item) => { console.error('FAIL:', msg, JSON.stringify(item, null, 2)); process.exit(1); };

for (const era of eras) for (const type of types) for (const tier of tiers) {
  for (let i = 0; i < 80; i++) {
    const item = generateItem({ era, type, tier });
    n++;
    if (!item.name || /undefined|NaN|null/.test(item.name)) fail('bad name', item);
    if (item.kind !== 'attachment' && ![4, 6, 8, 10, 12].includes(item.die)) fail('bad die', item);
    if (item.kind !== 'attachment' && (item.pot < 1 || item.pot > 5)) fail('bad potency', item);
    if (item.mass < 1) fail('bad mass', item);
    if (!types.includes(item.kind)) fail('bad kind', item);
    if (item.kind === 'weapon' && !item.range) fail('weapon missing range', item);
    if (item.kind === 'weapon' && !WEAPONS[item.subtype].names[item.era]) fail('subtype unavailable in era', item);
    if (item.kind === 'tool' && !item.core.some(t => t.startsWith('Aid|'))) fail('tool missing Aid', item);
    if (item.kind !== 'attachment' && !item.skills.length) fail('no skill tags', item);
    if (item.kind === 'attachment' && (item.die || !item.extras.length)) fail('bad attachment', item);
    if (!item.desc) fail('no description', item);
    const s = structText(item);
    if (/undefined|NaN|\[object/.test(s)) fail('bad struct: ' + s, item);
    // every tag in parens must resolve to a tooltip
    const groups = [...s.split('\n')[0].matchAll(/\(([^)]+)\)/g)];
    for (const g of groups) for (const tag of g[1].split(', ')) {
      if (!tagTip(tag)) fail('no tooltip for tag "' + tag + '" in: ' + s, item);
    }
    const sheet = toSheetObject(item);
    if (sheet.struct !== s || !sheet.name || (item.die && !sheet.size)) fail('bad sheet object', item);
    if (structSamples.length < 24 && Math.random() < .03) structSamples.push(s.replace('\n', ' '));
  }
}

// forge mode: pin every subtype combo once
for (const era of ['medieval', 'fantasy', 'modern', 'scifi']) {
  for (const sub of Object.keys(ERA_WEAPON_WEIGHTS[era])) {
    const item = forgeItemFrom({ era, type: 'weapon', sub, tier: 'random' });
    n++;
    if (item.subtype !== sub) fail(`forge pin failed: wanted ${sub} got ${item.subtype} (${era})`, item);
  }
  for (const slot of Object.keys(WEARABLES)) {
    const item = forgeItemFrom({ era, type: 'wearable', sub: slot, tier: 'random' });
    n++;
    if (item.subtype !== slot) fail(`forge wearable pin failed: ${slot}`, item);
  }
  for (const t of TOOLS.filter(t => (!t.eras || t.eras.includes(era)) && t.names[era])) {
    const item = forgeItemFrom({ era, type: 'tool', sub: t.talent, tier: 'random' });
    n++;
    if (!item.core.includes('Aid|' + t.talent)) fail(`forge tool pin failed: ${t.talent}`, item);
  }
  for (const mount of ['Permanent', 'Removable']) {
    const item = forgeItemFrom({ era, type: 'attachment', sub: mount, tier: 'random' });
    n++;
    if (!item.core.includes(mount)) fail('wrong attachment mount', item);
  }
}

// UI code paths
const $ = id => global.document.getElementById(id);
$('q-era').value = 'any'; $('q-type').value = 'any'; $('q-tier').value = 'random'; $('q-count').value = '10';
setMode('quick');
quickGenerate();
if (getItems().length !== 10) fail('quickGenerate count mismatch: ' + getItems().length);
if (!/item-card/.test(els['results'].innerHTML)) fail('renderResults produced no cards');
if (/undefined|NaN/.test(els['results'].innerHTML)) fail('renderResults HTML contains undefined/NaN');
setMode('forge');
forgeGenerate();
if (getItems().length !== 11) fail('forgeGenerate did not add an item');
copyAll({ classList: { add() { }, remove() { } }, textContent: '' });
clearAll();
if (getItems().length !== 0) fail('clearAll left unlocked items');
for (const [i, entry] of SUPPLY_OBJECTS.entries()) {
  $('supply-choice').value = String(i);
  addSupplyItem();
  const item = getItems()[0].item;
  if (item.name !== entry.name || !item.fixed || item.supplyCost !== entry.cost) fail('bad supplies item', item);
  if (toSheetObject(item).struct !== structText(supplyItem(entry))) fail('supplies export mismatch', item);
}
if (structText(getItems()[0].item) !== 'Glass Bottle | 1 Mass') fail('abbreviated object gained optional fields');
if (/undefined|NaN|0dnull/.test(els.results.innerHTML)) fail('bad supply card');

console.log(`OK — ${n} items generated with no failures. UI paths OK.\n\nSample structs:`);
structSamples.forEach(s => console.log('  ' + s));
