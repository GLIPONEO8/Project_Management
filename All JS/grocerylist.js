class GroceryListManager {
    constructor() {
        this.lists = JSON.parse(localStorage.getItem('groceryLists')) || [];
        this.currentEditingListId = null;
        this.currentEditingItemId = null;

        this.initializeEventListeners();
        this.renderLists();
    }

    initializeEventListeners() {
        // Create New List Button
        document.getElementById('createNewListBtn').addEventListener('click', () => this.openListModal());

        // Save List Button
        document.getElementById('saveListBtn').addEventListener('click', () => this.saveList());

        // Save Item Button
        document.getElementById('saveItemBtn').addEventListener('click', () => this.saveItem());

        // Close Modal Buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('listModal').style.display = 'none';
                document.getElementById('itemModal').style.display = 'none';
            });
        });
    }

    openListModal(list = null) {
        const modal = document.getElementById('listModal');
        const modalTitle = document.getElementById('modalTitle');
        const listNameInput = document.getElementById('listNameInput');

        if (list) {
            modalTitle.textContent = 'Edit List';
            listNameInput.value = list.name;
            this.currentEditingListId = list.id;
        } else {
            modalTitle.textContent = 'Create New List';
            listNameInput.value = '';
            this.currentEditingListId = null;
        }

        modal.style.display = 'block';
    }

    saveList() {
        const listNameInput = document.getElementById('listNameInput');
        const listName = listNameInput.value.trim();

        if (!listName) {
            alert('Please enter a list name');
            return;
        }

        if (this.currentEditingListId) {
            // Edit existing list
            const listIndex = this.lists.findIndex(list => list.id === this.currentEditingListId);
            this.lists[listIndex].name = listName;
        } else {
            // Create new list
            const newList = {
                id: Date.now(),
                name: listName,
                items: []
            };
            this.lists.push(newList);
        }

        this.saveToLocalStorage();
        this.renderLists();
        document.getElementById('listModal').style.display = 'none';
    }

    deleteList(listId) {
        this.lists = this.lists.filter(list => list.id !== listId);
        this.saveToLocalStorage();
        this.renderLists();
    }

    openItemModal(listId, item = null) {
        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('itemModalTitle');
        const itemNameInput = document.getElementById('itemNameInput');
        const itemQuantityInput = document.getElementById('itemQuantityInput');

        if (item) {
            modalTitle.textContent = 'Edit Item';
            itemNameInput.value = item.name;
            itemQuantityInput.value = item.quantity;
            this.currentEditingItemId = item.id;
        } else {
            modalTitle.textContent = 'Add Item';
            itemNameInput.value = '';
            itemQuantityInput.value = 1;
            this.currentEditingItemId = null;
        }

        this.currentEditingListId = listId;
        modal.style.display = 'block';
    }

    saveItem() {
        const itemNameInput = document.getElementById('itemNameInput');
        const itemQuantityInput = document.getElementById('itemQuantityInput');
        
        const itemName = itemNameInput.value.trim();
        const itemQuantity = parseInt(itemQuantityInput.value);

        if (!itemName || itemQuantity < 1) {
            alert('Please enter a valid item name and quantity');
            return;
        }

        const listIndex = this.lists.findIndex(list => list.id === this.currentEditingListId);

        if (this.currentEditingItemId) {
            // Edit existing item
            const itemIndex = this.lists[listIndex].items.findIndex(
                item => item.id === this.currentEditingItemId
            );
            this.lists[listIndex].items[itemIndex] = {
                id: this.currentEditingItemId,
                name: itemName,
                quantity: itemQuantity
            };
        } else {
            // Add new item
            const newItem = {
                id: Date.now(),
                name: itemName,
                quantity: itemQuantity
            };
            this.lists[listIndex].items.push(newItem);
        }

        this.saveToLocalStorage();
        this.renderLists();
        document.getElementById('itemModal').style.display = 'none';
    }

    deleteItem(listId, itemId) {
        const listIndex = this.lists.findIndex(list => list.id === listId);
        this.lists[listIndex].items = this.lists[listIndex].items.filter(
            item => item.id !== itemId
        );
        this.saveToLocalStorage();
        this.renderLists();
    }

    saveToLocalStorage() {
        localStorage.setItem('groceryLists', JSON.stringify(this.lists));
    }

    renderLists() {
        const listContainer = document.getElementById('listContainer');
        listContainer.innerHTML = '';

        this.lists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.classList.add('grocery-list');
            listElement.innerHTML = `
                <div class="list-header">
                    <h3>${list.name}</h3>
                    <div class="list-actions">
                        <button class="edit-list-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-list-btn"><i class="fas fa-trash"></i></button>
                        <button class="add-item-btn"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <ul class="grocery-list-items">
                    ${list.items.map(item => `
                        <li class="grocery-list-item">
                            <span>${item.name}</span>
                            <div>
                                <span>Qty: ${item.quantity}</span>
                                <button class="edit-item-btn"><i class="fas fa-edit"></i></button>
                                <button class="delete-item-btn"><i class="fas fa-trash"></i></button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `;

            // Edit List Button
            listElement.querySelector('.edit-list-btn').addEventListener('click', () => {
                this.openListModal(list);
            });

            // Delete List Button
            listElement.querySelector('.delete-list-btn').addEventListener('click', () => {
                this.deleteList(list.id);
            });

            // Add Item Button
            listElement.querySelector('.add-item-btn').addEventListener('click', () => {
                this.openItemModal(list.id);
            });

            // Edit Item Buttons
            listElement.querySelectorAll('.edit-item-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    this.openItemModal(list.id, list.items[index]);
                });
            });

            // Delete Item Buttons
            listElement.querySelectorAll('.delete-item-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    this.deleteItem(list.id, list.items[index].id);
                });
            });

            listContainer.appendChild(listElement);
        });
    }
}

// Initialize the Grocery List Manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GroceryListManager();
});