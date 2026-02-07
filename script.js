// ===== LOAD SAVED DATA =====
let history = JSON.parse(localStorage.getItem("history")) || [];
let period = parseInt(localStorage.getItem("period")) || 10001;
let correctBS = parseInt(localStorage.getItem("correctBS")) || 0;
let total = parseInt(localStorage.getItem("total")) || 0;

// ===== HELPERS =====
function isBig(n) {
  return n >= 5;
}

// ===== INITIAL RENDER =====
renderAll();

// ===== MAIN FUNCTION =====
function addResult(num) {
  history.push(num);
  total++;

  const type = isBig(num) ? "BIG" : "SMALL";

  // prediction based on last 5
  let last = history.slice(-5);
  let bigCount = last.filter(isBig).length;
  let smallCount = last.length - bigCount;
  let prediction = bigCount >= smallCount ? "BIG" : "SMALL";

  if (prediction === type) correctBS++;

  // save data
  saveData();

  // update UI
  updateStats(prediction);
  addHistoryRow(period, num, type);

  period++;
  localStorage.setItem("period", period);
}

// ===== SAVE =====
function saveData() {
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("correctBS", correctBS);
  localStorage.setItem("total", total);
}

// ===== UPDATE STATS =====
function updateStats(prediction) {
  let acc = total > 0 ? Math.round((correctBS / total) * 100) : 0;

  // strong numbers
  let freq = {};
  history.forEach(n => freq[n] = (freq[n] || 0) + 1);
  let sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);

  document.getElementById("n1").innerText = sorted[0]?.[0] ?? "–";
  document.getElementById("n2").innerText = sorted[1]?.[0] ?? "–";

  document.getElementById("bsPrediction").innerText = prediction;
  document.getElementById("confidence").innerText = acc + "%";
  document.getElementById("outAcc").innerText = acc + "%";
  document.getElementById("bsAcc").innerText = acc + "%";

  document.getElementById("reason").innerText =
    `Detected ${prediction} dominance from recent outcomes.`;
}

// ===== HISTORY UI =====
function addHistoryRow(p, num, type) {
  const row = document.createElement("div");
  row.className = "history-row";

  row.innerHTML = `
    <span>${p}</span>
    <span>${num}</span>
    <span class="${type === "BIG" ? "big" : "small"}">${type}</span>
  `;

  document.getElementById("historyList").prepend(row);
}

// ===== RENDER SAVED DATA =====
function renderAll() {
  document.getElementById("historyList").innerHTML = "";

  history.forEach((num, index) => {
    const type = isBig(num) ? "BIG" : "SMALL";
    addHistoryRow(10001 + index, num, type);
  });

  if (history.length >= 2) {
    let last = history.slice(-5);
    let bigCount = last.filter(isBig).length;
    let smallCount = last.length - bigCount;
    let prediction = bigCount >= smallCount ? "BIG" : "SMALL";
    updateStats(prediction);
  }
}
