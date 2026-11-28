export const wordPattern=/[\p{L}\p{M}\p{N}]+(?:[-’'][\p{L}\p{M}\p{N}]+)*/gu;
const alphabet="aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz";
const fold=word=>word.normalize("NFD").replace(/\p{M}/gu,"");
const indexes=new WeakMap();

function spellingIndex(paradigms){
  if(indexes.has(paradigms))return indexes.get(paradigms);
  const forms=new Set(), accents=new Map();
  function add(form){
    if(typeof form!=="string" || !/^\p{L}{3,32}$/u.test(form))return;
    const word=form.normalize("NFC").toLowerCase();
    if(forms.has(word))return;
    forms.add(word);
    const plain=fold(word);
    if(plain===word)return;
    if(!accents.has(plain))accents.set(plain,[]);
    accents.get(plain).push(word);
  }
  for(const [key,variants] of Object.entries(paradigms)){
    add(key.slice(key.indexOf(":")+1));
    if(Array.isArray(variants))for(const form of variants)add(form);
  }
  const index={forms,accents};
  indexes.set(paradigms,index);
  return index;
}

export function spellingSuggestions(input,paradigms){
  const word=input.normalize("NFC").toLowerCase();
  if(!/^\p{L}{3,32}$/u.test(word))return [];
  const {forms,accents}=spellingIndex(paradigms);
  if(forms.has(word))return [];
  const found=new Map();
  const add=(form,rank)=>{if(forms.has(form)&&!found.has(form))found.set(form,rank);};
  for(const form of accents.get(fold(word))||[])add(form,0);
  for(let i=0;i<word.length;i++){
    const prefix=word.slice(0,i),tail=word.slice(i+1);
    if(i+1<word.length)add(prefix+word[i+1]+word[i]+word.slice(i+2),1);
    add(prefix+tail,2);
    for(const letter of alphabet){
      add(prefix+letter+tail,3);
      add(prefix+letter+word.slice(i),3);
    }
  }
  for(const letter of alphabet)add(word+letter,3);
  return [...found].sort(([a,rankA],[b,rankB])=>rankA-rankB||a.localeCompare(b,"hu"))
    .slice(0,3).map(([candidate])=>{
      if(input===input.toUpperCase())return candidate.toUpperCase();
      if(input[0]===input[0].toUpperCase())return candidate[0].toUpperCase()+candidate.slice(1);
      return candidate;
    });
}

export function correctionAt(input,index,word){
  const token=[...input.matchAll(wordPattern)][index];
  if(!token || token[0].normalize("NFC")!==word.normalize("NFC"))return null;
  return {start:token.index,end:token.index+token[0].length};
}
