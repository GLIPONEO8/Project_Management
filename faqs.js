// FAQ 
const faqs = [
    {
        question: "What is a refrigerator inventory system?",
        answer: "A refrigerator inventory system helps track and manage the items stored in your fridge, freezer, or chiller. The system ensures that you can efficiently manage food inventory, reduce waste, and keep your fridge organized.",
        category: "General Questions"
    },
    {
        question: "How do I add items to the inventory?",
        answer: "To add items to the inventory, simply navigate to the 'Add New Item' section of the system. You’ll need to enter details such as the item name, category tag, quantity, expiration date, and any other relevant information. You can also upload an image of the item and set a minimum stock level for alerts.",
        category: "Functionality"
    },
    {
        question: "How do I reset my account or inventory data?",
        answer: "To reset your account or inventory data, navigate to the inventory tab and select to clear data.",
        category: "Technical"
    },
    {
        question: "Do I need a separate license for multiple devices?",
        answer: " No, you do not need a separate license for multiple devices. Since the system is web-based, you can access it from multiple devices with the same login credentials.",
        category: "Pricing"
    },
    {
        question: "Do you share my data with third parties?",
        answer: "We do not share your personal data with third parties unless required by law or with your explicit consent. Any third-party services used in the system, such as payment gateways, are fully compliant with privacy regulations.",
        category: "Privacy & Security"
    },
    {
        question: "How do I create an account?",
        answer: "To create an account, simply visit the registration page on the website, enter your details (username), and choose a secure password.",
        category: "Account Management"
    },
];

// Initialize FAQs
function initializeFAQs() {
    const faqContainer = document.getElementById('faqContainer');
    
    faqs.forEach((faq, index) => {
        const faqElement = document.createElement('div');
        faqElement.className = 'faq-item';
        faqElement.innerHTML = `
            <div class="faq-question" onclick="toggleAnswer(${index})">
                <span class="category-tag">${faq.category}</span>
                ${faq.question}
            </div>
            <div class="faq-answer" id="answer${index}">
                ${faq.answer}
            </div>
        `;
        faqContainer.appendChild(faqElement);
    });
}

// Toggle FAQ answer
function toggleAnswer(index) {
    const answer = document.getElementById(`answer${index}`);
    const question = answer.previousElementSibling;
    
    answer.classList.toggle('show');
    question.classList.toggle('active');
}

// Search functionality
function searchFAQs() {
    const searchInput = document.getElementById('searchInput');
    const filter = searchInput.value.toLowerCase();
    const faqItems = document.getElementsByClassName('faq-item');

    Array.from(faqItems).forEach(item => {
        const question = item.querySelector('.faq-question').textContent;
        const answer = item.querySelector('.faq-answer').textContent;
        
        if (question.toLowerCase().includes(filter) || 
            answer.toLowerCase().includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Initialize FAQ items
document.addEventListener('DOMContentLoaded', function() {
    initializeFAQs();
    
    // Add search functionality
    document.getElementById('searchInput').addEventListener('input', searchFAQs);
});