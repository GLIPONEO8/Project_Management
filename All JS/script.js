// Store items in localStorage
let inventory = JSON.parse(localStorage.getItem("refrigeratorInventory")) || {
  freezer: [],
  chiller: [],
  mid: [],
};

// DOM Elements
const navButtons = document.querySelectorAll(".nav-btn");
const categorySections = document.querySelectorAll(".category-section");
const addItemForm = document.getElementById("addItemForm");
const searchInput = document.getElementById("searchInput");
const sortBySelect = document.getElementById("sortBy");
const filterExpirySelect = document.getElementById("filterExpiry");
const imagePreview = document.getElementById("imagePreview");
const modal = document.getElementById("itemModal");
const closeModal = document.querySelector(".close-modal");

// Event Listeners
searchInput.addEventListener("input", updateDisplay);
sortBySelect.addEventListener("change", updateDisplay);
filterExpirySelect.addEventListener("change", updateDisplay);
document
  .getElementById("itemImage")
  .addEventListener("change", handleImagePreview);
closeModal.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Add new categories to the navigation logic
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    categorySections.forEach((section) => {
      section.classList.remove("active");
      if (section.id === category) section.classList.add("active");
    });
    updateDisplay();
  });
});

function filterLowStock(items) {
  return items.filter((item) => {
    const quantityInBaseUnit = convertToBaseUnit(item.quantity); // Convert quantity to base unit
    const minQuantityInBaseUnit = convertToBaseUnit(item.minQuantity); // Convert minQuantity to base unit
    return quantityInBaseUnit <= minQuantityInBaseUnit; // Compare in base unit
  });
}

// Helper function to filter items by nearly expired
function filterNearlyExpired(items) {
  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  return items.filter((item) => {
    const expiryDate = new Date(item.expiryDate);
    return expiryDate >= today && expiryDate <= weekFromNow;
  });
}

// Helper function to filter items by expired
function filterExpired(items) {
  const today = new Date();
  return items.filter((item) => new Date(item.expiryDate) < today);
}

