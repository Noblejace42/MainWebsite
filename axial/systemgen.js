/* Plain objects in, plain objects out. No network, dependencies or build step. */
(function () {
  'use strict';
  const T = globalThis.SystemTables;
  const VERSION = 1;
  const clone = x => JSON.parse(JSON.stringify(x));
  function rng(seed) {
    let h = 2166136261;
    for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => { h += 0x6D2B79F5; let t = Math.imul(h ^ h >>> 15, 1 | h); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const roll = r => ({
    int: (a, b) => Math.floor(r() * (b - a + 1)) + a,
    pick: a => a[Math.floor(r() * a.length)],
    weighted: a => { let n = r() * a.reduce((s, x) => s + x[1], 0); return a.find(x => (n -= x[1]) < 0)[0]; },
    chance: p => r() < p
  });
  const round = (v, n = 2) => Number(v.toFixed(n));
  const person = q => q.pick(T.first) + ' ' + q.pick(T.last);
  const defaults = {preset: 'random', population: 'sparse', planets: '', settlements: '', placement: 'mixed', development: 'random', danger: 'quiet', traffic: 'sparse', military: 'light', star: 'random', required: '', belt: 'random', seed: '', name: ''};
  const enumOptions = {preset: Object.keys(T.presets), population: ['sparse', 'tiny', 'established'], placement: ['mixed', 'surface', 'orbital'], development: ['random', 'basic', 'maintained', 'specialist'], danger: ['quiet', 'strained', 'dangerous'], traffic: ['none', 'sparse', 'normal', 'busy'], military: ['none', 'light', 'substantial'], star: ['random', 'single', 'binary', 'trinary'], required: ['', 'temperate', 'station', 'depot'], belt: ['random', 'none', 'barren', 'rich']};
  function options(input = {}) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Survey parameters must be an object.');
    const o = Object.fromEntries(Object.keys(defaults).map(k => [k, input[k] === undefined ? defaults[k] : input[k]]));
    for (const [k, values] of Object.entries(enumOptions)) if (!values.includes(o[k])) throw Error('Invalid setting: ' + k);
    for (const [k, max] of [['planets', 8], ['settlements', 10]]) {
      if (o[k] !== '' && (!/^\d+$/.test(String(o[k])) || Number(o[k]) > max)) throw Error(`${k}: choose an integer from 0 to ${max}, or Random.`);
    }
    for (const k of ['seed', 'name']) if (typeof o[k] !== 'string' || o[k].length > 100) throw Error(k + ' must be text of at most 100 characters.');
    if (o.planets !== '' && Number(o.planets) === 0 && (o.placement === 'surface' || o.required === 'temperate')) throw Error('A surface settlement or temperate world needs at least one planet.');
    if (o.required === 'station' && o.placement === 'surface') throw Error('A required orbital station needs Mixed or Orbital placement.');
    if ((o.settlements !== '' && Number(o.settlements) === 0 || o.preset === 'uninhabited') && ['station', 'depot'].includes(o.required)) throw Error('A staffed station or depot needs at least one settlement.');
    if (o.preset === 'uninhabited' && o.settlements !== '' && Number(o.settlements) > 0) throw Error('Uninhabited systems have zero settlements. Choose another role to add residents.');
    return o;
  }
  function makeStar(q, o) {
    const s = clone(q.weighted(T.stars.map(s => [s, s.weight])));
    const configuration = o.star === 'random' ? q.weighted([['single', 8], ['binary', 2], ['trinary', .3]]) : o.star;
    return {...s, configuration, companions: configuration === 'single' ? '' : `${configuration === 'binary' ? 'One distant red-dwarf companion' : 'A distant red-dwarf pair'}; wide configuration, ${q.int(8, 24) * 100} AU from the primary. Listed planets orbit the primary.`};
  }
  function makeBody(q, star, index, au, forceTemperate = false) {
    const flux = star.luminosity / (au * au);
    const type = forceTemperate ? 'temperate' : flux > 2 ? q.pick(['rock', 'greenhouse', 'volcanic', 'iron']) : flux > .45 ? q.pick(['rock', 'desert', 'temperate', 'salt', 'ocean']) : flux > .08 ? q.pick(['rock', 'desert', 'ice', 'gas', 'tundra']) : q.pick(['ice', 'carbon', 'gas', 'rock', 'iron']);
    const t = T.bodies[type];
    return {id: `p${index}`, name: `World ${index + 1}`, type, au: round(au, 3), period: round(Math.sqrt(au ** 3 / star.mass), 2), temperature: Math.round(255 * flux ** .25), gravity: t.gravity ? round(t.gravity[0] + q.int(0, 100) / 100 * (t.gravity[1] - t.gravity[0])) : null, terrain: q.pick(t.terrain), resource: q.pick(t.resources), moons: type === 'gas' ? q.int(3, 18) : q.weighted([[0, 6], [1, 3], [2, 1]]), locked: false, notes: '', orbit: []};
  }
  function makeFleet(q, o, id) {
    const kind = q.weighted([['cargo', 6], ['survey', 3], ['salvage', 2], ['transit', 2], ['patrol', o.military === 'none' ? 0 : o.military === 'substantial' ? 5 : 1]]);
    const table = T.fleets[kind];
    const count = q.weighted([[1, 12], [2, 3], [3, 1]]);
    return {id, kind, name: `${q.pick(T.names)} ${table.label}`, count, vessel: q.pick(table.ships), crew: count * q.int(3, 12), affiliation: kind === 'patrol' ? 'Local service contract' : q.pick(['Independent operator', 'Chartered cooperative', 'Private concession', 'Inter-system contract']), activity: q.pick(table.activities), disposition: o.danger === 'dangerous' ? q.pick(['Wary', 'Distressed', 'Hostile']) : q.pick(['Routine', 'Wary', 'Routine']), locked: false};
  }
  function makeOrbit(q, o, prefix) {
    const n = o.traffic === 'none' ? 0 : o.traffic === 'sparse' ? q.weighted([[0, 8], [1, 2]]) : o.traffic === 'normal' ? q.weighted([[0, 3], [1, 5], [2, 1]]) : q.int(1, 3);
    return Array.from({length: n}, (_, i) => makeFleet(q, o, `${prefix}-v${i}`));
  }
  function makeSettlement(q, o, id, bodyId, location, forcedPurpose) {
    const role = {refining:['iceworks','recycling','ceramics','mining'],shipyard:['fabrication','workshop','construction','salvage'],power:['fuel','workshop','research','fabrication'],resettled:['construction','agriculture','recycling','medical'],storage:['trade','archive','fuel','waystation'],enclave:['agriculture','workshop','mining','trade'],frontier: ['mining','survey','waystation','construction'], extraction: ['mining','iceworks','survey','recycling'], industrial: ['workshop','ceramics','fabrication','recycling'], trade: ['trade','waystation','fuel','comms'], research: ['research','observatory','quarantine','archive'], military: ['military','comms','fuel','medical'], agricultural: ['agriculture','agriculture','recycling','medical'], failed: ['mining','construction','salvage','iceworks'], contested: ['fuel','military','trade','survey']};
    const purpose = forcedPurpose || (q.chance(.8) && role[o.preset] ? q.pick(role[o.preset]) : q.pick(Object.keys(T.purposes)));
    const p = T.purposes[purpose];
    const state = o.preset === 'failed' ? q.weighted([['abandoned', 5], ['declining', 3], ['stable', 1]]) : q.weighted([['stable', 8], ['growing', 2], ['declining', 2], ['under construction', 1]]);
    const range = o.population === 'tiny' ? [4, 32] : o.population === 'established' ? [1500, 15000] : q.weighted([[[100, 1500], 90], [[1501, 5000], 8], [[5001, 15000], 2]]);
    const population = state === 'abandoned' ? 0 : q.int(...range);
    const development = o.development === 'random' ? q.weighted([['basic', 3], ['maintained', 6], ['specialist', 1]]) : o.development;
    const government = purpose === 'military' ? 'military' : ['research','observatory','quarantine'].includes(purpose) ? q.pick(['research','expedition','custodial']) : q.pick(['cooperative','cooperative','corporate','independent','syndicate','family','leasehold','municipal','contractor','custodial','partnership','commons','receivership','guild','port']);
    const services = population ? [...p.services, 'Emergency shelter'] : [];
    const guards = population && o.military !== 'none' ? Math.max(0, Math.floor(population * (purpose === 'military' ? .18 : .015))) : 0;
    return completeSite({id, bodyId, location, name: q.pick(T.siteNames) + ' ' + q.pick(['Station', 'Habitat', 'Annex', 'Hold', 'Site', 'Works', 'Post', 'Cooperative']), purpose, state, population, development, government, leader: population ? person(q) : 'No permanent staff', export: population ? q.pick(p.exports) : 'No active output', need: population ? q.pick(p.need) : 'A complete recommissioning survey', services: [...new Set(services)], issue: state === 'abandoned' ? q.pick(T.abandoned) + ' Power and pressure integrity are unverified.' : q.chance(o.danger === 'quiet' ? .35 : .85) ? q.pick(T.conditions) : q.pick(T.quiet), support: population ? `${q.int(4, 16)} weeks of critical stores at current occupancy` : 'No certified reserves', power: population > 500 ? `${Math.ceil(population * .015)} MW firm life-support and domestic electrical capacity, distributed fission units with N+1 redundancy; industrial loads supplied separately` : population ? q.pick(T.powers[development].filter(x => !x.startsWith('Solar'))) : 'Offline; recommissioning required', habitat: population > 500 ? `${Math.ceil(population / 250)} independently isolatable residential sectors; ${location === 'orbital' ? 'shielded rotating habitat cluster' : 'buried residential galleries'} with capacity for ${Math.ceil(population * 1.2)} residents` : q.pick(T.habitats[location]), facility: q.pick(p.facilities), guards, locked: false, notes: ''});
  }
  function completeSite(s) {
    const q = roll(rng(s.id + ':' + s.name + ':' + s.export));
    const sample = (items, n) => { const pool = [...new Set(items)], result = []; while(pool.length && result.length < n) result.push(pool.splice(q.int(0,pool.length-1),1)[0]); return result; };
    if (!s.exports) s.exports = s.population ? [...new Set([s.export, ...sample(T.purposes[s.purpose].exports, s.population < 100 ? 1 : q.int(2,4))])] : [];
    if (!s.structures) s.structures = [...sample(T.structures[s.purpose] || ['Workshop','Storage depot','Operations office','Equipment bay'], q.int(2,3)), ...sample(T.commonStructures, s.population > 500 ? 2 : 1)];
    const production = T.productionBuildings[s.purpose];
    if (production && !s.structures.includes(production)) s.structures[0] = production;
    if (!s.defenses) {
      const cutters = s.guards >= 80 && q.chance(.25) ? Math.min(2,Math.floor(s.guards/80)) : 0;
      const crew = cutters * 8;
      const vehicles = s.location === 'surface' ? Math.floor((s.guards-crew)/30) : 0;
      s.defenses = {personnel:s.guards, soldiers:s.guards-crew, fleetCrew:crew, armoredVehicles:vehicles, patrolCutters:cutters, emplacements:Math.min(4,Math.floor((s.guards-crew)/25))};
    }
    return s;
  }
  function generate(input = {}) {
    const o = options(input), q = roll(rng(o.seed || 'axial'));
    const star = makeStar(q, o);
    const n = o.planets === '' ? q.weighted([[0, 1], [1, 2], [2, 4], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1], [8, 1]]) : Number(o.planets);
    const count = o.preset === 'uninhabited' ? 0 : o.settlements === '' ? q.weighted([[0, 2], [1, 6], [2, 4], [3, 2], [4, .5]]) : Number(o.settlements);
    let bodies = [], au = Math.max(.035, Math.sqrt(star.luminosity) * .38);
    const actualN = o.required === 'temperate' && n === 0 ? 1 : n;
    for (let i = 0; i < actualN; i++) {
      au *= 1.65 + q.int(0, 45) / 100;
      bodies.push(makeBody(q, star, i, au));
    }
    if (o.required === 'temperate') {
      const target = Math.sqrt(star.luminosity), closest = bodies.reduce((a, b) => Math.abs(a.au - target) < Math.abs(b.au - target) ? a : b);
      bodies[bodies.indexOf(closest)] = makeBody(q, star, Number(closest.id.slice(1)), target, true);
      bodies.sort((a, b) => a.au - b.au);
    }
    if (o.placement === 'surface' && !bodies.some(b => !['gas', 'greenhouse'].includes(b.type))) {
      if (!bodies.length) bodies.push(makeBody(q, star, 0, .5));
      bodies[0] = {...makeBody(q, star, 0, bodies[0].au), type: 'rock', gravity: .28, terrain: T.bodies.rock.terrain[0], resource: T.bodies.rock.resources[0]};
    }
    const name = o.name.trim() || q.pick(T.names) + ' ' + q.int(10, 99);
    bodies.forEach((b, i) => { b.name = `${name.slice(0, 94)} ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i]}`; b.orbit = makeOrbit(q, o, b.id); });
    const settlements = [];
    const wanted = ['station', 'depot'].includes(o.required) ? Math.max(count, 1) : count;
    for (let i = 0; i < wanted; i++) {
      const forceOrbit = o.placement === 'orbital' || i === 0 && o.required === 'station';
      const candidates = o.placement === 'surface' ? bodies.filter(b => !['gas', 'greenhouse'].includes(b.type)) : bodies;
      const b = candidates.length ? q.pick(candidates) : null;
      const location = !b || forceOrbit || ['gas', 'greenhouse'].includes(b.type) || o.placement !== 'surface' && q.chance(.35) ? 'orbital' : 'surface';
      const s = makeSettlement(q, o, `s${i}`, b?.id || null, location, i === 0 && o.required === 'depot' ? 'fuel' : undefined);
      if (i === 0 && ['station', 'depot'].includes(o.required) && !s.population) { s.state = 'stable'; s.population = o.population === 'established' ? 1500 : o.population === 'tiny' ? 4 : 100; s.leader = person(q); s.services = [...T.purposes[s.purpose].services, 'Emergency shelter']; s.export = T.purposes[s.purpose].exports[0]; s.need = T.purposes[s.purpose].need[0]; s.support = '4 weeks of critical stores at current occupancy'; s.power = 'Recommissioned fission module with emergency reserves'; s.issue = 'Recently recommissioned; equipment checks continue.'; }
      if(s.population && !s.exports.length) { delete s.exports; delete s.defenses; completeSite(s); }
      settlements.push(s);
    }
    const belt = o.belt === 'random' ? q.weighted([['none', 4], ['barren', 3], ['rich', 3]]) : o.belt;
    const remotePool = [...T.remote];
    const remote = Array.from({length: q.int(1, 3)}, (_, i) => { const t = remotePool.splice(q.int(0, remotePool.length - 1), 1)[0]; return {id: `r${i}`, name: t[0], description: t[1], type: t[2]}; });
    return {version: VERSION, seed: o.seed || 'axial', options: o, name, star, bodies, settlements, transit: makeOrbit(q, o, 'deep'), belt, remote, notes: '', revision: 0};
  }
  function validate(s) {
    if (!s || s.version !== VERSION) throw Error('This file is not a version 1 Axial system dossier.');
    const text = (x, max = 2000) => typeof x === 'string' && x.length <= max;
    const num = (x, max = 1e6) => Number.isFinite(x) && x >= 0 && x <= max;
    const arr = (x, max) => Array.isArray(x) && x.length <= max;
    const fleet = f => f && text(f.id, 100) && Object.hasOwn(T.fleets, f.kind) && ['name', 'vessel', 'affiliation', 'activity', 'disposition'].every(k => text(f[k])) && Number.isInteger(f.count) && f.count > 0 && f.count <= 10 && num(f.crew) && typeof f.locked === 'boolean';
    if (!s.options || typeof s.options !== 'object' || Array.isArray(s.options)) throw Error('The dossier is missing its generation parameters.');
    s.options = options(s.options);
    if (!text(s.name, 100) || !text(s.seed, 100) || !text(s.notes) || !Number.isInteger(s.revision) || s.revision < 0 || !s.star || !text(s.star.name) || !text(s.star.type) || !text(s.star.note) || !text(s.star.companions) || !['single', 'binary', 'trinary'].includes(s.star.configuration) || !num(s.star.mass, 10) || s.star.mass <= 0 || !num(s.star.luminosity, 100) || !arr(s.bodies, 8) || !arr(s.settlements, 10) || !arr(s.transit, 12) || !arr(s.remote, 10) || !['none', 'barren', 'rich'].includes(s.belt)) throw Error('The dossier has invalid or missing fields.');
    const ids = new Set();
    for (const b of s.bodies) {
      if (!b || !text(b.id, 100) || ids.has(b.id) || !text(b.name, 100) || !Object.hasOwn(T.bodies, b.type) || !['au', 'period', 'temperature', 'moons'].every(k => num(b[k])) || !(b.gravity === null || num(b.gravity, 100)) || !text(b.terrain) || !text(b.resource) || !text(b.notes) || typeof b.locked !== 'boolean' || !arr(b.orbit, 12) || !b.orbit.every(fleet)) throw Error('Invalid planetary record.');
      ids.add(b.id);
    }
    const siteIds = new Set();
    for (const x of s.settlements) {
      if (!x || !text(x.id, 100) || siteIds.has(x.id) || !(x.bodyId === null || ids.has(x.bodyId)) || !['surface', 'orbital'].includes(x.location) || x.location === 'surface' && (x.bodyId === null || ['gas', 'greenhouse'].includes(s.bodies.find(b => b.id === x.bodyId)?.type)) || !Object.hasOwn(T.purposes, x.purpose) || !Object.hasOwn(T.governments, x.government) || !['name', 'state', 'leader', 'export', 'need', 'issue', 'support', 'power', 'notes', 'development'].every(k => text(x[k])) || !['habitat','facility'].every(k => x[k] === undefined || text(x[k])) || !num(x.population, 100000) || !num(x.guards, 10000) || !arr(x.services, 15) || !x.services.every(v => text(v, 100)) || typeof x.locked !== 'boolean') throw Error('Invalid settlement record.');
      for(const key of ['exports','structures']) if(x[key] !== undefined && (!arr(x[key],12) || !x[key].every(v=>text(v,200)))) throw Error('Invalid settlement '+key);
      if(x.defenses !== undefined && (!x.defenses || !['personnel','soldiers','fleetCrew','armoredVehicles','patrolCutters','emplacements'].every(k=>Number.isInteger(x.defenses[k])&&num(x.defenses[k],10000)) || x.defenses.personnel !== x.guards || x.defenses.soldiers+x.defenses.fleetCrew !== x.guards || x.defenses.fleetCrew !== x.defenses.patrolCutters*8)) throw Error('Invalid defense record.');
      completeSite(x);
      siteIds.add(x.id);
    }
    if (!s.transit.every(fleet) || !s.remote.every(x => x && ['name', 'type', 'description'].every(k => text(x[k])))) throw Error('Invalid orbital or remote record.');
    return s;
  }
  function toText(original) {
    const s=clone(original); s.settlements.forEach(completeSite);
    const lines=[];
    const heading=(title,level=1)=>lines.push('',title, (level===1?'=':'-').repeat(Math.min(76,title.length)));
    const field=(label,value,indent='')=>lines.push(indent+label+': '+String(value??'').replace(/\n/g,'\n'+indent+'  '));
    const list=(label,items)=>{lines.push('  '+label+':'); (items.length?items:['None']).forEach(x=>lines.push('    - '+x));};
    const site=x=>{
      heading('SETTLEMENT: '+x.name,2);
      field('Location',x.location,'  '); field('Type',T.purposes[x.purpose].label,'  ');
      field('Population',x.population.toLocaleString('en-US'),'  '); field('Development',x.development,'  '); field('Status',x.state,'  ');
      field('Government',T.governments[x.government][0],'  ');field(T.governments[x.government][1],x.leader,'  ');
      list('Exports / resources',x.exports);field('Imports needed',x.need,'  ');list('Structures',x.structures);
      field('Military personnel',x.defenses.soldiers,'  ');field('Fleet crew (resident)',x.defenses.fleetCrew,'  ');
      field('Armored vehicles',x.defenses.armoredVehicles,'  ');field('Defensive emplacements',x.defenses.emplacements,'  ');field('Local patrol cutters',x.defenses.patrolCutters,'  ');
      field('Conditions',x.issue,'  ');
      lines.push('','  INFRASTRUCTURE');field('Habitat',x.habitat || '', '  ');field('Power',x.power,'  ');field('Stores',x.support,'  ');field('Facility',x.facility || T.purposes[x.purpose].facility,'  ');list('Available services',x.services);
      field('Locked',x.locked?'Yes':'No','  ');if(x.notes)field('Notes',x.notes,'  ');
    };
    const fleet=f=>{heading('VISITING FLEET: '+f.name,2);for(const [k,v] of [['Vessel',f.vessel],['Hulls',f.count],['Transient crew',f.crew],['Affiliation',f.affiliation],['Disposition',f.disposition],['Activity',f.activity],['Locked',f.locked?'Yes':'No']])field(k,v,'  ');};
    heading('AXIAL SYSTEM: '+s.name);field('Seed',s.seed);field('Version / revision',s.version+' / '+s.revision);field('System role',T.presets[s.options.preset][0]);field('Residents',s.settlements.reduce((n,x)=>n+x.population,0).toLocaleString('en-US')+' (visiting crews excluded)');field('Belt',s.belt);
    heading('PRIMARY STAR',2);field('Star',s.star.name+' / '+s.star.type);field('Configuration',s.star.configuration);field('Mass',s.star.mass+' solar masses');field('Luminosity',s.star.luminosity+' solar luminosities');field('Description',s.star.note);if(s.star.companions)field('Companions',s.star.companions);if(s.notes)field('System notes',s.notes);
    for(const b of s.bodies){const t=T.bodies[b.type];heading('WORLD: '+b.name+' / '+t.label);for(const [k,v] of [['Orbit',b.au+' AU'],['Period',b.period+' Earth years'],['Equilibrium temperature',b.temperature+' K (not surface temperature)'],['Gravity',b.gravity===null?'No solid surface':b.gravity+' g'],['Atmosphere',t.air],['Terrain',b.terrain],['Resource',b.resource],['Surveyed moons',b.moons],['Environment',t.note],['Locked',b.locked?'Yes':'No']])field(k,v);if(b.notes)field('Notes',b.notes);
      for(const location of ['surface','orbital']){heading(location==='surface'?'SURFACE':'ORBIT',2);const sites=s.settlements.filter(x=>x.bodyId===b.id&&x.location===location);sites.forEach(site);if(!sites.length)lines.push('  No settlements.');if(location==='orbital'){b.orbit.forEach(fleet);if(!b.orbit.length)lines.push('  No visiting ships.');}}
    }
    heading('OTHER LOCATIONS');s.settlements.filter(x=>x.bodyId===null).forEach(site);s.transit.forEach(fleet);s.remote.forEach(r=>{heading(r.name,2);field('Type',r.type);field('Description',r.description);});
    heading('NAVIGATION');lines.push(navigation(s));heading('LOGISTICS');lines.push(connection(s));
    heading('GENERATION SETTINGS',2);for(const [k,v] of Object.entries(s.options))field(k,v===''?'Random / unspecified':v);
    return lines.join('\n').trim()+'\n';
  }
  function navigation(s) { return roll(rng(s.seed + ':navigation')).pick(T.navigation); }
  function rerollUnlocked(original) {
    const s = clone(original), q = roll(rng(`${s.seed}:unlocked:${s.revision}`));
    const lockedWorlds = new Set(s.bodies.filter(b => b.locked).map(b => b.id));
    const orbit = (list, id) => {
      const locked = list.filter(f => f.locked);
      return [...locked, ...makeOrbit(q, s.options, `${id}-rev${s.revision}`).slice(0, 12 - locked.length)];
    };
    for (const b of s.bodies) {
      if (b.locked) continue;
      const next = makeBody(q, s.star, 0, b.au);
      if (s.settlements.some(x => x.bodyId === b.id && x.location === 'surface') && ['gas','greenhouse'].includes(next.type)) {
        next.type = 'rock'; next.gravity = .28; next.terrain = q.pick(T.bodies.rock.terrain); next.resource = q.pick(T.bodies.rock.resources);
      }
      Object.assign(b, next, {id: b.id, name: b.name, notes: b.notes, orbit: orbit(b.orbit, b.id)});
    }
    s.settlements = s.settlements.map(x => x.locked || lockedWorlds.has(x.bodyId) ? x : {...makeSettlement(q, s.options, x.id, x.bodyId, x.location), notes:x.notes});
    s.transit = orbit(s.transit, 'deep');
    s.revision++;
    return validate(s);
  }
  function connection(s) {
    const occupied = s.settlements.filter(x => x.population > 0);
    if (!occupied.length) return 'No permanent residents are recorded. Emergency infrastructure may be unmaintained.';
    if (occupied.length === 1) return `${occupied[0].name} depends on outside deliveries. No other inhabited site in this survey can provide a full relief crew.`;
    return roll(rng(s.seed + ':logistics')).pick(T.connections).replace('{a}', occupied[0].name).replace('{b}', occupied[1].name);
  }
  globalThis.AxialSystems = {generate, validate, options, rng, toText, rerollUnlocked};
  if (typeof document === 'undefined') return;

  const $ = id => document.getElementById(id);
  const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const fmt = n => n.toLocaleString('en-US');
  const KEY = 'axial-system-dossier-v1';
  let system = null;
  function announce(msg, error = false) { $('status').textContent = msg; $('status').classList.toggle('error', error); }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(system)); } catch { announce('This browser could not save locally. Download JSON to keep this dossier.', true); } }
  function formOptions() { return Object.fromEntries(new FormData($('controls')).entries()); }
  function syncForm() { for (const [k, v] of Object.entries(system.options)) if ($('controls').elements[k]) $('controls').elements[k].value = v; $('controls').elements.seed.value = system.seed; $('preset-note').textContent = T.presets[system.options.preset][1]; }
  function stats() { return {residents: system.settlements.reduce((a, s) => a + s.population, 0), ships: [...system.transit, ...system.bodies.flatMap(b => b.orbit)].reduce((a, f) => a + f.count, 0)}; }
  function facts(pairs) { return `<table class="record-table"><tbody>${pairs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>`; }
  function action(label, act, id, extra = '') { return `<button type="button" class="small" data-action="${act}" data-id="${esc(id)}" ${extra}>${label}</button>`; }
  function editFields(item, kind) { return `<details class="edit-fields"><summary>Edit name & field notes</summary><label>Name<input maxlength="100" data-edit="name" data-kind="${kind}" data-id="${esc(item.id || '')}" value="${esc(item.name)}"></label><label>Field notes<textarea maxlength="2000" data-edit="notes" data-kind="${kind}" data-id="${esc(item.id || '')}">${esc(item.notes)}</textarea></label></details>`; }
  function fleetHTML(f, host) { return `<article class="fleet"><div class="record-head"><div><span class="eyebrow">${esc(f.disposition)} · ${esc(f.affiliation)}</span><h4>${esc(f.name)}</h4></div><span class="count">${f.count} <small>hull${f.count > 1 ? 's' : ''}</small></span></div><p>${f.count} × ${esc(f.vessel)} · ${f.crew} transient crew</p><p class="muted">${esc(f.activity)}</p><div class="actions">${action(f.locked ? 'Unlock' : 'Lock', 'lock-fleet', f.id, `data-host="${esc(host)}" aria-pressed="${f.locked}"`)}${action('Reroll', 'reroll-fleet', f.id, `data-host="${esc(host)}"`)}${action('Remove', 'remove-fleet', f.id, `data-host="${esc(host)}"`)}</div></article>`; }
  function siteHTML(s) {
    const p = T.purposes[s.purpose]; completeSite(s);
    return `<article class="site" id="site-${esc(s.id)}"><div class="record-head"><h4>${esc(s.name)} ${s.locked ? '<span class="lock-tag">LOCKED</span>' : ''}</h4><span class="site-pop">${fmt(s.population)} residents</span></div>${facts([
      ['Type / status', p.label + ' / ' + s.state],
      ['Exports / resources', s.exports.join(', ') || 'None'], ['Imports needed', s.need],
      ['Structures', s.structures.join(', ')],
      

      ['Government', T.governments[s.government][0]],
      [T.governments[s.government][1], s.leader],
      ['Development', s.development],
      ['Military / security', s.defenses.soldiers + ' personnel; ' + s.defenses.fleetCrew + ' ship crew (included in population)'],
      ['Defenses', s.defenses.armoredVehicles + ' armored vehicles; ' + s.defenses.emplacements + ' defensive emplacements'],
      ['Local fleet', s.defenses.patrolCutters ? s.defenses.patrolCutters + ' patrol cutters' : 'None'],
      ['Conditions', s.issue]
    ])}<details class="technical-details"><summary>Infrastructure & details</summary>${facts([['Habitat',s.habitat || 'Pressure habitat'],['Power',s.power],['Stores',s.support],['Facility details',s.facility || p.facility],['Available services',s.services.join('; ') || 'None certified']])}</details>${s.notes ? `<p class="field-note">${esc(s.notes)}</p>` : ''}<div class="actions">${action(s.locked ? 'Unlock' : 'Lock', 'lock-site', s.id, `aria-pressed="${s.locked}"`)}${action('Reroll settlement', 'reroll-site', s.id)}${action('Reroll situation', 'issue', s.id)}${action('Remove', 'remove-site', s.id)}</div>${editFields(s, 'site')}</article>`;
  }
  function orbitHTML(b) { const host = b ? b.id : 'deep', ships = b ? b.orbit : system.transit; const sites = system.settlements.filter(s => s.bodyId === (b?.id || null) && s.location === 'orbital'); return `<details class="subsection" open><summary><span>Orbit${b ? '' : ' & transit'}</span><small>${sites.length} habitat${sites.length !== 1 ? 's' : ''} · ${ships.reduce((a, f) => a + f.count, 0)} visiting hulls</small></summary><div class="section-body">${sites.map(siteHTML).join('')}${ships.map(f => fleetHTML(f, host)).join('')}${!sites.length && !ships.length ? '<p class="empty">No permanent installation or vessel currently logged. The approach is quiet.</p>' : ''}<div class="actions">${action('Add orbital habitat', 'add-orbital', host)}${action('Add visiting ships', 'add-fleet', host)}${action('Reroll visiting traffic', 'reroll-orbit', host)}</div></div></details>`; }
  function render() {
    const open = new Set([...document.querySelectorAll('details[data-key][open]')].map(e => e.dataset.key));
    const st = stats();
    $('dossier').hidden = false;
    $('system-title').textContent = system.name;
    $('seed-label').textContent = `SURVEY ${system.seed} / REV ${String(system.revision).padStart(2, '0')}`;
    $('summary').innerHTML = [['Worlds', system.bodies.length], ['Residents', fmt(st.residents)], ['Settlements', system.settlements.length], ['Visiting hulls', st.ships]].map(([k, v]) => `<div><strong>${v}</strong><span>${k}</span></div>`).join('');
    $('stellar').innerHTML = `<div class="star-symbol" aria-hidden="true">✳</div><div><span class="eyebrow">${esc(system.star.configuration)} configuration / primary</span><h3>${esc(system.star.name)} <span class="muted">${esc(system.star.type)}</span></h3><p>${system.star.mass} M☉ · ${system.star.luminosity} L☉</p><p class="muted">${esc(system.star.note)} ${esc(system.star.companions)}</p></div>`;
    $('orbit-strip').innerHTML = system.bodies.map(b => `<a href="#body-${esc(b.id)}" class="orbit-stop"><span class="planet-dot ${b.type}"></span><strong>${esc(b.name.split(' ').slice(-1)[0])}</strong><small>${b.au} AU</small></a>`).join('') || '<p class="empty">No catalogued planets. See system infrastructure below.</p>';
    let register = document.getElementById('settlement-register');
    if (!register) { register = document.createElement('section'); register.id = 'settlement-register'; $('worlds').before(register); }
    register.innerHTML = '<h3>Settlements & resources at a glance</h3>' + (system.settlements.length ? `<div class="table-scroll" tabindex="0" role="region" aria-label="Settlement resource register"><table class="register-table"><thead><tr><th scope="col">Settlement / location</th><th scope="col">Residents</th><th scope="col">Exports</th><th scope="col">Structures & facilities</th></tr></thead><tbody>${system.settlements.map(s => `<tr><td><a href="#site-${esc(s.id)}">${esc(s.name)}</a><small>${esc(system.bodies.find(b => b.id === s.bodyId)?.name || 'Deep space')} / ${esc(s.location)}</small></td><td>${fmt(s.population)}</td><td>${esc(s.exports.join(', ') || 'None')}</td><td><strong>${esc(T.purposes[s.purpose].label)}</strong><br>${esc(s.structures.join(', '))}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">No settlements recorded.</p>');
    $('system-edit').innerHTML = editFields(system, 'system');
    $('system-notes').textContent = system.notes;
    $('worlds').innerHTML = system.bodies.map((b, i) => {
      const t = T.bodies[b.type], sites = system.settlements.filter(s => s.bodyId === b.id && s.location === 'surface');
      return `<details class="world" id="body-${esc(b.id)}" data-key="${esc(b.id)}" open><summary><span class="world-number">${String(i + 1).padStart(2, '0')}</span><span class="planet-dot ${b.type}"></span><span class="world-title"><strong>${esc(b.name)}</strong><small>${esc(t.label)} · ${b.au} AU · ${system.settlements.filter(s => s.bodyId === b.id).length} sites</small></span>${b.locked ? '<span class="lock-tag">LOCKED</span>' : ''}<span class="expand" aria-hidden="true">+</span></summary><div class="world-content">${facts([['Orbit', `${b.au} AU / ${b.period} Earth years`], ['Equilibrium estimate', `${b.temperature} K · not surface temperature`], ['Surface gravity', b.gravity === null ? 'No solid surface' : `${b.gravity} g`], ['Atmosphere', t.air], ['Terrain / appearance', b.terrain], ['Recoverable resource', b.resource], ['Surveyed moons', String(b.moons)]])}<p class="environment-note">${esc(t.note)}</p>${b.notes ? `<p class="field-note">${esc(b.notes)}</p>` : ''}<div class="actions">${action(b.locked ? 'Unlock world' : 'Lock world', 'lock-body', b.id, `aria-pressed="${b.locked}"`)}${action('Reroll environment', 'reroll-body', b.id)}</div>${editFields(b, 'body')}<details class="subsection" open><summary><span>Surface</span><small>${sites.length} settlement${sites.length !== 1 ? 's' : ''}</small></summary><div class="section-body">${sites.map(siteHTML).join('')}${!sites.length ? `<p class="empty">${['gas', 'greenhouse'].includes(b.type) ? 'No conventional surface occupation. Use orbital habitats.' : 'No registered surface population.'}</p>` : ''}${!['gas', 'greenhouse'].includes(b.type) ? action('Add surface settlement', 'add-surface', b.id) : ''}</div></details>${orbitHTML(b)}</div></details>`;
    }).join('');
    $('deep-space').innerHTML = orbitHTML(null) + `<div class="remote-grid"><article class="remote"><span class="eyebrow">Material survey</span><h4>${system.belt === 'none' ? 'No mapped belt' : system.belt === 'rich' ? 'Resource-bearing belt' : 'Low-yield debris belt'}</h4><p>${system.belt === 'rich' ? 'Water-bearing bodies and metal-rich fragments. Assay results are patchy; accessibility determines value.' : system.belt === 'barren' ? 'Dispersed, low-grade material. No proven commercial extraction site.' : 'No continuous asteroid belt is recorded in this survey.'}</p></article>${system.remote.map(r => `<article class="remote"><span class="eyebrow">${esc(r.type)}</span><h4>${esc(r.name)}</h4><p>${esc(r.description)}</p></article>`).join('')}</div>`;
    $('connections').textContent = connection(system);
    $('navigation').textContent = navigation(system);
    $('export-json').disabled = $('export-text').disabled = $('print').disabled = false;
  }
  function saveRender(message) { validate(system); render(); announce(message); persist(); }
  function run() {
    try {
      if (system && (system.bodies.some(b => b.locked || b.orbit.some(f => f.locked)) || system.settlements.some(s => s.locked) || system.transit.some(f => f.locked))) throw Error('Unlock the current records before replacing this system. Individual rerolls preserve locked records.');
      const input = formOptions();
      if (!input.seed.trim()) input.seed = 'AX-' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase();
      system = generate(input); syncForm(); saveRender('Survey generated. Saved in this browser.');
    } catch (e) { announce(e.message, true); }
  }
  $('controls').addEventListener('submit', e => { e.preventDefault(); run(); });
  $('new-seed').addEventListener('click', () => { $('controls').elements.seed.value = ''; run(); });
  $('reroll-unlocked').addEventListener('click', () => {
    if (!system) return;
    try { system = rerollUnlocked(system); saveRender('Unlocked records rerolled. Locked worlds, settlements and visiting groups were preserved.'); }
    catch (e) { announce(e.message, true); }
  });
  $('reset-controls').addEventListener('click', () => { $('controls').reset(); $('preset-note').textContent = T.presets.random[1]; announce('Controls reset. Your current dossier is unchanged until you generate.'); });
  $('controls').elements.preset.addEventListener('change', e => {
    const form = $('controls').elements, p = e.target.value;
    const settings = {trade: {traffic: 'normal'}, military: {military: 'substantial'}, failed: {danger: 'strained'}, contested: {danger: 'dangerous'}, uninhabited: {settlements: '0', required: ''}}[p] || {};
    form.traffic.value = 'sparse'; form.military.value = 'light'; form.danger.value = 'quiet';
    if (p !== 'uninhabited') form.settlements.value = '';
    for (const [k, v] of Object.entries(settings)) form[k].value = v;
    $('preset-note').textContent = T.presets[p][1];
  });
  document.addEventListener('change', e => {
    const el = e.target;
    if (!el.dataset.edit || !system) return;
    const record = el.dataset.kind === 'system' ? system : el.dataset.kind === 'body' ? system.bodies.find(b => b.id === el.dataset.id) : system.settlements.find(s => s.id === el.dataset.id);
    if (!record) return;
    const lockedParent = el.dataset.kind === 'site' && system.bodies.find(b => b.id === record.bodyId)?.locked;
    if (record.locked || lockedParent) { el.value = record[el.dataset.edit]; announce('Unlock the record before editing its name or notes.', true); return; }
    if (el.dataset.edit === 'name' && !el.value.trim()) { el.value = record.name; announce('Give this record a name.', true); return; }
    record[el.dataset.edit] = el.value.trim(); system.revision++; saveRender('Record updated.');
  });
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]'); if (!btn || !system) return;
    const before = clone(system);
    try {
      const id = btn.dataset.id, act = btn.dataset.action, b = system.bodies.find(b => b.id === id), s = system.settlements.find(s => s.id === id);
      const parent = system.bodies.find(b => b.id === (s?.bodyId || btn.dataset.host || id));
      const q = roll(rng(`${system.seed}:edit:${system.revision}:${act}:${id}`)), o = system.options;
      if (act === 'lock-body') b.locked = !b.locked;
      else {
        if (parent?.locked) throw Error('Unlock this world before editing its environment, settlements or orbit.');
        if (act === 'lock-site') s.locked = !s.locked;
        else if (s) {
          if (s.locked) throw Error('Unlock this settlement first.');
          if (act === 'reroll-site') Object.assign(s, makeSettlement(q, o, s.id, s.bodyId, s.location), {notes: s.notes});
          if (act === 'issue') s.issue = q.pick(s.population ? T.conditions : T.abandoned);
          if (act === 'remove-site') system.settlements = system.settlements.filter(x => x !== s);
        } else if (act === 'reroll-body') {
          const next = makeBody(q, system.star, 0, b.au);
          if (system.settlements.some(s => s.bodyId === b.id && s.location === 'surface') && ['gas', 'greenhouse'].includes(next.type)) { next.type = 'rock'; next.gravity = .28; next.terrain = T.bodies.rock.terrain[0]; next.resource = T.bodies.rock.resources[0]; }
          Object.assign(b, next, {id: b.id, name: b.name, notes: b.notes, orbit: b.orbit});
        } else if (act === 'add-surface' || act === 'add-orbital') {
          if (system.settlements.length >= 10) throw Error('This dossier supports at most 10 settlements.');
          system.settlements.push(makeSettlement(q, {...o, preset: o.preset === 'uninhabited' ? 'frontier' : o.preset}, 'site-' + system.revision, b?.id || null, act === 'add-surface' ? 'surface' : 'orbital'));
        } else {
          const host = btn.dataset.host || id;
          const holder = system.bodies.find(b => b.id === host);
          const list = holder ? holder.orbit : system.transit;
          const fleet = list.find(f => f.id === id);
          if (act === 'lock-fleet') fleet.locked = !fleet.locked;
          else if (act === 'reroll-fleet' || act === 'remove-fleet') {
            if (fleet.locked) throw Error('Unlock this visiting group first.');
            if (act === 'reroll-fleet') Object.assign(fleet, makeFleet(q, o, fleet.id));
            else list.splice(list.indexOf(fleet), 1);
          } else if (act === 'add-fleet') {
            if (list.length >= 12) throw Error('At most 12 visiting groups per orbit.');
            list.push(makeFleet(q, o, 'visit-' + system.revision));
          } else if (act === 'reroll-orbit') {
            const locked = list.filter(f => f.locked), fresh = makeOrbit(q, o, `${host}-${system.revision}`);
            list.splice(0, list.length, ...locked, ...fresh.slice(0, 12 - locked.length));
          }
        }
      }
      system.revision++; saveRender('Dossier updated. Original generation controls apply to rerolls; manual additions can change totals.');
    } catch (err) { system = before; announce(err.message, true); }
  });
  function download(content, ext, type) {
    const url = URL.createObjectURL(new Blob([content], {type})), a = document.createElement('a');
    a.href = url; a.download = (system.name.replace(/[^a-z0-9_-]+/gi, '-').slice(0, 70) || 'system') + '.' + ext; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $('export-json').addEventListener('click', () => download(JSON.stringify(system, null, 2), 'json', 'application/json'));
  $('export-text').addEventListener('click', () => download(toText(system), 'txt', 'text/plain'));
  let printClosed = [];
  window.addEventListener('beforeprint', () => { printClosed = [...document.querySelectorAll('#dossier details:not([open]):not(.edit-fields)')]; printClosed.forEach(d => d.open = true); });
  window.addEventListener('afterprint', () => { printClosed.forEach(d => d.open = false); });
  $('print').addEventListener('click', () => window.print());
  $('load-file').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      if (file.size > 500000) throw Error('Choose a dossier smaller than 500 KB.');
      const next = validate(JSON.parse(await file.text()));
      if (system && !window.confirm('Replace the current dossier with this saved file? Download the current JSON first if you want to keep both.')) return;
      system = next; syncForm(); saveRender('Saved dossier loaded.');
    } catch (err) { announce('Could not load file: ' + err.message, true); } finally { e.target.value = ''; }
  });
  try { const saved = localStorage.getItem(KEY); if (saved) { system = validate(JSON.parse(saved)); syncForm(); render(); announce('Last dossier restored from this browser.'); } } catch { system = null; announce('The previous local save could not be restored. You can generate a new survey.', true); }
  if (!system) { system = generate({...defaults, seed: 'KESTREL-17', preset: 'frontier', planets: '4', settlements: '2'}); syncForm(); render(); announce('Example survey loaded. Change the seed for a new system.'); }
})();
