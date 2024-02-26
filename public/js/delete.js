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

        // Get the id of the post or reply
        const id = postContainer.dataset.id;

        // Send a delete request to the server
        fetch('delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: (isReply ? 'reply' : 'post'), id: id }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then(data => {
            // Display a success message
            alert(data.message);

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
            console.error('Error:', error);
            alert(error.message);
        });
    }
});