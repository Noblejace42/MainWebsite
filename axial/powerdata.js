// Power text and emphasis from sections 4.3 and 8. A string is a plain paragraph or run.
window.AXIAL_POWER_LIBRARY = [
  {
    name: "Cheap Shot",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":[{"text":"Attack","italic":true}," a creature, stepping up 1 die of your choice. If you succeed, choose 2 of the following:"]},
      {"kind":"ul","marker":"-","runs":["Deal an additional 2d6 damage to the target"]},
      {"kind":"ul","marker":"-","runs":["Gain a surge"]},
      {"kind":"ul","marker":"-","runs":["Move to an adjacent zone"]},
      {"kind":"ul","marker":"-","runs":["(Same zone only) Pilfer an item not being worn or held in the hands of the opponent"]}
    ]
  },
  {
    name: "Port in the Storm",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "Whenever you return to a place you have been before, and you are well regarded, choose 2 of the following:",
      {"kind":"ul","marker":"-","runs":["You learn how it has changed since you were last here."]},
      {"kind":"ul","marker":"-","runs":["You are able to make contact with a useful NPC."]},
      {"kind":"ul","marker":"-","runs":["You discover a local rumor."]},
      {"kind":"ul","marker":"-","runs":["You are able to get an audience with a local ruler."]}
    ]
  },
  {
    name: "Called Shot",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["When you succeed an ",{"text":"attack","italic":true}," with a weapon that has the near-range, long-range, or far-range tags, you may choose 2 of the following:"]},
      {"kind":"ul","marker":"-","runs":["You instantly kill the creature if it has less than 10 health after you deal damage."]},
      {"kind":"ul","marker":"-","runs":["You may knock a weapon or object out of the target's hand."]},
      {"kind":"ul","marker":"-","runs":["The target becomes stunned until the end of its next turn."]},
      {"kind":"ul","marker":"-","runs":["You regain usage of this ability and increase your strain by one."]}
    ]
  },
  {
    name: "Speakeasy",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "When you speak frankly with someone, you can ask them a question from the list below. They must answer it truthfully, then they may ask you a question from the list (which you must answer truthfully).",
      {"kind":"ul","marker":"-","runs":["Whom do you serve?"]},
      {"kind":"ul","marker":"-","runs":["What do you wish I would do?"]},
      {"kind":"ul","marker":"-","runs":["How can I get you to _____?"]},
      {"kind":"ul","marker":"-","runs":["What are you really feeling right now?"]},
      {"kind":"ul","marker":"-","runs":["What do you most desire?"]}
    ]
  },
  {
    name: "Surging Support",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["You may use your surges on other players instead of yourself. Whenever you ",{"text":"recover","italic":true},", gain a surge. You can have 10 surges at a time instead of just 5."]}
    ]
  },
  {
    name: "Focused Training",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "When you spend a period of more than a week resting or training, you may decrease up to 2 Talents once. Increase a new Talent by 2 and gain a surge."
    ]
  },
  {
    name: "Push beyond limit",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Free",
    body: [
      {"kind":"p","runs":["You may step up two dice when you ",{"text":"contest. ","italic":true},"After the ",{"text":"contest,","italic":true}," increase your strain by one."]}
    ]
  },
  {
    name: "Second Wind",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":[{"text":"Contest Fortitude|Resolve ","italic":true},"and gain health equal to the result."]}
    ]
  },
  {
    name: "Under Pressure",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["If you would increase your Strain, you may decrease it instead. You may always add your Strain to your ",{"text":"resist peril","italic":true}," attempts total instead of subtracting it."]}
    ]
  },
  {
    name: "Seeing Red",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["A","dd your Strain to your ",{"text":"attack","italic":true}," total. Do not subtract strain from your ",{"text":"attack","italic":true}," total."]}
    ]
  },
  {
    name: "Blood for the Blood God",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "When you kill an enemy with a (Melee), (Brutal), or (Violent) weapon you may reduce your Strain by 1."
    ]
  },
  {
    name: "Jack Of All Trades",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "Whenever you gain a new Talent (level 0 to level 1) you may start it at 1d6 instead of 1d4. When you first gain this ability, learn a new Talent."
    ]
  },
  {
    name: "Experienced Explorer",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "When you gain this ability, choose up to 4 of the below terrains that you do not already have a [terrain] expert Talent for. Gain a Talent called [terrain] expert for each. Your level in this talent is a d8 (level 3).",
      {"kind":"ul","marker":"-","runs":["Mountain"]},
      {"kind":"ul","marker":"-","runs":["Desert"]},
      {"kind":"ul","marker":"-","runs":["Tundra"]},
      {"kind":"ul","marker":"-","runs":["Wasteland"]},
      {"kind":"ul","marker":"-","runs":["Jungle"]},
      {"kind":"ul","marker":"-","runs":["Plains"]},
      {"kind":"ul","marker":"-","runs":["Forest"]},
      {"kind":"ul","marker":"-","runs":["Urban"]},
      {"kind":"ul","marker":"-","runs":["Caves"]},
      {"kind":"ul","marker":"-","runs":["Void"]},
      {"kind":"ul","marker":"-","runs":["Nebula"]},
      {"kind":"ul","marker":"-","runs":["Ocean"]},
      {"kind":"ul","marker":"-","runs":["Arcane"]}
    ]
  },
  {
    name: "Herald of Law",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["Declare that a creature is breaking the law, step up your Presence and Charm and ",{"text":"contest Presence|Charm","italic":true},". On a success, the GM will choose one of the following:"]},
      {"kind":"ul","marker":"-","runs":["The creature will flee you to avoid attention."]},
      {"kind":"ul","marker":"-","runs":["The creature will become hostile towards you, step up 2 dice next time you ",{"text":"attack","italic":true}," that creature."]},
      {"kind":"ul","marker":"-","runs":["The creature will beg and plead, step up 2 dice when you next ",{"text":"negotiate ","italic":true},"with that creature."]}
    ]
  },
  {
    name: "Windstance",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["When you are using no wearables (unless they have the (Gear) tag), you may step up all your dice when you ",{"text":"defend.","italic":true}]}
    ]
  },
  {
    name: "Unbreakable Mind",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["You may add your Resolve die to your Defense pool and any ",{"text":"resist peril","italic":true}," attempts you make in addition to the other two Skills you are using."]}
    ]
  },
  {
    name: "Sheer Spite",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["After you ",{"text":"contest","italic":true}," but before knowing the results, roll your Resolve die and add it to the total of the roll."]}
    ]
  },
  {
    name: "Bulwark",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["Declare a creature in the same zone as you. Until the end of the encounter, they may add your ",{"text":"defend","italic":true}," dice to their ",{"text":"defend","italic":true}," dice pool ","as long as they are in the same zone as you. When they take damage, you can choose to take half of that damage for them, this damage cannot be reduced."]}
    ]
  },
  {
    name: "Melee Master",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "Whenever you use (Melee) weapon, you may increase its potency by one. You cannot drop or be disarmed of your (Melee) weapons against your will so long as you are conscious."
    ]
  },
  {
    name: "Dark Confidant",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      {"kind":"p","runs":["You may swap a die of the same size in your dice pool and your opposition's dice pool (any competing ",{"text":"contest ","italic":true},"roll or GM roll) after seeing the total of the roll. Gain 1 strain."]}
    ]
  },
  {
    name: "Kingly Wit",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["If you suffer a complication while you ",{"text":"negotiate","italic":true}," with a creature, the GM might give you a bond with that creature instead. Whenever you gain a new bond, gain a surge."]}
    ]
  },
  {
    name: "Iron-Willed",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When your strain is 5 or greater and it would be increased beyond that, you may instead reduce your strain by 1d6. Gain a surge."
    ]
  },
  {
    name: "Frantic Parry",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["If you would take damage",", you may instead lose no health. Increase your Strain by 1d4."]}
    ]
  },
  {
    name: "Dumb Luck",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["When you"," ",{"text":"resist peril ","italic":true},"and succeed, ","gain a surge. On a failure, increase your strain by one."]}
    ]
  },
  {
    name: "Glancing Blow",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "You may treat all wearables with (Toughness X) as if it had (Protective) as well."
    ]
  },
  {
    name: "Master Quartermaster",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["Whenever you ",{"text":"contest","italic":true}," to help set up camp, manage logistics, or cook, you may step up 2 dice. You cannot incur complications when doing these tasks, even on a rolled one."]}
    ]
  },
  {
    name: "Flames Of My Desire",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Free",
    body: [
      "Choose one of the following desires:",
      {"kind":"ul","marker":"-","runs":["Pure destruction"]},
      {"kind":"ul","marker":"-","runs":["Power over others"]},
      {"kind":"ul","marker":"-","runs":["Conquest"]},
      {"kind":"ul","marker":"-","runs":["Riches aplenty"]},
      {"kind":"ul","marker":"-","runs":["Fame and glory"]},
      {"kind":"ul","marker":"-","runs":["Esoteric Knowledge"]},
      {"kind":"p","runs":["Whenever you ",{"text":"contest ","italic":true},"in service"," of your desire, you may step up the largest and smallest dice in your pool. If the smallest die rolls higher than the highest die, the GM may introduce a complication as a result of your heedless pursuit that could have wildly unintended side effects. In the case of evenly sized dice only, then choose which one is “bigger” and “smaller” before rolling."]}
    ]
  },
  {
    name: "Rage Against the Machine",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["You have mastered putting yourself into a state of murderous rage. You may step up all dice when you ",{"text":"contest","italic":true}," until the end of the encounter",". At the end of the encounter, increase your strain by 2."]}
    ]
  },
  {
    name: "Tactical Reload",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "If you take an hour or more to examine your weapon, you may choose a tag it has and remove it. If you remove a tag in this way, the GM will give you two options for tags. You may add one of the options to your weapon. They may or may not be fair replacements."
    ]
  },
  {
    name: "Juggernaut",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["If you are using three or more wearables with either (Stalwart 1dX), (Unruly 1dX), or a 1d12 as its object dice, you may step up all armor dice when you roll ",{"text":"defense","italic":true},"."]}
    ]
  },
  {
    name: "Gatecrasher",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["When you ",{"text":"contest ","italic":true},"to destroy an inanimate obstacle you may step up your Might die. Additionally on a success, choose one of the following:"]},
      {"kind":"ul","marker":"-","runs":["It doesn’t take a very long time"]},
      {"kind":"ul","marker":"-","runs":["It doesn’t introduce any complications"]},
      {"kind":"ul","marker":"-","runs":["It doesn’t make an inordinate amount of noise"]},
      {"kind":"ul","marker":"-","runs":["You can fix the thing without significant effort"]}
    ]
  },
  {
    name: "Strider",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      {"kind":"p","runs":["When you ",{"text":"journey planetside ","italic":true},"or ",{"text":"make camp,","italic":true}," step up all dice in your next dice pool. Rolls in this pool cannot incur complications."]}
    ]
  },
  {
    name: "Black Market Connections",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When you arrive at a settlement, if it has a criminal underground, you may ask the GM one of the following questions and get a truthful if potentially incomplete answer:",
      {"kind":"ul","marker":"-","runs":["Who runs the criminal underworld here?"]},
      {"kind":"ul","marker":"-","runs":["What is the main illegal trade?"]},
      {"kind":"ul","marker":"-","runs":["How dangerous is the criminal underworld?"]},
      {"kind":"ul","marker":"-","runs":["Would I be able to find [object/item] at the black market here?"]}
    ]
  },
  {
    name: "Setup Strike",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":[{"text":"Attack","italic":true}," ","an enemy in the same zone as an ally of yours. Your ally may step up all their dice next time they ",{"text":"attack","italic":true}," that same enemy."]}
    ]
  },
  {
    name: "Sage Knight",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Free",
    body: [
      {"kind":"p","runs":["S","pend an hour or more in quiet meditation after a battle, you may decrease your Strain by 1d4."]}
    ]
  },
  {
    name: "Blot out the Sun",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":[{"text":"Attack ","italic":true},"using a far-range or long-range weapon then you may expend an ammo and ",{"text":"attack ","italic":true},"again."]}
    ]
  },
  {
    name: "Superior Explorer",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "When you gain this ability, choose up to 2 of the below terrains that you do not already have a [terrain] expert Talent for. Gain a Talent called [terrain] expert for each. Your expertise in this talent is a d8.",
      {"kind":"ul","marker":"-","runs":["Mountain"]},
      {"kind":"ul","marker":"-","runs":["Desert"]},
      {"kind":"ul","marker":"-","runs":["Tundra"]},
      {"kind":"ul","marker":"-","runs":["Wasteland"]},
      {"kind":"ul","marker":"-","runs":["Jungle"]},
      {"kind":"ul","marker":"-","runs":["Plains"]},
      {"kind":"ul","marker":"-","runs":["Forest"]},
      {"kind":"ul","marker":"-","runs":["Urban"]},
      {"kind":"ul","marker":"-","runs":["Caves"]},
      {"kind":"ul","marker":"-","runs":["Asteroid field"]},
      {"kind":"ul","marker":"-","runs":["Nebula"]},
      {"kind":"ul","marker":"-","runs":["Ocean"]},
      {"kind":"p","runs":["You and your group only consume half the normal amount of rations when you ",{"text":"journey planetside","italic":true}," through a terrain you have a [terrain] expert Talent for."]}
    ]
  },
  {
    name: "Tricks of the Trade",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["If you ",{"text":"contest","italic":true}," with a dice pool of four or more dice and roll the maximum value on all dice in your pool, increase two Talents used in that pool by 1 level."]}
    ]
  },
  {
    name: "The Arcane and Esoteric",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["When you attempt to ",{"text":"seek information","italic":true}," about something puzzling, mysterious, or unknown to you, step up Intellect die. You cannot incur complications when you ",{"text":"acquire information","italic":true},"."]}
    ]
  },
  {
    name: "Ad Astra Per Aspera",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Free",
    body: [
      "If you would take a wound, you may instead decrease a Talent by 1d4 levels, removing the Talent if it is reduced below level 1 (1d4)."
    ]
  },
  {
    name: "The Great Escape",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      "Ask the GM one of the following questions and receive a useful answer:",
      {"kind":"ul","marker":"-","runs":["Where is the nearest route to safety from here?"]},
      {"kind":"ul","marker":"-","runs":["What lies beyond a nearby door?"]},
      {"kind":"ul","marker":"-","runs":["Am I at risk of the threat increasing if I stay here?"]},
      {"kind":"ul","marker":"-","runs":["What is the most dangerous thing here?"]}
    ]
  },
  {
    name: "Steal the Moon",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["When you take this ability, gain a Talent called “heist planning” at level 3 (1d8). When you ",{"text":"contest ","italic":true},"to plot a heist, step up all the dice in your pool ",{"text":". ","italic":true},"On a success, the GM will give you an additional relevant and useful piece of information relating to the heist you are planning, as well as an honest gauge of the feasibility based on your current knowledge."]}
    ]
  },
  {
    name: "Font of Knowledge",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["A","sk a question or seek knowledge related to a knowledge category Talent you have, you can choose to have the GM give you a true useful or relevant piece of information in addition to any other outcome",". I","ncrease your strain by one."]}
    ]
  },
  {
    name: "Fool me Once",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["If you fail the second ",{"text":"contest","italic":true}," you make",{"text":" ","italic":true},"in a given encounter, you may instead succeed on the ",{"text":"contest","italic":true},"."]}
    ]
  },
  {
    name: "Discombobulate",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["After succeeding an ",{"text":"attack","italic":true},", you may roll your Intellect die and add that to the damage dealt. Increase your strain by one."]}
    ]
  },
  {
    name: "Bullet Time",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["Until your next turn you cannot be the target of an ",{"text":"attack. ","italic":true},"I","f you ",{"text":"resist peril ","italic":true},"during this time,",{"text":" ","italic":true},"step up all your dice."]}
    ]
  },
  {
    name: "Hondo’s Return",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["Whenever you return to an outpost of civilization in triumph, you may step up your Presence and ",{"text":"contest","italic":true},". On a success, you impress anyone who sees your return, step up three dice the next time you ",{"text":"negotiate ","italic":true},"with them."]}
    ]
  },
  {
    name: "Punch God",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":["If you stand defiant in the face of overwhelming odds, existential terror, or a creature far beyond your skills, you may either ",{"text":"attack","italic":true}," or ",{"text":"contest","italic":true}," in opposition to this force (whichever is applicable)",". Step up all your dice twice, you cannot incur complications on this roll."]}
    ]
  },
  {
    name: "Shoot First",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      {"kind":"p","runs":["When combat begins, you may take an extra turn as the first turn of combat. You must ",{"text":"attack","italic":true}," in some way on this turn."]}
    ]
  },
  {
    name: "Ask Questions Later",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "If you begin combat with a creature you were meant to interrogate, question, or speak with, you may ask the GM one of the following questions at the end of combat and receive a useful, if not strictly correct answer:",
      {"kind":"ul","marker":"-","runs":["Why was this creature here?"]},
      {"kind":"ul","marker":"-","runs":["What did this creature want?"]},
      {"kind":"ul","marker":"-","runs":["Why did this creature attack us?"]},
      {"kind":"ul","marker":"-","runs":["Whom does this creature serve?"]}
    ]
  },
  {
    name: "Wide Wanderer",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["If you ",{"text":"contest","italic":true}," as part of a"," travel or journey related move in a place you have never been, step up a die."]}
    ]
  },
  {
    name: "Cheat Death",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "The next time you would die, you do not, instead your maximum health is permanently reduced by 2d6 and you return to full health. This does not heal any wounds or scars."
    ]
  },
  {
    name: "Ace up the Sleeve",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["If you would ",{"text":"contest ","italic":true},"and roll a single Talent die, step up all dice in your dice pool."]}
    ]
  },
  {
    name: "The Ability to Speak",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["Regardless of whether or not you speak the language, you can get a general idea of what any intelligent communication is trying to say. If you ",{"text":"contest","italic":true}," to translate, interpret, or similarly interact with an intelligent creature, step up all your dice."]}
    ]
  },
  {
    name: "Breaker of War",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      {"kind":"p","runs":["When you ",{"text":"negotiate","italic":true}," to defuse a hostile situation, you may choose one of the following outcomes on a success:"]},
      {"kind":"ul","marker":"-","runs":["Confusion is sown among the enemy"]},
      {"kind":"ul","marker":"-","runs":["Discontent stirs among the enemy"]},
      {"kind":"ul","marker":"-","runs":["The enemy stands down, albeit with some unease"]}
    ]
  },
  {
    name: "Journey Before Destination",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      {"kind":"p","runs":["When you ",{"text":"journey ","italic":true},"you may write a new bond with one of your companions. Reduce your strain by one when you ",{"text":"journey ","italic":true},"with a character ","whom you share a bond with."]}
    ]
  },
  {
    name: "Forth Eorlingas!",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      {"kind":"p","runs":["If you begin combat and are outnumbered, you may choose another player, they reduce their strain by one. Choose a different player, they gain a surge. Choose a different player, they double their ",{"text":"contest","italic":true}," total to determine turn order."]}
    ]
  },
  {
    name: "Volta Gloria",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "If you have no surges and you enter into combat, gain a surge."
    ]
  },
  {
    name: "Resist and Bite",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light",
    body: [
      "When you are dealt damage by a (Melee) weapon you may choose to instead take no damage and may deal up to half that damage to a target within your zone."
    ]
  },
  {
    name: "Wall Jumper",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Movement action",
    body: [
      {"kind":"p","runs":["You may move to a non-adjacent zone so long as there is a wall or nearby wall that you could use to climb up or down to it. You do not need to ",{"text":"contest","italic":true}," to get to this new zone."]}
    ]
  },
  {
    name: "Devilish Po",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      "On your next turn you may take three heavy actions instead of one."
    ]
  },
  {
    name: "Toss A Coin",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["When you ",{"text":"contest","italic":true}," to track a monstrous or dangerous non-humanoid creature, step up all your dice."]}
    ]
  },
  {
    name: "Would You Kindly?",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      {"kind":"p","runs":["You can choose to immediately tell if someone is lying to you or is obscuring the truth. If you do, they know you’re on to them. Step up all dice next time you would ",{"text":"contest","italic":true}," in opposition to them."]}
    ]
  },
  {
    name: "I Am Vengeance",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":[{"text":"Attack","italic":true}," a target in the same zone as you. Treat your weapon as if it had (Brutal), and (Violent X+3) for this ",{"text":"attack.","italic":true}]}
    ]
  },
  {
    name: "The Cake Is A Lie",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "Step up a die in your dice pool whenever you attempt to hack, manipulate, or destroy technology that is controlled by artificial intelligence. When you do, reduce your strain by 1."
    ]
  },
  {
    name: "Tough Cookie",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["Having less than three strain causes no negative modifier to apply to your rolls, ","once at"," three strain it functions as normal",". When you ",{"text":"make camp","italic":true},", reduce your strain by 1d4."]}
    ]
  },
  {
    name: "Rip And Tear",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":["A",{"text":"ttack","italic":true}," a target, if you kill them, ",{"text":"attack","italic":true}," another target. Repeat this until you do not kill a target."]}
    ]
  },
  {
    name: "Strafe Lurch",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["Move to a zone that is exactly 3 zones away from you. You may ",{"text":"attack ","italic":true},"an enemy in this zone immediately."]}
    ]
  },
  {
    name: "Flash Out",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":["If you ",{"text":"attack","italic":true}," with an (Explosive) weapon against a weakened, surprised, or incapacitated target, you may step up all dice in your pool."]}
    ]
  },
  {
    name: "Pause Menu",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "All weapons have the (Throwable) tag when you wield them."
    ]
  },
  {
    name: "Girlies Love Cannons",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "All (Brutal) or (Explosive) weapons you use with the (Near-range), (Long-range), or (Far-range) tags have (Shredding X+2)."
    ]
  },
  {
    name: "Return to Sender",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Light action",
    body: [
      "When you successfully defend against an attack from a creature in your zone, you may immediately attack that creature with a (Melee) weapon. Step up one die in your attack pool. Increase your Strain by one after resolving the attack."
    ]
  },
  {
    name: "Nobody Gets Left Behind",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Movement action",
    body: [
      "Choose a willing or unconscious ally in your zone. Move yourself and that ally to an adjacent zone you could normally enter. Until the start of your next turn, step up two dice whenever you defend. Increase your Strain by one. This move cannot carry an ally who is restrained or too large for you to move."
    ]
  },
  {
    name: "Witness Me",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      "Attack a creature, stepping up two dice in your pool. On a success, choose two different allies who can see or hear you. One gains a surge; the other reduces their Strain by one. On a failure, increase your Strain by two."
    ]
  },
  {
    name: "Right Where I Want You",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "Whenever you successfully defend against a creature in your zone, you may step up two dice the next time you attack that creature before the end of your next turn. Defending against the same creature again does not increase this bonus."
    ]
  },
  {
    name: "Hold My Drink",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["Describe an unlikely stunt using something in your surroundings, then ",{"text":"contest","italic":true},{"text":" ","italic":true},"against the"," obstacle involved. Step up two dice in your pool. On a success, choose two of the following:"]},
      {"kind":"ul","marker":"-","runs":["Move to an adjacent zone you could reach through the stunt."]},
      {"kind":"ul","marker":"-","runs":["Bring a willing ally in your zone with you if you move."]},
      {"kind":"ul","marker":"-","runs":["Gain a surge."]},
      {"kind":"ul","marker":"-","runs":["Step up two dice on your next attack this turn."]},
      "On a failure, increase your Strain by one in addition to the normal consequences."
    ]
  },
  {
    name: "Professional Courtesy",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "When you negotiate with someone who practices a trade represented by one of your Talents, you may add that Talent to your pool and step up its die. On a success, they also tell you one useful local detail about their trade. A Talent already in your pool is not added a second time."
    ]
  },
  {
    name: "Dead Men Tell Tales",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      "When you examine a corpse or the remains of a destroyed machine, ask the GM two of the following questions and receive truthful answers based on the evidence that remains:",
      {"kind":"ul","marker":"-","runs":["What caused its death or destruction?"]},
      {"kind":"ul","marker":"-","runs":["What was it doing immediately beforehand?"]},
      {"kind":"ul","marker":"-","runs":["What was taken from it?"]},
      {"kind":"ul","marker":"-","runs":["What trace did the responsible creature or force leave behind?"]},
      "If the evidence cannot answer a question, the GM must tell you so and you may choose another. You cannot use this power on the same remains more than once."
    ]
  },
  {
    name: "Percussive Maintenance",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["Choose an object with the (Damaged) tag that you can touch and ",{"text":"contest Artifice|Might,","italic":true}," stepping up your Might die. On a success, the object functions as though it did not have (Damaged) until the end of the encounter. This does not restore expended ammo, consumed uses, or missing parts."]}
    ]
  },
  {
    name: "Breadcrumbs",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["When you ",{"text":"journey","italic":true}," along a route you have personally traveled before, step up two dice if you are the trailblazer. On a success, the GM also tells you what significant feature of the route has changed since your last visit, if anything."]}
    ]
  },
  {
    name: "A Debt Worth Keeping",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "When you gain this power, choose an existing bond that describes a favor you owe. When you fulfill that favor at a meaningful cost or risk to yourself, gain two surges and reduce your Strain by two. You may then choose another existing bond that describes a favor you owe. Each favor can grant this benefit only once; the normal surge limit still applies."
    ]
  },
  {
    name: "You Owe Me a Death",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When you spare a defeated enemy who knows you could have killed them, offer them a bargain: their life now for yours later. If they accept, write a bond with them. You may call in this debt once to demand safe passage, shelter from pursuit, or their intervention in a danger they could reasonably help you survive. The GM decides how they fulfill the debt."
    ]
  },
  {
    name: "Not My First Funeral",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When you would die and none of your allies can clearly see your body, you may instead disappear from the scene. At the beginning of the next encounter, return with 1 health and explain how you survived. The GM chooses two:",
      {"kind":"ul","runs":["Something valuable you carried is gone."]},
      {"kind":"ul","runs":["Someone dangerous now believes you owe them your life."]},
      {"kind":"ul","runs":["You return somewhere inconvenient."]},
      {"kind":"ul","runs":["Something followed you back."]},
      "This does not heal wounds or scars."
    ]
  },
  {
    name: "Magnum",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":[{"text":"Attack ","italic":true},"with a handgun subtype weapon that has the (Ammo) or (Loading) tag, expend one additional Ammo to fire a devastating shot. Count the four highest dice in your ",{"text":"attack ","italic":true},"pool instead of two, and remove up to two cover dice from the target's ",{"text":"defend","italic":true}," pool. After resolving the attack, increase your Strain by one."]}
    ]
  },
  {
    name: "A Cup of Liber-tea",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["When an authority figure attempts to command, threaten, arrest, or otherwise coerce you or an ally in front of witnesses, openly challenge their authority. ",{"text":"Contest Presence|Resolve","italic":true}," against the creature's authority or an opposed contest."]},
      "On a success, the creature must choose one:",
      {"kind":"ul","runs":["Withdraw its demand for the remainder of the encounter."]},
      {"kind":"ul","runs":["Escalate openly, allowing you and up to two allies who witnessed the exchange to each gain a surge. Any witnesses understand that the authority chose to escalate."]},
      "This does not prevent the creature from attacking, but it may dramatically change how its actions are perceived."
    ]
  },
  {
    name: "Oo-rah!",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "When combat begins, deliver a rallying command. Choose up to three willing allies who can hear you. Each may immediately choose one of the following:",
      {"kind":"ul","runs":["Move to an adjacent zone they could normally enter."]},
      {"kind":"ul","runs":["Reduce their Strain by one."]},
      {"kind":"ul","runs":["Step up two dice the next time they ",{"text":"resist peril","italic":true}," before the beginning of their next turn."]},
      "After issuing the command, increase your Strain by one."
    ]
  },
  {
    name: "I Knew You'd Say That",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When a creature makes a demand, threat, proposal, or revelation, you may declare that you anticipated it.",
      "Describe one reasonable precaution you prepared beforehand: a hidden recording, a sympathetic witness, a concealed document, a prearranged signal, or another preparation.",
      {"kind":"p","runs":["The GM chooses one cost appropriate to your preparation: increase your Strain by one, expend 1d4 Supplies, or make a relevant ",{"text":"contest","italic":true},". If you pay the cost or succeed on the ",{"text":"contest","italic":true},", your preparation is established as having happened."]},
      "You cannot retroactively change another creature's decisions, invent objects you could not plausibly possess, or undo events already resolved."
    ]
  },
  {
    name: "Largest Army",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      "When you lead at least three willing allies, you may coordinate them to accomplish a single shared objective in combat.",
      {"kind":"p","runs":["Choose one ",{"text":"contest ","italic":true},"you will undertake together. Up to three willing allies who can hear or see your directions may each expend a light action to contribute up to three relevant dice, following the normal rules for cooperative ",{"text":"contests","italic":true},"."]},
      "The pool remains limited to two Skill dice, and no Skill or Talent can be included more than once. You make the contest, and all complications from the combined pool are yours to resolve.",
      {"kind":"p","runs":["Step up all dice in the dice pool of this ",{"text":"contest.","italic":true}," Each player contributing dice to the ",{"text":"contest","italic":true}," gains a Strain."]}
    ]
  },
  {
    name: "Zwerchau",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      {"kind":"p","runs":["When a creature in your zone declares an ",{"text":"attack ","italic":true},"against you with a (Melee) weapon, you may attempt a cross-cut using a (Melee) tagged weapon before the creature rolls."]},
      {"kind":"p","runs":[{"text":"Attack ","italic":true},"the creature, stepping down one die in your pool. If your attack deals damage, the incoming attack is interrupted and canceled."]},
      {"kind":"p","runs":["If your ",{"text":"attack ","italic":true},"fails or is successfully defended, the enemy's attack proceeds normally, and you cannot ",{"text":"defend ","italic":true},"against that ",{"text":"attack","italic":true},"."]}
    ]
  },
  {
    name: "Certain Birds",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When you spend at least an hour in a populated place where messages, rumors, and gossip circulate, choose a person, organization, or particular secret you wish to learn about.",
      "The GM tells you one true piece of recent information concerning your subject and identifies someone who could plausibly know more.",
      "However, your inquiries do not go entirely unnoticed. The GM chooses an interested party that learns someone is asking questions, though you may not learn who."
    ]
  },
  {
    name: "Rasputin",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      "Whenever you suffer a wound, roll twice on the wound table and choose which result you receive.",
      {"kind":"p","runs":["Additionally, while you have two or more wounds or scars, step up your Fortitude die whenever you ",{"text":"resist peril","italic":true},"."]},
      "Your wounds still reduce your maximum health, and you die normally if you would gain a sixth wound or your maximum health reaches zero."
    ]
  },
  {
    name: "Too Angry To Die",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "When damage would reduce you to zero or fewer health and cause a wound, you may instead remain at one health and defer that wound until the end of your next turn.",
      "Until then, step up all dice whenever you attack the creature that caused the damage.",
      "If you kill or incapacitate that creature before the end of your next turn, cancel the deferred wound and increase your Strain by two. Otherwise, suffer the wound normally.",
      "Any additional damage you receive during this time is resolved normally."
    ]
  },
  {
    name: "Get Better",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["When you provide emergency medical treatment to a creature in your zone using appropriate medical equipment, ",{"text":"contest Intellect|Precision","italic":true},"."]},
      "On a success, choose two different effects that apply to your patient:",
      {"kind":"ul","runs":["Restore 1d6 health."]},
      {"kind":"ul","runs":["Suppress the special effects of one wound until the patient next ",{"text":"recovers","italic":true},", without restoring the maximum health lost from that wound."]},
      {"kind":"ul","runs":["Remove the Poisoned condition."]},
      "This cannot heal wounds, remove scars, or restore health beyond the patient's current maximum."
    ]
  },
  {
    name: "Pillar Of Flame",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Heavy action",
    body: [
      "When you control a weapon, device, magical effect, or environmental source capable of producing significant fire, choose a zone that source can reach.",
      {"kind":"p","runs":[{"text":"Contest ","italic":true},"using the appropriate Skills for controlling the source. On a success, the zone erupts into a towering column of flame. Every creature in that zone, including allies, must ",{"text":"resist peril","italic":true}," or become Enflamed 3."]},
      {"kind":"p","runs":["Until the beginning of your next turn, any creature entering the affected zone must also ",{"text":"resist peril ","italic":true},"or become Enflamed 2."]},
      "The flames may ignite surrounding objects, with particularly dangerous consequences from complications. This power requires a credible source of fire; it does not inherently grant supernatural abilities."
    ]
  },
  {
    name: "Steel Chair",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":["Choose an unattended object in your zone that you could reasonably lift and swing as an improvised weapon. ",{"text":"Attack ","italic":true},"a creature in the same zone, treating the object as an appropriate improvised weapon and stepping up its object die twice."]},
      {"kind":"p","runs":["On a successful ",{"text":"attack","italic":true},", you may choose two:"]},
      {"kind":"ul","runs":["The target becomes Stunned until the end of its next turn."]},
      {"kind":"ul","runs":["The target is forced into an adjacent zone if physically possible."]},
      {"kind":"ul","runs":["The target drops one object it is holding."]},
      "After resolving the attack, the improvised weapon is destroyed or rendered unusable."
    ]
  },
  {
    name: "Luchador",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["When you have a creature within reach in your zone, ",{"text":"contest Might|Agility","italic":true}," against the creature."]},
      "On a success, choose two:",
      {"kind":"ul","runs":["Throw the creature into an adjacent zone, following it if you wish."]},
      {"kind":"ul","runs":["The creature becomes Slowed until the end of its next turn."]},
      {"kind":"ul","runs":["Force the creature to drop one held object."]},
      {"kind":"ul","runs":["Deal damage equal to a roll of your Might die."]},
      {"kind":"p","runs":["You cannot throw or forcibly move creatures of a size or mass that you could not plausibly manipulate. If you fail the ",{"text":"contest,","italic":true}," gain 3 Strain."]}
    ]
  },
  {
    name: "More Than Capable",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Free",
    body: [
      {"kind":"p","runs":["When you ",{"text":"contest ","italic":true},"without a directly applicable Talent, you may choose a Talent you possess and explain how its principles could be adapted to the task."]},
      "Step down that Talent die twice and add it to your pool, even if the Talent would not normally qualify. Gain 1 Strain."
    ]
  },
  {
    name: "Death On The Line",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      {"kind":"p","runs":["Before a ",{"text":"contest ","italic":true},"where failure could immediately result in your death or the death of an ally, you may wager your own life on the outcome."]},
      "Count the four highest dice in your contest pool instead of the usual two.",
      "If you succeed, resolve the contest normally. If you fail, you suffer a wound in addition to all normal consequences, even if you were not the creature originally in danger."
    ]
  },
  {
    name: "Final Destination",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "When an enemy successfully avoids an environmental hazard, you may describe a plausible secondary hazard created by the way they escaped: collapsing debris, unsecured machinery, a swinging cable, a runaway vehicle, or another cascading accident.",
      "The target must immediately resist peril against this secondary hazard.",
      "On a failure, the target takes 1d6 damage and becomes Slowed until the end of its next turn. On a success, it avoids the danger.",
      "The secondary hazard must be physically plausible in the current environment. This power cannot simply create objects or dangers from nothing."
    ]
  },
  {
    name: "Indomitable",
    type: "Move",
    scope: "Core",
    cooldown: "At-will",
    speed: "Free",
    body: [
      "When you suffer from Stunned, Slowed, or Paralyzed, you may increase your Strain by one to ignore the effects of those conditions until the beginning of your next turn.",
      "You may activate this power even while Paralyzed, despite the usual restriction on moves.",
      "The underlying conditions are not removed. Wounds, damage, Poisoned, and environmental effects continue to affect you normally."
    ]
  },
  {
    name: "Would You Like To Know More?",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Medium action",
    body: [
      "When you address a crowd, publish a persuasive report, distribute propaganda, or transmit a broadcast, describe a claim or cause you wish to spread and negotiate with the intended audience.",
      "On a success, choose two:",
      {"kind":"ul","runs":["Your message spreads beyond the original audience and becomes a recognizable rumor within the local community."]},
      {"kind":"ul","runs":["You identify a sympathetic individual with useful resources, authority, or connections."]},
      {"kind":"ul","runs":["A group of supporters organizes to undertake one specific, reasonable action related to your message."]},
      {"kind":"ul","runs":["Your message distracts public attention from another ongoing event or controversy."]},
      "The GM also chooses an interested party that notices your message and may respond to it. This power does not guarantee that the message is believed by everyone or that any claim is objectively true."
    ]
  },
  {
    name: "Run the Numbers",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      {"kind":"p","runs":["When you have enough information to compare two or more possible courses of action, spend at least ten minutes analyzing them and ",{"text":"contest Intellect|Sense.","italic":true}]},
      "On a success, the GM identifies which plan is most likely to succeed based on your available information and reveals one significant risk, assumption, or dependency affecting that conclusion.",
      "This does not predict unknowable events or guarantee that the chosen plan will succeed."
    ]
  },
  {
    name: "The Missing Piece",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When you possess at least two clues, testimonies, or pieces of evidence concerning a mystery, you may ask the GM what meaningful connection exists between them.",
      "The GM must reveal a true connection, however indirect, or tell you that the clues are unrelated.",
      "If a connection exists, you may also ask what question you should investigate next to understand it. The answer must identify a useful line of inquiry, not necessarily the solution to the mystery."
    ]
  },
  {
    name: "Ghost in the Ledger",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["When you gain access to an organization's administrative records, you may attempt to falsify one mundane recorded fact. ",{"text":"Contest Artifice|Charm","italic":true},"."]},
      "On a success, the alteration appears authentic until someone undertakes a meaningful investigation or independently verifies the facts. You might fabricate employment, redirect a shipment, erase an individual's recorded presence, or alter an authorization.",
      "The change can influence people who trust the records but cannot create physical assets, alter memories, or bypass independent security systems.",
      "On a complication, the GM may introduce an inconsistency that could eventually expose your interference."
    ]
  },
  {
    name: "The Fine Print",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When someone proposes a contract, oath, agreement, or binding exchange, you may examine its terms and ask the GM one of the following:",
      {"kind":"ul","runs":["What important obligation has not been explicitly addressed?"]},
      {"kind":"ul","runs":["What provision would be most difficult for the other party to fulfill?"]},
      {"kind":"ul","runs":["What interpretation of the agreement could substantially change its outcome?"]},
      {"kind":"p","runs":["The GM gives a truthful answer based on the agreement and circumstances. Step up two dice on the next ",{"text":"contest ","italic":true},"you make to negotiate or exploit the identified issue."]}
    ]
  },
  {
    name: "No One Important",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "When you are subject to routine scrutiny by guards, officials, employees, or other observers, you may attempt to appear so ordinary that nobody considers you worth investigating.",
      {"kind":"p","runs":[{"text":"Contest Charm|Presence","italic":true}," against the observer."]},
      "On a success, you are overlooked as an unimportant person until you do something obviously suspicious or someone specifically identifies you.",
      "This does not fool observers who already recognize you as a threat, nor does it disable technological security measures."
    ]
  },
  {
    name: "I Was Never Here",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When you successfully complete an infiltration, theft, act of sabotage, or other covert undertaking, you may describe how you conceal your involvement.",
      "Choose one:",
      {"kind":"ul","runs":["All physical evidence that would uniquely identify you is removed or obscured."]},
      {"kind":"ul","runs":["One credible piece of evidence points investigators toward a different explanation."]},
      "You must have had reasonable access to the relevant evidence. This ability cannot erase eyewitness memories, inaccessible recordings, or evidence you never had an opportunity to manipulate.",
      "Investigators may still discover that something happened."
    ]
  },
  {
    name: "Payment in Kind",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      {"kind":"p","runs":["When you fail to ",{"text":"acquire ","italic":true},"an object because your Wealth is insufficient, you may offer a service, obligation, or favor as part of the payment instead."]},
      "Describe something valuable you could realistically provide and negotiate with the seller. On a success, the seller accepts the exchange, and you gain the object.",
      "Write a favor bond representing the obligation. The GM determines an appropriately difficult or costly way to fulfill it, proportional to the value of the transaction.",
      "A seller must be capable of extending credit or accepting the proposed exchange. This cannot compel someone to trade an unavailable object."
    ]
  },
  {
    name: "Jury-Rigged",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      "When you need a tool you do not possess, you may expend one Supplies to assemble an improvised substitute from materials available in your surroundings.",
      "Choose one Practical Talent. The improvised tool has a 1d6 object die and the (Aid|Talent) tag for that Talent.",
      "It functions until the end of the encounter, at which point it is destroyed.",
      "The tool must be physically plausible and cannot substitute for unusually sophisticated, rare, or specialized equipment."
    ]
  },
  {
    name: "A Better Mousetrap",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Heavy action",
    body: [
      {"kind":"p","runs":["Using objects and hazards available in your surroundings, you may rapidly assemble a trap in your zone. Describe its trigger and intended effect, then ",{"text":"contest Artifice|Sense","italic":true},"."]},
      {"kind":"p","runs":["On a success, record the contest total. The first creature that activates the trap may ",{"text":"resist peril ","italic":true},"against that total."]},
      "On a failure, choose an effect appropriate to the trap:",
      {"kind":"ul","runs":["Suffer 3d6 damage."]},
      {"kind":"ul","runs":["Become Slowed until the end of its next turn."]},
      {"kind":"ul","runs":["Drop a held object."]},
      "The trap remains until triggered, dismantled, or rendered ineffective by changing circumstances. It does not automatically distinguish friend from foe."
    ]
  },
  {
    name: "Firebreak",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "When a spreading environmental danger threatens your location, describe how you attempt to contain it: sealing a bulkhead, cutting off ventilation, clearing combustibles, erecting a barricade, or another appropriate measure.",
      {"kind":"p","runs":[{"text":"Contest Artifice|Sense","italic":true}," using relevant equipment."]},
      "On a success, prevent that danger from crossing one boundary between your zone and an adjacent zone for the next two rounds.",
      "This does not eliminate the danger or protect creatures already exposed to it. The preparation must be capable of physically containing the hazard, and extraordinary circumstances may overwhelm it."
    ]
  },
  {
    name: "Not One Step Further",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      "When an enemy attempts to enter or leave your zone through a passage you can physically obstruct, you may challenge its movement.",
      {"kind":"p","runs":[{"text":"Contest Might|Resolve","italic":true}," against the creature's ",{"text":"Might|Agility.","italic":true}]},
      "On a success, its movement is wasted, and it cannot attempt to cross the same passage again until its next turn.",
      "On a failure, the creature moves normally, and you increase your Strain by one.",
      "This ability requires a plausible way to obstruct the route."
    ]
  },
  {
    name: "Overwatch",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Heavy action",
    body: [
      "Choose a visible zone within range of a ranged weapon you are wielding. Until the beginning of your next turn, you may immediately attack the first hostile creature that enters that zone or attacks an ally within it.",
      "You make this attack without spending an additional action, using the normal attack rules and ammunition costs.",
      "If the triggering event never occurs, the readied attack is lost. You cannot make more than one attack through this power."
    ]
  },
  {
    name: "The Show Must Go On",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      {"kind":"p","runs":["When at least three creatures are watching you perform, speak, demonstrate, or otherwise command their attention, ",{"text":"contest Charm|Presence.","italic":true}]},
      "On a success, choose a willing ally who can take advantage of your distraction. Until the beginning of your next turn, that ally may perform one reasonably discreet action without attracting the audience's attention.",
      "The ally must still spend the appropriate combat action and make any contests required by the task. Obvious violence, alarms, and other unmistakable events cannot be concealed by your performance."
    ]
  },
  {
    name: "That's On Me",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      {"kind":"p","runs":["When an ally suffers a complication from a ",{"text":"contest","italic":true},", you may offer to take responsibility for one of those complications instead."]},
      "Describe how you intervene. If the GM determines that you could plausibly bear the consequence, it affects you, your equipment, or your position instead of the ally.",
      "The ally's success or failure is unchanged. Once the consequence is resolved, gain a surge.",
      "You cannot redirect consequences that are physically impossible for you to intercept."
    ]
  },
  {
    name: "Bedside Manner",
    type: "Passive",
    scope: "Core",
    cooldown: "",
    speed: "",
    body: [
      {"kind":"p","runs":["When you personally provide appropriate medical care to a creature throughout a week of recovery, ",{"text":"contest Intellect|Precision","italic":true},", adding Medicine and relevant equipment."]},
      "On a success, one wound heals as normal, but the patient does not have to roll for the chance of acquiring a scar from that wound.",
      "On a failure, the wound heals according to the ordinary rules, including the normal chance of scarring."
    ]
  },
  {
    name: "Wrong Turn",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When a failed journey or travel through space navigation contest would send you somewhere unintended, you may ask the GM to describe two plausible destinations resulting from the mistake.",
      "Choose which destination you reach.",
      "Any additional time, fuel consumption, dangers, or complications from the failed journey still apply. This ability changes where the mistake takes you, not whether the journey was successful."
    ]
  },
  {
    name: "Hands-On Training",
    type: "Move",
    scope: "Core",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      "Choose a willing ally in your zone and a Talent you possess. Describe how you rapidly coach, instruct, or guide them through its application.",
      {"kind":"p","runs":["Before the beginning of your next turn, the ally may use your Talent die in one relevant ",{"text":"contest ","italic":true},"instead of their own Talent die."]}
    ]
  },
  {
    name: "Inside Man",
    type: "Move",
    scope: "Core",
    cooldown: "Recovery",
    speed: "Free",
    body: [
      "When dealing with an organization, institution, or faction you have meaningfully interacted with in the past, you may declare that you have a contact within its ranks.",
      "The GM identifies a plausible individual and describes what relationship, acquaintance, or obligation connects you.",
      "Write a bond involving that individual. They can provide one limited piece of assistance appropriate to their role, such as arranging an introduction, giving information, or facilitating access.",
      "The GM determines what they expect in return."
    ]
  },
  {
    name: "May The Force Be With You",
    type: "Move",
    scope: "Starship",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "After you roll to Dogfight or Open Fire, but before the outcome is determined, you may spend a surge and roll 1d12. Add the result to your total in addition to the dice normally counted."
    ]
  },
  {
    name: "Max Burn",
    type: "Move",
    scope: "Starship",
    cooldown: "Encounter",
    speed: "Free",
    body: [
      "Spend one Fuel to push your ship’s engines beyond their normal limits. Gain Advantage equal to your Speed, up to your ship’s maximum. Record the amount actually gained; at the beginning of your next turn, lose that much Advantage.",
      "You may instead use this power during the Merge to begin with Advantage equal to twice your Speed. Advantage gained during the Merge does not expire.",
      "You must be the pilot, and the ship must be capable of maneuvering."
    ]
  },
  {
    name: "Engage!",
    type: "Move",
    scope: "Starship",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      "Activate a functioning Axial drive and complete its skip immediately, bypassing the normal charging round and suspension of other modules.",
      "You must still have a valid route, a compatible drive, and enough Fuel. Resolve Travel Through Space normally.",
      "After arrival, give up to 1d4 randomly selected undamaged hardpoint modules (Damaged). This cannot be used to activate a destroyed drive or a ship without a functioning Central Engine."
    ]
  },
  {
    name: "Sic Parvis Magna",
    type: "Move",
    scope: "Starship",
    cooldown: "Recovery",
    speed: "Movement action",
    body: [
      "While piloting, gain 1d4 Advantage, then immediately Open Fire with one functioning ship weapon against a detected hostile ship with the lowest Advantage in the encounter.",
      "This attack requires no additional action and ignores the usual Advantage restriction. If multiple enemies are tied for lowest Advantage, choose one.",
      "This counts as your ship’s pilot maneuver for the round. Normal ammunition, reload, and weapon firing limits still apply."
    ]
  },
  {
    name: "Hotshot",
    type: "Move",
    scope: "Starship",
    cooldown: "Recovery",
    speed: "Heavy action",
    body: [
      "While piloting, perform two pilot maneuvers in succession without spending movement actions. Resolve the first completely before choosing the second.",
      "This replaces your ship’s normal pilot maneuver for the round. You cannot use it after your ship has already performed a pilot maneuver, and it does not allow another maneuver afterward.",
      "Increase your Strain by one after resolving both maneuvers."
    ]
  },
  {
    name: "Vacuum Training",
    type: "Move",
    scope: "Starship",
    cooldown: "Encounter",
    speed: "Light action",
    body: [
      "When you are exposed to vacuum, contest Fortitude|Resolve, stepping up both Skill dice.",
      "On a success, ignore the automatic scars and suffocation caused by Vacuum Decompression until the beginning of your third turn after using this power, or for one minute outside combat.",
      "When the protection ends, begin counting exposure time from that moment. This does not restore air, heal existing injuries, or protect against attacks, radiation, or debris."
    ]
  },
  {
    name: "Silent Running",
    type: "Move",
    scope: "Starship",
    cooldown: "Encounter",
    speed: "Movement action",
    body: [
      "While piloting a ship, you may reduce its Advantage by two and attempt to break enemy sensor contact. Maneuver against a challenge rating determined by the GM.",
      "On a success, your ship becomes undetected until it reveals its position, following the normal flying undetected rules.",
      "Unlike ordinary flying undetected, this power does not require maximum Advantage.",
      "The ship must be capable of maneuvering, and the power does not defeat detection methods that can reliably track its position despite concealment.",
      "This counts as your ship's pilot maneuver for the round."
    ]
  },
  {
    name: "Fire-Control Solution",
    type: "Move",
    scope: "Starship",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      "While operating functioning ship sensors, choose a detected enemy ship and contest Sense|Artifice against its pilot's maneuver total.",
      "On a success, choose one allied ship weapon operator. Their next open fire against that target before the beginning of your next turn may target it at up to two Advantage above the firing ship's Advantage and steps up two dice in the attack pool.",
      "This power does not bypass the normal weapon firing limits or prevent the target from using evasion."
    ]
  },
  {
    name: "Overclock",
    type: "Move",
    scope: "Starship",
    cooldown: "Encounter",
    speed: "Medium action",
    body: [
      "While operating accessible engineering controls, choose a functioning ship weapon or thruster module.",
      "The next time that module contributes dice to a contest before the end of your next turn, step up all its object dice twice.",
      "After resolving that use, give the module the (Damaged) tag.",
      "This cannot affect the ship's core modules or any module that is already (Damaged). All normal consequences of the (Damaged) tag apply."
    ]
  },
  {
    name: "Hard Dock",
    type: "Move",
    scope: "Starship",
    cooldown: "Recovery",
    speed: "Movement action",
    body: [
      "While piloting a ship equipped with Boarding Tubes, choose a physically reachable hostile ship and attempt to force a boarding connection. Both ships must be capable of maneuvering.",
      "Dogfight against the target. On a success, both ships become stationary and your Boarding Tubes connect immediately, even if the target does not consent.",
      "The normal boarding rules then apply, including any sealed entrances or defenders aboard the target.",
      "On a failure, your ship becomes stationary without successfully connecting the tubes.",
      "This counts as your ship's pilot maneuver for the round."
    ]
  }
].map(power => ({
  ...power,
  description: power.body.map(block => typeof block === 'string' ? block :
    block.runs.map(run => typeof run === 'string' ? run : run.text).join('')).join('\n')
}));
