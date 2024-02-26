const loginForm = document.querySelector('#login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        // Get username and password from the form
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Send form data to the server via AJAX
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Redirect to home page or perform any other action for successful login
                alert('Login successful!')
                window.location.reload()
            } else {
                // Throw error with the appropriate message based on the response from the server
                throw new Error(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed! ' + error.message);
        })
        .finally(() => {
            loginForm.reset();
        });
    });
}