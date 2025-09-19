// Load waste records
const records = JSON.parse(localStorage.getItem("wasteRecords")) || [];

// Count by type and category
const typeCounts = {};
const categoryCounts = {};

records.forEach(record => {
  typeCounts[record.type] = (typeCounts[record.type] || 0) + 1;
  categoryCounts[record.category] = (categoryCounts[record.category] || 0) + 1;
});

// Prepare data for charts
const typeLabels = Object.keys(typeCounts);
const typeData = Object.values(typeCounts);

const categoryLabels = Object.keys(categoryCounts);
const categoryData = Object.values(categoryCounts);

// Chart.js: Waste Type Chart
new Chart(document.getElementById("wasteTypeChart"), {
  type: "bar",
  data: {
    labels: typeLabels,
    datasets: [{
      label: "Waste by Type",
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
      y: { beginAtZero: true }
    }
  }
});

// Chart.js: Waste Category Chart
new Chart(document.getElementById("wasteCategoryChart"), {
  type: "pie",
  data: {
    labels: categoryLabels,
    datasets: [{
      label: "Waste by Category",
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

// === Hamburger Menu Logic ===
const hamburger = document.getElementById("hamburger");
const siteNav = document.getElementById("siteNav");

hamburger.addEventListener("click", () => {
  siteNav.classList.toggle("active");
});
