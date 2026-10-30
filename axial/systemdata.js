/* Authored setting tables. Physical values are illustrative survey estimates. */
globalThis.SystemTables = {
  presets: {
    random: ['Unspecified', 'Let the survey find its own character.'],
    frontier: ['Frontier', 'Small habitats at the edge of a thin supply network.'],
    extraction: ['Extraction', 'Ore, ice and the people who keep the machinery running.'],
    industrial: ['Industrial', 'A few specialist workshops; every imported bearing matters.'],
    trade: ['Transit stop', 'A fuel depot and an anchorage between distant destinations.'],
    research: ['Research', 'Long observations, small crews and delayed relief rotations.'],
    military: ['Picket system', 'A listening post, a patrol berth and a narrow mandate.'],
    agricultural: ['Agricultural', 'Pressurized growing space serving nearby habitats.'],
    failed: ['Failed colony', 'Idle machinery and the people who could not leave.'],
    contested: ['Contested', 'Small communities with incompatible claims.'],
    uninhabited: ['Uninhabited', 'No permanent residents; passing expeditions are possible.']
  },
  names: ['Alder', 'Vela', 'Kestrel', 'Sable', 'Merrow', 'Tern', 'Orison', 'Harrow', 'Calder', 'Ilex', 'Bracken', 'Nacre', 'Rill', 'Serein', 'Vesper', 'Talus', 'Cairn', 'Esker', 'Lorn', 'Morrow', 'Fen', 'Palisade', 'Kern', 'Halden'],
  siteNames: ['Moraine', 'Stillwater', 'Lowbank', 'Cinder', 'Keel', 'Basin', 'Threshold', 'Longwatch', 'Gantry', 'Prospect', 'Latch', 'Cistern', 'Sump', 'Trestle', 'Shelter', 'Intake', 'Relay', 'Anchor', 'Foundry', 'Switchback'],
  first: ['Ada', 'Ilya', 'Mara', 'Jonas', 'Leena', 'Oren', 'Sana', 'Emil', 'Ruth', 'Tomas', 'Nadia', 'Petra', 'Hana', 'Soren', 'Anik', 'Mina'],
  last: ['Voss', 'Hale', 'Sen', 'Orlov', 'Tan', 'Mbeki', 'Reid', 'Kovac', 'Sato', 'Moreau', 'Singh', 'Dahl', 'Costa', 'Iqbal', 'Park', 'Neri'],
  stars: [
    {type: 'M3 V', name: 'Red dwarf', mass: .35, luminosity: .015, weight: 5, note: 'Low visible light; flare monitoring governs surface work and exposed electronics.'},
    {type: 'K4 V', name: 'Orange dwarf', mass: .72, luminosity: .22, weight: 6, note: 'A long-lived primary. Outer installations rely on reactors rather than sunlight.'},
    {type: 'G2 V', name: 'Yellow dwarf', mass: 1, luminosity: 1, weight: 3, note: 'Broadly solar-like output. Radiation shelters remain essential beyond an atmosphere.'},
    {type: 'F7 V', name: 'Yellow-white dwarf', mass: 1.25, luminosity: 2.3, weight: 1, note: 'Elevated ultraviolet exposure; surface polymers and optical coatings age quickly.'}
  ],
  bodies: {
    rock: {label: 'Airless rock', gravity: [.12, .8], air: 'Trace exosphere · no usable atmosphere', terrain: ['Impact basins and fractured basalt', 'Brecciated uplands and sharp ejecta', 'Ancient lava plains cut by contraction scarps'], resources: ['silicate aggregate', 'iron-nickel inclusions', 'titanium-bearing minerals'], note: 'Vacuum-rated equipment. Dust abrades seals; exposed surfaces swing sharply between light and shadow.'},
    desert: {label: 'Dry terrestrial', gravity: [.45, 1.2], air: 'Thin CO₂ / nitrogen · unbreathable', terrain: ['Wind-cut plateaus above dry sedimentary basins', 'Oxidized dunes and exposed salt deposits', 'Dust plains below extinct volcanic shields'], resources: ['water bound in minerals', 'iron oxides', 'industrial salts'], note: 'Pressure support and bottled oxygen required. Fine dust accumulates in filters and radiator hinges.'},
    ice: {label: 'Ice world', gravity: [.08, .55], air: 'Trace nitrogen / methane · unbreathable', terrain: ['Cratered water ice beneath a dark regolith', 'Rifted ice sheets and frozen impact melt', 'Volatile frost deposits in deep shadow'], resources: ['water ice', 'ammonia-bearing ice', 'carbon compounds'], note: 'Cryogenic seals and insulated lines are essential. Ice is feedstock, not a ready supply of drinking water.'},
    temperate: {label: 'Temperate terrestrial', gravity: [.65, 1.25], air: 'Nitrogen / CO₂ · oxygen not assured', terrain: ['Cold seas between basaltic continents', 'Seasonal meltwater and broad sedimentary shelves', 'Temperate basins beneath persistent cloud'], resources: ['liquid water', 'carbonate deposits', 'clay minerals'], note: 'Temperate does not mean habitable. Atmospheric processing and biological assays precede any open-air occupation.'},
    greenhouse: {label: 'Greenhouse world', gravity: [.65, 1.3], air: 'Dense CO₂ · corrosive trace gases', terrain: ['Hot volcanic plains beneath opaque cloud', 'Faulted highlands and pressure-weathered basins', 'Sulfur-stained plateaus'], resources: ['sulfur compounds', 'atmospheric carbon', 'basaltic minerals'], note: 'Surface occupation is impractical for ordinary crews. Operations remain in orbit.'},
    gas: {label: 'Gas giant', gravity: null, air: 'Hydrogen / helium · no solid landing surface', terrain: ['Layered cloud belts and persistent storm cells', 'Pale ammonia clouds above deep convective layers', 'Narrow rings and magnetospheric aurorae'], resources: ['hydrogen', 'helium', 'trace atmospheric volatiles'], note: 'No surface landing. Radiation exposure and deep gravity wells constrain collection operations.'}
  },
  purposes: {
    mining: {label: 'Extraction camp', exports: ['sorted ore concentrate', 'vacuum-sintered aggregate', 'assayed mineral cores'], need: ['excavator bearings', 'cutting heads', 'abrasion-resistant seals'], services: ['Ore assay', 'Machine shop'], facility: 'A cable excavator feeds a covered sorting line. Work stops whenever its single spare motor is in use.'},
    fuel: {label: 'Propellant depot', exports: ['processed water', 'stored oxygen', 'reaction-mass reserves'], need: ['cryogenic valves', 'electrolysis membranes', 'pressure-vessel liners'], services: ['Propellant transfer', 'Water processing'], facility: 'Insulated tanks sit well clear of the occupied module; transfer windows follow tank temperatures.'},
    workshop: {label: 'Repair cooperative', exports: ['refurbished pumps', 'machined brackets', 'pressure-tested pipework'], need: ['precision tooling', 'lubricants', 'certified stock metal'], services: ['Basic repairs', 'Machine shop'], facility: 'A clean bench and two machine tools support most local repairs. Major engine work still requires imported parts.'},
    trade: {label: 'Transfer port', exports: ['bonded cargo handling', 'survey-chart updates', 'freight consolidation'], need: ['dock seals', 'cargo-handling cables', 'medical consumables'], services: ['Cargo exchange', 'Short-stay bunks'], facility: 'A bonded store and a single staffed cargo lock handle shipments between infrequent departures.'},
    research: {label: 'Field laboratory', exports: ['instrument telemetry', 'core samples', 'licensed survey data'], need: ['detector elements', 'sterile consumables', 'calibration standards'], services: ['Sample analysis', 'Medical stabilization'], facility: 'Instrument racks occupy more space than the crew quarters. Observation windows dictate the working day.'},
    military: {label: 'Listening post', exports: ['traffic advisories', 'paid escort coverage', 'navigation bulletins'], need: ['antenna actuators', 'reactor service parts', 'encrypted avionics'], services: ['Emergency shelter', 'Traffic control'], facility: 'A passive receiver array and a small operations room provide coverage; there is no standing invasion force.'},
    agriculture: {label: 'Growers’ habitat', exports: ['dried pulses', 'algal protein', 'seed cultures'], need: ['nutrient salts', 'grow-light drivers', 'water-test reagents'], services: ['Food exchange', 'Water processing'], facility: 'Stacked growing trays recycle water through biological filters. Crop diversity is deliberately limited.'}
  },
  governments: {
    cooperative: ['Crew cooperative', 'Elected coordinator'],
    corporate: ['Chartered concession', 'Site superintendent'],
    research: ['Research trust', 'Station director'],
    military: ['Service jurisdiction', 'Watch commander'],
    independent: ['Independent holding', 'Steward']
  },
  conditions: [
    'A relief crew is overdue by one scheduled transport window.',
    'An air scrubber runs below specification; replacement cartridges are being rationed.',
    'The latest cargo manifest lists a critical part that never arrived.',
    'An antenna drive is stuck. Messages must wait for a narrow pointing window.',
    'Two crew members dispute the terms of the next rotation.',
    'Radiator maintenance has reduced available power until the exterior work is complete.',
    'A storage tank leaks slowly enough to manage, but no one agrees how long the repair can wait.',
    'The settlement is saving power for a planned departure.',
    'A survey claim overlaps an older concession whose owner has returned.',
    'A medical evacuation would consume the only departure-ready berth.'
  ],
  fleets: {
    cargo: {label: 'Freight call', ships: ['coastal-class cargo tender', 'bulk carrier', 'contract freighter'], activities: ['Waiting for a transfer slot; its cargo lock needs a replacement seal.', 'Offloading machinery and taking on water for the next leg.', 'Holding departure until an overdue consignment arrives.']},
    survey: {label: 'Survey party', ships: ['survey launch', 'instrument carrier'], activities: ['Deploying passive probes before a long mapping pass.', 'Repeating an anomalous reading with a second instrument.', 'Waiting for a safe approach to an uncharted debris field.']},
    patrol: {label: 'Patrol element', ships: ['patrol cutter', 'inspection launch'], activities: ['Checking transponders against an out-of-date registry.', 'Escorting a single high-value cargo vessel.', 'Monitoring an exclusion zone with limited fuel reserves.']},
    salvage: {label: 'Salvage team', ships: ['salvage tug', 'utility tender'], activities: ['Stabilizing a derelict before attaching tow lines.', 'Cutting loose useful machinery under a disputed recovery license.', 'Looking for a missing inspection drone near a wreck.']},
    transit: {label: 'Passenger transfer', ships: ['crew ferry', 'long-haul transport'], activities: ['Carrying contract workers to a relief rotation.', 'Seeking a berth after a failed life-support inspection.', 'Waiting on a passenger whose papers do not match the manifest.']}
  },
  remote: [
    ['Cold relay', 'An automated timing beacon stores messages between visits. Its backup clock has drifted.', 'Comms relay'],
    ['Survey cache', 'Sealed drums of water and emergency rations remain from a mapping expedition. The inventory is old.', 'Emergency cache'],
    ['Tumbling upper stage', 'An unpowered propulsion stage rotates slowly. Residual propellant makes cutting it open hazardous.', 'Salvage target'],
    ['Deep-space receiver', 'A sparse antenna array logs intermittent signals. A service skiff visits only on contract.', 'Passive observatory'],
    ['Transfer shelter', 'An unstaffed pressure vessel offers short-term refuge. Consumables are not guaranteed.', 'Emergency shelter']
  ]
};

