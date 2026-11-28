// Build with: node tools/train-lines.mjs /private/main.txt /private/poetry.txt
// The inputs stay outside the site. Only validated cross-passage edges are shipped.
import fs from 'node:fs';

const [mainPath, poetryPath] = process.argv.slice(2);
if (!mainPath || !poetryPath) throw new Error('Supply the main corpus and poetry excerpts.');
const main = fs.readFileSync(mainPath, 'utf8').trimEnd();
const poetry = fs.readFileSync(poetryPath, 'utf8').trim().split(/\n+/);
const raw = [main, ...poetry].join('\n');
const firstPoem = main.split('\n').length;
const states = new Map(), verbs = new Set(), originals = new Set(), sentences = [];

// Closed-class words help distinguish an unfinished clause from a legal junction.
// Lexical words remain open so distant passages can introduce unexpected imagery.
function slot(word) {
  if (/^[,;:.!?—]$/.test(word)) return 'punctuation';
  if (/^(and|or|but|yet|nor|so)$/.test(word)) return 'conjunction';
  if (/^(the|a|an|each|every|this|that|these|those|my|your|his|her|its|their|our)$/.test(word)) return 'determiner';
  if (/^(i|he|she|they|we|you|it)$/.test(word)) return 'subject';
  if (/^(in|on|of|from|for|at|over|under|into|through|with|without|by|behind|beside|to)$/.test(word)) return 'preposition';
  if (/^(is|are|was|were|be|been|being|have|has|had|do|does|did|could|would|should|will|can|may|might|must)$/.test(word)) return 'auxiliary';
  if (/ing$/.test(word)) return 'participle';
  return 'lexical';
}

