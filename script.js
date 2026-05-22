/* =========================
FILE: script.js
========================= */

const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const finishBtn = document.getElementById("finishBtn");

const counter = document.getElementById("counter");

const slots = document.querySelectorAll(".slot");

const resultModal = document.getElementById("resultModal");
const finalImage = document.getElementById("finalImage");
const closeResult = document.getElementById("closeResult");

const downloadBtn = document.getElementById("downloadBtn");

const qrCanvas = document.getElementById("qrCanvas");

const receiptFrame = document.getElementById("receiptFrame");

/* =========================
SETTINGS
========================= */

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");

const brandInput = document.getElementById("brandInput");
const footerInput = document.getElementById("footerInput");

const brandTitle = document.getElementById("brandTitle");
const footerText = document.getElementById("footerText");

const saveSettings = document.getElementById("saveSettings");

const frameSelect = document.getElementById("frameSelect");

const stickerToggle = document.getElementById("stickerToggle");

const floatingItems = document.querySelectorAll(".floating");

/* =========================
CAMERA
========================= */

let capturedPhotos = [];
let currentShot = 0;

async function startCamera() {

  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      video:{
        facingMode:"user"
      },
      audio:false
    });

    video.srcObject = stream;

  } catch(err){

    alert("Camera access denied");

  }

}

startCamera();

/* =========================
CAPTURE
========================= */

captureBtn.addEventListener("click", async ()=>{

  if(currentShot >= 4) return;

  await countdown();

  capturePhoto();

});

async function countdown(){

  for(let i=3;i>=1;i--){

    counter.innerText = i;

    await wait(1000);

  }

  counter.innerText = "📸";

  await wait(400);

}

function capturePhoto(){

  const canvas = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(video,0,0);

  const data = canvas.toDataURL("image/png");

  capturedPhotos.push(data);

  const img = document.createElement("img");
  img.src = data;

  slots[currentShot].innerHTML = "";
  slots[currentShot].appendChild(img);

  currentShot++;

  counter.innerText =
  `${currentShot}/4`;

  if(currentShot >= 4){

    counter.innerText = "DONE ✨";

  }

}

function wait(ms){

  return new Promise(resolve=>{
    setTimeout(resolve,ms);
  });

}

/* =========================
FINISH
========================= */

finishBtn.addEventListener("click", async ()=>{

  if(currentShot < 4){

    alert("Take all 4 photos first!");
    return;

  }

  const canvas = await html2canvas(receiptFrame,{
    backgroundColor:null,
    scale:2
  });

  const dataURL = canvas.toDataURL("image/png");

  finalImage.src = dataURL;

  downloadBtn.href = dataURL;

  /* QR CODE */

  QRCode.toCanvas(
    qrCanvas,
    dataURL,
    {
      width:180
    }
  );

  resultModal.classList.remove("hidden");

});

/* =========================
CLOSE RESULT
========================= */

closeResult.addEventListener("click", ()=>{

  resultModal.classList.add("hidden");

});

/* =========================
SETTINGS OPEN/CLOSE
========================= */

settingsBtn.addEventListener("click", ()=>{

  settingsPanel.classList.remove("hidden");

});

closeSettings.addEventListener("click", ()=>{

  settingsPanel.classList.add("hidden");

});

/* =========================
SAVE SETTINGS
========================= */

saveSettings.addEventListener("click", ()=>{

  brandTitle.innerText = brandInput.value;

  footerText.innerText = footerInput.value;

  receiptFrame.classList.remove(
    "classic",
    "retro",
    "cute"
  );

  receiptFrame.classList.add(
    frameSelect.value
  );

  if(stickerToggle.value === "off"){

    floatingItems.forEach(item=>{
      item.style.display = "none";
    });

  }else{

    floatingItems.forEach(item=>{
      item.style.display = "block";
    });

  }

  settingsPanel.classList.add("hidden");

});

/* =========================
DISABLE ZOOM
========================= */

document.addEventListener("gesturestart", e=>{
  e.preventDefault();
});

document.addEventListener("dblclick", e=>{
  e.preventDefault();
},{
  passive:false
});
