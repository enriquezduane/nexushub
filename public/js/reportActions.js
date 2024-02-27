



document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-report-button')) {
        // warning
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        // Retrieve the category ID from the data-id attribute
        const reportId = event.target.dataset.id;

        // Send an AJAX request to delete the category
        fetch('/admin/report', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: reportId })
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
            alert('Report deleted successfully!');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting Report:', error);
            alert(error.message);
        });
    }
});
