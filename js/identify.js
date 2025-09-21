const wasteTypeSelect = document.getElementById("wasteType");
const customTypeContainer = document.getElementById("customTypeContainer");
const customTypeInput = document.getElementById("customType");
const liveRecommendations = document.getElementById("liveRecommendations");

// Map of recommendations for quick preview
const quickRecommendations = {
  organic: [
    "Store separately in sealed bins to avoid pests.",
    "Use for compost or biogas production.",
    "Deliver to municipal compost facilities."
  ],
  plastic: [
    "Rinse and sort plastics by type (PET, HDPE).",
    "Repurpose bottles/containers.",
    "Send plastics to recycling facilities."
  ],
  metal: [
    "Keep metals free of contaminants (oil, paint).",
    "Sell or reuse scrap metal.",
    "Send to certified metal recycling facilities."
  ],
  glass: [
    "Handle broken glass with protective gloves.",
    "Reuse intact bottles/jars.",
    "Deliver to glass recycling plants."
  ],
  paper: [
    "Keep paper dry and clean.",
    "Reuse for packaging or crafts.",
    "Send to paper recycling facilities."
  ],
  "e-waste": [
    "Do not break or incinerate electronics.",
    "Refurbish or donate if possible.",
    "Deliver to certified e-waste centers."
  ],
  hazardous: [
    "Always use protective gear when handling.",
    "Store in clearly labeled containers.",
    "Use licensed hazardous waste services only."
  ]
};

// Show custom input when "Other" is selected
wasteTypeSelect.addEventListener("change", () => {
  if (wasteTypeSelect.value === "other") {
    customTypeContainer.style.display = "block";
    customTypeInput.required = true;
    liveRecommendations.style.display = "none"; // hide for custom
  } else {
    customTypeContainer.style.display = "none";
    customTypeInput.value = "";
    customTypeInput.required = false;

    // Show live recommendations if available
    if (quickRecommendations[wasteTypeSelect.value]) {
      liveRecommendations.innerHTML = `
        <h4>Recommendations for ${wasteTypeSelect.options[wasteTypeSelect.selectedIndex].text}:</h4>
        <ul>${quickRecommendations[wasteTypeSelect.value]
          .map(r => `<li>${r}</li>`)
          .join("")}</ul>
      `;
      liveRecommendations.style.display = "block";
    } else {
      liveRecommendations.style.display = "none";
    }
  }
});


document.getElementById("identifyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const wasteName = document.getElementById("wasteName").value.trim();
  let wasteType = document.getElementById("wasteType").value;
  const quantity = document.getElementById("quantity").value.trim();
  const unit = document.getElementById("unit").value;
  const area = document.getElementById("area").value.trim();
  const description = document.getElementById("description").value.trim();

  // Handle custom type
  if (wasteType === "other") {
    const customVal = customTypeInput.value.trim();
    wasteType = customVal ? `Custom: ${customVal}` : "Custom: Unspecified";
  }

  // Classification & Recommendations
  let category = "";
  let recommendation = "";
  let facility = "";
  let disposalLink = `disposal.html?wasteType=${encodeURIComponent(wasteType)}`;

  switch (wasteType.toLowerCase()) {
    case "organic":
      category = "Biodegradable";
      recommendation = `
        <ul>
          <li><strong>Handling:</strong> Store separately in sealed bins to avoid pests.</li>
          <li><strong>Reuse:</strong> Use for compost or biogas production.</li>
          <li><strong>Disposal:</strong> Deliver to municipal compost facilities or local farms.</li>
        </ul>`;
      facility = `<p><strong>Nearby Facility:</strong> City Compost Site (3.1 km)</p>`;
      break;

    case "plastic":
      category = "Recyclable";
      recommendation = `
        <ul>
          <li><strong>Handling:</strong> Rinse and sort by type (PET, HDPE, etc.).</li>
          <li><strong>Reuse:</strong> Repurpose bottles/containers for storage or DIY projects.</li>
          <li><strong>Disposal:</strong> Send plastics to a recycling facility. Avoid burning.</li>
        </ul>`;
      facility = `<p><strong>Nearby Facility:</strong> GreenCycle Recycling Center (2.3 km)</p>`;
      break;

    case "metal":
      category = "Recyclable";
      recommendation = `
        <ul>
          <li><strong>Handling:</strong> Keep metals free of contaminants like oil or paint.</li>
          <li><strong>Reuse:</strong> Scrap metal can be sold or melted for reuse.</li>
          <li><strong>Disposal:</strong> Send to a certified metal recycling facility.</li>
        </ul>`;
      facility = `<p><strong>Nearby Facility:</strong> GreenCycle Recycling Center (2.3 km)</p>`;
      break;

    case "glass":
      category = "Recyclable";
      recommendation = `
        <ul>
          <li><strong>Handling:</strong> Separate broken glass and handle with protective gloves.</li>
          <li><strong>Reuse:</strong> Intact jars/bottles can be reused for storage.</li>
          <li><strong>Disposal:</strong> Deliver glass to a recycling plant for reprocessing.</li>
        </ul>`;
      facility = `<p><strong>Nearby Facility:</strong> GreenCycle Recycling Center (2.3 km)</p>`;
      break;

    case "paper":
      category = "Recyclable";
      recommendation = `
        <ul>
          <li><strong>Handling:</strong> Keep dry and clean for recycling.</li>
          <li><strong>Reuse:</strong> Use for packaging or craft projects.</li>
          <li><strong>Disposal:</strong> Send to paper recycling facilities to be pulped.</li>
        </ul>`;
      facility = `<p><strong>Nearby Facility:</strong> GreenCycle Recycling Center (2.3 km)</p>`;
      break;

    case "e-waste":
      category = "Hazardous / Special Recycling";
      recommendation = `
        <ul>
          <li><strong>Handling:</strong> Do not break or incinerate. Store in secure containers.</li>
          <li><strong>Reuse:</strong> Consider refurbishing electronics for resale or donation.</li>
          <li><strong>Disposal:</strong> Deliver to certified e-waste recycling centers.</li>
        </ul>`;
      facility = `<p><strong>Nearby Facility:</strong> EcoWaste Hazardous Facility (5.6 km)</p>`;
      break;

    case "hazardous":
      category = "Hazardous Waste";
      recommendation = `
        <ul>
          <li><strong>Handling:</strong> Always use protective gear when handling.</li>
          <li><strong>Storage:</strong> Keep in clearly labeled containers.</li>
          <li><strong>Disposal:</strong> Use licensed hazardous waste services only.</li>
        </ul>`;
      facility = `<p><strong>Nearby Facility:</strong> EcoWaste Hazardous Facility (5.6 km)</p>`;
      break;

    default:
      category = "General / Custom Category";
      recommendation = `
        <ul>
          <li><strong>Handling:</strong> Store securely and label clearly.</li>
          <li><strong>Reuse:</strong> Explore possibilities for reuse within your operations.</li>
          <li><strong>Disposal:</strong> Check disposal page for approved options.</li>
        </ul>`;
      facility = `<p><strong>Tip:</strong> Consult local regulations for proper disposal methods.</p>`;
  }

  // Show result card
  document.getElementById("resultCard").style.display = "block";
  document.getElementById("resultName").textContent = wasteName;
  document.getElementById("resultType").innerHTML =
    wasteType.startsWith("Custom:")
      ? `<span class="custom-category">${wasteType}</span>`
      : wasteType;
  document.getElementById("resultQuantity").textContent = quantity;
  document.getElementById("resultUnit").textContent = unit;
  document.getElementById("resultArea").textContent = area || "-";
  document.getElementById("resultCategory").innerHTML =
    category.includes("Custom")
      ? `<span class="custom-category">${category}</span>`
      : category;
  document.getElementById("resultRecommendation").innerHTML = `
    <div class="recommendation-box">
      ${recommendation}
      <a href="${disposalLink}" class="btn small-btn" style="margin-top:10px; display:inline-block;color:#fff;">
        View Disposal Options
      </a>
    </div>
  `;
  document.getElementById("facilitySuggestion").innerHTML = facility;

  // Store temporarily
  window.currentWaste = {
    name: wasteName,
    type: wasteType,
    quantity: quantity,
    unit: unit,
    area: area,
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

  renderWasteList();
});

