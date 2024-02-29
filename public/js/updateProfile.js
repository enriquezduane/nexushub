const form = document.querySelector('.edit-profile-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const profileForm = document.querySelector('.edit-profile-form');
    const email = document.getElementById('user-email').value;
    const age = document.getElementById('user-age').value;
    const description = document.getElementById('user-description').value;
    const newPassword = document.getElementById('user-password').value;

    const userId = profileForm.dataset.id;

    try {
        const response = await fetch('/user/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                email: email,
                age: age,
                description: description,
                newPassword: newPassword
            })
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.message);
        }

        // alert user that profile has been updated
        alert('Profile updated successfully!');

        // redirect to user profile page
        window.location.href = `/user/${userId}`; 
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
});
