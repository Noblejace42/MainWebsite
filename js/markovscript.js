/* markovscript.js — v4 “deep tricks + POS swapping” */

(async () => {
  /* —————————————————— CONFIG —————————————————— */
  const TEXT_URL        = 'emersonmarkovchain.txt';  // corpus
  const ORDERS          = [3, 2, 1];                  // fallback n‑gram depths
  const MAX_SENTENCES   = 4;                          // lines per quote
  const MAX_WORDS_SENT  = 40;                         // words per line
  const REPETITION_GAP  = 5;                          // no echo within N

  /* —————————————————— DOM HOOKUP —————————————————— */
  const quoteEl   = document.getElementById('markovQuote');
  const btn       = document.getElementById('regenerateBtn');
  const seedInput = document.getElementById('seedText');    // optional
  const themeSel  = document.getElementById('themeSelect'); // optional

  /* —————————————————— HELPERS —————————————————— */
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  const cap1 = s   => s.charAt(0).toUpperCase() + s.slice(1);
  const tidy = s   => s
    .replace(/\s+([,;:.!?])/g,'$1')
    .replace(/\s+/g,' ')
    .trim();

  /* —————————————————— LOAD & TOKENIZE —————————————————— */
  const corpus    = await fetch(TEXT_URL).then(r => r.text());
  const sentences = RiTa.sentences(corpus);   // UMD RiTa API

  /* —————————————————— BUILD N‑GRAM CHAINS —————————————————— */
  const chains = {};
  ORDERS.forEach(o => chains[o] = new Map());
  sentences.forEach(sent => {
    const words = sent.split(/\s+/);
    ORDERS.forEach(order => {
      for (let i = 0; i <= words.length - order; i++) {
        const key  = words.slice(i, i + order).join(' ').toLowerCase();
        const next = words[i + order] || null;
        const bucket = chains[order].get(key) || [];
        bucket.push(next);
        chains[order].set(key, bucket);
      }
    });
  });

  /* —————————————————— BUILD POS BUCKETS —————————————————— */
  const posBuckets = {
    Noun: new Set(),
    Verb: new Set(),
    Adjective: new Set(),
    Adverb: new Set()
  };
  sentences.forEach(sent => {
    sent.split(/\s+/).forEach(token => {
      const clean = token.replace(/[^\w']/g, '');
      if (!clean) return;
      const info = nlp(clean).terms().json()[0];
      if (!info || !info.tags) return;
      info.tags.forEach(tag => {
        if (posBuckets[tag]) posBuckets[tag].add(clean.toLowerCase());
      });
    });
  });
  // finalize arrays
  Object.keys(posBuckets).forEach(tag => {
    posBuckets[tag] = Array.from(posBuckets[tag]);
  });

  /* —————————————————— POS‑SWAP FUNCTION —————————————————— */
  function posSwap(text) {
    return text.replace(/\b\w+\b/g, word => {
      const lower = word.toLowerCase();
      const info  = nlp(lower).terms().json()[0];
      if (!info || !info.tags) return word;

      if (info.tags.includes('Noun') && Math.random() < 0.5 && posBuckets.Noun.length) {
        return rand(posBuckets.Noun);
      }
      if (info.tags.includes('Verb') && Math.random() < 0.5 && posBuckets.Verb.length) {
        return rand(posBuckets.Verb);
      }
      if (info.tags.includes('Adjective') && Math.random() < 0.5 && posBuckets.Adjective.length) {
        return rand(posBuckets.Adjective);
      }
      if (info.tags.includes('Adverb') && Math.random() < 0.5 && posBuckets.Adverb.length) {
        return rand(posBuckets.Adverb);
      }
      return word;
    });
  }

  /* —————————————————— MARKOV GENERATION —————————————————— */
  function nextToken(context) {
    for (const order of ORDERS) {
      const key = context.slice(-order).join(' ').toLowerCase();
      const opts = chains[order].get(key);
      if (opts && opts.length) return rand(opts);
    }
    return null;
  }

  function pruneRepetition(arr) {
    const seen = new Set();
    return arr.filter(w => {
      const lw = w.toLowerCase();
      if (seen.has(lw)) return false;
      seen.add(lw);
      if (seen.size > REPETITION_GAP) {
        const it = seen.values();
        seen.delete(it.next().value);
      }
      return true;
    });
  }

  function applyTheme(text, theme) {
    if (theme === 'question') return text.replace(/\.$/, '?');
    if (theme === 'exclaim')  return text.replace(/\.$/, '!');
    return text;
  }

  function generateSentence(seedWords = []) {
    if (!seedWords.length) {
      do {
        seedWords = rand(sentences).split(/\s+/).slice(0, ORDERS[0]);
      } while (seedWords.length < ORDERS[0] || !/^[A-Za-z]/.test(seedWords[0]));
    }

    const words = [...seedWords];
    while (words.length < MAX_WORDS_SENT) {
      const nxt = nextToken(words);
      if (!nxt) break;
      words.push(nxt);
      if (/[.!?]$/.test(nxt) && words.length > ORDERS[0] + 3) break;
    }

    const line = tidy(pruneRepetition(words).join(' '));
    return cap1(/[.!?]$/.test(line) ? line : line + '.');
  }

  function generateParagraph() {
    const rawSeed = seedInput?.value.trim() || '';
    const seedArr = rawSeed.split(/\s+/).slice(0, ORDERS[0]);
    const theme   = themeSel?.value || 'default';
    const lines   = 1 + Math.floor(Math.random() * MAX_SENTENCES);

    const out = [];
    for (let i = 0; i < lines; i++) {
      out.push(generateSentence(i === 0 ? seedArr : []));
    }
    return applyTheme(out.join(' '), theme);
  }

  /* —————————————————— RENDER & SWAP —————————————————— */
  function refresh() {
    let quote = generateParagraph();
    quote     = posSwap(quote);
    quoteEl.textContent = quote;
  }

  btn.removeAttribute('disabled');
  btn.addEventListener('click', refresh);
  refresh(); // initial fill
})();
