document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggleButton");
    const categoriesDiv = document.getElementById("categories");

    toggleButton.addEventListener("click", () => {
        if (categoriesDiv.classList.contains("hidden")) {
            categoriesDiv.classList.remove("hidden");
            toggleButton.textContent = "Hide All";
        } else {
            categoriesDiv.classList.add("hidden");
            toggleButton.textContent = "Show All";
        }
    });
});


// Initialize display and stats on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateStats();
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    const contentWrapper = document.querySelector('.content-wrapper');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const signOutBtn = document.querySelector('.sign-out');

    // Toggle sidebar
    hamburgerBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        contentWrapper.classList.toggle('sidebar-active');
    });

    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Get the href and navigate to the page
            const targetPage = this.getAttribute('href');
            window.location.href = targetPage;

            // On mobile, close sidebar after clicking
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                contentWrapper.classList.remove('sidebar-active');
            }
        });
    });

    // Handle sign out
    signOutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // You can add any cleanup logic here (e.g., clearing session storage)
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = 'login.html';
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                contentWrapper.classList.remove('sidebar-active');
            }
        }
    });

    // Helper function to load content (if you want to load content via AJAX)
    function loadContent(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                document.getElementById('main-content').innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading content:', error);
            });
    }
});