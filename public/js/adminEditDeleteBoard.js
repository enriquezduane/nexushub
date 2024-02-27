const editBoardModal = document.getElementById('editBoardModal');
const openEditBoardModalBtns = document.querySelectorAll(".edit-board-button");
const closeEditBoardModalBtn = document.getElementById("closeEditBoardModalBtn");
const editBoardForm = document.getElementById("editBoardForm");
let boardId = null;

if (openEditBoardModalBtns) {
    openEditBoardModalBtns.forEach(button => {
        button.addEventListener('click', function() {
            // Retrieve board data from data attributes
            const title = this.dataset.title;
            const description = this.dataset.description;
            const innerDescription = this.dataset.innerdescription;
            boardId = this.dataset.id;
    
            // Fill the edit board modal form with board data
            const editBoardForm = document.querySelector('#editBoardForm');
            const editBoardTitleInput = editBoardForm.querySelector('#editBoardTitle');
            const editBoardDescriptionInput = editBoardForm.querySelector('#editBoardDescription');
            const editInnerDescriptionInput = editBoardForm.querySelector('#editInnerDescription');

            // Set the form values
            editBoardTitleInput.value = title;
            editBoardDescriptionInput.value = description;
            editInnerDescriptionInput.value = innerDescription;
            
            // Show the edit board modal
            editBoardModal.classList.add('show');
        });
    });
}

if (closeEditBoardModalBtn) {
    closeEditBoardModalBtn.addEventListener('click', () => {
        editBoardModal.classList.remove('show');
    });
}

if (editBoardModal) {
    window.addEventListener('click', (event) => {
        if (event.target === editBoardModal) {
            editBoardModal.classList.remove('show');
        }
    });
}

if (editBoardForm) {
    editBoardForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const boardTitleContainer = document.getElementById("editBoardTitle");
        const boardTitle = boardTitleContainer.value;
        const boardDescriptionContainer = document.getElementById("editBoardDescription");
        const boardDescription = boardDescriptionContainer.value;
        const innerDescriptionContainer = document.getElementById("editInnerDescription");
        const innerDescription = innerDescriptionContainer.value;

        fetch('/admin/board', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: boardId, title: boardTitle, description: boardDescription, innerDescription: innerDescription})
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then(() => {
            alert('Board updated successfully!');
            window.location.reload(); 
        })
        .catch(error => {
            console.error('Error updating board:', error);
            alert(error.message);
        })
        .finally(() => {
            editBoardModal.classList.remove('show');
            boardTitleContainer.value = "";
            boardDescriptionContainer.value = "";
            innerDescriptionContainer.value = "";
        });
    });
}

// Delete board
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-board-button')) {
        // Warn the user before deleting
        if (!confirm('Are you sure you want to delete this board?')) {
            return;
        }

        // Retrieve the board ID from the data-id attribute
        const boardId = event.target.dataset.id;

        // Send an AJAX request to delete the board
        fetch('/admin/board', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: boardId })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then(() => {
            alert('Board deleted successfully!');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting board:', error);
            alert(error.message);
        });
    }
});
