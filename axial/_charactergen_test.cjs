// Run with node axial/_charactergen_test.cjs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const elements = new Map();
const storage = new Map();
const context = vm.createContext({
  document: {
    addEventListener() {},
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, {});
      return elements.get(id);
    }
  },
  sessionStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, value); }
  },
  location: { assign(url) { this.href = url; } },
  scrollTo() {}
});
context.window = context;
const run = source => vm.runInContext(source, context);
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
for (const script of read('charactergen.html').matchAll(/<script(?: src="([^"]+)")?>([\s\S]*?)<\/script>/g)) {
  run(script[1] ? read(script[1]) : script[2]);
}

const rules = context.AxialCharacterRules;
assert.equal(Object.keys(rules.kits).length, 3);
for (const kits of Object.values(rules.kits)) {
  assert.equal(Object.keys(kits).length, 5);
  for (const kit of Object.values(kits)) assert.ok(kit.every(item => /\d+ Mass$/.test(item)));
}
assert.equal(run('Object.keys(MAIN_LIFEPATHS).length'), 15);
assert.equal(rules.health(6, 8, 39).health, 24);
assert.equal(rules.health(6, 8, 40).health, 22);
assert.equal(rules.health(4, 4, 100).health, 0);

run(`
  S.name = 'Tal';
  S.birth = 'Keen';
  pickEarly('Tough');
  addMain('Salvager');
  S.mains[0].years = [2, 5];
  S.mains[0].skillChoice = 'Fortitude';
  addMain('Diplomat');
  S.mains[1].years = [6, 6];
  S.mains[1].power = 'Kingly Wit';
  S.setting = 'Science Fiction';
  S.kit = 'Expert';
  S.extraGear = 'Spare battery | 1 Mass';
  S.bonds = [{type: 'Favor', text: 'I owe Jules a berth.'}];
  S.powers = ['Surging Support', 'Kingly Wit', 'Steal the Moon'];
  tpPlus('early', 'Practical', 'Engineering');
  tpPlus('early', 'Social', 'Persuasion'); // The active pool allows only Practical and Combat.
`);
const sheet = run('getCharacterSheet()');
assert.equal(sheet.age, 39);
assert.equal(sheet.skills.Fortitude, 'd8');
assert.equal(sheet.vitals.Health, '24 / 24');
assert.equal(sheet.vitals.Surges, '0 / 10');
assert.equal(sheet.vitals.Encumbrance, '20 / 100');
assert.equal(sheet.vitals['Unspent TP'], 21);
assert.equal(sheet.gear.length, 10);
assert.equal(sheet.powers.length, 3, 'The same Diplomat and library power appears once.');
assert.equal(sheet.talents.find(t => t.name === 'Heist planning').die, 'd8');
assert.equal(sheet.talents.find(t => t.name === 'Engineering').die, 'd4');
assert.ok(!sheet.talents.some(t => t.name === 'Persuasion'));
assert.match(sheet.notes, /8 Practical\/Combat TP/);

run('go(6)');
assert.match(elements.get('main').innerHTML, /I owe Jules a berth/);
assert.match(elements.get('main').innerHTML, /Download Word/);
run('openDigitalSheet()');
assert.equal(context.location.href, 'axialcharactersheet.html?from=generator');
assert.equal(storage.get('axial.generator.sheet.v1'), JSON.stringify(sheet));

run(`
  removeMain(1);
  S.powers = [];
  S.kit = '';
  S.extraGear = '';
  pickEarly('Comfy');
`);
const revised = run('getCharacterSheet()');
assert.equal(revised.age, 27);
assert.equal(revised.vitals.Surges, '0 / 5');
assert.equal(revised.vitals.Encumbrance, '2 / 70');
assert.equal(revised.talents.length, 0);
assert.equal(revised.powers.length, 0);
assert.equal(revised.bonds.length, 1);
assert.equal(sheet.powers.length, 3, 'Earlier export snapshots stay intact after edits.');
console.log('Character creation, rules, starting gear, powers, and digital sheet handoff passed.');
