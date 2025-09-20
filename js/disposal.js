document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const historyContainer = document.getElementById("disposalHistory");

  const currentUser = localStorage.getItem("currentUser");

  // Function to render disposal history
  function renderHistory() {
    if (!currentUser) {
      historyContainer.innerHTML = "<p>Please log in to view disposal history.</p>";
      return;
    }

    let allDisposalData = JSON.parse(localStorage.getItem("disposalRecords")) || {};
    let userRecords = allDisposalData[currentUser] || [];

    if (userRecords.length === 0) {
      historyContainer.innerHTML = "<p>No disposal records found.</p>";
      return;
    }

    historyContainer.innerHTML = userRecords
      .map(
        (rec) => `
        <div class="history-item">
          <p><strong>Waste:</strong> ${rec.wasteType}</p>
          <p><strong>Method:</strong> ${rec.method}</p>
          <p><strong>Notes:</strong> ${rec.notes || "None"}</p>
          <p><small>${rec.date}</small></p>
        </div>
      `
      )
      .join("");
  }

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const wasteType = document.getElementById("wasteType").value;
    const method = document.getElementById("method").value;
    const notes = document.getElementById("notes").value.trim();

    if (!wasteType || !method) {
      alert("Please select a waste type and disposal method.");
      return;
    }

    if (!currentUser) {
      alert("No active user found. Please log in first.");
      return;
    }

    // Create disposal record
    const record = {
      wasteType,
      method,
      notes,
      date: new Date().toLocaleString()
    };

    // Get existing disposal data for this user
    let allDisposalData = JSON.parse(localStorage.getItem("disposalRecords")) || {};

    if (!allDisposalData[currentUser]) {
      allDisposalData[currentUser] = [];
    }

    // Add the new record for the current user
    allDisposalData[currentUser].push(record);

    // Save back to localStorage
    localStorage.setItem("disposalRecords", JSON.stringify(allDisposalData));

    alert("Disposal scheduled successfully!");

    // Reset form
    form.reset();

    // Refresh history
    renderHistory();
  });

  // Initial render
  renderHistory();
});
