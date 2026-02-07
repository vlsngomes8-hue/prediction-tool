let period = 10712;
let history = [];
let transitions = {};
let lastPrediction = "-";

function addResult() {
  const input = document.getElementById("resultInput");
  const result = input.value;

  if (result === "") return;

  // build transition data
  if (history.length > 0) {
    const prev = history[history.length - 1];
    if (!transitions[prev]) transitions[prev] = {};
    transitions[prev][result] = (transitions[prev][result] || 0) + 1;
  }

  history.push(result);

  // decide status
  let status = "LOSS";
  if (lastPrediction === result) status = "NUMBER WIN";

  // add row
  addRow(period, lastPrediction, result, status);

  // calculate next prediction
  let nextPrediction = "-";
  if (transitions[result]) {
    let max = 0;
    for (let n in transitions[result]) {
      if (transitions[result][n] > max) {
        max = transitions[result][n];
        nextPrediction = n;
      }
    }
  }

  lastPrediction = nextPrediction;
  document.getElementById("topPrediction").innerText =
    nextPrediction === "-" ? "Waiting for data" : `NEXT → ${nextPrediction}`;

  period++;
  input.value = "";
}

function addRow(p, pred, res, stat) {
  const tbody = document.getElementById("tableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${p}</td>
    <td>${pred}</td>
    <td>${res}</td>
    <td class="${stat === "LOSS" ? "loss" : "win"}">${stat}</td>
  `;

  tbody.prepend(row);
}
