document.getElementById("identifyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const wasteName = document.getElementById("wasteName").value.trim();
  const wasteType = document.getElementById("wasteType").value;
  const description = document.getElementById("description").value.trim();

  // Basic classification rules
  let category = "";
  switch (wasteType) {
    case "organic":
      category = "Biodegradable";
      break;
    case "plastic":
    case "metal":
    case "glass":
    case "paper":
      category = "Recyclable";
      break;
    case "e-waste":
      category = "Hazardous / Special Recycling";
      break;
    default:
      category = "General Waste";
  }

  // Show result card
  document.getElementById("resultCard").style.display = "block";
  document.getElementById("resultName").textContent = wasteName;
  document.getElementById("resultType").textContent = wasteType;
  document.getElementById("resultCategory").textContent = category;

  // Store temporarily for saving
  window.currentWaste = {
    name: wasteName,
    type: wasteType,
    description: description,
    category: category,
    date: new Date().toLocaleString()
  };
});

function saveWaste() {
  let saved = JSON.parse(localStorage.getItem("wasteRecords")) || [];
  saved.push(window.currentWaste);
  localStorage.setItem("wasteRecords", JSON.stringify(saved));
  alert("Waste record saved successfully!");
  document.getElementById("identifyForm").reset();
  document.getElementById("resultCard").style.display = "none";
}
