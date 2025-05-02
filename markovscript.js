// markovscript.js

document.addEventListener('DOMContentLoaded', () => {
  // === Globals ===
  let chains = {};
  let words = [];

  // === Build the Markov model ===
  function buildModel(text) {
    // Clean up the text and split into words
    words = text
      .replace(/\r\n/g, ' ')
      .replace(/[.,;:!?()"“”‘’]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);

    // Build a mapping: word → [possible next words]
    chains = {};
    for (let i = 0; i < words.length - 1; i++) {
      const w = words[i];
      const next = words[i + 1];
      if (!chains[w]) chains[w] = [];
      chains[w].push(next);
    }
  }

  // === Generate a quote ===
  function generateQuote(maxWords = 30) {
    if (words.length === 0) return 'Corpus not loaded yet.';
    // Pick a random starting word
    let current = words[Math.floor(Math.random() * words.length)];
    const output = [current];

    for (let i = 1; i < maxWords; i++) {
      const possibilities = chains[current];
      if (!possibilities || possibilities.length === 0) {
        // If we hit a dead end, pick any random word
        current = words[Math.floor(Math.random() * words.length)];
      } else {
        current = possibilities[Math.floor(Math.random() * possibilities.length)];
      }
      output.push(current);
    }

    return output.join(' ');
  }

  // === Display a quote in the DOM ===
  function displayQuote() {
    const el = document.getElementById('markovQuote');
    el.textContent = generateQuote();
  }

  // === Fetch the corpus and initialize ===
  fetch('emersonmarkovchain.txt')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(text => {
      buildModel(text);
      displayQuote();
    })
    .catch(err => {
      console.error('Error loading corpus:', err);
      document.getElementById('markovQuote').textContent =
        'Error loading corpus.';
    });

  // === Wire up the regenerate button ===
  const regenBtn = document.getElementById('regenerateBtn');
  regenBtn.addEventListener('click', displayQuote);
});