/* Deliberately broad authored pools: independent dimensions, not renamed copies. */
(() => {
  const t = SystemTables;
  t.names.push(...'Aster,Bellweather,Celandine,Dunlin,Eidolon,Fallow,Gannet,Hesper,Islay,Juniper,Kiln,Lacuna,Marsh,Nettle,Oriel,Plover,Quarry,Ravel,Solace,Tamar,Umber,Vetch,Warden,Yarrow,Zephyr,Ashdown,Boreal,Cassian,Drift,Elver,Farrier,Galen,Hollis,Isen,Jura,Kennet,Linden,Marten,Nairn,Otter,Peregrine,Quill,Rook,Selden,Tallow,Ullin,Vale,Weir,Yew,Zennor'.split(','));
  t.siteNames.push(...'Breakwater,Counterweight,Drywell,Ember,Farside,Greenbank,Hearth,Intaglio,Jackstay,Keyway,Lantern,Manifold,Northcut,Overlook,Pipehead,Quay,Rivet,Spindle,Trunnion,Underbank,Valve,Windlass,Yardarm,Zero Point,Allotment,Bellmouth,Crossing,Drawdown,Endcap,Forebay,Gasket,Hammerfall,Inlet,Junction,Kilowatt,Long Step,Midwatch,Narrows,Outfall,Portage,Quiet Reach,Redoubt,Standpipe,Third Shift,Uplink,Venthouse,West Lock,Yard Nine,Last Light,Old Sill'.split(','));
  t.first.push(...'Bela,Cora,Dima,Edda,Faris,Greta,Hugo,Ines,Jae,Kiran,Luka,Mei,Nils,Olga,Pavel,Quinn,Rami,Selma,Tariq,Ulla,Vera,Wen,Yara,Zoya,Amir,Berit,Cem,Dalia,Enzo,Farah,Gita,Helmi,Idris,June,Katya,Luis,Malik,Noor,Otto,Pari,Ren,Saira,Tove,Una,Viktor,Yun,Zaid'.split(','));
  t.last.push(...'Aalto,Basu,Chen,Diallo,Eriksen,Farouk,Gallo,Haddad,Iversen,Jafari,Kim,Leclerc,Molina,Nasser,Okafor,Petrov,Qureshi,Rossi,Silva,Tran,Ueda,Varga,Wu,Yilmaz,Zhang,Arendt,Berg,Celik,Das,Espinoza,Fischer,Gupta,Hsu,Ibrahim,Jensen,Khan,Lind,Mensah,Novak,Osei,Pereira,Rao,Solberg,Tadesse,Vidal,Wolff,Yoon,Zoric'.split(','));
  const extraPurposes = [
    ['ceramics', 'Ceramic works', ['insulating tiles','sintered pump seals','kiln furniture','abrasion liners'], ['alumina feedstock','thermocouples','kiln elements','diamond grinding wheels'], ['Ceramic repair','Thermal inspection'], 'Batch kilns produce small runs of high-value parts. A failed firing costs weeks of work.'],
    ['medical', 'Remote infirmary', ['diagnostic consultations','cultured diagnostic reagents','trained medical rotations','sterilization services'], ['antibiotics','surgical packs','ultrasound probes','blood-test cartridges'], ['Medical stabilization','Quarantine berth'], 'Two treatment rooms share an imaging unit. Most specialist care is provided by delayed consultation.'],
    ['comms', 'Relay crew', ['message forwarding','clock synchronization','navigation fixes','archival data copies'], ['timing oscillators','optical coatings','receiver amplifiers','pointing motors'], ['Message store-and-forward','Navigation update'], 'The crew maintains alignment, clocks and archives. Bandwidth is ample; a reachable destination is not.'],
    ['salvage', 'Recovery yard', ['reclaimed cabling','tested pressure valves','salvaged avionics','certified tank sections'], ['inspection dyes','cutting wire','radiation badges','tow fittings'], ['Salvage appraisal','Basic repairs'], 'Recovered hull sections are individually tagged. Nothing enters the occupied workshop before a pressure and contamination check.'],
    ['observatory', 'Observatory', ['long-baseline measurements','transient alerts','stellar catalogs','spectral archives'], ['cryocooler parts','detector arrays','mirror-cleaning supplies','precision clocks'], ['Navigation update','Optical metrology'], 'A tiny crew maintains instruments whose baselines stretch far beyond the habitat.'],
    ['archive', 'Archive vault', ['verified records','cold data storage','contract copies','survey provenance'], ['storage media','error-correction controllers','dry-gas cartridges','rack cooling pumps'], ['Records search','Message store-and-forward'], 'The occupied module guards duplicated archives in separately shielded vaults. Retrieval can take days.'],
    ['recycling', 'Reclamation plant', ['recovered copper','distilled solvents','sorted polymer feedstock','reprocessed aluminum'], ['filter media','chemical reagents','furnace linings','gas sensors'], ['Waste processing','Water processing'], 'Waste streams are separated by origin. A contaminated shipment can shut down the whole line.'],
    ['iceworks', 'Ice-processing crew', ['purified water','oxygen feedstock','ammonia solution','volatile assay reports'], ['heated hoses','separator bearings','tank insulation','compressor seals'], ['Water processing','Ice assay'], 'A heated separation train removes grit and dissolved contaminants before any water enters storage.'],
    ['fabrication', 'Precision atelier', ['sensor housings','vacuum flanges','instrument mounts','custom pump rotors'], ['metrology standards','tool inserts','cleaning solvents','alloy billets'], ['Precision machining','Instrument repair'], 'A few specialists work to tolerances unavailable elsewhere nearby. Production is measured in parts, not tonnes.'],
    ['waystation', 'Relief waystation', ['crew accommodation','rescue standby','stored provisions','rotation coordination'], ['bedding packs','air filters','medical supplies','packaged food'], ['Short-stay bunks','Emergency shelter'], 'Empty bunks outnumber permanent staff. Most remain sealed until a vessel calls ahead.'],
    ['quarantine', 'Isolation annex', ['sample clearance','containment inspections','decontamination services','environmental assays'], ['sterile liners','test reagents','waste incinerator parts','protective clothing'], ['Quarantine berth','Sample analysis'], 'Access follows a one-way route through independently filtered compartments.'],
    ['survey', 'Prospecting office', ['claim surveys','drill logs','landing-site assessments','subsurface maps'], ['drill strings','survey batteries','seismic sensors','sample canisters'], ['Ore assay','Navigation update'], 'A map table, sample store and overworked analysis bench decide where the next expedition will land.'],
    ['construction', 'Assembly camp', ['pressure-module assembly','radiator installations','structural inspections','foundation surveys'], ['structural fasteners','welding electrodes','lift slings','joint sealant'], ['Structural repair','Machine shop'], 'The crew lives in the first completed module while erecting the rest of the installation.']
  ];
  for (const [key,label,exports,need,services,facility] of extraPurposes) t.purposes[key] = {label,exports,need,services,facility};
  const facilities = {
    mining: ['A remote drill sends cores to a small assay bench; the crew follows the seam a few meters at a time.','An ore sorter rejects almost everything it receives. Freight cost makes purity more important than volume.','A tethered crawler retrieves material while the crew supervises from a shielded module.','The valuable deposit is small enough to fit on one survey map. Access rights are more valuable than the machinery.'],
    fuel: ['Sunshades surround a tank farm. Boil-off recovery determines when fuel can be transferred.','Electrolysis stacks work only when excess power is available; the depot is rarely full.','A compact transfer manifold serves one visiting vessel at a time. Every connection is manually inspected.','The depot stores water and lets vessels perform their own processing. Cleanliness certificates are its main selling point.'],
    workshop: ['The lathe predates every current resident. Its operator keeps a private stock of replacement belts.','A pressure-test enclosure occupies half the workshop; repairs must pass before they can leave.','A communal tool crib lends equipment against a signed ledger and a deposit of useful spares.','The shop specializes in one family of pumps no longer supported by its manufacturer.'],
    trade: ['Cargo remains outside the pressure hull in numbered lockers; only paperwork and people go through the lock.','The port exchanges goods by appointment. Its market is a manifest, not a street.','A bonded cold store holds more value than the settlement’s entire inhabited structure.','A small arbitration desk settles claims before visiting crews return to separate ships.'],
    research: ['A sterile sampling corridor separates the laboratory from cramped sleeping berths.','The project is mostly automated; the crew exists to catch failures telemetry cannot diagnose.','A long-duration materials exposure rack is retrieved one specimen at a time.','Half the laboratory studies why the previous expedition’s measurements could not be reproduced.'],
    military: ['A crewed receiver validates signals from scattered autonomous sensors.','A hardened communications room has more cooling equipment than weapons.','The post keeps a small boarding team on call; its transport belongs to a civilian contractor.','An inspection office maintains an exclusion boundary most visitors never approach.'],
    agriculture: ['Fungal protein vats recycle crop residues; contamination testing occupies the senior technician.','Seed stock is stored in three separate freezers whose compressors cannot run simultaneously.','Leafy crops are a fresh-food supplement, while imported dry staples remain essential.','A nursery raises disease-screened seedlings for neighboring habitats.'],
    ceramics: ['Small vacuum furnaces make unusually pure insulating parts.','A kiln only runs once enough orders justify its power draw.','Grinding dust is collected for reuse; fresh abrasive is expensive.','Proof-tested ceramic sleeves occupy every spare shelf.'],
    medical: ['A telemedicine booth stores consultation recordings for the next communications window.','The infirmary rotates staff between sites and keeps only one practitioner permanently.','A dental chair doubles as a minor-procedure station.','Emergency cases occupy the quarantine compartment when both ordinary beds are full.'],
    comms: ['Laser terminals hand messages between moving targets using aging ephemerides.','The archive contains years of undeliverable personal correspondence.','A redundant clock occupies a separate pressure enclosure to isolate common failures.','Manual optical acquisition remains possible if the tracking computer fails.'],
    salvage: ['A fixture holds recovered propulsion assemblies while technicians certify them cold.','A mesh enclosure catches fragments during hull cutting.','Every part carries a handwritten origin tag; provenance determines insurance eligibility.','A tiny clean room tests recovered electronics before they rejoin working systems.'],
    observatory: ['A remote receiver operates during the habitat’s radio-silent shifts.','One specialist keeps a detector below its operating temperature through a failing cooling loop.','Photographic plates from an early survey are being scanned against modern observations.','A dust-monitoring station protects optics too large to replace.'],
    archive: ['The vault makes verified duplicate copies for departure on different vessels.','Index records are readable without power; the contents require a working tape drive.','A legal archive is maintained by custodians who cannot adjudicate its claims.','Some stored languages require a visiting specialist to interpret.'],
    recycling: ['A solvent distillation line supplies nearby machine shops.','A dismantling bay separates batteries before scrap reaches the furnace.','Feedstock is tagged by alloy and contamination history.','The plant accepts difficult waste in exchange for freight credit.'],
    iceworks: ['Dark chunks of excavated ice thaw in separately tested batches.','Cold traps separate volatile fractions before water reaches occupied space.','A filtration train is assembled from several incompatible generations of equipment.','The product is shipped frozen to avoid a second heating cycle.'],
    fabrication: ['The metrology room is isolated from footfalls and pump vibration.','A technician adjusts a tool by hand after every few parts.','An old optical comparator remains the final authority on dimensional accuracy.','A tiny clean bench supports an outsized inter-system reputation.'],
    waystation: ['Emergency bunks are folded into the walls of an oversized common room.','A permanently sealed reserve module can shelter a stranded crew.','The caretaker prepares only for confirmed arrivals.','A repair cradle is available, but visitors must bring tools and expertise.'],
    quarantine: ['Independent exhaust paths prevent one test compartment from contaminating another.','A small autoclave is the installation’s most closely maintained machine.','Quarantine samples travel through a transfer box too narrow for a person.','Observation cabins have private communication links and no shared circulation air.'],
    survey: ['A drill-core library preserves samples from claims that never became mines.','Field teams trade navigation updates on a battered plotting wall.','A compact seismic array is packed for its next deployment.','The office certifies landing approaches only after a crewed inspection.'],
    construction: ['Unpressurized modules are aligned with a laser before permanent joining.','The workshop fabricates adapters for components that arrived with different standards.','The final habitable module remains a stack of labeled panels.','A completed shelter is rented to travelers while construction waits for funding.']
  };
  for (const [key, p] of Object.entries(t.purposes)) p.facilities = [p.facility, ...facilities[key]];
  t.conditions.push(...[
    'The settlement has finished a difficult maintenance cycle and is cautiously accepting visitors.',
    'A long-promised resupply arrived early; there is nowhere ready to store it.',
    'Two crews use incompatible maintenance records and neither trusts the other’s sign-offs.',
    'An imported batch of sealant fails its cold-storage acceptance test.',
    'A vital specialist has announced their departure at the next transport call.',
    'An apprentice has discovered a cheaper repair that the insurer refuses to certify.',
    'The communal kitchen is closed while a failed heat exchanger is rebuilt.',
    'A memorial gathering has brought several former residents back for one rotation.',
    'A carefully conserved crop has produced its first viable seed.',
    'A departing resident wants payment in transport mass rather than currency.',
    'A new concession holder claims ownership of equipment everyone regards as communal.',
    'The settlement’s official population register is several years out of date.',
    'A quiet election has left two competing sets of access permissions.',
    'The last cargo delivery was intact, but its inspection certificate belongs to another shipment.',
    'A reserve oxygen cylinder has a counterfeit pressure-test stamp.',
    'Residents are tracing a persistent odor that none of the air sensors register.',
    'An intermittent ground fault appears only during peak power demand.',
    'The battery reserve has less capacity than the control software reports.',
    'A borrowed tool is the subject of an unexpectedly bitter dispute.',
    'An incoming family needs living space that has not yet been certified.',
    'A contractor has been paid twice, while the crew’s own wages remain overdue.',
    'An automated inventory audit lists a missing container that may never have existed.',
    'A visiting inspector is waiting for a departure that keeps slipping.',
    'The installation has inherited a legal claim no current resident understands.',
    'An old service contract obliges the settlement to assist an unpopular vessel.',
    'A resident’s private research is consuming a measurable share of communal power.',
    'The settlement has won a small contract large enough to change its next year.',
    'A pump cavitates at certain tank levels; the crew works around it using a handwritten schedule.',
    'A stored emergency suit fits no one currently assigned to exterior work.',
    'A delayed message reverses an order the crew has already completed.',
    'The departure of a neighboring crew has removed the only available backup technician.',
    'The settlement offers reduced service fees in exchange for specific spare parts.',
    'A tool-control tag has been found inside a sealed incoming food container.',
    'Residents are rehearsing evacuation after a routine drill exposed a blocked route.',
    'A private cargo locker has remained unclaimed through three crew rotations.',
    'An aging habitat segment is being emptied one compartment at a time.',
    'A lost maintenance manual has been reconstructed from several residents’ memories.',
    'A new communications protocol has made the oldest terminal unusable.',
    'The settlement is deciding whether to repair a machine or cannibalize it permanently.',
    'A scheduled outage will interrupt all nonessential services for two shifts.',
    'The next crew rotation has no replacement for the current medical officer.',
    'A resident has offered a substantial reward for an ordinary missing personal object.',
    'A small financial reserve has been spent on a part with an uncertain delivery date.',
    'A recovered recorder contains evidence relevant to a long-settled insurance claim.',
    'Everyone knows an incoming visitor, but no one will explain the tension.',
    'The crew has quietly extended its rotation to finish an unfinished job.',
    'A component vendor has gone out of business, leaving a perfectly good machine unsupported.',
    'A new arrival has practical skills the settlement needs but no recognized credentials.',
    'The internal clock system lost synchronization during a power transfer.',
    'A recently returned resident remembers a service passage absent from current plans.',
    'An unusual vibration has been isolated to a structural joint, but its cause remains unclear.',
    'The crew is testing a new filtration medium in a bypass loop before trusting it.',
    'A maintenance access panel was sealed behind newly installed storage racks.',
    'The communal emergency fund is being used to retrieve a stranded former worker.',
    'A scheduled public meal marks the settlement’s twentieth year of continuous occupation.',
    'A school-age resident is applying for a place on a distant training ship.',
    'A rescued crew has overstayed the habitat’s planned consumables margin.',
    'A quality-control sample fails only when tested by an outside laboratory.',
    'An elderly technician is recording instructions for jobs no one else has performed.',
    'A replacement controller requires more cooling than the component it replaces.',
    'The settlement is negotiating a shared spares inventory with a reluctant neighbor.',
    'A remote alarm has been dismissed as a sensor fault for too many consecutive shifts.',
    'Residents have instituted a quiet shift so a recovering patient can sleep.',
    'A cargo booking was sold twice; both claimants have arrived to collect it.',
    'A transport cooperative offers an extra call if the settlement can guarantee return cargo.',
    'A dormant ownership dispute has resurfaced after a promising assay.',
    'An old distress transmission has arrived through a delayed relay with no clear resolution.',
    'The crew is documenting a near miss before memory and embarrassment distort it.',
    'A small fire was contained, but the replacement extinguisher cartridges are scarce.',
    'A key valve can only be operated manually until a custom actuator arrives.'
  ]);
  t.quiet = ['Routine operations. The next resupply remains on schedule.','A maintenance backlog has finally been cleared; the crew has a rare free shift.','A successful delivery has restored normal consumables margins.','Shift turnover proceeds quietly. Visitors are asked not to wake the off-duty crew.','A freshly certified reserve module is ready for emergency use.','The installation is operating below capacity to preserve equipment life.','A new crew is settling into familiar routines under an experienced supervisor.','The public noticeboard mostly lists small jobs and items available for exchange.','Recent inspections found no significant faults. The crew is proud of the result.','A delayed but uneventful departure has left several spare bunks available.','The next inventory count is being conducted with unusual thoroughness.','A modest surplus has paid for improvements to the common room.'];
  t.habitats = {
    surface: ['Buried pressure modules beneath compacted regolith','A bored tunnel with separately sealed living bays','Repurposed landing hulls under a shielding berm','Low pressure domes beneath a protective rubble canopy','Prefabricated cylinders inside a reinforced excavation','A compact shaft habitat with horizontal service galleries','A partially buried vault connected to external machinery by sealed conduits','Small independent pods linked by pressure-rated passages','A rock-cut shelter lined with replaceable pressure membranes','Stacked modules inside a naturally sheltered impact hollow'],
    orbital: ['A nonrotating service spine with a tethered rotating sleep module','A compact spin habitat attached to an uncrewed docking truss','A converted transport hull with a slowly rotating habitation drum','A free-fall pressure module with an exercise centrifuge','Paired occupied modules around a short rotating arm','A shielded central refuge surrounded by unpressurized work bays','A cluster of salvage-built pressure hulls sharing one transfer lock','A single free-fall service habitat beside an external tank rack','A rotating habitation cylinder with a nonrotating cargo interface','An independently sealed crew capsule on an oversized industrial frame']
  };
  t.powers = {
    basic: ['Small fission unit; power budget tightly scheduled','Solar array with battery reserve and emergency fuel cells','Shared reactor supply through a replaceable power umbilical','Refurbished fission module operating below its original rating'],
    maintained: ['Fission power module with a separate emergency bus','Two alternating reactor units; only one normally online','Reactor supply with a battery-backed life-support circuit','Solar generation with fuel-cell reserves and load shedding'],
    specialist: ['Dedicated reactor bus for clean instrumentation power','Redundant fission modules with physically separated coolant loops','High-stability power conditioning behind a small reactor plant','Independent life-support and process-power systems']
  };
  t.abandoned = ['A controlled shutdown left tagged valves and a complete closure manifest.','Departure was orderly, but the final maintenance log ends mid-entry.','Valuable machinery was removed; empty mounts remain precisely labeled.','An unpowered refuge compartment may still hold sealed reserves.','External fittings are intact, but every pressure seal needs testing.','An evacuation notice remains pinned beside an expired return date.','Someone has visited since closure and carefully replaced the access seals.','The site was mothballed for one season and has been waiting for years.','A failed funding round left construction equipment beside unopened modules.','The surviving inventory is detailed enough to reveal exactly what has been taken.','The shutdown crew left illustrated restart instructions for whoever came next.','A warning label identifies contamination that no current survey has confirmed.'];
  const terrains = {
    rock: ['Rilles winding beneath ancient lava shields','Exposed mantle material inside a deep impact structure','Rubble aprons at the foot of steep crater walls','A bright ejecta ray crossing dark basalt','Interlocking blocks with very little fine regolith','Collapsed lava-tube roofs and sheltered cavities','Glass-rich impact melt over older bedrock','Polar craters with permanent shadow','Long parallel fractures from an ancient stress field','A battered highland cut by younger fault scarps'],
    desert: ['Salt-encrusted dry lake beds','Dust-filled channels from an earlier wet period','Layered deposits exposed in canyon walls','Dark volcanic sand around an ancient caldera','Frost-lined basins at high latitude','Cemented dunes beneath mobile surface dust','Wind-eroded mesas above a gravel plain','Buried ice exposed on a recent scarp','Sparse seasonal clouds above broad dry valleys','An old delta preserved in fine sediment'],
    ice: ['Dark organic deposits between pale crater rims','Fault-bounded blocks of unusually clean ice','Rough sublimation pits with unstable margins','Thin frost over hard, compacted ice','Concentric fractures around a large impact basin','Layered volatile deposits along a shadow boundary','A chaotic field of rotated ice blocks','Possible cryovolcanic deposits requiring closer assay','A fresh fracture exposing chemically distinct ice','Smooth plains interrupted by old crater chains'],
    temperate: ['Island chains beneath low gray cloud','Shallow inland seas surrounded by barren uplands','Seasonal snowfields feeding turbid rivers','Broad tidal flats with no confirmed complex life','Cold polar oceans and dry continental interiors','Mineral-stained lakes in tectonic basins','Deep fjords through heavily eroded highlands','A wet equatorial belt between cold deserts','Extensive carbonate shelves beneath shallow water','Glaciated mountains above wide alluvial plains'],
    greenhouse: ['Bright highlands above radar-dark lava flows','Broad volcanic rises under dense sulfurous cloud','Intersecting folds in heavily deformed crust','Impact scars partly buried by younger flows','High plateaus bounded by faulted escarpments','Dense cloud decks hiding most optical detail','Radar-bright ridges and smooth lowland basins','A nearly continuous layer of high-altitude haze','Large shield structures with uncertain recent activity','Parallel rift zones through old volcanic plains'],
    gas: ['High-latitude haze above narrow cloud bands','A long-lived oval storm larger than nearby moons','Thin rings crossed by dark gaps','A tilted magnetic field with an extended radiation belt','Irregular cloud cells around a pale equatorial band','High atmospheric haze obscuring deeper structure','A sharply bounded polar vortex','Dark belts with bright convective plumes','A dusty ring system fed by small inner moons','Seasonal changes in upper-atmosphere color']
  };
  for (const [key, entries] of Object.entries(terrains)) t.bodies[key].terrain.push(...entries);
  const resources = {
    rock:['anorthositic aluminum minerals','chromium-bearing spinel','magnesium-rich silicates','sulfide mineral pockets','impact-exposed nickel','glass suitable for aggregate','calcium-bearing regolith','polar volatile traces'],
    desert:['sulfate evaporites','subsurface brines','silica-rich deposits','copper-bearing strata','borate salts','gypsum beds','manganese oxides','deep frozen aquifers'],
    ice:['carbon dioxide ice','mixed nitrogen volatiles','hydrated silicate inclusions','methane-bearing ice','sodium salts in frozen brine','sulfur-bearing contaminants','clean shallow ice lenses','phosphorus-bearing dust'],
    temperate:['silica sand','dissolved industrial salts','phosphate-bearing sediments','iron-rich river deposits','freshwater aquifers','basaltic aggregate','magnesium salts','geothermal heat'],
    greenhouse:['atmospheric nitrogen','sulfuric aerosol feedstock','high-altitude gas samples','trace noble gases','radar-mapped metal-bearing formations'],
    gas:['atmospheric methane','ammonia traces','upper-atmosphere water compounds','isotopic assay data','magnetospheric measurements']
  };
  for (const [key, entries] of Object.entries(resources)) t.bodies[key].resources.push(...entries);
  const activities = {
    cargo:['A damaged pallet has shifted the load plan; departure mass must be recalculated.','The receiver cannot pay in the agreed currency and is offering useful spares.','The crew is waiting for an outside pressure test before accepting a tank.','A reefer container consumes most available hotel power.','The vessel is consolidating tiny shipments from several unrelated clients.','Its outbound hold is empty; the captain is quietly looking for any paying cargo.','A misrouted consignment has made the voyage unexpectedly valuable.','The crew has completed a long tow and needs several days of maintenance.','An independent surveyor is verifying the load before ownership transfers.'],
    survey:['A calibrated sensor disagrees with all archived observations.','The crew is retrieving instruments left by an earlier expedition.','An incomplete map omits an obstacle on the planned approach.','A contractor wants a second opinion on an unusually optimistic assay.','The expedition is down to its final set of clean sample containers.','A long-duration probe has gone silent just before its scheduled retrieval.','A mapping pass must be repeated because of a clock synchronization error.','The crew has recorded a natural event rarely caught at such close range.','A lander cannot return without a small but difficult repair.'],
    patrol:['The crew is inspecting safety certificates, not collecting customs fees.','The cutter is escorting an evacuation rather than enforcing a boundary.','A jurisdictional dispute limits the crew’s authority to one docking interface.','The patrol’s only boarding launch is grounded for maintenance.','A mistaken identity has delayed an entirely legitimate arrival.','The watch has been extended because no relief vessel is available.','The crew is monitoring a debris hazard and transmitting approach updates.','A civilian distress call has consumed the patrol’s remaining service time.','The vessel is showing presence while awaiting instructions that may take days.'],
    salvage:['The target’s rotation rate is increasing as trapped gas vents.','A recovered compartment remains pressurized for unknown reasons.','The salvage crew has found a registry plate that changes ownership of the wreck.','A tow fitting failed inspection after most of the work was complete.','The crew will trade a share of recovery rights for a working pump.','An insurer has imposed an observer with no practical salvage experience.','A removed component is warmer than its power state can explain.','The operation is carefully preserving a recorder for an accident inquiry.','The most useful machinery is behind a section too unstable to cut.'],
    transit:['One passenger is traveling with an unusually large allocation of personal equipment.','A relief rotation has been postponed because the replacement crew is incomplete.','The transport is carrying a patient who needs a quiet, reliable power supply.','An expired contract leaves several workers without a funded onward berth.','The captain is reconciling two versions of the passenger list.','A family is making its first move between settlements.','The ferry has seats available but no mass allowance for additional baggage.','A prolonged layover has exhausted the crew’s fresh-food supply.','The passengers have organized to negotiate a collective onward passage.']
  };
  for (const [key, entries] of Object.entries(activities)) t.fleets[key].activities.push(...entries);
  t.fleets.cargo.ships = ['small contract freighter','bulk-water carrier','container tender','refrigerated cargo ship','ore transport','tankage tender','machinery carrier','independent packet freighter'];
  t.fleets.survey.ships.push('geophysical survey craft','sample-return tender','optical survey vessel','probe deployment ship','prospecting launch','long-baseline instrument tender');
  t.fleets.patrol.ships.push('customs cutter','sensor picket','rescue cutter','escort tender','service-jurisdiction launch','range-safety vessel');
  t.fleets.salvage.ships.push('recovery barge','debris-control tug','inspection tender','hull-cutting tender','wreck survey craft','heavy tow vessel');
  t.fleets.transit.ships.push('rotation ferry','medical transport','contract passenger packet','settler transport','training vessel','short-range transfer boat');
  t.remote.push(...[
    ['Spent reflector','A thin metal-film mirror drifts beyond its intended station. Tracking it is easier than safely collecting it.','Solar infrastructure'],
    ['Silent tank farm','Insulated vessels remain on an uncrewed frame. Their contents require independent assay.','Propellant storage'],
    ['Clock buoy','A redundant time standard broadcasts a correction that disagrees with the local network.','Navigation aid'],
    ['Survey memorial','A small marker carries the names of a lost mapping crew and the final coordinates they returned.','Memorial'],
    ['Pressure test frame','An abandoned industrial rig still holds a prototype habitat segment.','Engineering site'],
    ['Cargo scatter','Several sealed containers follow slightly different paths. Their recovery requires separate rendezvous.','Lost freight'],
    ['Dust monitor','An automated instrument measures debris too small for routine radar detection.','Safety infrastructure'],
    ['Unclaimed tug','A utility vessel answers status queries but reports no crew.','Derelict craft'],
    ['Thermal calibration target','A controlled reference source remains useful despite its overdue servicing date.','Scientific infrastructure'],
    ['Fragment train','Old collision debris repeatedly crosses a useful approach corridor.','Navigation hazard'],
    ['Retired antenna','A large dish has been left intact as a future source of structural metal.','Salvage target'],
    ['Sealed experiment','A long-duration biological experiment was designed to remain unopened. The custodial institution no longer exists.','Research payload'],
    ['Emergency transmitter','A hand-triggered beacon sent one brief call and then exhausted its battery.','Unresolved signal'],
    ['Claim marker','A licensed beacon identifies a mineral claim that has never been worked.','Concession boundary'],
    ['Radiation shelter','Water-shielded emergency berths remain accessible through a manual lock.','Emergency shelter'],
    ['Test article','A discarded propulsion demonstrator still contains instrumented tanks.','Engineering relic'],
    ['Transfer truss','A long framework once moved cargo between vessels too large to dock directly.','Freight infrastructure'],
    ['Detached radiator','A fragile panel assembly carries signs of a hurried separation.','Debris'],
    ['Remote gravimeter','An isolated sensor package has produced a slowly drifting baseline for years.','Scientific instrument'],
    ['Cold cargo locker','A privately registered store contains sealed consignments for recipients who have moved on.','Unclaimed storage'],
    ['Broken transponder','A periodic identification burst gives a valid registration with impossible voyage dates.','Registry anomaly'],
    ['Old rescue cradle','A docking fixture built for an obsolete hull standard remains in good mechanical condition.','Rescue infrastructure'],
    ['Unstaffed workshop','Tools and replacement parts are available under a cooperative access agreement.','Service cache'],
    ['Long-range laser terminal','Its optics are intact but the pointing drive needs calibration.','Communications relay'],
    ['Contaminated module','A clearly marked exclusion notice records a chemical spill in an otherwise useful pressure hull.','Restricted salvage'],
    ['Witness recorder','An independent traffic recorder holds the only continuous record of a disputed incident.','Legal evidence'],
    ['Instrument graveyard','Retired probes have been collected into one catalogued disposal region.','Controlled debris field'],
    ['Material exposure rack','Hundreds of labeled samples document years of vacuum and radiation exposure.','Research installation'],
    ['Slowly venting tank','A minor leak has changed the tank’s predicted path enough to matter.','Approach hazard'],
    ['Last-call mailbox','A relay stores outbound messages awaiting a vessel headed in the right direction.','Message cache'],
    ['Private anchorage','An uncrewed mooring and stores rack are maintained by a small transport cooperative.','Fleet anchorage'],
    ['Reference mass','A dense, carefully tracked object provides a calibration target for local navigation equipment.','Survey reference'],
    ['Unfinished habitat','An empty shell has shielding but no installed life support.','Mothballed construction'],
    ['Range marker','A retired test-range beacon continues to advertise a restriction whose authority is unclear.','Exclusion boundary'],
    ['Lost sample carrier','The return capsule missed its collection window; the samples may still be useful.','Scientific recovery']
  ]);
  t.connections = [
    '{a} and {b} share emergency stores. A missed transfer forces both to defer nonessential work.',
    '{a} holds the only spare pressure pump compatible with equipment at {b}. It is a loan, not a gift.',
    '{a} and {b} exchange a medical practitioner on alternating rotations. Neither can spare the post permanently.',
    '{a} buys reclaimed water from {b}; recent assay discrepancies have slowed acceptance.',
    '{a} stores cargo for {b}. The arrangement works until two departures need the same transfer slot.',
    '{a} and {b} are pooling funds for a replacement comms terminal. They disagree on who should maintain it.',
    '{a} provides a trained relief crew to {b} when the regular transport fails to arrive.',
    '{a} and {b} use different connector standards. A small stock of adapters keeps their exchange possible.',
    '{a} inherited an old debt to {b}. Repayment is measured in machine hours.',
    '{a} and {b} coordinate emergency shelter capacity before accepting outside visitors.',
    '{a} keeps duplicate records for {b}; the archive is physically carried between sites.',
    '{a} and {b} share ownership of a service launch that spends much of its time awaiting parts.',
    '{a} sends difficult repairs to {b}. Return freight often costs more than the repair itself.',
    '{a} and {b} have agreed to preserve different spares, reducing duplication but increasing dependence.',
    '{a} rents unused pressure-rated storage to {b} under an informal agreement.',
    '{a} and {b} compete for the same rare transport calls. Neither can fill a freighter alone.',
    '{a} and {b} maintain a mutual evacuation pact with fewer available bunks than either would like.',
    '{a} is training a technician for {b}. The trainee has become indispensable before the rotation ends.',
    '{a} and {b} share a purchasing contract whose minimum order exceeds their annual needs.',
    '{a} is holding a shipment intended for {b} until the recipient resolves an insurance claim.',
    '{a} and {b} preserve separate copies of a navigation survey and compare changes by courier.',
    '{a} and {b} alternate responsibility for an unstaffed emergency cache.',
    '{a} and {b} disagree over responsibility for maintaining a shared beacon.',
    '{a} is considering consolidation with {b}; the savings would come at the cost of independence.'
  ];
  t.navigation = [
    'The co-axial approach is well surveyed, but the latest timing solution arrived by courier.',
    'A skip-route beacon is in backup mode. Incoming crews are advised to verify its clock independently.',
    'The departure corridor is clear. No vessel is scheduled to carry outbound messages this rotation.',
    'Recent arrivals report a small, consistent offset from the published skip solution. The survey office has issued a correction.',
    'The usual skip approach is temporarily restricted while a damaged transport clears the corridor.',
    'An old transit solution remains usable, but no current operator will certify it without a fresh probe pass.',
    'Two independent navigation beacons disagree. Crews are waiting for an instrument vessel to resolve the discrepancy.',
    'A long-unused skip route has been reopened by a private expedition that is selling its survey.',
    'Outbound traffic is sharing navigation fixes to reduce duplicated survey work.',
    'The public navigation record is current. Local crews still retain older fixes as a fallback.',
    'A damaged skip transmitter is being run at reduced duty cycle. Its signal is available on a published schedule.',
    'A visiting survey crew has placed temporary approach markers with a short service life.',
    'The safest transit corridor leads to an inconvenient transfer point well beyond the inhabited sites.',
    'A remote relay is carrying traffic advisories while the primary beacon undergoes repair.',
    'The last arrival brought a new set of approach charts; validation is underway.',
    'A transport cooperative keeps its own co-axial route record and shares it only with contributing crews.',
    'A minor debris crossing has shifted the preferred assembly area away from the main beacon.',
    'A scheduled navigation outage is posted. The nearest replacement clock is several calls away.',
    'The local approach remains open, but outbound pilots are advised to carry additional independent fixes.',
    'Navigation coverage is adequate. Rescue coverage beyond the beacon is strictly best effort.'
  ];
  Object.assign(t.governments, {
    syndicate: ['Worker syndicate', 'Shift delegate'],
    family: ['Household compact', 'Senior custodian'],
    leasehold: ['Collective leasehold', 'Lease steward'],
    municipal: ['Settlement assembly', 'Assembly clerk'],
    contractor: ['Service concession', 'Contract manager'],
    custodial: ['Custodial trust', 'Appointed custodian'],
    partnership: ['Resident partnership', 'Managing partner'],
    commons: ['Mutual-aid compact', 'Duty coordinator'],
    receivership: ['Creditor administration', 'Receiver'],
    expedition: ['Expedition charter', 'Mission lead'],
    guild: ['Technical guild', 'Senior technician'],
    port: ['Independent port authority', 'Harbor master']
  });
})();
