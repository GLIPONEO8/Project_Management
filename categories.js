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