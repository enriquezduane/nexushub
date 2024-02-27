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
                response.json().then(error => {
                    throw new Error(error.message);
                });
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
            alert(error.message);
        })
        .finally(() => {
            modal5.classList.remove('show');
            categoryTitleContainer.value = "";
        });
    });
}