// Image Preview Handler
function handleImagePreview(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="preview-image">`;
    };
    reader.onerror = function (e) {
      console.error("Error reading file:", e);
      imagePreview.innerHTML = "<p>Error loading image.</p>";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.innerHTML = '<div class="image-placeholder">No Image Selected</div>';
  }
}

addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const category = document.getElementById("itemCategory").value;
  const name = document.getElementById("itemName").value.trim();
  const quantity = document.getElementById("itemQuantity").value;
  const unit = document.getElementById("itemUnit").value;
  const minQuantity = document.getElementById("minQuantity").value;
  const expiryPreset = document.getElementById("expiryPreset").value;
  const notes = document.getElementById("itemNotes").value.trim();
  const imageFile = document.getElementById("itemImage").files[0];

  if (!name || !quantity || !unit || !minQuantity) {
    alert("Please fill in all required fields.");
    return;
  }

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      addItemToInventory(category, name, quantity, unit, minQuantity, expiryPreset, notes, imageData);
    };
    reader.readAsDataURL(imageFile);
  } else {
    addItemToInventory(category, name, quantity, unit, minQuantity, expiryPreset, notes);
  }

  addItemForm.reset();
  imagePreview.innerHTML = "";
});

function addItemToInventory(category, name, quantity, unit, minQuantity, expiryPreset, notes, imageData = null) {
  const customDate = document.getElementById("customExpiryDate").value;
  const expiryDate = calculateExpiryDate(expiryPreset, customDate);

  // Store quantity and minQuantity with units
  const quantityWithUnit = `${quantity} ${unit}`;
  const minQuantityWithUnit = `${minQuantity} ${unit}`;

  const newItem = {
    id: Date.now(),
    name: name,
    quantity: quantityWithUnit, // Store quantity with unit
    minQuantity: minQuantityWithUnit, // Store minimum quantity with unit
    expiryDate,
    expiryPreset,
    notes,
    image: imageData,
    dateAdded: new Date().toISOString(),
    isNew: true,
  };

  inventory[category].push(newItem);
  saveInventory();
  updateDisplay();
  updateStats();
}

function toggleCustomExpiry() {
  const expiryPreset = document.getElementById("expiryPreset").value;
  const customExpiryDate = document.getElementById("customExpiryDate");
  customExpiryDate.style.display = expiryPreset === "custom" ? "block" : "none";
}

// Function to calculate expiry date based on preset
function calculateExpiryDate(expiryPreset, customDate = null) {
  if (expiryPreset === "custom" && customDate) {
    return new Date(customDate).toISOString();
  }

  const today = new Date();
  switch (expiryPreset) {
    case "dairy":
      return new Date(today.setDate(today.getDate() + 7)).toISOString();
    case "meat":
      return new Date(today.setDate(today.getDate() + 3)).toISOString();
    case "vegetables":
      return new Date(today.setDate(today.getDate() + 7)).toISOString();
    case "fruits":
      return new Date(today.setDate(today.getDate() + 7)).toISOString();
    case "bakery":
      return new Date(today.setDate(today.getDate() + 5)).toISOString();
    case "frozen":
      return new Date(today.setMonth(today.getMonth() + 6)).toISOString();
    default:
      return new Date(today.setDate(today.getDate() + 30)).toISOString(); // Default 30 days
  }
}

function updateDisplay() {
  const activeCategory =
    document.querySelector(".nav-btn.active").dataset.category;
  const searchTerm = searchInput.value.toLowerCase();
  const sortBy = sortBySelect.value;
  const expiryFilter = filterExpirySelect.value;

  let items = [...inventory[activeCategory]];

  // Handle different categories
  switch (activeCategory) {
    case "freezer":
    case "chiller":
    case "mid":
      items = [...inventory[activeCategory]];
      break;
    case "low-stock":
      items = filterLowStock([...inventory.freezer, ...inventory.chiller, ...inventory.mid]);
      break;
    case "nearly-expired":
      items = filterNearlyExpired([...inventory.freezer, ...inventory.chiller, ...inventory.mid]);
      break;
    case "expired":
      items = filterExpired([...inventory.freezer, ...inventory.chiller, ...inventory.mid]);
      break;
  }

  // Apply search filter
  items = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm))
  );

  // Apply sorting
  items = sortItems(items, sortBy);

  // Display items
  displayItems(activeCategory, items);

  // Mark items as not new after displaying
  items.forEach((item) => (item.isNew = false));
  saveInventory();

  updateStats();
}

function sortItems(items, sortBy) {
  return items.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "expiry":
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      case "dateAdded":
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case "quantity":
        return convertToBaseUnit(b.quantity) - convertToBaseUnit(a.quantity);
      default:
        return 0;
    }
  });
}

// Function to display items
function displayItems(category, items) {
  const gridContainer = document.querySelector(`#${category} .items-grid`);
  gridContainer.innerHTML = "";

  items.forEach((item) => {
    const itemCard = document.createElement("div");
    itemCard.className = "item-card";

    // Check if the item is low stock
    const quantityInBaseUnit = convertToBaseUnit(item.quantity);
    const minQuantityInBaseUnit = convertToBaseUnit(item.minQuantity);
    const isLowStock = quantityInBaseUnit <= minQuantityInBaseUnit;

    // Calculate expiry status
    const expiryStatus = getExpiryStatus(item.expiryDate);

    itemCard.innerHTML = `
      ${
        item.image
          ? `<img src="${item.image}" alt="${item.name}" class="item-image">`
          : '<div class="item-image" style="background-color: #ddd;"></div>'
      }
      ${
        expiryStatus !== "normal"
          ? `<span class="expiry-badge ${expiryStatus}">${expiryStatus}</span>`
          : ""
      }
      ${item.isNew ? `<span class="new-badge">New</span>` : ""}
      ${
        isLowStock
          ? `<span class="low-stock-badge">Low Stock</span>`
          : ""
      }
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Expiry: ${new Date(item.expiryDate).toLocaleDateString()}</p>
        <p>Added: ${new Date(item.dateAdded).toLocaleDateString()}</p>
        <button onclick="showItemDetails(${item.id}, '${category}')">Details</button>
        <button onclick="deleteItem('${category}', ${item.id})">Delete</button>
      </div>
    `;

    gridContainer.appendChild(itemCard);
  });
}

