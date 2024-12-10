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
document.addEventListener("DOMContentLoaded", () => {
  updateDisplay();
  updateStats();
});

document.addEventListener("DOMContentLoaded", function () {
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

document.addEventListener("DOMContentLoaded", () => {
  // Fridge section data
  const fridgeSections = {
    chiller: {
      suggestedItems: [
        "Milk and Dairy Products",
        "Prepared Foods",
        "Deli Meats",
        "Opened Condiments",
      ],
      placementTips: [
        "Store most perishable items here",
        "Keep ready-to-eat foods in sealed containers",
        "Maintain consistent temperature",
        "Use top shelves for items needing coldest temps",
      ],
    },
    middle: {
      suggestedItems: [
        "Fresh Fruits",
        "Vegetables",
        "Eggs",
        "Drinks",
        "Leftovers",
      ],
      placementTips: [
        "Use clear containers for visibility",
        "Group similar items together",
        "Avoid overcrowding to maintain air circulation",
        "Keep fruits and vegetables in separate drawers",
      ],
    },
    bottom: {
      suggestedItems: [
        "Raw Meats",
        "Seafood",
        "Uncooked Proteins",
        "Large Containers",
      ],
      placementTips: [
        "Store raw meats in sealed containers",
        "Place on bottom shelf to prevent cross-contamination",
        "Use dedicated meat drawers if available",
        "Keep raw proteins separate from cooked foods",
      ],
    },
  };

  // Section selection handling
  const sections = document.querySelectorAll(".section");
  const detailsPanel = document.getElementById("details-panel");
  const suggestedItemsList = document.getElementById("suggested-items-list");
  const placementTipsList = document.getElementById("placement-tips-list");

  sections.forEach((section) => {
    section.addEventListener("click", () => {
      // Remove active class from all sections
      sections.forEach((s) => s.classList.remove("active"));

      // Add active class to clicked section
      section.classList.add("active");

      // Get section data
      const sectionKey = section.dataset.section;
      const sectionData = fridgeSections[sectionKey];

      // Clear previous content
      suggestedItemsList.innerHTML = "";
      placementTipsList.innerHTML = "";

      // Populate suggested items
      sectionData.suggestedItems.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        suggestedItemsList.appendChild(li);
      });

      // Populate placement tips
      sectionData.placementTips.forEach((tip) => {
        const li = document.createElement("li");
        li.textContent = tip;
        placementTipsList.appendChild(li);
      });

      // Show details panel
      detailsPanel.classList.add("active");
    });
  });

  // Organization tips toggle
  const tipsToggle = document.getElementById("tips-toggle");
  const generalTips = document.getElementById("general-tips");

  tipsToggle.addEventListener("click", () => {
    generalTips.classList.toggle("active");
    tipsToggle.textContent = generalTips.classList.contains("active")
      ? "Hide Organization Tips"
      : "Show Organization Tips";
  });

  // Additional interactive features
  const addInteractiveFeatures = () => {
    // Hover effect on suggested items and tips
    const interactiveItems = document.querySelectorAll(
      ".suggested-items li, .placement-tips li"
    );
    interactiveItems.forEach((item) => {
      item.addEventListener("mouseover", () => {
        item.style.transform = "translateX(10px)";
        item.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
      });

      item.addEventListener("mouseout", () => {
        item.style.transform = "translateX(0)";
        item.style.backgroundColor = "transparent";
      });
    });
  };

  // Search functionality
  const createSearchFeature = () => {
    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search-container");
    searchContainer.innerHTML = `
            <input type="text" id="item-search" placeholder="Search for items...">
            <div id="search-results" class="search-results"></div>
        `;

    document
      .querySelector(".container")
      .insertBefore(
        searchContainer,
        document.querySelector(".fridge-sections")
      );

    const searchInput = document.getElementById("item-search");
    const searchResults = document.getElementById("search-results");

    // Combine all suggested items for search
    const allItems = Object.values(fridgeSections).flatMap(
      (section) => section.suggestedItems
    );

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredItems = allItems.filter((item) =>
        item.toLowerCase().includes(searchTerm)
      );

      // Clear previous results
      searchResults.innerHTML = "";

      // Display filtered items
      filteredItems.forEach((item) => {
        const resultItem = document.createElement("div");
        resultItem.textContent = item;
        resultItem.classList.add("search-result-item");
        searchResults.appendChild(resultItem);
      });

      // Show/hide results container
      searchResults.style.display = filteredItems.length ? "block" : "none";
    });
  };

  // Initialize features
  addInteractiveFeatures();
  createSearchFeature();
});

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

// Search function
function searchInventory() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Filter inventory based on search term
  const filteredItems = fridgeInventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );

  // Clear previous results
  searchResults.innerHTML = "";

  // Display results
  if (filteredItems.length === 0) {
    searchResults.innerHTML = '<p class="no-results">No items found</p>';
    return;
  }

  filteredItems.forEach((item) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
    resultItem.innerHTML = `
            <strong>${item.name}</strong>
            <p>Quantity: ${item.quantity} ${item.unit}</p>
            <p>Expiry Date: ${item.expiryDate}</p>
        `;
    searchResults.appendChild(resultItem);
  });
}

// Event listeners
searchButton.addEventListener("click", searchInventory);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchInventory();
  }
});
