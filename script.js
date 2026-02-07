let history = [];
let correctBS = 0;
let total = 0;

function isBig(n) {
  return n >= 5;
}

function addResult(num) {
  history.push(num);
  total++;

  if (history.length < 3) return;

  // BIG / SMALL trend
  let last = history.slice(-5);
  let bigCount = last.filter(isBig).length;
  let smallCount = last.length - bigCount;

  let prediction = bigCount >= smallCount ? "BIG" : "SMALL";

  // accuracy
  if ((prediction === "BIG" && isBig(num)) ||
      (prediction === "SMALL" && !isBig(num))) {
    correctBS++;
  }

  let acc = Math.round((correctBS / total) * 100);

  // strong numbers
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
    `Detected ${bigCount > smallCount ? "BIG" : "SMALL"} dominance in last ${last.length} results.`;
}
