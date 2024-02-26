// get the registration form element
const registerForm = document.querySelector('.registration-form');
if (registerForm) {
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

            const responseData = await response.json(); // Convert response to JSON

            if (!response.ok) {
                throw new Error(responseData.message); // Throw error with server-side message
            }

            alert('Registration successful!'); // Display success message
            registerForm.reset(); // Clear form fields

            window.location.href = '/'; // Redirect to home page
        } catch (error) {
            alert(error.message);
        }
    });
}