# Project_Management

HTML

Document Metadata (<head> section)

<meta charset="UTF-8">: Specifies the character encoding as UTF-8 to support international characters.
<meta name="viewport" content="width=device-width, initial-scale=1.0">: Ensures responsive design by making the page adapt to different screen sizes (e.g., mobile or desktop).
<title>Enhanced Refrigerator Inventory System</title>: Sets the title of the page, displayed in the browser tab.
<link rel="stylesheet" href="stylesdashboard.css">: Links an external CSS file (stylesdashboard.css) for styling the page.

Main Content (<body> section):

Everything inside <body> is what the user interacts with.

Container Section:

<div class="container">: Wraps the main content to allow for centralized styling and layout control.

HTML Document Structure:

Document Metadata (<head> section):

<meta charset="UTF-8">: Specifies the character encoding as UTF-8 to support international characters.
<meta name="viewport" content="width=device-width, initial-scale=1.0">: Ensures responsive design by making the page adapt to different screen sizes (e.g., mobile or desktop).
<title>Enhanced Refrigerator Inventory System</title>: Sets the title of the page, displayed in the browser tab.
<link rel="stylesheet" href="stylesdashboard.css">: Links an external CSS file (stylesdashboard.css) for styling the page.
 Main Content (<body> section):
Everything inside <body> is what the user interacts with.

Page Components:

Container Section:
<div class="container">: Wraps the main content to allow for centralized styling and layout control.

Header:

<h1>Refrigerator Inventory System</h1>: Displays the title of the system prominently.

Navigation Bar:

<nav class="category-nav">: A navigation bar to switch between different sections of the refrigerator.
<button class="nav-btn" data-category="...">: Buttons for each section of the refrigerator Freezer, Chiller, Mid Section.
The data-category attribute links each button to its corresponding section.
The active class highlights the selected section.

Search and Filter Bar:

<div class="search-filter-bar">: A section for searching and filtering items.
Search Box:
<input type="text" id="searchInput" placeholder="Search items...">: Lets users search for items by name.
Filter Options:
<select id="sortBy">: Dropdown for sorting items by various attributes like name, expiry date, date added, or quantity.
<select id="filterExpiry">: Dropdown to filter items based on expiry status examples all items, expired, expiring soon.

Stats Dashboard:
<div class="stats-dashboard">: Displays summary information using "stat cards."
Total Items: Displays the total count of items.
Expiring Soon: Highlights the count of items close to their expiry date.
Low Stock: Indicates the count of items with low quantities.
Each card dynamically updates its <p> content via JavaScript IDs like totalItems, expiringSoon, and lowStock.

Add Item Form:
<div class="add-item-section">: A form for adding new items to the inventory.
Form Fields:
<select id="itemCategory">: Dropdown to choose the item's category (Freezer, Chiller, Mid Section).
<input type="text" id="itemName">: Field to input the item's name.
<input type="number" id="itemQuantity">: Field for item quantity.
<input type="number" id="minQuantity">: Field for minimum stock alert.
<input type="date" id="expiryDate">: Field for the item's expiry date.
<textarea id="itemNotes">: Optional field for additional notes about the item.
<input type="file" id="itemImage">: Upload an image of the item.
<div id="imagePreview" class="image-preview">: Placeholder to display a preview of the uploaded image.
Submit Button: <button type="submit">Add Item</button>: Triggers form submission.

Inventory Display Section:
<div class="inventory-container">: Displays items grouped by category.
Category Sections:
<div id="freezer" class="category-section active">: Section for freezer items.
<div id="chiller" class="category-section">: Section for chiller items.
<div id="mid" class="category-section">: Section for mid-section items.
Each section has a <div class="items-grid"> for dynamically displaying items as cards.

Item Details Modal:
<div id="itemModal" class="modal">: A modal popup for viewing item details.
Modal Components:
<div class="modal-content">: The content area of the modal.
<span class="close-modal">&times;</span>: A button to close the modal.
<div id="modalContent"></div>: Placeholder for dynamically loading item details.

Script <script>:

Includes script.js for interactivity, such as form validation and toggling password visibility.