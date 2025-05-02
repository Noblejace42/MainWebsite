/* markovscript.js — v2 “snappier quotes” */

window.onload = () => {
  const quoteBox = document.getElementById('markovQuote');
  const regenBtn  = document.getElementById('regenerateBtn');

  // second‑order chain: key = "word1 word2", value = [possible word3]
  const chain = new Map();
  let starts = [];

  /* ---------- BUILD MODEL ---------- */
  fetch('Emerson Markov Chain.txt')
    .then(r => r.ok ? r.text() : Promise.reject(r.statusText))
    .then(raw => {
      const words = raw
        .replace(/\r?\n/g, ' ')
        .split(/\s+/)
        .map(w => w
          .replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '') // trim junk edges
          .toLowerCase())
        .filter(w =>
          w.length > 1 &&               // toss single letters
          !/\d/.test(w) &&              // no digits
          !w.includes('http') &&
          !w.includes('.com') &&
          !w.includes('@'));

      // build order‑2 chain
      for (let i = 0; i < words.length - 2; i++) {
        const key = words[i] + ' ' + words[i + 1];
        const next = words[i + 2];
        if (!chain.has(key)) chain.set(key, []);
        chain.get(key).push(next);
        // remember possible sentence starts
        if (i === 0 || /[.!?]/.test(words[i])) starts.push(key);
      }

      quoteBox.textContent = generateQuote();
    })
    .catch(err => {
      console.error('Markov load error:', err);
      quoteBox.textContent = 'Could not load wisdom.';
    });

  /* ---------- GENERATOR ---------- */
  function generateQuote() {
    const desiredLen = 5 + Math.random() * 3 | 0; // 5‑8 words
    for (let attempt = 0; attempt < 8; attempt++) {
      let key = starts[Math.random() * starts.length | 0];
      let [w1, w2] = key.split(' ');
      const out = [capitalise(w1), w2];

      while (out.length < desiredLen) {
        const opts = chain.get(key);
        if (!opts || !opts.length) break;
        const next = opts[Math.random() * opts.length | 0];
        out.push(next);
        key = out[out.length - 2] + ' ' + out[out.length - 1];
      }

      // simple quality check: right length & last word is clean
      const last = out[out.length - 1];
      if (out.length >= 5 && out.length <= 8 && /^[a-z]{2,}$/.test(last)) {
        return out.join(' ') + '.';
      }
    }
    return 'Stay curious, question everything.'; // fallback
  }

  /* ---------- HELPERS ---------- */
  function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  /* ---------- UI ---------- */
  regenBtn.onclick = () => { quoteBox.textContent = generateQuote(); };
};
