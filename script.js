// Function to validate login
function login() {
    const validUsername = "admin"; // Expected username
    const validPassword = "password"; // Expected password

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === validUsername && password === validPassword) {
        // Set login status in sessionStorage
        sessionStorage.setItem("isLoggedIn", "true");
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }
}

// Function to check if the user is logged in
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        // Redirect to login if not logged in
        window.location.href = "login.html";
    }
}
