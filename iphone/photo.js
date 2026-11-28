import {lookupPhoto} from './photo-key.js';
const fileInput=document.getElementById('photo');
const preview=document.getElementById('photoPreview');
const button=document.getElementById('photoRun');
const status=document.getElementById('photoStatus');
let photo='',version=0,busy=false;
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
  photo='';document.getElementById('keyAnswer').hidden=true;document.getElementById('photoAI').disabled=true;button.disabled=true;preview.hidden=true;status.textContent='';
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
button.onclick=async()=>{
  if(!photo||busy)return;
  busy=true;
  const ai=document.getElementById("photoAI");
  button.disabled=fileInput.disabled=cameraInput.disabled=picker.disabled=ai.disabled=true;
  document.getElementById("keyAnswer").hidden=true;
  try{
    await lookupPhoto(photo);
  }catch(error){
    status.textContent="답지를 찾지 못했습니다. "+(error.message||"사진을 확인해 주세요.");
  }finally{
    busy=false;
    fileInput.disabled=cameraInput.disabled=picker.disabled=false;
    button.disabled=ai.disabled=!photo;
  }
};
document.getElementById("photoAI").onclick=()=>{
  if(photo&&!busy)window.aiHandoff.analyzePhoto();
};
