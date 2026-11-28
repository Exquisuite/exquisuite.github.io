const models = new Map();
const aliases = new Map();
function model(lemma, title, pos, meaning, fields, forms = []) {
  const entry = {lemma,title,pos,meaning,fields};
  models.set(lemma,entry);
  for(const form of [lemma,title,...forms]) aliases.set(form.toLowerCase(),entry);
}
function verb(lemma,meaning,inf,present,past,options={}) {
  const fields=[];
  if(options.base) fields.push(['기본형',lemma]);
  if(options.parts) fields.push(['구성',options.parts]);
  for(const [label,value] of [['부정사',inf],['현재형',present],['과거형',past]]) fields.push([label,value.replace(/ /g,' – ')]);
  fields.push(...(options.extra||[]));
  model(lemma,options.title||lemma,options.base?'동사 + 부정사':'동사',meaning,fields,[inf,...(present+' '+past).split(/[ /]/)]);
}
verb('tornázik','체조하다, 운동하다','tornázni','tornázom/tornázok tornázol tornázik tornázunk tornáztok tornáznak','tornáztam tornáztál tornázott tornáztunk tornáztatok tornáztak');
verb('napozik','일광욕하다, 햇볕을 쬐다','napozni','napozom/napozok napozol napozik napozunk napoztok napoznak','napoztam napoztál napozott napoztunk napoztatok napoztak');
verb('fürdik','목욕하다, 몸을 씻다, 물에 들어가 놀다','fürdeni','fürdöm/fürdök fürdesz fürdik fürdünk fürödtök fürdenek','fürödtem fürödtél fürdött fürödtünk fürödtetek fürödtek');
verb('pingpongozik','탁구를 치다','pingpongozni','pingpongozom/pingpongozok pingpongozol pingpongozik pingpongozunk pingpongoztok pingpongoznak','pingpongoztam pingpongoztál pingpongozott pingpongoztunk pingpongoztatok pingpongoztak',{parts:'pingpong + -ozik'});
verb('érdekel','관심을 끌다, 흥미를 일으키다','érdekelni','érdekelek érdekelsz érdekel érdekelünk érdekeltek érdekelnek','érdekeltem érdekeltél érdekelt érdekeltünk érdekeltetek érdekeltek',{extra:[['※','Érdekel a zene. = 음악에 관심이 있다.']]});
verb('utál','~하는 것을 싫어하다, 몹시 싫어하다','utálni','utálok utálsz utál utálunk utáltok utálnak','utáltam utáltál utált utáltunk utáltatok utáltak',{base:true,title:'utál + Inf.',extra:[['구조','utál + 동사 부정사(-ni)'],['예','Utálok várni. = 기다리는 것을 싫어한다.']]});
verb('söröz','맥주를 마시다, 맥주를 마시며 시간을 보내다','sörözni','sörözök sörözöl söröz sörözünk söröztök söröznek','söröztem söröztél sörözött söröztünk söröztetek söröztek',{parts:'sör + -öz'});
verb('imád','~하는 것을 매우 좋아하다, 아주 좋아하다','imádni','imádok imádsz imád imádunk imádtok imádnak','imádtam imádtál imádott imádtunk imádtatok imádtak',{base:true,title:'imád + Inf.',extra:[['구조','imád + 동사 부정사(-ni)'],['예','Imádok utazni. = 여행하는 것을 정말 좋아한다.']]});
verb('vezet','운전하다, 이끌다, 인도하다, 지도하다','vezetni','vezetek vezetsz vezet vezetünk vezettek vezetnek','vezettem vezettél vezetett vezettünk vezettetek vezettek');
model('tengerpart','tenger/part → tengerpart','명사','해변, 바닷가, 해안',[['구성','tenger(바다) + part(물가, 해안)'],['어형 변화','tengerpartok(복수형), tengerpartot(목적격), tengerparton(~에서), tengerpartra(~로), tengerpartról(~에서부터)']],['tenger/part']);
model('mostanában','mostanában','부사','요즘, 최근에, 근래에',[['관련형','most(지금) → mostanában(요즘, 최근에)'],['※','부사이므로 명사의 복수형·목적격과 같은 격변화는 하지 않음.']]);
model('kertészkedés','kert/ész/ked/és → kertészkedés','명사','정원 가꾸기, 원예, 원예 활동',[['구성','kert(정원) → kertész(정원사) → kertészkedik(정원을 가꾸다) → kertészkedés(정원 가꾸기)'],['어형 변화','kertészkedések(복수형), kertészkedést(목적격), kertészkedésnek(~에게), kertészkedéssel(~와/~으로), kertészkedésben(~에서), kertészkedésből(~에서부터), kertészkedésről(~에 관하여)']],['kert/ész/ked/és']);
let paradigms;
function loadParadigms(){
  return paradigms??=fetch('paradigms.json').then(r=>{if(!r.ok)throw Error();return r.json()}).catch(()=>{paradigms=null;return {}});
}
function studyWord(number,word,book,entry) {
  const fields=entry?[...entry.fields]:[];
  const lemma=entry?.lemma||word.lemma;
  const pos=entry?.pos||word.pos;
  if(word?.fields)fields.push(...Object.entries(word.fields));
  if(!entry && pos==='동사'){
    const forms=book['V:'+lemma]||[];
    const six=start=>Array.from({length:6},(_,i)=>forms[start+i]||'미확인').join(' – ');
    fields.push(['부정사',forms[0]||'미확인'],['현재형',six(1)],['과거형',six(7)]);
  }else if(!entry && pos==='명사'){
    const labels=['복수형','목적격','여격','도구·동반격','안에서','안으로','안에서부터','위에서','위로','위에서부터'];
    const forms=book['N:'+lemma]||[];
    fields.push(['어형 변화',forms.slice(0,10).map((f,i)=>f&&f+'('+labels[i]+')').filter(Boolean).join(', ')||'미확인']);
  }
  if(pos==='동사' || pos==='동사 + 부정사'){
    const definite=book['V:'+lemma]?.slice(13,19);
    if(definite?.length===6 && definite.every(Boolean))fields.push(['정관변화',definite.join(' – ')]);
  }
  if(pos==='명사'){
    const possessors=['나의','너의','그의/그녀의','우리의','너희의','그들의'];
    const forms=book['N:'+lemma]?.slice(10,16)||[];
    const rows=forms.map((form,i)=>form && form+' = '+possessors[i]+' '+(entry?.meaning||word.meaning).split(',')[0]).filter(Boolean);
    if(rows.length)fields.push(['소유형',rows.join('\n')]);
  }
  if(word && (word.word.toLowerCase()!==lemma.toLowerCase() || !entry)){
    fields.push(['원문형',word.word]);
    if(word.parts && word.parts!==word.word)fields.push(['형태 구성',word.parts]);
    if(word.features?.length && !word.features.includes('형태 미확인'))fields.push(['문법',word.features.join(' · ')]);
    if(word.gloss)fields.push(['문장 속 풀이',word.gloss]);
  }
  if(word?.dictionarySummary?.length>1){
    const meanings=[...new Set(word.dictionarySummary.map(({korean,original})=>korean||"사전 원문 · "+original))];
    fields.push(['사전 뜻 후보',meanings.join("\n")]);
  }else if(word?.senses?.length>1)fields.push(['사전 뜻 후보',word.senses.join(' / ')]);
  return [number+'. '+(entry?.title||lemma)+' ['+pos+']','의미: '+(entry?.meaning||word.meaning),
    ...fields.map(([key,value])=>key+(key==='※'?' ':': ')+value)].join('\n');
}
function frameSlot(word) {
  const person=word.lemma==='valaki';
  const kind=person?'사람':'사물·내용';
  const role=word.caseEnding==='t'?'목적어':word.caseEnding?word.caseName:'주어 자리';
  return word.word+' ('+word.expanded+') — '+kind+' '+role+(word.caseEnding?' [-'+word.caseEnding+']':'');
}
function frameSense(head,slots) {
  const forms=new Set(slots.map(slot=>slot.expanded));
  const accusative=slots.filter(slot=>slot.caseEnding==='t');
  const objects=accusative.map(slot=>slot.lemma==='valaki'?'사람':'대상').join(' 또는 ');
  if(head==='érdekel' && forms.has('valakit'))return '어떤 것이 사람의 관심을 끌다. 한국어로는 ‘그 사람이 그것에 관심이 있다’라고도 표현한다.';
  if(head==='vezet' && accusative.length===1)return forms.has('valakit')?'사람을 이끌거나 안내하다':'차량 등을 운전하다, 조직 등을 이끌다';
  if(head==='ad' && forms.has('valakinek') && forms.has('valamit'))return '누군가에게 무엇을 주다';
  if(head==='kér' && forms.has('valamit') && forms.has('valakitől'))return '누군가에게 무엇을 요청하다';
  if(head==='bízik' && slots.some(s=>s.caseEnding==='ben'))return '사람이나 대상을 믿다, 신뢰하다';
  if(head==='vár' && slots.some(s=>s.caseEnding==='re'))return '사람이나 대상을 기다리다';
  const verbs={szeret:'좋아하다',imád:'아주 좋아하다',utál:'몹시 싫어하다',lát:'보다',keres:'찾다'};
  if(verbs[head] && objects)return objects+'을 '+verbs[head];
  return '';
}
function dictionaryFrame(source,index,vocabulary,slots,book){
  const structure=['문형: '+source,'지배격: '+slots.map(frameSlot).join(' / ')];
  if(!vocabulary.length)return index+'. '+source+'\n'+structure[1];
  const entries=vocabulary.map((word,i)=>{
    const entry=models.get(word.lemma)||aliases.get(word.word.toLowerCase());
    const sense=vocabulary.length===1?frameSense(entry?.lemma||word.lemma,slots):'';
    const selected=entry && sense ? {...entry,title:entry.lemma,pos:entry.pos==='동사 + 부정사'?'동사':entry.pos,meaning:sense,
      fields:entry.fields.filter(([key])=>!['구조','예','기본형'].includes(key))}:entry;
    return studyWord(vocabulary.length===1?index:index+'.'+(i+1),sense?{...word,meaning:sense}:word,book,selected);
  });
  if(entries.length===1){
    const lines=entries[0].split('\n');
    lines.splice(2,0,...structure);
    return lines.join('\n');
  }
  return [index+'. '+source,structure[1],'',...entries].join('\n');
}
async function studyItem(source,index){
  const direct=aliases.get(source.toLowerCase().replace(/\s*\+\s*/g,' + '));
  if(direct && (models.has(source.toLowerCase())||source.includes('/')||source.includes('+')))return studyWord(index,null,{},direct);
  const analysis=await window.analyzeHU(source,{preserveAbbreviations:true});
  const vocabulary=analysis.words.filter(word=>!word.expanded);
  const slots=analysis.words.filter(word=>word.expanded);
  if (!vocabulary.length && slots.every(word=>!word.caseEnding)) return index+'. '+source;
  const book=await loadParadigms();
  if(slots.length)return dictionaryFrame(source,index,vocabulary,slots,book);
  const sentence=analysis.words.length>1;
  const words=vocabulary.map((word,i)=>studyWord(sentence?index+'.'+(i+1):index,word,book,models.get(word.lemma)||aliases.get(word.word.toLowerCase())));
  if(sentence) words.unshift(index+'. '+source+'\n직역: '+analysis.literal+'\n의역: '+analysis.natural);
  return words.join('\n\n');
}




