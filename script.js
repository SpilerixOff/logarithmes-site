/* ========= script.js ========= */

/* =======================
   🌌 Animation du fond
======================= */
const canvas = document.querySelector('.bg');
const ctx = canvas.getContext('2d');
let glyphs = [];

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const N = Math.max(80, Math.floor((w + h) / 9));
  glyphs = Array.from({ length: N }, () => ({
    char: Math.random() < 0.6 ? '+' : 'log',
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    size: 16 + Math.random() * 30,
    alpha: 0.25 + Math.random() * 0.2
  }));
}

function draw() {
  const w = window.innerWidth, h = window.innerHeight;
  const g = ctx.createRadialGradient(w * .7, h * .1, 0, w * .7, h * .1, Math.max(w, h));
  g.addColorStop(0, '#272f55aa');
  g.addColorStop(1, '#0000');
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  glyphs.forEach(o => {
    o.x += o.vx;
    o.y += o.vy;
    if (o.x < -60 || o.x > w + 60) o.vx *= -1;
    if (o.y < -60 || o.y > h + 60) o.vy *= -1;
    ctx.save();
    ctx.globalAlpha = o.alpha;
    ctx.fillStyle = o.char === '+' ? '#b39bff' : '#8a7dff';
    ctx.font = `800 ${o.size}px Inter`;
    ctx.textBaseline = 'top';
    ctx.fillText(o.char, o.x, o.y);
    ctx.restore();
  });

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(draw);

/* =======================
   🧮 Calculatrice flottante
======================= */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function evalExpr(expr) {
  if (!expr) return NaN;
  let s = String(expr).toLowerCase().replaceAll(',', '.');
  s = s.replaceAll('^', '**');
  s = s.replaceAll('sqrt', 'Math.sqrt');
  s = s.replaceAll('ln', 'Math.log');
  const LOG = x => (Math.log10 ? Math.log10(x) : Math.log(x) / Math.LN10);
  const PI = Math.PI, E = Math.E;
  try {
    return Function('Math','LOG','PI','E',`
      const log = LOG, pi = PI, e = E;
      return (${s});
    `)(Math, LOG, PI, E);
  } catch (e) {
    return NaN;
  }
}

function calcInsert(txt) {
  const el = $('#calcIn');
  const s = el.selectionStart ?? el.value.length;
  const e = el.selectionEnd ?? el.value.length;
  const v = el.value;
  el.value = v.slice(0, s) + txt + v.slice(e);
  el.focus();
  const pos = s + txt.length;
  el.setSelectionRange(pos, pos);
}

function calcClear() {
  $('#calcIn').value = '';
  $('#calcOut').textContent = '';
}

function calcEval() {
  const expr = $('#calcIn').value.trim();
  const val = evalExpr(expr);
  const out = $('#calcOut');
  if (Number.isFinite(val)) {
    out.textContent = `${val}  (≈ ${val.toFixed(6)})`;
  } else {
    out.textContent = 'Expression invalide';
  }
}

/* Boutons calculatrice */
function initCalc() {
  const calc = $('#calcPanel');
  const btn = $('#btnCalc');
  const eq = $('#btnCalcEq');
  const clr = $('#btnCalcClear');

  if (btn) btn.addEventListener('click', () => {
    calc.style.display = calc.style.display === 'block' ? 'none' : 'block';
  });
  if (eq) eq.addEventListener('click', calcEval);
  if (clr) clr.addEventListener('click', calcClear);

  $$('.calc-key[data-ins]').forEach(key => {
    key.addEventListener('click', () => calcInsert(key.dataset.ins));
  });
}

/* =======================
   🎓 Navigation cours / exos / fiche
======================= */
function initNav() {
  const pages = {
    cours: 'cours.html',
    exos: 'exercices.html',
    fiche: 'fiche.html'
  };
  // Placeholder pour extensions futures
}

/* =======================
   🔊 Audio explicatif (voix)
======================= */
const voice = {
  speak(text) {
    try {
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      u.rate = 1.0;
      u.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
};

/* Exemple : lire automatiquement une phrase quand on arrive sur la page d’accueil */
document.addEventListener('DOMContentLoaded', () => {
  initCalc();
  // Petite phrase d’accueil audio :
  setTimeout(() => {
    voice.speak("Bienvenue sur ton site des logarithmes. Clique sur Cours pour commencer.");
  }, 1500);
});
