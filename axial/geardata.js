'use strict';
// ==========================================================================
// AXIAL GEAR FORGE — GAME DATA
// Transcribed from the Axial rulebook (alpha), Section 2 (Objects),
// Section 5.1 (Supplies), and Section 5.4 (Conditions).
// Object struct:  Name | type, subtype | XdY+Z | (Skills, Range, Universal) | (Core, Extra) | Mass
// ==========================================================================

// ---------- Tag rules text (verbatim-adjacent, for tooltips) ----------
const TAG_INFO = {
  'Multipurpose|X': 'This object may also be useful as an X object type in certain scenarios. This object can have tags of X object type.',
  'Special': 'This object has an additional more complicated ability, detailed after the object struct.',
  'Ornate': 'Visually impressive. When you contest while showing off the object to someone it would impress, step up a relevant Skill die.',
  'Charging X': 'After use X times, this object needs to be recharged and cannot be used again until you next recover.',
  'Damaged': 'The next time this object adds dice to a dice pool or would be used, it is destroyed afterwards.',
  'Dangerous': 'Complications while using this object can have wildly unintended side effects, at GM discretion.',
  'Consumable X': 'After X uses, this object is destroyed.',
  'Consistent X': 'You may reroll X 1’s in this object’s dice pool. You must keep the new result.',
  'Melee': 'Meant for use up close (0–2 m). Can be used against targets in the same zone as you.',
  'Near-range': 'Meant for targets you could throw a rock at (2–20 m): same zone or an adjacent zone.',
  'Long-range': 'Meant for targets 20–100 m away; up to 3 zones. Step down all your dice if used to attack a target in the same zone.',
  'Far-range': 'Usable on any target you can see, often beyond 100 m. Step down all your dice if used to attack a target in the same zone.',
  'Agility': 'Agility is an object skill for this object.',
  'Artifice': 'Artifice is an object skill for this object.',
  'Charm': 'Charm is an object skill for this object.',
  'Fortitude': 'Fortitude is an object skill for this object.',
  'Intellect': 'Intellect is an object skill for this object.',
  'Might': 'Might is an object skill for this object.',
  'Presence': 'Presence is an object skill for this object.',
  'Precision': 'Precision is an object skill for this object.',
  'Resolve': 'Resolve is an object skill for this object.',
  'Sense': 'Sense is an object skill for this object.',
  'Intricate 1dX': 'Requires Agility die 1dX to use.',
  'Engineered 1dX': 'Requires Artifice die 1dX to use.',
  'Disarming 1dX': 'Requires Charm die 1dX to use.',
  'Stalwart 1dX': 'Requires Fortitude die 1dX to use.',
  'Complex 1dX': 'Requires Intellect die 1dX to use.',
  'Unruly 1dX': 'Requires Might die 1dX to use.',
  'Commanding 1dX': 'Requires Presence die 1dX to use.',
  'Exacting 1dX': 'Requires Precision die 1dX to use.',
  'Resolute 1dX': 'Requires Resolve die 1dX to use.',
  'Perceptive 1dX': 'Requires Sense die 1dX to use.',
  // Weapon core tags
  'Ammo': 'Complications may force multiple shots and expend 1 ammo. Requires at least one ammo on your person to use.',
  'Loading': 'To use this weapon you must expend an ammo. Complications can still cause extra ammo to be consumed.',
  'Loading|X': 'To use this weapon you must expend a use of special ammo X. Complications can still consume extra ammo.',
  'Throwable': 'You can throw this weapon to attack targets in the same zone or an adjacent zone.',
  'Versatile': 'This weapon can be used as a (Melee) weapon against targets in the same zone.',
  'Quick': 'Attack as a medium move instead of a heavy move. Only one attack per turn. This weapon is one-handed.',
  'Reload X': 'After an attack, this weapon cannot be used for X rounds. Medium moves reduce the wait by one round each.',
  // Weapon extra tags
  'Forceful': 'Pushes an attack target into an adjacent zone on a success.',
  'Energized': 'Does not consume or require ammo. Complications may overheat it until end of your next turn; using it overheated gives (Damaged) after use.',
  'Piercing X': 'Ignores X damage reduction (from any source, typically (Toughness X) wearables) when you attack.',
  'Cycling': 'You can expend 1 ammo when you attack to step up all dice in your pool.',
  'Efficient': 'This weapon has a 50% chance to not consume ammo when it would consume ammo.',
  'Volatile': 'When you contest or attack with this weapon, step up all dice in your pool. Then roll the weapon die and lose that much health.',
  'Shredding X': 'Remove the X smallest wearable/object dice from the defend pool of an opponent defending against this weapon.',
  'Covering X': 'When you attack, that creature and its nearby allies step down X dice on their next ranged attack.',
  'Suppressed': 'Makes little to no noise. Cannot be heard through closed doors/windows or by creatures over 2 zones away.',
  'Explosive': 'Roll your attack against each creature in the target zone; deal damage to each upon successful resolution.',
  'Brutal': 'When you attack, also attack the closest creature to the contested creature with the same roll.',
  'Violent X': 'When you attack, count an additional X dice from your attack pool when calculating your total.',
  'Flaming X': 'On a successful attack, hit targets become enflamed X.',
  'Poisoned X': 'Add +X to your attack total; damaged units become poisoned. After the attack pool is rolled, reduce X by one.',
  'Stunning': 'If you damage a creature with this weapon, roll 1d6; on a 6 they are stunned until the end of their next turn.',
  // Wearable tags
  'Gear': 'This wearable cannot add its object die to your defend pool.',
  'Adornment': 'Usable without hands while worn. You may only have five (Adornment) wearables equipped at once.',
  'Implanted': 'Usable without hands because it is implanted partially or fully subdermally.',
  'Toughness X': 'While equipped, you may reduce the total damage of an attack against you by X.',
  'Shielding X': 'Count an additional X dice from your defend pool so long as this wearable’s die is in it.',
  'Protective': 'If you would take damage, you may instead take no damage and give this wearable the (Damaged) tag.',
  'Resistant X': 'Provides immunity to the X condition.',
  'Supporting X': 'Increases your encumbrance capacity by X mass.',
  // Tool tags
  'Aid|X': 'Can always contribute its object die to a dice pool if a die for Talent X is also in that pool. Step up the die of Talent X.',
  'Supplies X': 'This tool can be created by reducing your Supplies by X. The created tool does not have (Supplies X).'
};

// Requirement tag per skill (for "(Complex 1d8)"-style gates)
const REQ_TAG_OF = {
  Agility: 'Intricate', Artifice: 'Engineered', Charm: 'Disarming', Fortitude: 'Stalwart',
  Intellect: 'Complex', Might: 'Unruly', Presence: 'Commanding', Precision: 'Exacting',
  Resolve: 'Resolute', Sense: 'Perceptive'
};

