// markovscript.js
window.onload = () => {
  const quoteBox = document.getElementById('markovQuote');
  const regenBtn  = document.getElementById('regenerateBtn');

  let corpusWords = [];
  let chain = {};

  /* ---- fetch corpus ---- */
  fetch('emersonmarkovchain.txt')           //  <‑‑ exact filename
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then(text => {
      buildModel(text);
      quoteBox.textContent = generate(28);
    })
    .catch(err => {
      console.error('Markov corpus load error:', err);
      quoteBox.textContent = 'Could not load corpus.';
    });

  /* ---- build model ---- */
  function buildModel(txt){
    corpusWords = txt
      .replace(/\r?\n/g, ' ')
      .replace(/[.,;:!?()“”'"`]/g,'')
      .split(/\s+/)
      .filter(Boolean);

    chain = {};
    for (let i = 0; i < corpusWords.length - 1; i++){
      const w = corpusWords[i], next = corpusWords[i + 1];
      (chain[w] ||= []).push(next);
    }
  }

  /* ---- generator ---- */
  function generate(max = 30){
    if (!corpusWords.length) return 'Corpus not ready.';
    let word = corpusWords[Math.random() * corpusWords.length | 0];
    const out = [word];
    for (let i = 1; i < max; i++){
      const options = chain[word];
      word = options ? options[Math.random() * options.length | 0]
                     : corpusWords[Math.random() * corpusWords.length | 0];
      out.push(word);
    }
    return out.join(' ') + '.';
  }

  /* ---- button ---- */
  regenBtn.addEventListener('click', () => quoteBox.textContent = generate(28));
};
