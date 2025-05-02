/* markovscript.js — v5 “QuipForge Solid” — 2025‑05‑02
   Place alongside index.html + emersonmarkovchain.txt
*/
(() => {
  if (window.__quipForgeLoaded__) return;          // singleton guard
  window.__quipForgeLoaded__ = true;

  const BOX   = document.getElementById('markovQuote');
  const BTN   = document.getElementById('regenerateBtn');
  const FILE  = 'emersonmarkovchain.txt';          // corpus file
  const MIN   = 5, MAX = 8;                        // word count bounds
  const TRIES = 20;                                // gen attempts
  const RECENT_LIMIT = 20;

  const chain  = new Map();   // order‑2 Markov chain
  const starts = [];          // valid sentence‑start keys
  const recent = [];          // prevent near duplicates

  /* ---------- bootstrap ---------- */
  loadCorpus();

  BTN.addEventListener('click', () => {
    if (!chain.size) loadCorpus();      // retry if load failed
    BOX.textContent = craft() || fallback();
  });

  /* ---------- load & build ---------- */
  function loadCorpus() {
    fetch(FILE)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(text => {
        buildModel(text);
        BOX.textContent = craft();
      })
      .catch(err => {
        console.error('QuipForge: corpus load failed:', err);
        BOX.textContent = fallback();
      });
  }

  /* ---------- preprocessing & model ---------- */
  function buildModel(raw) {
    chain.clear(); starts.length = 0;

    const tokens = raw.replace(/\r?\n+/g, ' ').split(/\s+/);

    // We'll keep cleaned words here
    const words = [];

    tokens.forEach(tok => {
      const endsSentence = /[.!?]$/.test(tok);
      // strip all non‑letters
      const clean = tok.toLowerCase().replace(/[^a-z]/g, '');
      if (
        clean.length > 1 &&
        !clean.includes('http') &&
        !clean.includes('com') &&
        !clean.includes('@')
      ) {
        words.push({ word: clean, boundary: endsSentence });
      }
    });

    // Build order‑2 chain
    for (let i = 0; i < words.length - 2; i++) {
      const key  = `${words[i].word} ${words[i + 1].word}`;
      const next = words[i + 2].word;
      (chain.get(key) || chain.set(key, []).get(key)).push(next);

      // if the first token begins sentence OR previous token was boundary ⇒ start
      if (i === 0 || words[i].boundary) starts.push(key);
    }
    console.log(`QuipForge: chain built with ${chain.size} keys`);
  }

  /* ---------- quote generator ---------- */
  function craft() {
    if (!chain.size) return '';

    for (let attempt = 0; attempt < TRIES; attempt++) {
      let key = pick(starts);
      const [w1, w2] = key.split(' ');
      const out = [cap(w1), w2];

      while (out.length < MAX) {
        const options = chain.get(key);
        if (!options || !options.length) break;

        const next = pick(options);
        out.push(next);

        // 50 % chance to stop once >= MIN
        if (out.length >= MIN && Math.random() < 0.5) break;

        key = `${out[out.length - 2]} ${out[out.length - 1]}`;
      }

      if (isValid(out)) {
        const line = out.join(' ') + '.';
        if (!recent.includes(line)) {
          recent.push(line);
          if (recent.length > RECENT_LIMIT) recent.shift();
          return line;
        }
      }
    }
    return '';  // signal fallback
  }

  /* ---------- helpers ---------- */
  const pick = arr => arr[Math.random() * arr.length | 0];
  const cap  = s => s.charAt(0).toUpperCase() + s.slice(1);

  function isValid(arr) {
    return (
      arr.length >= MIN &&
      arr.length <= MAX &&
      /^[a-z]{2,}$/.test(arr[arr.length - 1])
    );
  }

  const fallback = () => 'Stay curious; drink good coffee.';
})();