const DIE_STEPS = [4, 6, 8, 10, 12];

// Conditions usable with (Resistant X), per era (from 5.4 Conditions)
const CONDITIONS = {
  medieval: ['Poisoned', 'Enflamed', 'Stunned', 'Slowed', 'Drowning'],
  fantasy: ['Poisoned', 'Enflamed', 'Stunned', 'Slowed', 'Paralyzed', 'Drowning'],
  modern: ['Poisoned', 'Enflamed', 'Stunned', 'Slowed', 'Drowning'],
  scifi: ['Poisoned', 'Enflamed', 'Stunned', 'Slowed', 'Paralyzed', 'Vacuum Decompression', 'Drowning']
};

// ---------- Quality tiers (balance knobs, applied before generation) ----------
const TIERS = {
  crude:      { label: 'Crude',      pot: [1, 2], die: [4, 6],  acc: [-1, 0], extras: [0, 1], drawback: .55, req: 0,   special: 0,   ornate: 0,   consistent: 0 },
  standard:   { label: 'Standard',   pot: [2, 3], die: [6, 8],  acc: [0, 0],  extras: [0, 1], drawback: .25, req: .1,  special: 0,   ornate: .05, consistent: .1 },
  fine:       { label: 'Fine',       pot: [2, 3], die: [8, 10], acc: [0, 1],  extras: [1, 2], drawback: .2,  req: .2,  special: .05, ornate: .2,  consistent: .25 },
  masterwork: { label: 'Masterwork', pot: [3, 4], die: [8, 12], acc: [1, 2],  extras: [2, 3], drawback: .15, req: .45, special: .25, ornate: .4,  consistent: .4 },
  legendary:  { label: 'Legendary',  pot: [4, 5], die: [10, 12], acc: [2, 3], extras: [3, 4], drawback: .1,  req: .6,  special: 1,   ornate: .6,  consistent: .5 }
};
const TIER_WEIGHTS = { crude: 2, standard: 4, fine: 2.5, masterwork: 1, legendary: .4 };

// ---------- Flavor: materials, prefixes, origins, legendary names ----------
const MATERIALS = {
  medieval: ['Iron', 'Steel', 'Oaken', 'Ashwood', 'Bronze', 'Boiled Leather', 'Wrought Iron', 'Bone-Inlaid', 'Yew', 'Hammered Brass', 'Cold Steel', 'Riveted Mail'],
  fantasy: ['Mithril', 'Starsteel', 'Dragonbone', 'Heartwood', 'Moonsilver', 'Obsidian', 'Runed Iron', 'Elderglass', 'Wyrmhide', 'Sunforged', 'Shadowsilk', 'Crystalline'],
  modern: ['Carbon Steel', 'Polymer', 'Aluminum', 'Titanium', 'Kevlar-Weave', 'Stamped Steel', 'Ballistic Nylon', 'Tungsten', 'Matte-Black', 'Chromed', 'Composite', 'Rubberized'],
  scifi: ['Plasteel', 'Duranium', 'Graphene', 'Nanoweave', 'Ferroceramic', 'Monofilament', 'Photonic', 'Ion-Forged', 'Quantum-Lattice', 'Vat-Grown Chitin', 'Smart-Alloy', 'Zero-G Forged']
};

// Material pool for flex/launch weapons (bows, slings) — metals read wrong there
const MATERIALS_WOOD = {
  medieval: ['Oaken', 'Ashwood', 'Yew', 'Horn-Laminate', 'Elmwood'],
  fantasy: ['Heartwood', 'Moonsilver-Inlaid', 'Dragonbone', 'Elderglass', 'Feywood'],
  modern: ['Composite', 'Carbon-Fiber', 'Aluminum', 'Polymer'],
  scifi: ['Graphene', 'Smart-Alloy', 'Carbon-Lattice', 'Monofilament']
};

const PREFIXES = {
  medieval: ['Notched', 'Trusty', 'Battle-Worn', 'Gleaming', 'Heavy', 'Engraved', 'Blessed', 'Wicked', 'Keen', 'Squire’s', 'Veteran’s', 'Pitted'],
  fantasy: ['Whispering', 'Starlit', 'Cursed', 'Singing', 'Ever-Sharp', 'Glimmering', 'Runebound', 'Stormtouched', 'Feywoven', 'Ashen', 'Twice-Forged', 'Hallowed'],
  modern: ['Surplus', 'Custom', 'Compact', 'Match-Grade', 'Field-Tested', 'Aftermarket', 'Mil-Spec', 'Two-Tone', 'Heavy-Duty', 'Worn', 'Reliable', 'Snub'],
  scifi: ['Prototype', 'Decommissioned', 'Overclocked', 'Salvaged', 'Corp-Issue', 'Void-Rated', 'Self-Calibrating', 'Modular', 'Black-Market', 'Relic-Pattern', 'Hardened', 'Smart-Linked']
};

const ORIGINS = {
  medieval: ['of the Ashford Forge', 'from the Riverlands', 'of Old Caldermoor', 'bearing the Smith-Guild mark', 'of the Border Wars', 'from a hedge-knight’s estate', 'of Saint Aldric’s armory', 'looted from a barrow', 'of the King’s Arsenal', 'from the Iron Coast'],
  fantasy: ['of the Ash Court', 'forged under a blood moon', 'of the Sunken Citadel', 'blessed by the Wandering Choir', 'of the Last Dragonforge', 'traded from the Fey Markets', 'of the Shattered Spire', 'recovered from the Mage Wars', 'of House Veyrin', 'sung into being by stone-singers'],
  modern: ['— Hartwell & Co.', '— Ferro Dynamics', '— eastern-bloc surplus', '— custom shop build', '— Blackmoor Tactical', '— discontinued production run', '— Meridian Arms', '— police trade-in', '— veteran’s bring-back', '— Crowe Outfitters'],
  scifi: ['— Helios Armaments', '— Vex-Tessera Combine', '— Outer Rim pattern', '— Kessler Orbital', '— pre-Collapse stock', '— Mawson Foundry, Titan', '— banned in three systems', '— Ashfall Syndicate', '— UNS military surplus', '— printed on a colony fab']
};

const LEGEND_NAMES = ['Oathkeeper', 'Dawnbreaker', 'Vow of Embers', 'The Quiet Answer', 'Sorrow’s Edge', 'Kingsfall', 'Last Light', 'Murmur', 'The Long Goodbye', 'Widow’s Patience', 'Hymn of Rust', 'Starveling', 'The Arbiter', 'Penance', 'Glasshollow', 'Thunderhead', 'Mercy', 'The Final Word', 'Nightingale', 'Cinderwake', 'Ruin’s Lullaby', 'The Patient Tooth', 'Eventide', 'Borrowed Time'];

