
const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const $ =(s,c=document)=>c.querySelector(s);
const bg=document.createElement('canvas');bg.className='bg';document.body.prepend(bg);
const ctx=bg.getContext('2d');let glyphs=[];
function resize(){const dpr=window.devicePixelRatio||1;const w=innerWidth,h=innerHeight;bg.width=w*dpr;bg.height=h*dpr;bg.style.width=w+'px';bg.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  const N=Math.max(80,Math.floor((w+h)/9));glyphs=Array.from({length:N},()=>({t:Math.random()<0.6?'+':'log',x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,s:16+Math.random()*28,a:.22+Math.random()*.2}));}
function draw(){const w=innerWidth,h=innerHeight;const g=ctx.createRadialGradient(w*.7,-h*.1,0,w*.7,-h*.1,Math.max(w,h));g.addColorStop(0,'#242f55aa');g.addColorStop(1,'#0000');ctx.clearRect(0,0,w,h);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  glyphs.forEach(o=>{o.x+=o.vx;o.y+=o.vy;if(o.x<-60||o.x>w+60)o.vx*=-1;if(o.y<-60||o.y>h+60)o.vy*=-1;ctx.save();ctx.globalAlpha=o.a;ctx.fillStyle=o.t==='+'?'#b39bff':'#9a8cff';ctx.font=`800 ${o.s}px Inter`;ctx.textBaseline='top';ctx.fillText(o.t,o.x,o.y);ctx.restore();});requestAnimationFrame(draw);}addEventListener('resize',resize);resize();requestAnimationFrame(draw);
function mjx(el){ if(window.renderMathInElement) renderMathInElement(el); }
const T=[{title:'Règle PRODUIT',parts:['Formule : \\( \\log_a(xy)=\\log_a x+\\log_a y \\).','Astuce : multiplier **à l intérieur** → additionner **à l extérieur**.','Exemple : \\( \\log(200)=\\log(2\\cdot 100)=\\log2+\\log100=\\log2+2 \\).'],alt:'Multiplie les facteurs ⇒ additionne les logs.'},
{title:'Règle QUOTIENT',parts:['Formule : \\( \\log_a(\\tfrac{x}{y})=\\log_a x-\\log_a y \\).','Astuce : diviser dedans → soustraire dehors.','Exemple : \\( \\log(\\tfrac{1}{100})=0-2=-2 \\).'],alt:'Diviser enlève du “poids” ⇒ soustraction.'},
{title:'Règle PUISSANCE',parts:['Formule : \\( \\log_a(x^r)=r\\,\\log_a x \\).','Astuce : l exposant **descend** devant.','Exemple : \\( \\log(10^3)=3 \\).'],alt:'L exposant devient un facteur : on gagne du temps.'},
{title:'Équations simples',parts:['Expo : \\( a^x=b \\Rightarrow x=\\dfrac{\\ln b}{\\ln a} \\).','Log : \\( \\log_a x=c \\Rightarrow x=a^c \\).','Ln : \\( 2\\ln(x+1)=\\ln3+\\ln(2x-1) \\Rightarrow (x+1)^2=6x-3 \\Rightarrow x=2 \\).'],alt:'Toujours : Domaine → Regrouper → Exponentialiser → Vérifier.'}];
let ti=0,td=0; function openTutor(){ $('#tBox').innerHTML=''; $('#tQuiz').innerHTML=''; $('#tPanel').style.display='block'; ti=0; td=0; renderTutor(); } function closeTutor(){ $('#tPanel').style.display='none'; }
function tMore(){ td=Math.min(td+1,2); renderTutor(); } function tNext(){ if(ti<T.length-1){ ti++; td=0; renderTutor(); } else showTQuiz(); } function tAlt(){ $('#tBox').innerHTML=`<div class="step">${T[ti].alt}</div>`; mjx($('#tBox')); }
function renderTutor(){ const s=T[ti]; $('#tTitle').textContent=s.title; $('#tBox').innerHTML=s.parts.slice(0,td+1).map((p,i)=>`<div class="step ${i===td?'pulse':''}">${p}</div>`).join(''); mjx($('#tBox')); $('#tQuiz').innerHTML=''; }
function showTQuiz(){ const Q=[{q:'\\(\\log(25)+\\log(4)=?\\)',a:'2'},{q:'\\(\\log(\\tfrac{20}{5})=?\\)',a:'\\log(4)'},{q:'\\(\\log(\\sqrt{10})=?\\)',a:'1/2'}]; const cur=Q[ti%Q.length];
  $('#tQuiz').innerHTML=`<div class="step"><b>Quiz :</b> ${cur.q}<div class="row" style="margin-top:6px"><input id="tAnswer" class="input" style="width:220px" placeholder="Ta réponse"><button class="btn safe" onclick="checkTQuiz('${cur.a.replace("'","\'")}')">Vérifier</button></div><div id="tFb" class="small"></div></div>`; mjx($('#tQuiz')); }
