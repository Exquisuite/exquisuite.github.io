const lookupKey=text=>text.normalize('NFC').toLowerCase().trim().replace(/^_+\s*/,'').replace(/[.!?]$/,'').replace(/\b(vk|vm)t\b/g,'$1it').replace(/[(),/]/g,' ').replace(/\s+/g,' ').trim();
const groupParts=text=>text.split(/\s+[–—-]\s+|\s*→\s*/).map(x=>x.trim());
const headings=new Map(), entries=new Map();
for(const group of referenceGroups){
  headings.set(groupParts(group.title).map(lookupKey).join('|'),group);
  const lines=group.body.split('\n');
  const parts=groupParts(group.title);
  const offsets=parts.map(part=>lines.findIndex((line,i)=>lookupKey(line.trim().replace(/\s*\(.*\)$/,''))===lookupKey(part) && /^(뜻|품사):/.test(lines[i+1]||'')));
  parts.forEach((part,i)=>{
    if(offsets[i]<0)return;
    const body=lines.slice(offsets[i],offsets.slice(i+1).find(n=>n>=0)??lines.length).join('\n').trim();
    const entry={title:part.replace(/^_+\s*/,''),body};
    entries.set(lookupKey(part),entry);
    entries.set(lookupKey(body.split('\n')[0]),entry);
  });
}
const frameHead=frame=>frame[0].trim().split(' ')[0];
function relatedFrames(keys){
  return referenceFrames.filter(frame=>keys.includes(frameHead(frame)) || (frameHead(frame)==='hív' && keys.some(k=>/\bhív(nak|ják)\b/i.test(k))));
}
function referenceMatch(source){
  const key=lookupKey(source);
  const group=headings.get(groupParts(source).map(lookupKey).join('|'));
  if(group)return {...group,frames:relatedFrames(groupParts(group.title).map(lookupKey))};
  const matchedFrame=referenceFrames.find(frame=>lookupKey(frame[0])===key);
  const entry=entries.get(key)||entries.get(frameHead(matchedFrame||['']));
  if(entry)return {...entry,frames:matchedFrame?[matchedFrame]:relatedFrames([lookupKey(entry.title)])};
}
const sourceText=referenceGroups.map((g,i)=>(i+1)+'. '+g.title+'\n\n'+g.body).join('\n\n\n')+'\n\n\n주요 지배격 정리\n\n'+referenceFrames.map(f=>f.join('\n')).join('\n\n');
const normalizedText=t=>t.replace(/\r/g,'').replace(/[^\S\n]+$/gm,'').trim();
function reportInputs(input){
  if(normalizedText(input)===normalizedText(sourceText))return referenceGroups.map(g=>g.title);
  const lines=input.split(/\r?\n/).map(t=>t.trim().replace(/^\d+[.)]\s+/, '')).filter(Boolean);
  const items=[];
  for(let i=0;i<lines.length;i++){
    const family=referenceGroups.find(g=>{
      const parts=groupParts(g.title);
      return parts.length>1 && parts.every((part,j)=>lookupKey(part)===lookupKey(lines[i+j]||''));
    });
    if(family){items.push(family.title);i+=groupParts(family.title).length-1;}
    else if(referenceMatch(lines[i])||groupParts(lines[i]).length>1)items.push(lines[i]);
    else items.push(...assignmentItems(lines[i]));
  }
  return items;
}
const usageCache=new Map();
async function usageExample(lemma,pos){
  const codes={'동사':'verb','동사 + 부정사':'verb','명사':'noun','부사':'adv','형용사':'adj','후치사':'postp','대명사':'pron','수사':'num','접속사':'conj','감탄사':'intj'};
  let h=0;for(const c of lemma)h=(h*31+c.charCodeAt(0))%64;
  try{
    if(!usageCache.has(h))usageCache.set(h,fetch('usage/'+h+'.json').then(r=>{if(!r.ok)throw Error();return r.json()}));
    const sample=(await usageCache.get(h))[lemma]?.[codes[pos]];
    if(sample){const ko=await window.translateUsage(sample);if(ko)return sample+'\n'+ko;}
  }catch{usageCache.delete(h);}
  return '';
}
async function reportItem(source,index){
  const fixed=referenceMatch(source);
  if(fixed)return {text:index+'. '+fixed.title+'\n\n'+fixed.body,frames:fixed.frames};
  const parts=groupParts(source);
  if(parts.length>1){
    const members=[];
    for(const part of parts)members.push(await reportItem(part,1));
    return {text:index+'. '+source+'\n\n'+members.map(m=>m.text.replace(/^1\. [^\n]+\n\n/, '')).join('\n\n\n'),frames:members.flatMap(m=>m.frames)};
  }
  const raw=await studyItem(source,index);
  const fields=raw.split('\n');
  const heading=fields[0].match(/^\d+\. (.+) \[(.+)\]$/);
  if(!heading && fields.length===1)return {text:raw,frames:[]};
  let text=heading?heading[1]+'\n품사: '+heading[2]+'.':source;
  for(const line of fields.slice(1)){
    if(line.startsWith('의미: '))text+='\n뜻: '+line.slice(4);
    else if(/^(현재형|정관변화|과거형|부정사|어형 변화|소유형|최상급|비교급|예|구성|관련형): /.test(line))text+='\n\n'+line.replace(': ',':\n');
    else text+='\n'+line;
  }
  if(heading && !/\n예(?:문)?:/.test(text)){
    const ex=await usageExample(heading[1].split(' ')[0],heading[2]);
    if(ex)text+='\n\n예문:\n'+ex;
  }
  const frames=[];
  const frame=fields.find(l=>l.startsWith('문형: '));
  const sense=fields.find(l=>l.startsWith('의미: '));
  if(frame&&sense)frames.push([frame.slice(4),'= '+sense.slice(4)]);
  return {text:index+'. '+source+'\n\n'+text,frames};
}
function assembleReport(sections,frames){
  const parts=sections.slice();
  if(frames.length)parts.push('주요 지배격 정리\n\n'+[...new Set(frames.map(f=>f.join('\n')))].join('\n\n'));
  return parts.join('\n\n\n');
}