// Sensory / craft details woven into descriptions
const DETAILS = {
  medieval: [
    'The grip is wrapped in sweat-darkened cord, rewound a hundred times.',
    'A maker’s mark is stamped near the base — a crescent over crossed nails.',
    'It smells faintly of oil, leather, and old campaigns.',
    'The balance is honest work; nothing fancy, nothing wasted.',
    'Someone carved a prayer into it in a script you don’t recognize.',
    'Years of careful whetting have worn the maker’s mark almost smooth.'
  ],
  fantasy: [
    'Faint runes crawl along it when moonlight touches the surface.',
    'It is always slightly warm, as if recently held by someone else.',
    'When the wind is right, it hums a single low note.',
    'Shadows pool around it a half-second longer than they should.',
    'The metal drinks the light and gives back almost none of it.',
    'It weighs less than it looks like it should — noticeably so.'
  ],
  modern: [
    'The serial number has been professionally filed off.',
    'There’s a strip of worn tape on the side with a name in faded marker.',
    'It has the dull, even wear of equipment that was maintained religiously.',
    'Aftermarket furniture, mismatched but well-fitted.',
    'It still smells like gun oil and cigarette smoke.',
    'Someone scratched five small tallies near the base.'
  ],
  scifi: [
    'A startup chime plays when gripped — someone never disabled the factory default.',
    'Micro-etched along the housing: WARRANTY VOID BEYOND LUNAR ORBIT.',
    'The diagnostic LED blinks a code that does not appear in any manual.',
    'Its previous owner’s biometric lock was burned out, crudely.',
    'The casing is scarred by re-entry heat on one side.',
    'It syncs, uninvited, with any display it gets near.'
  ]
};

// Quirk / history hooks
const QUIRKS = {
  universal: [
    'The previous owner’s name is scratched out beneath the grip.',
    'It was won in a bet that the seller clearly regrets.',
    'A faded ribbon is tied to it that resists being removed.',
    'It is the last surviving piece of a matched set.',
    'Collectors have offered absurd sums for it — always anonymously.',
    'It was buried with someone, once.',
    'There is a hidden compartment that smells of lavender.',
    'Its twin is owned by someone who wants this one back.',
    'It appears, unmistakably, in a famous painting.',
    'Whoever holds it tends to be asked for directions.',
    'It has been repaired exactly once, masterfully, by unknown hands.',
    'A small dent in it allegedly stopped something fatal.'
  ],
  medieval: [
    'A minor lord has declared it stolen property of his house.',
    'It was carried at the Battle of the Fords — on the losing side.',
    'Guild law forbids its sale within the city walls.',
    'A hedge-witch swears it is owed a debt of blood.',
    'The local smith refuses to touch it, and won’t say why.'
  ],
  fantasy: [
    'It does not appear in mirrors.',
    'Animals go quiet when it enters a room.',
    'A bound spirit inside it is, mercifully, asleep.',
    'It was a gift from the fey, which means it was a trap.',
    'Divination spells aimed at it return only the smell of rain.'
  ],
  modern: [
    'It’s evidence in a case that was never closed.',
    'The manufacturer issued a recall; this one never went back.',
    'It shipped with someone else’s customs paperwork.',
    'An insurance company believes it was destroyed in a fire.',
    'There’s a geocache log hidden inside dating back decades.'
  ],
  scifi: [
    'Its onboard AI fragment only speaks in shipping forecasts.',
    'It is technically still leased — the repossession drones are patient.',
    'The firmware update that bricked every other unit skipped this one.',
    'It predates the Collapse, which makes it priceless or worthless.',
    'A corp bounty exists for its return. No questions asked.'
  ]
};

