



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
                throw new Error('Failed to delete report');
            }
            // Reload the page or update the UI as needed
            window.location.reload(); // For example, reload the page to reflect the changes
        })
        .then(() => {
            alert('report deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting report:', error);
            // Handle the error (e.g., display an error message to the user)
            alert('Failed to delete report. Please try again.');
        });
    }
});
