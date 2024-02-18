const modal5 = document.getElementById('createCategoryModal');
const openCategoryModalBtn = document.getElementById("openCategoryModalBtn");
const closeCategoryModalBtn = document.getElementById("closeCategoryModalBtn");
const createCategoryForm = document.getElementById("createCategoryForm");

if (openCategoryModalBtn) {
    openCategoryModalBtn.addEventListener('click', () => {
        modal5.classList.add('show');
    });
}

if (closeCategoryModalBtn) {
    closeCategoryModalBtn.addEventListener('click', () => {
        modal5.classList.remove('show');
    });
}

if (modal5) {
    window.addEventListener('click', (event) => {
        if (event.target === modal5) {
            modal5.classList.remove('show');
        }
    });
}

if (createCategoryForm) {
    createCategoryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const categoryTitleContainer = document.getElementById("categoryTitle");
        const categoryTitle = categoryTitleContainer.value;

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
            window.location.href = '/admin?action=categories';
        })
        .catch(error => {
            console.error('Error creating category:', error);
            if (error.message === 'Category already exists') {
                alert('Registration failed. Category already exists!'); // Display specific error message for username already taken
            } else {
                alert('Registration failed. Please try again.'); // Display general error message
            }
        })
        .finally(() => {
            modal5.classList.remove('show');
            categoryTitleContainer.value = "";
        });
    });
}