// ---------- Weapon archetypes ----------
// skills: object skill tags; range: weighted options; core/extra: tag pools (era-gated via eras key on tags when needed)
const WEAPONS = {
  longblade: {
    skills: [['Might', 'Agility'], ['Agility', 'Precision']],
    range: ['Melee'], mass: 3,
    core: [], extras: ['Forceful', 'Violent X', 'Piercing X', 'Shredding X', 'Brutal', 'Flaming X', 'Stunning'],
    names: {
      medieval: ['Arming Sword', 'Longsword', 'Bastard Sword', 'Falchion', 'Claymore', 'Greatsword', 'Warbrand'],
      fantasy: ['Runeblade', 'Moonblade', 'Spellsword', 'Dragonfang Blade', 'Eldritch Saber', 'Greatsword'],
      modern: ['Machete', 'Cavalry Saber', 'Custom Katana', 'Falcata'],
      scifi: ['Vibroblade', 'Plasma Saber', 'Monoedge Longsword', 'Phase Katana', 'Arc Blade']
    }
  },
  polearm: {
    skills: [['Might', 'Precision'], ['Might', 'Fortitude']],
    range: ['Melee'], mass: 4,
    core: [], extras: ['Forceful', 'Violent X', 'Piercing X', 'Covering X', 'Brutal', 'Stunning'],
    names: {
      medieval: ['Spear', 'Halberd', 'Glaive', 'Bill-Hook', 'Poleaxe', 'War Lance', 'Partisan'],
      fantasy: ['Dragonglaive', 'Runic Halberd', 'Stormpike', 'Feywood Glaive', 'Soulspear'],
      modern: ['Boar Spear', 'Tactical Spear', 'Bayonet Lance'],
      scifi: ['Pulse Glaive', 'Shock Lance', 'Grav-Pike', 'Plasma Halberd']
    }
  },
  shortblade: {
    skills: [['Agility', 'Precision'], ['Precision', 'Sense']],
    range: ['Melee'], mass: 1, dieCap: 10,
    core: ['Quick', 'Throwable'], extras: ['Poisoned X', 'Piercing X', 'Violent X', 'Stunning'],
    names: {
      medieval: ['Dagger', 'Dirk', 'Seax', 'Stiletto', 'Rondel Dagger', 'Hunting Knife'],
      fantasy: ['Fangknife', 'Shadowblade', 'Hexdagger', 'Sacrificial Kris', 'Glassthorn Dagger'],
      modern: ['Combat Knife', 'Switchblade', 'Bowie Knife', 'Karambit', 'Boot Knife'],
      scifi: ['Monoknife', 'Plasma Dagger', 'Nanoblade', 'Vibro-Shiv']
    }
  },
  bludgeon: {
    skills: [['Might', 'Fortitude'], ['Might', 'Resolve']],
    range: ['Melee'], mass: 3,
    core: [], extras: ['Forceful', 'Stunning', 'Violent X', 'Shredding X', 'Brutal'],
    names: {
      medieval: ['Mace', 'Warhammer', 'Morningstar', 'Flail', 'Cudgel', 'Maul'],
      fantasy: ['Runic Maul', 'Stonebreaker', 'Sunhammer', 'Trollbone Club'],
      modern: ['Baseball Bat', 'Crowbar', 'Sledgehammer', 'Baton', 'Pipe Wrench'],
      scifi: ['Grav-Maul', 'Shock Baton', 'Kinetic Hammer', 'Riot Mace']
    }
  },
  shield: {
    skills: [['Fortitude', 'Might']],
    range: ['Melee'], mass: 4, potCap: 3,
    core: [], extras: ['Forceful', 'Stunning'],
    multipurpose: 'wearable', mpTags: ['Shielding X', 'Protective', 'Toughness X'],
    names: {
      medieval: ['Round Shield', 'Kite Shield', 'Tower Shield', 'Buckler', 'Heater Shield'],
      fantasy: ['Wardshield', 'Dragonscale Shield', 'Runeward Aegis', 'Spellmirror Buckler'],
      modern: ['Riot Shield', 'Ballistic Shield'],
      scifi: ['Energy Buckler', 'Deflector Aegis', 'Hardlight Shield']
    }
  },
  tension: {
    skills: [['Precision', 'Sense'], ['Precision', 'Might']],
    range: ['Near-range', 'Long-range'], mass: 2, mat: 'wood',
    core: ['Loading'], extras: ['Piercing X', 'Suppressed', 'Poisoned X', 'Violent X', 'Consistent X'],
    names: {
      medieval: ['Shortbow', 'Longbow', 'Hunting Bow', 'Crossbow', 'Arbalest', 'War Bow'],
      fantasy: ['Heartwood Bow', 'Whisperwind Longbow', 'Hexbolt Crossbow', 'Sylvan Recurve'],
      modern: ['Compound Bow', 'Crossbow Pistol', 'Recurve Bow', 'Speargun'],
      scifi: ['Coilbow', 'Mag-Tension Launcher', 'Recursive Bow']
    }
  },
  hurled: {
    skills: [['Might', 'Precision'], ['Agility', 'Precision']],
    range: ['Near-range'], mass: 1, dieCap: 10,
    core: ['Quick'], extras: ['Piercing X', 'Forceful', 'Poisoned X', 'Stunning'],
    names: {
      medieval: ['Throwing Axe', 'Javelin', 'Francisca', 'Brace of Throwing Knives'],
      fantasy: ['Stormjavelin', 'Returning Axe', 'Glassfeather Darts'],
      modern: ['Throwing Knives', 'Tomahawk'],
      scifi: ['Plasma Javelin', 'Smart-Dart Set', 'Grav-Disc']
    }
  },
  sling: {
    skills: [['Precision', 'Agility']],
    range: ['Near-range', 'Long-range'], mass: 1, dieCap: 8, mat: 'wood',
    core: ['Loading'], extras: ['Stunning', 'Forceful', 'Consistent X'],
    names: {
      medieval: ['Shepherd’s Sling', 'Staff Sling', 'Stone Sling'],
      fantasy: ['Spellslinger’s Sling', 'Skystone Sling'],
      modern: ['Wrist-Brace Slingshot', 'Hunting Slingshot'],
      scifi: ['Mag-Sling', 'Kinetic Slinger']
    }
  },
  handgun: {
    skills: [['Precision', 'Agility'], ['Precision', 'Sense']],
    range: ['Near-range'], mass: 1, dieCap: 10,
    core: ['Ammo', 'Quick'], extras: ['Suppressed', 'Cycling', 'Efficient', 'Piercing X', 'Violent X', 'Consistent X'],
    names: {
      modern: ['Revolver', 'Service Pistol', 'Compact Pistol', 'Hand Cannon', 'Derringer', 'Target Pistol'],
      scifi: ['Pulse Pistol', 'Needler', 'Plasma Sidearm', 'Gauss Pistol', 'Disruptor Pistol']
    }
  },
  shotgun: {
    skills: [['Precision', 'Might'], ['Precision', 'Fortitude']],
    range: ['Near-range'], mass: 3,
    core: ['Ammo'], extras: ['Brutal', 'Forceful', 'Shredding X', 'Covering X', 'Violent X'],
    names: {
      modern: ['Pump Shotgun', 'Double-Barrel Shotgun', 'Sawed-Off Shotgun', 'Combat Shotgun', 'Over-Under Shotgun'],
      scifi: ['Scatter Cannon', 'Flechette Gun', 'Ion Scattergun', 'Breach Gun']
    }
  },
  rifle: {
    skills: [['Precision', 'Sense']],
    range: ['Long-range', 'Far-range'], mass: 3,
    core: ['Ammo'], extras: ['Piercing X', 'Suppressed', 'Cycling', 'Covering X', 'Violent X', 'Consistent X', 'Efficient'],
    names: {
      modern: ['Bolt-Action Rifle', 'Hunting Rifle', 'Carbine', 'Battle Rifle', 'Marksman Rifle', 'Lever-Action Rifle'],
      scifi: ['Pulse Rifle', 'Gauss Rifle', 'Railgun Carbine', 'Phase Carbine', 'Beam Rifle']
    }
  },
  emitter: {
    skills: [['Intellect', 'Resolve'], ['Intellect', 'Presence']],
    range: ['Near-range', 'Long-range'], mass: 2,
    core: ['Energized'], extras: ['Flaming X', 'Stunning', 'Volatile', 'Violent X', 'Forceful', 'Covering X'],
    chargingBase: true,
    names: {
      fantasy: ['Ashwood Wand', 'Sorcerer’s Staff', 'Crystal Scepter', 'Stormcaller Rod', 'Witchbone Focus', 'Beamstave'],
      modern: ['Flamethrower', 'Arc Thrower', 'Stun Projector'],
      scifi: ['Arc Projector', 'Beam Emitter', 'Tesla Caster', 'Cryo Projector', 'Microwave Lance']
    }
  },
  grenade: {
    skills: [['Might', 'Precision']],
    range: ['Near-range'], mass: 1, potCap: 3,
    core: ['Throwable', 'Consumable 1'], extras: ['Explosive', 'Flaming X', 'Stunning', 'Forceful', 'Covering X'],
    alwaysExtra: 'Explosive',
    names: {
      fantasy: ['Alchemist’s Fire Flask', 'Thunderstone', 'Hexburst Vial'],
      modern: ['Frag Grenade', 'Pipe Bomb', 'Molotov Cocktail', 'Flashbang'],
      scifi: ['Plasma Grenade', 'Singularity Charge', 'EMP Grenade', 'Cryo Grenade']
    }
  },
  'mass driver': {
    skills: [['Precision', 'Intellect']],
    range: ['Long-range', 'Far-range'], mass: 5,
    core: ['Loading', 'Reload X'], extras: ['Piercing X', 'Forceful', 'Violent X', 'Shredding X'],
    names: {
      scifi: ['Handheld Mass Driver', 'Ferro-Slug Driver', 'Linear Accelerator', 'Tungsten Spike Driver']
    }
  },
  'tethered-impact': {
    skills: [['Agility', 'Might'], ['Agility', 'Precision']],
    range: ['Melee', 'Near-range'], mass: 2,
    core: [], extras: ['Forceful', 'Stunning', 'Shredding X', 'Violent X'],
    names: {
      medieval: ['Whip', 'Meteor Hammer', 'Hooked Chain'],
      fantasy: ['Spiked Soulchain', 'Meteor Flail', 'Thornlash'],
      modern: ['Bullwhip', 'Weighted Chain'],
      scifi: ['Grav-Tether', 'Monowire Whip', 'Shock Lash']
    }
  },
  artillery: {
    skills: [['Intellect', 'Precision']],
    range: ['Far-range'], mass: 9,
    core: ['Loading', 'Reload X'], extras: ['Explosive', 'Piercing X', 'Forceful', 'Covering X', 'Brutal'],
    names: {
      medieval: ['Ballista', 'Mangonel'],
      fantasy: ['Dragonfire Mortar', 'Siege Ballista'],
      modern: ['Mortar', 'Recoilless Rifle', 'Field Gun'],
      scifi: ['Plasma Mortar', 'Particle Cannon', 'Orbital Designator Rig']
    }
  },
  trap: {
    skills: [['Artifice', 'Sense']],
    range: ['Melee'], mass: 2, potCap: 4,
    core: ['Consumable 1'], extras: ['Stunning', 'Piercing X', 'Poisoned X', 'Flaming X', 'Forceful'],
    trapSpecial: true,
    names: {
      medieval: ['Snare Trap', 'Bear Trap', 'Caltrop Bag'],
      fantasy: ['Glyph Snare', 'Hexed Caltrops', 'Binding Circle Kit'],
      modern: ['Tripwire Charge', 'Bear Trap', 'Spike Strip'],
      scifi: ['Laser Snare', 'Stasis Mine', 'Shock Net Deployer']
    }
  },
  natural: {
    skills: [['Might', 'Agility'], ['Agility', 'Fortitude']],
    range: ['Melee'], mass: 1, dieCap: 8,
    core: ['Quick'], extras: ['Stunning', 'Violent X', 'Forceful'],
    names: {
      medieval: ['Knuckle Wraps', 'Cestus'],
      fantasy: ['Beastclaw Gauntlets', 'Ironfang Cestus'],
      modern: ['Brass Knuckles', 'Sap Gloves'],
      scifi: ['Shock Knuckles', 'Kinetic Wraps']
    }
  }
};

