let history = [];
let period = 10001;
let correctBS = 0;
let total = 0;

function isBig(n) {
  return n >= 5;
}

function addResult(num) {
  history.push(num);
  total++;

  const type = isBig(num) ? "BIG" : "SMALL";

  // Prediction logic (last 5)
  let last = history.slice(-5);
  let bigCount = last.filter(isBig).length;
  let smallCount = last.length - bigCount;

  let prediction = bigCount >= smallCount ? "BIG" : "SMALL";

  if (prediction === type) correctBS++;

  let acc = Math.round((correctBS / total) * 100);

  // Strong numbers
  let freq = {};
  history.forEach(n => freq[n] = (freq[n] || 0) + 1);
  let sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);

  document.getElementById("n1").innerText = sorted[0][0];
  document.getElementById("n2").innerText = sorted[1]?.[0] ?? "–";

  document.getElementById("bsPrediction").innerText = prediction;
  document.getElementById("confidence").innerText = acc + "%";
  document.getElementById("outAcc").innerText = acc + "%";
  document.getElementById("bsAcc").innerText = acc + "%";

  document.getElementById("reason").innerText =
    `Detected ${prediction} dominance in recent results.`;

  addHistoryRow(period, num, type);
  period++;
}

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
