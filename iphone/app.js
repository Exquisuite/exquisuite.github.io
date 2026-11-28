const $=id=>document.getElementById(id);
const examples=[['Tegnap egy könyvet olvastam a kertben.','과거형과 장소 표현'],['A házamban vagyok.','소유 표현과 장소격'],['Látom a kutyát.','목적격과 정활용']];
let historyList=[];try{historyList=JSON.parse(localStorage.getItem('magyar.history')||'[]')}catch{}
let generation=0,activeRun=null;
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
async function run(save=true){const text=$('input').value.trim(),lang=document.getElementById('direction').value;if(activeRun&&activeRun.text===text&&activeRun.lang===lang)return;const id=++generation;if(!text){activeRun=null;$('run').disabled=false;$('status').textContent='원문을 입력해 주세요.';$('results').hidden=true;return}activeRun={id,text,lang};
$('run').disabled=true;$('status').textContent='어휘와 어형을 분석하고 있습니다…';$('results').hidden=true;$('localPanel').hidden=true;
try{const reverse=lang==='ko';const r=reverse?{natural:await window.translateKorean(text),literal:'',words:[]}:await window.analyzeHU(text);if(id!==generation)return;if(reverse&&!r.natural)throw Error();$('literal').textContent=r.literal;const meanings=r.vocabularyMeanings;const showMeanings=meanings?.length>1;$('naturalLabel').textContent=reverse?'헝가리어 번역':showMeanings?'한국어 뜻':'의역';$('natural').textContent=showMeanings?meanings.join('\n'):r.natural;$('words').replaceChildren();$('total').textContent=r.words.length;
r.words.forEach((word,index)=>$('words').append(wordCard(word,index)));$('results').hidden=false;$('status').textContent='';if(!reverse)setupLocalContext(text,r.words,id,r.grammarNotes);if(save){historyList=[{text,lang},...historyList.filter(x=>typeof x==='string'?x!==text:x.text!==text||x.lang!==lang)].slice(0,25);try{localStorage.setItem('magyar.history',JSON.stringify(historyList))}catch{}}}
catch{if(id===generation)$('status').textContent='분석을 완료하지 못했습니다. 연결을 확인하고 다시 시도해 주세요.'}finally{if(id===generation){activeRun=null;$('run').disabled=false}}}
function wordCard(word,index){
  const card=el('article','word'),top=el('div','wordtop');
  top.append(el('small','',String(index+1).padStart(2,'0')),el('span','tag',word.pos));
  const ambiguous=word.senses?.length>1 && word.unresolvedSenses?.length>1;
  card.append(top,el('h3','',word.word),el('p','',ambiguous?'가능한 뜻 '+word.senses.length+'개':word.meaning));
  if(word.senses?.length>1){
    const meanings=el('section','alternate-senses');
    const list=el('ol','word-senses');
    for(const meaning of word.senses){
      const item=el('li','',meaning);
      if(!ambiguous && meaning===word.meaning) item.append(el('span','sense-selected',' · 문맥상 뜻'));
      list.append(item);
    }
    meanings.append(el('h4','', '한국어 뜻'),list);
    card.append(meanings);
  }
  if(word.dictionaryDefinitions?.length && word.senses?.length<2){
    const definitions=el('details','alternate-senses');
    const list=el('ul','word-senses');
    for(const definition of word.dictionaryDefinitions)list.append(el('li','',definition));
    definitions.append(el('summary','','Wiktionary 영어 풀이'),list);
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
    word.senseReason?'문맥 · '+word.senseReason:''].filter(Boolean))details.append(el('div','',line));
  card.append(details);
  return card;
}
let localBusy=false;
function setupLocalContext(text,words,id,grammarNotes){
  const panel=$('localPanel'),button=$('localRun');
  if(words.length<2)return;
  panel.hidden=false;
  $('localTranslation').textContent='';
  $('localExplanation').textContent='';
  $('localExplanation').previousElementSibling.textContent='문장 구조와 핵심 문법';
  $('naturalLabel').textContent='의역';
  $('localStatus').textContent='';
  button.hidden=false;
  button.disabled=localBusy;
  button.onclick=async()=>{
    if(localBusy||id!==generation)return;
    localBusy=true;
    button.disabled=true;
    const progress=message=>{if(id===generation)$('localStatus').textContent=message};
    try{
      progress('기기 지원 여부를 확인하고 있습니다…');
      const {interpret,candidatesFor,cachedInterpretation,saveInterpretation}=await import('./local-context.js');
      const candidates=candidatesFor(words);
      const cached=cachedInterpretation(text);
      const result=cached||await interpret(text,candidates,progress,undefined,words,grammarNotes);
      if(!cached)saveInterpretation(text,result);
      if(id!==generation)return;
      $('localTranslation').textContent=result.translation;
      $('localExplanation').textContent=result.explanation||'문법 해설을 생성하지 못했습니다. 아래 어휘 분석을 참고해 주세요.';
      $('localExplanation').previousElementSibling.textContent=grammarNotes?'문장 구조와 핵심 문법 · 어형 규칙':'문장 구조와 핵심 문법 · AI 추정';
      $('natural').textContent=result.translation;
      $('naturalLabel').textContent='의역 · 기기 AI';
      result.choices.forEach((choice,i)=>{
        if(choice<0||!candidates[i]||choice>=candidates[i].senses.length)return;
        const {index,senses}=candidates[i];
        const card=$('words').children[index];
        const reading=el('div','alternate-senses','기기 모델의 풀이 · '+senses[choice]);
        card.querySelector('p').after(reading);
      });
      button.hidden=true;
      progress(cached?'이 브라우저에 저장된 AI 해석을 불러왔습니다.':'기기 AI의 해석입니다. 오류가 있을 수 있으며, 이 브라우저에 저장해 다음에 재사용합니다.');
    }catch(error){
      progress(error.message?.includes('WebGPU를')?error.message+' 위의 기본 해석을 이용해 주세요.':'기기 내 해석을 완료하지 못했습니다. 기본 해석을 보거나 다시 시도해 주세요.');
    }finally{localBusy=false;button.disabled=false}
  };
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>view(b.dataset.view));$('input').oninput=()=>{generation++;activeRun=null;$('run').disabled=false;$('results').hidden=true;$('status').textContent='';count()};document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&!e.isComposing&&!$('main').hidden){e.preventDefault();if(!e.repeat&&!$('run').disabled)run()}});$('run').onclick=()=>run();$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('direction').value==='ko'?document.getElementById('natural').textContent:'직역\n'+$('literal').textContent+'\n\n'+$('naturalLabel').textContent+'\n'+$('natural').textContent);$('status').textContent='번역을 복사했습니다.'}catch{$('status').textContent='브라우저에서 클립보드 접근을 허용해 주세요.'}};
const drafts={hu:$('input').value,ko:''};
let currentDirection='hu';
function setDirection(){
  drafts[currentDirection]=$('input').value;
  currentDirection=$('direction').value;
  const reverse=currentDirection==='ko';
  $('input').value=drafts[currentDirection];
  $('input').removeAttribute('placeholder');
  $('input').lang=reverse?'ko':'hu';
  $('quickLocal').disabled=reverse;
  $('input').setAttribute('aria-label',reverse?'한국어 원문':'헝가리어 원문');
  $('naturalLabel').textContent=reverse?'헝가리어 번역':'의역';
  $('literalPanel').hidden=reverse;
  $('wordHeading').hidden=reverse;
  $('words').hidden=reverse;
  $('results').classList.toggle('reverse',reverse);
  $('run').lastChild.textContent=reverse?'번역하기':'분석하기';
  $('input').oninput();
}
$('quickLocal').onclick=async()=>{
  if($('run').disabled)return;
  const original=$('input').value;
  await run();
  if(original!==$('input').value || $('direction').value!=='hu' || $('results').hidden)return;
  if($('localPanel').hidden){
    $('status').textContent='기기 AI로 해석할 헝가리어 문장을 입력해 주세요.';
    return;
  }
  $('localPanel').scrollIntoView({block:'nearest'});
  $('localRun').click();
};
$('direction').onchange=setDirection;
count();$('results').hidden=true;
