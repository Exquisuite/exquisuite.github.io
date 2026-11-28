import {findPage,findExercises} from "./photo-match.js";
const $=id=>document.getElementById(id);
const titles={text:"A2 주교재",grammar:"A2 문법교재"};
let indexPromise,workerPromise;
function readIndex(){
  if(!indexPromise)indexPromise=Promise.all(["pages","keys"].map(async name=>{
    const response=await fetch(new URL("a2/"+name+".json",document.baseURI));
    if(!response.ok)throw Error("교재 색인을 불러오지 못했습니다.");
    return response.json();
  })).catch(e=>{indexPromise=null;throw e});
  return indexPromise;
}
async function worker(){
  if(!workerPromise)workerPromise=(async()=>{
    if(!window.Tesseract)await new Promise((resolve,reject)=>{
      const script=document.createElement("script");script.src="vendor/ocr/tesseract.min.js";
      script.onload=resolve;script.onerror=()=>reject(Error("문자 인식기를 불러오지 못했습니다."));document.head.append(script);
    });
    const base=new URL("vendor/ocr/",document.baseURI);
    return window.Tesseract.createWorker("hun",1,{workerPath:new URL("worker.min.js",base).href,corePath:new URL("tesseract-core-lstm.wasm.js",base).href,langPath:base.href,logger:m=>{
      if(m.status==="recognizing text")$("photoStatus").textContent="헝가리어 글자 인식 중 · "+Math.round(m.progress*100)+"%";
    }});
  })().catch(e=>{workerPromise=null;throw e});
  return workerPromise;
}
function display(keys,book,ch,pron,numbers){
  const area=$("keyAnswer");area.replaceChildren();area.hidden=false;
  for(const num of numbers){
    const parts=keys[book][ch+"-"+(pron?"p":"")+num];
    const heading=document.createElement("h3");heading.textContent=titles[book]+" · "+ch+"장 · "+(pron?"발음 연습 ":"")+num+"번";area.append(heading);
    if(!parts?.length){
      const msg=document.createElement("p");msg.textContent="이 번호에 연결된 답지 항목이 없습니다.";area.append(msg);continue;
    }
    for(const [page,file] of parts){
      const fig=document.createElement("figure"),cap=document.createElement("figcaption"),img=new Image();
      cap.textContent=titles[book]+" 답지 · PDF "+page+"쪽";
      img.alt=heading.textContent+" 답지 원문, "+page+"쪽";img.src="a2/"+file;
      fig.append(cap,img);area.append(fig);
    }
  }
  if(area.querySelector("img")){
    const credit=document.createElement("small");credit.textContent="MagyarOK A2+ · Szita Szilvia, Pelcz Katalin · magyar-ok.hu";area.append(credit);
  }
}
export async function lookupPhoto(photo){
  $("photoStatus").textContent="헝가리어 문자 인식기를 준비하고 있습니다…";
  const [[pages,keys],ocr]=await Promise.all([readIndex(),worker()]);
  const {data}=await ocr.recognize(photo);
  const page=findPage(data.text,pages);
  if(!page){$("photoStatus").textContent="교재 페이지를 특정하지 못했습니다. 문제 제목과 본문이 함께 보이도록 촬영하거나 아래에서 직접 찾으세요.";$("manualKey").open=true;return;}
  $("keyBook").value=page.book;$("keyChapter").value=page.chapter;$("keyPron").checked=page.pron;
  $("keyPron").disabled=page.book!=="text";$("keyNumber").value="";
  const nums=findExercises(data.text,page);
  const where=titles[page.book]+" PDF "+page.page+"쪽 · "+page.chapter+"장";
  if(!nums.length){$("photoStatus").textContent=where+"을 찾았습니다. 문제 제목 번호를 아래에 입력하세요.";$("manualKey").open=true;return;}
  $("photoStatus").textContent=where+"에서 사진의 문제 제목을 찾았습니다.";
  $("keyNumber").value=nums[0];display(keys,page.book,page.chapter,page.pron,nums);
}
$("keyBook").onchange=()=>{$("keyPron").disabled=$("keyBook").value!=="text";if($("keyPron").disabled)$("keyPron").checked=false;};
$("keyForm").onsubmit=async e=>{
  e.preventDefault();
  try{const [,keys]=await readIndex();display(keys,$("keyBook").value,$("keyChapter").value,$("keyPron").checked,[$("keyNumber").value]);}
  catch(err){$("photoStatus").textContent=err.message;}
};