function checkTQuiz(sol){ const v=($('#tAnswer').value||'').replace(/\s+/g,'').replace(',','.'); const s=sol.replace(/\s+/g,''); $('#tFb').innerHTML = v===s ? '<span style="color:#67ddb5">✔️ Correct</span>' : '<span style="color:#ffd6e3">✖️ Réessaie : applique la règle.</span>'; }
function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function gen(type){ let ex={}; if(type==='B'){ const a=rnd(2,9), b=rnd(2,9), k=rnd(2,4); ex={t:`\\( \\log ${a}+${k}\\,\\log ${b}=\\log(?) \\)`, ans:a*(b**k), hint:'k log b = log(b^k).'}; }
  if(type==='D'){ const base=[2,3,4,5][rnd(0,3)], val=rnd(8,90); ex={t:`\\( ${base}^x=${val} \\)`, ans:(Math.log(val)/Math.log(base)), hint:`x=ln(${val})/ln(${base})`}; }
  if(type==='C'){ const c=rnd(1,4), d=rnd(2,6); ex={t:`\\( \\ln(x+${c})+\\ln(${d}x-1)=\\ln ${c*d} \\)`, ans:2, hint:'ln(a)+ln(b)=ln(ab).'}; }
  $('#qBox').innerHTML=ex.t; $('#qBox').dataset.ans=ex.ans; $('#qBox').dataset.hint=ex.hint; if(window.renderMathInElement) renderMathInElement($('#qBox')); $('#ans').value=''; $('#fb').textContent=''; }
function evalExpr(expr){ if(!expr) return NaN; let s=String(expr).toLowerCase().replaceAll(',','.'); if(/[^0-9+\-*/^()., \t a-z]/.test(s)) return NaN; s=s.replaceAll('^','**'); s=s.replaceAll('sqrt','Math.sqrt'); s=s.replaceAll('ln','Math.log');
  const LOG=(x)=> (Math.log10?Math.log10(x):(Math.log(x)/Math.LN10)); const PI=Math.PI, E=Math.E; try{ return Function('Math','LOG','PI','E',`const log=LOG, pi=PI, e=E; return (${s})`)(Math,LOG,PI,E); }catch(e){ return NaN; } }
function check(){ const ans=parseFloat($('#qBox').dataset.ans); const val=evalExpr($('#ans').value); const fb=$('#fb'); if(Number.isFinite(val) && Math.abs(val-ans)<=1e-3){ fb.textContent='✔️ Correct'; fb.style.color='#67ddb5'; } else { fb.textContent='✖️ Pas encore. Indice : '+($('#qBox').dataset.hint||''); fb.style.color='#ffd6e3'; } }
function openCalc(){ $('#calcPanel').style.display='block'; $('#calcIn').focus(); } function closeCalc(){ $('#calcPanel').style.display='none'; }
function calcInsert(txt){ const el=$('#calcIn'); const s=el.selectionStart??el.value.length, e=el.selectionEnd??el.value.length; const v=el.value; el.value=v.slice(0,s)+txt+v.slice(e); el.focus(); const pos=s+txt.length; el.setSelectionRange(pos,pos); }
function calcClear(){ $('#calcIn').value=''; $('#calcOut').textContent=''; }
function calcEval(){ const expr=$('#calcIn').value.trim(); const val=evalExpr(expr); const out=$('#calcOut'); if(Number.isFinite(val)){ out.textContent=`${val}  (≈ ${val.toFixed(6)})`; pushHist(expr+' = '+val); } else out.textContent='Expression invalide'; }
function pushHist(s){ const h=$('#calcHist'); const row=document.createElement('div'); row.textContent=s; h.prepend(row); }
function calcCopy(){ const t=$('#calcOut').textContent; if(!t) return; navigator.clipboard.writeText(t); const b=$('#copyBtn'); const old=b.textContent; b.textContent='Copié ✓'; setTimeout(()=>b.textContent=old,800); }
function calcKeyPress(e){ if(e.key==='Enter'){ calcEval(); } }
window.gen=gen; window.check=check; window.openTutor=openTutor; window.closeTutor=closeTutor; window.tMore=tMore; window.tNext=tNext; window.tAlt=tAlt;
window.openCalc=openCalc; window.closeCalc=closeCalc; window.calcInsert=calcInsert; window.calcClear=calcClear; window.calcEval=calcEval; window.calcCopy=calcCopy; window.calcKeyPress=calcKeyPress;

/* ---- DOM bindings for buttons (robust) ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const tbtn = document.getElementById('btnTutor');
  if (tbtn) tbtn.addEventListener('click', ()=>{ try{ openTutor(); }catch(e){ console.error(e); } });
});
