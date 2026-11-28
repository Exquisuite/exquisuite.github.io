import {findPage,findExercises} from "./photo-match.js";
import {formatAnswerText} from "./photo-key-text.js";
const $=id=>document.getElementById(id);
const titles={text:"A2 주교재",grammar:"A2 문법교재"};
let indexPromise,workerPromise,recognition=Promise.resolve(),reportProgress;
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
      if(m.status==="recognizing text")reportProgress?.(Math.round(m.progress*100));
    }});
  })().catch(e=>{workerPromise=null;throw e});
  return workerPromise;
}
function recognize(image,onProgress){
  const job=recognition.then(async()=>{
    const ocr=await worker();
    reportProgress=onProgress;
    try{
      const {data}=await ocr.recognize(image);
      return data.text;
    }finally{reportProgress=undefined;}
  });
  recognition=job.catch(()=>{});
  return job;
}

function textAnswer(parts){
  const detail=document.createElement("details");
  detail.className="key-text";
  const toggle=document.createElement("summary"),status=document.createElement("p"),output=document.createElement("pre");
  toggle.textContent="답지 텍스트 보기";
  status.setAttribute("role","status");
  output.lang="hu";
  output.hidden=true;
  detail.append(toggle,status,output);
  let loading=false;
  detail.ontoggle=async()=>{
    if(!detail.open || loading || !output.hidden)return;
    loading=true;
    try{
      const texts=[];
      for(const [index,[,file]] of parts.entries()){
        if(!detail.isConnected)break;
        const url=new URL("a2/"+file,document.baseURI);
        const progress=percent=>status.textContent="답지 글자 인식 중 · "+(index+1)+"/"+parts.length+" · "+percent+"%";
        status.textContent="답지 글자를 읽고 있습니다…";
        try{
          const result=await recognize(url.href,progress);
          texts.push(result.trim()||"[이 페이지에서 문자를 읽지 못했습니다.]");
        }catch{
          texts.push("[이 페이지에서 문자를 읽지 못했습니다.]");
        }
      }
      if(!detail.isConnected)return;
      if(texts.every(text=>text.startsWith("[이 페이지"))){
        status.textContent="글자를 읽지 못했습니다. 아래 답지 이미지를 확인하세요. 다시 열면 재시도합니다.";
        return;
      }
      output.textContent=formatAnswerText(texts.join("\n\n"));
      output.hidden=false;
      status.textContent="답지 이미지에서 읽은 텍스트입니다. 불분명한 부분은 아래 원문과 대조하세요.";
    }finally{loading=false;}
  };
  return detail;
}

function display(keys,book,ch,pron,numbers){
  const area=$("keyAnswer");area.replaceChildren();area.hidden=false;
  for(const num of numbers){
    const parts=keys[book][ch+"-"+(pron?"p":"")+num];
    const heading=document.createElement("h3");heading.textContent=titles[book]+" · "+ch+"장 · "+(pron?"발음 연습 ":"")+num+"번";area.append(heading);
    if(!parts?.length){
      const msg=document.createElement("p");msg.textContent="이 번호에 연결된 답지 항목이 없습니다.";area.append(msg);continue;
    }
    area.append(textAnswer(parts));
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
  const [[pages,keys],text]=await Promise.all([readIndex(),recognize(photo,percent=>{
    $("photoStatus").textContent="헝가리어 글자 인식 중 · "+percent+"%";
  })]);
  const page=findPage(text,pages);
  if(!page){$("photoStatus").textContent="교재 페이지를 특정하지 못했습니다. 문제 제목과 본문이 함께 보이도록 촬영하거나 아래에서 직접 찾으세요.";$("manualKey").open=true;return;}
  $("keyBook").value=page.book;$("keyChapter").value=page.chapter;$("keyPron").checked=page.pron;
  $("keyPron").disabled=page.book!=="text";$("keyNumber").value="";
  const nums=findExercises(text,page);
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
