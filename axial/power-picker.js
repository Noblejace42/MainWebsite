/* Powers and bonds used by the Axial character generator. */
(() => {
  'use strict';

  const library = [...window.AXIAL_POWER_LIBRARY].sort((a, b) => a.name.localeCompare(b.name));
  const normalize = text => String(text || '').trim().replace(/[‘’]/g, "'").toLowerCase();
  const byName = new Map(library.map(power => [normalize(power.name), power]));
  const find = name => byName.get(normalize(name));
  const groupNames = ['Core moves', 'Core passives', 'Starship moves'];
  const groupOf = power => power.scope + (power.type === 'Move' ? ' moves' : ' passives');
  const refreshFavorOptions = new WeakMap();
  const browsing = new WeakMap();
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

  // Player-facing discovery terms. Move/passive, cooldown and speed are from the rulebook.
  const uses = {
    'Combat': {
      'Cheap Shot': 'Choose two rewards when your attack succeeds, including movement or extra damage.',
      'Called Shot': 'Turn a successful ranged attack into a disarm, stun, or another called-shot effect.',
      'Seeing Red': 'Add your Strain to your attack total.',
      'Blood for the Blood God': 'A qualifying weapon kill reduces your Strain.',
      'Melee Master': 'Raise a melee weapon’s potency and keep it in hand while conscious.',
      'Rage Against the Machine': 'Step up every contest die for the encounter, then take 2 Strain.',
      'Blot out the Sun': 'Spend an Ammo to follow a long- or far-range attack with another attack.',
      Discombobulate: 'After a successful attack, trade 1 Strain for extra damage from your Intellect die.',
      'Punch God': 'Step up all dice twice when you stand against overwhelming odds.',
      'Shoot First': 'Take an extra attacking turn at the very start of combat.',
      'Volta Gloria': 'Enter combat without surges and you immediately gain one.',
      'Devilish Po': 'Prepare to take three heavy actions on your next turn.',
      'I Am Vengeance': 'Give a same-zone attack the Brutal and Violent bonuses.',
      'Rip And Tear': 'Continue attacking new targets as long as each attack kills its target.',
      'Strafe Lurch': 'Move exactly three zones and immediately attack at your destination.',
      'Flash Out': 'Step up your explosive attack against a weakened, surprised, or incapacitated target.',
      'Pause Menu': 'Treat every weapon you wield as Throwable.',
      'Girlies Love Cannons': 'Add Shredding to ranged weapons that qualify as Brutal or Explosive.',
      'Return to Sender': 'After a successful same-zone defense, spend Strain to counterattack in melee.',
      'Right Where I Want You': 'A successful same-zone defense sets up your next attack against that creature.',
      'Hold My Drink': 'Use the surroundings for a stunt that can reposition allies or set up an attack.',
      Magnum: 'Spend an extra Ammo on a qualifying handgun shot to count four attack dice and reduce cover.',
      Zwerchau: 'A damaging melee counterattack can cancel your opponent’s incoming attack.',
      'Pillar Of Flame': 'Turn an available source of significant fire into a short-lived zone hazard.',
      'Steel Chair': 'Use a loose object for a single attack that can stun, reposition, or disarm.',
      Luchador: 'Contest Might and Agility to throw, slow, disarm, or damage a creature in reach.',
      'Final Destination': 'Follow a narrowly avoided environmental danger with a plausible secondary hazard.',
      'Not One Step Further': 'Contest Might and Resolve to block an enemy at a passage.',
      Overwatch: 'Ready a ranged attack to cover a visible zone until your next turn.'
    },
    'Survival': {
      'Second Wind': 'Your Fortitude and Resolve contest total determines how much health you recover.',
      'Under Pressure': 'Reverse a Strain increase and use Strain to help resist peril.',
      Windstance: 'Step up every defend die while wearing only Gear-tagged items or no wearables.',
      'Unbreakable Mind': 'Your Resolve die can reinforce both defense and resisting peril.',
      'Iron-Willed': 'A further Strain increase at 5 or higher can become relief and a surge.',
      'Frantic Parry': 'Trade 1d4 Strain to avoid losing health from damage.',
      'Dumb Luck': 'Taking a risk can earn a surge when you successfully resist peril.',
      'Glancing Blow': 'Your Toughness wearables also qualify as Protective.',
      Juggernaut: 'Three qualifying heavy wearables let you step up your armor dice on defense.',
      'Sage Knight': 'An hour of quiet meditation after battle removes 1d4 Strain.',
      'Ad Astra Per Aspera': 'Sacrifice Talent levels to avoid a wound.',
      'Bullet Time': 'Stay untargetable by attacks and step up resist peril dice until your next turn.',
      'Cheat Death': 'Return to full health at the cost of permanent maximum health.',
      'Resist and Bite': 'Redirect part of an incoming melee strike to a target in your zone.',
      'Tough Cookie': 'Ignore low Strain when rolling and ease Strain when you make camp.',
      'Not My First Funeral': 'If allies cannot see your body, return next encounter at 1 health with complications.',
      Rasputin: 'Choose between two wound rolls and lean on Fortitude when badly wounded or scarred.',
      'Too Angry To Die': 'Defer a wound for one turn and try to take down its cause.',
      'Death On The Line': 'Count four dice on a life-or-death contest at the risk of another wound.',
      Indomitable: 'Spend Strain to act through Stunned, Slowed, or Paralyzed for a turn.'
    },
    'Travel & fieldcraft': {
      'Experienced Explorer': 'Learn up to four new terrain expert Talents at d8.',
      'Master Quartermaster': 'Step up two dice and avoid complications when setting camp, managing logistics, or cooking.',
      Gatecrasher: 'Step up Might when breaking an obstacle and choose a benefit on success.',
      Strider: 'Protect your next roll from complications when you journey planetside or make camp.',
      'Superior Explorer': 'Learn up to two terrain expert Talents and halve the party’s rations in your expert terrains.',
      'The Great Escape': 'Ask the GM about a route to safety or a nearby danger.',
      'Wide Wanderer': 'Step up a die while traveling somewhere new.',
      'Journey Before Destination': 'Form a bond on the road and ease Strain when traveling with someone you share a bond with.',
      'Wall Jumper': 'Reach a nonadjacent zone by climbing a suitable wall.',
      'Toss A Coin': 'Step up every die when tracking a dangerous or monstrous non-humanoid creature.',
      Breadcrumbs: 'Lead the way on a familiar route and learn what has changed since your last visit.',
      'Wrong Turn': 'Choose between two plausible destinations after failed navigation.'
    },
    'Influence & contacts': {
      'Port in the Storm': 'A warm welcome in a familiar place can bring contacts, local news, or an audience.',
      Speakeasy: 'Speak frankly, ask a question from the list, and answer truthfully if they ask one in return.',
      'Herald of Law': 'Contest Presence and Charm to challenge a lawbreaker and shape their reaction.',
      'Kingly Wit': 'New bonds earn surges, and a negotiation complication can become a bond.',
      'Black Market Connections': 'Ask about the criminal underground or the availability of illicit goods in a settlement.',
      "Hondo's Return": 'A triumphant return can win an audience over for your next negotiation.',
      'The Ability to Speak': 'Grasp the gist of intelligent communication and improve translation contests.',
      'Breaker of War': 'A successful negotiation can divide a hostile force or persuade it to stand down.',
      'Professional Courtesy': 'Bring a shared trade into negotiations and learn a local detail.',
      'A Debt Worth Keeping': 'Earn two surges and lose 2 Strain when you fulfill your chosen favor at meaningful cost.',
      'You Owe Me a Death': 'Offer a spared enemy a bargain that can later provide shelter, passage, or intervention.',
      'A Cup of Liber-tea': 'Contest Presence and Resolve to challenge coercion in front of witnesses.',
      'Certain Birds': 'Spend an hour gathering rumors to learn something true and find another lead.',
      'Would You Like To Know More?': 'Use a public message to spread a claim, recruit support, or divert attention.',
      'The Fine Print': 'Identify a costly or overlooked term and step up two dice when you next negotiate or exploit that issue.',
      'No One Important': 'Contest Charm and Presence to pass unnoticed during routine scrutiny.',
      'Payment in Kind': 'Negotiate a favor you can deliver when Wealth alone cannot cover a purchase.',
      'The Show Must Go On': 'Hold an audience’s attention so an ally can take a discreet action.',
      'Inside Man': 'Establish a contact inside a familiar organization and ask for limited help.'
    },
    'Investigation & planning': {
      'The Arcane and Esoteric': 'Lean on Intellect when seeking answers about the mysterious or unknown.',
      'Steal the Moon': 'Learn heist planning at d8 and gain better information when planning a heist.',
      'Font of Knowledge': 'Spend 1 Strain to get a useful fact in a Knowledge Talent you possess.',
      'Ask Questions Later': 'After a fight, learn something about an opponent you had intended to question.',
      'Would You Kindly?': 'Detect a lie or omission and improve your next contest against its source.',
      'Dead Men Tell Tales': 'Question the evidence left by a corpse or a destroyed machine.',
      "I Knew You'd Say That": 'Describe a plausible precaution you prepared and pay the GM’s chosen cost.',
      'Run the Numbers': 'Use Intellect and Sense to compare plans and uncover one significant risk.',
      'The Missing Piece': 'Connect existing clues and identify the next line of inquiry.',
      'Ghost in the Ledger': 'Contest Artifice and Charm to change a mundane fact in accessible records.',
      'I Was Never Here': 'Conceal your part in a completed covert undertaking by dealing with accessible evidence.'
    },
    'Craft & equipment': {
      'Tactical Reload': 'Spend an hour examining a weapon to trade one of its tags for a GM-offered tag.',
      'The Cake Is A Lie': 'Manipulating AI-controlled technology steps up a die and eases Strain.',
      'Percussive Maintenance': 'Use Artifice and Might to keep a damaged object working for an encounter.',
      'Jury-Rigged': 'Spend one Supplies to improvise a d6 tool for a Practical Talent until the encounter ends.',
      'A Better Mousetrap': 'Build a zone trap whose difficulty comes from your Artifice and Sense contest.',
      Firebreak: 'Use Artifice, Sense, and equipment to contain a spreading hazard for two rounds.'
    },
    'Party support': {
      'Surging Support': 'Spend surges on other players and carry up to ten.',
      Bulwark: 'Share your defense dice with an ally in your zone and take damage on their behalf.',
      'Setup Strike': 'Attack an enemy in an ally’s zone to improve that ally’s next attack against it.',
      'Forth Eorlingas!': 'Help different allies manage Strain, gain a surge, or act earlier when outnumbered.',
      'Nobody Gets Left Behind': 'Bring a willing or unconscious ally with you into an adjacent zone.',
      'Witness Me': 'An attack that succeeds can grant a surge to one ally and ease another’s Strain.',
      'Oo-rah!': 'Rally up to three allies as combat begins so they can move, shed Strain, or brace for peril.',
      'Largest Army': 'Coordinate three or more allies and step up every die on a cooperative contest.',
      'Get Better': 'Use Intellect, Precision, and medical equipment to provide two emergency treatment effects.',
      "That's On Me": 'Intercept a complication you could reasonably bear for an ally and gain a surge.',
      'Bedside Manner': 'A week of medical care and a successful contest can help a patient heal without a scar.',
      'Hands-On Training': 'Lend a willing ally your Talent die for one relevant contest.'
    },
    'Talents & contests': {
      'Focused Training': 'Use an extended break to retrain Talents and gain a surge.',
      'Push beyond limit': 'Step up two dice for a contest, then take 1 Strain.',
      'Jack Of All Trades': 'Learn a new Talent now and start new Talents at d6.',
      'Sheer Spite': 'Roll Resolve to add to a contest before you know its outcome.',
      'Dark Confidant': 'Trade matching-size dice with an opposing pool after seeing its total, then take 1 Strain.',
      'Flames Of My Desire': 'Pursue a chosen desire to step up two dice, with the chance of a complication.',
      'Tricks of the Trade': 'Rolling the maximum on a qualifying pool raises two Talents used in it.',
      'Fool me Once': 'If your second contest of an encounter fails, you can turn it into a success.',
      'Ace up the Sleeve': 'When a contest uses exactly one Talent die, step up your whole pool.',
      'More Than Capable': 'Spend Strain to adapt a Talent you already know to an unfamiliar task.'
    },
    'Starship operations': {
      'May The Force Be With You': 'Spend a surge to add a d12 to Dogfight or Open Fire after rolling.',
      'Max Burn': 'Trade Fuel for Advantage while piloting, including an opening boost during the Merge.',
      'Engage!': 'Skip immediately on a valid route, then mark up to 1d4 randomly chosen undamaged hardpoint modules Damaged.',
      'Sic Parvis Magna': 'Gain Advantage while piloting and Open Fire on a detected lowest-Advantage opponent.',
      Hotshot: 'Take two pilot maneuvers back to back for 1 Strain.',
      'Vacuum Training': 'Contest Fortitude and Resolve to postpone decompression and suffocation during vacuum exposure.',
      'Silent Running': 'Trade Advantage for an attempt to break sensor contact.',
      'Fire-Control Solution': 'Contest Sense and Artifice at the sensors to help an allied weapon operator target a ship.',
      Overclock: 'Step up a weapon or thruster module’s next contribution, then mark it Damaged.',
      'Hard Dock': 'Force a boarding connection with a successful Dogfight and functioning Boarding Tubes.'
    }
  };
  const purpose = new Map();
  for (const [focus, entries] of Object.entries(uses)) {
    for (const [name, benefit] of Object.entries(entries)) purpose.set(normalize(name), {focus, benefit});
  }
  const matchKeys = new Map(Object.entries(affinities).map(([name, signals]) => [normalize(name), signals.split(',').map(normalize)]));

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

  function recommend({ state, granted = [], skills = {}, talents = {}, gear = [], kit = '' }, focus = '', limit = 3) {
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
      for (const tag of item.matchAll(/\bAid\|([\w -]+)/gi)) add('gear', tag[1], 5, name);
      if (/\bToughness \d+/i.test(item)) add('gear', 'Toughness', 9, name);
      if (subtype && /\bhandgun\b/i.test(subtype[1]) && /\b(?:Ammo|Loading)\b/i.test(item)) add('gear', 'qualifying handgun', 5, name);
    }
    const spaceBuild = evidence.some(e => ['piloting', 'gunnery'].includes(e.key)) ||
      state.setting === 'Science Fiction' || state.gearSetting === 'Science Fiction';
    const taken = new Set(selected(state, granted).map(p => p.name));
    const matches = [];
    for (const power of library) {
      const use = purpose.get(normalize(power.name));
      if (taken.has(power.name) || (focus && use?.focus !== focus)) continue;
      if (power.scope === 'Starship' && !spaceBuild && focus !== 'Starship operations') continue;
      const keys = [...(matchKeys.get(normalize(power.name)) || [])];
      if (power.name === 'Glancing Blow') keys.push('toughness');
      if (power.name === 'Magnum') keys.push('qualifying handgun');
      const ranked = evidence.filter(e => keys.includes(e.key)).sort((a, b) => b.weight - a.weight);
      // Count an item only once, even if both its subtype and tags apply.
      const factors = ranked.filter((e, i) => ranked.findIndex(x => x.kind === e.kind && (x.key === e.key || x.label === e.label)) === i);
      if (power.name === 'A Debt Worth Keeping' && (state.bonds || []).some(b => b.type === 'Favor' && b.text.trim())) {
        factors.unshift({label: 'an existing favor bond', weight: 9});
      }
      if (power.name === 'Font of Knowledge' && !evidence.some(e => e.kind === 'category' && e.key === 'knowledge')) continue;
      if (!factors.length && !focus) continue;
      const reason = factors.length ? 'Matches ' + factors.slice(0, 2).map(e => e.label).join(' and ') + '.' : 'Fits your ' + focus.toLowerCase() + ' focus.';
      matches.push({power, score: factors.slice(0, 4).reduce((sum, e) => sum + e.weight, 0), reason, benefit: use?.benefit || '', focus: use?.focus || ''});
    }
    return matches.sort((a, b) => b.score - a.score || a.power.name.localeCompare(b.power.name)).slice(0, limit);
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
    const metadata = element('small');
    metadata.append(element('em', '', heading(power)));
    title.append(element('strong', '', power.name), metadata);
    summary.append(title);
    if (badge) summary.append(element('span', 'power-entry-badge', badge));
    const effect = window.AxialPowerText?.render(power) || element('p', '', power.description);
    effect.classList.add('power-description');
    details.append(summary, effect);
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
    const view = browsing.get(state) || { search: '', type: 'All types', scope: 'All rules', cadence: 'Any frequency', focus: 'Any playstyle', page: 0, expanded: new Set() };
    browsing.set(state, view);
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
    search.placeholder = 'Search names, effects, or playstyles';
    search.value = view.search;
    const type = select(['All types', 'Move', 'Passive'], view.type);
    const scope = select(['All rules', 'Core', 'Starship'], view.scope);
    const cadence = select(['Any frequency', 'At-will', 'Encounter', 'Recovery'], view.cadence);
    const focus = select(['Any playstyle', ...Object.keys(uses)], view.focus);
    const recList = element('div');
    const recPages = element('div', 'power-pager');
    recs.append(element('h3', '', 'Recommended for this character'), field('Recommendation focus', focus), recList, recPages);
    focus.addEventListener('change', () => { view.focus = focus.value; view.page = 0; renderRecommendations(); });
    const filters = element('div', 'power-filters');
    filters.append(field('Search powers', search), field('Type', type), field('Rule set', scope), field('Cooldown', cadence));
    browse.append(element('h3', '', 'Power library'), filters, count, groups);
    const rule = element('p', 'rules-note',
      'Diplomats gain a power from their lifepath. Additional powers normally cost 4 XP each during advancement. Add any powers your character has earned or your GM has granted.');
    container.replaceChildren(rule, sheet, recs, browse, announcement);

    function notify() {
      onChange();
      // Rebuild local panels only, preserving the search and filter inputs.
      render();
    }

    function selectPower(power, fromLibrary = false) {
      if (!grantedNames.has(power.name) && !state.powers.includes(power.name)) state.powers.push(power.name);
      notify();
      announcement.textContent = power.name + ' added to your sheet.';
      const row = [...sheet.querySelectorAll('details')].find(node => node.dataset.power === power.name);
      if (row?.querySelector('fieldset, select, input')) {
        row.open = true;
        row.querySelector('summary').focus();
      } else {
        const source = fromLibrary ? [...groups.querySelectorAll('.power-entry')].find(node => node.dataset.name === power.name) : null;
        (source?.querySelector('summary') || recList.querySelector('summary') || search).focus({preventScroll: true});
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
            // Terrain choices are exclusive across both Explorer powers.
            for (const row of sheet.querySelectorAll('details')) {
              if (!experts[row.dataset.power]) continue;
              const next = choices(find(row.dataset.power));
              row.querySelector('fieldset').replaceWith(next);
              if (row.dataset.power === power.name) next.querySelectorAll('input')[config.terrains.indexOf(terrain)].focus({ preventScroll: true });
            }
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
      recList.replaceChildren();
      recPages.replaceChildren();
      const rows = recommend(context, view.focus === 'Any playstyle' ? '' : view.focus, Infinity);
      const size = 3;
      const pages = Math.ceil(rows.length / size);
      view.page = Math.max(0, Math.min(view.page, pages - 1));
      if (!rows.length) recList.append(element('p', 'rules-note', 'Choose a playstyle above, or add lifepaths, talents, and gear to find matches.'));
      for (const { power, reason, benefit } of rows.slice(view.page * size, (view.page + 1) * size)) {
        const row = entry(power);
        row.querySelector('.power-entry-title').append(element('span', 'power-benefit', benefit), element('span', 'power-match', reason));
        const wrap = element('div', 'power-result');
        wrap.append(row, button('Add', () => selectPower(power), 'Add recommended power ' + power.name));
        recList.append(wrap);
      }
      if (pages > 1) {
        const label = element('span', 'power-match-count', 'Matches ' + (view.page * size + 1) + '–' + Math.min(rows.length, (view.page + 1) * size) + ' of ' + rows.length);
        label.setAttribute('aria-live', 'polite');
        function flip(delta) {
          view.page += delta;
          renderRecommendations();
          const enabled = [...recPages.querySelectorAll('button')].filter(item => !item.disabled);
          enabled[delta < 0 ? 0 : enabled.length - 1]?.focus({preventScroll: true});
        }
        const prev = button('Previous', () => flip(-1), 'Previous power suggestions');
        const next = button('More suggestions', () => flip(1), 'More power suggestions');
        prev.disabled = view.page === 0;
        next.disabled = view.page === pages - 1;
        recPages.append(label, prev, next);
      }
    }

    function renderLibrary() {
      const taken = new Set(selected(state, granted).map(power => power.name));
      const words = normalize(search.value).split(/\s+/).filter(Boolean);
      Object.assign(view, {search: search.value, type: type.value, scope: scope.value, cadence: cadence.value});
      const matches = library.filter(power => {
        if (type.value !== 'All types' && power.type !== type.value) return false;
        if (scope.value !== 'All rules' && power.scope !== scope.value) return false;
        if (cadence.value !== 'Any frequency' && power.cooldown !== cadence.value) return false;
        const use = purpose.get(normalize(power.name));
        const haystack = normalize([power.name, heading(power), use?.focus, use?.benefit, power.description].join(' '));
        return words.every(word => haystack.includes(word));
      });
      const read = new Set([...groups.querySelectorAll('.power-entry[open]')].map(node => node.dataset.name));
      groups.replaceChildren();
      count.textContent = matches.length === 1 ? '1 power' : matches.length + ' powers';
      if (!matches.length) groups.append(element('p', 'rules-note', 'No matching powers. Try a different search or filter.'));
      for (const name of groupNames) {
        const members = matches.filter(p => groupOf(p) === name);
        if (!members.length) continue;
        const group = element('details', 'power-group');
        group.dataset.group = name;
        group.open = true;
        const header = element('summary');
        header.append(element('strong', '', name), element('span', '', members.length));
        group.append(header);
        const previewSize = 4;
        const preview = !words.length && type.value === 'All types' && scope.value === 'All rules' && cadence.value === 'Any frequency' && members.length > previewSize;
        const toggle = button('', () => {
          if (view.expanded.has(name)) view.expanded.delete(name);
          else view.expanded.add(name);
          visibleRows();
          if (view.expanded.has(name)) group.querySelectorAll('.power-result summary')[previewSize]?.focus({preventScroll:true});
        });
        const membersList = element('div');
        function visibleRows() {
          const expanded = view.expanded.has(name);
          const visible = preview && !expanded ? previewSize : members.length;
          for (const [i, row] of [...membersList.children].entries()) row.hidden = i >= visible;
          const title = expanded ? 'Show fewer' : 'Show all ' + members.length + ' ' + name.toLowerCase();
          toggle.textContent = title;
          toggle.setAttribute('aria-label', expanded ? title + ' ' + name.toLowerCase() : title);
          toggle.setAttribute('aria-expanded', String(expanded));
        }
        for (const power of members) {
          const row = entry(power);
          row.dataset.name = power.name;
          row.open = read.has(power.name);
          const wrap = element('div', 'power-result');
          const action = taken.has(power.name) ? element('span', 'power-on-sheet', 'On sheet') :
            button('Add', () => selectPower(power, true), 'Add ' + power.name + ' to sheet');
          wrap.append(row, action);
          membersList.append(wrap);
        }
        group.append(membersList);
        if (preview) group.append(toggle);
        visibleRows();
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
      if (!container.isConnected) return;
      if (selected(state, granted).some(power => power.name === 'A Debt Worth Keeping')) render();
      else renderRecommendations();
    });
    search.addEventListener('input', renderLibrary);
    type.addEventListener('change', renderLibrary);
    scope.addEventListener('change', renderLibrary);
    cadence.addEventListener('change', renderLibrary);
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
