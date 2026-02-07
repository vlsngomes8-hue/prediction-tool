let period = 10712;
let history = [];
let transitions = {};
let lastPredictions = [];

function addResult(result) {

  // build transition map
  if (history.length > 0) {
    const prev = history[history.length - 1];
    if (!transitions[prev]) transitions[prev] = {};
    transitions[prev][result] = (transitions[prev][result] || 0) + 1;
  }

  // status check
  let status = "LOSS";
  if (lastPredictions.includes(String(result))) {
    status = "NUMBER WIN";
  }

  // add row
  addRow(period, lastPredictions.join(","), result, status);

  history.push(String(result));

  // calculate next 2 predictions (based on PREVIOUS number)
  let preds = [];
  if (history.length > 1) {
    const base = history[history.length - 2];
    if (transitions[base]) {
      const sorted = Object.entries(transitions[base])
        .sort((a, b) => b[1] - a[1])
        .map(x => x[0]);

      preds = sorted.slice(0, 2);
    }
  }

  lastPredictions = preds;

  document.getElementById("pred1").innerText =
    preds[0] ? preds[0] : "WAITING";
  document.getElementById("pred2").innerText =
    preds[1] ? preds[1] : "WAITING";

  period++;
}

function addRow(p, pred, res, stat) {
  const tbody = document.getElementById("tableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${p}</td>
    <td>${pred || "-"}</td>
    <td>${res}</td>
    <td class="${stat === "LOSS" ? "loss" : "win"}">${stat}</td>
  `;

  tbody.prepend(row);
}
