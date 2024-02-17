// Get the modal dialog
const createCategoryModal = document.getElementById('createCategoryModal');

// Get the button that opens the modal
const openModalBtn = document.getElementById("openCategoryModalBtn");

// Get the close button inside the dialog
const closeModalBtn = document.getElementById("closeCategoryModalBtn");

// When the user clicks the button, open the modal
openModalBtn.addEventListener('click', () => {
  createCategoryModal.showModal();
  console.log('Modal opened');
});

// When the user clicks on the close button, close the modal
closeModalBtn.addEventListener('click', () => {
  createCategoryModal.close();
  console.log('Modal closed');
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === createCategoryModal) {
    createCategoryModal.close();
  }
});

// Submit form data using AJAX
const createCategoryForm = document.getElementById("createCategoryForm");
createCategoryForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission
  const formData = new FormData(createCategoryForm);
  fetch('/admin/create-category', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    // Category created successfully, close the modal
    createCategoryModal.close();
    // Optionally, reload the page or update UI
  })
  .catch(error => {
    console.error('Error creating category:', error);
    // Optionally, display an error message to the user
  });
});
