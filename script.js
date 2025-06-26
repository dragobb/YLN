// Autoplay lo-fi beat with visualizer
const audio = document.getElementById("lofi-audio");

// Browser autoplay restrictions workaround
window.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  }
}, { once: true });

// 🎵 Visualizer
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const audioCtx = new AudioContext();
const src = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

src.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawBars() {
  requestAnimationFrame(drawBars);
  analyser.getByteFrequencyData(dataArray);

  // Glassy overlay: semi-transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.10)"; // subtle glass overlay
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for(let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    // Glassy bar: use alpha and a soft color
    ctx.fillStyle = `rgba(180, 200, 255, ${0.25 + barHeight/512})`;
    ctx.shadowColor = "rgba(200,220,255,0.5)";
    ctx.shadowBlur = 8;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
  ctx.shadowBlur = 0; // reset shadow
}

drawBars();