function saveWaste() {
  const loggedInUser = localStorage.getItem("currentUser");
  if (!loggedInUser) {
    alert("You must be logged in to save waste records.");
    return;
  }

  if (!window.currentWaste) {
    alert("No waste record to save. Please classify first.");
    return;
  }

  // Extract a short recommendation (first bullet point text only)
  let shortRec = "";
  const recMatch = window.currentWaste.recommendation.match(/<li><strong>.*?<\/strong>:?\s*(.*?)<\/li>/i);
  if (recMatch && recMatch[1]) {
    shortRec = recMatch[1].trim();
  } else {
    shortRec = "Follow best disposal practices.";
  }

  const storageKey = `wasteRecords_${loggedInUser}`;
  let storedWaste = JSON.parse(localStorage.getItem(storageKey)) || [];
  storedWaste.push({
    ...window.currentWaste,
    shortRecommendation: shortRec
  });

  localStorage.setItem(storageKey, JSON.stringify(storedWaste));

  alert("Waste record saved successfully!");

  document.getElementById("identifyForm").reset();
  document.getElementById("resultCard").style.display = "none";
  customTypeContainer.style.display = "none";

  renderWasteList();
}

function renderWasteList() {
  const wasteListContainer = document.getElementById("wasteList");
  if (!wasteListContainer) return;

  wasteListContainer.innerHTML = "";
  const loggedInUser = localStorage.getItem("currentUser");
  if (!loggedInUser) {
    wasteListContainer.innerHTML = "<p>Please log in to view your waste records.</p>";
    return;
  }

  const storageKey = `wasteRecords_${loggedInUser}`;
  let storedWaste = JSON.parse(localStorage.getItem(storageKey)) || [];

  if (storedWaste.length === 0) {
    wasteListContainer.innerHTML = "<p>No waste records yet.</p>";
    return;
  }

  storedWaste.forEach((waste) => {
    const item = document.createElement("div");
    item.classList.add("waste-item");
    item.innerHTML = `
      <p><strong>${waste.name}</strong> ${
        waste.type.startsWith("Custom:")
          ? `<span class="custom-category">(${waste.type})</span>`
          : `(${waste.type})`
      } - ${waste.quantity} ${waste.unit || ""} (${waste.area || "N/A"})</p>
      <p class="rec-snippet"><em>Tip:</em> ${waste.shortRecommendation || "Check disposal options."}</p>
      <small>${new Date(waste.date).toLocaleString()}</small>
    `;
    wasteListContainer.appendChild(item);
  });
}
