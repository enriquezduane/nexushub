const editPostModal = document.getElementById('editPostModal');
const openEditPostModalBtns = document.querySelectorAll(".edit-post-button");
const closeEditPostModalBtn = document.getElementById("closeEditPostModalBtn");
const editPostForm = document.getElementById("editPostForm");
let postId = null;

if (openEditPostModalBtns) {
    openEditPostModalBtns.forEach(button => {
        button.addEventListener('click', function() {
            // Retrieve post data from data attributes
            const title = this.dataset.title;
            const content = this.dataset.content;
            // Add more data attribute retrievals if needed

            postId = this.dataset.id;

            // Fill the edit post modal form with post data
            const editPostForm = document.querySelector('#editPostForm');
            const editPostTitleInput = editPostForm.querySelector('#editPostTitle');
            const editPostContentInput = editPostForm.querySelector('#editPostContent');
            // Add more form element selections if needed

            // Set the form values
            editPostTitleInput.value = title;
            editPostContentInput.value = content;
            // Set more form values if needed

            // Show the edit post modal
            editPostModal.classList.add('show');
        });
    });
}

if (closeEditPostModalBtn) {
    closeEditPostModalBtn.addEventListener('click', () => {
        editPostModal.classList.remove('show');
    });
}

if (editPostModal) {
    window.addEventListener('click', (event) => {
        if (event.target === editPostModal) {
            editPostModal.classList.remove('show');
        }
    });
}

if (editPostForm) {
    editPostForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const postTitle = document.getElementById("editPostTitle").value;
        const postContent = document.getElementById("editPostContent").value;

        fetch('/admin/post', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: postId, 
                title: postTitle, 
                content: postContent 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            return response.json();
        })
        .then(() => {
            alert('Post updated successfully!');
            window.location.reload(); 
        })
        .catch(error => {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again.');
        })
        .finally(() => {
            editPostModal.classList.remove('show');
        });
    });
}

// Delete post
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-post-button')) {
        // Warn the user before deleting
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        // Retrieve the post ID from the data-id attribute
        const postId = event.target.dataset.id;

        // Send an AJAX request to delete the post
        fetch('/admin/post', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: postId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            // Reload the page or update the UI as needed
            window.location.reload(); // For example, reload the page to reflect the changes
        })
        .then(() => {
            alert('Post deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting post:', error);
            // Handle the error (e.g., display an error message to the user)
            alert('Failed to delete post. Please try again.');
        });
    }
});
