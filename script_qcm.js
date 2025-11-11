// ==========================
// SPILERIX QCM LOGARITHMES
// ==========================

let questions = [
  {
    question: "1️⃣ Quelle est la propriété du produit des logarithmes ?",
    options: [
      "log(a×b) = log a × log b",
      "log(a×b) = log a + log b",
      "log(a×b) = log a − log b"
    ],
    correct: 1,
    explanation:
      "La propriété du produit est : log(a×b) = log a + log b. On additionne les logs d’un produit.",
  },
  {
    question: "2️⃣ Si ln(2x−1) existe, quelle condition doit respecter x ?",
    options: ["x > 1/2", "x ≥ 0", "x > 0"],
    correct: 0,
    explanation: "Pour que ln(2x−1) soit défini, il faut que 2x−1 > 0 ⇒ x > 1/2.",
  },
  {
    question: "3️⃣ log(10) vaut…",
    options: ["1", "10", "0"],
    correct: 0,
    explanation: "log(10) = 1 car log signifie log base 10. Donc 10¹ = 10.",
  },
  {
    question: "4️⃣ Quelle est la propriété du quotient des logarithmes ?",
    options: [
      "log(a/b) = log a + log b",
      "log(a/b) = log a − log b",
      "log(a/b) = log a × log b"
    ],
    correct: 1,
    explanation: "La propriété du quotient est : log(a/b) = log a − log b.",
  },
  {
    question: "5️⃣ log_a(x^r) = ?",
    options: [
      "r × log_a(x)",
      "x × log_a(r)",
      "r / log_a(x)"
    ],
    correct: 0,
    explanation:
      "log_a(x^r) = r × log_a(x). L’exposant devient un coefficient devant le log.",
  },
  {
    question: "6️⃣ Quelle est la base de ln(x) ?",
    options: ["10", "2", "e (≈ 2,718)"],
    correct: 2,
    explanation: "ln(x) est le logarithme népérien : sa base est e ≈ 2,718.",
  },
  {
    question: "7️⃣ Si log(2) ≈ 0,3 alors log(200) = ?",
    options: ["0,6", "2,3", "3,3"],
    correct: 1,
    explanation: "log(200) = log(2) + log(100) = 0,3 + 2 = 2,3.",
  },
  {
    question: "8️⃣ Si log(x) = 2, alors x = ?",
    options: ["100", "10", "1"],
    correct: 0,
    explanation: "log(x)=2 signifie que 10² = x, donc x = 100.",
  },
  {
    question: "9️⃣ Quelle est la formule du changement de base ?",
    options: [
      "log_a(x) = log_b(x) / log_b(a)",
      "log_a(x) = log_b(a) / log_b(x)",
      "log_a(x) = log_b(x) × log_b(a)"
    ],
    correct: 0,
    explanation:
      "Formule du changement de base : log_a(x) = log_b(x) / log_b(a).",
  },
  {
    question: "🔟 ln(e⁴) = ?",
    options: ["4", "e⁴", "1/4"],
    correct: 0,
    explanation: "ln(e⁴) = 4 car ln et e sont inverses : ln(e^x) = x.",
  },
];

let current = 0;
let score = 0;
let voiceEnabled = false;
let synth = window.speechSynthesis;

// Sélecteurs DOM
const questionTitle = document.getElementById("questionTitle");
const optionsDiv = document.getElementById("options");
const feedbackDiv = document.getElementById("feedback");
const nextBtn = document.getElementById("nextQuestion");
const toggleVoiceBtn = document.getElementById("toggleVoice");
const progressDiv = document.getElementById("progress");

loadQuestion();

// -------------------------
// Fonctions principales
// -------------------------
function loadQuestion() {
  feedbackDiv.innerHTML = "";
  const q = questions[current];
  questionTitle.textContent = q.question;
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.classList.add("option");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsDiv.appendChild(btn);
  });

  progressDiv.textContent = `Question ${current + 1} / ${questions.length}`;
}

