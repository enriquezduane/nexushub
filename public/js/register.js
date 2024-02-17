// get the registration form element
const registerForm = document.querySelector('.registration-form');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(registerForm); // Get form data
    const registerData = Object.fromEntries(formData.entries()); // Convert FormData to object

    try {
        const response = await fetch('/user/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData) // Convert register data to JSON string
        });

        if (!response.ok) {
            // Check for specific error status codes
            if (response.status === 409) {
                // Username is already taken
                throw new Error('Username is already taken');
            } else {
                // Other registration errors
                throw new Error('Registration failed');
            }
        } 

        alert('Registration successful!'); // Display success message
        registerForm.reset(); // Clear form fields
    } catch (error) {
        if (error.message === 'Username is already taken') {
            alert('Registration failed. Username is already taken!'); // Display specific error message for username already taken
        } else {
            alert('Registration failed. Please try again.'); // Display general error message
        }
    }

    // Redirect to the homepage
    window.location.href = '/';
});