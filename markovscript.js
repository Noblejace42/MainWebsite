/* markovscript.js — v3 “deep tricks” */

(async () => {
  /* —————————————————— CONFIG —————————————————— */
  const TEXT_URL        = 'emersonmarkovchain.txt';
  const ORDERS          = [3, 2, 1];          // fallback chain depths
  const MAX_SENTENCES   = 4;
  const MAX_WORDS_SENT  = 40;
  const REPETITION_GAP  = 5;                  // words between dup checks
  const THEMES          = ['default', 'question', 'exclaim'];

  /* —————————————————— DOM —————————————————— */
  const quoteEl   = document.getElementById('markovQuote');
  const btn       = document.getElementById('regenerateBtn');
  const seedInput = document.getElementById('seedText');       // optional
  const themeSel  = document.getElementById('themeSelect');    // optional

  /* —————————————————— UTILS —————————————————— */
  const rand    = arr => arr[Math.floor(Math.random() * arr.length)];
  const cap1    = s => s.charAt(0).toUpperCase() + s.slice(1);
  const tidy    = s => s.replace(/\s+([,;:.!?])/g,'$1').replace(/\s+/g,' ').trim();
  const last    = arr => arr[arr.length-1];

  /* —————————————————— BUILD RAW CORPUS —————————————————— */
  const corpus     = await fetch(TEXT_URL).then(r => r.text());
  const sentences  = RiTa.splitSentences(corpus);

  /* —————————————————— BUILD MULTI‑ORDER CHAINS —————————————————— */
  const chains = {}; // {order => Map}
  ORDERS.forEach(o => chains[o] = new Map());

  for (const sent of sentences) {
    const words = sent.split(/\s+/);
    ORDERS.forEach(order => {
      for (let i = 0; i <= words.length - order; i++) {
        const key  = words.slice(i, i+order).join(' ').toLowerCase();
        const next = words[i+order] ?? null;
        const bucket = chains[order].get(key) ?? [];
        bucket.push(next);
        chains[order].set(key,bucket);
      }
    });
  }

  /* —————————————————— GENERATORS —————————————————— */
  function nextToken(context) {
    for (const order of ORDERS) {
      const key = context.slice(-order).join(' ').toLowerCase();
      const opts = chains[order].get(key);
      if (opts && opts.length) return rand(opts);
    }
    return null; // dead end
  }

  function pruneRepetition(arr) {
    const window = new Set();
    return arr.filter(w => {
      const low = w.toLowerCase();
      if (window.has(low)) return false;
      window.add(low);
      if (window.size > REPETITION_GAP) window.delete(Array.from(window)[0]);
      return true;
    });
  }

  function applyTheme(text, theme) {
    if (theme === 'question') return text.replace(/\.$/, '?');
    if (theme === 'exclaim')  return text.replace(/\.$/, '!');
    return text;
  }

  function generateSentence(seedWords=[]) {
    if (!seedWords.length) {
      do {
        seedWords = rand(sentences)
          .split(/\s+/)
          .filter(w => /^[A-Za-z]/.test(w))
          .slice(0, ORDERS[0]);
      } while (seedWords.length < ORDERS[0]);
    }

    const words = [...seedWords];

    while (words.length < MAX_WORDS_SENT) {
      const nxt = nextToken(words);
      if (!nxt) break;
      words.push(nxt);
      if (/[.!?]$/.test(nxt) && words.length > ORDERS[0] + 3) break;
    }

    const cleaned = tidy(pruneRepetition(words).join(' '));
    return cap1(/[.!?]$/.test(cleaned) ? cleaned : cleaned + '.');
  }

  function generateParagraph() {
    const seed     = seedInput?.value.trim();
    const seedArr  = seed ? seed.split(/\s+/).slice(0, ORDERS[0]) : [];
    const theme    = themeSel?.value || 'default';
    const n        = 1 + Math.floor(Math.random()*MAX_SENTENCES);

    const out = [];
    for (let i=0;i<n;i++){
      out.push(generateSentence(i===0?seedArr:[]));
    }
    return applyTheme(out.join(' '), theme);
  }

  /* —————————————————— RENDER —————————————————— */
  function refresh() { quoteEl.textContent = generateParagraph(); }

  btn.removeAttribute('disabled');
  btn.addEventListener('click', refresh);
  refresh();
})();
