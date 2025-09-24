const loggedInUser = localStorage.getItem("currentUser");
const wasteKey = `wasteRecords_${loggedInUser}`;
const records = JSON.parse(localStorage.getItem(wasteKey)) || [];

const disposalRaw = JSON.parse(localStorage.getItem("disposalRecords")) || [];
let userDisposalRecords = [];
if (Array.isArray(disposalRaw)) {
  userDisposalRecords = disposalRaw;
} else if (disposalRaw && typeof disposalRaw === "object") {
  if (loggedInUser && Array.isArray(disposalRaw[loggedInUser])) {
    userDisposalRecords = disposalRaw[loggedInUser];
  }
} else {
  userDisposalRecords = [];
}

// Predefined costs (must match disposal.js)
const disposalCosts = {
  Landfill: 50,
  Incineration: 70,
  Recycling: 30,
  Composting: 20,
};

const typeCounts = {};
const categoryCounts = {};
const disposalCounts = {};

records.forEach(record => {
  const qty = parseFloat(record.quantity) || 1;

  if (record.type) {
    typeCounts[record.type] = (typeCounts[record.type] || 0) + qty;
  }

  if (record.category) {
    categoryCounts[record.category] = (categoryCounts[record.category] || 0) + qty;
  }
});

userDisposalRecords.forEach(record => {
  const methodKey = record.method || record.disposalMethod || "Unknown";
  const qty = parseFloat(record.quantity) || 1;
  disposalCounts[methodKey] = (disposalCounts[methodKey] || 0) + qty;
});

const typeLabels = Object.keys(typeCounts);
const typeData = Object.values(typeCounts);

const categoryLabels = Object.keys(categoryCounts);
const categoryData = Object.values(categoryCounts);

const disposalLabels = Object.keys(disposalCounts);
const disposalData = Object.values(disposalCounts);

function toggleChart(chartId, msgId, hasData) {
  const chartEl = document.getElementById(chartId);
  const msgEl = document.getElementById(msgId);
  if (!chartEl || !msgEl) return;
  chartEl.style.display = hasData ? "block" : "none";
  msgEl.style.display = hasData ? "none" : "block";
}

// Waste Type (Bar)
if (typeLabels.length > 0) {
  toggleChart("wasteTypeChart", "noTypeData", true);
  new Chart(document.getElementById("wasteTypeChart"), {
    type: "bar",
    data: {
      labels: typeLabels,
      datasets: [{
        label: "Waste Quantity by Type",
        data: typeData,
        backgroundColor: "rgba(46, 204, 113, 0.7)",
        borderColor: "rgba(39, 174, 96, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, title: { display: true, text: "Quantity" } } }
    }
  });
} else {
  toggleChart("wasteTypeChart", "noTypeData", false);
}

// Waste Category (Pie)
if (categoryLabels.length > 0) {
  toggleChart("wasteCategoryChart", "noCategoryData", true);

  const colors = categoryLabels.map(label =>
    label.startsWith("Custom:") ? "#e67e22" : (
      ["#27ae60", "#2980b9", "#f39c12", "#8e44ad", "#e74c3c", "#16a085"][Math.floor(Math.random() * 6)]
    )
  );

  new Chart(document.getElementById("wasteCategoryChart"), {
    type: "pie",
    data: {
      labels: categoryLabels,
      datasets: [{
        label: "Waste Quantity by Category",
        data: categoryData,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });
} else {
  toggleChart("wasteCategoryChart", "noCategoryData", false);
}

// Waste Disposal (Doughnut)
if (disposalLabels.length > 0) {
  toggleChart("wasteDisposalChart", "noDisposalData", true);
  new Chart(document.getElementById("wasteDisposalChart"), {
    type: "doughnut",
    data: {
      labels: disposalLabels,
      datasets: [{
        label: "Waste Quantity by Disposal Method",
        data: disposalData,
        backgroundColor: [
          "#3498db", "#e67e22", "#2ecc71", "#9b59b6", "#c0392b", "#1abc9c"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });
} else {
  toggleChart("wasteDisposalChart", "noDisposalData", false);
}

// --- Disposal Cost Reporting ---
const costTableBody = document.querySelector("#costTable tbody");
let totalCost = 0;

if (disposalLabels.length > 0) {
  disposalLabels.forEach(method => {
    const qty = disposalCounts[method];
    const costPerUnit = disposalCosts[method] || 0;
    const methodCost = qty * costPerUnit;
    totalCost += methodCost;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${method}</td>
      <td>${qty}</td>
      <td>₦${costPerUnit.toFixed(2)}</td>
      <td>₦${methodCost.toFixed(2)}</td>
    `;
    costTableBody.appendChild(row);
  });

  document.getElementById("totalCost").textContent = `Total Disposal Cost: ₦${totalCost.toFixed(2)}`;
} else {
  costTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No disposal cost data</td></tr>`;
}

// Recycling Rate 
const recyclingQty = disposalCounts["Recycling"] || 0;
const totalDisposalQty = Object.values(disposalCounts).reduce((a, b) => a + b, 0);

if (totalDisposalQty > 0) {
  toggleChart("recyclingChart", "noRecyclingData", true);

  const recyclingRate = ((recyclingQty / totalDisposalQty) * 100).toFixed(1);

  new Chart(document.getElementById("recyclingChart"), {
    type: "doughnut",
    data: {
      labels: ["Recycled", "Other Disposal"],
      datasets: [{
        data: [recyclingQty, totalDisposalQty - recyclingQty],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw} units`;
            }
          }
        }
      }
    }
  });
} else {
  toggleChart("recyclingChart", "noRecyclingData", false);
}

// Insights & Recommendations 
const insightList = document.getElementById("insightList");

function addInsight(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  insightList.appendChild(li);
}

if (totalDisposalQty === 0) {
  addInsight("No disposal records available yet. Start logging waste disposal to generate insights.");
} else {
  // Recycling insights
  if (recyclingQty / totalDisposalQty < 0.3) {
    addInsight("Recycling rate is below 30%. Consider increasing recyclable material recovery.");
  } else {
    addInsight("Good recycling performance! Keep maintaining or improving recycling efforts.");
  }

  // Landfill insights
  if ((disposalCounts["Landfill"] || 0) > totalDisposalQty * 0.5) {
    addInsight("Over 50% of waste goes to landfill. Explore alternatives like recycling or composting to cut costs and improve sustainability.");
  }

  // Cost insights
  if (totalCost > 1000) {
    addInsight(`High disposal costs detected (₦${totalCost.toFixed(2)}). Review methods to reduce expenses.`);
  }

  // Category-specific insights
  if ((categoryCounts["Hazardous Waste"] || 0) > 0) {
    addInsight("Hazardous waste detected. Ensure safe handling, storage, and compliance with regulations.");
  }

  if ((categoryCounts["Organic Waste"] || 0) > totalDisposalQty * 0.2) {
    addInsight("Large amounts of organic waste generated. Consider composting to reduce landfill dependency.");
  }
}
