document.addEventListener('click', function(event) {
    if (event.target.classList.contains('unban-user-button')) {
        if (!confirm('Are you sure you want to unban this user?')) {
            return;
        }

        const userId = event.target.dataset.id;

        fetch('/admin/banned', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
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
            alert('User unbanned successfully!');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error unbanning user:', error);
            alert(error.message);
        });
    }
    if (event.target.classList.contains('delete-banned-user-button')) {
        // Warn the user before deleting
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        // Retrieve the user ID from the data-id attribute
        const userId = event.target.dataset.id;

        // Send an AJAX request to delete the user
        fetch('/admin/banned', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
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
            alert('User deleted successfully!');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert(error.message);
        });
    }
});
