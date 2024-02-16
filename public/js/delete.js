// Add event listener for delete button
document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('delete-button')) {
        // Get the closest post or reply container
        const postContainer = clickedElement.closest('.post-section');

        // Determine if the container is a post or a reply
        const isReply = postContainer.classList.contains('reply-section');

        // Prompt the user for confirmation
        const confirmed = window.confirm('Are you sure you want to delete this ' + (isReply ? 'reply' : 'post') + '?');
        if (!confirmed) {
            return; // If the user cancels, do nothing
        }

        const postTitle = postContainer.querySelector('.post-name').textContent.trim();

        // Send a delete request to the server
        fetch(`/post/${postTitle}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: (isReply ? 'reply' : 'post'), title: postTitle }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete ' + (isReply ? 'reply' : 'post'));
            }
            return response.json();
        })
        .then(data => {
            // Display a success message
            alert('Deleted ' + (isReply ? 'reply' : 'post') + ' successfully');

            // Remove the post container from the DOM
            postContainer.classList.add('fade-out');
            setTimeout(() => {
                postContainer.remove();

                if (!isReply) {
                    window.location.href = '/';
                }
            }, 300); // Adjust this value to match the transition duration in CSS
        })
        .catch(error => {
            console.error('Error deleting ' + (isReply ? 'reply' : 'post') + ':', error);
            alert('An error occurred while deleting the ' + (isReply ? 'reply' : 'post') + '. Please try again later.');
        });
    }
});