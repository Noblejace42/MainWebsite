/* markovscript.js — v3 “deep tricks” with UMD RiTa */

// immediately‑invoked async wrapper so we can await fetch()
(async () => {
  /* —————————————————— CONFIG —————————————————— */
  const TEXT_URL        = 'emersonmarkovchain.txt';  // your corpus file
  const ORDERS          = [3, 2, 1];                  // fallback n‑gram depths
  const MAX_SENTENCES   = 4;                          // max lines per quote
  const MAX_WORDS_SENT  = 40;                         // cap per sentence
  const REPETITION_GAP  = 5;                          // no echoing within this window

  /* —————————————————— DOM HOOKUP —————————————————— */
  const quoteEl   = document.getElementById('markovQuote');
  const btn       = document.getElementById('regenerateBtn');
  const seedInput = document.getElementById('seedText');    // optional seed field
  const themeSel  = document.getElementById('themeSelect'); // optional tone selector

  /* —————————————————— HELPERS —————————————————— */
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  const cap1 = str => str.charAt(0).toUpperCase() + str.slice(1);
  const tidy = s => s
    .replace(/\s+([,;:.!?])/g, '$1')  // fix spaces before punctuation
    .replace(/\s+/g, ' ')             // collapse whitespace
    .trim();

  /* —————————————————— LOAD & PARSE CORPUS —————————————————— */
  const corpus    = await fetch(TEXT_URL).then(r => r.text());
  const sentences = RiTa.sentences(corpus);  // ← correct UMD call

  /* —————————————————— BUILD MULTI‑ORDER CHAINS —————————————————— */
  const chains = {};
  ORDERS.forEach(o => chains[o] = new Map());

  sentences.forEach(sent => {
    const words = sent.split(/\s+/);
    ORDERS.forEach(order => {
      for (let i = 0; i <= words.length - order; i++) {
        const key = words.slice(i, i + order).join(' ').toLowerCase();
        const next = words[i + order] || null;
        const bucket = chains[order].get(key) || [];
        bucket.push(next);
        chains[order].set(key, bucket);
      }
    });
  });

  /* —————————————————— TOKEN GENERATION —————————————————— */
  function nextToken(context) {
    // try highest‑order first, fallback down
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
        // remove the oldest entry
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

  /* —————————————————— SENTENCE & PARAGRAPH MAKERS —————————————————— */
  function generateSentence(seedWords = []) {
    // pick a random starter if none provided
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
      // early stop on punctuation
      if (/[.!?]$/.test(nxt) && words.length > ORDERS[0] + 3) break;
    }

    const line = tidy(pruneRepetition(words).join(' '));
    return cap1(/[.!?]$/.test(line) ? line : line + '.');
  }

  function generateParagraph() {
    const rawSeed = seedInput?.value.trim() || '';
    const seedArr = rawSeed ? rawSeed.split(/\s+/).slice(0, ORDERS[0]) : [];
    const theme   = themeSel?.value || 'default';
    const lines   = 1 + Math.floor(Math.random() * MAX_SENTENCES);

    const out = [];
    for (let i = 0; i < lines; i++) {
      out.push(generateSentence(i === 0 ? seedArr : []));
    }
    return applyTheme(out.join(' '), theme);
  }

  /* —————————————————— INITIALIZE & RENDER —————————————————— */
  function refresh() {
    quoteEl.textContent = generateParagraph();
  }

  btn.removeAttribute('disabled');
  btn.addEventListener('click', refresh);
  refresh();
})();