// Function to get expiry status
function getExpiryStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= 7) return "warning";
  return "normal";
}

// Function to show item details
function showItemDetails(itemId, category) {
  const item = inventory[category].find((item) => item.id === itemId);
  if (!item) return;

  const modalContent = document.getElementById("modalContent");
  const quantityInBaseUnit = convertToBaseUnit(item.quantity);
  const minQuantityInBaseUnit = convertToBaseUnit(item.minQuantity);
  const baseUnit = item.quantity.includes("l") ? "ml" : "g";

  // Check if the item is low stock
  const isLowStock = quantityInBaseUnit <= minQuantityInBaseUnit;

  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${item.name}</h2>
      <button class="close-modal-btn" onclick="modal.style.display='none'">×</button>
    </div>
    <div class="modal-body">
      <div class="item-image-container">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}" class="item-image">`
            : '<div class="item-image-placeholder">No Image</div>'
        }
      </div>
      <div class="item-details-tabs">
        <button class="tab-btn active" onclick="switchTab('details')">Details</button>
        <button class="tab-btn" onclick="switchTab('edit')">Edit</button>
      </div>
      <div id="detailsTab" class="tab-content active">
        <div class="item-details">
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Quantity:</strong> ${item.quantity} (${quantityInBaseUnit} ${baseUnit})</p>
          <p><strong>Minimum Quantity:</strong> ${item.minQuantity} (${minQuantityInBaseUnit} ${baseUnit})</p>
          <p><strong>Expiry Preset:</strong> ${item.expiryPreset}</p>
          <p><strong>Expiry Date:</strong> ${new Date(item.expiryDate).toLocaleDateString()}</p>
          <p><strong>Date Added:</strong> ${new Date(item.dateAdded).toLocaleDateString()}</p>
          ${item.notes ? `<p><strong>Notes:</strong> ${item.notes}</p>` : ""}
        </div>
        ${
          isLowStock
            ? `<div class="low-stock-indicator">
                <span class="low-stock-icon">⚠️</span>
                <span class="low-stock-text">This item is low in stock!</span>
                <a href="shops.html?item=${encodeURIComponent(item.name)}" class="buy-now-btn">Buy Now</a>
              </div>`
            : ""
        }
      </div>
      <div id="editTab" class="tab-content">
        <form id="editItemForm">
          <label for="editQuantity">Quantity:</label>
          <div class="quantity-input-group">
            <input type="number" id="editQuantity" value="${quantityInBaseUnit}" step="0.1">
            <span class="unit-display">${baseUnit}</span>
          </div>
          <label for="editMinQuantity">Minimum Quantity:</label>
          <div class="quantity-input-group">
            <input type="number" id="editMinQuantity" value="${minQuantityInBaseUnit}" step="0.1">
            <span class="unit-display">${baseUnit}</span>
          </div>
          <label for="editNotes">Notes:</label>
          <textarea id="editNotes">${item.notes || ""}</textarea>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  `;

  // Handle form submission for editing
  const editItemForm = document.getElementById("editItemForm");
  editItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newQuantity = document.getElementById("editQuantity").value;
    const newMinQuantity = document.getElementById("editMinQuantity").value;
    const newNotes = document.getElementById("editNotes").value;

    item.quantity = `${newQuantity} ${baseUnit}`;
    item.minQuantity = `${newMinQuantity} ${baseUnit}`;
    item.notes = newNotes;

    saveInventory();
    updateDisplay();
    modal.style.display = "none";
  });

  modal.style.display = "block";
}

// Function to switch tabs
function switchTab(tabName) {
  const tabs = document.querySelectorAll(".tab-content");
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  tabButtons.forEach((button) => {
    button.classList.remove("active");
  });

  document.getElementById(`${tabName}Tab`).classList.add("active");
  document.querySelector(`.tab-btn[onclick="switchTab('${tabName}')"]`).classList.add("active");
}

function deleteItem(category, itemId) {
  const item = inventory[category].find((item) => item.id === itemId);
  if (item && new Date(item.expiryDate) < new Date()) {
    if (!confirm("This item is expired. Are you sure you want to delete it?")) {
      return;
    }
  }
  inventory[category] = inventory[category].filter((item) => item.id !== itemId);
  saveInventory();
  updateDisplay();
}

// Function to update stats
function updateStats() {
  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  let totalItems = 0;
  let expiringSoon = 0;
  let lowStock = 0;

  Object.values(inventory).forEach((category) => {
    category.forEach((item) => {
      totalItems++;

      const expiryDate = new Date(item.expiryDate);
      if (expiryDate <= weekFromNow && expiryDate >= today) {
        expiringSoon++;
      }

      // Check if the item is low stock
      const [quantity] = item.quantity.split(" ");
      if (parseFloat(quantity) <= parseFloat(item.minQuantity)) {
        lowStock++;
      }
    });
  });

  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("expiringSoon").textContent = expiringSoon;
  document.getElementById("lowStock").textContent = lowStock;
}

function saveInventory() {
  // Throttle localStorage writes
  if (!saveInventory.timeout) {
    saveInventory.timeout = setTimeout(() => {
      localStorage.setItem("refrigeratorInventory", JSON.stringify(inventory));
      saveInventory.timeout = null;
    }, 1000);
  }
}
// List of suggestions
const itemSuggestions = [
  "Apples",
  "Milk",
  "Eggs",
  "Cheese",
  "Yogurt",
  "Carrots",
  "Lettuce",
  "Tomatoes",
  "Onions",
  "Chicken",
  "Beef",
  "Fish",
  "Ice Cream",
  "Butter",
  "Bread",
  "Spinach",
  "Bell Peppers",
  "Cucumber",
  "Strawberries",
  "Blueberries",
  "Salmon",
  "Ground Beef",
  "Ham",
  "Sour Cream",
  "Cream Cheese",
  "Orange Juice",
  "Tofu",
  "Soft Drinks",
  "Avocado",
  "Broccoli",
  "Green Beans",
  "Mushrooms",
  "Pork Chops",
  "Shrimp",
  "Bacon",
  "Chorizo",
  "Kale",
  "Asparagus",
  "Coleslaw",
  "Mozzarella",
  "Cheddar",
  "Greek Yogurt",
  "Parmesan",
];

// Initialize everything on page load
document.addEventListener("DOMContentLoaded", function () {
  // Update display and stats
  updateDisplay();
  updateStats();

  // Add event listeners for stats cards
document.getElementById("totalItemsCard").addEventListener("click", function () {
  const allItems = [...inventory.freezer, ...inventory.chiller, ...inventory.mid];
  openStatsModal("Total Items", allItems);
});

document.getElementById("expiringSoonCard").addEventListener("click", function () {
  const allItems = [...inventory.freezer, ...inventory.chiller, ...inventory.mid];
  const expiringSoonItems = filterNearlyExpired(allItems);
  openStatsModal("Expiring Soon", expiringSoonItems);
});

document.getElementById("lowStockCard").addEventListener("click", function () {
  console.log("Low Stock Card Clicked!"); // Debugging log
  const allItems = [...inventory.freezer, ...inventory.chiller, ...inventory.mid];
  const lowStockItems = filterLowStock(allItems);
  console.log("Low Stock Items:", lowStockItems); // Debugging log
  openStatsModal("Low Stock", lowStockItems);
});

  // Close the modal
  document.querySelector("#statsModal .close-modal").addEventListener("click", function () {
    const modal = document.getElementById("statsModal");
    modal.style.display = "none";
  });

  // Close the modal when clicking outside
  window.addEventListener("click", function (e) {
    const modal = document.getElementById("statsModal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  function openStatsModal(title, items) {
    const modal = document.getElementById("statsModal");
    const modalTitle = document.getElementById("statsModalTitle");
    const tableBody = document.querySelector("#statsModalTable tbody");
  
    // Set the modal title
    modalTitle.textContent = title;
  
    // Clear existing rows
    tableBody.innerHTML = "";
  
    // Populate the table with items
    items.forEach((item) => {
      // Determine the category of the item
      let category;
      if (inventory.freezer.includes(item)) {
        category = "Freezer";
      } else if (inventory.chiller.includes(item)) {
        category = "Chiller";
      } else if (inventory.mid.includes(item)) {
        category = "Mid Section";
      } else {
        category = "Unknown";
      }
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${category}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
      `;
      tableBody.appendChild(row);
    });
  
    // Open the modal
    modal.style.display = "flex";
  }

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

