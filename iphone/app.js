const $=id=>document.getElementById(id);
const examples=[['Tegnap egy könyvet olvastam a kertben.','과거형과 장소 표현'],['A házamban vagyok.','소유 표현과 장소격'],['Látom a kutyát.','목적격과 정활용'],['Rejtvényt fejtek.','비한정 활용과 1인칭 단수']];
let historyList=[];try{historyList=JSON.parse(localStorage.getItem('magyar.history')||'[]')}catch{}
let generation=0,activeRun=null,lastAnalysis=null;
function el(tag,cls,value){const n=document.createElement(tag);n.className=cls||'';n.textContent=value??'';return n}
function count(){$('count').textContent=$('input').value.length+' / 1,000'}
function view(key){$('musicRoom').hidden=key!=='music';document.getElementById('imageView').hidden=key!=='image';document.querySelectorAll('.workspace-nav button').forEach(button=>{
    const selected=button.dataset.view===key;
    button.classList.toggle('active',selected);
    if(selected)button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  });$('main').hidden=key!=='main';$('assignment').hidden=key!=='assignment';$('other').hidden=key==='main'||key==='assignment'||key==='image'||key==='music';$('crumb').textContent=document.querySelector('[data-view="'+key+'"] .nav-label').textContent;if(key==='main'||key==='assignment'||key==='image'||key==='music')return;
$('title').textContent=$('crumb').textContent;$('desc').textContent=key==='examples'?'예문을 선택해 문법과 번역을 살펴보세요.':'이 브라우저에서 최근 분석한 원문입니다.';$('items').replaceChildren();
const items=key==='examples'?examples:historyList.map(item=>typeof item==='string'?[item,'다시 분석하기','hu']:[item.text,'다시 번역하기',item.lang]);if(!items.length)$('items').append(el('p','','아직 분석 기록이 없습니다.'));
for(const [t,sub,lang] of items){let b=el('button','item',t);b.append(el('small','',sub));b.onclick=()=>{document.getElementById('direction').value=lang||'hu';setDirection();$('input').value=t;count();view('main');run()};$('items').append(b)}}
async function run(save=true){const source=$('input').value,text=source.trim(),lang=document.getElementById('direction').value;if(activeRun&&activeRun.text===text&&activeRun.lang===lang)return;const id=++generation;if(!text){activeRun=null;$('run').disabled=false;$('status').textContent='원문을 입력해 주세요.';$('results').hidden=true;return}activeRun={id,text,lang};
$('run').disabled=true;$('status').textContent='어휘와 어형을 분석하고 있습니다…';$('results').hidden=true;
try{const reverse=lang==='ko';const r=reverse?{natural:await window.translateKorean(text),literal:'',words:[]}:await window.analyzeHU(text);if(id!==generation)return;if(reverse&&!r.natural)throw Error();$('literal').textContent=r.literal;const meanings=r.vocabularyMeanings;const showMeanings=meanings?.length>1;$('naturalLabel').textContent=reverse?'헝가리어 번역':showMeanings?'한국어 뜻':'의역';$('natural').textContent=showMeanings?meanings.join('\n'):r.natural;$('words').replaceChildren();$('total').textContent=r.words.length;
r.words.forEach((word,index)=>$('words').append(wordCard(word,index)));$('results').hidden=false;$('status').textContent='';if(!reverse){lastAnalysis={text,words:r.words};void showSpellingOptions(source,r.words,id);}if(save){historyList=[{text,lang},...historyList.filter(x=>typeof x==='string'?x!==text:x.text!==text||x.lang!==lang)].slice(0,25);try{localStorage.setItem('magyar.history',JSON.stringify(historyList))}catch{}}}
catch{if(id===generation)$('status').textContent='분석을 완료하지 못했습니다. 연결을 확인하고 다시 시도해 주세요.'}finally{if(id===generation){activeRun=null;$('run').disabled=false}}}
async function showSpellingOptions(source,words,id){
  const unknown=words.flatMap((word,index)=>word.pos==='미확인' && /^\p{L}{3,32}$/u.test(word.word)?[{word,index}]:[]);
  if(!unknown.length)return;
  try{
    const {spellingSuggestions,correctionAt}=await import('./spelling.js');
    if(id!==generation)return;
    const input=$('input');
    for(const {word,index} of unknown){
      const range=correctionAt(source,index,word.word);
      if(!range)continue;
      const card=$('words').children[index], controls=el('div','spelling-controls');
      const revise=el('button','spelling-edit','이 단어 직접 수정');
      revise.type='button';
      const current=()=>id===generation&&input.value===source&&$('direction').value==='hu';
      revise.onclick=()=>{
        if(!current())return;
        input.focus();
        input.setSelectionRange(range.start,range.end);
      };
      controls.append(revise);
      card.append(controls);
    }
    const paradigms=await loadParadigms();
    if(id!==generation || input.value!==source)return;
    for(const {word,index} of unknown){
      const range=correctionAt(source,index,word.word);
      const controls=$('words').children[index]?.querySelector('.spelling-controls');
      if(!range||!controls)continue;
      const suggestions=spellingSuggestions(word.word,paradigms);
      if(!suggestions.length)continue;
      const choices=el('div','spelling-options');
      choices.append(el('span','','철자 수정 후보'));
      for(const candidate of suggestions){
        const button=el('button','',candidate);
        button.type='button';
        button.lang='hu';
        button.setAttribute('aria-label',word.word+' → '+candidate+' 적용 후 다시 분석');
        button.onclick=()=>{
          if(id!==generation||input.value!==source||$('direction').value!=='hu')return;
          input.setRangeText(candidate,range.start,range.end,'end');
          input.oninput();
          document.getElementById('run').focus();
          void run();
        };
        choices.append(button);
      }
      controls.prepend(choices);
    }
  }catch{/* Analysis and manual input remain available if spelling support fails. */}
}
function wordHeading(word){
  const parts=word.morphemes||[];
  if(parts.some(part=>part.kind==='미분리'))return word.word;
  const segments=parts.filter(part=>part.text!=='∅').map(part=>part.text.replace(/^-|-$/g,''));
  if(segments.length<2||segments.join('')!==word.word.toLowerCase())return word.word;
  let offset=0;
  return segments.map(segment=>{
    const start=offset;
    offset+=segment.length;
    return word.word.slice(start,offset);
  }).join('-');
}
function wordCard(word,index){
  const card=el('article','word'),top=el('div','wordtop');
  top.append(el('small','',String(index+1).padStart(2,'0')),el('span','tag',word.pos));
  const ambiguous=word.senses?.length>1 && word.unresolvedSenses?.length>1;
  const heading=el('h3','word-heading',wordHeading(word));
  heading.lang='hu';
  card.append(top,heading);
  if(word.dictionarySummary?.length){
    card.append(dictionarySummary(word));
  }else{
    card.append(el('p','',ambiguous?'가능한 뜻 '+word.senses.length+'개':word.meaning));
    if(word.senses?.length>1){
      const meanings=el('section','alternate-senses');
      const list=el('ol','word-senses');
      for(const meaning of word.senses){
        const item=el('li','',meaning);
        if(!ambiguous && meaning===word.meaning) item.append(el('span','sense-selected',' · 문맥상 뜻'));
        list.append(item);
      }
      meanings.append(el('h4','','한국어 뜻'),list);
      card.append(meanings);
    }
  }
  if(word.dictionaryDefinitions?.length && (word.dictionarySummary?.length || word.senses?.length<2)){
    const definitions=el('details','alternate-senses');
    const list=el('ul','word-senses');
    for(const definition of word.dictionaryDefinitions)list.append(el('li','',definition));
    definitions.append(el('summary','','사전 원문 풀이'),list);
    card.append(definitions);
  }
  const details=el('div','details');
  details.append(el('div','','기본형 · '+word.lemma));
  if(word.morphemes?.length){
    const list=el('dl','morphemes');
    for(const {kind,text,reading} of word.morphemes){
      const row=el('div','');
      row.append(el('dt','',kind+' · '+text),el('dd','',reading));
      list.append(row);
    }
    details.append(el('h4','','형태소 분석'),list);
  }
  if(!word.morphemes?.length || word.morphemes.some(part=>part.kind==='미분리')){
    if(word.parts)details.append(el('div','','기본형과 표면형 · '+word.parts.replaceAll(' + -',' / -')));
  }
  for(const line of [...(word.features||[]),...Object.entries(word.fields||{}).map(([key,value])=>key+' · '+value),
    word.gloss && word.gloss!==word.meaning?'문장 속 풀이 · '+word.gloss:'',
    word.readingReason?'활용 선택 · '+word.readingReason:'',
    word.senseReason?'문맥 · '+word.senseReason:''].filter(Boolean))details.append(el('div','',line));
  if(word.readingAlternatives?.length){
    const variants=el('details','reading-alternatives');
    variants.append(el('summary','', (word.readingUncertain?'형태 분석 후보 ':'다른 형태 분석 ')+word.readingAlternatives.length+'개'));
    variants.open=word.readingUncertain;
    const list=el('ul','word-senses');
    for(const reading of word.readingAlternatives){
      const item=el('li','');
      item.append(el('strong','',reading.lemma+' · '+reading.pos),
        el('div','',reading.features.join(' · ')),
        el('div','',reading.morphemes.map(p=>p.kind+' '+p.text).join(' / ')));
      if(reading.meanings.length)item.append(el('div','',reading.meanings.join(' / ')));
      list.append(item);
    }
    variants.append(list);
    details.append(variants);
  }
  card.append(details);
  if(word.dictionarySources?.length){
    card.append(dictionaryLinks('뜻풀이 출처',word.dictionarySources));
  }
  return card;
}
function dictionarySummary(word){
  const section=el('section','dictionary-summary');
  section.append(el('h4','','사전 뜻 요약'));
  const grouped=new Map();
  for(const {pos,korean,original} of word.dictionarySummary){
    if(!grouped.has(pos))grouped.set(pos,new Map());
    grouped.get(pos).set(korean||original,{korean,original});
  }
  for(const [pos,entries] of grouped){
    section.append(el('div','dictionary-pos',pos));
    const list=el('ol','word-senses');
    for(const {korean,original} of entries.values()){
      const item=el('li','',korean||'사전 원문 · '+original);
      list.append(item);
    }
    section.append(list);
  }
  return section;
}
function dictionaryLinks(label,links){
  const group=el('div','dictionary-links');
  group.setAttribute('aria-label',label);
  for(const {name,url} of links){
    const link=el('a','',name);
    link.href=url;
    link.target='_blank';
    link.rel='noopener noreferrer';
    group.append(link);
  }
  return group;
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>view(b.dataset.view));$('input').oninput=()=>{generation++;activeRun=null;lastAnalysis=null;$('run').disabled=false;$('results').hidden=true;$('status').textContent='';count()};document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&!e.isComposing&&!$('main').hidden){e.preventDefault();if(!e.repeat&&!$('run').disabled)run()}});$('run').onclick=()=>run();$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('direction').value==='ko'?document.getElementById('natural').textContent:'직역\n'+$('literal').textContent+'\n\n'+$('naturalLabel').textContent+'\n'+$('natural').textContent);$('status').textContent='번역을 복사했습니다.'}catch{$('status').textContent='브라우저에서 클립보드 접근을 허용해 주세요.'}};
const drafts={hu:$('input').value,ko:''};
let currentDirection='hu';
function setDirection(){
  drafts[currentDirection]=$('input').value;
  currentDirection=$('direction').value;
  const reverse=currentDirection==='ko';
  $('input').value=drafts[currentDirection];
  $('input').removeAttribute('placeholder');
  $('input').lang=reverse?'ko':'hu';
  $('input').setAttribute('aria-label',reverse?'한국어 원문':'헝가리어 원문');
  $('naturalLabel').textContent=reverse?'헝가리어 번역':'의역';
  $('literalPanel').hidden=reverse;
  $('wordHeading').hidden=reverse;
  $('words').hidden=reverse;
  $('results').classList.toggle('reverse',reverse);
  $('run').lastChild.textContent=reverse?'번역하기':'분석하기';
  $('input').oninput();
}
$('quickAI').onclick=()=>{
  const text=$('input').value.trim();
  if(!text){
    $('status').textContent='원문을 입력해 주세요.';
    $('input').focus();
    return;
  }
  const words=lastAnalysis?.text===text?lastAnalysis.words:[];
  window.aiHandoff.analyze(text,$('direction').value,words);
};
$('direction').onchange=setDirection;
count();$('results').hidden=true;
