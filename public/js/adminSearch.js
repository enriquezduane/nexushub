const searchForms = document.querySelectorAll('.search-admin-form');

searchForms.forEach(function(searchForm) {
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const action = searchForm.querySelector('input[name="action"]').value;
        const searchText = searchForm.querySelector('.search-input').value.trim();

        fetch(`/admin?action=${action}&search=${encodeURIComponent(searchText)}`)
            .then(response => response.text())
            .then(html => {
                // Update the content of the page with the filtered data
                const contentHeader = searchForm.closest('.content-header');
                if (contentHeader) {
                    contentHeader.innerHTML = html;
                } else {
                    // Fallback: Reload the entire page with the new query parameters
                    window.location.href = `/admin?action=${action}&search=${encodeURIComponent(searchText)}`;
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    });
});