import {lookupPhoto} from './photo-key.js';
﻿const fileInput=document.getElementById('photo');
const preview=document.getElementById('photoPreview');
const button=document.getElementById('photoRun');
const status=document.getElementById('photoStatus');
const answer=document.getElementById('photoAnswer');
const text=document.getElementById('photoText');
let photo='',version=0,model,busy=false;
const cameraInput=document.getElementById("photoCamera");
const picker=document.getElementById("photoPick");
const dropZone=document.getElementById("photoDrop");
fileInput.onchange=cameraInput.onchange=event=>{
  const input=event.currentTarget;
  const file=input.files[0];
  input.value="";
  if(file)void selectPhoto(file);
};
picker.onclick=()=>fileInput.click();
dropZone.addEventListener("click",event=>{
  if(!busy&&!event.target.closest("button,label,input"))fileInput.click();
});
dropZone.addEventListener("dragover",event=>{
  event.preventDefault();
  event.dataTransfer.dropEffect=busy?"none":"copy";
  dropZone.classList.toggle("is-dragging",!busy);
});
dropZone.addEventListener("dragleave",event=>{
  if(!dropZone.contains(event.relatedTarget))dropZone.classList.remove("is-dragging");
});
dropZone.addEventListener("drop",event=>{
  event.preventDefault();
  dropZone.classList.remove("is-dragging");
  const file=event.dataTransfer.files[0];
  if(file&&!busy)void selectPhoto(file);
});

async function selectPhoto(file){
  if(busy)return;
  const revision=++version;
  photo='';document.getElementById('keyAnswer').hidden=true;document.getElementById('photoAI').disabled=true;button.disabled=true;preview.hidden=true;answer.hidden=true;status.textContent='';
  if(!file.type.startsWith('image/')&&!(file.type===''&&/\.(?:jpe?g|png)$/i.test(file.name))){
    status.textContent='JPG 또는 PNG 사진을 선택해 주세요.';return;
  }
  const url=URL.createObjectURL(file);
  try{
    const img=new Image();img.src=url;await img.decode();
    if(revision!==version)return;
    const scale=Math.min(1,1800/Math.max(img.width,img.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    photo=canvas.toDataURL('image/jpeg',.94);preview.src=photo;preview.hidden=false;button.disabled=busy;document.getElementById("photoAI").disabled=busy;
  }catch{if(revision===version)status.textContent='사진을 읽지 못했습니다. 파일을 다시 선택해 주세요.'}
  finally{URL.revokeObjectURL(url)}
};
async function loadModel(){
  if(model)return model;
  const adapter=await navigator.gpu?.requestAdapter();
  if(!adapter)throw Error('이 기기에서 WebGPU를 사용할 수 없습니다. 하드웨어 가속을 지원하는 Chrome 또는 Edge에서 열어 주세요.');
  const type=adapter.features.has('shader-f16')?'f16':'f32';
  status.textContent='시각 언어 모델을 준비하고 있습니다…';
  const {CreateMLCEngine}=await import('./vendor/webllm.js');
  model=await CreateMLCEngine('Phi-3.5-vision-instruct-q4'+type+'_1-MLC',{initProgressCallback:progress=>{status.textContent='모델 준비 · '+progress.text}});
  return model;
}
async function analyzePhoto(useKey){
  if(!photo||busy)return;
  busy=true;button.disabled=true;fileInput.disabled=true;cameraInput.disabled=true;picker.disabled=true;answer.hidden=true;
  try{
    document.getElementById("photoAI").disabled=true;
    if(useKey){document.getElementById("keyAnswer").hidden=true;await lookupPhoto(photo);return;}
    const engine=await loadModel();
    status.textContent='사진에서 문제를 읽고 답안을 작성하고 있습니다…';
    const result=await engine.chat.completions.create({messages:[{role:'user',content:[
      {type:'image_url',image_url:{url:photo}},
      {type:'text',text:'This is a Hungarian language textbook page. Answer in Korean. First transcribe each legible Hungarian sentence and give its Korean meaning. Then solve each visible exercise in order, preserving its number. For each give the answer in the language requested by the exercise (Hungarian by default) and a short Korean explanation. Use the choices and picture clues. Label open-ended answers as examples. If text or context is unreadable, name the missing part instead of guessing.'}
    ]}],temperature:.1,max_tokens:1600});
    const message=result.choices[0]?.message?.content?.trim();
    if(!message)throw Error('답안을 생성하지 못했습니다.');
    text.textContent=message;answer.hidden=false;
    status.textContent=result.choices[0].finish_reason==='length'?'답변 길이 한도에 도달했습니다. 남은 문제를 잘라 다시 올려 주세요.':'분석을 마쳤습니다. 예상 답안을 원문과 대조해 주세요.';
  }catch(err){status.textContent='분석을 완료하지 못했습니다. '+(err.message||'네트워크와 GPU 메모리를 확인해 주세요.')}
  finally{busy=false;fileInput.disabled=false;cameraInput.disabled=false;picker.disabled=false;button.disabled=!photo;document.getElementById('photoAI').disabled=!photo}
};

button.onclick=()=>analyzePhoto(true);
document.getElementById('photoAI').onclick=()=>analyzePhoto(false);
