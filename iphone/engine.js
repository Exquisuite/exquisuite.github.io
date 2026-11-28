(() => {
  "use strict";
  const lex = Object.create(null);
  function add(pos, entries) {
    for (const entry of entries.split("|")) {
      const [lemma, meaning] = entry.split("=");
      lex[lemma] = {pos, meaning};
    }
  }
  add("명사", "könyv=책|kert=정원|ház=집|barát=친구|iskola=학교|alma=사과|asztal=탁자|macska=고양이|kutya=개|víz=물|város=도시|gyerek=아이|gyermek=아이|tanár=교사|diák=학생|bolt=가게|autó=자동차|busz=버스|vonat=기차|kenyér=빵|tej=우유|nap=날|reggel=아침|este=저녁|ember=사람|lány=소녀|fiú=소년|anya=어머니|apa=아버지|család=가족|szoba=방|ajtó=문|ablak=창문|virág=꽃|fa=나무|madár=새|kávé=커피|tea=차|étel=음식|nyelv=언어|mondat=문장|szó=단어|munka=일|könyvtár=도서관|egyetem=대학교|film=영화|zene=음악|levél=편지|piac=시장|pályaudvar=기차역|park=공원|tó=호수|tenger=바다|anyaország=모국|Magyarország=헝가리|Budapest=부다페스트");
  add("동사", "olvas=읽다|ír=쓰다|megy=가다|jön=오다|lát=보다|látogat=방문하다|szeret=좋아하다|tanul=배우다|tanít=가르치다|eszik=먹다|iszik=마시다|vesz=사다|alszik=자다|van=있다|beszél=말하다|ad=주다|él=살다|fut=달리다|ül=앉다|játszik=놀다|dolgozik=일하다|néz=보다|főz=요리하다|talál=찾다|akar=원하다|tud=알다|kér=부탁하다|utazik=여행하다|sétál=산책하다|vár=기다리다");
  add("형용사", "szép=아름답다|jó=좋다|nagy=크다|kicsi=작다|új=새롭다|régi=오래되다|magyar=헝가리의|koreai=한국의|piros=빨갛다|érdekes=흥미롭다|kedves=다정하다|finom=맛있다|hideg=차갑다|meleg=따뜻하다");
  add("부사", "tegnap=어제|ma=오늘|holnap=내일|most=지금|itt=여기|ott=저기|nagyon=매우|mindig=항상|már=이미|még=아직|együtt=함께|otthon=집에서|gyorsan=빠르게|nem=아니다|is=또한");
  add("관사", "a=그|az=그|egy=한");
  add("대명사", "én=나|te=너|ő=그 사람|mi=우리|ti=너희|ők=그들|ez=이것|mindenki=모두, 모든 사람");
  add("접속사", "és=그리고|de=그러나|vagy=또는|mert=왜냐하면|hogy=~라고");
  add("동사","érdekel=관심을 끌다|utál=몹시 싫어하다|imád=아주 좋아하다|vezet=운전하다, 이끌다|bízik=신뢰하다|keres=찾다");
  add("형용사","jó=좋다|rossz=나쁘다|gyors=빠르다|lassú=느리다|könnyű=쉽다, 가볍다|nehéz=어렵다, 무겁다|boldog=행복하다|szomorú=슬프다|hosszú=길다|rövid=짧다|magas=높다, 키가 크다|alacsony=낮다, 키가 작다|drága=비싸다, 소중하다|olcsó=싸다|fontos=중요하다|pontos=정확하다|csendes=조용하다|hangos=시끄럽다|erős=강하다|gyenge=약하다|ügyes=능숙하다|fáradt=피곤하다|unalmas=지루하다|kellemes=쾌적하다|szabad=자유롭다, 비어 있다|friss=신선하다|fiatal=젊다|öreg=늙다|sok=많다|kevés=적다");
  add("부사","jól=잘|rosszul=잘못, 서투르게|szépen=아름답게, 곱게|gyorsan=빠르게|lassan=천천히|könnyen=쉽게|nehezen=어렵게|boldogan=행복하게|szomorúan=슬프게|pontosan=정확히|csendesen=조용히|hangosan=큰 소리로|ügyesen=능숙하게|gyakran=자주|ritkán=드물게|néha=때때로|soha=결코, 한 번도|általában=보통, 대체로|rendszeresen=정기적으로|mostanában=요즘, 최근에|hamar=곧, 금세|korán=일찍|későn=늦게|rögtön=즉시|azonnal=즉시|majdnem=거의|talán=아마|eléggé=꽤, 충분히|különösen=특히|sokkal=훨씬|inkább=오히려, 차라리|valóban=정말로");
  add("부사","jobbra=오른쪽으로|balra=왼쪽으로|hatékonyan=효과적으로|egészségesen=건강하게|természetesen=당연히, 자연스럽게");
  add("형용사","egészséges=건강하다|hatékony=효과적이다|természetes=자연스럽다");
  add("후치사","után=~ 뒤에, ~ 후에|előtt=~ 앞에, ~ 전에|mellett=~ 옆에|között=~ 사이에|nélkül=~ 없이|miatt=~ 때문에|szerint=~에 따르면");
  add("수사","kettő=둘|három=셋|négy=넷|öt=다섯|hat=여섯|hét=일곱|nyolc=여덟|kilenc=아홉|tíz=열");
  add("명사","táska=가방|bőrönd=여행 가방|csomag=짐|kő=돌|doboz=상자|feladat=과제|kérdés=질문|vizsga=시험|teszt=시험|csapat=팀|cég=회사|csoport=집단|vállalat=기업|labda=공|hal=물고기");
  add("형용사","kék=파랗다");
  const attributive={jó:"좋은",rossz:"나쁜",gyors:"빠른",lassú:"느린",szép:"아름다운",nagy:"큰",kicsi:"작은",hosszú:"긴",rövid:"짧은",magas:"높은",alacsony:"낮은",érdekes:"흥미로운",fontos:"중요한",egészséges:"건강한",fiatal:"젊은",új:"새로운",régi:"오래된",nehéz:"어려운",könnyű:"쉬운"};
  const wordClasses={adj:"형용사",adv:"부사",conj:"접속사",pron:"대명사",num:"수사",postp:"후치사",intj:"감탄사",particle:"불변화사",det:"한정사",prep:"전치사",prefix:"접두사"};
  const dictionaryCache=new Map();
  async function classEntries(form){
    let hash=0;for(const c of form)hash=(hash*31+c.charCodeAt(0))%64;
    if(!dictionaryCache.has(hash)){
      dictionaryCache.set(hash,(async()=>{
        const r=await fetch(new URL("lexicon/"+hash+".json",document.baseURI));
        if(!r.ok)throw Error();
        return await r.json();
      })().catch(()=>{dictionaryCache.delete(hash);return {}}));
    }
    return (await dictionaryCache.get(hash))[form]||[];
  }
  const koreanDegrees={jobb:"더 좋다",legjobb:"가장 좋다",jobban:"더 잘",legjobban:"가장 잘",szebb:"더 아름답다",legszebb:"가장 아름답다",szebben:"더 아름답게",legszebben:"가장 아름답게"};
  const adverbBases={jól:"jó",rosszul:"rossz",gyorsan:"gyors",lassan:"lassú",szépen:"szép",könnyen:"könnyű",nehezen:"nehéz",szomorúan:"szomorú",boldogan:"boldog",pontosan:"pontos",csendesen:"csendes",hangosan:"hangos",ügyesen:"ügyes"};
  function classReading(word,rec,entries){
    const pos=wordClasses[rec.p],lemma=rec.l;
    const meaning=lex[lemma]?.pos===pos?lex[lemma].meaning:"";
    const degree=["원급","비교급","최상급"][rec.d||0];
    const fields={};
    if(rec.c)fields["비교급"]=rec.c;
    if(rec.s)fields["최상급"]=rec.s;
    if(rec.p==="adv" && adverbBases[lemma])fields["관련 형용사"]=adverbBases[lemma];
    const features=[rec.d||rec.c||rec.s?degree:"기본형"];
    const other=[...new Set(entries.filter(e=>e.p!==rec.p).map(e=>wordClasses[e.p]))];
    if(other.length)features.push("다른 품사 가능: "+other.join(", "));
    return {word,lemma,pos,meaning,definition:rec.g,degree:rec.d,fields,features,dictionaryDefinitions:[...new Set(entries.map(e=>e.g && {pos:wordClasses[e.p], meaning:e.g}).filter(Boolean).map(e=>e.pos+" · "+e.meaning))],
      parts:word.toLowerCase()===lemma?word:lemma+" → "+word,gloss:koreanDegrees[word.toLowerCase()]};
  }
  const labels = {
    NOM:"주격", SG:"단수", PL:"복수", ACC:"목적격", DAT:"여격 · 소유자 표시 가능", INS:"도구·동반격", PRP:"목적·이유격", TRANS:"변성격", TERM:"한계격", FRML:"자격격",
    "IN+ESS":"내격 · 안에서", "ON+ESS":"표면 위치격 · 위에서","AT+ESS":"근접 위치격 · 곁에서","IN+ALL":"내향격 · 안으로","ON+ALL":"표면 향격 · 위로","AT+ALL":"접근격 · 쪽으로","IN+ABL":"내부 이탈격 · 안에서부터","ON+ABL":"표면 이탈격 · 위에서부터","AT+ABL":"근접 이탈격 · 곁에서부터",
    LGSPEC1:"소유 대용형 · 단수 피소유물",LGSPEC2:"소유 대용형 · 복수 피소유물", BYWAY:"경유격", IND:"직설법", PRS:"현재", PST:"과거", FUT:"미래", INDF:"비한정 활용", DEF:"한정 활용", LGSPEC3:"2인칭 목적어", 1:"1인칭",2:"2인칭",3:"3인칭",COND:"조건법",SBJV:"접속·명령법",NFIN:"부정사","V.MSDR":"동명사","V.PTCP":"분사","V.CVB":"부사형", POT:"가능형"
  };
  for (const n of [1,2,3]) for (const s of ["S","P"]) labels["PSS"+n+s] = n+"인칭 "+(s==="S"?"단수":"복수")+" 소유자";
  const posName = {N:"명사",ADJ:"형용사",V:"동사"};
  const cases = {"ban":"IN+ESS","ben":"IN+ESS","ból":"IN+ABL","ből":"IN+ABL","ba":"IN+ALL","be":"IN+ALL","nak":"DAT","nek":"DAT","nál":"AT+ESS","nél":"AT+ESS","ról":"ON+ABL","ről":"ON+ABL","tól":"AT+ABL","től":"AT+ABL","ra":"ON+ALL","re":"ON+ALL","hoz":"AT+ALL","hez":"AT+ALL","höz":"AT+ALL","ért":"PRP","ig":"TERM","ként":"FRML","at":"ACC","et":"ACC","ot":"ACC","öt":"ACC","t":"ACC","on":"ON+ESS","en":"ON+ESS","ön":"ON+ESS","n":"ON+ESS"};
  const cache = new Map();
  async function lookup(form) {
    let key=0;
    for (const c of form) key=(key*31+c.charCodeAt(0))%64;
    if (!cache.has(key)) cache.set(key,(async () => {
      const response=await fetch(new URL("morph/"+key+".gz",document.baseURI));
      if (!response.ok) throw Error();
      const bytes=await response.arrayBuffer();
      const stream=new Uint8Array(bytes)[0]===31 ? new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip")) : new Blob([bytes]).stream();
      const lines=(await new Response(stream).text()).trim().split(/\r?\n/);
      const index=new Map();
      for (const line of lines) {
        const [lemma,word,tag]=line.split("\t");
        if (!word||!tag) continue;
        const k=word.toLowerCase();
        if (!index.has(k)) index.set(k,[]);
        index.get(k).push({lemma,tags:tag.split(";")});
      }
      return index;
    })().catch(() => {cache.delete(key);return new Map();}));
    return (await cache.get(key)).get(form)||[];
  }
  const examples = new Map();
  function sample(text,literal,natural,verified=false) {examples.set(text.toLowerCase().replace(/[.!?]+$/,""),{literal,natural,verified});}
  sample("A fiú jól olvas","그 / 소년이 / 잘 / 읽는다","소년이 글을 잘 읽는다.");
  sample("Ez egy jó könyv","이것은 / 한 권의 / 좋은 / 책이다","이것은 좋은 책이다.");
  sample("Tegnap egy könyvet olvastam a kertben","어제 / 한 / 책을 / 나는 읽었다 / 그 / 정원에서","어제 정원에서 책 한 권을 읽었다.");
  sample("A macska alszik","그 / 고양이가 / 잔다","고양이가 자고 있다.");
  sample("A házamban lakom","그 / 내 집 안에서 / 나는 산다","나는 내 집에서 산다.");
  sample("A házamban vagyok","그 / 내 집 안에 / 나는 있다","나는 내 집에 있다.");
  sample("Látom a kutyát","나는 본다 / 그 / 개를","나는 그 개를 본다.");
  sample("Rejtvényt fejtek","퍼즐을 / 나 풀다","나는 퍼즐을 풀다",true);
  add("명사","rejtvény=퍼즐|keresztrejtvény=십자말풀이|tej=우유|tehén=암소");
  add("동사","fejt=풀다|fej=젖을 짜다|rejt=숨기다");
  const manual={
    vagyok:["van","동사","직설법|현재|1인칭 단수","van → vagyok","나는 있다"],
    látom:["lát","동사","직설법|현재|1인칭 단수|한정 활용","lát + -om","나는 본다"],
    kutyát:["kutya","명사","목적격|단수","kutya → kutyá- + -t","개를"],
    könyvet:["könyv","명사","목적격|단수","könyv + -et","책을"],
    olvastam:["olvas","동사","직설법|과거|1인칭 단수|한정·비한정 활용 동형","olvas + -t + -am","나는 읽었다"],
    kertben:["kert","명사","내격 · 안에서|단수","kert + -ben","정원에서"],
    házamban:["ház","명사","1인칭 단수 소유자|내격 · 안에서|단수","ház + -am + -ban","내 집에서"],
    lakom:["lakik","동사","직설법|현재|1인칭 단수","lak- + -om","나는 산다"]
  };
  const manualTags={
    vagyok:["V","IND","PRS","INDF","1","SG"],látom:["V","IND","PRS","DEF","1","SG"],
    kutyát:["N","ACC","SG"],könyvet:["N","ACC","SG"],olvastam:["V","IND","PST","1","SG"],
    kertben:["N","IN+ESS","SG"],házamban:["N","PSS1S","IN+ESS","SG"],lakom:["V","IND","PRS","INDF","1","SG"]
  };
  lex.lakik={pos:"동사",meaning:"살다"};
  const translationCache = new Map();
  async function translate(text,langpair="hu|ko") {
    const key=langpair+text;
    if (translationCache.has(key)) return translationCache.get(key);
    if (new TextEncoder().encode(text).length>500) return "";
    const url=new URL("https://api.mymemory.translated.net/get");
    url.search=new URLSearchParams({q:text,langpair});
    try {
      const r=await fetch(url,{signal:AbortSignal.timeout(8500)});
      if (!r.ok) return "";
      const data=await r.json(), val=data.responseData?.translatedText;
      if (+data.responseStatus!==200 || !val || data.quotaFinished) return "";
      const decoded=val.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&");
      translationCache.set(key,decoded);
      return decoded;
    } catch {return "";}
  }
  function segment(form,lemma) {
    const root=lemma.toLowerCase();
    if (form===root) return form;
    let i=0;while(i<root.length && form[i]===root[i])i++;
    if(i===root.length) return root+" + -"+form.slice(i);
    return lemma+" → "+form;
  }
  // Each row gives the full-form ending and the Korean reading for people and things.
  const pronounCases = new Map();
  function pronounCase(endings, fullEnding, caseName, person, thing) {
    for (const ending of endings.split('/')) pronounCases.set(ending, {fullEnding,caseName,person,thing});
  }
  pronounCase('t/at/et/ot/öt','t','목적격','누군가를','무언가를');
  pronounCase('nak/nek','nek','여격','누군가에게','무언가에');
  pronounCase('val/vel','vel','도구·동반격','누군가와','무언가로');
  pronounCase('ban/ben','ben','내격','누군가 안에서','무언가 안에서');
  pronounCase('ba/be','be','내향격','누군가 안으로','무언가 안으로');
  pronounCase('ból/ből','ből','내부 이탈격','누군가 안에서부터','무언가 안에서부터');
  pronounCase('n/on/en/ön','n','표면 위치격','누군가 위에서','무언가 위에서');
  pronounCase('ra/re','re','표면 향격','누군가에게로','무언가 위로');
  pronounCase('ról/ről','ről','표면 이탈격 · 화제 표시','누군가에게서 / 누군가에 관하여','무언가에서 / 무언가에 관하여');
  pronounCase('nál/nél','nél','근접 위치격','누군가 곁에서','무언가 곁에서');
  pronounCase('hoz/hez/höz','hez','접근격','누군가에게로','무언가 쪽으로');
  pronounCase('tól/től','től','근접 이탈격','누군가에게서','무언가로부터');
  pronounCase('ért','ért','목적·이유격','누군가를 위해','무언가를 위해');
  pronounCase('ig','ig','한계격','누군가까지','무언가까지');
  pronounCase('ként','ként','자격격','누군가로서','무언가로서');
  pronounCase('vá/vé','vé','변성격','누군가로','무언가로');
  function abbreviatedPronoun(word) {
    const match = /^(vk|vm)(.*)$/u.exec(word.toLowerCase());
    if (!match) return null;
    const human = match[1] === 'vk';
    const lemma = human ? 'valaki' : 'valami';
    const meaning = human ? '누군가' : '무언가';
    const tail = match[2];
    // Prefer an exact ending (e.g. vm-ig), then try the conventional vki/vmi spelling.
    let ending = tail.replace(/^-/,'');
    if (!pronounCases.has(ending)) ending = tail.replace(/^i-?/,'');
    const form = pronounCases.get(ending);
    if (!form && ending) return null;
    const expanded = lemma + (form?.fullEnding || '');
    const reading = form ? (human ? form.person : form.thing) : meaning;
    return {word, lemma, pos:'대명사', meaning, expanded, caseName:form?.caseName || "주격", caseEnding:form?.fullEnding || "", gloss:reading,
      features:form ? ['부정대명사',form.caseName+' · '+reading] : ['부정대명사','기본형'],
      parts:form ? word+' → '+lemma+' + -'+form.fullEnding+' → '+expanded : word+' → '+lemma};
  }
  // These are case-marked personal pronouns, not possessed nouns.
  const personalLocations = new Map([
    ["nálam", "én", "1", "SG", "나", "우리 집에서는", "am"],
    ["nálad", "te", "2", "SG", "너", "너희 집에서는", "ad"],
    ["nála", "ő", "3", "SG", "그 사람", "그 사람 집에서는", "a"],
    ["nálunk", "mi", "1", "PL", "우리", "우리 집에서는", "unk"],
    ["nálatok", "ti", "2", "PL", "너희", "너희 집에서는", "atok"],
    ["náluk", "ők", "3", "PL", "그들", "그들 집에서는", "uk"]
  ].map(([form,lemma,person,number,ko,home,ending])=>[form,{lemma,person,number,ko,home,ending}]));
  function personalLocation(word){
    const entry=personalLocations.get(word.toLowerCase());
    if(!entry)return null;
    return {word,lemma:entry.lemma,pos:"대명사",meaning:entry.ko+" 곁에 / "+entry.ko+" 집에·집에서",
      tags:["PRO","AT+ESS",entry.person,entry.number],
      features:["인칭대명사의 근접 위치격",entry.person+"인칭 "+(entry.number==="PL"?"복수":"단수")],
      parts:"nál- + -"+entry.ending,gloss:entry.ko+" 쪽에서는",
      senseReason:"-nál/-nél에 인칭어미가 붙은 형태입니다. 문맥에 따라 곁에, 집에서, 소속 집단에서를 뜻합니다."};
  }
  async function parse(word) {
    const location=personalLocation(word);
    if(location)return location;
    const abbreviation = abbreviatedPronoun(word);
    if (abbreviation) return abbreviation;
    const form=word.toLowerCase();
    const local=manual[form];
    if (local) return {word,lemma:local[0],pos:local[1],meaning:lex[local[0]].meaning,features:local[2].split("|"),parts:local[3],gloss:local[4],tags:manualTags[form]||[]};
    const known=lex[form];
    const entries=await classEntries(form);
    const preferred=entries.find(e=>wordClasses[e.p]===known?.pos) ||
      (!known && (entries.find(e=>e.d) || entries[0]));
    if(preferred)return classReading(word,preferred,entries);
    if (known && !["명사","동사","형용사"].includes(known.pos)) {
      const feature=known.pos==="관사"?(form==="egy"?"부정관사 · 수사 ‘하나’로도 쓰임":"정관사"):"불변화형";
      return {word,lemma:form,...known,features:[feature],parts:form};
    }
    let rows=await lookup(form);
    if (!rows.length) {
      for (const [lemma,[prefix,base]] of Object.entries(prefixedVerbs)) {
        if (!form.startsWith(prefix)) continue;
        const baseForm=form.slice(prefix.length);
        const matches=(await lookup(baseForm)).filter(row=>row.lemma===base && row.tags[0]==="V");
        if(matches.length){rows=matches.map(row=>({...row,lemma}));break;}
      }
    }
    let suffix="";
    if (!rows.length) {
      for (const [ending,tag] of Object.entries(cases)) {
        if (!form.endsWith(ending) || form.length<=ending.length) continue;
        const base=form.slice(0,-ending.length);
        for (const candidate of new Set([base,base.replace(/á$/,"a").replace(/é$/,"e")])) {
          const possessed=(await lookup(candidate)).filter(row=>row.tags[0]==="N"&&row.tags.some(t=>t.startsWith("PSS")));
          if(possessed.length){rows=possessed.map(row=>({...row,tags:[...row.tags,tag]}));suffix=ending;break;}
        }
        if(rows.length)break;
      }
    }
    // Instrumental -val/-vel assimilates to a final consonant, including after
    // possessive endings: barátom + -val -> barátommal. Verify candidate stems
    // against the bundled morphology rather than guessing a lexical meaning.
    if (!rows.length) {
      const candidates=[];
      if(/(?:val|vel)$/u.test(form))candidates.push(form.slice(0,-3));
      const doubled=/^(.+)([bcdfghjklmnpqrstvwxyz])\2(?:al|el)$/u.exec(form);
      if(doubled)candidates.push(doubled[1]+doubled[2]);
      for(const [ending,stem] of [["ccsal","cs"],["ccsel","cs"],["ggyal","gy"],["ggyel","gy"],["nnyal","ny"],["nnyel","ny"],["sszal","sz"],["sszel","sz"],["ttyal","ty"],["ttyel","ty"],["zzsal","zs"],["zzsel","zs"]]){
        if(form.endsWith(ending))candidates.push(form.slice(0,-ending.length)+stem);
      }
      for(const candidate of candidates){
        const nouns=(await lookup(candidate)).filter(row=>row.tags[0]==="N");
        if(nouns.length){rows=nouns.map(row=>({...row,tags:[...row.tags.filter(t=>t!=="NOM"),"INS"]}));break;}
      }
    }
    const main=rows.find(r=>lex[r.lemma]?.pos===posName[r.tags[0]])||rows[0];
    const lemma=main?.lemma||form;
    const meaning=lex[lemma]?.meaning||lex[word]?.meaning||"";
    const features=main?main.tags.slice(1).map(t=>labels[t]||t):[known?"기본형":"형태 미확인"];
    const alternatives=rows.filter(r=>r!==main).map(r=>r.lemma+" ("+r.tags.map(t=>labels[t]||posName[t]||t).join(" · ")+")");
    if(alternatives.length)features.push("다른 분석: "+[...new Set(alternatives)].join(" / "));
    return {word,lemma,pos:posName[main?.tags[0]]||known?.pos||"미확인",meaning,features,parts:suffix?segment(form.slice(0,-suffix.length),lemma)+" + -"+suffix:segment(form,lemma),tags:main?.tags||[],analyses:rows.map(row=>({lemma:row.lemma,tags:row.tags}))};
  }
  // Only registered combinations inherit the base verb's paradigm.
  const preverbs = {
    ki: "안에서 밖으로. kimos에서는 씻어서 때나 얼룩을 없애거나 속을 씻어 냄",
    el: "기준점에서 멀어짐. 일부 동사에서는 동작의 완료를 나타냄",
    meg: "동작의 완료나 결과를 나타낼 수 있음",
    be: "밖에서 안으로 들어가는 방향",
    vissza: "이전 위치나 상태로 되돌아가는 방향",
    fel: "위쪽 방향. 일부 동사에서는 동작의 시작이나 완료를 나타냄",
    le: "아래쪽 방향. 일부 동사에서는 동작의 완료를 나타냄"
  };
  const prefixedVerbs = {
    kimos: ["ki", "mos"], elköltözik: ["el", "költözik"],
    megmos: ["meg", "mos"], beköltözik: ["be", "költözik"],
    visszaköltözik: ["vissza", "költözik"], elolvas: ["el", "olvas"],
    felolvas: ["fel", "olvas"], leír: ["le", "ír"], megír: ["meg", "ír"]
  };
  const derivedStems = {
    rejtvény: ["rejt", "vény", "숨기다", "동사에서 명사를 만듦"],
    mosás: ["mos", "ás", "씻다", "동작을 나타내는 명사를 만듦"],
    olvasás: ["olvas", "ás", "읽다", "동작을 나타내는 명사를 만듦"],
    írás: ["ír", "ás", "쓰다", "동작이나 그 결과를 나타내는 명사를 만듦"],
    mosogat: ["mos", "ogat", "씻다", "반복하거나 이어서 하는 동작을 나타냄"],
    szépség: ["szép", "ség", "아름답다", "성질이나 상태를 나타내는 명사를 만듦"],
    gyorsan: ["gyors", "an", "빠르다", "동작의 방식을 나타내는 부사를 만듦"],
    természetes: ["természet", "es", "자연", "명사에서 성질을 나타내는 형용사를 만듦"],
    természetesen: ["természetes", "en", "자연스럽다", "동작의 방식이나 화자의 태도를 나타내는 부사를 만듦"]
  };
  const ikStems = new Set(["költözik", "lakik", "dolgozik", "utazik", "játszik", "eszik", "iszik", "alszik", "bízik"]);
  const markerLabels = {
    PST: "과거", COND: "조건법", SBJV: "접속·명령법", PL: "복수",
    PSS1S: "1인칭 단수 소유자", PSS2S: "2인칭 단수 소유자", PSS3S: "3인칭 단수 소유자",
    PSS1P: "1인칭 복수 소유자", PSS2P: "2인칭 복수 소유자", PSS3P: "3인칭 복수 소유자"
  };
  function morphology(word) {
    const form = word.word.toLowerCase();
    const tags = word.tags || [];
    const compound = Object.hasOwn(prefixedVerbs, word.lemma) && prefixedVerbs[word.lemma];
    const [prefix, base] = compound || ["", word.lemma.toLowerCase()];
    const body = prefix && form.startsWith(prefix) ? form.slice(prefix.length) : form;
    const stem = ikStems.has(base) ? base.slice(0, -2) : base;
    const parts = [];
    const part = (kind, text, reading) => parts.push({kind, text, reading});
    const root = (name, displayed) => {
      const derived = Object.hasOwn(derivedStems, name) && derivedStems[name];
      if (!derived) {
        const meaning = (readingsFor(name, posName[tags[0]]===word.pos ? tags[0] : undefined) || [lex[name]?.meaning]).filter(Boolean).join(" / ");
        part("어근", displayed, [name === displayed ? "" : "기본형 " + name, meaning].filter(Boolean).join(" · "));
      } else {
        const [parent, suffix, meaning, role] = derived;
        if (Object.hasOwn(derivedStems, parent)) root(parent, parent);
        else part("어근", parent, meaning);
        part("파생접사", "-" + suffix, role);
      }
    };
    if (prefix && form.startsWith(prefix)) {
      const explanation = word.lemma === "elköltözik" ? "기준점에서 멀어짐. 이 단어에서는 기존 거주지를 떠남" : preverbs[prefix];
      part("전철", prefix + "-", explanation + " · 기본 동사 " + base);
    }
    const pos = tags[0];
    if ((!pos && word.pos === "미확인") || !body.startsWith(stem) && !body.startsWith(stem.replace(/[ae]$/u, c => c === "a" ? "á" : "é"))) {
      part("미분리", body, "어간 교체 또는 결합 경계를 확인하지 못함 · 기본형 " + base);
      return parts;
    }
    const displayedStem = body.slice(0, stem.length);
    if (displayedStem !== stem && Object.hasOwn(derivedStems, base)) {
      part("미분리", body, "파생형의 표면 경계를 확인하지 못함 · 기본형 " + base);
      return parts;
    }
    root(base, displayedStem);
    let tail = body.slice(stem.length);
    if (!tail) {
      if (pos === "V" && tags.includes("PRS") && tags.includes("3") && tags.includes("SG") && tags.includes("INDF")) {
        part("어미소", "∅", "현재 직설법 3인칭 단수 비한정 · 표면에 어미 없음");
      }
      return parts;
    }
    if (pos === "V") {
      const verbEnding = tags.filter(tag => /^(?:[123]|SG|PL|DEF|INDF|LGSPEC3)$/u.test(tag)).map(tag => labels[tag]).join(" · ");
      if (tags.includes("NFIN") && tail === "ni") part("파생접사", "-ni", "부정사를 만듦");
      else if (tags.includes("V.MSDR") && /^(?:ás|és)$/u.test(tail)) part("파생접사", "-" + tail, "동작 명사를 만듦");
      else if (tail === "ik" && ikStems.has(base) && tags.includes("PRS") && tags.includes("3") && tags.includes("SG")) {
        part("어미소", "-ik", "현재 직설법 3인칭 단수 비한정 · -ik 동사의 기본형");
      } else if (tags.includes("IND") || tags.includes("COND") || tags.includes("SBJV")) {
        const markers = [["PST", /^(?:ott|ett|ött|tt|t)/u], ["COND", /^(?:ná|né|na|ne|n)/u], ["SBJV", /^j/u]];
        const marker = markers.find(([tag]) => tags.includes(tag));
        if (marker) {
          const value = tail.match(marker[1])?.[0];
          if (!value) {
            part("미분리", "-" + tail, "시제·법 표지와 인칭 어미의 경계를 확인하지 못함");
            return parts;
          }
          part("기호소", "-" + value, markerLabels[marker[0]]);
          tail = tail.slice(value.length);
        }
        if (tail || marker) part("어미소", tail ? "-" + tail : "∅", verbEnding);
      } else part("미분리", "-" + tail, "비정형 접사의 경계를 확인하지 못함");
    } else if (pos === "N") {
      let caseEnding = Object.keys(cases).sort((a,b) => b.length-a.length).find(ending => tail.endsWith(ending) && tags.includes(cases[ending]));
      let caseTag = caseEnding && cases[caseEnding];
      if (tags.includes("INS")) {
        const prior = body.slice(0, -3);
        const instrumental = tail.match(/(?:val|vel)$/u)?.[0] ||
          (prior && prior.endsWith(body.at(-3)) ? tail.match(/.[ae]l$/u)?.[0] : "");
        if (instrumental) { caseEnding = instrumental; caseTag = "INS"; }
      }
      if (caseEnding) tail = tail.slice(0,-caseEnding.length);
      const owner = tags.find(tag => /^PSS[123][SP]$/u.test(tag));
      const ownerEndings = {
        PSS1S:/^(?:[aoeö]?m)$/u, PSS2S:/^(?:[aoeö]?d)$/u, PSS3S:/^(?:j?[aeáé])$/u,
        PSS1P:/^(?:[auü]?nk)$/u, PSS2P:/^(?:[aoeö]?t[oeö]k)$/u, PSS3P:/^(?:j?[uü]k)$/u
      };
      if (owner && !tags.includes("PL") && ownerEndings[owner].test(tail)) {
        part("기호소", "-" + tail, markerLabels[owner]);
        tail = "";
      } else if (tail && tags.includes("PL") && !owner && /^(?:[aeoö]?k)$/u.test(tail)) {
        part("기호소", "-" + tail, "복수 · 연결 모음이 있으면 함께 표시");
        tail = "";
      }
      if (tail) part("미분리", "-" + tail, "명사 접사의 경계를 확인하지 못함");
      if (caseEnding) part("어미소", "-" + caseEnding, labels[caseTag]);
    } else part("미분리", "-" + tail, "표면형의 접사 경계를 확인하지 못함");
    return parts;
  }
  const particles={ACC:"을/를",DAT:"에게",INS:"와/과 함께",PRP:"을/를 위해",TRANS:"(으)로",TERM:"까지",FRML:"(으)로서","IN+ESS":" 안에서","ON+ESS":" 위에서","AT+ESS":" 곁에서","IN+ALL":" 안으로","ON+ALL":" 위로","AT+ALL":" 쪽으로","IN+ABL":" 안에서부터","ON+ABL":" 위에서부터","AT+ABL":" 곁에서부터"};
  function koreanParticle(value,suffix){
    const last=value.charCodeAt(value.length-1);
    if(last<0xac00||last>0xd7a3)return suffix;
    const final=(last-0xac00)%28;
    return suffix.replace(/을\/를/g,final?"을":"를").replace(/와\/과/g,final?"과":"와").replace(/\(으\)로/g,final&&final!==8?"으로":"로");
  }
  function gloss(w) {
    if(w.gloss)return w.gloss;
    let value=w.meaning||"["+w.word+"]";
    const tags=w.tags||[];
    if(tags[0]==="V"){
      const person=tags.find(t=>["1","2","3"].includes(t));
      return [person&&person!=="3"?((tags.includes("PL")?["우리","너희"]:["나","너"])[Number(person)-1]):"", value,tags.includes("PST")?"(과거)":tags.includes("COND")?"(조건)":"",tags.includes("SBJV")?"(접속·명령)":""].filter(Boolean).join(" ");
    }
    const poss=tags.find(t=>t.startsWith("PSS"));
    if(poss)value=({"PSS1S":"내","PSS2S":"네","PSS3S":"그 사람의","PSS1P":"우리의","PSS2P":"너희의","PSS3P":"그들의"})[poss]+" "+value;
    if(tags.includes("PL"))value+="들";
    return value+koreanParticle(value,particles[tags.find(t=>particles[t])]||"");
  }
  const sizeSense="꽤, 제법 (정도 강조 · szép nagy = 꽤 큰)";
  const senseFamilies=Object.assign(Object.create(null),{
    kimos:["(옷 등을) 빨다, 깨끗이 씻다","(때·얼룩을) 씻어 빼다","(용기 안을) 씻어 내다"],
    mos:["(물로) 씻다","(옷을) 빨다"],
    elköltözik:["(살던 곳을 떠나) 이사 가다"],
    költözik:["(거주지를 바꾸어) 이사하다","(다른 장소로) 거처를 옮기다"],
    megmos:["(몸·과일 등을) 씻다"], beköltözik:["(집·방에) 이사 들어오다"],
    visszaköltözik:["(전에 살던 곳으로) 다시 이사하다"],
    elolvas:["(글을) 읽다, 끝까지 읽다"], felolvas:["(글을) 소리 내어 읽다"],
    leír:["(말이나 생각을) 적다","(모습·상황을) 묘사하다","(자산 등을) 장부에서 상각하다"],
    megír:["(글·편지 등을) 쓰다, 써 마치다"],
    mosás:["씻기","빨래, 세탁"], olvasás:["읽기","독서"], írás:["쓰기","글, 문서","문자, 필적"],
    mosogat:["설거지하다"], szépség:["아름다움","미인"],
    fa:["나무 (식물)","나무, 목재 (재료)"], fej:["머리","(조직의) 우두머리","(우유를) 짜다"],
    fejt:["(퍼즐·암호를) 풀다","(광물을) 채굴하다","(실밥·뜨개질을) 뜯어 풀다"],
    száj:["입","(병·동굴 등의) 입구"], szem:["눈","(곡식·과일 등의) 낱알"],
    kulcs:["열쇠","(문제 해결의) 열쇠","(음악) 음자리표"],
    kor:["나이","시대"], lap:["낱장","(책의) 쪽","신문, 잡지"],
    kar:["팔","(대학의) 학부","합창단"], óra:["시계","시간 (60분)","수업"],
    jár:["걸어 다니다","정기적으로 다니다","(시계·기계가) 작동하다","(급여·권리 등이) 주어지다"],
    áll:["서 있다","(움직이다가) 멈춰 있다","(~로) 이루어져 있다"],
    ér:["(장소·수준에) 닿다, 도달하다","값이 나가다, 가치가 있다","혈관"],
    tart:["쥐다, 붙들다","(회의·수업을) 열다, 진행하다","(시간이) 지속되다","(~을 ~라고) 여기다"],

    szép:["아름답다, 예쁘다","상당한, 제법 많은",sizeSense],
    valójában:["실제로","사실은"], igazából:["실은, 사실은","실제로"],
    tulajdonképpen:["사실은","엄밀히 말하면, 본질적으로"],
    vezet:["운전하다","이끌다, 안내하다","운영하다, 경영하다"],könnyű:["쉽다","가볍다"],nehéz:["어렵다","무겁다"],
    vár:["기다리다","성"],ég:["하늘","타다"],fog:["잡다","이, 치아","~할 것이다 (미래 조동사)"],
    él:["살다, 살아 있다","거주하다","날, 모서리"],lakik:["거주하다"],
    nap:["해, 태양","날, 하루"],levél:["편지","나뭇잎"],nyelv:["언어","혀"],
    keres:["찾다","돈을 벌다"],tud:["알다","~할 줄 알다, ~할 수 있다"],vesz:["사다","취하다, 받다","(숨을) 쉬다"]
  });
  const senseVehicles=new Set(["autó","busz","teherautó","gépkocsi","jármű"]);
  const senseGroups=new Set(["csapat","cég","csoport","vállalat","ember","diák","gyerek","gyermek","valaki"]);
  const senseWeight=new Set(["táska","bőrönd","csomag","kő","doboz"]);
  const senseDifficulty=new Set(["feladat","kérdés","vizsga","teszt","munka"]);
  function senseClause(words,text,index){
    const matches=[...text.matchAll(/[\p{L}\p{M}\p{N}]+(?:[-’'][\p{L}\p{M}\p{N}]+)*/gu)];
    const boundary=(left,right)=>/[.!?。！？;:]/u.test(text.slice((matches[left]?.index||0)+(matches[left]?.[0].length||0),matches[right]?.index||0));
    const connector=word=>["és","de","mert","hogy","ha","hanem"].includes(word.word.toLowerCase());
    let start=index,end=index+1;
    while(start>0&&!boundary(start-1,start)&&!connector(words[start-1]))start--;
    while(end<words.length&&!boundary(end-1,end)&&!connector(words[end]))end++;
    const current=matches[index], next=matches[index+1];
    const adjacent=Boolean(current && next && /^\s+$/u.test(text.slice(current.index+current[0].length,next.index)));
    return {words:words.slice(start,end),index:index-start,adjacent};
  }
  function readingsFor(lemma,part){
    const family=senseFamilies[lemma];
    if(lemma!=="fej")return family;
    return part==="V"?family.slice(2):part==="N"?family.slice(0,2):family;
  }
  function senseTags(word){return word.tags||[];}
  function senseHas(word,tag){return senseTags(word).includes(tag);}
  function senseNominal(word){return word.pos==="명사"||word.pos==="대명사";}
  function senseNominative(word){return senseNominal(word)&&!senseTags(word).some(tag=>["ACC","DAT","INS","PRP","IN+ESS","ON+ESS","AT+ESS","IN+ALL","ON+ALL","AT+ALL","IN+ABL","ON+ABL","AT+ABL"].includes(tag));}
  function chooseSenseReading(word,part){
    if(senseTags(word)[0]===part)return true;
    const reading=word.analyses?.find(row=>row.tags[0]===part);
    if(!reading)return false;
    word.tags=[...reading.tags];word.lemma=reading.lemma;word.pos=posName[part];
    word.features=reading.tags.slice(1).map(tag=>labels[tag]||tag);
    if(new Set(word.analyses.map(row=>row.tags[0])).size>1)word.features.push("다른 품사 분석도 가능 · 문장 성분에 따라 선택");
    return true;
  }
  const subjects = {
    én:["1","SG"], te:["2","SG"], ő:["3","SG"], mi:["1","PL"], ti:["2","PL"], ők:["3","PL"]
  };
  const verbObjects = {
    fejt:new Set(["rejtvény","keresztrejtvény","kód","szén","érc","varrás","kötés"]),
    fej:new Set(["tej","tehén","kecske","juh"])
  };
  function resolveReadings(words,text){
    for(let index=0;index<words.length;index++){
      const word=words[index];
      if(!word.analyses || word.analyses.length<2)continue;
      const context=senseClause(words,text,index),clause=context.words,at=context.index;
      const finite=word.analyses.filter(row=>row.tags[0]==="V" && row.tags.some(tag=>["IND","COND","SBJV"].includes(tag)));
      // If parts of speech compete, existing part-of-speech rules make that decision.
      if(finite.length<2 || word.analyses.some(row=>["N","ADJ"].includes(row.tags[0])))continue;
      let candidates=finite,evidence=[];
      const restrict=(predicate,reason)=>{
        const matches=candidates.filter(predicate);
        if(matches.length && matches.length<candidates.length){candidates=matches;evidence.push(reason);}
      };
      const explicit=clause.filter((candidate,i)=>i!==at && candidate.word.toLowerCase()===candidate.lemma && Object.hasOwn(subjects,candidate.lemma));
      if(explicit.length===1 && clause.filter(candidate=>candidate.pos==="동사").length===1){
        const [person,number]=subjects[explicit[0].lemma];
        restrict(row=>row.tags.includes(person)&&row.tags.includes(number),explicit[0].word+"의 인칭·수");
      }
      const nearby=clause.slice(Math.max(0,at-2),at+3);
      const objects=nearby.filter(candidate=>senseHas(candidate,"ACC"));
      if(objects.length===1){
        const object=objects[0];
        const article=clause[clause.indexOf(object)-1]?.word.toLowerCase();
        if(["a","az","egy"].includes(article)){
          const conjugation=article==="egy"?"INDF":"DEF";
          restrict(row=>row.tags.includes(conjugation),article+"가 붙은 목적어의 한정성");
        }
        const compatible=candidates.filter(row=>Object.hasOwn(verbObjects,row.lemma)&&verbObjects[row.lemma].has(object.lemma));
        if(new Set(compatible.map(row=>row.lemma)).size===1){
          restrict(row=>row.lemma===compatible[0].lemma,object.word+"의 뜻");
        }
      }
      if(candidates.length!==1 || !evidence.length)continue;
      const reading=candidates[0];
      if(word.lemma!==reading.lemma)word.meaning=lex[reading.lemma]?.meaning||"";
      word.lemma=reading.lemma;
      word.tags=reading.tags;
      word.pos=posName[reading.tags[0]];
      word.parts=segment(word.word.toLowerCase(),reading.lemma);
      word.features=reading.tags.slice(1).map(tag=>labels[tag]||tag);
      word.readingReason=evidence.join(" 및 ")+"에 맞는 활용을 선택했습니다.";
    }
  }
  function contextualSenses(words,text,preserveAbbreviations){
    for(let index=0;index<words.length;index++){
      const word=words[index],family=readingsFor(word.lemma,word.tags?.[0]);
      if(!family || (word.lemma==="szép" && word.word.toLowerCase()!=="szép"))continue;
      const context=senseClause(words,text,index),clause=context.words,at=context.index;
      const previous=clause[at-1],next=clause[at+1];
      const objectWords=clause.filter(candidate=>candidate!==word&&(senseHas(candidate,"ACC")||candidate.caseEnding==="t"));
      let selected="",reason="";
      const cueGroups={
        nap:[["süt","ragyog"],["minden","eltelik","múlik"]],
        levél:[["ír","küld","postáz","olvas"],["lehull","hervad"]],
        nyelv:[["beszél","tanul","tanít"],["kinyújt","harap"]],
        keres:[[],["pénz"]],vesz:[["kenyér","jegy"],[],["levegő"]],tud:[[],[]],
        kimos:[["ruha","ing","nadrág","törölköző"],["folt"],["üveg","palack","edény"]],
        fejt:[["rejtvény","keresztrejtvény","találós kérdés","kód"],["szén","érc"],["varrás","kötés"]]
      };
      if(Object.hasOwn(cueGroups,word.lemma)){
        const nearby=["vesz","keres","kimos","fejt"].includes(word.lemma)?objectWords:clause.filter(candidate=>candidate!==word&&candidate.pos!=="관사"&&Math.abs(clause.indexOf(candidate)-at)<=2);
        const hits=cueGroups[word.lemma].flatMap((lemmas,i)=>{
          const cue=nearby.find(candidate=>lemmas.includes(candidate.lemma)||lemmas.includes(candidate.word.toLowerCase()));
          return cue?[{i,cue}]:[];
        });
        if(word.lemma==="tud"&&next&&senseHas(next,"NFIN"))hits.push({i:1,cue:next});
        if(hits.length===1){
          selected=family[hits[0].i];
          reason="‘"+hits[0].cue.word+"’와 함께 쓰여 ‘"+selected+"’로 풀이했습니다.";
        }
      }else if(word.lemma==="szép" && next){
        const form=next.word.toLowerCase();
        const adjacent=context.adjacent;
        if(adjacent && ["nagy","hosszú","messze"].includes(form)){
          selected=family[2];reason="뒤 표현의 정도를 강조하므로 ‘꽤, 제법’으로 풀이했습니다.";
        }else if(adjacent && ["összeg","szám"].includes(next.lemma)){
          selected=family[1];reason="수량이나 금액이 상당하다는 뜻입니다.";
        }else if(adjacent && ["virág","lány","ház","kert"].includes(next.lemma)){
          selected=family[0];reason="뒤 명사의 아름다움을 나타냅니다.";
        }
      }else if(word.lemma==="vezet"){
        if(objectWords.length&&objectWords.every(candidate=>senseVehicles.has(candidate.lemma))){selected=family[0];reason="목적격으로 표시된 차량이 목적어여서 ‘운전하다’로 풀이했습니다.";}
        else if(objectWords.length&&objectWords.every(candidate=>["cég","vállalat"].includes(candidate.lemma))){selected=family[2];reason="목적격으로 표시된 회사·기업이 목적어여서 ‘운영하다, 경영하다’로 풀이했습니다.";}
        else if(objectWords.length&&objectWords.every(candidate=>senseGroups.has(candidate.lemma))){selected=family[1];reason="목적격으로 표시된 사람·집단이 목적어여서 ‘이끌다, 안내하다’로 풀이했습니다.";}
      }else if(["könnyű","nehéz"].includes(word.lemma)){
        let target;
        for(let n=at+1;n<Math.min(clause.length,at+4);n++){
          if(clause[n].pos==="관사"||clause[n].pos==="형용사")continue;
          if(senseNominal(clause[n]))target=clause[n];
          break;
        }
        if(!target&&(!clause.some(candidate=>candidate.pos==="동사"&&candidate.lemma!=="van"))){
          const subjects=clause.filter(candidate=>candidate!==word&&senseNominative(candidate));
          if(subjects.length===1)target=subjects[0];
        }
        if(target&&senseWeight.has(target.lemma)){selected=family[1];reason=`${target.word}가 무게를 가진 물체를 가리켜 무게의 뜻으로 풀이했습니다.`;}
        else if(target&&senseDifficulty.has(target.lemma)){selected=family[0];reason=`${target.word}가 과제·질문·일을 가리켜 난이도의 뜻으로 풀이했습니다.`;}
      }else if(["vár","ég","fog","él"].includes(word.lemma)){
        const isNoun=senseTags(word)[0]==="N";
        const nounCue=previous&&(previous.pos==="관사"||previous.pos==="형용사")&&previous.word.toLowerCase()!=="nem";
        const otherSubject=clause.some(candidate=>candidate!==word&&senseNominative(candidate));
        const infinitives=clause.filter(candidate=>candidate!==word&&senseHas(candidate,"NFIN"));
        if(word.lemma==="fog"&&!nounCue&&infinitives.length===1&&chooseSenseReading(word,"V")){
          selected=family[2];reason="같은 절의 동사 부정사와 결합하여 미래를 나타내는 조동사입니다.";
        }else if((isNoun&&senseTags(word).some(tag=>tag!=="N"&&tag!=="NOM"&&tag!=="SG")||nounCue)&&chooseSenseReading(word,"N")){
          selected=word.lemma==="vár"?family[1]:word.lemma==="él"?family[2]:family[0+(word.lemma==="fog")];
          reason="명사의 격·소유·복수 표시 또는 앞의 관사·형용사가 명사 해석을 뒷받침합니다.";
        }else if((senseTags(word)[0]==="V"&&word.word.toLowerCase()!==word.lemma&&!word.analyses?.some(row=>row.tags[0]==="N")||otherSubject||objectWords.length)&&chooseSenseReading(word,"V")){
          selected=word.lemma==="vár"?family[0]:word.lemma==="ég"?family[1]:word.lemma==="fog"?family[0]:family[0];
          reason="동사 활용형 또는 같은 절의 주어·목적어가 동사 해석을 뒷받침합니다.";
        }
        if(word.lemma==="él"&&senseTags(word)[0]==="V"){
          const location=clause.some(candidate=>candidate!==word&&senseTags(candidate).some(tag=>["IN+ESS","ON+ESS","AT+ESS"].includes(tag)));
          const still=clause.some(candidate=>candidate.word.toLowerCase()==="még");
          const humanSubject=senseTags(word).some(tag=>tag==="1"||tag==="2")||clause.some(candidate=>candidate!==word&&senseNominative(candidate)&&["én","te","ő","mi","ti","ők","ember","lány","fiú","anya","apa","tanár","diák","gyerek","gyermek","család","barát"].includes(candidate.lemma));
          if(location&&humanSubject&&!still){selected=family[1];reason="사람 주어와 장소격 표현이 함께 있어 그곳에 ‘거주하다’라는 뜻으로 풀이했습니다.";}
          else if(still&&!location){selected="살아 있다";reason="még(아직)와 결합한 생존의 뜻으로 풀이했습니다.";}
          else if(location){selected=family[0];reason="장소가 있어도 거주·생존·서식 중 하나를 단정하지 않고 ‘살다’의 넓은 뜻을 유지했습니다.";}
        }
      }else if(word.lemma==="lakik"){selected=family[0];reason="lakik은 사람이 어떤 곳에 거주한다는 뜻입니다.";}
      word.meaning=selected||family.join(" / ");
      if (!selected && family.length > 1) word.unresolvedSenses = [...family];
      word.otherMeanings=selected?family.filter(meaning=>meaning!==selected):[];
      word.senseReason=reason||"문맥 단서가 충분하지 않아 가능한 뜻을 함께 표시했습니다.";
      // Refresh an inflected contextual gloss rather than retaining a previous
      // dictionary/attributive reading after the selected sense changed.
      delete word.gloss;
      if(preserveAbbreviations&&word.expanded)word.gloss=word.word;
      else{
        const degree=word.degree===1?"더 ":word.degree===2?"가장 ":"";
        if(word.lemma==="szép" && selected){
          word.gloss=selected===family[2]?"꽤":selected===family[1]?"상당한":"아름다운";
        }else if(["könnyű","nehéz"].includes(word.lemma)&&next?.pos==="명사"){
          const attribute={쉽다:"쉬운",가볍다:"가벼운",어렵다:"어려운",무겁다:"무거운"};
          word.gloss=degree+(selected?attribute[selected]:family.map(meaning=>attribute[meaning]).join(" / "));
        }else word.gloss=degree+(!selected?word.meaning:gloss(word));
      }
    }
  }
  window.analyzeHU = async (input, { preserveAbbreviations = false, offline = false } = {}) => {
    const text=input.normalize("NFC").trim();
    const tokenPattern=(/[\p{L}\p{M}\p{N}]+(?:[-’'][\p{L}\p{M}\p{N}]+)*/gu);
    const tokens=text.match(tokenPattern)||[];
    if (!tokens.length) throw Error("분석할 헝가리어 단어나 문장을 입력해 주세요.");
    const example=examples.get(text.toLowerCase().replace(/[.!?]+$/,""));
    const words=await Promise.all(tokens.map(parse));
    resolveReadings(words,text);
    if (preserveAbbreviations) {
      for (const word of words) if (word.expanded) word.gloss = word.word;
    }
    for(let i=0;i<words.length-1;i++){
      const w=words[i];
      if(w.pos==="형용사" && words[i+1].pos==="명사" && attributive[w.lemma]){
        w.gloss=(w.degree===1?"더 ":w.degree===2?"가장 ":"")+attributive[w.lemma];
      }
    }
    const sentence=tokens.length>1 && !(preserveAbbreviations && words.some(word=>word.expanded));
    let position=0;
    const expandedText=text.replace(tokenPattern, token=>words[position++].expanded || token);
    const naturalJob=example?Promise.resolve(example.natural):(sentence||idiomTranslation(text))?naturalHungarian(preserveAbbreviations ? text : expandedText,offline):Promise.resolve("");
    const missing=[...new Set(words.filter(w=>!w.meaning&&!senseFamilies[w.lemma]).map(w=>w.lemma))];
    for(let i=0;i<missing.length;i+=4){
      await Promise.all(missing.slice(i,i+4).map(async lemma=>{
        const definition=words.find(w=>w.lemma===lemma)?.definition;
        const meaning=offline?"":definition?await translate(definition,'en|ko'):await translate(lemma);
        for(const w of words)if(w.lemma===lemma)w.meaning=meaning||(definition?"영어 사전 풀이 · "+definition:"뜻 미확인");
      }));
    }
    contextualSenses(words,text,preserveAbbreviations);
    for(const word of words){
      word.morphemes=morphology(word);
      word.features=word.features.filter(feature=>!feature.startsWith("다른 분석: "));
      word.readingAlternatives=(word.analyses||[])
        .filter(row=>row.lemma!==word.lemma || row.tags.join(";")!==word.tags.join(";"))
        .map(row=>{
          const part=row.tags[0], pos=posName[part];
          const meanings=readingsFor(row.lemma,part) || (lex[row.lemma]?.pos===pos?[lex[row.lemma].meaning]:[]);
          return {lemma:row.lemma,pos,features:row.tags.slice(1).map(tag=>labels[tag]||tag),
            morphemes:morphology({...word,lemma:row.lemma,pos,tags:row.tags}),meanings};
        });
      word.readingUncertain=!(word.readingReason||word.senseReason) && word.readingAlternatives.some(reading=>reading.lemma!==word.lemma || reading.pos!==word.pos);
      const family=readingsFor(word.lemma,word.tags?.[0]);
      const localMeanings=lex[word.lemma]?.meaning?.split(/,\s+/u) || [];
      word.senses=[...new Set(family || (localMeanings.length ? localMeanings : [word.meaning]))]
        .filter(meaning=>meaning && meaning!=="뜻 미확인");
      if(!family && word.senses.length>1){
        word.unresolvedSenses=[...word.senses];
        word.otherMeanings=word.senses.filter(meaning=>meaning!==word.meaning);
      }
    }
    const preference=preferenceTranslation(text,words);
    if(preference){
      for(const word of words){
        if(personalLocations.has(word.word.toLowerCase()))word.gloss=personalLocations.get(word.word.toLowerCase()).home;
        if(word.lemma==="mindenki"){
          word.gloss="모두가";
          word.features=["총칭대명사", "문법적으로 3인칭 단수 · 단수 동사와 호응"];
        }
        if(word.lemma==="szeret"){
          word.gloss="좋아한다";
          word.senseReason="취향의 대상을 나타내는 목적격 명사와 결합해 ‘좋아하다’로 해석합니다. a/az로 한정된 목적어에는 한정 활용을 씁니다.";
        }
        if(word.pos==="관사")word.gloss="정관사";
      }
    }
    for(const w of words) if(w.degree && !w.gloss) w.gloss=(w.degree===1?"더 ":"가장 ")+w.meaning;
    const vocabularyMeanings=tokens.length===1?vocabularyMeaningsFor(words[0]):[];
    return {vocabularyMeanings,verifiedTranslation:example?.verified?example.natural:"",grammarNotes:preference ? preferenceNotes(words) : "",literal:example?.literal||words.map(gloss).join(" / "),natural:(await naturalJob)||(!sentence?gloss(words[0]):offline?"":"현재 의역을 불러올 수 없습니다."),words};
  };
  const idioms=new Map(Object.entries({
    "süt a nap":"해가 난다","ragyog a nap":"햇살이 눈부시다",
    "esik az eső":"비가 온다","szakad az eső":"비가 쏟아진다",
    "fúj a szél":"바람이 분다","hull a hó":"눈이 내린다",
    "mennyi az idő":"지금 몇 시예요","hogy vagy":"어떻게 지내",
    "jól vagyok":"잘 지내요","éhes vagyok":"배가 고파요","szomjas vagyok":"목이 말라요",
    "igazad van":"네 말이 맞아","ráérek":"시간이 있어요","nem érek rá":"시간이 없어요",
    "mély levegőt veszek":"숨을 깊이 들이쉰다","pénzt keresek":"돈을 번다"
  }));
  function idiomTranslation(text){
    const match=text.trim().match(/^([^.!?]+?)([.!?]*)$/u);
    if(!match)return "";
    const key=match[1].toLowerCase().replace(/\s+/gu," ").trim();
    const korean=idioms.get(key);
    return korean?korean+(match[2]||(["mennyi az idő","hogy vagy"].includes(key)?"?":".")):"";
  }
  // A conservative compositional rule: every token must belong to this
  // simple preference clause. Unknown structures keep the provider fallback.
  const preferenceVerbs={szeretem:["én","나는"],szereted:["te","너는"],szereti:["ő","그 사람은"],szeretjük:["mi","우리는"],szeretitek:["ti","너희는"],szeretik:["ők","그들은"]};
  const preferenceObjects=new Set(["zene","film","könyv","kávé","tea","étel","tej","alma","kenyér"]);
  function preferenceNotes(words){
    const notes=[];
    for(const w of words){
      const form=w.word.toLowerCase();
      const location=personalLocations.get(form);
      if(location) notes.push(w.word+" · 장소 표현입니다. 여기서는 ‘"+location.home+"’이라는 뜻입니다.");
      else if(form==="mindenki") notes.push(w.word+" · ‘모두가’라는 뜻의 주어입니다. 문법적으로 3인칭 단수이므로 단수 동사와 호응합니다.");
      else if(w.pos==="대명사") notes.push(w.word+" · 주어입니다.");
      else if(form==="nagyon") notes.push(w.word+" · 정도를 나타내는 부사입니다.");
      else if(form==="nem") notes.push(w.word+" · 뒤따르는 표현을 부정합니다.");
      else if(preferenceVerbs[form]) notes.push(w.word+" · 서술어입니다. 정관사가 붙은 목적어를 취해 한정 활용을 씁니다.");
      else if(w.tags?.includes("ACC")) notes.push(w.word+" · "+w.lemma+"의 목적격으로, 좋아하는 대상을 나타냅니다.");
    }
    return notes.join("\n");
  }
  function preferenceTranslation(text,words){
    const forms=words.map(word=>word.word.toLowerCase());
    // Do not silently discard punctuation, additional clauses or question force.
    if(!/^[\p{L}\p{M}\s]+[.!]?$/u.test(text.trim()))return "";
    let at=0;
    const location=personalLocations.get(forms[at]);
    if(location)at++;
    let subject="";
    if(["én","te","ő","mi","ti","ők","mindenki"].includes(forms[at]))subject=forms[at++];
    const negative=forms[at]==="nem";if(negative)at++;
    const degree=forms[at]==="nagyon";if(degree)at++;
    const verb=preferenceVerbs[forms[at++]];
    if(!verb || (subject && subject!==verb[0] && !(subject==="mindenki"&&verb[0]==="ő")))return "";
    if(!["a","az"].includes(forms[at++]))return "";
    const object=words[at++];
    if(at!==words.length||!object||!preferenceObjects.has(object.lemma)||!object.tags?.includes("ACC")||object.tags.some(tag=>tag.startsWith("PSS")))return "";
    const subjectKo=subject==="mindenki"?"모두가":verb[1];
    const objectKo=gloss(object);
    const predicate=negative?(degree?"별로 좋아하지 않아요":"좋아하지 않아요"):(degree?"아주 좋아해요":"좋아해요");
    return [location?.home,subjectKo,objectKo,predicate].filter(Boolean).join(" ")+(text.trim().endsWith("!")?"!":".");
  }
  async function naturalHungarian(text,offline){
    const parts=text.match(/[^.!?]+(?:[.!?]+|$)/gu)||[];
    const local=await Promise.all(parts.map(async part=>idiomTranslation(part)||preferenceTranslation(part.trim(),await Promise.all((part.match(/[\p{L}\p{M}]+/gu)||[]).map(parse)))));
    if(parts.length&&parts.join("")===text&&local.some(Boolean)){
      const results=await Promise.all(parts.map((part,index)=>local[index]||(offline?"":translateSentence(part.trim()))));
      if(results.every(Boolean))return results.join(" ");
    }
    return offline?"":translateSentence(text);
  }
  window.translateUsage = translateSentence;
  const koreanPhrases=new Map([["안녕하세요","Jó napot kívánok!"],["고마워","Köszönöm!"],["감사합니다","Köszönöm szépen!"]]);
  const reverseLexicon=new Map();
  const koreanKey=text=>text.normalize("NFC").trim().replace(/[.!?。！？]+$/u,"").trim().replace(/\s+/gu," ");
  function indexMeaning(meaning,lemma){
    const key=koreanKey(meaning);
    if(!key)return;
    const entries=reverseLexicon.get(key)||new Set();
    entries.add(lemma);
    reverseLexicon.set(key,entries);
  }
  const dictionaryMeanings=lemma=>[lex[lemma]?.meaning,...(senseFamilies[lemma]||[])].filter(Boolean);
  const meaningTerms=meaning=>meaning.split(/[,/;·]/u).map(term=>term.trim()).filter(Boolean);
  const dictionaryLemmas=new Set([...Object.keys(lex),...Object.keys(senseFamilies)]);
  for(const lemma of dictionaryLemmas){
    for(const meaning of dictionaryMeanings(lemma)){
      for(const term of meaningTerms(meaning.replace(/\s*\(([^)]*)\)\s*$/u,""))){
        indexMeaning(term,lemma);
      }
    }
  }
  const koreanUsages=new Map([
    ["꽤",["eléggé · 일반적인 정도 표현","meglehetősen · 상당히, 제법","szép · szép nagy(꽤 큰)처럼 일부 표현에서 정도를 강조할 때"]],
    ["사실은",["valójában · 겉보기와 다른 실제 사정을 밝힐 때","igazából · 대화에서 ‘실은’ 하고 속내를 꺼낼 때","tulajdonképpen · ‘따지고 보면’이라는 뜻으로 설명할 때"]],
    ["실은",["igazából · 대화에서 속내를 꺼낼 때","valójában · 실제 사정을 밝힐 때"]],
    ["보다",["lát · 눈에 보이거나 알아볼 때","néz · 시선을 두고 바라보거나 시청할 때"]]
  ]);
  // Only explicit Korean synonyms share candidates. A Hungarian word having
  // multiple unrelated senses is never a reason to link the Korean queries.
  const koreanSynonyms=new Map();
  for(const group of [
    ["사실은","실은","실제로"],
    ["꽤","상당히","제법"],
    ["보다","바라보다","쳐다보다"],
    ["아이","어린이","아동"],
    ["시험","테스트"],
    ["아름답다","예쁘다","곱다"],
    ["아름답게","곱게","예쁘게"],
    ["살다","거주하다"],
    ["신뢰하다","믿다"],
    ["찾다","찾아보다"],
    ["자동차","차량"],
    ["교사","선생님"],
    ["가게","상점","점포"],
    ["단어","낱말"],
    ["회사","기업"],
    ["해","태양"],
    ["가볍다","경량이다"],
    ["즉시","곧바로","바로"],
    ["때때로","가끔","간혹"],
    ["요즘","최근에"],
    ["항상","늘","언제나"],
    ["함께","같이"],
    ["매우","아주","몹시"],
    ["또한","역시"]
  ]){
    for(const term of group)koreanSynonyms.set(term,group);
  }
  function vocabularyMeaningsFor(word){
    const direct=dictionaryMeanings(word.lemma).flatMap(meaningTerms);
    const related=direct.flatMap(term=>koreanSynonyms.get(koreanKey(term))||[]);
    const alternatives=word.readingUncertain?word.readingAlternatives.flatMap(reading=>reading.meanings):[];
    return [...new Set([...direct,...related,...alternatives])];
  }
  window.translateKorean = async text => {
    const key=koreanKey(text);
    const phrase=koreanPhrases.get(key);
    if(phrase)return phrase;
    const terms=[key,...(koreanSynonyms.get(key)||[]).filter(term=>term!==key)];
    const candidates=new Map();
    for(const term of terms){
      for(const reading of koreanUsages.get(term)||[]){
        const lemma=reading.split(" · ",1)[0];
        if(!candidates.has(lemma))candidates.set(lemma,reading);
      }
    }
    for(const term of terms){
      for(const lemma of reverseLexicon.get(term)||[]){
        if(!candidates.has(lemma))candidates.set(lemma,lemma);
      }
    }
    return candidates.size?[...candidates.values()].join("\n"):translateSentence(text,"ko|hu");
  };
  async function translateSentence(text,langpair='hu|ko'){
    const encoder=new TextEncoder(),chunks=[];
    let chunk="";
    // Keep whole sentences together within the translation service's byte limit.
    const append=piece=>{
      if(chunk&&encoder.encode(chunk+piece).length>500){chunks.push(chunk.trim());chunk="";}
      chunk+=piece;
    };
    for(const sentence of text.match(/[^.!?]+[.!?]*\s*|[.!?]+\s*/gu)||[]){
      if(encoder.encode(sentence).length<=500){append(sentence);continue;}
      for(const token of sentence.match(/\S+\s*/gu)||[]){
        if(encoder.encode(token).length<=500)append(token);
        else for(const char of token)append(char);
      }
    }
    if(chunk.trim())chunks.push(chunk.trim());
    const result=await Promise.all(chunks.map(chunk=>translate(chunk,langpair)));
    return result.every(Boolean)?result.join(" "):"";
  }
})();










