document.addEventListener("DOMContentLoaded", () => {
  //  Collapsible sections 
  document.querySelectorAll(".collapsible-header").forEach(header => {
    header.addEventListener("click", () => {
      header.classList.toggle("active");
      const content = header.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Search filter 
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("keyup", () => {
      const query = searchBox.value.toLowerCase();
      document.querySelectorAll(".collapsible-content li").forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(query)
          ? "list-item"
          : "none";
      });
    });
  }

  // --- Compliance Reminders ---
  const reminderForm = document.getElementById("reminderForm");
  const reminderList = document.getElementById("reminderList");
  const currentUser = localStorage.getItem("currentUser");

  function loadReminders() {
    if (!reminderList) return;

    if (!currentUser) {
      reminderList.innerHTML = "<p>Please log in to manage reminders.</p>";
      return;
    }

    let allReminders = JSON.parse(localStorage.getItem("complianceReminders")) || {};
    let userReminders = allReminders[currentUser] || [];

    if (userReminders.length === 0) {
      reminderList.innerHTML = "<p>No compliance reminders yet.</p>";
      return;
    }

    reminderList.innerHTML = userReminders
      .map((r, i) => {
        const dueDate = new Date(r.date);
        const today = new Date();
        const isOverdue = dueDate < today;

        return `
          <div class="history-item ${isOverdue ? "overdue" : "upcoming"}">
            <p><strong>Task:</strong> ${r.task}</p>
            <p><strong>Due:</strong> ${r.date}</p>
            <button data-index="${i}" class="delete-btn">Delete</button>
          </div>
        `;
      })
      .join("");

    // Add delete functionality
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        deleteReminder(index);
      });
    });
  }

  function saveReminder(task, date) {
    let allReminders = JSON.parse(localStorage.getItem("complianceReminders")) || {};
    if (!allReminders[currentUser]) {
      allReminders[currentUser] = [];
    }

    // Avoid duplicates
    if (!allReminders[currentUser].some(r => r.task === task && r.date === date)) {
      allReminders[currentUser].push({ task, date });
      localStorage.setItem("complianceReminders", JSON.stringify(allReminders));
    }
  }

  function deleteReminder(index) {
    let allReminders = JSON.parse(localStorage.getItem("complianceReminders")) || {};
    if (allReminders[currentUser]) {
      allReminders[currentUser].splice(index, 1);
      localStorage.setItem("complianceReminders", JSON.stringify(allReminders));
    }
    loadReminders();
  }

  // Handle manual form submit
  if (reminderForm) {
    reminderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const task = document.getElementById("reminderTask").value.trim();
      const date = document.getElementById("reminderDate").value;

      if (!task || !date) {
        alert("Please fill in all fields.");
        return;
      }

      if (!currentUser) {
        alert("Please log in to save reminders.");
        return;
      }

      saveReminder(task, date);
      reminderForm.reset();
      loadReminders();
    });
  }

  // Auto-generate reminders from disposal records
  function generateComplianceReminders() {
    let disposalRecords = JSON.parse(localStorage.getItem("disposalRecords")) || {};
    let userDisposals = disposalRecords[currentUser] || [];

    userDisposals.forEach(record => {
      if (record.method === "Hazardous Waste Disposal") {
        const disposalDate = new Date(record.date);
        const dueDate = new Date(disposalDate);
        dueDate.setDate(dueDate.getDate() + 7); // 7 days later

        const formattedDate = dueDate.toISOString().split("T")[0];
        saveReminder(
          `Report hazardous waste disposal (${record.category})`,
          formattedDate
        );
      }
    });
  }

  if (currentUser) {
    generateComplianceReminders();
    loadReminders();
  }
});
