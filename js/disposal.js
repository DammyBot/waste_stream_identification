document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("disposalForm");
  const historyTableBody = document.querySelector("#historyTable tbody");
  const facilityTableBody = document.querySelector("#facilityTable tbody");
  const summaryContainer = document.getElementById("costSummary");

  const wasteTypeSelect = document.getElementById("wasteType");
  const methodSelect = document.getElementById("method");
  const destinationSelect = document.getElementById("destination");
  const amountInput = document.getElementById("amount");
  const unitSelect = document.getElementById("unit");
  const costInput = document.getElementById("cost");
  const scheduleInput = document.getElementById("schedule");
  const providerInput = document.getElementById("provider");
  const notesInput = document.getElementById("notes");

  const currentUser = localStorage.getItem("currentUser");

  // Cost per unit (₦ per unit)
  const disposalCosts = {
    "Recycling Center": 20,
    "Landfill": 50,
    "Composting": 10,
    "Hazardous Waste Facility": 70,
    "Incineration": 40
  };

  // Mapping waste types -> allowed methods & facilities
  const disposalOptions = {
    plastic: {
      methods: ["Recycling Center", "Landfill"],
      facilities: ["GreenCycle Recycling Center"]
    },
    metal: {
      methods: ["Recycling Center", "Landfill"],
      facilities: ["GreenCycle Recycling Center"]
    },
    organic: {
      methods: ["Composting", "Landfill"],
      facilities: ["City Compost Site"]
    },
    electronic: {
      methods: ["Hazardous Waste Facility", "Recycling Center"],
      facilities: ["EcoWaste Hazardous Facility"]
    },
    hazardous: {
      methods: ["Hazardous Waste Facility", "Incineration"],
      facilities: ["EcoWaste Hazardous Facility"]
    },
    other: {
      methods: ["Recycling Center", "Landfill", "Composting", "Incineration"],
      facilities: ["GreenCycle Recycling Center", "EcoWaste Hazardous Facility", "City Compost Site"]
    }
  };

  // Prefill waste type from URL params (if any)
  const params = new URLSearchParams(window.location.search);
  const prefillWasteType = params.get("wasteType");
  if (prefillWasteType) {
    // try to set it if one of the options
    const opt = Array.from(wasteTypeSelect.options).find(o => o.value === prefillWasteType);
    if (opt) {
      wasteTypeSelect.value = prefillWasteType;
      updateOptions(prefillWasteType);
    }
  }

  // update methods/facilities when waste type changes
  wasteTypeSelect.addEventListener("change", (e) => {
    updateOptions(e.target.value);
    calculateCost();
  });

  methodSelect.addEventListener("change", () => {
    calculateCost();
  });

  amountInput.addEventListener("input", () => {
    calculateCost();
  });

  function updateOptions(wasteType) {
    // clear existing
    methodSelect.innerHTML = '<option value="">-- Select Method --</option>';
    destinationSelect.innerHTML = '<option value="">-- Select Destination --</option>';

    const key = (wasteType || "").toLowerCase();
    if (disposalOptions[key]) {
      disposalOptions[key].methods.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        methodSelect.appendChild(option);
      });
      disposalOptions[key].facilities.forEach(f => {
        const option = document.createElement("option");
        option.value = f;
        option.textContent = f;
        destinationSelect.appendChild(option);
      });
    } else {
      // default across all known facilities
      const allFacilities = new Set();
      Object.values(disposalOptions).forEach(v => v.facilities.forEach(f => allFacilities.add(f)));
      allFacilities.forEach(f => {
        const option = document.createElement("option");
        option.value = f;
        option.textContent = f;
        destinationSelect.appendChild(option);
      });
    }
  }

  function calculateCost() {
    const method = methodSelect.value;
    const amount = parseFloat(amountInput.value);
    if (!method || !amount || isNaN(amount)) {
      costInput.value = "";
      return;
    }

    const costPerUnit = disposalCosts[method] || 0;
    const totalCost = costPerUnit * amount;
    // show with two decimals
    costInput.value = totalCost.toFixed(2);
  }

  function renderHistory() {
    if (!currentUser) {
      historyTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center;">Please log in to view disposal history.</td></tr>`;
      facilityTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Please log in to view facility breakdown.</td></tr>`;
      summaryContainer.innerHTML = `<p>Please log in to view cost summary.</p>`;
      return;
    }

    const allDisposalData = JSON.parse(localStorage.getItem("disposalRecords")) || {};
    const userRecords = allDisposalData[currentUser] || [];

    if (userRecords.length === 0) {
      historyTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center;">No disposal records found.</td></tr>`;
      facilityTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No facility data yet.</td></tr>`;
      summaryContainer.innerHTML = `<p>No data yet.</p>`;
      return;
    }

    // Fill history table
    historyTableBody.innerHTML = userRecords.map(r => {
      const sched = r.schedule ? new Date(r.schedule).toLocaleString() : r.schedule || "-";
      return `<tr>
        <td>${escapeHtml(r.wasteType)}</td>
        <td>${escapeHtml(r.method)}</td>
        <td>${escapeHtml(r.destination)}</td>
        <td>${r.amount != null ? r.amount : "-"}</td>
        <td>${escapeHtml(r.unit || "-")}</td>
        <td>${r.cost != null ? Number(r.cost).toFixed(2) : "-"}</td>
        <td>${escapeHtml(sched)}</td>
        <td>${escapeHtml(r.provider || "-")}</td>
        <td>${escapeHtml(r.notes || "-")}</td>
        <td>${escapeHtml(r.date || "-")}</td>
      </tr>`;
    }).join("");

    // Summary & facility report
    renderSummaryAndFacility(userRecords);
  }

  function renderSummaryAndFacility(records) {
    // cost summary
    const totalCost = records.reduce((s, r) => s + (parseFloat(r.cost) || 0), 0);
    const avgCost = records.length ? (totalCost / records.length) : 0;

    const byMethod = {};
    records.forEach(r => {
      const method = r.method || "Unknown";
      byMethod[method] = (byMethod[method] || 0) + (parseFloat(r.cost) || 0);
    });

    let byMethodHtml = "<ul>";
    for (const m of Object.keys(byMethod)) {
      byMethodHtml += `<li>${escapeHtml(m)}: ₦${byMethod[m].toFixed(2)}</li>`;
    }
    byMethodHtml += "</ul>";

    summaryContainer.innerHTML = `
      <p><strong>Total Cost:</strong> ₦${totalCost.toFixed(2)}</p>
      <p><strong>Average Cost per Disposal:</strong> ₦${avgCost.toFixed(2)}</p>
      <p><strong>Breakdown by Method:</strong></p>
      ${byMethodHtml}
    `;

    // facility-level breakdown: total amount & cost per facility
    const facilityMap = {};
    records.forEach(r => {
      const fac = r.destination || "Unknown";
      if (!facilityMap[fac]) facilityMap[fac] = { amount: 0, cost: 0, unit: r.unit || "-" };
      facilityMap[fac].amount += parseFloat(r.amount) || 0;
      facilityMap[fac].cost += parseFloat(r.cost) || 0;
      // unit is taken from last record; ideally you'd normalize unit per facility or include unit sums by unit type
    });

    // render facility table
    const rows = Object.entries(facilityMap).map(([fac, data]) => {
      return `<tr>
        <td>${escapeHtml(fac)}</td>
        <td>${data.amount.toFixed(2)}</td>
        <td>${escapeHtml(data.unit)}</td>
        <td>₦${data.cost.toFixed(2)}</td>
      </tr>`;
    });

    facilityTableBody.innerHTML = rows.length ? rows.join("") : `<tr><td colspan="4" style="text-align:center;">No facility data</td></tr>`;
  }

  // form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const wasteType = wasteTypeSelect.value;
    const method = methodSelect.value;
    const destination = destinationSelect.value;
    const amount = parseFloat(amountInput.value);
    const unit = unitSelect.value;
    const cost = parseFloat(costInput.value);
    const schedule = scheduleInput.value;
    const provider = providerInput.value;
    const notes = notesInput.value.trim();

    if (!wasteType || !method || !destination || isNaN(amount) || !unit || isNaN(cost) || !schedule || !provider) {
      alert("Please complete all required fields.");
      return;
    }

    if (!currentUser) {
      alert("No active user found. Please log in first.");
      return;
    }

    const record = {
      wasteType,
      method,
      destination,
      amount,
      unit,
      cost: cost.toFixed(2),
      schedule,
      provider,
      notes,
      date: new Date().toLocaleString()
    };

    let allDisposalData = JSON.parse(localStorage.getItem("disposalRecords")) || {};
    if (!allDisposalData[currentUser]) {
      allDisposalData[currentUser] = [];
    }

    allDisposalData[currentUser].push(record);
    localStorage.setItem("disposalRecords", JSON.stringify(allDisposalData));

    // Reset form and re-render
    form.reset();
    // ensure method/facility options cleared as appropriate
    methodSelect.innerHTML = '<option value="">-- Select Method --</option>';
    destinationSelect.innerHTML = '<option value="">-- Select Destination --</option>';
    costInput.value = "";

    alert("Disposal scheduled successfully!");
    renderHistory();
  });

  // escape helper to avoid raw HTML injection
  function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str.replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      })[s];
    });
  }

  // initial render
  updateOptions(wasteTypeSelect.value);
  renderHistory();
});
