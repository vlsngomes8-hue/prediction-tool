
let period = 10712;
let history = [];
let transitions = {};
let lastPrediction = "-";

function addResult() {
  const input = document.getElementById("resultInput");
  const result = input.value;

  if (result === "") return;

  // build transition map
  if (history.length > 0) {
    const prev = history[history.length - 1];
    if (!transitions[prev]) transitions[prev] = {};
    transitions[prev][result] = (transitions[prev][result] || 0) + 1;
  }

  history.push(result);

  // generate prediction
  let prediction = "-";
  if (transitions[result]) {
    let max = 0;
    for (let n in transitions[result]) {
      if (transitions[result][n] > max) {
        max = transitions[result][n];
        prediction = n;
      }
    }
  }

  // status logic
  let status = "LOSS";
  if (lastPrediction === result) status = "NUMBER WIN";

  addRow(period, lastPrediction, result, status);

  lastPrediction = prediction;
  document.getElementById("predictionText").innerText =
    prediction === "-" ? "Waiting for data" : `NEXT → ${prediction}`;

  period++;
  input.value = "";
}

function addRow(p, pred, res, stat) {
  const tbody = document.getElementById("tableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${p}</td>
    <td>${pred === "-" ? "-" : pred}</td>
    <td>${res}</td>
    <td class="${stat === "LOSS" ? "loss" : "win"}">${stat}</td>
  `;

  tbody.prepend(row);
}
