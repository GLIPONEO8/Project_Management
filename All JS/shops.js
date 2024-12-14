// Initialize FAQ items
document.addEventListener("DOMContentLoaded", function () {
    initializeFAQs();
  
    // Add search functionality
    document.getElementById("searchInput").addEventListener("input", searchFAQs);
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const sidebar = document.querySelector(".sidebar");
    const contentWrapper = document.querySelector(".content-wrapper");
    const navLinks = document.querySelectorAll(".sidebar-nav a");
    const signOutBtn = document.querySelector(".sign-out");
  
    // Toggle sidebar
    hamburgerBtn.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      contentWrapper.classList.toggle("sidebar-active");
    });
  
    // Handle navigation links
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
  
        // Update active state
        navLinks.forEach((navLink) => {
          navLink.parentElement.classList.remove("active");
        });
        this.parentElement.classList.add("active");
  
        // Get the href and navigate to the page
        const targetPage = this.getAttribute("href");
        window.location.href = targetPage;
  
        // On mobile, close sidebar after clicking
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active");
          contentWrapper.classList.remove("sidebar-active");
        }
      });
    });
  
    // Handle sign out
    signOutBtn.addEventListener("click", function (e) {
      e.preventDefault();
  
      // You can add any cleanup logic here (e.g., clearing session storage)
      localStorage.clear();
      sessionStorage.clear();
  
      // Redirect to login page
      window.location.href = "login.html";
    });
  
    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        if (
          !sidebar.contains(e.target) &&
          !hamburgerBtn.contains(e.target) &&
          sidebar.classList.contains("active")
        ) {
          sidebar.classList.remove("active");
          contentWrapper.classList.remove("sidebar-active");
        }
      }
    });
  
    // Helper function to load content (if you want to load content via AJAX)
    function loadContent(url) {
      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          document.getElementById("main-content").innerHTML = html;
        })
        .catch((error) => {
          console.error("Error loading content:", error);
        });
    }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const contentWrapper = document.querySelector(".content-wrapper");
  
    // Create toggle button
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "☰ Menu";
    toggleButton.id = "sidebar-toggle-btn";
    toggleButton.setAttribute("aria-label", "Toggle Sidebar");
  
    // Append button to body
    document.body.appendChild(toggleButton);
  
    // Add click event to toggle button
    toggleButton.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      contentWrapper.classList.toggle("sidebar-active");
  
      // Update button text based on sidebar state
      toggleButton.textContent = sidebar.classList.contains("active")
        ? "✕ Close"
        : "☰ Menu";
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Stores page loaded');
});
