document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.edit-profile-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const profileForm = document.querySelector('.edit-profile-form');
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
                    age: age,
                    description: description,
                    newPassword: newPassword
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // alert user that profile has been updated
            alert('Profile updated successfully');

            // redirect to user profile page
            window.location.href = `/user/${userId}`; 
        } catch (error) {
            console.error('Error:', error.message);
            alert('Failed to update profile');
        }
    });
});