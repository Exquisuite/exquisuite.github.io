export function tokens(text) {
  const words=text.toLowerCase().normalize("NFD").replace(/\p{M}/gu,"").match(/[a-z]{2,28}/g)||[];
  return words.map(word=>{
    let h=2166136261;
    for(const c of word) h=Math.imul(h^c.charCodeAt(0),16777619);
    return h>>>0;
  });
}

export function findPage(text,pages) {
  const query=new Set(tokens(text)),freq=new Map();
  for(const p of pages) for(const w of p.tokens) freq.set(w,(freq.get(w)||0)+1);
  const weight=w=>Math.log((pages.length+1)/(freq.get(w)+1));
  const known=[...query].filter(w=>freq.has(w));
  const total=known.reduce((s,w)=>s+weight(w),0);
  if(known.length<5||!total)return null;
  const ranks=pages.map(page=>{
    let sum=0,hits=0;
    for(const w of page.tokens)if(query.has(w)){sum+=weight(w);hits++;}
    return {page,hits,score:sum/total};
  }).sort((a,b)=>b.score-a.score);
  const [best,second]=ranks;
  return best.hits>=5 && best.score>=0.53 && best.score-(second?.score||0)>=0.12 ? best.page:null;
}

export function findExercises(text,page) {
  const found=new Set();
  for(const line of text.split(/\r?\n/)){
    const match=line.match(/^\s*(\d{1,2})[.)]\s*(.*)/);
    if(!match)continue;
    const entry=page.heads.find(([num])=>num===Number(match[1]));
    if(!entry)continue;
    const lineTokens=new Set(tokens(match[2]));
    const title=new Set(entry[1]);
    const overlap=[...title].filter(w=>lineTokens.has(w)).length;
    if(overlap>=2 && overlap/title.size>=0.55)found.add(entry[0]);
  }
  return [...found].sort((a,b)=>a-b);
}