const liquidItems = [   "water", "milk",
  "orange juice",
  "apple juice",
  "cranberry juice",
  "grape juice",
  "tomato juice",
  "vegetable broth",
  "chicken broth",
  "beef broth",
  "coconut water",
  "almond milk",
  "soy milk",
  "oat milk",
  "heavy cream",
  "half-and-half",
  "whipping cream",
  "yogurt drink",
  "kefir",
  "buttermilk",
  "iced coffee",
  "cold brew",
  "green tea",
  "black tea",
  "herbal tea",
  "lemonade",
  "limeade",
  "smoothies",
  "protein shakes",
  "meal replacement shakes",
  "soda",
  "sparkling water",
  "tonic water",
  "seltzer",
  "wine",
  "beer",
  "cider",
  "sake",
  "soy sauce",
  "fish sauce",
  "oyster sauce",
  "worcestershire sauce",
  "maple syrup",
  "honey",
  "molasses",
  "simple syrup",
  "salad dressing",
  "barbecue sauce",
  "hot sauce",
  "teriyaki sauce",
  "hoisin sauce",
  "chocolate syrup",
  "caramel sauce",
  "fruit puree",
  "soup",
  "gravy",
  "stock",
  "bone broth",
  "kombucha",
  "energy drinks",
  "sports drinks",
  "infused water",
  "coconut milk",
  "cashew milk",
  "rice milk",
  "flax milk",
  "hemp milk",
  "eggnog",
  "chai concentrate",
  "espresso shots",
  "matcha latte",
  "horchata",
  "tamarind juice",
  "guava nectar",
  "passion fruit juice",
  "prune juice",
  "pomegranate juice",
  "elderflower cordial",
  "rose water",
  "orange blossom water",
  "vanilla extract",
  "almond extract",
  "peppermint extract",
  "liquid amino acids",
  "vinegar",
  "balsamic vinegar",
  "apple cider vinegar",
  "red wine vinegar",
  "white wine vinegar",
  "rice vinegar",
  "mirin",
  "vermouth",
  "liqueurs",
  "cocktail mixers",
  "margarita mix",
  "bloody mary mix",
  "clam juice",
  "dashi stock",
  "miso broth",
  "chia seed drink",
  "flavored water",
  "electrolyte water",
  "mustard",
  "yakult",
  "vitamilk",
  "delight",
  "gatorade",
  "prime",
  "chucky",
  "dutch mill",
  "mr.milk"
];

