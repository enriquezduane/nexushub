const modal5 = document.getElementById('createCategoryModal');
const openCategoryModalBtn = document.getElementById("openCategoryModalBtn");
const closeCategoryModalBtn = document.getElementById("closeCategoryModalBtn");
const createCategoryForm = document.getElementById("createCategoryForm");
const createCategoryModal = document.getElementById("createCategoryModal");

openCategoryModalBtn.addEventListener('click', () => {
    modal5.classList.add('show');
});

closeCategoryModalBtn.addEventListener('click', () => {
    modal5.classList.remove('show');
});

window.addEventListener('click', (event) => {
    if (event.target === modal5) {
        modal5.classList.remove('show');
    }
});

createCategoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const categoriesContainer = document.querySelector(".content-container");
    const categoryTitleContainer = document.getElementById("categoryTitle");
    const categoryTitle = categoryTitleContainer.value;
    const categoryContainers = document.querySelectorAll('.category-container');

    // Get the last category container
    const lastCategoryContainer = categoryContainers[categoryContainers.length - 1];

    // Get the index of the last category container
    const index = lastCategoryContainer.dataset.index;

    fetch('/admin/category', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({title: categoryTitle})
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Category already exists');
            } else {
                throw new Error('Failed to create category');
            }
        }
        return response.json();
    })
    .then(() => {
        // alert the user
        alert('Category created successfully!');

        // refresh the page
        window.location.href = '/admin';
    })
    .catch(error => {
        console.error('Error creating category:', error);
        if (error.message === 'Category already exists') {
            alert('Registration failed. Category already exists!'); // Display specific error message for username already taken
        } else {
            alert('Registration failed. Please try again.'); // Display general error message
        }

        createCategoryModal.classList.remove('show');
        categoryTitleContainer.value = "";
    });

    
});

  