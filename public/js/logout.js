const logoutLink = document.getElementById('logoutLink');

if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault(); 

        fetch('/logout', {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
        })
        .then(data => {
            alert('Logout successful!');
            window.location.href = '/';
        })
        .catch(error => {
            console.error(error);
            alert('Logout failed.')
        })
    });
}