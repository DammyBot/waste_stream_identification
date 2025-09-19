document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const wasteType = document.getElementById("wasteType").value;
    const method = document.getElementById("method").value;
    const notes = document.getElementById("notes").value.trim();

    if (!wasteType || !method) {
      alert("Please select a waste type and disposal method.");
      return;
    }

    // Create disposal record
    const record = {
      wasteType,
      method,
      notes,
      date: new Date().toLocaleString()
    };

    // Get existing records or start fresh
    let disposalRecords = JSON.parse(localStorage.getItem("disposalRecords")) || [];

    // Add new record
    disposalRecords.push(record);

    // Save back to localStorage
    localStorage.setItem("disposalRecords", JSON.stringify(disposalRecords));

    alert("Disposal scheduled successfully!");

    // Reset form
    form.reset();
  });
});
