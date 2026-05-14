/**
 * 마우스/포인터로 캔버스에 그리기 (MVP)
 * - 펜 / 지우개(destination-out)
 * - 색 팔레트, 굵기, 전체 지우기, PNG 저장
 */

const COLORS = [
  "#111111",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#ffffff",
];

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const paletteEl = document.getElementById("palette");
const widthInput = document.getElementById("width");
const widthOut = document.getElementById("widthOut");
const toolPen = document.getElementById("toolPen");
const toolErase = document.getElementById("toolErase");
const btnClear = document.getElementById("btnClear");
const btnSave = document.getElementById("btnSave");

let penColor = COLORS[0];
let lineWidth = Number(widthInput.value);
let tool = "pen"; // 'pen' | 'erase'
let drawing = false;
let last = { x: 0, y: 0 };

function canvasPoint(ev) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (ev.clientX - rect.left) * scaleX,
    y: (ev.clientY - rect.top) * scaleY,
  };
}

function applyToolStyle() {
  if (tool === "erase") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = penColor;
  }
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

function fillWhite() {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function buildPalette() {
  COLORS.forEach((hex) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.style.backgroundColor = hex;
    b.dataset.color = hex;
    b.title = hex;
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", hex === penColor ? "true" : "false");
    if (hex === "#ffffff") {
      b.style.borderColor = "#999";
    }
    b.addEventListener("click", () => {
      penColor = hex;
      tool = "pen";
      setToolUi();
      paletteEl.querySelectorAll(".swatch").forEach((s) => {
        s.setAttribute("aria-checked", s.dataset.color === hex ? "true" : "false");
      });
    });
    paletteEl.appendChild(b);
  });
}

function setToolUi() {
  toolPen.classList.toggle("active", tool === "pen");
  toolPen.setAttribute("aria-pressed", tool === "pen" ? "true" : "false");
  toolErase.classList.toggle("active", tool === "erase");
  toolErase.setAttribute("aria-pressed", tool === "erase" ? "true" : "false");
}

function startStroke(ev) {
  if (ev.button !== 0) return;
  drawing = true;
  canvas.setPointerCapture(ev.pointerId);
  const p = canvasPoint(ev);
  last = p;
  applyToolStyle();
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}

function moveStroke(ev) {
  if (!drawing) return;
  const p = canvasPoint(ev);
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  last = p;
}

function endStroke(ev) {
  if (!drawing) return;
  drawing = false;
  try {
    canvas.releasePointerCapture(ev.pointerId);
  } catch {
    /* ignore */
  }
}

buildPalette();
fillWhite();
applyToolStyle();
setToolUi();

widthInput.addEventListener("input", () => {
  lineWidth = Number(widthInput.value);
  widthOut.textContent = String(lineWidth);
});

toolPen.addEventListener("click", () => {
  tool = "pen";
  setToolUi();
});

toolErase.addEventListener("click", () => {
  tool = "erase";
  setToolUi();
});

btnClear.addEventListener("click", () => {
  fillWhite();
});

btnSave.addEventListener("click", () => {
  const a = document.createElement("a");
  a.download = `drawing-${Date.now()}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
});

canvas.addEventListener("pointerdown", startStroke);
canvas.addEventListener("pointermove", moveStroke);
canvas.addEventListener("pointerup", endStroke);
canvas.addEventListener("pointercancel", endStroke);
canvas.addEventListener("pointerleave", (ev) => {
  if (!drawing) return;
  if (ev.buttons === 0) endStroke(ev);
});
