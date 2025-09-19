// Grab table body
const tableBody = document.querySelector("#wasteTable tbody");
const clearAllBtn = document.getElementById("clearAllBtn");

// Load waste records from localStorage
function loadWasteRecords() {
  const records = JSON.parse(localStorage.getItem("wasteRecords")) || [];
  tableBody.innerHTML = "";

  if (records.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No records found</td></tr>`;
    return;
  }

  records.forEach((record, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.name}</td>
      <td>${record.type}</td>
      <td>${record.category}</td>
      <td>${record.description || "-"}</td>
      <td>${record.date}</td>
      <td><button onclick="deleteRecord(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function deleteRecord(index) {
  let records = JSON.parse(localStorage.getItem("wasteRecords")) || [];
  records.splice(index, 1);
  localStorage.setItem("wasteRecords", JSON.stringify(records));
  loadWasteRecords();
}

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all records?")) {
    localStorage.removeItem("wasteRecords");
    loadWasteRecords();
  }
});

// Initialize on page load
loadWasteRecords();


// === Hamburger Menu Logic (reuse across pages) ===
const hamburger = document.getElementById("hamburger");
const siteNav = document.getElementById("siteNav");

hamburger.addEventListener("click", () => {
  siteNav.classList.toggle("active");
});
