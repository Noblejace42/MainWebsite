/* Powers and bonds used by the Axial character generator. */
(() => {
  'use strict';

  const library = [...window.AXIAL_POWER_LIBRARY].sort((a, b) => a.name.localeCompare(b.name));
  const normalize = text => String(text || '').trim().toLowerCase();
  const byName = new Map(library.map(power => [normalize(power.name), power]));
  const find = name => byName.get(normalize(name));
  const groupNames = ['Core moves', 'Core passives', 'Starship moves'];
  const groupOf = power => power.scope + (power.type === 'Move' ? ' moves' : ' passives');
  const refreshFavorOptions = new WeakMap();
  const categories = ['Knowledge', 'Combat', 'Practical', 'Athletics', 'Social'];
  const experts = {
    'Experienced Explorer': { max: 4, terrains: ['Mountain', 'Desert', 'Tundra', 'Wasteland', 'Jungle', 'Plains', 'Forest', 'Urban', 'Caves', 'Void', 'Nebula', 'Ocean', 'Arcane'] },
    'Superior Explorer': { max: 2, terrains: ['Mountain', 'Desert', 'Tundra', 'Wasteland', 'Jungle', 'Plains', 'Forest', 'Urban', 'Caves', 'Asteroid field', 'Nebula', 'Ocean'] }
  };

  // Affinities describe which existing build choices pair well with a power.
  // They guide suggestions only. They never restrict the library or grant a power.
  const affinities = {
    'Cheap Shot': 'Criminal,Stealth,Sleight of Hand,Shortblade,Agility',
    'Port in the Storm': 'Merchant,Navigator,Streetwise,Charm',
    'Called Shot': 'Rifle,Handgun,Shotgun,Emitter,Tension,Precision',
    Speakeasy: 'Diplomat,Investigator,Negotiation,Insight,Charm',
    'Surging Support': 'Organizer,Medic,Leadership,Presence',
    'Focused Training': 'Academic,Laborer,Artisan',
    'Push beyond limit': 'Laborer,Fortitude,Resolve',
    'Second Wind': 'Soldier,Fortitude,Resolve',
    'Under Pressure': 'Outlander,Fortitude,Resolve',
    'Seeing Red': 'Soldier,Might,Fortitude',
    'Blood for the Blood God': 'Soldier,Longblade,Shortblade,Polearm,Might',
    'Jack Of All Trades': 'Performer,Salvager,Artisan',
    'Experienced Explorer': 'Outlander,Scouting,Bushcraft,Geography,Navigator,Sense',
    'Herald of Law': 'Noble,Diplomat,Law,Intimidation,Charm,Presence',
    Windstance: 'Acrobatics,Agility,Natural',
    'Unbreakable Mind': 'Resolve,Fortitude',
    'Sheer Spite': 'Resolve',
    Bulwark: 'Shield,Soldier,Fortitude,Might',
    'Melee Master': 'Longblade,Polearm,Shortblade,Bludgeon,Might',
    'Dark Confidant': 'Criminal,Deception,Charm',
    'Kingly Wit': 'Diplomat,Noble,Negotiation,Persuasion,Charm',
    'Iron-Willed': 'Resolve,Fortitude',
    'Frantic Parry': 'Longblade,Shortblade,Shield,Agility',
    'Dumb Luck': 'Criminal,Agility',
    'Glancing Blow': 'Enforcer,Warrior,Shield,Fortitude',
    'Master Quartermaster': 'Logistics,Cooking,Bushcraft,Organizer',
    'Flames Of My Desire': 'Noble,Performer,Resolve',
    'Rage Against the Machine': 'Soldier,Might,Resolve',
    'Tactical Reload': 'Gunnery,Smithing,Artisan,Artifice',
    Juggernaut: 'Warrior,Enforcer,Fortitude,Might',
    Gatecrasher: 'Laborer,Construction,Strength Training,Might',
    Strider: 'Outlander,Ranger,Bushcraft,Navigation,Scouting',
    'Black Market Connections': 'Criminal,Streetwise,Merchant',
    'Setup Strike': 'Soldier,Tactics,Leadership',
    'Sage Knight': 'Resolve,Philosophy,Warrior',
    'Blot out the Sun': 'Rifle,Tension,Artillery,Precision',
    'Superior Explorer': 'Outlander,Ranger,Geography,Bushcraft,Scouting',
    'Tricks of the Trade': 'Artisan,Performer,Artifice',
    'The Arcane and Esoteric': 'Academic,Investigator,Arcana,Intellect',
    'Ad Astra Per Aspera': 'Academic,Fortitude,Resolve',
    'The Great Escape': 'Criminal,Agility,Sense,Stealth',
    'Steal the Moon': 'Criminal,Lockpicking,Stealth,Sleight of Hand',
    'Font of Knowledge': 'Academic,Scholar,Archivist,Knowledge,Intellect',
    'Fool me Once': 'Insight,Deception,Sense',
    Discombobulate: 'Intellect,Tactics,Soldier',
    'Bullet Time': 'Agility,Enforcer,Acrobatics',
    "Hondo's Return": 'Performer,Presence,Persuasion',
    'Punch God': 'Resolve,Might,Natural',
    'Shoot First': 'Handgun,Shotgun,Enforcer,Criminal',
    'Ask Questions Later': 'Investigator,Interrogation,Enforcer',
    'Wide Wanderer': 'Navigator,Outlander,Ranger,Navigation',
    'Cheat Death': 'Fortitude,Resolve',
    'Ace up the Sleeve': 'Performer,Precision,Sleight of Hand',
    'The Ability to Speak': 'Diplomat,Scholar,Linguistics,Charm',
    'Breaker of War': 'Diplomat,Negotiation,Persuasion,Leadership',
    'Journey Before Destination': 'Outlander,Navigator,Organizer,Navigation',
    'Forth Eorlingas!': 'Soldier,Noble,Leadership,Tactics,Presence',
    'Volta Gloria': 'Soldier,Resolve',
    'Resist and Bite': 'Soldier,Longblade,Shield,Fortitude',
    'Wall Jumper': 'Climbing,Acrobatics,Jumping,Agility',
    'Devilish Po': 'Soldier,Tactics,Artillery',
    'Toss A Coin': 'Ranger,Outlander,Tracking,Animal Handling,Sense',
    'Would You Kindly?': 'Investigator,Insight,Interrogation,Sense',
    'I Am Vengeance': 'Warrior,Longblade,Bludgeon,Might',
    'The Cake Is A Lie': 'Technologist,Hacking,Robotics,Computer Science,Artifice',
    'Tough Cookie': 'Outlander,Bushcraft,Fortitude',
    'Rip And Tear': 'Soldier,Longblade,Might',
    'Strafe Lurch': 'Running,Jumping,Agility',
    'Flash Out': 'Grenade,Explosives,Artillery,Tactics',
    'Pause Menu': 'Sling,Strength Training,Might',
    'Girlies Love Cannons': 'Artillery,Mass Driver,Grenade,Explosives',
    'Return to Sender': 'Shield,Longblade,Shortblade,Bludgeon',
    'Nobody Gets Left Behind': 'Medic,Strength Training,Might,Fortitude',
    'Witness Me': 'Performer,Leadership,Presence',
    'Right Where I Want You': 'Shield,Warrior,Fortitude',
    'Hold My Drink': 'Performer,Acrobatics,Jumping,Agility',
    'Professional Courtesy': 'Artisan,Merchant,Fine Crafting,Negotiation',
    'Dead Men Tell Tales': 'Investigator,Medic,Criminology,Medicine,Sense',
    'Percussive Maintenance': 'Salvager,Vehicle Repair,Engineering,Artifice,Might',
    Breadcrumbs: 'Navigator,Navigation,Cartography,Tracking,Sense',
    'A Debt Worth Keeping': 'Diplomat,Merchant,Negotiation',
    'You Owe Me a Death': 'Criminal,Intimidation,Presence',
    'Not My First Funeral': 'Criminal,Stealth,Fortitude',
    Magnum: 'Handgun,Precision',
    'A Cup of Liber-tea': 'Organizer,Intimidation,Presence,Resolve',
    'Oo-rah!': 'Soldier,Organizer,Leadership,Presence',
    "I Knew You'd Say That": 'Investigator,Diplomat,Insight,Intellect',
    'Largest Army': 'Organizer,Leadership,Tactics,Presence',
    Zwerchau: 'Longblade,Shortblade,Warrior,Precision',
    'Certain Birds': 'Investigator,Streetwise,Insight',
    Rasputin: 'Fortitude,Resolve',
    'Too Angry To Die': 'Soldier,Fortitude,Resolve',
    'Get Better': 'Medic,Medicine,Intellect,Precision',
    'Pillar Of Flame': 'Arcana,Explosives,Emitter',
    'Steel Chair': 'Laborer,Bludgeon,Strength Training,Might',
    Luchador: 'Grappling,Natural,Strength Training,Might,Agility',
    'More Than Capable': 'Artisan,Performer,Academic',
    'Death On The Line': 'Soldier,Fortitude,Resolve',
    'Final Destination': 'Investigator,Tactics,Sense',
    Indomitable: 'Fortitude,Resolve',
    'Would You Like To Know More?': 'Organizer,Politics,Persuasion,Presence',
    'Run the Numbers': 'Academic,Mathematics,Accounting,Economics,Intellect,Sense',
    'The Missing Piece': 'Investigator,Criminology,Insight,Intellect',
    'Ghost in the Ledger': 'Criminal,Accounting,Deception,Artifice,Charm',
    'The Fine Print': 'Merchant,Law,Negotiation,Accounting',
    'No One Important': 'Criminal,Disguise,Stealth,Charm,Presence',
    'I Was Never Here': 'Criminal,Stealth,Lockpicking,Sleight of Hand',
    'Payment in Kind': 'Merchant,Negotiation,Appraisal,Charm',
    'Jury-Rigged': 'Salvager,Technologist,Artisan,Engineering,Artifice',
    'A Better Mousetrap': 'Artisan,Technologist,Engineering,Artifice,Sense',
    Firebreak: 'Salvager,Construction,Artifice,Sense',
    'Not One Step Further': 'Enforcer,Shield,Might,Resolve',
    Overwatch: 'Rifle,Tension,Shotgun,Tactics,Precision',
    'The Show Must Go On': 'Performer,Music,Deception,Charm,Presence',
    "That's On Me": 'Organizer,Leadership,Resolve',
    'Bedside Manner': 'Medic,Medicine,Intellect,Precision',
    'Wrong Turn': 'Navigator,Navigation,Cartography,Piloting',
    'Hands-On Training': 'Academic,Organizer,Leadership',
    'Inside Man': 'Criminal,Streetwise,Diplomat',
    'May The Force Be With You': 'Gunnery,Piloting,Precision',
    'Max Burn': 'Piloting,Agility',
    'Engage!': 'Piloting,Navigator,Navigation',
    'Sic Parvis Magna': 'Piloting,Gunnery,Tactics',
    Hotshot: 'Piloting,Agility,Precision',
    'Vacuum Training': 'Salvager,Fortitude,Resolve',
    'Silent Running': 'Piloting,Stealth,Agility',
    'Fire-Control Solution': 'Gunnery,Electronics,Sense,Artifice',
    Overclock: 'Technologist,Electronics,Engineering,Artifice',
    'Hard Dock': 'Piloting,Soldier,Tactics'
  };

  function selected(state, granted = []) {
    const seen = new Set();
    const result = [];
    for (const name of [...granted, ...(state.powers || [])]) {
      const power = find(name);
      if (!power || seen.has(power.name)) continue;
      seen.add(power.name);
      let choice = '';
      const stored = state.powerChoices?.[power.name];
      if (experts[power.name] && Array.isArray(stored)) choice = stored.join(', ');
      if (power.name === 'Jack Of All Trades' && stored?.name) choice = stored.category + ' · ' + stored.name;
      if (power.name === 'A Debt Worth Keeping' && stored) {
        choice = state.bonds?.find(bond => bond.id === stored && bond.type === 'Favor')?.text || '';
      }
      result.push({ ...power, choice });
    }
    return result;
  }

  function talentGrants(state, granted = []) {
    const result = {};
    for (const power of selected(state, granted)) {
      const stored = state.powerChoices?.[power.name];
      if (power.name === 'Steal the Moon') result['Practical|Heist planning'] = 3;
      if (experts[power.name] && Array.isArray(stored)) {
        stored.forEach(terrain => { result['Practical|' + terrain + ' expert'] = 3; });
      }
      if (power.name === 'Jack Of All Trades' && stored?.name) {
        result[stored.category + '|' + stored.name] = 2;
      }
    }
    return result;
  }

  function recommend({ state, granted = [], skills = {}, talents = {}, gear = [], kit = '' }) {
    const evidence = [];
    const add = (kind, key, weight, label) => evidence.push({ kind, key: normalize(key), weight, label });
    for (const name of new Set((state.mains || []).map(path => path.key))) add('path', name, 6, name + ' lifepath');
    if (kit) add('kit', kit, 4, kit + ' kit');
    for (const [name, level] of Object.entries(skills)) {
      if (level > 1) add('skill', name, Math.min(level - 1, 4) * 1.5, name + ' d' + (2 + 2 * level));
    }
    for (const [key, level] of Object.entries(talents)) {
      if (level < 1) continue;
      const [category, name] = key.split('|');
      add('category', category, 1, category + ' training');
      add('talent', name, 5 + Math.min(level, 5) * 2, name + ' d' + (2 + 2 * level));
    }
    for (const item of gear) {
      const [name, type] = item.split('|').map(part => part.trim());
      const subtype = /^weapon,\s*(.+)$/i.exec(type || '');
      if (subtype) add('gear', subtype[1], 5, name);
    }
    const spaceBuild = evidence.some(e => ['piloting', 'gunnery'].includes(e.key)) ||
      state.setting === 'Science Fiction' || state.gearSetting === 'Science Fiction';
    const taken = new Set(selected(state, granted).map(p => p.name));
    const matches = [];
    for (const power of library) {
      if (taken.has(power.name) || (power.scope === 'Starship' && !spaceBuild)) continue;
      const keys = (affinities[power.name] || '').split(',').map(normalize);
      const ranked = evidence.filter(e => keys.includes(e.key)).sort((a, b) => b.weight - a.weight);
      // A second weapon of the same subtype shouldn't count as a second reason.
      const factors = ranked.filter((e, i) => ranked.findIndex(x => x.kind === e.kind && x.key === e.key) === i);
      if (factors.length) matches.push({
        power,
        score: factors.slice(0, 4).reduce((sum, e) => sum + e.weight, 0),
        reason: factors.slice(0, 2).map(e => e.label).join(' and ')
      });
    }
    return matches.sort((a, b) => b.score - a.score || a.power.name.localeCompare(b.power.name)).slice(0, 3);
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(text, action, label = text) {
    const node = element('button', 'btn small', text);
    node.type = 'button';
    node.setAttribute('aria-label', label);
    node.addEventListener('click', action);
    return node;
  }

  function select(values, value) {
    const node = element('select');
    values.forEach(option => node.add(new Option(option, option)));
    node.value = value;
    return node;
  }

  function field(caption, control) {
    const label = element('label', 'power-field');
    control.setAttribute('aria-label', caption);
    label.append(element('span', '', caption), control);
    return label;
  }

  function heading(power) {
    const meta = [power.type, power.cooldown, power.speed].filter(Boolean).join(' · ');
    return power.scope === 'Starship' ? 'Starship · ' + meta : meta;
  }

  function entry(power, badge = '') {
    const details = element('details', 'power-entry');
    const summary = element('summary');
    const title = element('span', 'power-entry-title');
    title.append(element('strong', '', power.name), element('small', '', heading(power)));
    summary.append(title);
    if (badge) summary.append(element('span', 'power-entry-badge', badge));
    details.append(summary, element('p', 'power-description', power.description));
    return details;
  }

  // Old bonds can receive a stable local key when first used by a power.
  function bondId(bond, state) {
    if (!bond.id) {
      let i = 1;
      while (state.bonds.some(b => b.id === 'bond-' + i)) i++;
      bond.id = 'bond-' + i;
    }
    return bond.id;
  }

  function mount(container, context) {
    const { state, granted = [], talents = {}, talentCatalog = {}, onChange = () => {} } = context;
    state.powers ||= [];
    state.powerChoices ||= {};
    const grantedNames = new Set(granted.map(name => find(name)?.name));
    const sheet = element('div');
    const recs = element('div');
    const browse = element('div', 'power-browse');
    const groups = element('div');
    const count = element('p', 'power-match-count');
    count.setAttribute('aria-live', 'polite');
    const announcement = element('span', 'power-sr');
    announcement.setAttribute('role', 'status');
    const search = element('input');
    search.type = 'search';
    search.placeholder = 'Name, effect, talent, or action';
    const type = select(['All types', 'Move', 'Passive'], 'All types');
    const scope = select(['All rules', 'Core', 'Starship'], 'All rules');
    const filters = element('div', 'power-filters');
    filters.append(field('Search powers', search), field('Type', type), field('Rule set', scope));
    browse.append(element('h3', '', 'Power library'), filters, count, groups);
    const rule = element('p', 'rules-note',
      'Diplomats gain a power from their lifepath. Additional powers normally cost 4 XP each during advancement. Add any powers your character has earned or your GM has granted.');
    container.replaceChildren(rule, sheet, recs, browse, announcement);

    function notify() {
      onChange();
      // Rebuild local panels only, preserving the search and filter inputs.
      render();
    }

    function selectPower(power) {
      if (!grantedNames.has(power.name) && !state.powers.includes(power.name)) state.powers.push(power.name);
      notify();
      announcement.textContent = power.name + ' added to your sheet.';
      const row = [...sheet.querySelectorAll('details')].find(node => node.dataset.power === power.name);
      if (row) {
        row.open = true;
        row.querySelector('summary').focus({ preventScroll: true });
      }
    }

    function removePower(power) {
      state.powers = state.powers.filter(name => find(name)?.name !== power.name);
      delete state.powerChoices[power.name];
      notify();
      announcement.textContent = power.name + ' removed from your sheet.';
      (sheet.querySelector('summary') || search).focus({ preventScroll: true });
    }

    function choices(power) {
      const config = experts[power.name];
      if (config) {
        const box = element('fieldset', 'power-choices');
        box.append(element('legend', '', 'Choose up to ' + config.max + ' new terrain expert Talents (d8)'));
        const chosen = state.powerChoices[power.name] || [];
        const otherTerrains = new Set();
        for (const p of selected(state, granted)) {
          if (p.name !== power.name && experts[p.name]) {
            (state.powerChoices[p.name] || []).forEach(terrain => otherTerrains.add(normalize(terrain)));
          }
        }
        for (const [key, level] of Object.entries(talents)) {
          const name = normalize(key.split('|')[1]);
          if (level && name.endsWith(' expert')) otherTerrains.add(name.slice(0, -7));
        }
        const options = element('div', 'power-terrains');
        for (const terrain of config.terrains) {
          const label = element('label');
          const input = element('input');
          input.type = 'checkbox';
          input.checked = chosen.includes(terrain);
          input.disabled = !input.checked && (otherTerrains.has(normalize(terrain)) || chosen.length >= config.max);
          input.addEventListener('change', () => {
            state.powerChoices[power.name] = input.checked ? [...chosen, terrain] : chosen.filter(x => x !== terrain);
            // Only replace this fieldset, keeping the surrounding disclosure open.
            const next = choices(power);
            box.replaceWith(next);
            next.querySelectorAll('input')[config.terrains.indexOf(terrain)].focus({ preventScroll: true });
            onChange();
          });
          label.append(input, ' ' + terrain);
          options.append(label);
        }
        box.append(options);
        return box;
      }
      if (power.name === 'Jack Of All Trades') {
        const box = element('div', 'power-choices');
        const stored = state.powerChoices[power.name] || { category: 'Knowledge', name: '' };
        const cat = select(categories, stored.category);
        const input = element('input');
        input.type = 'text';
        input.placeholder = 'Talent name';
        input.value = stored.name;
        const candidates = element('datalist');
        candidates.id = 'axial-new-talent-options';
        input.setAttribute('list', candidates.id);
        const message = element('span', 'warn');
        message.setAttribute('role', 'status');
        function populate() {
          candidates.replaceChildren(...(talentCatalog[cat.value] || []).filter(name => !talents[cat.value + '|' + name]).map(name => new Option(name, name)));
        }
        function save() {
          const typed = input.value.trim();
          const name = (talentCatalog[cat.value] || []).find(t => normalize(t) === normalize(typed)) || typed;
          const exists = Object.entries(talents).some(([k, level]) => level > 0 && normalize(k) === normalize(cat.value + '|' + name));
          message.textContent = exists ? 'Choose a new Talent. Your character already knows this one.' : '';
          state.powerChoices[power.name] = { category: cat.value, name: exists ? '' : name };
          onChange();
        }
        cat.addEventListener('change', () => { input.value = ''; populate(); save(); });
        input.addEventListener('input', save);
        populate();
        box.append(field('Category', cat), field('New Talent at d6', input), candidates, message);
        return box;
      }
      if (power.name === 'A Debt Worth Keeping') {
        const list = select([], '');
        list.add(new Option('Choose a favor you owe', ''));
        for (const bond of state.bonds || []) {
          if (bond.type === 'Favor' && bond.text.trim()) list.add(new Option(bond.text, bondId(bond, state)));
        }
        list.value = state.powerChoices[power.name] || '';
        list.addEventListener('change', () => { state.powerChoices[power.name] = list.value; onChange(); });
        return field('Favor bond', list);
      }
      return null;
    }

    function renderSheet(powers) {
      sheet.replaceChildren(element('h3', '', 'Powers on your sheet'));
      if (!powers.length) sheet.append(element('p', 'rules-note', 'No powers selected.'));
      for (const power of powers) {
        const grantedHere = grantedNames.has(power.name);
        const row = entry(power, grantedHere ? 'Lifepath' : '');
        row.dataset.power = power.name;
        const choice = choices(power);
        if (choice) row.append(choice);
        if (!grantedHere) row.append(button('Remove', () => removePower(power), 'Remove ' + power.name));
        sheet.append(row);
      }
    }

    function renderRecommendations() {
      recs.replaceChildren(element('h3', '', 'Recommended for this character'));
      const rows = recommend(context);
      if (!rows.length) recs.append(element('p', 'rules-note', 'Choose lifepaths, talents, or a gear kit to see matching powers.'));
      for (const { power, reason } of rows) {
        const row = entry(power);
        row.append(button('Add power', () => selectPower(power), 'Add recommended power ' + power.name));
        row.querySelector('.power-entry-title').append(element('span', 'power-match', 'Matches ' + reason));
        recs.append(row);
      }
    }

    function renderLibrary() {
      const taken = new Set(selected(state, granted).map(power => power.name));
      const words = normalize(search.value).split(/\s+/).filter(Boolean);
      const matches = library.filter(power => {
        if (type.value !== 'All types' && power.type !== type.value) return false;
        if (scope.value !== 'All rules' && power.scope !== scope.value) return false;
        const haystack = normalize([power.name, heading(power), power.description].join(' '));
        return words.every(word => haystack.includes(word));
      });
      const opened = new Set([...groups.querySelectorAll('.power-group[open]')].map(node => node.dataset.group));
      groups.replaceChildren();
      count.textContent = matches.length === 1 ? '1 power' : matches.length + ' powers';
      if (!matches.length) groups.append(element('p', 'rules-note', 'No matching powers. Try a different search or filter.'));
      for (const name of groupNames) {
        const members = matches.filter(p => groupOf(p) === name);
        if (!members.length) continue;
        const group = element('details', 'power-group');
        group.dataset.group = name;
        group.open = opened.has(name) || words.length > 0 || type.value !== 'All types' || scope.value !== 'All rules';
        const header = element('summary');
        header.append(element('strong', '', name), element('span', '', members.length));
        group.append(header);
        for (const power of members) {
          const row = entry(power, taken.has(power.name) ? 'On sheet' : '');
          if (!taken.has(power.name)) row.append(button('Add power', () => selectPower(power), 'Add ' + power.name + ' to sheet'));
          group.append(row);
        }
        groups.append(group);
      }
    }

    function render() {
      const openPowers = new Set([...sheet.querySelectorAll('details[open]')].map(row => row.dataset.power));
      renderSheet(selected(state, granted));
      sheet.querySelectorAll('details').forEach(row => { row.open = openPowers.has(row.dataset.power); });
      renderRecommendations();
      renderLibrary();
    }

    // A favor may be written on this step after choosing A Debt Worth Keeping.
    refreshFavorOptions.set(state, () => {
      if (container.isConnected && selected(state, granted).some(power => power.name === 'A Debt Worth Keeping')) render();
    });
    search.addEventListener('input', renderLibrary);
    type.addEventListener('change', renderLibrary);
    scope.addEventListener('change', renderLibrary);
    render();
  }

  const prompts = {
    Favor: ["I owe ____ for ____. I'll repay them by ____.", "If ____ asks for my help, I'll ____."],
    Friend: ["I trust ____ because ____. I promised them ____.", "When ____ needs me, I'll ____."],
    Foe: ["I hold ____ responsible for ____. I'll ____.", "If ____ threatens ____ again, I'll ____."]
  };

  function mountBonds(container, state, onChange = () => {}) {
    state.bonds ||= [];
    const rows = element('div');
    const rule = element('p', 'rules-note',
      'Write one bond for each other party member and one for an important NPC from your backstory. A bond can be a favor, a friend, or a foe.');
    const changed = () => { onChange(); refreshFavorOptions.get(state)?.(); };
    const add = button('Add bond', () => {
      state.bonds.push({ type: 'Friend', text: '' });
      render();
      rows.lastElementChild.querySelector('textarea').focus();
      changed();
    });
    container.replaceChildren(rule, rows, add);

    function render() {
      rows.replaceChildren();
      for (const [index, bond] of state.bonds.entries()) {
        const block = element('div', 'bond-row');
        const controls = element('div', 'power-bond-controls');
        const type = select(Object.keys(prompts), bond.type || 'Friend');
        const prompt = select([], '');
        const text = element('textarea');
        text.value = bond.text;
        text.placeholder = 'Who is the bond with? What ties you to them?';
        function fillPrompts() {
          prompt.replaceChildren(new Option('Choose a prompt', ''), ...prompts[type.value].map(p => new Option(p, p)));
        }
        type.addEventListener('change', () => { bond.type = type.value; fillPrompts(); changed(); });
        fillPrompts();
        prompt.addEventListener('change', () => {
          if (!prompt.value) return;
          // Keep existing writing when a player asks for another prompt.
          const prefix = text.value.trimEnd();
          text.value = prefix ? prefix + '\n' + prompt.value : prompt.value;
          bond.text = text.value;
          prompt.value = '';
          text.focus();
          changed();
        });
        text.addEventListener('input', () => { bond.text = text.value; onChange(); });
        text.addEventListener('change', changed);
        const remove = button('Remove', () => {
          state.bonds.splice(index, 1);
          render();
          (rows.querySelector('textarea') || add).focus();
          changed();
        }, 'Remove bond ' + (index + 1));
        controls.append(field('Bond type', type), field('Writing prompt', prompt), remove);
        block.append(controls, field('Bond ' + (index + 1), text));
        rows.append(block);
      }
    }
    render();
  }

  window.AxialPowerPicker = { find, selected, recommend, talentGrants, mount, mountBonds };
})();
