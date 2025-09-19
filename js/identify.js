document.getElementById("identifyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const wasteName = document.getElementById("wasteName").value.trim();
  const wasteType = document.getElementById("wasteType").value;
  const description = document.getElementById("description").value.trim();

  // Classification
  let category = "";
  switch (wasteType) {
    case "organic": category = "Biodegradable"; break;
    case "plastic":
    case "metal":
    case "glass":
    case "paper": category = "Recyclable"; break;
    case "e-waste": category = "Hazardous / Special Recycling"; break;
    default: category = "General Waste";
  }

  // Show result card
  document.getElementById("resultCard").style.display = "block";
  document.getElementById("resultName").textContent = wasteName;
  document.getElementById("resultType").textContent = wasteType;
  document.getElementById("resultCategory").textContent = category;

  // Store temporarily
  window.currentWaste = {
    name: wasteName,
    type: wasteType,
    description: description,
    category: category,
    date: new Date().toLocaleString()
  };
});

function saveWaste() {
  const loggedInUser = localStorage.getItem("currentUser");
  if (!loggedInUser) {
    alert("You must be logged in to save waste records.");
    return;
  }

  const storageKey = `wasteRecords_${loggedInUser}`;
  let saved = JSON.parse(localStorage.getItem(storageKey)) || [];
  saved.push(window.currentWaste);
  localStorage.setItem(storageKey, JSON.stringify(saved));

  alert("Waste record saved successfully!");
  document.getElementById("identifyForm").reset();
  document.getElementById("resultCard").style.display = "none";
}