// Relative weights of weapon subtypes per era (0/absent = unavailable)
const ERA_WEAPON_WEIGHTS = {
  medieval: { longblade: 3, shortblade: 3, polearm: 3, bludgeon: 3, shield: 2, tension: 3, hurled: 2, sling: 1, 'tethered-impact': 1, trap: 1, natural: 1, artillery: .4 },
  fantasy: { longblade: 3, shortblade: 2.5, polearm: 2.5, bludgeon: 2, shield: 2, tension: 2.5, hurled: 1.5, sling: .7, emitter: 3, grenade: 1, 'tethered-impact': 1, trap: 1, natural: .8, artillery: .4 },
  modern: { handgun: 3, rifle: 3, shotgun: 2, shortblade: 2, bludgeon: 2, tension: 1, hurled: .8, grenade: 1.5, emitter: .6, 'tethered-impact': .5, trap: 1, natural: 1, sling: .4, artillery: .4 },
  scifi: { handgun: 3, rifle: 3, shotgun: 2, emitter: 2.5, 'mass driver': 1.5, grenade: 1.5, longblade: 1.5, shortblade: 1.5, bludgeon: 1, shield: 1, 'tethered-impact': 1, trap: 1, natural: .5, artillery: .4 }
};

// Era-gating for weapon extra tags (anything listed is restricted to those eras)
const TAG_ERA_GATE = {
  Suppressed: ['modern', 'scifi'],
  Cycling: ['modern', 'scifi'],
  Efficient: ['modern', 'scifi'],
  Energized: ['fantasy', 'scifi', 'modern']
};

