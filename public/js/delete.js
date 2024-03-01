// Add event listener for delete button
document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('delete-button')) {
        // Get the closest post or reply container
        const postContainer = clickedElement.closest('.post-section');

        const hiddenInput = document.querySelector('input[name="postId"]');
        let lastLimitReached = hiddenInput.dataset.lastlimitreached;
        const page = hiddenInput.dataset.page;
        const totalPages = hiddenInput.dataset.totalpages;
        let pageItems = hiddenInput.dataset.pageitems;

        // Determine if the container is a post or a reply
        const isReply = postContainer.classList.contains('reply-section');

        if (isReply) {
            index = postContainer.dataset.index;
        }

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

            pageItems = parseInt(pageItems) - 1;
            hiddenInput.dataset.pageitems = pageItems;

            lastLimitReached = "false";
            hiddenInput.dataset.lastlimitreached = lastLimitReached;

            // Remove the post container from the DOM
            postContainer.classList.add('fade-out');
            setTimeout(() => {
                postContainer.remove();

                const prevPage = parseInt(totalPages) - 1;
                pageItems = parseInt(pageItems);
                
                if (!isReply) {
                    window.location.href = '/';
                    return;
                }

                if (pageItems === 0) {
                    window.location.href = window.location.pathname + '?page=' + prevPage;
                    return;
                }

                if (page !== totalPages) {
                    window.location.reload();
                    return;
                }

            }, 200); // Adjust this value to match the transition duration in CSS
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    }
});