function checkAnswer(choice) {
  const q = questions[current];
  const allOptions = document.querySelectorAll(".option");

  allOptions.forEach((opt, i) => {
    opt.onclick = null;
    if (i === q.correct) opt.classList.add("correct");
    else if (i === choice) opt.classList.add("wrong");
  });

  const correct = choice === q.correct;
  if (correct) {
    feedbackDiv.innerHTML = "✅ Correct !";
    speak("Bien joué ! C’est la bonne réponse.");
    score++;
  } else {
    feedbackDiv.innerHTML = `❌ Faux. Regarde l’explication : <br>${q.explanation}`;
    speak("Ce n’est pas tout à fait juste, écoute : " + q.explanation);
  }
}

nextBtn.onclick = () => {
  if (current < questions.length - 1) {
    current++;
    loadQuestion();
  } else {
    showResult();
  }
};

toggleVoiceBtn.onclick = () => {
  voiceEnabled = !voiceEnabled;
  toggleVoiceBtn.textContent = voiceEnabled ? "🔇 Couper la voix" : "🔊 Activer la voix";
  if (voiceEnabled) speak("La voix du prof Spilerix est activée. Bonne chance !");
};

// -------------------------
// Synthèse vocale 🇧🇪
// -------------------------
function speak(text) {
  if (!voiceEnabled) return;
  if (synth.speaking) synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-BE";
  utter.pitch = 1;
  utter.rate = 0.98;
  utter.volume = 1;
  synth.speak(utter);
}

// -------------------------
// Score + certificat
// -------------------------
function showResult() {
  const pourcentage = Math.round((score / questions.length) * 100);
  localStorage.setItem("dernierScore", pourcentage);

  questionTitle.textContent = "🎉 Test terminé !";
  optionsDiv.innerHTML = "";
  feedbackDiv.innerHTML = "";

  const resultBox = document.createElement("div");
  resultBox.classList.add("card");
  resultBox.style.textAlign = "center";

  resultBox.innerHTML = `
    <h2>Résultat final</h2>
    <canvas id="scoreCanvas" width="200" height="200"></canvas>
    <p id="scoreText" style="font-size:1.4em;margin-top:10px;">${pourcentage}% de réussite</p>
    <p style="opacity:0.8;">${getMessage(pourcentage)}</p>
    <div class="row" style="justify-content:center;margin-top:20px;gap:10px;">
      <a href="exercices.html" class="btn vert">🔁 Recommencer</a>
      <a href="certificat.html" class="btn certif-btn">🎓 Voir mon certificat</a>
    </div>
  `;
  feedbackDiv.appendChild(resultBox);
  nextBtn.style.display = "none";

  drawScoreCircle(pourcentage);
  speak(`Bravo ! Tu as obtenu ${pourcentage} pour cent.`);
}

function getMessage(score) {
  if (score === 100) return "🌟 Excellent ! Tu maîtrises parfaitement les logarithmes.";
  if (score >= 80) return "💪 Très bon niveau ! Continue comme ça.";
  if (score >= 60) return "👌 Pas mal du tout, revois quelques formules.";
  if (score >= 40) return "🧩 Les bases sont là, continue ton effort.";
  return "🕹️ Courage ! Reprends les cours et tu progresseras vite.";
}

function drawScoreCircle(pourcentage) {
  const canvas = document.getElementById("scoreCanvas");
  const ctx = canvas.getContext("2d");
  const radius = 80;
  const lineWidth = 10;
  let progress = 0;

  function animateCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(100, 100, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      100,
      100,
      radius,
      -Math.PI / 2,
      (-Math.PI / 2) + (2 * Math.PI * progress) / 100
    );
    ctx.strokeStyle = "#a88bff";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(progress)}%`, 100, 100);

    if (progress < pourcentage) {
      progress += 1;
      requestAnimationFrame(animateCircle);
    }
  }
  animateCircle();
}
