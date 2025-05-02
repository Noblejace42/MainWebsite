/* markovscript.js — v5 “Template + POS‑Swap Wisdom” */

(async () => {
  /* —————————————————— DOM —————————————————— */
  const quoteEl = document.getElementById('markovQuote');
  const btn     = document.getElementById('regenerateBtn');

  /* —————————————————— HELPERS —————————————————— */
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  const cap1 = str => str.charAt(0).toUpperCase() + str.slice(1);
  const tidy = str => str
    .replace(/\s+([,;:.!?])/g,'$1')
    .replace(/\s+/g,' ')
    .trim();

  /* —————————————————— LOAD & BUILD POS BUCKETS —————————————————— */
  const text = await fetch('emersonmarkovchain.txt').then(r => r.text());
  const sents = RiTa.sentences(text);
  const buckets = { Noun: new Set(), Verb: new Set(), Adjective: new Set(), Adverb: new Set() };

  sents.forEach(s => {
    s.split(/\s+/).forEach(tok => {
      const w = tok.replace(/[^\w']/g, '');
      if (!w) return;
      const info = nlp(w).terms().json()[0];
      if (!info?.tags) return;
      info.tags.forEach(tag => {
        if (buckets[tag]) buckets[tag].add(w.toLowerCase());
      });
    });
  });
  // turn sets into arrays
  Object.keys(buckets).forEach(k => buckets[k] = [...buckets[k]]);

  /* —————————————————— TEMPLATES —————————————————— */
  const templates = [
    '{Noun} of the {Adjective} {Noun}',
    'Never {Verb} without {Verbing} the {Noun}',
    'Trust the {Adjective} {Noun}',
    'Silence is the loudest {Noun}',
    'Embrace {Adjective} {Noun}',
    '{Noun} feeds on {Noun}',
    'Your {Noun} is your {Noun}',
    'Don’t {Verb} the {Noun} too soon',
    'Every {Noun} hides a {Adjective} {Noun}',
    'Beware the {Adjective} {Noun}'
  ];

  /* —————————————————— GERUND HELPER —————————————————— */
  function toGerund(v) {
    if (v.endsWith('ie')) return v.slice(0, -2) + 'ying';
    if (v.endsWith('e'))  return v.slice(0, -1) + 'ing';
    return v + 'ing';
  }

  /* —————————————————— FILL A TEMPLATE —————————————————— */
  function fillTemplate(tpl) {
    return tpl.replace(/\{(\w+)\}/g, (_, tag) => {
      if (tag === 'Noun' && buckets.Noun.length) {
        return rand(buckets.Noun);
      }
      if (tag === 'Verb' && buckets.Verb.length) {
        return rand(buckets.Verb);
      }
      if (tag === 'Adjective' && buckets.Adjective.length) {
        return rand(buckets.Adjective);
      }
      if (tag === 'Adverb' && buckets.Adverb.length) {
        return rand(buckets.Adverb);
      }
      if (tag === 'Verbing' && buckets.Verb.length) {
        return toGerund(rand(buckets.Verb));
      }
      return tag;
    });
  }

  /* —————————————————— POS‑SWAP PASS —————————————————— */
  function posSwap(str) {
    return str.replace(/\b\w+\b/g, word => {
      const w = word.toLowerCase();
      const info = nlp(w).terms().json()[0];
      if (!info?.tags) return word;

      if (info.tags.includes('Noun') && Math.random() < 0.5 && buckets.Noun.length) {
        return rand(buckets.Noun);
      }
      if (info.tags.includes('Verb') && Math.random() < 0.5 && buckets.Verb.length) {
        return rand(buckets.Verb);
      }
      if (info.tags.includes('Adjective') && Math.random() < 0.5 && buckets.Adjective.length) {
        return rand(buckets.Adjective);
      }
      if (info.tags.includes('Adverb') && Math.random() < 0.5 && buckets.Adverb.length) {
        return rand(buckets.Adverb);
      }
      return word;
    });
  }

  /* —————————————————— GENERATE A WISDOM NUGGET —————————————————— */
  function generateWisdom() {
    // Choose a random template
    let line = fillTemplate(rand(templates));
    // Clean up whitespace/punctuation
    line = tidy(line);
    // Swap ~50% of tagged words
    line = posSwap(line);
    // Capitalize & ensure end punctuation
    line = cap1(line);
    if (!/[.!?]$/.test(line)) line += '.';
    return line;
  }

  /* —————————————————— HOOK UP BUTTON & INIT —————————————————— */
  btn.removeAttribute('disabled');
  btn.addEventListener('click', () => {
    quoteEl.textContent = generateWisdom();
  });
  quoteEl.textContent = generateWisdom();
})();
