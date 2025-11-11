// =====================================================
// SPILERIX — QCM LOGARITHMES
// • Voix masculine fr-BE/fr-FR uniquement sur demande
// • Aucune voix auto (pas de “bienvenue”)
// • Popup prénom à la fin → certificat.html
// • Sécurités voix (Safari), annulation au changement, anti-double-popup
// =====================================================

/* ---------- Banque de questions ---------- */
const questions = [
  { q:"Propriété du produit ?", a:["log(ab)=loga×logb","log(ab)=loga+logb","log(ab)=loga−logb"], c:1, e:"Produit → on additionne : log(a×b) = log a + log b." },
  { q:"Domaine : ln(2x−1) défini si…", a:["x > 1/2","x ≥ 0","x > 0"], c:0, e:"2x−1 > 0 ⇒ x > 1/2." },
  { q:"log(10) = ?", a:["1","10","0"], c:0, e:"Base 10 : 10¹ = 10 ⇒ log(10) = 1." },
  { q:"Propriété du quotient ?", a:["log(a/b)=loga+logb","log(a/b)=loga−logb","log(a/b)=loga×logb"], c:1, e:"Quotient → on soustrait : log(a/b) = log a − log b." },
  { q:"log_a(x^r) = ?", a:["r·log_a(x)","x·log_a(r)","r/log_a(x)"], c:0, e:"Puissance : l’exposant devient un facteur : r·log_a(x)." },
  { q:"Base de ln(x) ?", a:["10","2","e≈2,718"], c:2, e:"ln est en base e (≈ 2,718)." },
  { q:"log(2)≈0,3 → log(200)= ?", a:["0,6","2,3","3,3"], c:1, e:"log(200)=log(2)+log(100)=0,3+2=2,3." },
  { q:"log(x)=2 ⇒ x= ?", a:["100","10","1"], c:0, e:"10² = x ⇒ x = 100." },
  { q:"Changement de base ?", a:["log_a x = log_b x / log_b a","log_a x = log_b a / log_b x","log_a x = log_b x · log_b a"], c:0, e:"log_a x = (log_b x) / (log_b a)." },
  { q:"ln(e⁴) = ?", a:["4","e⁴","1/4"], c:0, e:"ln(e^x)=x ⇒ ln(e⁴)=4." }
];

/* ---------- État ---------- */
let idx = 0;
let score = 0;
let answered = false;
let popupShown = false;

/* ---------- DOM ---------- */
const questionTitle = document.getElementById('questionTitle');
const optionsBox    = document.getElementById('options');
const feedbackBox   = document.getElementById('feedback');
const nextBtn       = document.getElementById('nextQuestion');
const voiceBtn      = document.getElementById('toggleVoice');
const progressText  = document.getElementById('progress');

/* ---------- Voix (masculine fr) ---------- */
let voiceEnabled = false;
let chosenVoice = null;
const synth = window.speechSynthesis || null;

function pickVoice() {
  if (!synth || !synth.getVoices) return null;
  const list = synth.getVoices();
  if (!list || !list.length) return null;

  // 1) Masculine fr-BE
  let v = list.find(v => /fr-?BE/i.test(v.lang) && /male|homme|mascul/i.test(v.name));
  if (v) return v;
  // 2) Masculine fr-FR
  v = list.find(v => /fr-?FR/i.test(v.lang) && /male|homme|mascul/i.test(v.name));
  if (v) return v;
  // 3) Toute fr-BE
  v = list.find(v => /fr-?BE/i.test(v.lang));
  if (v) return v;
  // 4) Toute fr-*
  v = list.find(v => /^fr/i.test(v.lang));
  if (v) return v;
  // 5) Fallback
  return list[0] || null;
}

// Initialisation voix (certaines plateformes chargent async)
if (synth) {
  const set = () => { chosenVoice = pickVoice(); };
  synth.onvoiceschanged = set;
  // essai immédiat + re-essai léger
  set();
  setTimeout(set, 500);
}

function speak(text) {
  if (!voiceEnabled || !synth || !text) return;
  try {
    if (synth.speaking) synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = (chosenVoice && chosenVoice.lang) ? chosenVoice.lang : 'fr-BE';
    if (chosenVoice) u.voice = chosenVoice;
    u.pitch = 1; u.rate = 0.98; u.volume = 1;
    synth.speak(u);
  } catch { /* ignore */ }
}

