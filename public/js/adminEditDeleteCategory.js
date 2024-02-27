const editCategoryModal = document.getElementById('editCategoryModal');
const openEditCategoryModalBtns = document.querySelectorAll(".edit-category-button");
const closeEditCategoryModalBtn = document.getElementById("closeEditCategoryModalBtn");
const editCategoryForm = document.getElementById("editCategoryForm");
let categoryId = null;

if (openEditCategoryModalBtns) {
    openEditCategoryModalBtns.forEach(button => {
        button.addEventListener('click', function() {
            // Retrieve category data from data attributes
            const title = this.dataset.title;
            categoryId = this.dataset.id;
    
            // Fill the edit category modal form with category data
            const editCategoryForm = document.querySelector('#editCategoryForm');
            const editCategoryTitleInput = editCategoryForm.querySelector('#editCategoryTitle');
    
            editCategoryTitleInput.value = title;
    
            // Show the edit category modal
            const editCategoryModal = document.querySelector('#editCategoryModal');
            editCategoryModal.classList.add('show');
        });
    });
}

if (closeEditCategoryModalBtn) {
    closeEditCategoryModalBtn.addEventListener('click', () => {
        editCategoryModal.classList.remove('show');
    });
}

if (editCategoryModal) {
    window.addEventListener('click', (event) => {
        if (event.target === editCategoryModal) {
            editCategoryModal.classList.remove('show');
        }
    });
}


if (editCategoryForm) {
    editCategoryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const categoryTitleContainer = document.getElementById("editCategoryTitle");
        const categoryTitle = categoryTitleContainer.value;

        fetch('/admin/category', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: categoryId, title: categoryTitle})
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
            alert('Category updated successfully!');
            window.location.reload(); 
        })
        .catch(error => {
            console.error('Error updating category:', error);
            alert(error.message);
        })
        .finally(() => {
            editCategoryModal.classList.remove('show');
            categoryTitleContainer.value = "";
        });
    });
}

// delete
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-category-button')) {
        // warning
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        // Retrieve the category ID from the data-id attribute
        const categoryId = event.target.dataset.id;

        // Send an AJAX request to delete the category
        fetch('/admin/category', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: categoryId })
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
            alert('Category deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting category:', error);
            alert(error.message);
        });
    }
});
