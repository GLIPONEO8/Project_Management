// User storage in localStorage
const users = JSON.parse(localStorage.getItem('users')) || {};

// Switch between login and register forms
function switchForm(formId) {
    document.getElementById('registerForm').style.display = 
        formId === 'registerForm' ? 'block' : 'none';
    document.getElementById('loginForm').style.display = 
        formId === 'loginForm' ? 'block' : 'none';
    
    // Reset forms and hide messages
    document.querySelectorAll('form').forEach(form => form.reset());
    document.querySelectorAll('.error, .success-message').forEach(
        el => el.style.display = 'none'
    );
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password)
    ];
    
    strength = requirements.filter(Boolean).length;
    
    const meter = document.getElementById('strengthMeter');
    const percentage = (strength / 5) * 100;
    meter.style.width = `${percentage}%`;
    
    if (strength <= 2) {
        meter.style.backgroundColor = '#dc3545';
    } else if (strength <= 4) {
        meter.style.backgroundColor = '#ffc107';
    } else {
        meter.style.backgroundColor = '#28a745';
    }
    
    return strength;
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Reset error messages
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    
    // Check if username exists
    if (users[username]) {
        document.getElementById('usernameError').style.display = 'block';
        return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('passwordError').style.display = 'block';
        return false;
    }
    
    // Check password strength
    if (checkPasswordStrength(password) < 4) {
        alert('Password is not strong enough. Please follow the requirements.');
        return false;
    }
    
    // Store user
    users[username] = {
        password: password, // In a real app, this should be hashed
        created: new Date().toISOString()
    };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message
    document.getElementById('registerSuccess').style.display = 'block';
    setTimeout(() => switchForm('loginForm'), 1500);
    
    return false;
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Reset error message
    document.getElementById('loginError').style.display = 'none';
    
    // Check credentials
    if (users[username]?.password === password) {
        document.getElementById('loginSuccess').style.display = 'block';
        // Redirect to dashboard.html after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
    
    return false;
}

// Add password strength meter functionality
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('regPassword').addEventListener('input', function(e) {
        checkPasswordStrength(e.target.value);
    });
});

// Store items in localStorage
let inventory = JSON.parse(localStorage.getItem('refrigeratorInventory')) || {
    freezer: [],
    chiller: [],
    mid: []
};

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const categorySections = document.querySelectorAll('.category-section');
const addItemForm = document.getElementById('addItemForm');
const searchInput = document.getElementById('searchInput');
const sortBySelect = document.getElementById('sortBy');
const filterExpirySelect = document.getElementById('filterExpiry');
const imagePreview = document.getElementById('imagePreview');
const modal = document.getElementById('itemModal');
const closeModal = document.querySelector('.close-modal');

// Event Listeners
searchInput.addEventListener('input', updateDisplay);
sortBySelect.addEventListener('change', updateDisplay);
filterExpirySelect.addEventListener('change', updateDisplay);
document.getElementById('itemImage').addEventListener('change', handleImagePreview);
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Navigation functionality
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        categorySections.forEach(section => {
            section.classList.remove('active');
            if (section.id === category) section.classList.add('active');
        });
        updateDisplay();
    });
});

// Image Preview Handler
function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
    }
}

// Add new item
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const category = document.getElementById('itemCategory').value;
    const name = document.getElementById('itemName').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const minQuantity = parseInt(document.getElementById('minQuantity').value);
    const expiryDate = document.getElementById('expiryDate').value;
    const notes = document.getElementById('itemNotes').value;
    const imageFile = document.getElementById('itemImage').files[0];
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            addItemToInventory(category, name, quantity, minQuantity, expiryDate, notes, imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        addItemToInventory(category, name, quantity, minQuantity, expiryDate, notes);
    }
    
    addItemForm.reset();
    imagePreview.innerHTML = '';
});

function addItemToInventory(category, name, quantity, minQuantity, expiryDate, notes, imageData = null) {
    const newItem = {
        id: Date.now(),
        name,
        quantity,
        minQuantity,
        expiryDate,
        notes,
        image: imageData,
        dateAdded: new Date().toISOString()
    };
    
    inventory[category].push(newItem);
    saveInventory();
    updateDisplay();
    updateStats();
}

