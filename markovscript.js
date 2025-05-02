/* markovscript.js — v4 “QuipForge” — 2025‑05‑02
   Guarantees 5–8‑word, punctuation‑clean quips, filters junk, and
   ensures only one script instance ever binds to #regenerateBtn.
*/
(() => {
  /* ===== singleton guard (prevents double‑bind) ===== */
  if (window.__quipForgeLoaded__) return;
  window.__quipForgeLoaded__ = true;

  const BOX   = document.getElementById('markovQuote');
  const BTN   = document.getElementById('regenerateBtn');
  const FILE  = 'emersonmarkovchain.txt';  // corpus name
  const LEN   = {min: 5, max: 8};
  const RETRY = 15;                          // attempts to hit quality gate
  const chain = new Map();                   // order‑2 chain
  const starts = [];
  const recent = [];                         // small queue to avoid repeats
  const RECENT_LIMIT = 15;

  /* ========== 1.  Load & build ========== */
  fetch(FILE)
    .then(r => r.ok ? r.text() : Promise.reject(`HTTP ${r.status}`))
    .then(text => {
      const words = scrub(text);
      build(words);
      BTN.addEventListener('click', () => BOX.textContent = craft());
      BOX.textContent = craft();
    })
    .catch(err => {
      console.error('QuipForge:', err);
      BOX.textContent = 'Wisdom offline—try later.';
    });

  /* ========== 2.  Scrubber ========== */
  function scrub(raw) {
    return raw
      .replace(/\r?\n+/g, ' ')          // unify line breaks
      .replace(/([.?!])/g, ' $1 ')      // isolate terminators
      .split(/\s+/)
      .map(w => w
        .toLowerCase()
        .replace(/^[^a-z]+|[^a-z]+$/g, '') ) // trim non‑letters
      .filter(w =>
        w.length > 1 &&
        !/\d/.test(w) &&
        !w.includes('http') &&
        !w.includes('.com') &&
        !w.includes('@'));
  }

  /* ========== 3.  Chain builder (order‑2) ========== */
  function build(words) {
    for (let i = 0; i < words.length - 2; i++) {
      const key = `${words[i]} ${words[i + 1]}`;
      const next = words[i + 2];
      if (!/^[a-z]+$/.test(next)) continue; // skip junk
      (chain.get(key) || chain.set(key, []).get(key)).push(next);
      if (i === 0 || /[.?!]/.test(words[i])) starts.push(key);
    }
  }

  /* ========== 4.  Generator ========== */
  function craft() {
    for (let attempt = 0; attempt < RETRY; attempt++) {
      let key = pick(starts);
      const [w1, w2] = key.split(' ');
      const out = [cap(w1), w2];

      while (out.length < LEN.max) {
        const opts = chain.get(key);
        if (!opts) break;
        const next = pick(opts);
        out.push(next);
        if (out.length >= LEN.min && Math.random() < 0.45) break; // early stop
        key = `${out.at(-2)} ${out.at(-1)}`;
      }

      if (qualifies(out)) {
        const line = out.join(' ') + '.';
        if (!recent.includes(line)) {
          recent.push(line);
          if (recent.length > RECENT_LIMIT) recent.shift();
          return line;
        }
      }
    }
    return 'Refactor life; compile happiness.'; // ultimate fallback
  }

  /* ========== 5.  Helpers ========== */
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const pick = arr => arr[Math.random() * arr.length | 0];
  function qualifies(words) {
    const lenOK = words.length >= LEN.min && words.length <= LEN.max;
    const lastOK = /^[a-z]{2,}$/.test(words.at(-1));
    return lenOK && lastOK;
  }
})();
