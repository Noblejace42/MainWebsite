/* markovscript.js — v7.1 “QuipForge Pro+” — 2025‑05‑02
   Implements n‑gram smoothing, POS filters, candidate rerank,
   temperature sampling, alliteration/rhyme boosts, corpus pruning,
   plus a stub hook for “deep polish.”
*/
(() => {
  if (window.__quipForgeLoaded__) return;
  window.__quipForgeLoaded__ = true;

  // —— CONFIG ——
  const CORPUS_FILE    = 'emersonmarkovchain.txt';
  const MIN_WORDS      = 5, MAX_WORDS = 8;
  const CANDIDATES     = 8;
  const MAX_ATTEMPTS   = 20;
  const RECENT_LIMIT   = 30;
  const TEMPERATURE    = 1.2;    // >1 more random, <1 more conservative
  const PRUNE_THRESHOLD= 2;      // drop n‑grams with <2 occurrences
  const STOP_TAIL      = new Set(['the','and','to','of','for','with','in','on']);

  // —— STATE ——
  const bigrams  = new Map(); // Map<"w1", Map<"w2", count>>
  const trigrams = new Map(); // Map<"w1 w2", Map<"w3", count>>
  const starts   = [];        // trigram keys that begin sentences
  const recent   = [];        // last N quotes

  // —— DOM ——
  const BOX = document.getElementById('markovQuote');
  const BTN = document.getElementById('regenerateBtn');
  BTN.disabled = true;

  BTN.addEventListener('click', () => {
    BOX.textContent = generateBest() || 'Loading corpus…';
  });

  // —— BOOTSTRAP ——
  fetch(CORPUS_FILE)
    .then(r => { if(!r.ok) throw Error(`HTTP ${r.status}`); return r.text(); })
    .then(text => {
      buildModels(text);
      BOX.textContent = generateBest() || fallback();
      BTN.disabled = false;
    })
    .catch(err => {
      console.error('QuipForge Pro+ load error:', err);
      BOX.textContent = fallback();
    });

  // —— BUILD MODELS ——
  function buildModels(raw) {
    bigrams.clear(); trigrams.clear(); starts.length = 0;

    // 1. tokenize & clean
    const tokens = raw.replace(/\r?\n+/g,' ').split(/\s+/).map(t=>{
      const clean = t.toLowerCase().replace(/[^a-z.?!]/g,'');
      return clean.length>1 ? clean : null;
    }).filter(Boolean);

    // 2. build counts
    tokens.forEach((tok,i) => {
      // bigram: tok -> next
      if (i < tokens.length - 1) {
        const w1 = tok, w2 = tokens[i+1];
        let m = bigrams.get(w1);
        if (!m) bigrams.set(w1, m = new Map());
        m.set(w2, (m.get(w2)||0) + 1);
      }
      // trigram: tok tok2 -> next
      if (i < tokens.length - 2) {
        const w1 = tok, w2 = tokens[i+1], w3 = tokens[i+2];
        const key = `${w1} ${w2}`;
        let m = trigrams.get(key);
        if (!m) trigrams.set(key, m = new Map());
        m.set(w3, (m.get(w3)||0) + 1);
      }
      // sentence starts
      if (i === 0 || /[.?!]$/.test(tokens[i-1])) {
        if (i < tokens.length - 1) starts.push(`${tok} ${tokens[i+1]}`);
      }
    });

    // 3. prune rare n‑grams
    for (const [k,m] of trigrams) {
      const total = [...m.values()].reduce((s,v)=>s+v,0);
      if (total < PRUNE_THRESHOLD) trigrams.delete(k);
    }
    console.info('Models built:', trigrams.size, 'trigrams,', bigrams.size, 'bigrams');
  }

  // —— GENERATE & RERANK ——  
  function generateBest() {
    if (!trigrams.size) return '';

    const candidates = [];
    for (let i = 0; i < CANDIDATES; i++) {
      const q = makeRaw();
      if (q) candidates.push({ text: q, score: scoreQuote(q) });
    }
    if (!candidates.length) return '';

    // pick highest‑score
    candidates.sort((a,b)=>b.score - a.score);
    const best = candidates[0].text;

    // optional: deep polish hook
    return deepPolish(best);
  }

  // —— MAKE ONE RAW QUIP ——  
  function makeRaw() {
    let key = starts[Math.random()*starts.length|0];
    let [w1,w2] = key.split(' ');
    const out = [capitalize(w1), w2];

    while (out.length < MAX_WORDS) {
      // softmax sampling on trigram or back‑off to bigram
      const next = pickNext(out.at(-2), out.at(-1));
      if (!next) break;
      out.push(next);
      if (out.length >= MIN_WORDS && Math.random() < 0.5) break;
    }

    // cleanup: drop trailing stop‑word, dedupe, capitalise I
    return tidy(out).join(' ');
  }

  function pickNext(w1,w2) {
    const triKey = `${w1} ${w2}`;
    let dist = trigrams.get(triKey);
    if (dist) return sampleDist(dist, TEMPERATURE);

    // back‑off to bigram: last word → next
    dist = bigrams.get(w2);
    if (dist) return sampleDist(dist, TEMPERATURE);

    return null;
  }

  // softmax sample
  function sampleDist(map, temp) {
    const entries = [...map.entries()];
    // compute weights = (count)^(1/temp)
    const weights = entries.map(([,c])=>Math.pow(c,1/temp));
    const sum = weights.reduce((a,b)=>a+b,0);
    let r = Math.random() * sum;
    for (let i = 0; i < entries.length; i++) {
      r -= weights[i];
      if (r <= 0) return entries[i][0];
    }
    return entries[entries.length-1][0];
  }

  // —— SCORING & QUALITY ——  
  function scoreQuote(text) {
    const words = text.split(' ');
    let score = 0;

    // 1. n‑gram log‑prob
    for (let i = 2; i < words.length; i++) {
      const key = `${words[i-2].toLowerCase()} ${words[i-1].toLowerCase()}`;
      const next = words[i].toLowerCase();
      const tri = trigrams.get(key);
      if (tri && tri.has(next)) {
        const total = [...tri.values()].reduce((s,v)=>s+v,0);
        score += Math.log((tri.get(next)+1) / (total + tri.size));
      } else {
        const bi = bigrams.get(words[i-1].toLowerCase());
        if (bi && bi.has(next)) {
          const total = [...bi.values()].reduce((s,v)=>s+v,0);
          score += Math.log((bi.get(next)+1) / (total + bi.size)) * 0.5; // back‑off penalty
        } else {
          score -= 1; // penalty for unknown
        }
      }
    }

    // 2. POS bonus (must have verb+noun)
    const doc = nlp(text);
    if (doc.verbs().out('array').length) score += 1.0;
    if (doc.nouns().out('array').length) score += 0.5;

    // 3. Alliteration bonus
    const arr = words.map(w=>w[0].toLowerCase());
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === arr[i-1]) { score += 0.5; break; }
    }

    // 4. Rhyme bonus (last‐2 letters)
    const wend = words.at(-1).slice(-2);
    if (words.length>1 && words[words.length-2].endsWith(wend)) score += 0.5;

    // 5. length bonus (closer to mid)
    const mid = (MIN_WORDS+MAX_WORDS)/2;
    score -= Math.abs(words.length - mid)*0.2;

    return score;
  }

  // —— CLEANUP & DUPES ——  
  function tidy(arr) {
    // drop trailing stop words
    while (arr.length && STOP_TAIL.has(arr.at(-1).toLowerCase())) arr.pop();
    // dedupe consecutive words
    const out = arr.filter((w,i,a)=>i===0||a[i-1]!=w);
    // capitalise lone “i”
    return out.map((w,i)=> i>0 && w==='i' ? 'I' : w);
  }

  // —— HYBRID POLISH STUB ——  
  function deepPolish(text) {
    // ← here you could call a tiny GPT‑2 or OpenAI API to clean it up.
    // For now, just append a random punct (and cache duplicates):
    const p = ['.', '!', '?'][Math.random()*3|0];
    const quote = text + p;
    if (!recent.includes(quote)) {
      recent.push(quote);
      if (recent.length > RECENT_LIMIT) recent.shift();
    }
    return quote;
  }

  function fallback() {
    return 'Stay curious; drink good coffee.';
  }
})();
