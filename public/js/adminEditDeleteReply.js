const editReplyModal = document.getElementById('editReplyModal');
const openEditReplyModalBtns = document.querySelectorAll(".edit-reply-button");
const closeEditReplyModalBtn = document.getElementById("closeEditReplyModalBtn");
const editReplyForm = document.getElementById("editReplyForm");
let replyId = null;

if (openEditReplyModalBtns) {
    openEditReplyModalBtns.forEach(button => {
        button.addEventListener('click', function() {
            // Retrieve reply data from data attributes
            const content = this.dataset.content;
            replyId = this.dataset.id;

            // Fill the edit reply modal form with reply data
            const editReplyForm = document.querySelector('#editReplyForm');
            const editReplyContentInput = editReplyForm.querySelector('#editReplyContent');

            // Set the form values
            editReplyContentInput.value = content;

            // Show the edit reply modal
            editReplyModal.classList.add('show');
        });
    });
}

if (closeEditReplyModalBtn) {
    closeEditReplyModalBtn.addEventListener('click', () => {
        editReplyModal.classList.remove('show');
    });
}

if (editReplyModal) {
    window.addEventListener('click', (event) => {
        if (event.target === editReplyModal) {
            editReplyModal.classList.remove('show');
        }
    });
}

if (editReplyForm) {
    editReplyForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const replyContent = document.getElementById("editReplyContent").value;

        fetch('/admin/reply', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: replyId, 
                content: replyContent 
            })
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
            alert('Reply updated successfully!');
            window.location.reload(); 
        })
        .catch(error => {
            console.error('Error updating reply:', error);
            alert(error.message);
        })
        .finally(() => {
            editReplyModal.classList.remove('show');
        });
    });
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-reply-button')) {
        // Warn the user before deleting
        if (!confirm('Are you sure you want to delete this reply?')) {
            return;
        }

        // Retrieve the post ID from the data-id attribute
        const postId = event.target.dataset.id;

        // Send an AJAX request to delete the post
        fetch('/admin/reply', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: postId })
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
            alert('Post deleted successfully!');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting reply:', error);
            alert(error.message);
        });
    }
});
