// ===== LOAD SAVED DATA =====
let history = JSON.parse(localStorage.getItem("history")) || [];
let period = parseInt(localStorage.getItem("period")) || 10001;
let correctBS = parseInt(localStorage.getItem("correctBS")) || 0;
let total = parseInt(localStorage.getItem("total")) || 0;
let lastPrediction = localStorage.getItem("lastPrediction") || "WAITING";

// ===== HELPERS =====
function isBig(n) {
  return n >= 5;
}

// ===== INITIAL RENDER =====
renderAll();

// ===== MAIN =====
function addResult(num) {
  const actualType = isBig(num) ? "BIG" : "SMALL";

  let status = "LOSS";
  if (lastPrediction === actualType) {
    status = "WIN";
    correctBS++;
  }

  total++;

  history.push({
    period,
    num,
    type: actualType,
    status
  });

  // Prediction logic (last 5)
  let last = history.slice(-5);
  let bigCount = last.filter(x => x.type === "BIG").length;
  let smallCount = last.length - bigCount;

  let prediction = bigCount >= smallCount ? "BIG" : "SMALL";
  lastPrediction = prediction;

  // Save
  saveData();

  // UI
  updateStats(prediction);
  addHistoryRow(period, num, actualType, status);

  period++;
  localStorage.setItem("period", period);
}

// ===== SAVE =====
function saveData() {
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("correctBS", correctBS);
  localStorage.setItem("total", total);
  localStorage.setItem("lastPrediction", lastPrediction);
}

// ===== UPDATE UI =====
function updateStats(prediction) {
  let acc = total > 0 ? Math.round((correctBS / total) * 100) : 0;

  // strong numbers
  let freq = {};
  history.forEach(h => freq[h.num] = (freq[h.num] || 0) + 1);
  let sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);

  document.getElementById("n1").innerText = sorted[0]?.[0] ?? "–";
  document.getElementById("n2").innerText = sorted[1]?.[0] ?? "–";

  document.getElementById("bsPrediction").innerText = prediction;
  document.getElementById("confidence").innerText = acc + "%";
  document.getElementById("outAcc").innerText = acc + "%";
  document.getElementById("bsAcc").innerText = acc + "%";

  document.getElementById("reason").innerText =
    `Prediction based on recent BIG/SMALL dominance.`;
}

// ===== HISTORY ROW =====
function addHistoryRow(p, num, type, status) {
  const row = document.createElement("div");
  row.className = "history-row";

  row.innerHTML = `
    <span>${p}</span>
    <span>${num}</span>
    <span class="${type === "BIG" ? "big" : "small"}">${type}</span>
    <span class="${status === "WIN" ? "win" : "loss"}">${status}</span>
  `;

  document.getElementById("historyList").prepend(row);
}

// ===== LOAD HISTORY =====
function renderAll() {
  document.getElementById("historyList").innerHTML = "";

  history.forEach(h => {
    addHistoryRow(h.period, h.num, h.type, h.status);
  });

  if (history.length > 0) {
    updateStats(lastPrediction);
  }
}