/* ---------- Rendu QCM ---------- */
function loadQuestion() {
  // coupe toute voix en cours
  if (synth && synth.speaking) synth.cancel();

  answered = false;
  nextBtn.disabled = true;
  feedbackBox.innerHTML = '';

  const q = questions[idx];
  questionTitle.textContent = q.q;
  optionsBox.innerHTML = '';

  q.a.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.textContent = label;
    btn.setAttribute('data-index', i);
    btn.onclick = () => checkAnswer(i);
    optionsBox.appendChild(btn);
  });

  progressText.textContent = `Question ${idx + 1} / ${questions.length}`;
}

function checkAnswer(choice) {
  if (answered) return;
  answered = true;
  nextBtn.disabled = false;

  const q = questions[idx];
  const opts = optionsBox.querySelectorAll('.option');

  opts.forEach((el, i) => {
    el.onclick = null;
    el.disabled = true;
    if (i === q.c) el.classList.add('correct');
    else if (i === choice) el.classList.add('wrong');
  });

  if (choice === q.c) {
    score++;
    feedbackBox.innerHTML = '✅ Correct !';
    speak('Bien joué, c’est correct !');
  } else {
    feedbackBox.innerHTML = `❌ Faux. Explication : <br>${q.e}`;
    speak('Ce n’est pas tout à fait juste. Écoute : ' + q.e);
  }
}

/* ---------- Boutons ---------- */
nextBtn.addEventListener('click', () => {
  if (!answered) { pulse(nextBtn); return; }
  if (idx < questions.length - 1) {
    idx++;
    loadQuestion();
  } else {
    endQuiz();
  }
});

voiceBtn.addEventListener('click', () => {
  voiceEnabled = !voiceEnabled;
  voiceBtn.setAttribute('aria-pressed', String(voiceEnabled));
  voiceBtn.textContent = voiceEnabled ? '🔇 Couper la voix' : '🔊 Activer la voix';
  if (voiceEnabled) speak('Voix activée. Bonne chance !');
  else if (synth && synth.speaking) synth.cancel();
});

// ENTER = Suivant (si répondu)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && answered) nextBtn.click();
});

// Petit feedback si on clique Suivant sans répondre
function pulse(el) {
  el.style.transform = 'scale(1.04)';
  el.style.boxShadow = '0 0 12px #67ddb5';
  setTimeout(() => { el.style.transform=''; el.style.boxShadow=''; }, 180);
}

/* ---------- Fin du quiz ---------- */
function endQuiz() {
  if (popupShown) return; // anti double
  popupShown = true;

  const pct = Math.round((score / questions.length) * 100);
  localStorage.setItem('dernierScore', String(pct));

  // Popup prénom (mobile-friendly)
  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:1000;padding:14px;';
  overlay.innerHTML = `
    <div style="background:#151529;border:1px solid #2c2c52;border-radius:16px;padding:18px;max-width:360px;width:100%;text-align:center;color:#eaf2ff;">
      <h3 style="margin:0 0 8px;">🎓 Générer mon certificat</h3>
      <p style="opacity:.85;margin:0 0 10px;">Entre ton prénom pour l’afficher sur le diplôme :</p>
      <input id="certNameInput" class="input" placeholder="ex: Samir" style="text-align:center;margin-bottom:10px;">
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button id="certOk"   class="btn vert">Valider</button>
        <button id="certSkip" class="btn">Passer</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const ok   = overlay.querySelector('#certOk');
  const skip = overlay.querySelector('#certSkip');

  ok.onclick = () => {
    const name = (overlay.querySelector('#certNameInput').value || 'Élève').trim();
    localStorage.setItem('certName', name);
    location.href = 'certificat.html';
  };
  skip.onclick = () => {
    localStorage.setItem('certName', 'Élève');
    location.href = 'certificat.html';
  };
}

/* ---------- Nettoyage à la fermeture ---------- */
window.addEventListener('beforeunload', () => {
  if (synth && synth.speaking) synth.cancel();
});

/* ---------- Lancement ---------- */
loadQuestion(); // aucune voix auto ici