const clean = raw.normalize('NFC').replace(/[’‘]/g, "'").replace(/[‑‐]/g, '-');
// Include even fragments and untrainable lines in the verbatim-copy check.
const sourceText = ' ' + clean.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim() + ' ';
const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
for (const [passage, line] of clean.split(/\r?\n/).entries()) {
  for (const { segment } of segmenter.segment(line.trim().replace(/^“(.*)”$/, '$1'))) {
    const sentence = segment.trim();
    if (!/^[A-ZÉ]/u.test(sentence) || !/[.!?]$/.test(sentence)) continue;
    if (/https?:|[@<>{}\[\]"“”()|/]|\d{2,}/.test(sentence)) continue;
    const tokens = sentence.match(/[\p{L}]+(?:['-][\p{L}]+)*|[,;:—.!?]/gu) || [];
    const keys = tokens.map(word => word.toLowerCase());
    for (let i = 1; i < keys.length; i++) {
      if (/^(?:he|she|they|we|i)$/.test(keys[i - 1]) && slot(keys[i]) === 'lexical' && !/ly$/.test(keys[i])) {
        verbs.add(keys[i]);
      }
    }
    const normalized = keys.join(' ');
    if (keys.length < 5 || keys.length > 52 || originals.has(normalized)) continue;
    originals.add(normalized);
    const source = { tokens, keys, passage };
    sentences.push(source);
    for (let end = 2; end < keys.length - 2; end++) {
      for (let order = 2; order <= Math.min(5, end); order++) {
        const key = keys.slice(end - order, end).join(' ');
        if (!states.has(key)) states.set(key, []);
        states.get(key).push({source, end});
      }
    }
  }
}
function join(tokens) {
  return tokens.join(' ').replace(/\s+([,;:.!?])/g, '$1').replace(/\s*—\s*/g, '—');
}

const prefixes = [], suffixes = [], groups = [];
const startsByText = new Map(), endsByText = new Map(), seen = new Set();
function add(left, right, first, second) {
  const start = join(left), end = join(right);
  const text = join([...left, ...right]);
  const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  if (text.length > 115 || seen.has(normalized) || sourceText.includes(' '+normalized+' ')) return;
  seen.add(normalized);
  const startKey = first + " " + start;
  const endKey = second + " " + end;
  if (!startsByText.has(startKey)) {
    startsByText.set(startKey,prefixes.length);
    prefixes.push([start,first]); groups.push([]);
  }
  if (!endsByText.has(endKey)) {
    endsByText.set(endKey,suffixes.length);
    suffixes.push([end,second]);
  }
  groups[startsByText.get(startKey)].push(endsByText.get(endKey));
}

function bridge(key, a, b) {
  const order = key.split(' ').length;
  if (Math.abs(a.source.passage - b.source.passage) < 4 || a.end - order < 2) return;
  if (slot(a.source.keys[a.end]) !== slot(b.source.keys[b.end])) return;
  const left = a.source.tokens.slice(0, a.end);
  const right = b.source.tokens.slice(b.end);
  const tokens = [...left, ...right];
  const words = tokens.join(' ').toLowerCase();
  if (words === a.source.keys.join(' ') || originals.has(words)) return;
  if (tokens.length < 8 || tokens.length > 22 || words.length > 115) return;
  // A short shared state can be a grammatical hinge ("under the", "began to").
  // Bare articles or pronouns make much less reliable hand-offs.
  if (order === 2 && !/\b(?:of|in|on|under|over|into|through|from|with|like|for|at|as|to|by|was|is|were|are|had|have|felt|my|your|its)\b/.test(key)) return;
  if (/^(?:although|because|while|when|unless|if|as soon as)\b/i.test(words) && !words.includes(',')) return;
  const phrase = words.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  if (sourceText.includes(' ' + phrase + ' ')) return;
  // Both passages must supply a substantial stretch outside the shared hinge.
  if (Math.min(a.end - order, right.length - 1) < Math.max(2, tokens.length * .19)) return;
  const vocabulary = words.match(/[\p{L}'-]+/gu);
  const finite = vocabulary.some(w => verbs.has(w) || slot(w) === 'auxiliary' || /(?:ed|n't)$/.test(w));
  if (!finite) return;
  if (/\b(?:of|to|with|from|the|an|a|my|your|its) (?:and|or|but)\b/.test(words)) return;
  const content = vocabulary.filter(w => w.length > 3);
  const repeats = content.length - new Set(content).size;
  if (repeats > 1 || /\b(\w+) \1\b/.test(words)) return;
  add(left, right, a.source.passage, b.source.passage);
}

for (const [key, visits] of states) {
  if (visits.length < 2 || !/\p{L}/u.test(key)) continue;
  const starts = visits.filter(v => v.end >= 4 && v.end <= 11);
  const ends = visits.filter(v => v.source.keys.length - v.end >= 3 && v.source.keys.length - v.end <= 10);
  for (const a of starts) for (const b of ends) {
    if (a.source.passage < firstPoem && b.source.passage < firstPoem) bridge(key, a, b);
  }
}

// Short poems rarely have long repeated n-grams. At clause boundaries, back off
// to an observed punctuation or function-word state with a compatible complement.
const clauseSubject = /^(i|you|he|she|we|they|it|the|his|her|my|a|an)$/;
for (const poem of sentences.filter(s => s.passage >= firstPoem)) {
  let pivot = poem.keys.indexOf(';');
  if (pivot < 0) pivot = poem.keys.indexOf('until');
  if (pivot < 0 && poem.keys.includes('than')) pivot = poem.keys.indexOf('than') + 1;
  if (pivot < 0) pivot = poem.keys.indexOf(',');
  if (pivot < 1) throw new Error('Missing grammatical hinge in poetry input.');
  const hinge = poem.keys[pivot], prefix = poem.tokens.slice(0,pivot+1);
  for (const donor of sentences) {
    if (donor.passage >= firstPoem || poem.passage - donor.passage < 4) continue;
    for (let i = 2; i < donor.keys.length-2; i++) {
      if (donor.keys[i] !== hinge) continue;
      const tail = donor.keys.slice(i+1,-1);
      if (tail.some(w => /^[,;:—.!?]$/.test(w))) continue;
      if (hinge === 'the') {
        if (tail.length > 3 || !tail.every(w => slot(w)==='lexical' && !verbs.has(w))) continue;
      } else {
        if (tail.length < 2 || tail.length > 9 || !clauseSubject.test(tail[0])) continue;
        if (hinge === ',' && !/^(?:i|he|she|we|it|they|you)$/.test(tail[0])) continue;
        if (!tail.slice(1).some(w => verbs.has(w) || slot(w)==='auxiliary' || /ed$/.test(w))) continue;
      }
      add(prefix, donor.tokens.slice(i+1), poem.passage, donor.passage);
    }
  }
}
for (let i=0; i<poetry.length; i++) {
  if (!prefixes.some(([,id])=>id===firstPoem+i)) throw new Error('Poetry excerpt has no compatible continuations.');
}
const graph = {prefixes,suffixes,groups,firstPoem};
fs.writeFileSync(new URL('../assets/data/line-model.js',import.meta.url),
  'globalThis.lineModel = '+JSON.stringify(graph)+';\n');
console.log(prefixes.length+' opening states, '+seen.size+' cross-passage transitions.');
