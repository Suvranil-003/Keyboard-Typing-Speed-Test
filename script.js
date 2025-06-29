const quoteElement = document.getElementById("quote");
const input = document.getElementById("input");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timeDisplay = document.getElementById("time");
const errorDisplay = document.getElementById("errors");
const progressBar = document.getElementById("progress");
const highWPMDisplay = document.getElementById("high-wpm");
const highAccuracyDisplay = document.getElementById("high-accuracy");
const themeToggle = document.getElementById("theme-toggle");

let quote = "";
let startTime = null;
let timerInterval = null;

const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing is a skill that improves with consistent practice.",
  "Focus on accuracy before speed for better results.",
  "JavaScript is a versatile language for the web.",
  "Frontend development blends creativity and logic.",
  "Good developers write readable and maintainable code.",
  "Learning never exhausts the mind.",
  "Build projects to showcase your skills effectively."
];

// Theme switcher
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

// Restart function
function restart() {
  quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteElement.innerHTML = quote.split("").map(c => `<span>${c}</span>`).join("");
  input.value = "";
  input.disabled = false;
  input.focus();
  clearInterval(timerInterval);
  startTime = null;
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 100;
  timeDisplay.textContent = 0;
  errorDisplay.textContent = 0;
  progressBar.style.width = "0%";
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeDisplay.textContent = elapsed;
    updateStats();
  }, 1000);
}

function updateStats() {
  const typed = input.value;
  const typedArray = typed.split("");
  const quoteSpans = quoteElement.querySelectorAll("span");
  let correct = 0;

  quoteSpans.forEach((span, i) => {
    const char = typedArray[i];
    if (char == null) {
      span.classList.remove("correct", "incorrect");
    } else if (char === span.textContent) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
      correct++;
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  });

  const timeElapsed = (Date.now() - startTime) / 60000;
  const wordsTyped = typed.trim().split(/\s+/).length;
  const wpm = Math.round(wordsTyped / timeElapsed);
  const accuracy = Math.round((correct / typed.length) * 100);
  const errorCount = typed.length - correct;
  const progress = (typed.length / quote.length) * 100;

  wpmDisplay.textContent = isNaN(wpm) ? 0 : wpm;
  accuracyDisplay.textContent = isNaN(accuracy) ? 100 : accuracy;
  errorDisplay.textContent = errorCount > 0 ? errorCount : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;

  // Update high score
  const highWPM = parseInt(localStorage.getItem("highWPM") || "0");
  const highAccuracy = parseInt(localStorage.getItem("highAccuracy") || "0");

  if (wpm > highWPM) localStorage.setItem("highWPM", wpm);
  if (accuracy > highAccuracy) localStorage.setItem("highAccuracy", accuracy);

  highWPMDisplay.textContent = localStorage.getItem("highWPM") || "0";
  highAccuracyDisplay.textContent = localStorage.getItem("highAccuracy") || "0";
}

// Input handler
input.addEventListener("input", () => {
  if (!startTime) startTimer();
  updateStats();

  // Completion check
  if (input.value === quote) {
    clearInterval(timerInterval);
    input.disabled = true;
  }
});

// Inject quote on load
window.onload = restart;
