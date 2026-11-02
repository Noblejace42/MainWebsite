// Run with node axial/_systemgen_test.cjs. No third-party dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({});
const source = ['systemdata.js','systemgen.js'].map(f => fs.readFileSync(path.join(__dirname,f),'utf8')).join('\n');
vm.runInContext(source,context);
const G=context.AxialSystems, T=context.SystemTables;
let checked=0, people=0, peak=0;
const seen=new Set();
function check(input) {
  const s=G.generate(input); G.validate(s); checked++;
  assert.equal(JSON.stringify(G.generate(input)),JSON.stringify(s),'seed must reproduce all initial content');
  assert.equal(JSON.stringify(G.validate(JSON.parse(JSON.stringify(s)))),JSON.stringify(s),'JSON round trip');
  if(input.planets!==undefined) assert.equal(s.bodies.length,Number(input.planets));
  if(input.settlements!==undefined) assert.equal(s.settlements.length,Number(input.settlements));
  if(input.preset==='uninhabited') assert.equal(s.settlements.length,0);
  if(input.traffic==='none') assert.equal(s.transit.length+s.bodies.reduce((n,b)=>n+b.orbit.length,0),0);
  if(input.required==='station') assert.ok(s.settlements.some(x=>x.location==='orbital'&&x.population>0));
  if(input.required==='depot') assert.ok(s.settlements.some(x=>x.purpose==='fuel'&&x.population>0));
  if(input.required==='temperate') assert.ok(s.bodies.some(b=>b.type==='temperate'));
  assert.equal(new Set(s.remote.map(r=>r.name)).size,s.remote.length,'remote sites should not repeat');
  const text=G.toText(s);
  for(const x of s.settlements){
    assert.ok(text.includes(x.name)&&text.includes(x.facility)&&text.includes(x.habitat),'export includes every site and generated detail');
    if(input.placement==='surface') assert.equal(x.location,'surface');
    if(input.placement==='orbital') assert.equal(x.location,'orbital');
    if(x.location==='surface') assert.ok(!['gas','greenhouse'].includes(s.bodies.find(b=>b.id===x.bodyId).type));
    if(x.population){const [lo,hi]=input.population==='tiny'?[4,32]:input.population==='established'?[1500,15000]:[100,15000];assert.ok(x.population>=lo&&x.population<=hi,'resident range');assert.ok(!x.power.startsWith('Offline'),'occupied sites need power');}
    else {assert.equal(x.services.length,0);assert.equal(x.guards,0);}
    seen.add(x.facility);
  }
  return s;
}
for(let i=0;i<1000;i++) {const s=check({seed:'distribution-'+i});const n=s.settlements.reduce((a,x)=>a+x.population,0);people+=n;peak=Math.max(peak,n);}
for(const preset of Object.keys(T.presets)) for(const population of ['tiny','sparse','established']) for(const placement of ['surface','orbital','mixed']) for(const traffic of ['none','sparse','normal','busy']) check({seed:`${preset}-${population}-${placement}-${traffic}`,preset,population,placement,traffic});
for(let planets=0;planets<=8;planets++) for(let settlements=0;settlements<=10;settlements++) check({seed:'counts',planets:String(planets),settlements:String(settlements)});
for(const required of ['station','depot','temperate']) for(const population of ['tiny','sparse','established']) for(let i=0;i<30;i++) check({seed:'required-'+i,required,population,preset:'failed'});
check({name:'A'.repeat(100),planets:'8',seed:'long-name'});
for(const input of [{planets:'0',placement:'surface'},{planets:'0',required:'temperate'},{settlements:'0',required:'station'},{preset:'uninhabited',settlements:'1'},{planets:'-1'},{planets:'1.5'},{planets:'9'},{settlements:'11'},{placement:'surface',required:'station'}]) assert.throws(()=>G.generate(input));
for(const corrupt of [s=>s.bodies[0].type='__proto__',s=>s.bodies[0].type='constructor',s=>s.settlements[0].bodyId='missing',s=>s.settlements[0].facility={},s=>s.settlements[0].purpose='toString',s=>s.bodies.push(s.bodies[0]),s=>s.version=99]) {const s=G.generate({planets:'2',settlements:'1',seed:'corrupt'});corrupt(s);assert.throws(()=>G.validate(s),'reject invalid imported data');}
console.log(JSON.stringify({checked,meanResidents:people/1000,peakDefaultResidents:peak,uniqueFacilitiesSeen:seen.size,content:{purposes:Object.keys(T.purposes).length,facilities:Object.values(T.purposes).reduce((a,p)=>a+p.facilities.length,0),situations:T.conditions.length+T.quiet.length+T.abandoned.length,remote:T.remote.length,fleetActivities:Object.values(T.fleets).reduce((a,f)=>a+f.activities.length,0)}},null,2));
const original=G.generate({seed:'locks',planets:'3',settlements:'5',traffic:'busy'});
original.bodies[0].locked=true;
original.bodies[1].orbit[0].locked=true;
original.settlements[0].locked=true;
original.transit[0].locked=true;
original.notes='Keep my campaign notes.';
const before=JSON.stringify(original), next=G.rerollUnlocked(original);
assert.equal(JSON.stringify(original),before,'reroll does not mutate its input');
assert.deepEqual(next.bodies[0],original.bodies[0],'locked planet preserved');
assert.deepEqual(next.settlements[0],original.settlements[0],'locked settlement preserved');
assert.deepEqual(next.transit[0],original.transit[0],'locked deep-space fleet preserved');
assert.deepEqual(next.bodies[1].orbit[0],original.bodies[1].orbit[0],'locked orbit fleet preserved');
for(const x of original.settlements.filter(x=>x.bodyId===original.bodies[0].id)) assert.deepEqual(next.settlements.find(y=>y.id===x.id),x,'children of locked world preserved');
assert.equal(next.notes,original.notes);
assert.equal(next.revision,original.revision+1);
assert.equal(JSON.stringify(next),JSON.stringify(G.rerollUnlocked(original)),'saved revision rerolls reproducibly');
console.log('Lock preservation, notes, and reroll reproducibility passed.');
let typical=0, empty=0;
for(let i=0;i<2000;i++) {
  const s=G.generate({seed:'population-audit-'+i});
  const total=s.settlements.reduce((n,x)=>n+x.population,0);
  assert.ok(total<=150000);
  if(total===0) empty++;
  if(total>=100&&total<=5000) typical++;
  for(const x of s.settlements) {
    assert.ok(Number.isInteger(x.population)&&x.guards<=x.population);
    if(x.population>500) assert.ok(x.habitat.includes('residential sectors')&&x.power.includes('MW'));
  }
}
assert.ok(typical>1400,'a clear majority of systems must have 100–5,000 residents');
assert.ok(empty>0,'uninhabited systems remain possible');
console.log({populationAudit:2000,typical,empty});
