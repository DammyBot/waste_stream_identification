const tableBody = document.querySelector("#wasteTable tbody");
const clearAllBtn = document.getElementById("clearAllBtn");

const loggedInUser = localStorage.getItem("currentUser");
const storageKey = `wasteRecords_${loggedInUser}`;

function loadWasteRecords() {
  const records = JSON.parse(localStorage.getItem(storageKey)) || [];
  tableBody.innerHTML = "";

  if (records.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No records found</td></tr>`;
    return;
  }

  records.forEach((record, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.name}</td>
      <td>${record.type}</td>
      <td>${record.quantity || "-"}</td>
      <td>${record.category}</td>
      <td>${record.description || "-"}</td>
      <td>${record.date}</td>
      <td><button onclick="deleteRecord(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function deleteRecord(index) {
  let records = JSON.parse(localStorage.getItem(storageKey)) || [];
  records.splice(index, 1);
  localStorage.setItem(storageKey, JSON.stringify(records));
  loadWasteRecords();
}

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all records?")) {
    localStorage.removeItem(storageKey);
    loadWasteRecords();
  }
});

loadWasteRecords();
