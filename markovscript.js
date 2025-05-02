/* markovscript.js  —  v6  “QuipForge Pro”  —  2025‑05‑02
   Generates tight 5‑8‑word jokes from emersonmarkovchain.txt
   Drop this next to index.html and the corpus file.
*/
(() => {
  if (window.__quipForgeLoaded__) return;           // prevent double‑load
  window.__quipForgeLoaded__ = true;

  /*  ======  CONFIG  ======  */
  const CORPUS_FILE   = 'emersonmarkovchain.txt';
  const MIN_WORDS     = 5;
  const MAX_WORDS     = 8;
  const MAX_ATTEMPTS  = 25;
  const RECENT_LIMIT  = 25;
  const STOP_TAIL     = new Set(['the','and','to','of','for','with']);

  /*  ======  DOM  ======  */
  const BOX = document.getElementById('markovQuote');
  const BTN = document.getElementById('regenerateBtn');

  /*  ======  STATE  ======  */
  const chain   = new Map();   // trigram: key "w1 w2" → [w3…]
  const starts  = [];          // valid sentence beginnings
  const recent  = [];          // duplicate filter

  /*  ======  INIT  ======  */
  BTN.addEventListener('click', () => {
    if (!chain.size) { fetchCorpus(); return; }
    BOX.textContent = generateQuote() || fallback();
  });

  fetchCorpus();

  /*  ======  FUNCTIONS  ======  */

  function fetchCorpus() {
    fetch(CORPUS_FILE)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(text => {
        buildChain(text);
        BOX.textContent = generateQuote() || fallback();
      })
      .catch(err => {
        console.error('QuipForge Pro | corpus load error:', err);
        BOX.textContent = fallback();
      });
  }

  // ---------- build trigram chain ----------
  function buildChain(raw) {
    chain.clear(); starts.length = 0;

    const tokens = raw.replace(/\r?\n+/g,' ').split(/\s+/);

    // array of {word, boundary}
    const words = [];
    tokens.forEach(tok => {
      const boundary = /[.!?]$/.test(tok);
      const clean = tok.toLowerCase().replace(/[^a-z]/g,'');
      if (
        clean.length > 1 &&
        !clean.includes('http') &&
        !clean.includes('com') &&
        !clean.includes('@')
      ) {
        words.push({word: clean, boundary});
      }
    });

    for (let i = 0; i < words.length - 2; i++) {
      const key = words[i].word + ' ' + words[i+1].word;
      const next = words[i+2].word;
      (chain.get(key) || chain.set(key,[]).get(key)).push(next);
      if (i === 0 || words[i].boundary) starts.push(key);
    }

    console.info(`QuipForge Pro | chain size: ${chain.size}, starts: ${starts.length}`);
  }

  // ---------- quote generator ----------
  function generateQuote() {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {

      /* --- 1. Seed --- */
      let key = choice(starts);
      let [w1, w2] = key.split(' ');
      let out = [capitalise(w1), w2];

      /* --- 2. Grow sentence --- */
      while (out.length < MAX_WORDS) {
        const opts = chain.get(key);
        if (!opts || !opts.length) break;
        const next = choice(opts);
        out.push(next);
        if (out.length >= MIN_WORDS && Math.random() < 0.55) break;
        key = out[out.length-2] + ' ' + out[out.length-1];
      }

      /* --- 3. Cleanup --- */
      out = tidy(out);

      /* --- 4. Validation & dedupe --- */
      if (out.length >= MIN_WORDS && out.length <= MAX_WORDS) {
        const quote = out.join(' ') + randomPunct();
        if (!recent.includes(quote)) {
          recent.push(quote);
          if (recent.length > RECENT_LIMIT) recent.shift();
          return quote;
        }
      }
    }
    return '';
  }

  // ---------- helpers ----------
  function tidy(arr) {
    // drop trailing stop‑word
    while (arr.length && STOP_TAIL.has(arr[arr.length-1])) arr.pop();
    // collapse immediate duplicates
    return arr.filter((w,i,a)=> i===0 || w!==a[i-1])
              .map((w,i)=> i===0 && w==='i' ? 'I' : w); // capitalise lone i
  }

  const capitalise = s => s.charAt(0).toUpperCase()+s.slice(1);
  const choice     = a => a[Math.random()*a.length|0];
  const puncts     = ['.','!','?'];
  const randomPunct= () => puncts[Math.random()*puncts.length|0];

  const fallback   = () => 'Stay curious; drink good coffee.';
})();
