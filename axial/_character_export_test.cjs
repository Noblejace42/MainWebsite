// Run with node axial/_character_export_test.cjs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const printed = {};
const context = {
  TextEncoder, Blob,
  document: {
    title: 'Axial',
    createElement() { return {}; },
    head: { append() {} },
    body: { append(article) { printed.html = article.innerHTML; }, classList: { add() {} } }
  },
  addEventListener() {}, print() {}
};
context.window = context;
for (const file of ['powerdata.js', 'power-text.js', 'character-export.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context);
}

// The client produces uncompressed UTF-8 Open Packaging Convention parts.
function parts(bytes) {
  const files = new Map();
  let offset = 0;
  while (bytes.readUInt32LE(offset) === 0x04034b50) {
    const byteCount = bytes.readUInt32LE(offset + 18);
    const nameEnd = offset + 30 + bytes.readUInt16LE(offset + 26);
    const start = nameEnd + bytes.readUInt16LE(offset + 28);
    files.set(bytes.toString('utf8', offset + 30, nameEnd), bytes.toString('utf8', start, start + byteCount));
    offset = start + byteCount;
  }
  return files;
}

function wordMarkers(numbering, document) {
  const abstracts = new Map([...numbering.matchAll(/<w:abstractNum w:abstractNumId="(\d+)">[\s\S]*?<w:lvlText w:val="([^"]+)"/g)]
    .map(m => [m[1], m[2]]));
  const lists = new Map([...numbering.matchAll(/<w:num w:numId="(\d+)"><w:abstractNumId w:val="(\d+)"/g)]
    .map(m => [m[1], abstracts.get(m[2])]));
  return [...document.matchAll(/<w:numId w:val="(\d+)"/g)].map(m => lists.get(m[1]));
}

(async () => {
  const catalog = Array.from(context.AXIAL_POWER_LIBRARY);
  const sheet = { name: 'Export check', powers: catalog, vitals: { Health: '18 / 18' } };
  const official = catalog.flatMap(p => Array.from(p.body));
  const bullets = official.filter(p => p.kind === 'ul');
  const expected = bullets.map(p => p.marker === '-' ? '-' : '•');
  const italic = official.flatMap(p => p.runs || []).filter(r => r.italic).length;
  assert.ok(expected.includes('-') && expected.includes('•'));
  context.AxialCharacterExport.print(sheet);
  const rendered = [...printed.html.matchAll(/<ul([^>]*)>([\s\S]*?)<\/ul>/g)].flatMap(([, style, items]) =>
    [...items.matchAll(/<li>/g)].map(() => style.includes('list-style-type:') ? '-' : '•'));
  assert.deepEqual(rendered, expected, 'Print and clipboard list renderer preserves the original marker sequence');
  for (const controls of [true, false]) {
    const blob = context.AxialCharacterExport.wordFile(sheet, { controls });
    const files = parts(Buffer.from(await blob.arrayBuffer()));
    const xml = files.get('word/document.xml');
    assert.deepEqual(wordMarkers(files.get('word/numbering.xml'), xml), expected, 'Word and Drive list definitions preserve the original markers');
    assert.equal(xml.includes('<w:sdtPr>'), controls);
    const paragraphs = [...xml.matchAll(/<w:p>([\s\S]*?)<\/w:p>/g)].map(m => m[1]);
    const effects = paragraphs.filter(p => p.includes('<w:pStyle w:val="Normal"/>')).join('');
    assert.equal([...effects.matchAll(/<w:i\/>/g)].length, italic, 'Effect emphasis is retained');
  }
  console.log('Power formatting and edit controls passed for print, Word and Drive import.');
})().catch(err => { console.error(err); process.exitCode = 1; });
