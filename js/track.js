const tableBody = document.querySelector("#wasteTable tbody");
const clearAllBtn = document.getElementById("clearAllBtn");

const loggedInUser = localStorage.getItem("currentUser");
const storageKey = `wasteRecords_${loggedInUser}`;

function loadWasteRecords() {
  const records = JSON.parse(localStorage.getItem(storageKey)) || [];
  tableBody.innerHTML = "";

  if (records.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center;">No records found</td></tr>`;
    return;
  }

  records.forEach((record, index) => {
    const typeCell = record.type?.startsWith("Custom:")
      ? `<span class="custom-category">${record.type}</span>`
      : record.type || "-";

    const categoryCell = record.category?.includes("Custom")
      ? `<span class="custom-category">${record.category}</span>`
      : record.category || "-";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.name || "-"}</td>
      <td>${typeCell}</td>
      <td>${record.quantity || "-"}</td>
      <td>${record.unit || "-"}</td>
      <td>${record.area || "-"}</td>
      <td>${categoryCell}</td>
      <td>${record.description || "-"}</td>
      <td>${record.date || "-"}</td>
      <td>${record.serviceProvider || "-"}</td>
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
