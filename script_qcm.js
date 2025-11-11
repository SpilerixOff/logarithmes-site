// ==========================
// SPILERIX — QCM LOGARITHMES
// Voix masculine belge • Popup nom • Certificat
// ==========================

/* ---------- Banque de questions ---------- */
const questions = [
  { question:"1️⃣ Propriété du produit ?", options:["log(ab)=loga×logb","log(ab)=loga+logb","log(ab)=loga−logb"], correct:1,
    explanation:"Produit → on additionne : log(a×b) = log a + log b."},

  { question:"2️⃣ Domaine : ln(2x−1) défini si…", options:["x > 1/2","x ≥ 0","x > 0"], correct:0,
    explanation:"2x−1 > 0 ⇒ x > 1/2."},

  { question:"3️⃣ log(10) = ?", options:["1","10","0"], correct:0,
    explanation:"log signifie base 10 : 10¹ = 10 ⇒ log(10) = 1."},

  { question:"4️⃣ Propriété du quotient ?", options:["log(a/b)=loga+logb","log(a/b)=loga−logb","log(a/b)=loga×logb"], correct:1,
    explanation:"Quotient → on soustrait : log(a/b) = log a − log b."},

  { question:"5️⃣ log_a(x^r) = ?", options:["r·log_a(x)","x·log_a(r)","r / log_a(x)"], correct:0,
    explanation:"Puissance : l’exposant descend → r · log_a(x)."},

  { question:"6️⃣ Base de ln(x) ?", options:["10","2","e (≈ 2,718)"], correct:2,
    explanation:"ln est en base e ≈ 2,718 (logarithme népérien)."},

  { question:"7️⃣ log(2)≈0,3 → log(200)= ?", options:["0,6","2,3","3,3"], correct:1,
    explanation:"log(200) = log(2) + log(100) = 0,3 + 2 = 2,3."},

  { question:"8️⃣ log(x)=2 ⇒ x = ?", options:["100","10","1"], correct:0,
    explanation:"log base 10 : 10² = x ⇒ x = 100."},

  { question:"9️⃣ Changement de base ?", options:[
      "log_a x = log_b x / log_b a",
      "log_a x = log_b a / log_b x",
      "log_a x = log_b x · log_b a"
    ], correct:0,
    explanation:"log_a x = (log_b x) / (log_b a)."},

  { question:"🔟 ln(e⁴) = ?", options:["4","e⁴","1/4"], correct:0,
    explanation:"ln(e^x) = x ⇒ ln(e⁴) = 4."}
];

/* ---------- État ---------- */
let current = 0;
let score = 0;
let answered = false;

let voiceEnabled = false;
const synth = window.speechSynthesis;

/* ---------- Sélecteurs DOM ---------- */
const questionTitle = document.getElementById("questionTitle");
const optionsDiv     = document.getElementById("options");
const feedbackDiv    = document.getElementById("feedback");
const nextBtn        = document.getElementById("nextQuestion");
const toggleVoiceBtn = document.getElementById("toggleVoice");
const progressDiv    = document.getElementById("progress");

/* ---------- Initialisation ---------- */
loadQuestion();
wireControls();

/* ---------- Fonctions principales ---------- */
function loadQuestion() {
  answered = false;
  feedbackDiv.innerHTML = "";
  nextBtn.disabled = true;

  const q = questions[current];
  questionTitle.textContent = q.question;
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.textContent = opt;
    btn.setAttribute("data-index", i);
    btn.onclick = () => checkAnswer(i);
    optionsDiv.appendChild(btn);
  });

  progressDiv.textContent = `Question ${current + 1} / ${questions.length}`;
}

function checkAnswer(choice) {
  if (answered) return;
  answered = true;
  nextBtn.disabled = false;

  const q = questions[current];
  const all = optionsDiv.querySelectorAll(".option");

  all.forEach((opt, i) => {
    opt.onclick = null;
    if (i === q.correct) opt.classList.add("correct");
    else if (i === choice) opt.classList.add("wrong");
    // on empêche le focus clavier d’appuyer encore
    opt.setAttribute("disabled", "disabled");
  });

  if (choice === q.correct) {
    score++;
    feedbackDiv.innerHTML = "✅ Correct !";
    speak("Bien joué, c'est correct !");
  } else {
    feedbackDiv.innerHTML = `❌ Faux. Explication : <br>${q.explanation}`;
    speak("Ce n'est pas tout à fait juste. Écoute : " + q.explanation);
  }
}

nextBtn.onclick = () => {
  if (!answered) {
    pulse(nextBtn);
    return;
  }
  if (current < questions.length - 1) {
    current++;
    loadQuestion();
  } else {
    endQuiz();
  }
};

toggleVoiceBtn.onclick = () => {
  voiceEnabled = !voiceEnabled;
  toggleVoiceBtn.textContent = voiceEnabled ? "🔇 Couper la voix" : "🔊 Activer la voix";
  if (voiceEnabled) speak("La voix du prof Spilerix est activée. Bonne chance !");
};

/* ---------- Voix masculine belge (aucune voix ailleurs) ---------- */
function speak(text) {
  if (!voiceEnabled) return;
  try {
    if (synth.speaking) synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-BE";  // accent belge
    u.pitch = 1;
    u.rate  = 0.98;
    u.volume = 1;
    synth.speak(u);
  } catch { /* pas grave si refus navigateur */ }
}

/* ---------- Fin de quiz : popup nom → certificat ---------- */
function endQuiz() {
  const pct = Math.round((score / questions.length) * 100);
  localStorage.setItem("dernierScore", String(pct));

  // Popup de nom (mobile-friendly)
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:1000;padding:14px;";
  overlay.innerHTML = `
    <div style="background:#151529;border:1px solid #2c2c52;border-radius:16px;padding:18px;max-width:360px;width:100%;text-align:center;color:#eaf2ff;">
      <h3 style="margin:0 0 8px;">🎓 Générer mon certificat</h3>
      <p style="opacity:.85;margin:0 0 10px;">Entre ton prénom pour l’afficher sur le diplôme :</p>
      <input id="certNameInput" class="input" placeholder="ex: Samir" style="text-align:center;margin-bottom:10px;">
      <div style="display:flex;gap:10px;justify-content:center;">
        <button id="certOk" class="btn vert">Valider</button>
        <button id="certSkip" class="btn">Passer</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const ok   = overlay.querySelector("#certOk");
  const skip = overlay.querySelector("#certSkip");

  ok.onclick = () => {
    const name = (overlay.querySelector("#certNameInput").value || "Élève").trim();
    localStorage.setItem("certName", name);
    location.href = "certificat.html";
  };
  skip.onclick = () => {
    localStorage.setItem("certName", "Élève");
    location.href = "certificat.html";
  };
}

/* ---------- Accessibilité & confort ---------- */
function wireControls() {
  // ENTER pour “Suivant” si répondu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!answered) return;
      nextBtn.click();
    }
  });
}

/* ---------- Petit effet visuel si on clique Suivant sans répondre ---------- */
function pulse(el) {
  el.style.transform = "scale(1.04)";
  el.style.boxShadow = "0 0 12px #67ddb5";
  setTimeout(() => {
    el.style.transform = "";
    el.style.boxShadow = "";
  }, 180);
}