function updateDisplay() {
    const activeCategory = document.querySelector('.nav-btn.active').dataset.category;
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = sortBySelect.value;
    const expiryFilter = filterExpirySelect.value;
    
    let items = [...inventory[activeCategory]];
    
    // Apply search filter
    items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm))
    );
    
    // Apply expiry filter
    items = filterByExpiry(items, expiryFilter);
    
    // Apply sorting
    items = sortItems(items, sortBy);
    
    displayItems(activeCategory, items);
    updateStats();
}

function filterByExpiry(items, filter) {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    switch(filter) {
        case 'expired':
            return items.filter(item => new Date(item.expiryDate) < today);
        case 'week':
            return items.filter(item => {
                const expiry = new Date(item.expiryDate);
                return expiry >= today && expiry <= weekFromNow;
            });
        case 'month':
            return items.filter(item => {
                const expiry = new Date(item.expiryDate);
                return expiry >= today && expiry <= monthFromNow;
            });
        default:
            return items;
    }
}

function sortItems(items, sortBy) {
    return items.sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'expiry':
                return new Date(a.expiryDate) - new Date(b.expiryDate);
            case 'dateAdded':
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            case 'quantity':
                return b.quantity - a.quantity;
            default:
                return 0;
        }
    });
}

function displayItems(category, items) {
    const gridContainer = document.querySelector(`#${category} .items-grid`);
    gridContainer.innerHTML = '';
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        // Calculate expiry status
        const expiryStatus = getExpiryStatus(item.expiryDate);
        const quantityStatus = item.quantity <= item.minQuantity ? 'low' : 'normal';
        
        itemCard.innerHTML = `
            ${item.image ? 
                `<img src="${item.image}" alt="${item.name}" class="item-image">` : 
                '<div class="item-image" style="background-color: #ddd;"></div>'
            }
            ${expiryStatus !== 'normal' ? 
                `<span class="expiry-badge ${expiryStatus}">${expiryStatus}</span>` : ''
            }
            ${quantityStatus === 'low' ? 
                `<span class="quantity-badge low">Low Stock</span>` : ''
            }
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Expiry: ${new Date(item.expiryDate).toLocaleDateString()}</p>
                <button onclick="showItemDetails(${item.id}, '${category}')">Details</button>
                <button onclick="deleteItem('${category}', ${item.id})">Delete</button>
            </div>
        `;
        
        gridContainer.appendChild(itemCard);
    });
}

function getExpiryStatus(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'warning';
    return 'normal';
}

function showItemDetails(itemId, category) {
    const item = inventory[category].find(item => item.id === itemId);
    if (!item) return;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2>${item.name}</h2>
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="max-width: 300px;">` : ''}
        <div class="item-details">
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <p><strong>Minimum Quantity:</strong> ${item.minQuantity}</p>
            <p><strong>Expiry Date:</strong> ${new Date(item.expiryDate).toLocaleDateString()}</p>
            <p><strong>Date Added:</strong> ${new Date(item.dateAdded).toLocaleDateString()}</p>
            ${item.notes ? `<p><strong>Notes:</strong> ${item.notes}</p>` : ''}
        </div>
        <div class="modal-actions">
            <button onclick="editItem(${item.id}, '${category}')">Edit</button>
            <button onclick="deleteItem('${category}', ${item.id}); modal.style.display='none'">Delete</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function editItem(itemId, category) {
    // Implementation for editing items
    // This could be expanded based on requirements
    console.log('Edit item:', itemId, category);
}

function deleteItem(category, itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory[category] = inventory[category].filter(item => item.id !== itemId);
        saveInventory();
        updateDisplay();
    }
}

function updateStats() {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    let totalItems = 0;
    let expiringSoon = 0;
    let lowStock = 0;
    
    Object.values(inventory).forEach(category => {
        category.forEach(item => {
            totalItems++;
            
            const expiryDate = new Date(item.expiryDate);
            if (expiryDate <= weekFromNow && expiryDate >= today) {
                expiringSoon++;
            }
            
            if (item.quantity <= item.minQuantity) {
                lowStock++;
            }
        });
    });
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('expiringSoon').textContent = expiringSoon;
    document.getElementById('lowStock').textContent = lowStock;
}

function saveInventory() {
    localStorage.setItem('refrigeratorInventory', JSON.stringify(inventory));
}

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