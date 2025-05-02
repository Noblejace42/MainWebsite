/* markovscript.js — v7 “QuipForge Warp” — 2025‑05‑02
   Trigram + teleport chance for broader randomness
   Needs: index.html, emersonmarkovchain.txt (same folder)
*/
(() => {
  if (window.__quipForgeLoaded__) return;
  window.__quipForgeLoaded__ = true;

  /* ==== Config ==== */
  const FILE          = 'emersonmarkovchain.txt';
  const MIN_WORDS     = 5;
  const MAX_WORDS     = 8;
  const MAX_TRIES     = 30;
  const RECENT_LIMIT  = 30;
  const TELEPORT_P    = 0.25;          // 25 % chance to jump to new key
  const STOP_TAIL     = new Set(['the','and','to','of','for','with']);

  /* ==== DOM ==== */
  const BOX = document.getElementById('markovQuote');
  const BTN = document.getElementById('regenerateBtn');

  /* ==== State ==== */
  const chain  = new Map();  // trigram key → next list
  const keys   = [];         // all keys (for teleport)
  const starts = [];         // sentence‑start keys
  const recent = [];

  BTN.onclick = () => {
    if (!chain.size) loadCorpus();
    BOX.textContent = generate() || fallback();
  };

  loadCorpus();

  /* ---------- fetch & build ---------- */
  function loadCorpus(){
    fetch(FILE)
      .then(r => {
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(txt => {
        buildChain(txt);
        BOX.textContent = generate() || fallback();
      })
      .catch(e=>{
        console.error('QuipForge Warp | load error:', e);
        BOX.textContent = fallback();
      });
  }

  function buildChain(raw){
    chain.clear(); keys.length=0; starts.length=0;

    const tokens = raw.replace(/\r?\n+/g,' ').split(/\s+/);
    const words=[];
    tokens.forEach(t=>{
      const boundary=/[.!?]$/.test(t);
      const w=t.toLowerCase().replace(/[^a-z]/g,'');
      if(w.length>1 && !w.includes('http') && !w.includes('com') && !w.includes('@')){
        words.push({w,boundary});
      }
    });

    for(let i=0;i<words.length-2;i++){
      const key=`${words[i].w} ${words[i+1].w}`;
      const next=words[i+2].w;
      (chain.get(key)||chain.set(key,[]).get(key)).push(next);
      keys.push(key);
      if(i===0||words[i].boundary) starts.push(key);
    }
    console.info(`Warp built: ${chain.size} keys, ${starts.length} starts`);
  }

  /* ---------- generator ---------- */
  function generate(){
    for(let attempt=0;attempt<MAX_TRIES;attempt++){
      let key=rand(starts);
      let [w1,w2]=key.split(' ');
      let out=[cap(w1),w2];

      while(out.length<MAX_WORDS){
        // TELEPORT
        if(Math.random()<TELEPORT_P){
          key=rand(keys);
          [w1,w2]=key.split(' ');
          out.push(w1,w2);
          // keep length in bounds
          out=out.slice(0,MAX_WORDS);
        }

        const opts=chain.get(key);
        if(!opts||!opts.length) break;

        const next=rand(opts);
        out.push(next);
        if(out.length>=MIN_WORDS && Math.random()<0.5) break;
        key=`${out[out.length-2]} ${out[out.length-1]}`;
      }

      out=tidy(out);
      if(valid(out)){
        const quote=out.join(' ')+rand(['.','!','?']);
        if(!recent.includes(quote)){
          recent.push(quote);
          if(recent.length>RECENT_LIMIT) recent.shift();
          return quote;
        }
      }
    }
    return '';
  }

  /* ---------- helpers ---------- */
  const rand=a=>a[Math.random()*a.length|0];
  const cap=s=>s[0].toUpperCase()+s.slice(1);

  function tidy(arr){
    // trim trailing stop words
    while(arr.length&&STOP_TAIL.has(arr[arr.length-1])) arr.pop();
    // de‑duplicate consecutive words
    return arr.filter((w,i,a)=>i===0||w!==a[i-1])
              .map((w,i)=>i===0&&w==='i'?'I':w);
  }
  const valid=a=>a.length>=MIN_WORDS&&a.length<=MAX_WORDS&&/^[a-z]{2,}$/.test(a.at(-1));
  const fallback=()=> 'Stay curious; drink good coffee.';
})();
