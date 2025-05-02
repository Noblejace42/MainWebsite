/* markovscript.js  –  v3 “Sharper, Snarkier, Self‑Cleaning” ★ 2025‑05‑02
   Drop this next to index.html, keeping the corpus file name identical:
   →  Emerson Markov Chain.txt
   Generates 5–8‑word quips, order‑2 chain, deep cleanup, duplicate‑avoid,
   light grammatical polish, and one‑click regeneration.
*/
(() => {
  const BOX   = document.getElementById('markovQuote');
  const BTN   = document.getElementById('regenerateBtn');
  const FILE  = 'emersonmarkovchain.txt';              // <<— corpus
  const LEN   = {min: 5, max: 8};                       // word count
  const RETRY = 10;                                     // max attempts

  /* ========== 1.  Corpus → order‑2 chain ========== */
  const chain = new Map();      // key: "w1 w2"  →  [w3,…]
  const starts = [];            // sentence‑initial “w1 w2”

  fetch(FILE)
    .then(r => r.ok ? r.text() : Promise.reject(r.status))
    .then(text => {
      const words = preprocess(text);
      buildChain(words);
      BOX.textContent = makeQuote();                  // first hit
      BTN.onclick = () => BOX.textContent = makeQuote();
    })
    .catch(err => {
      console.error('Markov error:', err);
      BOX.textContent = 'Wisdom temporarily unavailable.';
    });

  /* ========== 2.  Helpers ========== */

  // rigorous scrubbing + split
  function preprocess(raw) {
    return raw
      // replace newlines with space; isolate punctuation
      .replace(/\r?\n+/g, ' ')
      .replace(/([.?!,;:])/g, ' $1 ')
      .split(/\s+/)

      // uniform lowercase & trim edge garbage
      .map(w => w.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, ''))

      // filters: ≥2 letters, no digits, no urls/emails
      .filter(w => w.length > 1 && !/\d/.test(w) && !w.includes('http') && !w.includes('.com') && !w.includes('@'));
  }

  function buildChain(words){
    for (let i = 0; i < words.length - 2; i++){
      const [w1, w2, w3] = [words[i], words[i+1], words[i+2]];
      if (!/^[a-z]+$/.test(w3)) continue;           // skip weird tokens
      const key = `${w1} ${w2}`;
      (chain.get(key) || chain.set(key, []).get(key)).push(w3);

      // start key if w1 starts a sentence
      if (i === 0 || /[.?!]/.test(words[i-1])) starts.push(key);
    }
  }

  /* ========== 3.  Generator ========== */
  const recent = new Set();      // avoid immediate duplicates

  function makeQuote(){
    for (let attempt = 0; attempt < RETRY; attempt++){
      let key = rand(starts);
      let [w1, w2] = key.split(' ');
      const out = [cap(w1), w2];
      while (out.length < LEN.max){
        const opts = chain.get(key);
        if (!opts) break;
        const next = rand(opts);
        out.push(next);
        if (out.length >= LEN.min && (Math.random() < 0.4 || out.length === LEN.max)) break;
        key = `${out[out.length-2]} ${out[out.length-1]}`;
      }
      // sanity:  length / dups / stray punctuation
      if (ok(out)) {
        const line = out.join(' ') + '.';
        if (!recent.has(line)){
          recent.add(line);
          if (recent.size > 12) recent.delete([...recent][0]); // keep cache small
          return line;
        }
      }
    }
    return 'Embrace uncertainty, iterate with coffee.'; // fallback
  }

  /* ========== 4.  Utility ========== */
  const rand = arr => arr[Math.random()*arr.length|0];

  const cap  = s => s.charAt(0).toUpperCase() + s.slice(1);

  function ok(words){
    const last = words[words.length-1];
    return words.length >= LEN.min && words.length <= LEN.max && /^[a-z]{2,}$/.test(last);
  }
})();
