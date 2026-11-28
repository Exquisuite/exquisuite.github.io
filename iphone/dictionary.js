(() => {
  "use strict";
  const verified = new Map([
    ["megbízható", ["형용사", ["믿을 만한, 신뢰할 수 있는", "(자료 등이) 정확하고 신뢰할 만한"], ["WikiSzótár", "다음 헝가리어 사전"]]],
    ["különbség", ["명사", ["차이, 차이점", "구별"], ["WikiSzótár", "다음 헝가리어 사전"]]],
    ["közlekedés", ["명사", ["교통", "통행"], ["WikiSzótár", "다음 헝가리어 사전"]]],
    ["kifejezés", ["명사", ["표현, 표출", "말, 어구"], ["WikiSzótár", "다음 헝가리어 사전"]]],
    ["szemüveg", ["명사", ["안경"], ["WikiSzótár"]]],
    ["ülőhely", ["명사", ["좌석, 앉을 자리"], ["WikiSzótár"]]],
    ["szorgalmas", ["형용사", ["부지런한, 성실한"], ["WikiSzótár"]]],
    ["pályázat", ["명사", ["지원금을 신청하는 사업 제안서 또는 신청", "공모·지원에 제출하는 신청서"], ["WikiSzótár"]]],
    ["járda", ["명사", ["보도, 인도"], ["WikiSzótár"]]],
    ["szivárvány", ["명사", ["무지개"], ["WikiSzótár"]]]
  ]);
  const posLabels = new Map(Object.entries({
    noun:"명사", verb:"동사", adjective:"형용사", adverb:"부사", pronoun:"대명사",
    conjunction:"접속사", postposition:"후치사", interjection:"감탄사", numeral:"수사",
    particle:"불변화사", determiner:"한정사", preposition:"전치사", prefix:"접두사",
    suffix:"접미사", article:"관사", phrase:"구", "proper noun":"고유명사"
  }));
  const cache = new Map();

  function searchLinks(lemma) {
    const q=encodeURIComponent(lemma);
    return [
      {name:"WikiSzótár", url:"https://wikiszotar.hu/ertelmezo-szotar/"+q},
      {name:"네이버 어학사전", url:"https://dict.naver.com/dict.search?query="+q},
      {name:"다음 헝가리어 사전", url:"https://dic.daum.net/search.do?dic=hu&q="+q},
      {name:"Wiktionary", url:"https://en.wiktionary.org/wiki/"+q+"#Hungarian"}
    ];
  }

  function verifiedEntry(lemma, pos) {
    const entry=verified.get(lemma);
    if(!entry || pos!=="미확인" && entry[0]!==pos)return null;
    return {
      pos:entry[0], meanings:entry[1],
      sources:searchLinks(lemma).filter(link=>entry[2].includes(link.name))
    };
  }

  const hungarianParts=new Map(Object.entries({
    fn:"명사", ige:"동사", mn:"형용사", hsz:"부사", nm:"대명사",
    szn:"수사", nu:"후치사", ksz:"접속사", isz:"감탄사", ne:"관사",
    tul:"고유명사", ik:"전철"
  }));

  function cachedLookup(language,lemma,load){
    if(!/^[\p{L}\p{M}]+(?:[-’'][\p{L}\p{M}]+)*$/u.test(lemma) || lemma.length>64)return Promise.resolve([]);
    const key=language+"|"+lemma;
    if(cache.has(key))return cache.get(key);
    if(cache.size>=128)cache.delete(cache.keys().next().value);
    const task=load().catch(()=>{
      if(cache.get(key)===task)cache.delete(key);
      return [];
    });
    cache.set(key,task);
    return task;
  }

  function lookup(lemma) {
    return cachedLookup("en",lemma,async()=>{
      const response=await fetch("https://freedictionaryapi.com/api/v1/entries/hu/"+encodeURIComponent(lemma), {
        signal:AbortSignal.timeout(4500), credentials:"omit"
      });
      if(response.status===404)return [];
      if(!response.ok)throw new Error("Dictionary unavailable");
      const payload=await response.json();
      if(payload.word?.normalize("NFC").toLowerCase()!==lemma || !Array.isArray(payload.entries))return [];
      return payload.entries.flatMap(entry=>{
        const pos=posLabels.get(entry.partOfSpeech);
        if(!pos || entry.language?.code!=="hu" || !Array.isArray(entry.senses))return [];
        const definitions=entry.senses.flatMap(sense=>{
          const entries=[sense,...(Array.isArray(sense.subsenses)?sense.subsenses:[])];
          return entries.filter(item=>!item.tags?.includes("form of") && !item.tags?.includes("alt-of") &&
            typeof item.definition==="string" && item.definition.trim()).map(item=>item.definition.trim());
        });
        return definitions.length?[{pos,definitions}]:[];
      });
    });
  }

  function lookupHungarian(lemma){
    return cachedLookup("hu",lemma,async()=>{
      const url=new URL("https://hu.wiktionary.org/w/api.php");
      url.search=new URLSearchParams({
        action:"parse", page:lemma, prop:"wikitext", format:"json", formatversion:"2", origin:"*"
      });
      const response=await fetch(url,{signal:AbortSignal.timeout(4500),credentials:"omit"});
      if(!response.ok)throw new Error("Dictionary unavailable");
      const payload=await response.json();
      if(payload.error?.code==="missingtitle")return [];
      if(payload.error)throw new Error("Dictionary unavailable");
      const wikitext=payload.parse?.wikitext;
      if(typeof wikitext!=="string" || payload.parse.title?.normalize("NFC").toLowerCase()!==lemma)return [];
      const byPart=new Map();
      let pos;
      for(const line of wikitext.split(/\r?\n/u)){
        const heading=/^\s*\{\{([\p{L}]+)(?=[|}])/u.exec(line)?.[1];
        if(heading){
          if(heading.startsWith("hun")){
            pos=hungarianParts.get(heading.slice(3));
            continue;
          }
          pos=undefined;
        }
        if(/^\s*(?:=|\{\{-[\p{L}-]+-\}\})/u.test(line))pos=undefined;
        const sense=/^#\s+(.+)$/u.exec(line)?.[1];
        if(!pos || !sense)continue;
        const definition=sense
          .replace(/<ref\b[^>]*>[\s\S]*?<\/ref>|<ref\b[^>]*\/>/giu,"")
          .replace(/\{\{[^{}]*\}\}/gu,"")
          .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/gu,(_,target,label)=>label||target)
          .replace(/'{2,5}|<[^>]+>/gu,"")
          .replace(/\s+/gu," ").trim();
        if(!/[\p{L}]/u.test(definition) || /[{}\[\]]/u.test(definition))continue;
        if(!byPart.has(pos))byPart.set(pos,new Set());
        byPart.get(pos).add(definition);
      }
      return [...byPart].map(([pos,definitions])=>({pos,definitions:[...definitions]}));
    });
  }

  // Korean summaries checked against the corresponding Hungarian source senses.
  const reviewedMeanings=new Map([
    ["a házastárs férfitestvére vagy nőtestvérének férje.", "배우자의 남자 형제 또는 배우자의 여자 형제의 남편"],
    ["tágabb értelemben a) egy vér szerinti nőrokon férje b) a házastárs vér szerinti nőrokonának férje c) a házastárs vér szerinti férfirokona.", "넓게는 본인의 여성 혈족의 남편, 배우자의 여성 혈족의 남편, 또는 배우자의 남성 혈족"]
  ]);
  function reviewedMeaning(original){
    for(const [definition,korean] of reviewedMeanings){
      if(original===definition || original.startsWith(definition+" "))return korean;
    }
    return "";
  }

  window.hungarianDictionary={searchLinks,verifiedEntry,lookup,lookupHungarian,reviewedMeaning};
})();
