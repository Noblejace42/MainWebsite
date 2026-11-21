(() => {
  'use strict';

  const skills = ['Agility', 'Artifice', 'Charm', 'Fortitude', 'Intellect', 'Might', 'Presence', 'Precision', 'Resolve', 'Sense'];
  const dice = ['d4', 'd6', 'd8', 'd10', 'd12'];
  const byId = id => document.getElementById(id);
  const value = id => byId(id).value;
  const number = id => Number(value(id)) || 0;
  const set = (id, val) => { byId(id).value = val ?? ''; };
  const status = message => { byId('sheet-status').textContent = message; };
  const isRecord = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const hasText = x => typeof x === 'string' && x.trim().length > 0;
  const list = x => Array.isArray(x) ? x : [];
  const titleCase = t => t ? t[0].toUpperCase() + t.slice(1) : '';
  const dieName = d => dice.find(die => die === String(d).replace(/^1d/, 'd').toLowerCase()) || 'd4';
  const side = name => Number(dieName(value(name)).slice(1));
  const tags = text => String(text || '').split(',').map(s => s.trim()).filter(Boolean);
  let powers = [];
  let inventory = [];
  let sourceCharacter = {};
  let previousBaseHealth;

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function button(text, action, className) {
    const node = el('button', text, className);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }

  function populate(select, options, selected) {
    options.forEach(option => select.add(new Option(option, option)));
    if (selected != null) select.value = selected;
  }

  function inputField(parent, label, val, kind = 'text', choices) {
    const field = el('label', label);
    const input = el(choices ? 'select' : kind === 'textarea' ? 'textarea' : 'input');
    if (choices) populate(input, choices.includes(val) || !val ? choices : [val, ...choices], val);
    else {
      if (kind !== 'textarea') input.type = kind;
      input.value = val ?? '';
    }
    field.append(input);
    parent.append(field);
    return input;
  }

  for (const skill of skills) {
    const select = inputField(byId('skills'), skill, 'd4', null, dice);
    select.id = skill;
  }

  function addRow(templateId, containerId) {
    const row = byId(templateId).content.firstElementChild.cloneNode(true);
    row.querySelector('.remove').addEventListener('click', () => row.remove());
    byId(containerId).append(row);
    return row;
  }

  function addTalent(t = {}) {
    const row = addRow('talent-row', 'talents');
    row.querySelector('.talent-name').value = t.name || '';
    row.querySelector('.category').value = t.category || '';
    populate(row.querySelector('.die'), dice, dieName(t.die));
    return row;
  }

  function addBond(b = {}) {
    const row = addRow('bond-row', 'bonds');
    row.querySelector('.type').value = b.type ?? 'Favor';
    row.querySelector('.target').value = b.target || '';
    row.querySelector('.text').value = b.text || '';
    return row;
  }

  function normalizedPower(p) {
    if (typeof p === 'string') return {raw:p};
    if (p.raw) return p;
    const canonical = (window.AXIAL_POWER_LIBRARY || []).find(entry => entry.name === p.name);
    return {...canonical, ...p,
      cooldown:p.cooldown ?? p.cd ?? canonical?.cooldown ?? '',
      speed:p.speed ?? canonical?.speed ?? '',
      description:p.description ?? p.desc ?? canonical?.description ?? ''
    };
  }

  function powerMeta(p) {
    return [p.scope, titleCase(String(p.type || '')), p.cooldown, p.speed].filter(v => v !== '' && v != null).join(' · ');
  }

  function showEditor(id, label) {
    const editor = el('div', null, 'editor');
    editor.setAttribute('role','group');
    editor.setAttribute('aria-label',label);
    byId(id).replaceChildren(editor);
    return editor;
  }

  function finishEditor(editor, save) {
    const actions = el('div', null, 'actions');
    actions.append(button('Save', save), button('Cancel', () => editor.remove()));
    editor.append(actions);
    editor.querySelector('input,select,textarea')?.focus();
  }

  function editPower(index, raw = false) {
    const p = index == null ? {} : powers[index];
    const editor = showEditor('power-editor', 'Power editor');
    const commit = next => {
      if (index == null) powers.push(next);
      else powers[index] = next;
      editor.remove();
      renderPowers();
    };
    if (raw || p.raw) {
      const text = inputField(editor, 'Power text', p.raw || '', 'textarea');
      finishEditor(editor, () => {
        if (text.value.trim()) commit({raw:text.value.trim()});
      });
      return;
    }
    const library = window.AXIAL_POWER_LIBRARY || [];
    const picker = inputField(editor, 'Rulebook power', 'Custom power', null, ['Custom power', ...library.map(item => item.name)]);
    const fields = el('div',null,'fields');
    editor.append(fields);
    const name = inputField(fields, 'Name', p.name);
    const type = inputField(fields, 'Type', titleCase(String(p.type || 'Move')), null, ['Move', 'Passive']);
    const cooldown = inputField(fields, 'Cooldown', String(p.cooldown ?? ''), null, ['', 'At-will', 'Encounter', 'Recovery']);
    const speed = inputField(fields, 'Combat speed', String(p.speed ?? ''), null, ['', 'Free', 'Light action', 'Medium action', 'Heavy action', 'Movement action']);
    const description = inputField(editor, 'Effect', p.description, 'textarea');
    description.rows = 4;
    const choice = inputField(editor,'Choices and exceptions',p.choice);
    let selected = p;
    function syncType() {
      const passive = type.value.toLowerCase() === 'passive';
      cooldown.disabled = speed.disabled = passive;
    }
    type.addEventListener('change', syncType);
    syncType();
    if (library.some(item => item.name === p.name)) picker.value = p.name;
    picker.addEventListener('change', () => {
      selected = library.find(item => item.name === picker.value) || {};
      name.value = selected.name || '';
      type.value = titleCase(String(selected.type || 'Move'));
      for (const [field, val] of [[cooldown, selected.cooldown], [speed, selected.speed]]) {
        if (val && !Array.from(field.options).some(opt => opt.value === val)) field.add(new Option(val, val));
        field.value = val || '';
      }
      description.value = selected.description || '';
      choice.value = '';
      syncType();
    });
    finishEditor(editor, () => {
      if (!name.value.trim()) { name.focus(); return; }
      commit({...selected, name:name.value.trim(), type:type.value, cooldown:cooldown.disabled ? '' : cooldown.value,
        speed:speed.disabled ? '' : speed.value, description:description.value.trim(), choice:choice.value.trim()});
    });
  }

  function renderPowers() {
    const container = byId('powers');
    container.replaceChildren(...powers.map((p, i) => {
      const row = el('div',null,'entry');
      const reading = el('div',null,'reading');
      if (p.raw) reading.append(el('p', p.raw, 'description'));
      else {
        reading.append(el('h3', p.name), el('small', powerMeta(p)), el('p', p.description, 'description'));
        if (p.choice) reading.append(el('p', 'Choice: ' + p.choice));
      }
      row.append(reading,button('Edit', () => editPower(i)),button('Remove', () => {
        byId('power-editor').replaceChildren();
        powers.splice(i,1);
        renderPowers();
      },'remove'));
      return row;
    }));
    updateVitals();
  }

  function objectStruct(o) {
    if (o.struct || o.raw) return o.struct || o.raw;
    const parts = [o.name, [o.type,o.subtype].filter(Boolean).join(', ')];
    if (o.count && o.size) {
      const mod = Number(o.modifier) || 0;
      parts.push(o.count + o.size + (mod > 0 ? '+' + mod : mod < 0 ? mod : ''));
    }
    for (const group of [[...list(o.skillTags),o.rangeTag].filter(Boolean),list(o.coreExtraTags)]) {
      if (group.length) parts.push('(' + group.join(', ') + ')');
    }
    if (o.mass != null && o.mass !== '') parts.push(o.mass + ' Mass');
    return parts.filter(Boolean).join(' | ') + (o.special ? '\n' + o.special : '');
  }

  function objectMass(o) {
    if (o.mass != null && o.mass !== '' && Number.isFinite(Number(o.mass))) return Number(o.mass);
    return Number(objectStruct(o).match(/\|\s*(\d+(?:\.\d+)?)\s+mass\b/i)?.[1] || 0);
  }

  function inventoryMass() { return inventory.reduce((sum,o) => sum + objectMass(o),0); }
  function capacity() {
    const supporting = inventory.reduce((sum,o) => {
      if (!o.equipped) return sum;
      return sum + Number(objectStruct(o).match(/\bSupporting\s+(\d+)/i)?.[1] || 0);
    },0);
    return 5 * (side('Fortitude') + side('Might') + side('Resolve')) + supporting;
  }

  function taggedText(text) {
    const fragment = document.createDocumentFragment();
    // The separator in a parameterized tag (Aid|Medicine) belongs inside the tag.
    for (const piece of String(text).split(/(\([^()]+\))/g)) {
      if (!piece.startsWith('(') || !piece.endsWith(')')) { fragment.append(piece); continue; }
      fragment.append('(');
      piece.slice(1,-1).split(/(,\s*)/).forEach(tag => {
        const tooltip = typeof axialGearTagTip === 'function' && axialGearTagTip(tag);
        if (!tooltip) { fragment.append(tag); return; }
        const span = el('span', tag, 'tag');
        span.title = tooltip;
        fragment.append(span);
      });
      fragment.append(')');
    }
    return fragment;
  }

  function editObject(index, structured = false) {
    const o = index == null ? {} : inventory[index];
    const editor = showEditor('object-editor','Inventory editor');
    const commit = next => {
      if (index == null) inventory.push(next);
      else inventory[index] = next;
      editor.remove();
      renderObjects();
    };
    if (!structured) {
      const raw = inputField(editor, 'Object struct or description', objectStruct(o), 'textarea');
      raw.placeholder = 'Grenade Charge | 1 Mass';
      const listedMass = raw.value.match(/\|\s*(\d+(?:\.\d+)?)\s+mass\b/i);
      const override = o.mass != null && (!listedMass || Number(o.mass) !== Number(listedMass[1])) ? o.mass : '';
      const carried = inputField(editor,'Mass override (optional)', override, 'number');
      carried.min = 0;
      finishEditor(editor, () => {
        if (!raw.value.trim()) { raw.focus(); return; }
        const next = raw.value.trim() === objectStruct(o) ? {...o} : {raw:raw.value.trim(), equipped:!!o.equipped};
        if (carried.value !== '') next.mass = Math.max(0,Number(carried.value) || 0);
        else if (override !== '') {
          if (next.raw || next.struct) delete next.mass;
          else next.mass = listedMass ? Number(listedMass[1]) : null;
        }
        commit(next);
      });
      return;
    }
    const fields = el('div',null,'fields');
    editor.append(fields);
    const name = inputField(fields,'Name','');
    const type = inputField(fields,'Type','',null,['','tool','weapon','wearable','attachment','material']);
    const subtype = inputField(fields,'Subtype','');
    const count = inputField(fields,'Potency','','number');
    const size = inputField(fields,'Object die','',null,['',...dice]);
    const modifier = inputField(fields,'Accuracy','','number');
    const primary = inputField(fields,'Skill, range and universal tags','');
    const secondary = inputField(fields,'Core and extra tags','');
    const special = inputField(fields,'Special effect','','textarea');
    const mass = inputField(fields,'Mass','','number');
    count.min = mass.min = 0;
    finishEditor(editor, () => {
      if (!name.value.trim()) { name.focus(); return; }
      commit({name:name.value.trim(), type:type.value, subtype:subtype.value.trim(), count:Number(count.value) || (size.value ? 1 : 0),
        size:size.value, modifier:Number(modifier.value) || 0, skillTags:tags(primary.value), coreExtraTags:tags(secondary.value),
        mass:mass.value === '' ? null : Number(mass.value), special:special.value.trim()});
    });
  }

  function renderObjects() {
    const rows = inventory.map((o,i) => {
      const row = el('div',null,'entry');
      const reading = el('div',null,'reading');
      const struct = el('p',null,'description');
      struct.append(taggedText(objectStruct(o)));
      reading.append(struct);
      const listedMass = struct.textContent.match(/\|\s*(\d+(?:\.\d+)?)\s+mass\b/i);
      if (o.mass != null && (!listedMass || Number(o.mass) !== Number(listedMass[1]))) {
        reading.append(el('small','Carried mass: ' + o.mass));
      }
      const checkbox = el('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!o.equipped;
      checkbox.addEventListener('change', () => { o.equipped = checkbox.checked; updateVitals(); });
      const equip = el('label',null,'equip');
      equip.append(checkbox, 'Equipped');
      row.append(reading,equip,button('Edit',() => editObject(i)),button('Remove',() => {
        byId('object-editor').replaceChildren();
        inventory.splice(i,1);
        renderObjects();
      },'remove'));
      return row;
    });
    byId('objects').replaceChildren(...rows);
    updateVitals();
  }

  function surgeMax() {
    return powers.some(p => String(p.name || '').toLowerCase() === 'surging support') ? 10 : 5;
  }

  function initialHealth() { return window.AxialCharacterRules.health(side('Fortitude'),side('Resolve'),number('age')).health; }

  function adjustHealthForBuildChange() {
    const base = initialHealth();
    const oldMax = number('healthMax');
    const newMax = Math.max(0, oldMax + base - previousBaseHealth);
    const current = number('healthCurrent');
    set('healthMax',newMax);
    set('healthCurrent',current === oldMax ? newMax : Math.min(current,newMax));
    previousBaseHealth = base;
    updateVitals();
  }

  function updateVitals() {
    const carried = inventoryMass() + number('supplies') + number('otherMass');
    const max = capacity() + number('capacityAdjustment');
    byId('encumbrance').value = carried + ' / ' + max;
    byId('enc-warning').hidden = carried <= max;
    byId('surge-label').textContent = 'Surges (0–' + surgeMax() + ')';
    byId('surges').max = surgeMax();
    byId('health-reference').textContent = 'Starting health: ' + initialHealth()
      + ' (10 + Fortitude and Resolve die sizes, less 2 per full five years over 35). Record wounds and advancement in maximum health.';
  }

  function createSticky(note = {}) {
    const panel = el('aside',null,'sticky');
    const px = (n, fallback) => Number.isFinite(n) ? n : fallback;
    panel.style.left = px(note.left,16) + 'px';
    panel.style.top = px(note.top,window.scrollY + 30) + 'px';
    panel.style.width = px(note.width,220) + 'px';
    panel.style.height = px(note.height,150) + 'px';
    const top = el('div',null,'sticky-top');
    const handle = el('span','Note','sticky-handle');
    top.append(handle,button('×',() => panel.remove()));
    top.lastElementChild.setAttribute('aria-label','Remove sticky note');
    const content = el('textarea');
    content.setAttribute('aria-label','Sticky note');
    if (note.text != null) content.value = note.text;
    else if (note.content) {
      // Older files stored contentEditable HTML. Preserve their text and line breaks.
      const template = document.createElement('template');
      template.innerHTML = String(note.content).replace(/<br\s*\/?>|<\/div>/gi,'\n');
      content.value = template.content.textContent;
    }
    panel.append(top,content);
    document.body.append(panel);
    let drag;
    handle.addEventListener('pointerdown',e => {
      drag = [e.pageX - panel.offsetLeft,e.pageY - panel.offsetTop];
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove',e => {
      if (!drag) return;
      panel.style.left = Math.max(0, e.pageX - drag[0]) + 'px';
      panel.style.top = Math.max(0, e.pageY - drag[1]) + 'px';
    });
    handle.addEventListener('lostpointercapture',() => { drag = null; });
    return content;
  }

  function collectSheet() {
    const identity = Object.fromEntries(['name','pronouns','player','concept','birth','early','kit'].map(id => [id,value(id)]));
    Object.assign(identity,{age:number('age'),xp:number('xp'),mainLifepaths:value('mains')});
    const bonds = [...byId('bonds').children].map(row => ({
      type:row.querySelector('.type').value, target:row.querySelector('.target').value,
      text:row.querySelector('.text').value
    })).filter(b => b.text.trim() || b.target.trim());
    identity.bonds = bonds.map(b => [b.type,b.target,b.text].filter(Boolean).join(' · ')).join('\n');
    return {
      version:2, identity, bonds,
      skills:Object.fromEntries(skills.map(s => [s,value(s)])),
      stats:{
        strain:number('strain'), surges:number('surges'), supplies:number('supplies'), wealth:number('wealth'),
        health:[number('healthCurrent'),number('healthMax')], enc:[inventoryMass() + number('supplies') + number('otherMass'),capacity() + number('capacityAdjustment')],
        otherMass:number('otherMass'), capacityAdjustment:number('capacityAdjustment'), wounds:number('wounds'), scars:number('scars')
      },
      talents:[...byId('talents').children].map(row => ({name:row.querySelector('.talent-name').value.trim(),
        category:row.querySelector('.category').value, die:row.querySelector('.die').value})).filter(t => t.name),
      conditions:value('conditions'), injuryNotes:value('injuryNotes'), powers, inventory,
      notesA:value('notesA'),notesB:value('notesB'),
      stickies:[...document.querySelectorAll('.sticky')].map(el => ({text:el.querySelector('textarea').value,
        left:el.offsetLeft,top:el.offsetTop,width:el.offsetWidth,height:el.offsetHeight})),
      sourceCharacter
    };
  }

  function yearsLabel(m) {
    if (typeof m === 'string') return m;
    const years = Array.isArray(m.years) ? m.years.reduce((sum,n) => sum + Number(n),0) : m.years;
    return [m.key || m.name, years ? years + ' years' : '', m.skillChoice && 'Skill: ' + m.skillChoice,
      m.power && 'Power: ' + m.power].filter(Boolean).join(' · ');
  }

  function printableSheet() {
    const d = collectSheet();
    const i = d.identity;
    const s = d.stats;
    const mains = i.mainLifepaths.split('\n').filter(Boolean).map(line => {
      const [key,...details] = line.split(' · ');
      const years = details.find(part => /^\d+ years?$/i.test(part));
      // Keep freeform lines intact when a player uses their own history format.
      if (!years) return {key:line};
      return {key,years:parseInt(years,10),skillChoice:details.find(part => part.startsWith('Skill: '))?.slice(7),
        power:details.find(part => part.startsWith('Power: '))?.slice(7)};
    });
    return {...sourceCharacter,...i,mains,skills:d.skills,talents:d.talents,powers:powers.map(p => p.raw ? {name:'Power',description:p.raw} : p),
      bonds:d.bonds,gear:inventory.map(o => objectStruct(o) + (o.equipped ? ' (equipped)' : '')),
      vitals:{...(sourceCharacter.vitals || {}),Health:s.health.join(' / '), Strain:s.strain + ' / 10', Surges:s.surges + ' / ' + surgeMax(),
        Supplies:s.supplies, Wealth:s.wealth, XP:i.xp, Wounds:s.wounds, Scars:s.scars, Encumbrance:s.enc.join(' / ')},
      wounds:d.injuryNotes, scars:s.scars,conditions:d.conditions,
      notes:[d.notesA, d.notesB, d.conditions && 'Conditions: ' + d.conditions,...d.stickies.map(st => st.text)].filter(Boolean).join('\n\n')
    };
  }

  function downloadSheet() {
    const data = collectSheet();
    const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    const a = el('a');
    a.download = (data.identity.name.trim().replace(/[^\p{L}\p{N}_ -]/gu,'') || 'Axial character') + '.json';
    a.href = url;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    status('Character saved.');
  }

  function pair(input, defaultPair) {
    if (input == null || input === '') return defaultPair;
    const nums = (Array.isArray(input) ? input : String(input).split('/')).map(v => Number(String(v).trim()));
    return nums.length > 1 ? nums.slice(0,2) : [nums[0],nums[0]];
  }

  function fromGenerator(g) {
    const vitals = g.vitals;
    const readStat = (key, fallback) => Number(String(vitals[key] ?? fallback).split('/')[0].trim()) || 0;
    return {
      identity:{name:g.name, pronouns:g.pronouns, player:g.player, concept:g.concept, age:g.age, birth:g.birth, early:g.early,
        mainLifepaths:list(g.mains).map(yearsLabel).join('\n'), kit:g.kit, xp:readStat('XP',0)},
      stats:{health:pair(vitals.Health,null), enc:pair(vitals.Encumbrance,null), strain:readStat('Strain',0),
        surges:readStat('Surges',0), supplies:readStat('Supplies',0), wealth:readStat('Wealth',0), wounds:readStat('Wounds',0),scars:readStat('Scars',0)},
      skills:g.skills,talents:g.talents,bonds:g.bonds,powers:g.powers,inventory:g.gear,conditions:g.conditions,
      notesA:g.notes,sourceCharacter:g
    };
  }

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.every(x => hasText(x) || (isRecord(x) && [x.name,x.raw,x.struct].some(hasText)))) {
      throw new Error('Invalid gear list.');
    }
    return items.map(x => typeof x === 'string' ? {raw:x} : {...x});
  }

  function applyCharacter(raw) {
    if (!isRecord(raw) || !isRecord(raw.skills)) throw new Error('Expected an Axial character.');
    const d = isRecord(raw.vitals) && !raw.identity ? fromGenerator(raw) : raw;
    if (!isRecord(d.identity) || !isRecord(d.stats)) throw new Error('Missing character identity or statistics.');
    for (const key of ['talents','bonds','stickies']) {
      if (d[key] != null && (!Array.isArray(d[key]) || !d[key].every(isRecord))) throw new Error('Invalid ' + key + '.');
    }
    const newGear = normalizeItems(d.inventory || []);
    if (d.powers != null && (!Array.isArray(d.powers) || !d.powers.every(p => typeof p === 'string' || isRecord(p)))) {
      throw new Error('Invalid powers.');
    }
    const newPowers = list(d.powers).map(normalizedPower);
    const s = d.stats;
    const i = d.identity;
    sourceCharacter = isRecord(d.sourceCharacter) ? d.sourceCharacter : {};
    ['name','concept','pronouns','player','birth','early','kit'].forEach(id => set(id,i[id]));
    set('mains',i.mainLifepaths);
    set('age',i.age ?? 20);
    set('xp',i.xp ?? 0);
    skills.forEach(skill => set(skill,dieName(d.skills[skill])));
    previousBaseHealth = initialHealth();
    ['strain','surges','supplies','wealth','wounds','scars'].forEach(id => set(id,s[id] ?? 0));
    const hp = pair(s.health,[initialHealth(),initialHealth()]);
    set('healthCurrent',hp[0]); set('healthMax',hp[1]);
    inventory = newGear;
    powers = newPowers;
    const enc = pair(s.enc,null);
    set('otherMass',s.otherMass ?? (enc ? enc[0] - inventoryMass() - number('supplies') : 0));
    set('capacityAdjustment',s.capacityAdjustment ?? (enc ? enc[1] - capacity() : 0));
    ['conditions','injuryNotes','notesA','notesB'].forEach(id => set(id,d[id]));
    byId('talents').replaceChildren(); list(d.talents).forEach(addTalent);
    byId('bonds').replaceChildren();
    const bonds = d.bonds || (i.bonds ? [{type:'',text:String(i.bonds)}] : []);
    bonds.forEach(addBond);
    byId('power-editor').replaceChildren(); byId('object-editor').replaceChildren();
    renderPowers(); renderObjects();
    document.querySelectorAll('.sticky').forEach(el => el.remove());
    list(d.stickies).forEach(createSticky);
  }

  async function loadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (Array.isArray(data)) {
        const added = normalizeItems(data);
        inventory.push(...added);
        renderObjects();
        status('Added ' + added.length + ' inventory item' + (added.length === 1 ? '.' : 's.'));
      } else {
        applyCharacter(data);
        status('Loaded ' + (value('name') || 'character') + '.');
      }
    } catch (error) {
      status('Could not load this file. ' + (error instanceof SyntaxError ? 'Choose an Axial JSON export.' : error.message));
    }
    e.target.value = '';
  }

  byId('sheet').addEventListener('submit',e => e.preventDefault());
  byId('sheet').addEventListener('input',updateVitals);
  for (const id of ['Fortitude','Resolve','age']) byId(id).addEventListener('change',adjustHealthForBuildChange);
  byId('add-talent').onclick = () => addTalent().querySelector('input').focus();
  byId('add-bond').onclick = () => addBond().querySelector('.target').focus();
  byId('add-power').onclick = () => editPower(null);
  byId('paste-power').onclick = () => editPower(null,true);
  byId('add-object').onclick = () => editObject(null,true);
  byId('paste-object').onclick = () => editObject(null);
  byId('addStickyBtn').onclick = () => createSticky().focus();
  byId('saveBtn').onclick = downloadSheet;
  byId('loadBtn').onclick = () => byId('fileInput').click();
  byId('fileInput').onchange = loadFile;
  byId('wordBtn').onclick = () => window.AxialCharacterExport.word(printableSheet());
  byId('printBtn').onclick = () => window.AxialCharacterExport.print(printableSheet());

  previousBaseHealth = initialHealth();
  set('healthCurrent',previousBaseHealth); set('healthMax',previousBaseHealth);
  updateVitals();
  if (new URLSearchParams(location.search).get('from') === 'generator') {
    try {
      const handoff = sessionStorage.getItem('axial.generator.sheet.v1');
      if (!handoff) throw new Error('No generated character was found in this tab.');
      applyCharacter(JSON.parse(handoff));
      status('Opened ' + (value('name') || 'your generated character') + '. Use Save JSON to keep changes.');
    } catch (error) {
      status('Could not open the generated character. ' + error.message);
    }
  }
})();
