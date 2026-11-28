// A vault is a directory of UTF-8 Markdown files. Store them in a standard ZIP.
(() => {
  'use strict';
  const limits = {A: 3, B: 2, C: 2};

  function build(seed, settings = {}) {
    const G = globalThis.AxialSystems;
    const random = G.rng(seed + ':skips');
    const pick = items => items[Math.floor(random() * items.length)];
    const systems = [];
    const used = new Set();
    const degree = [];
    for (let i = 0; i < 100; i++) {
      const systemSeed = 'G' + (i + 1) + '-' + Math.floor(random() * 0x100000000).toString(36);
      let system = G.generate({...settings, name: '', seed: systemSeed});
      if (used.has(system.name)) {
        system = G.generate({...settings, seed: systemSeed, name: system.name + ' ' + (i + 1)});
      }
      used.add(system.name);
      system.routes = [];
      systems.push(system);
      degree.push({A: 0, B: 0, C: 0});
    }
    function connect(i, j, type) {
      const days = 1 + Math.floor(random() * 10);
      const route = {type, days, unstable: false};
      systems[i].routes.push({...route, destination: systems[j].name});
      systems[j].routes.push({...route, destination: systems[i].name});
      degree[i][type]++;
      degree[j][type]++;
    }
    // Attach each new system to the connected component before adding shortcuts.
    const types = Object.keys(limits);
    for (let i = 1; i < systems.length; i++) {
      const type = i <= 3 ? types[i - 1] : pick(types);
      const parents = [];
      for (let j = 0; j < i; j++) if (degree[j][type] < limits[type]) parents.push(j);
      // Even a chain cannot exhaust all endpoints of a degree-two route type.
      connect(i, pick(parents), type);
    }
    for (const type of types) {
      const targets = degree.map(d => Math.max(d[type], Math.floor(random() * (limits[type] + 1))));
      for (let i = 0; i < systems.length; i++) {
        while (degree[i][type] < targets[i]) {
          const linked = new Set(systems[i].routes.map(r => r.destination));
          const possible = systems.map((s, j) => j).filter(j =>
            i !== j && degree[j][type] < targets[j] && !linked.has(systems[j].name));
          if (!possible.length) break;
          connect(i, pick(possible), type);
        }
      }
    }
    for (const s of systems) s.routes.sort((a,b) => a.type.localeCompare(b.type) || a.destination.localeCompare(b.destination));
    return systems;
  }

  function notes(seed, systems) {
    const G = globalThis.AxialSystems;
    const files = new Map();
    const root = 'Axial Galaxy/';
    const sorted = [...systems].sort((a,b) => a.name.localeCompare(b.name));
    files.set(root + 'Galaxy Index.md', [
      '# Galaxy Index', '', 'Seed: ' + seed.replace(/[\r\n]/g, ' '), '',
      ...sorted.map(s => '- [[' + s.name + ']]')
    ].join('\n'));
    for (const s of systems) {
      const lines = ['# ' + s.name, '', '[[Galaxy Index]]', '',
        (s.conditions || []).join(' · ') || 'No unusual system conditions.', '',
        '## Axial skips', '', '| Destination | Type | Navigator CR | Travel | Drive (skip Fuel) |',
        '| --- | --- | --- | --- | --- |'];
      for (const r of s.routes) {
        const [, travel, cr, drives] = G.routeFacts(r).map(pair => pair[1]);
        lines.push('| [[' + r.destination + ']] | ' + r.type + ' | ' + cr + ' | ' + travel + ' | ' + drives + ' |');
      }
      lines.push('', '## Worlds and settlements');
      function site(x) {
        lines.push('', '#### ' + x.name + ' (' + x.location + ')', '',
          ...G.siteBrief(x).map(([k,v]) => '- **' + k + '** · ' + v));
      }
      for (const b of s.bodies) {
        lines.push('', '### ' + b.name, '', b.biome || b.terrain);
        s.settlements.filter(x => x.bodyId === b.id).forEach(site);
      }
      const deep = s.settlements.filter(x => !x.bodyId);
      if (deep.length) { lines.push('', '### Deep space'); deep.forEach(site); }
      lines.push('', '> [!info]- Full system survey', ...G.toText(s).trimEnd().split('\n').map(line => '> ' + (line ? '    ' + line : '')), '');
      files.set(root + 'Systems/' + s.name + '.md', lines.join('\n'));
    }
    files.set(root + '.obsidian/app.json', '{}\n');
    return files;
  }

  const crcTable = Uint32Array.from({length:256}, (_, n) => {
    for (let bit = 0; bit < 8; bit++) n = (n >>> 1) ^ ((n & 1) ? 0xedb88320 : 0);
    return n >>> 0;
  });
  function zip(files) {
    const encoder = new TextEncoder(), local = [], directory = [];
    let offset = 0, directorySize = 0;
    function header(size) {
      const bytes = new Uint8Array(size), view = new DataView(bytes.buffer);
      return {bytes, u16:(at,n) => view.setUint16(at,n,true), u32:(at,n) => view.setUint32(at,n,true)};
    }
    for (const [path, text] of files) {
      const name = encoder.encode(path), data = encoder.encode(text);
      let crc = 0xffffffff;
      for (const b of data) crc = (crc >>> 8) ^ crcTable[(crc ^ b) & 255];
      crc = (crc ^ 0xffffffff) >>> 0;
      const file = header(30), index = header(46);
      file.u32(0,0x04034b50); file.u16(4,20); file.u16(6,0x800); file.u16(12,33);
      file.u32(14,crc); file.u32(18,data.length); file.u32(22,data.length); file.u16(26,name.length);
      index.u32(0,0x02014b50); index.u16(4,20); index.u16(6,20); index.u16(8,0x800); index.u16(14,33);
      index.u32(16,crc); index.u32(20,data.length); index.u32(24,data.length); index.u16(28,name.length); index.u32(42,offset);
      local.push(file.bytes,name,data); directory.push(index.bytes,name);
      offset += 30 + name.length + data.length; directorySize += 46 + name.length;
    }
    const end = header(22);
    end.u32(0,0x06054b50); end.u16(8,files.size); end.u16(10,files.size); end.u32(12,directorySize); end.u32(16,offset);
    return new Blob([...local,...directory,end.bytes], {type:'application/zip'});
  }
  globalThis.AxialGalaxy = {build, notes, zip};
})();
