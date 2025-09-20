const wasteTypeSelect = document.getElementById("wasteType");
const customTypeContainer = document.getElementById("customTypeContainer");
const customTypeInput = document.getElementById("customType");

// Show custom input when "Other" is selected
wasteTypeSelect.addEventListener("change", () => {
  if (wasteTypeSelect.value === "other") {
    customTypeContainer.style.display = "block";
    customTypeInput.required = true;
  } else {
    customTypeContainer.style.display = "none";
    customTypeInput.value = "";
    customTypeInput.required = false;
  }
});

document.getElementById("identifyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const wasteName = document.getElementById("wasteName").value.trim();
  let wasteType = document.getElementById("wasteType").value;
  const description = document.getElementById("description").value.trim();

  // Handle custom type
  if (wasteType === "other") {
    wasteType = customTypeInput.value.trim() || "Custom Waste";
  }

  // Classification & Recommendations
  let category = "";
  let recommendation = "";
  switch (wasteType.toLowerCase()) {
    case "organic":
      category = "Biodegradable";
      recommendation = "Consider composting organic waste or using it for biogas.";
      break;
    case "plastic":
      category = "Recyclable";
      recommendation = "Send plastics to a recycling facility. Avoid burning.";
      break;
    case "metal":
      category = "Recyclable";
      recommendation = "Scrap metal can be sold or sent to recycling.";
      break;
    case "glass":
      category = "Recyclable";
      recommendation = "Glass can be reused or recycled into new products.";
      break;
    case "paper":
      category = "Recyclable";
      recommendation = "Paper can be recycled into cardboard or pulp.";
      break;
    case "e-waste":
      category = "Hazardous / Special Recycling";
      recommendation = "Dispose of e-waste through certified recycling facilities.";
      break;
    default:
      category = "General / Custom Category";
      recommendation = "Handle carefully and consult disposal guidelines.";
  }

  // Show result card
  document.getElementById("resultCard").style.display = "block";
  document.getElementById("resultName").textContent = wasteName;
  document.getElementById("resultType").textContent = wasteType;
  document.getElementById("resultCategory").textContent = category;
  document.getElementById("resultRecommendation").textContent = recommendation;

  // Store temporarily
  window.currentWaste = {
    name: wasteName,
    type: wasteType,
    description: description,
    category: category,
    recommendation: recommendation,
    date: new Date().toLocaleString()
  };
});


document.addEventListener("DOMContentLoaded", () => {
  const saveWasteBtn = document.getElementById("saveWasteBtn");

  if (saveWasteBtn) {
    saveWasteBtn.addEventListener("click", saveWaste);
  }
});

function saveWaste() {
  const wasteName = document.getElementById("wasteName").value.trim();
  const wasteType = document.getElementById("wasteType").value;

  if (!wasteName || !wasteType) {
    alert("Please fill out all fields before saving.");
    return;
  }

  const wasteData = {
    name: wasteName,
    type: wasteType,
    date: new Date().toISOString()
  };

  // Get existing waste records from localStorage
  let storedWaste = JSON.parse(localStorage.getItem("wasteRecords")) || [];
  storedWaste.push(wasteData);

  // Save back to localStorage
  localStorage.setItem("wasteRecords", JSON.stringify(storedWaste));

  alert("Waste record saved successfully!");

  // Optional: clear form fields after saving
  document.getElementById("wasteName").value = "";
  document.getElementById("wasteType").value = "";

  renderWasteList();
}

function renderWasteList() {
  const wasteListContainer = document.getElementById("wasteList");
  if (!wasteListContainer) return;

  // Clear the section first
  wasteListContainer.innerHTML = "";

  let storedWaste = JSON.parse(localStorage.getItem("wasteRecords")) || [];

  if (storedWaste.length === 0) {
    wasteListContainer.innerHTML = "<p>No waste records yet.</p>";
    return;
  }

  storedWaste.forEach((waste, index) => {
    const item = document.createElement("div");
    item.classList.add("waste-item");
    item.innerHTML = `
      <p><strong>${waste.name}</strong> (${waste.type})</p>
      <small>${new Date(waste.date).toLocaleString()}</small>
    `;
    wasteListContainer.appendChild(item);
  });
}