function handleItemNameChange() {
  const itemName = document.getElementById("itemName").value.toLowerCase();
  const itemUnitSelect = document.getElementById("itemUnit");
  const minQuantityUnitSelect = document.getElementById("minQuantityUnit");

  // Enable all options first
  Array.from(itemUnitSelect.options).forEach((option) => {
    option.disabled = false;
  });
  Array.from(minQuantityUnitSelect.options).forEach((option) => {
    option.disabled = false;
  });

  // Check if the item is a liquid
  if (liquidItems.includes(itemName)) {
    // Disable solid units (kg, g, mg) in both dropdowns
    Array.from(itemUnitSelect.options).forEach((option) => {
      if (["kg", "g", "mg"].includes(option.value)) {
        option.disabled = true;
      }
    });
    Array.from(minQuantityUnitSelect.options).forEach((option) => {
      if (["kg", "g", "mg"].includes(option.value)) {
        option.disabled = true;
      }
    });
  } else {
    // Disable liquid units (ml, l) in both dropdowns
    Array.from(itemUnitSelect.options).forEach((option) => {
      if (["ml", "l"].includes(option.value)) {
        option.disabled = true;
      }
    });
    Array.from(minQuantityUnitSelect.options).forEach((option) => {
      if (["ml", "l"].includes(option.value)) {
        option.disabled = true;
      }
    });
  }
}

