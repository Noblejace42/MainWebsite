// markovscript.js — vFinal “Sure‑Fire Quips”
(() => {
  if (window.__quipForgeLoaded__) return;
  window.__quipForgeLoaded__ = true;

  const BOX      = document.getElementById('markovQuote');
  const BTN      = document.getElementById('regenerateBtn');
  const CORPUS   = 'emersonmarkovchain.txt'; 
  const MIN_WORDS = 5, MAX_WORDS = 8;
  const MAX_TRIES = 15;
  const chain    = new Map();
  const starts   = [];
  const recent   = [];

  // Kick it off
  init();

  // If user clicks before init finishes, retry init
  BTN.addEventListener('click', () => {
    if (!chain.size) init();
    BOX.textContent = craft() || fallback();
  });

  function init() {
    console.log('Fetching corpus from', CORPUS);
    fetch(CORPUS)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(txt => {
        const words = preprocess(txt);
        buildChain(words);
        BOX.textContent = craft();
      })
      .catch(err => {
        console.error('Could not load corpus:', err);
        BOX.textContent = 'Wisdom is unavailable right now.';
      });
  }

  // Clean out junk, return array of tidy words
  function preprocess(raw) {
    return raw
      .replace(/\r?\n+/g, ' ')
      .replace(/([.?!])/g, ' $1 ')
      .split(/\s+/)
      .map(w => w.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g,''))
      .filter(w =>
        w.length > 1 &&
        /^[a-z.?!] +$/.test(w) === false && // no stray punctuation-only tokens
        !/\d/.test(w) &&
        !w.includes('http') &&
        !w.includes('.com') &&
        !w.includes('@')
      );
  }

  // Build an order‑2 chain + sentence‑start keys
  function buildChain(words) {
    chain.clear();
    starts.length = 0;
    for (let i = 0; i < words.length - 2; i++) {
      const key = `${words[i]} ${words[i + 1]}`;
      const nxt = words[i + 2];
      if (!/^[a-z]+$/.test(nxt)) continue;
      (chain.get(key) || chain.set(key, []).get(key)).push(nxt);
      if (i === 0 || /[.?!]/.test(words[i])) {
        starts.push(key);
      }
    }
    console.log('Chain built with', chain.size, 'keys and', starts.length, 'start phrases.');
  }

  // Generate a 5–8 word quote
  function craft() {
    if (!chain.size) return '';

    for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
      let key = pick(starts);
      const [w1, w2] = key.split(' ');
      const out = [capitalize(w1), w2];

      // expand up to MAX_WORDS
      while (out.length < MAX_WORDS) {
        const opts = chain.get(key);
        if (!opts) break;
        const nxt = pick(opts);
        out.push(nxt);
        // early stop once min is reached ~50% chance
        if (out.length >= MIN_WORDS && Math.random() < 0.5) break;
        key = `${out[out.length - 2]} ${out[out.length - 1]}`;
      }

      if (isValid(out)) {
        const line = out.join(' ') + '.';
        if (!recent.includes(line)) {
          recent.push(line);
          if (recent.length > 20) recent.shift();
          return line;
        }
      }
    }

    return ''; // signal fallback
  }

  function isValid(arr) {
    return (
      arr.length >= MIN_WORDS &&
      arr.length <= MAX_WORDS &&
      /^[a-z]{2,}$/.test(arr[arr.length - 1])
    );
  }

  function fallback() {
    return 'Stay curious; drink good coffee.';
  }

  // Utilities
  const pick       = arr => arr[Math.random() * arr.length | 0];
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
})();
