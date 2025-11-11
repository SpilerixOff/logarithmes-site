/* 🌌 Fond animé (+ / log) — utilisé sur toutes les pages qui ont <canvas class="bg"> */
(function(){
  const c = document.querySelector('.bg'); if(!c) return;
  const x = c.getContext('2d'); let W,H,parts=[];
  function R(){W=c.width=innerWidth;H=c.height=innerHeight}
  addEventListener('resize',R); R();

  class P{
    constructor(){
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.t=Math.random()<.55?'+':'log';
      this.s=16+Math.random()*20;
      this.vx=(Math.random()-.5)*.3; this.vy=(Math.random()-.5)*.3;
      this.a=.2+.3*Math.random();
    }
    u(){
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<-60||this.x>W+60) this.vx*=-1;
      if(this.y<-60||this.y>H+60) this.vy*=-1;
    }
    d(){
      x.globalAlpha=this.a; x.fillStyle='#8a7dff';
      x.font=`800 ${this.s}px Inter, system-ui, Segoe UI, Roboto`;
      x.textBaseline='top'; x.fillText(this.t,this.x,this.y);
    }
  }
  parts = Array.from({length:90},()=>new P());

  (function A(){
    x.clearRect(0,0,W,H);
    const g=x.createRadialGradient(W*.7,H*.1,0,W*.7,H*.1,Math.max(W,H));
    g.addColorStop(0,'#272f55aa'); g.addColorStop(1,'#0000');
    x.fillStyle=g; x.fillRect(0,0,W,H);
    parts.forEach(p=>{p.u();p.d();});
    requestAnimationFrame(A);
  })();
})();

/* 🧮 Calculatrice flottante (si le panneau est présent dans la page) */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function evalExpr(expr){
  if(!expr) return NaN;
  let s = String(expr).toLowerCase()
    .replaceAll(',','.')
    .replaceAll('^','**')
    .replaceAll('sqrt','Math.sqrt')
    .replaceAll('ln','Math.log');
  const LOG = x => (Math.log10 ? Math.log10(x) : Math.log(x)/Math.LN10);
  try{
    return Function('Math','LOG',`
      const log=LOG, pi=Math.PI, e=Math.E;
      return (${s});
    `)(Math, LOG);
  }catch{
    return NaN;
  }
}

function calcInsert(txt){
  const el = $('#calcIn'); if(!el) return;
  const s = el.selectionStart ?? el.value.length;
  const e = el.selectionEnd   ?? el.value.length;
  el.value = el.value.slice(0,s)+txt+el.value.slice(e);
  el.focus(); el.setSelectionRange(s+txt.length, s+txt.length);
}
function calcClear(){
  const i=$('#calcIn'), o=$('#calcOut');
  if(i) i.value=''; if(o) o.textContent='';
}
function calcEval(){
  const i=$('#calcIn'), o=$('#calcOut'); if(!i||!o) return;
  const v = evalExpr(i.value.trim());
  o.textContent = Number.isFinite(v) ? `${v}  (≈ ${v.toFixed(6)})` : 'Expression invalide';
}

function initCalc(){
  const panel=$('#calcPanel'), btn=$('#btnCalc');
  if(btn && panel) btn.addEventListener('click',()=> {
    panel.style.display = panel.style.display==='block' ? 'none' : 'block';
  });
  const eq=$('#btnCalcEq'), clr=$('#btnCalcClear');
  if(eq)  eq.addEventListener('click', calcEval);
  if(clr) clr.addEventListener('click', calcClear);
  $$('.calc-key[data-ins]').forEach(k=>k.addEventListener('click',()=>calcInsert(k.dataset.ins)));
}

document.addEventListener('DOMContentLoaded', initCalc);

/* 🎧 Bouton musique — tolérant si piano.mp3 est absent */
(function(){
  const btn = document.getElementById('toggleMusic');
  const audio = document.getElementById('bgMusic');
  if(!btn || !audio) return;

  // Si le fichier n'existe pas, on désactive proprement le bouton
  audio.addEventListener('error',()=>{
    btn.textContent = '🎵 Ajouter piano.mp3';
    btn.disabled = true; btn.style.opacity = .6;
  });

  // Premier clic : essayer de jouer (certains navigateurs exigent une action utilisateur)
  btn.onclick = async () => {
    try{
      audio.volume = .28;
      await audio.play();
      btn.textContent = '🔇 Couper';
      // ensuite, toggle simple
      btn.onclick = () => {
        if(audio.paused){ audio.play(); btn.textContent='🔇 Couper'; }
        else { audio.pause(); btn.textContent='🔈 Musique'; }
      };
    }catch{
      // Si le navigateur bloque, l’utilisateur peut recliquer
    }
  };
})();
