// Utility Functions 
function getUsers() {
    // Get stored users or empty array
    let users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(username) {
    localStorage.setItem("currentUser", username);
}

function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html"; // back to login
}

// Handle Login
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Convert username to lower case for comparison
            const username = document.getElementById("username").value.trim().toLowerCase();
            const password = document.getElementById("password").value.trim();
            const errorMsg = document.getElementById("errorMsg");

            const users = getUsers();
            const user = users.find(
                (u) => u.username === username && u.password === password
            );

            if (user) {
                setCurrentUser(username);
                window.location.href = "pages/home.html";
            } else {
                errorMsg.textContent = "Invalid username or password!";
            }
        });
    }

    // Handle Signup 
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Convert username to lower case before saving
            const username = document.getElementById("newUsername").value.trim().toLowerCase();
            const password = document.getElementById("newPassword").value.trim();
            const confirmPassword = document
                .getElementById("confirmPassword")
                .value.trim();
            const errorMsg = document.getElementById("signupError");

            if (password !== confirmPassword) {
                errorMsg.textContent = "Passwords do not match!";
                return;
            }

            let users = getUsers();
            if (users.find((u) => u.username === username)) {
                errorMsg.textContent = "Username already exists!";
                return;
            }

            users.push({ username, password });
            saveUsers(users);

            alert("Signup successful! You can now login.");
            window.location.href = "../index.html";
        });
    }
});
