// Group clear consecutive answer items without inventing labels or answers.
export function formatAnswerText(text){
  return text.trim().split(/\n[ \t]*\n+/u).map(block=>{
    const heading=/^\s*(\d{1,2})\.\s*([a-z])\)\s*/u.exec(block);
    const body=heading?block.slice(heading[0].length):block;
    const flat=body.replace(/\s+/gu," ").trim();
    const markers=[...flat.matchAll(/(?:^|\s)(\d{1,2})[.)](?=\s)/gu)];
    const sequence=[];
    for(const match of markers){
      const number=Number(match[1]);
      if(!sequence.length && number>0 && number<=3 || sequence.length && number===sequence.at(-1).number+1){
        sequence.push({number,start:match.index,end:match.index+match[0].length});
      }
    }
    const label=heading?heading[1]+"."+heading[2]+") ":"";
    if(sequence.length<2){
      return heading?label+body.trim():block.trim();
    }
    const lead=flat.slice(0,sequence[0].start).trim();
    const items=sequence.map(({number,end},i)=>number+" "+flat.slice(end,sequence[i+1]?.start).trim());
    return label+(lead?[lead,...items]:items).join("\n");
  }).join("\n\n");
}