// ---------- Wearables ----------
// cls: 'armor' (defends), 'gear' (utility, gets Gear tag), 'adorn' (Adornment)
const WEARABLES = {
  head: {
    weight: 3,
    items: {
      medieval: [
        { n: 'Kettle Helm', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Shielding X'] },
        { n: 'Mail Coif', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X'] },
        { n: 'Hunter’s Hood', cls: 'gear', skills: ['Sense'], extras: ['Resistant X'] }
      ],
      fantasy: [
        { n: 'Wyrmscale Helm', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Resistant X'] },
        { n: 'Circlet of Clarity', cls: 'adorn', skills: ['Intellect'], extras: ['Resistant X'] },
        { n: 'Hood of the Veil', cls: 'gear', skills: ['Agility'], extras: ['Resistant X'] }
      ],
      modern: [
        { n: 'Ballistic Helmet', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Protective'] },
        { n: 'Riot Helmet', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Resistant X'] },
        { n: 'Night-Vision Headset', cls: 'gear', skills: ['Sense'], extras: [] }
      ],
      scifi: [
        { n: 'Vacuum Helm', cls: 'armor', skills: ['Fortitude'], extras: ['Resistant X', 'Toughness X'] },
        { n: 'HUD Visor', cls: 'gear', skills: ['Sense'], extras: [] },
        { n: 'Neural Halo', cls: 'adorn', skills: ['Intellect'], extras: ['Resistant X'] }
      ]
    }
  },
  neck: {
    weight: 1.5,
    items: {
      medieval: [
        { n: 'Steel Gorget', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X'] },
        { n: 'Pilgrim’s Amulet', cls: 'adorn', skills: ['Resolve'], extras: ['Resistant X'] }
      ],
      fantasy: [
        { n: 'Warding Talisman', cls: 'adorn', skills: ['Resolve'], extras: ['Resistant X', 'Protective'] },
        { n: 'Phylactery Pendant', cls: 'adorn', skills: ['Presence'], extras: ['Resistant X'] }
      ],
      modern: [
        { n: 'Tactical Neck Guard', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X'] },
        { n: 'Lucky Dog Tags', cls: 'adorn', skills: ['Resolve'], extras: [] }
      ],
      scifi: [
        { n: 'Rebreather Collar', cls: 'gear', skills: ['Fortitude'], extras: ['Resistant X'] },
        { n: 'Translator Torc', cls: 'adorn', skills: ['Charm'], extras: [] }
      ]
    }
  },
  shoulder: {
    weight: 1,
    items: {
      medieval: [{ n: 'Spaulders', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X'] }],
      fantasy: [{ n: 'Stormmantle', cls: 'gear', skills: ['Presence'], extras: ['Resistant X'] }],
      modern: [{ n: 'Padded Harness', cls: 'gear', skills: ['Fortitude'], extras: ['Supporting X'] }],
      scifi: [{ n: 'Servo Pauldron', cls: 'armor', skills: ['Might'], extras: ['Toughness X', 'Supporting X'] }]
    }
  },
  back: {
    weight: 2,
    items: {
      medieval: [
        { n: 'Traveler’s Cloak', cls: 'gear', skills: ['Fortitude'], extras: ['Resistant X'] },
        { n: 'Expedition Pack', cls: 'gear', skills: ['Fortitude'], extras: ['Supporting X'] }
      ],
      fantasy: [
        { n: 'Cloak of Whispers', cls: 'gear', skills: ['Agility'], extras: ['Resistant X'] },
        { n: 'Bottomless Satchel', cls: 'gear', skills: ['Artifice'], extras: ['Supporting X'] }
      ],
      modern: [
        { n: 'Rucksack', cls: 'gear', skills: ['Fortitude'], extras: ['Supporting X'] },
        { n: 'Armored Trench Coat', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X'] }
      ],
      scifi: [
        { n: 'Grav Chute', cls: 'gear', skills: ['Agility'], extras: [] },
        { n: 'Exo-Spine Frame', cls: 'gear', skills: ['Might'], extras: ['Supporting X', 'Supporting X'] }
      ]
    }
  },
  chest: {
    weight: 3.5,
    items: {
      medieval: [
        { n: 'Gambeson', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X'] },
        { n: 'Chainmail Hauberk', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Shielding X'] },
        { n: 'Brigandine', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Shielding X'] },
        { n: 'Steel Cuirass', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Protective'] }
      ],
      fantasy: [
        { n: 'Dragonscale Cuirass', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Resistant X'] },
        { n: 'Mithril Shirt', cls: 'armor', skills: ['Agility'], extras: ['Shielding X', 'Toughness X'] },
        { n: 'Spellwoven Robes', cls: 'gear', skills: ['Intellect'], extras: ['Resistant X'] }
      ],
      modern: [
        { n: 'Kevlar Vest', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X'] },
        { n: 'Plate Carrier', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X', 'Protective'] },
        { n: 'Riding Leathers', cls: 'armor', skills: ['Agility'], extras: ['Toughness X'] }
      ],
      scifi: [
        { n: 'Nanoweave Suit', cls: 'armor', skills: ['Agility'], extras: ['Shielding X', 'Toughness X'] },
        { n: 'Powered Cuirass', cls: 'armor', skills: ['Might'], extras: ['Toughness X', 'Supporting X'] },
        { n: 'Void Suit', cls: 'armor', skills: ['Fortitude'], extras: ['Resistant X', 'Toughness X'] }
      ]
    }
  },
  belt: {
    weight: 1.5,
    items: {
      medieval: [{ n: 'Quartermaster’s Belt', cls: 'gear', skills: ['Artifice'], extras: ['Supporting X'] }],
      fantasy: [{ n: 'Component Sash', cls: 'gear', skills: ['Intellect'], extras: ['Supporting X'] }],
      modern: [{ n: 'Utility Belt', cls: 'gear', skills: ['Artifice'], extras: ['Supporting X'] }, { n: 'Quick-Draw Holster Rig', cls: 'gear', skills: ['Agility'], extras: [] }],
      scifi: [{ n: 'Mag-Clamp Belt', cls: 'gear', skills: ['Artifice'], extras: ['Supporting X'] }]
    }
  },
  arms: {
    weight: 2,
    items: {
      medieval: [
        { n: 'Steel Bracers', cls: 'armor', skills: ['Might'], extras: ['Shielding X', 'Toughness X'] },
        { n: 'Plate Gauntlets', cls: 'armor', skills: ['Might'], extras: ['Toughness X'] }
      ],
      fantasy: [
        { n: 'Runed Bracers', cls: 'armor', skills: ['Resolve'], extras: ['Shielding X', 'Resistant X'] },
        { n: 'Spellbinder’s Gauntlets', cls: 'gear', skills: ['Intellect'], extras: [] }
      ],
      modern: [
        { n: 'Forearm Guards', cls: 'armor', skills: ['Fortitude'], extras: ['Shielding X'] },
        { n: 'Work Gloves', cls: 'gear', skills: ['Artifice'], extras: [] }
      ],
      scifi: [
        { n: 'Servo Gauntlets', cls: 'gear', skills: ['Might'], extras: ['Supporting X'] },
        { n: 'Haptic Interface Gloves', cls: 'gear', skills: ['Precision'], extras: [] }
      ]
    }
  },
  legs: {
    weight: 1.5,
    items: {
      medieval: [{ n: 'Greaves', cls: 'armor', skills: ['Fortitude'], extras: ['Toughness X'] }],
      fantasy: [{ n: 'Greaves of the Stag', cls: 'armor', skills: ['Agility'], extras: ['Shielding X'] }],
      modern: [{ n: 'Knee-Pad Rig', cls: 'armor', skills: ['Agility'], extras: ['Toughness X'] }],
      scifi: [{ n: 'Servo Greaves', cls: 'armor', skills: ['Might'], extras: ['Toughness X', 'Supporting X'] }]
    }
  },
  feet: {
    weight: 1.5,
    items: {
      medieval: [{ n: 'Riding Boots', cls: 'gear', skills: ['Agility'], extras: [] }, { n: 'Soft-Sole Boots', cls: 'gear', skills: ['Agility'], extras: [] }],
      fantasy: [{ n: 'Boots of the Quiet Step', cls: 'gear', skills: ['Agility'], extras: [] }],
      modern: [{ n: 'Combat Boots', cls: 'gear', skills: ['Fortitude'], extras: ['Resistant X'] }],
      scifi: [{ n: 'Mag-Boots', cls: 'gear', skills: ['Fortitude'], extras: [] }, { n: 'Grav-Sole Sprinters', cls: 'gear', skills: ['Agility'], extras: [] }]
    }
  },
  trinket: {
    weight: 2.5,
    items: {
      medieval: [
        { n: 'Lucky Coin', cls: 'adorn', skills: ['Resolve'], extras: [] },
        { n: 'Prayer Beads', cls: 'adorn', skills: ['Resolve'], extras: ['Resistant X'] },
        { n: 'Signet Ring', cls: 'adorn', skills: ['Presence'], extras: [] }
      ],
      fantasy: [
        { n: 'Soulstone Ring', cls: 'adorn', skills: ['Resolve'], extras: ['Resistant X'] },
        { n: 'Charm of Embers', cls: 'adorn', skills: ['Presence'], extras: ['Resistant X'] },
        { n: 'Pocket Grimoire Locket', cls: 'adorn', skills: ['Intellect'], extras: [] }
      ],
      modern: [
        { n: 'Engraved Lighter', cls: 'adorn', skills: ['Charm'], extras: [] },
        { n: 'Pocket Watch', cls: 'adorn', skills: ['Sense'], extras: [] },
        { n: 'Challenge Coin', cls: 'adorn', skills: ['Presence'], extras: [] }
      ],
      scifi: [
        { n: 'Holo-Locket', cls: 'adorn', skills: ['Charm'], extras: [] },
        { n: 'Lucky Casino Chip', cls: 'adorn', skills: ['Resolve'], extras: [] },
        { n: 'Subdermal Ward Chip', cls: 'adorn', skills: ['Resolve'], extras: ['Resistant X'], implanted: true }
      ]
    }
  }
};

// ---------- Tools ----------
// Each tool aids a Talent (Aid|X steps that talent's die up). skills = object skill tags.
const TOOLS = [
  { talent: 'Lockpicking', skills: ['Precision', 'Agility'], mass: 1, names: { medieval: 'Tumbler Picks', fantasy: 'Whispering Picks', modern: 'Lockpick Set', scifi: 'Electronic Bypass Kit' } },
  { talent: 'Medicine', skills: ['Intellect', 'Precision'], mass: 2, consumable: true, names: { medieval: 'Chirurgeon’s Satchel', fantasy: 'Healer’s Poultice Kit', modern: 'Trauma Kit', scifi: 'Auto-Medic Module' } },
  { talent: 'Hacking', skills: ['Intellect', 'Artifice'], mass: 2, eras: ['modern', 'scifi'], names: { modern: 'Penetration Laptop Rig', scifi: 'Intrusion Deck' } },
  { talent: 'Climbing', skills: ['Might', 'Agility'], mass: 2, names: { medieval: 'Grappling Iron & Rope', fantasy: 'Spider-Silk Line', modern: 'Climbing Kit', scifi: 'Grav-Anchor Line' } },
  { talent: 'Tracking', skills: ['Sense', 'Intellect'], mass: 1, names: { medieval: 'Huntsman’s Kit', fantasy: 'Seeker’s Compass', modern: 'Tracker’s Field Kit', scifi: 'Bio-Sign Scanner' } },
  { talent: 'Alchemy', skills: ['Intellect', 'Artifice'], mass: 3, eras: ['medieval', 'fantasy'], names: { medieval: 'Alembic Set', fantasy: 'Alchemist’s Field Lab' } },
  { talent: 'Chemistry', skills: ['Intellect', 'Precision'], mass: 3, eras: ['modern', 'scifi'], names: { modern: 'Field Chemistry Set', scifi: 'Molecular Synthesizer' } },
  { talent: 'Smithing', skills: ['Might', 'Artifice'], mass: 4, names: { medieval: 'Portable Forge Kit', fantasy: 'Runesmith’s Forge Kit', modern: 'Welding Rig', scifi: 'Nano-Forge' } },
  { talent: 'Cooking', skills: ['Artifice', 'Sense'], mass: 2, names: { medieval: 'Cook’s Kit', fantasy: 'Spice Satchel', modern: 'Camp Stove Kit', scifi: 'Ration Printer' } },
  { talent: 'Navigation', skills: ['Intellect', 'Sense'], mass: 1, names: { medieval: 'Sextant & Charts', fantasy: 'Wayfinder Stone', modern: 'GPS Unit', scifi: 'Astrogation Module' } },
  { talent: 'Cartography', skills: ['Precision', 'Intellect'], mass: 1, names: { medieval: 'Mapmaker’s Roll', fantasy: 'Living Map Case', modern: 'Survey Kit', scifi: 'Topo-Drone Mapper' } },
  { talent: 'Fishing', skills: ['Precision', 'Sense'], mass: 2, names: { medieval: 'Net & Tackle', fantasy: 'Siren-Lure Tackle', modern: 'Rod & Tackle Box', scifi: 'Sonic Lure Rig' } },
  { talent: 'Bushcraft', skills: ['Sense', 'Fortitude'], mass: 3, names: { medieval: 'Woodsman’s Kit', fantasy: 'Wildervane Kit', modern: 'Survival Kit', scifi: 'Enviro-Survival Pod' } },
  { talent: 'Animal Handling', skills: ['Charm', 'Sense'], mass: 1, names: { medieval: 'Falconer’s Gear', fantasy: 'Beastspeaker’s Chimes', modern: 'Handler’s Kit', scifi: 'Pheromone Emitter Kit' } },
  { talent: 'Appraisal', skills: ['Sense', 'Intellect'], mass: 1, names: { medieval: 'Jeweler’s Loupe & Scales', fantasy: 'Truth-Lens', modern: 'Appraiser’s Loupe Kit', scifi: 'Spectro-Assay Wand' } },
  { talent: 'Disguise', skills: ['Charm', 'Artifice'], mass: 2, names: { medieval: 'Mummer’s Case', fantasy: 'Mask of Many Faces Kit', modern: 'Disguise Kit', scifi: 'Holo-Skin Projector' } },
  { talent: 'Sleight of Hand', skills: ['Agility', 'Charm'], mass: 1, names: { medieval: 'Trickster’s Rig', fantasy: 'Phantom Fingers Rig', modern: 'Magician’s Rig', scifi: 'Micro-Servo Rig' } },
  { talent: 'Stealth', skills: ['Agility', 'Sense'], mass: 1, names: { medieval: 'Blackout Kit', fantasy: 'Gloamdust Pouch', modern: 'Infiltration Kit', scifi: 'Sound-Damper Field Kit' } },
  { talent: 'Electronics', skills: ['Artifice', 'Precision'], mass: 2, eras: ['modern', 'scifi'], names: { modern: 'Electronics Toolkit', scifi: 'Circuit Surgeon’s Kit' } },
  { talent: 'Robotics', skills: ['Artifice', 'Intellect'], mass: 3, eras: ['scifi'], names: { scifi: 'Drone Maintenance Suite' } },
  { talent: 'Vehicle Repair', skills: ['Artifice', 'Might'], mass: 3, eras: ['modern', 'scifi'], names: { modern: 'Mechanic’s Toolbox', scifi: 'Shipwright’s Multi-Kit' } },
  { talent: 'Explosives', skills: ['Precision', 'Intellect'], mass: 2, eras: ['modern', 'scifi'], names: { modern: 'Demolitions Kit', scifi: 'Breaching Charge Kit' } },
  { talent: 'Mining', skills: ['Might', 'Fortitude'], mass: 4, names: { medieval: 'Pick & Lantern Kit', fantasy: 'Deepdelver’s Kit', modern: 'Prospector’s Kit', scifi: 'Plasma Bore Kit' } },
  { talent: 'Construction', skills: ['Might', 'Artifice'], mass: 4, names: { medieval: 'Carpenter’s Chest', fantasy: 'Mason’s Singing Tools', modern: 'Contractor’s Kit', scifi: 'Fab-Crete Extruder' } },
  { talent: 'Tailoring', skills: ['Precision', 'Artifice'], mass: 1, names: { medieval: 'Seamster’s Roll', fantasy: 'Glamour-Thread Set', modern: 'Sewing Kit', scifi: 'Fiber-Loom Pen' } },
  { talent: 'Woodworking', skills: ['Precision', 'Might'], mass: 3, names: { medieval: 'Joiner’s Tools', fantasy: 'Heartwood Carving Set', modern: 'Woodshop Roll', scifi: 'Molecular Lathe' } },
  { talent: 'Sailing', skills: ['Might', 'Sense'], mass: 2, names: { medieval: 'Rigging Kit', fantasy: 'Windcaller’s Rigging', modern: 'Sailor’s Kit', scifi: 'Solar-Sail Tuner' } },
  { talent: 'Scouting', skills: ['Sense', 'Precision'], mass: 1, names: { medieval: 'Spyglass', fantasy: 'Farseer’s Orb', modern: 'Binoculars', scifi: 'Recon Optics Suite' } },
  { talent: 'Riding', skills: ['Agility', 'Charm'], mass: 3, names: { medieval: 'Tack & Saddle Kit', fantasy: 'Skysteed Tack', modern: 'Riding Tack', scifi: 'Mount Interface Rig' } },
  { talent: 'Music', skills: ['Charm', 'Presence'], mass: 2, names: { medieval: 'Worn Lute', fantasy: 'Lyre of Echoes', modern: 'Road-Worn Guitar', scifi: 'Synthwave Deck' } },
  { talent: 'Arcana', skills: ['Intellect', 'Resolve'], mass: 2, eras: ['fantasy'], names: { fantasy: 'Traveling Grimoire' } },
  { talent: 'Computer Science', skills: ['Intellect', 'Artifice'], mass: 2, eras: ['modern', 'scifi'], names: { modern: 'Dev Workstation Case', scifi: 'Quantum Compiler Slate' } },
  { talent: 'Interrogation', skills: ['Presence', 'Sense'], mass: 1, names: { medieval: 'Inquisitor’s Ledger', fantasy: 'Truthseeker’s Candle', modern: 'Interview Field Kit', scifi: 'Stress-Read Monocle' } },
  { talent: 'Deception', skills: ['Charm', 'Intellect'], mass: 1, names: { medieval: 'Forger’s Seal Kit', fantasy: 'Liar’s Quill', modern: 'Forged Papers Portfolio', scifi: 'Spoofed Ident Chits' } }
];

// ---------- Legendary "Special" abilities ----------
const SPECIALS = {
  weapon: [
    'Once per combat, when you roll a complication on an attack with this weapon, you may negate that complication.',
    'When you reduce a creature to 0 health with this weapon, gain a surge.',
    'Once per session, declare a perfect strike: treat every die in your attack pool as if it rolled its maximum.',
    'The first attack you make with this weapon each combat counts one additional die toward its total.',
    'While you hold this weapon, step up your Skill dice on contests to intimidate.',
    'Once per combat, after seeing your attack roll, you may reroll the weapon’s object dice and keep the better result.',
    'This weapon cannot gain the (Damaged) tag while you are above half health.',
    'When an enemy in your zone attacks an ally, you may make one free attack against them per round.',
    'Complications on attacks with this weapon may never harm its wielder or their allies.',
    'On a successful attack, you may choose to push yourself one zone instead of the target.'
  ],
  wearable: [
    'The first time each combat you would gain a wound, roll 1d6; on a 5 or 6, you do not.',
    'Once per session, ignore the Strain penalty on a single contest roll.',
    'Once per combat, when an ally in your zone takes damage, you may take that damage instead.',
    'While equipped, you always act first among tied initiative totals.',
    'Once per session, you may recover as if you had a full night’s rest during a short pause.',
    'While equipped, treat your encumbrance as 5 lower for all purposes.',
    'When you spend a surge while wearing this, roll 1d6; on a 6 the surge is not expended.',
    'Once per combat, when your defend pool fails, add this wearable’s die rolled at maximum to your total.'
  ],
  tool: [
    'When this tool aids a contest, complications cannot destroy or damage it.',
    'Once per session, automatically succeed a non-combat contest in which this tool’s talent applies.',
    'When you use this tool during a recover, one ally also reduces their Strain by 1.',
    'This tool counts as any mundane kit of its type from any era — it always has the right part.',
    'Once per session, this tool may aid a contest even when its talent is not in the dice pool.',
    'When you roll a 1 on this tool’s die, you may reroll it once per contest.'
  ]
};

// Trap deployment text (traps are placed, then trigger)
const TRAP_SPECIAL = 'Deployed as a heavy move. The trap attacks the first valid creature that enters its space, using the dice and tags above.';

// ---------- Era + type display metadata ----------
const ERAS = {
  medieval: { label: 'Medieval', icon: '⚔', blurb: 'Steel, sweat, and siegecraft.' },
  fantasy: { label: 'Fantasy', icon: '✨', blurb: 'Runes, relics, and wild magic.' },
  modern: { label: 'Modern', icon: '⛭', blurb: 'Polymer, gunpowder, and grit.' },
  scifi: { label: 'Sci-Fi', icon: '☄', blurb: 'Plasteel, plasma, and the void.' }
};

const TYPES = {
  weapon: { label: 'Weapon', icon: '🗡' },
  tool: { label: 'Tool', icon: '🪛' },
  wearable: { label: 'Wearable', icon: '🛡' }
};
