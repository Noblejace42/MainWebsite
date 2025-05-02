/* markovscript.js — v2 */

(async () => {
  /* -----------------------------------------------------------
     CONFIG
  ----------------------------------------------------------- */
  const TEXT_URL   = 'emersonmarkovchain.txt'; // keep your source file here
  const ORDER      = 1;                        // 2‑gram Markov chain
  const MAX_WORDS  = 20;                       // per sentence cap

  /* -----------------------------------------------------------
     DOM HOOK‑UP
  ----------------------------------------------------------- */
  const quoteEl = document.getElementById('markovQuote');
  const btn     = document.getElementById('regenerateBtn');

  /* -----------------------------------------------------------
     UTILITIES
  ----------------------------------------------------------- */
  const rand   = arr => arr[Math.floor(Math.random() * arr.length)];
  const cap1   = str => str.charAt(0).toUpperCase() + str.slice(1);
  const tidy   = s   => s
      .replace(/\s+([,.;!?])/g, '$1')   // trim spaces before punct
      .replace(/\s+/g, ' ')             // collapse whitespace
      .trim();

  /* -----------------------------------------------------------
     BUILD CHAIN
  ----------------------------------------------------------- */
  const corpus      = await fetch(TEXT_URL).then(r => r.text());
  const rawSentences= corpus.replace(/\s+/g, ' ')
                            .split(/(?<=[.!?])\s+/);

  // map key → list of possible next tokens
  const chain = new Map();
  for (const sent of rawSentences) {
    const words = sent.split(/\s+/);
    for (let i = 0; i <= words.length - ORDER; i++) {
      const key  = words.slice(i, i + ORDER).join(' ').toLowerCase();
      const next = words[i + ORDER] ?? null;
      (chain.get(key) ?? chain.set(key, []).get(key)).push(next);
    }
  }

  /* -----------------------------------------------------------
     GENERATION
  ----------------------------------------------------------- */
  function generateSentence() {
    // pick a random seed that starts with a capital letter
    let seedWords;
    do { seedWords = rand(rawSentences).split(/\s+/).slice(0, ORDER); }
    while (!/^[A-Z]/.test(seedWords[0]));

    const words = [...seedWords];

    while (words.length < MAX_WORDS) {
      const key = words.slice(-ORDER).join(' ').toLowerCase();
      const options = chain.get(key);
      if (!options || options.length === 0) break;

      const next = rand(options);
      if (!next) break;

      words.push(next);

      if (/[.!?]$/.test(next) && words.length > ORDER + 2) break; // end early
    }

    let sentence = words.join(' ');
    if (!/[.!?]$/.test(sentence)) sentence += '.';
    return cap1(tidy(sentence));
  }

  function generateParagraph() {
    const numSentences = 1 + Math.floor(Math.random() * 3); // 1‑3 sentences
    return Array.from({ length: numSentences }, generateSentence).join(' ');
  }

  /* -----------------------------------------------------------
     RENDER
  ----------------------------------------------------------- */
  function refreshQuote() { quoteEl.textContent = generateParagraph(); }

  btn.removeAttribute('disabled');
  btn.addEventListener('click', refreshQuote);
  refreshQuote(); // initial load
})();
