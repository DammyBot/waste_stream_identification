// Load waste records
const loggedInUser = localStorage.getItem("currentUser");
const storageKey = `wasteRecords_${loggedInUser}`;
const records = JSON.parse(localStorage.getItem(storageKey)) || [];

// Count by type, category, and disposal method (using quantity if available)
const typeCounts = {};
const categoryCounts = {};
const disposalCounts = {};

records.forEach(record => {
  const qty = parseFloat(record.quantity) || 1; // fallback to 1 if no quantity

  // Type
  typeCounts[record.type] = (typeCounts[record.type] || 0) + qty;

  // Category
  categoryCounts[record.category] = (categoryCounts[record.category] || 0) + qty;

  // Disposal
  if (record.disposalMethod) {
    disposalCounts[record.disposalMethod] =
      (disposalCounts[record.disposalMethod] || 0) + qty;
  }
});

// Prepare data for charts
const typeLabels = Object.keys(typeCounts);
const typeData = Object.values(typeCounts);

const categoryLabels = Object.keys(categoryCounts);
const categoryData = Object.values(categoryCounts);

const disposalLabels = Object.keys(disposalCounts);
const disposalData = Object.values(disposalCounts);

// Waste Type Chart
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
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Quantity" } }
    }
  }
});

// Waste Category Chart
new Chart(document.getElementById("wasteCategoryChart"), {
  type: "pie",
  data: {
    labels: categoryLabels,
    datasets: [{
      label: "Waste Quantity by Category",
      data: categoryData,
      backgroundColor: [
        "#27ae60", "#2980b9", "#f39c12", "#8e44ad", "#e74c3c", "#16a085"
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" }
    }
  }
});

// Waste Disposal Method Chart
if (disposalLabels.length > 0) {
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
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}
