const closeResolveReportModalBtn = document.getElementById('closeResolveBtn');

if (closeResolveReportModalBtn) {
    closeResolveReportModalBtn.addEventListener('click', () => {
        const modal16 = document.querySelector('.modal16');
        modal16.classList.remove('show');
    });
}

window.addEventListener('click', (event) => {
    const modal16 = document.querySelector('.modal16');
    if (event.target === modal16) {
        modal16.classList.remove('show');
    }
});

document.getElementById('resolveButton').addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Call the handleFormSubmission function with the 'resolve' parameter
    handleFormSubmission('Resolved');
});

document.getElementById('dismissButton').addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Call the handleFormSubmission function with the 'dismiss' parameter
    handleFormSubmission('Dismissed');
});

async function handleFormSubmission(action) {
    const banUser = document.getElementById('banUser').checked;
    const reportId = document.querySelector('.modal16').dataset.id;
    const posterId = document.querySelector('.modal16').dataset.posterId;

    try {
        const response = await fetch('/admin/report', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: reportId, action: action, banUser: banUser, posterId: posterId })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }

        alert('Report handled successfully!');
        window.location.reload();
    } catch (err) {
        console.error('Error resolving report:', err);
        alert(err.message);
    }
}

document.addEventListener('click', function(event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('resolve-report-button')) {
        // Retrieve the data from the button
        const reporter = clickedElement.dataset.reporter;
        const reportedItem = clickedElement.dataset.reporteditem;
        const reportedItemPoster = clickedElement.dataset.reporteditemposter;
        const itemType = clickedElement.dataset.itemtype;
        const reason = clickedElement.dataset.reason;
        const description = clickedElement.dataset.description;
        const reportedAt = clickedElement.dataset.reportedat;

        // Populate the modal with the retrieved data
        document.getElementById('reporter').textContent = reporter;
        document.getElementById('reportedItem').textContent = reportedItem;
        document.getElementById('reportedItemPoster').textContent = reportedItemPoster;
        document.getElementById('itemType').textContent = itemType;
        document.getElementById('reason').textContent = reason;
        document.getElementById('description').textContent = description;
        document.getElementById('reportedAt').textContent = reportedAt;

        // Show the modal
        const modal16 = document.querySelector('.modal16');
        modal16.dataset.id = clickedElement.dataset.id;
        modal16.dataset.posterId = clickedElement.dataset.posterid;
        modal16.classList.add('show');
    }

    if (clickedElement.classList.contains('delete-report-button')) {
        // warning
        if (!confirm('Are you sure you want to delete this report?')) {
            return;
        }

        // Retrieve the category ID from the data-id attribute
        const reportId = clickedElement.dataset.id;

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