// Add event listener to item name input
document.getElementById("itemName").addEventListener("input", handleItemNameChange);

// Function to update notifications
function updateNotifications() {
  const notifications = [];
  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  Object.entries(inventory).forEach(([category, items]) => {
    items.forEach((item) => {
      const expiryDate = new Date(item.expiryDate);
      const [quantity] = item.quantity.split(" ");
      const [minQuantity] = item.minQuantity.split(" ");

      if (expiryDate <= weekFromNow && expiryDate >= today) {
        notifications.push({
          message: `Item "${item.name}" is expiring soon!`,
          category,
          itemId: item.id,
          image: item.image,
          read: false,
          timestamp: new Date().toLocaleString(),
        });
      }
      if (parseFloat(quantity) <= parseFloat(minQuantity)) {
        notifications.push({
          message: `Item "${item.name}" is low in stock!`,
          category,
          itemId: item.id,
          image: item.image,
          read: false,
          timestamp: new Date().toLocaleString(),
        });
      }
    });
  });

  const notificationCount = document.getElementById("notificationCount");
  notificationCount.textContent = notifications.length;
  notificationCount.style.display = notifications.length > 0 ? "block" : "none";

  const notificationsDiv = document.getElementById("notifications");
  notificationsDiv.innerHTML = notifications
    .map(
      (notification) => `
        <div class="notification ${notification.read ? "read" : ""}" data-category="${notification.category}" data-item-id="${notification.itemId}">
          <img src="${notification.image || "placeholder-image.jpg"}" alt="${notification.message}" />
          <div class="text">${notification.message}</div>
          <div class="timestamp">${notification.timestamp}</div>
          <button class="clear-notification" onclick="clearNotification(event, ${notification.itemId}, '${notification.category}')">×</button>
        </div>
      `
    )
    .join("");
}

function clearNotification(event, itemId, category) {
  event.stopPropagation();
  const notification = event.target.closest(".notification");
  notification.remove();
  updateNotifications();
}

// Toggle notification panel
document.getElementById("notificationBell").addEventListener("click", function () {
  const notificationPanel = document.getElementById("notificationPanel");
  notificationPanel.classList.toggle("active");
});

// Close panel when clicking outside
document.addEventListener("click", function (e) {
  const notificationPanel = document.getElementById("notificationPanel");
  const notificationBell = document.getElementById("notificationBell");

  if (
    !notificationPanel.contains(e.target) &&
    !notificationBell.contains(e.target)
  ) {
    notificationPanel.classList.remove("active");
  }
});

// Click notification to show item details
document.getElementById("notifications").addEventListener("click", function (e) {
  const notification = e.target.closest(".notification");
  if (notification) {
    const category = notification.dataset.category;
    const itemId = parseInt(notification.dataset.itemId);
    showItemDetails(itemId, category);
    notification.classList.add("read"); // Mark as read
    document.getElementById("notificationPanel").classList.remove("active");
  }
});

