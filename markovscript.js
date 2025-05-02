/* markovscript.js — v7.2 “QuipForge Warp” — 2025‑05‑02
   Fixed: capitalize typo → cap(), tested on GitHub Pages.
*/

(() => {
  if (window.__quipForgeLoaded__) return;
  window.__quipForgeLoaded__ = true;

  const FILE          = 'emersonmarkovchain.txt';
  const MIN_WORDS     = 5;
  const MAX_WORDS     = 8;
  const MAX_TRIES     = 30;
  const CANDIDATES    = 8;
  const RECENT_LIMIT  = 30;
  const TEMPERATURE   = 1.2;
  const TELEPORT_P    = 0.25;
  const PRUNE_COUNT   = 2;
  const STOP_TAIL     = new Set(['the','and','to','of','for','with','in','on']);

  const BOX = document.getElementById('markovQuote');
  const BTN = document.getElementById('regenerateBtn');

  const bigrams = new Map();
  const trigrams = new Map();
  const starts = [];
  const keys = [];
  const recent = [];

  BTN.disabled = true;
  BTN.onclick = () => BOX.textContent = generateBest() || 'Loading…';

  fetch(FILE)
    .then(r => { if(!r.ok) throw Error(`HTTP ${r.status}`); return r.text(); })
    .then(text => {
      buildModels(text);
      BOX.textContent = generateBest();
      BTN.disabled = false;
    })
    .catch(e => {
      console.error('QuipForge Warp | load error:', e);
      BOX.textContent = 'Wisdom offline.';
    });

  /* ---------- build ---------- */
  function buildModels(raw){
    const toks = raw.replace(/\r?\n+/g,' ')
                    .split(/\s+/)
                    .map(t => t.toLowerCase().replace(/[^a-z.?!]/g,''))
                    .filter(w => w.length>1 && !w.includes('http') && !w.includes('com') && !w.includes('@'));

    for(let i=0;i<toks.length-2;i++){
      const w1=toks[i], w2=toks[i+1], w3=toks[i+2];

      // bigram
      (bigrams.get(w2) || bigrams.set(w2,new Map()).get(w2))
        .set(w3, (bigrams.get(w2)?.get(w3)||0)+1);

      // trigram
      const key=`${w1} ${w2}`;
      (trigrams.get(key) || trigrams.set(key,new Map()).get(key))
        .set(w3,(trigrams.get(key)?.get(w3)||0)+1);

      keys.push(key);
      if(i===0||/[.!?]$/.test(w1)) starts.push(key);
    }

    // prune rare trigram continuations
    trigrams.forEach((map,key)=>{
      const total=[...map.values()].reduce((s,v)=>s+v,0);
      if(total<PRUNE_COUNT) trigrams.delete(key);
    });

    console.info('Warp ready:', trigrams.size,'trigrams,',bigrams.size,'bigrams');
  }

  /* ---------- generation pipeline ---------- */
  function generateBest(){
    const cands=[];
    for(let i=0;i<CANDIDATES;i++){
      const raw=makeRaw();
      if(raw) cands.push({txt:raw,score:score(raw)});
    }
    if(!cands.length) return 'Keep iterating; refresh caffeine.';
    cands.sort((a,b)=>b.score-a.score);
    const best = cands[0].txt + rand(['.','!','?']);
    if(!recent.includes(best)){
      recent.push(best); if(recent.length>RECENT_LIMIT) recent.shift();
    }
    return best;
  }

  function makeRaw(){
    for(let attempt=0;attempt<MAX_TRIES;attempt++){
      let key=rand(starts);
      let [w1,w2]=key.split(' ');
      let out=[cap(w1),w2];

      while(out.length<MAX_WORDS){
        if(Math.random()<TELEPORT_P){
          key=rand(keys); [w1,w2]=key.split(' ');
          out.push(w1,w2); out=out.slice(0,MAX_WORDS);
        }
        const next=pickNext(out.at(-2),out.at(-1));
        if(!next) break;
        out.push(next);
        if(out.length>=MIN_WORDS && Math.random()<0.5) break;
      }
      out=cleanup(out);
      if(valid(out)) return out.join(' ');
    }
    return null;
  }

  function pickNext(w1,w2){
    const tri=trigrams.get(`${w1} ${w2}`);
    if(tri) return sample(tri);
    const bi=bigrams.get(w2);
    if(bi) return sample(bi,0.5);
    return null;
  }

  /* ---------- scoring ---------- */
  function score(str){
    const doc=nlp(str);
    let s=0;

    // log‑prob
    const ws=str.toLowerCase().split(' ');
    for(let i=2;i<ws.length;i++){
      const key=`${ws[i-2]} ${ws[i-1]}`, next=ws[i];
      const tri=trigrams.get(key);
      if(tri?.has(next)){
        const tot=[...tri.values()].reduce((a,b)=>a+b,0);
        s+=Math.log((tri.get(next)+1)/(tot+tri.size));
      }
    }
    // POS bonuses
    if(doc.verbs().length) s+=1;
    if(doc.nouns().length) s+=0.5;
    // alliteration
    for(let i=1;i<ws.length;i++){ if(ws[i][0]===ws[i-1][0]){s+=0.4;break;} }
    // rhyme
    if(ws.length>1 && ws.at(-1).slice(-2)===ws.at(-2).slice(-2)) s+=0.4;

    // length preference
    const mid=(MIN_WORDS+MAX_WORDS)/2;
    s-=Math.abs(ws.length-mid)*0.2;
    return s;
  }

  /* ---------- utilities ---------- */
  const rand = a => a[Math.random()*a.length|0];
  const cap  = s => s[0].toUpperCase()+s.slice(1);

  function cleanup(arr){
    while(arr.length && STOP_TAIL.has(arr.at(-1).toLowerCase())) arr.pop();
    return arr.filter((w,i,a)=>i===0||a[i-1]!==w)
              .map((w,i)=>i&&w==='i'?'I':w);
  }
  const valid = a => a.length>=MIN_WORDS && a.length<=MAX_WORDS && /^[a-z]{2,}$/i.test(a.at(-1));

  function sample(map,temp=TEMPERATURE){
    const ent=[...map.entries()];
    const weights=ent.map(([,c])=>Math.pow(c,1/temp));
    const sum=weights.reduce((a,b)=>a+b,0);
    let r=Math.random()*sum;
    for(let i=0;i<ent.length;i++){ if((r-=weights[i])<=0) return ent[i][0]; }
    return ent[ent.length-1][0];
  }
})();
