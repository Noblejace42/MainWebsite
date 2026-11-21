// Character creation tables, Axial §§1.2 and 3.1.
window.AxialCharacterRules = {
  talents: {
    Knowledge: ["Agriculture", "Anthrohistorics", "Architecture", "Astronomy", "Biology", "Chemistry", "Computer Science", "Criminology", "Economics", "Geography", "Geology", "History", "Law", "Linguistics", "Literature", "Mathematics", "Medicine", "Meteorology", "Music", "Philosophy", "Physics", "Politics", "Psychology", "Tactics", "Logistics", "Materials", "Accounting", "Arcana"],
    Combat: ["Natural", "Longblade", "Polearm", "Shortblade", "Bludgeon", "Shield", "Sling", "Handgun", "Shotgun", "Rifle", "Emitter", "Grenade", "Mass Driver", "Tethered-Impact", "Artillery", "Grappling", "Gunnery", "Piloting", "Driving"],
    Practical: ["Alchemy", "Animal Handling", "Appraisal", "Smithing", "Construction", "Cartography", "Cooking", "Hacking", "Engineering", "Electronics", "Farming", "Fishing", "Fine Crafting", "Tracking", "Lockpicking", "Mining", "Navigation", "Robotics", "Sailing", "Scouting", "Siegecraft", "Stealth", "Tailoring", "Vehicle Repair", "Bushcraft", "Artistry", "Sleight of Hand", "Disguise", "Woodworking", "Explosives"],
    Athletics: ["Running", "Jumping", "Climbing", "Swimming", "Acrobatics", "Strength Training", "Riding"],
    Social: ["Leadership", "Persuasion", "Deception", "Intimidation", "Insight", "Negotiation", "Streetwise", "Interrogation"]
  },
  kits: {
    "Science Fiction": {
      "Expert": [
        "MatScanner | tool | 1d8 | (Aid|Materials) | 2 Mass",
        "Hand Core Sampler | tool | 1d6 | 2 Mass",
        "Folding Utility Knife | weapon, shortblade | 1d4 | (Agility, Precision, Melee) | (Quick) | 1 Mass",
        "Dockworker’s Coveralls | wearable, chest | 1d4 | 2 Mass",
        "Numbered Sample Tins | 1 Mass",
        "Grease Pencil and Field Ledger | 1 Mass",
        "Station Handset | 1 Mass",
        "Survey Satchel and Water Flask | 2 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Enforcer": [
        "Surplus Duty Pistol | weapon, handgun | 2d6 | (Precision, Sense, Near-range) | (Ammo, Quick) | 2 Mass",
        "Ammo | (Special) | 1 Mass",
        "Patrol Vest | wearable, chest | 1d6 | (Toughness 1) | 3 Mass",
        "Rubber Baton | weapon, bludgeon | 1d4 | (Might, Agility, Melee) | (Quick) | 1 Mass",
        "Cuffs and Key | 1 Mass",
        "Shoulder Radio | 1 Mass",
        "Pocket Lamp | tool | 1d4 | 1 Mass",
        "Duty Belt with Holster and Canteen | 2 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Technologist": [
        "Diagnostic Terminal | tool | 1d8 | (Aid|Electronics) | 2 Mass",
        "Tethered Inspection Crawler | tool | 1d8 | (Artifice, Sense) | 2 Mass",
        "Socket and Driver Roll | tool | 1d6 | 2 Mass",
        "Work Coveralls | wearable, chest | 1d4 | 2 Mass",
        "Headlamp | wearable, head | 1d4 | (Gear) | 1 Mass",
        "Tin of Fuses and Jump Leads | 1 Mass",
        "Spare Battery Brick | 1 Mass",
        "Tool Bag and Water Bottle | 2 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Ranger": [
        "Survey Carbine | weapon, rifle | 2d6 | (Precision, Sense, Long-range) | (Ammo) | 3 Mass",
        "Ammo | (Special) | 1 Mass",
        "Thermal Field Glasses | tool | 1d8 | (Aid|Scouting) | 2 Mass",
        "Weatherproof Field Coat | wearable, chest | 1d4 | 2 Mass",
        "Topographic Slate | tool | 1d4 | 1 Mass",
        "Emergency Beacon | 1 Mass",
        "Bivy Sack | 2 Mass",
        "Trail Pack and Full Water Bladder | 3 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Archivist": [
        "Legacy Media Reader | tool | 1d8 | (Consistent 1) | (Aid|Computer Science) | 2 Mass",
        "Portable Microfilm Camera | tool | 1d6 | 1 Mass",
        "Folding Magnifier | tool | 1d4 | 1 Mass",
        "Lint-Free Handling Gloves | 1 Mass",
        "Blank Archive Cartridge | 1 Mass",
        "Paper Accession Log and Pencil | 1 Mass",
        "Padded Courier Coat | wearable, chest | 1d4 | 2 Mass",
        "Watertight Document Case | 2 Mass",
        "Water Flask | 1 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ]
    },
    "Cyberpunk": {
      "Expert": [
        "Pocket Ultrasound | tool | 1d8 | (Aid|Medicine) | 1 Mass",
        "Clinic Trauma Shears | tool | 1d6 | 1 Mass",
        "Bandages | tool | 1d4 | (Aid|Medicine, Consumable 1) | 1 Mass",
        "Puncture-Resistant Gloves | wearable, arms | 1d4 | 1 Mass",
        "Pupil Light | tool | 1d4 | 1 Mass",
        "Foil Rescue Blanket | 1 Mass",
        "Prepaid Phone | 1 Mass",
        "Clinic Bag and Water Bottle | 2 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Enforcer": [
        "Shock Baton | weapon, bludgeon | 2d6 | (Might, Agility, Melee) | (Quick, Stunning) | 2 Mass",
        "Lined Motorcycle Jacket | wearable, chest | 1d6 | (Toughness 1) | 3 Mass",
        "Pawnshop Revolver | weapon, handgun | 1d4 | (Precision, Sense, Near-range) | (Ammo, Quick) | 1 Mass",
        "Ammo | (Special) | 1 Mass",
        "Clip-On Body Camera | tool | 1d4 | 1 Mass",
        "Handcuffs and Key | 1 Mass",
        "Dispatch Earpiece | 1 Mass",
        "Belt Pouch and Steel Flask | 2 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Technologist": [
        "Refurbished Cyberdeck | tool | 1d8 | (Aid|Computer Science) | 2 Mass",
        "Wrist Datajack | wearable, arms | 1d6 | (Multipurpose|tool) | (Gear, Implanted) | 1 Mass",
        "Folding Soldering Iron | tool | 1d6 | 1 Mass",
        "Stubby Ratchet Driver | tool | 1d4 | 1 Mass",
        "Shop Goggles | wearable, head | 1d4 | 1 Mass",
        "Spool of Solder | 1 Mass",
        "Adapter Roll and Patch Cables | 1 Mass",
        "Canvas Tool Bag and Water Bottle | 2 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Ranger": [
        "Courier’s Street Atlas Implant | wearable, trinket | 1d8 | (Multipurpose|tool) | (Gear, Implanted, Aid|Navigation) | 1 Mass",
        "50ft Rope Coil | tool | 1d6 | (Consistent 1) | (Aid|Climbing) | 2 Mass",
        "Courier’s Knife | weapon, shortblade | 1d4 | (Agility, Precision, Melee) | (Quick) | 1 Mass",
        "Courier Helmet | wearable, head | 1d4 | 2 Mass",
        "Windup Hand Lamp | tool | 1d4 | 1 Mass",
        "Grease Pencil and Blank Route Slips | 1 Mass",
        "Rain Cape | 1 Mass",
        "Waxed Messenger Bag and Water Flask | 2 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Dilettante": [
        "Annotated Private Club Directory | tool | 1d8 | (Aid|Streetwise) | 1 Mass",
        "Heirloom Holographic Brooch | wearable, trinket | (Ornate) | (Gear) | 1 Mass",
        "Silver-Topped Walking Cane | weapon, bludgeon | 1d4 | (Might, Agility, Melee) | (Quick) | 2 Mass",
        "Pocket Camera | tool | 1d6 | 1 Mass",
        "Last Season’s Phone | 1 Mass",
        "E-Paper Calling Cards | 1 Mass",
        "Reversible Evening Coat | 2 Mass",
        "Overnight Bag and Pocket Flask | 2 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ]
    },
    "Fantasy": {
      "Expert": [
        "Locksmith’s Pick Roll | tool | 1d8 | (Precision) | (Aid|Lockpicking) | 1 Mass",
        "Belt Knife | weapon, shortblade | 1d6 | (Agility, Precision, Melee) | (Quick) | 1 Mass",
        "Jointed Inspection Mirror | tool | 1d4 | 1 Mass",
        "Hooded Lantern | tool | 1d4 | 2 Mass",
        "Lamp Oil | (Consumable 3) | 1 Mass",
        "Tinderbox | 1 Mass",
        "Tin of Impression Wax | 1 Mass",
        "Travel Clothes, Shoulder Bag and Full Waterskin | 5 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Warrior": [
        "Footman’s Bill | weapon, polearm | 2d8 | (Might, Precision, Melee) | 4 Mass",
        "Quilted Jack | wearable, chest | 1d6 | (Toughness 1) | 3 Mass",
        "Camp Knife | weapon, shortblade | 1d4 | (Agility, Melee) | (Quick) | 1 Mass",
        "Whetstone and Oil Rag | 1 Mass",
        "Bandages | tool | 1d4 | (Aid|Medicine, Consumable 1) | 1 Mass",
        "Bedroll and Groundsheet | 3 Mass",
        "Travel Clothes, Haversack and Full Waterskin | 5 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Artificer": [
        "Journeyman’s Tool Roll | tool | 1d8 | (Artifice) | (Aid|Fine Crafting) | 3 Mass",
        "Hand Vise | tool | 1d6 | 2 Mass",
        "Riveting Hammer | weapon, bludgeon | 1d4 | (Might, Melee, Multipurpose|tool) | (Quick) | 1 Mass",
        "Leather Work Apron | wearable, chest | 1d4 | 1 Mass",
        "Folding Brass Calipers | tool | 1d4 | 1 Mass",
        "Tin of Wire, Rivets and Pins | 1 Mass",
        "Candle Stubs and Tinderbox | 1 Mass",
        "Travel Clothes, Tool Bag and Full Waterskin | 5 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Ranger": [
        "Yew Hunting Bow | weapon, tension | 2d8 | (Precision, Sense, Long-range) | (Ammo) | 2 Mass",
        "Ammo | (Special) | 1 Mass",
        "Skinning Knife | weapon, shortblade | 1d4 | (Agility, Precision, Melee) | (Quick) | 1 Mass",
        "50ft Rope Coil | tool | 1d6 | (Consistent 1) | (Aid|Climbing) | 2 Mass",
        "Oiled Groundsheet | tool | 1d4 | 1 Mass",
        "Tinderbox | 1 Mass",
        "Wool Cloak and Bedroll | 3 Mass",
        "Travel Clothes, Rucksack and Full Waterskin | 5 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ],
      "Scholar": [
        "Lexicon of Living and Dead Tongues | tool | 1d8 | (Intellect) | (Aid|Linguistics) | 2 Mass",
        "Ash Walking Staff | weapon, bludgeon | 1d6 | (Might, Agility, Melee) | 2 Mass",
        "Horn Reading Lens | tool | 1d4 | 1 Mass",
        "Waxed Folio with Blank Paper | 1 Mass",
        "Quills, Ink and Penknife | 1 Mass",
        "Travel Candle and Tinderbox | 1 Mass",
        "Wool Blanket | 2 Mass",
        "Travel Clothes, Book Satchel and Full Waterskin | 5 Mass",
        "Ration | (Consumable 1, Special) | 1 Mass"
      ]
    }
  },
  health(fortitudeSides, resolveSides, age) {
    const base = 10 + fortitudeSides + resolveSides;
    const agePenalty = Math.floor(Math.max(0, age - 35) / 5) * 2;
    return { health: Math.max(0, base - agePenalty), base, agePenalty };
  }
};