// Mark all notifications as read
document.getElementById("markAsRead").addEventListener("click", function () {
  const notifications = document.querySelectorAll(".notification");
  notifications.forEach((notification) => notification.classList.add("read"));
  const notificationCount = document.getElementById("notificationCount");
  notificationCount.textContent = 0;
  notificationCount.style.display = "none";
});

// Call updateNotifications in updateDisplay and updateStats
updateNotifications();

function convertToBaseUnit(quantity) {
  const [value, unit] = quantity.split(" ");
  const numericValue = parseFloat(value);

  // Conversion logic for solid units (to grams)
  if (["kg", "g", "mg"].includes(unit)) {
    switch (unit) {
      case "kg":
        return numericValue * 1000; // Convert kg to grams
      case "g":
        return numericValue; // Already in grams
      case "mg":
        return numericValue / 1000; // Convert mg to grams
      default:
        throw new Error(`Unsupported solid unit: ${unit}`);
    }
  }

  // Conversion logic for liquid units (to milliliters)
  if (["l", "ml"].includes(unit)) {
    switch (unit) {
      case "l":
        return numericValue * 1000; // Convert liters to milliliters
      case "ml":
        return numericValue; // Already in milliliters
      default:
        throw new Error(`Unsupported liquid unit: ${unit}`);
    }
  }

  throw new Error(`Invalid unit: ${unit}`);
}

// Standalone function to display low-stock items table
function displayLowStockItemsTable() {
  // Get the container for the table
  const lowStockTableContainer = document.getElementById("lowStockTableContainer");
  if (!lowStockTableContainer) {
    console.error("Error: #lowStockTableContainer not found in the HTML.");
    return;
  }

  // Get the inventory from localStorage
  const inventory = JSON.parse(localStorage.getItem("refrigeratorInventory")) || {
    freezer: [],
    chiller: [],
    mid: [],
  };

  // Get all items from the inventory
  const allItems = [...inventory.freezer, ...inventory.chiller, ...inventory.mid];

  // Filter low-stock items
  const lowStockItems = allItems.filter((item) => {
    const quantityInBaseUnit = convertToBaseUnit(item.quantity);
    const minQuantityInBaseUnit = convertToBaseUnit(item.minQuantity);
    return quantityInBaseUnit <= minQuantityInBaseUnit;
  });

  // If no low-stock items, display a message
  if (lowStockItems.length === 0) {
    lowStockTableContainer.innerHTML = "<p>No low-stock items found.</p>";
    return;
  }

  // Clear existing content
  lowStockTableContainer.innerHTML = "";

  // Create a table element
  const table = document.createElement("table");
  table.className = "low-stock-table";

  // Create table headers
  const headerRow = document.createElement("tr");
  const headers = ["Category", "Name", "Quantity", "Minimum Quantity", "Expiry Date"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Populate the table with low-stock items
  lowStockItems.forEach((item) => {
    const row = document.createElement("tr");

    // Determine the category of the item
    let category;
    if (inventory.freezer.includes(item)) {
      category = "Freezer";
    } else if (inventory.chiller.includes(item)) {
      category = "Chiller";
    } else if (inventory.mid.includes(item)) {
      category = "Mid Section";
    } else {
      category = "Unknown";
    }

    // Add item details to the row
    const cells = [
      category,
      item.name,
      item.quantity,
      item.minQuantity,
      new Date(item.expiryDate).toLocaleDateString(),
    ];

    cells.forEach((cellText) => {
      const td = document.createElement("td");
      td.textContent = cellText;
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  // Append the table to the container
  lowStockTableContainer.appendChild(table);
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  displayLowStockItemsTable();
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

searchInput.addEventListener("input", debounce(updateDisplay, 300));

// Add keyboard accessibility to navigation buttons
navButtons.forEach((button) => {
  button.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      button.click();
    }
  });
});

// Add ARIA labels to modal close buttons
closeModal.setAttribute("aria-label", "Close modal");
document.querySelector(".close-modal-btn").setAttribute("aria-label", "Close modal");
