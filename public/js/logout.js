const logoutLink = document.getElementById('logoutLink');

if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();

        fetch('/logout', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/'; // Redirect to the homepage after logout
            } else {
                return response.text().then(errorMessage => {
                    throw new Error('Logout failed: ' + errorMessage);
                });
            }
        })
        .catch(error => {
            console.error(error);
            alert('Logout failed.')
        })
        .finally(() => {
            alert('Logout successful!');
        });
    });
}