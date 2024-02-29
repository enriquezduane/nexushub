const profilePictureInput = document.getElementById('profilePictureInput');
const cancelUpdate = document.getElementById('cancelUpdate');
const updatePictureForm = document.getElementById('updatePictureForm');
const confirmButton = document.querySelector('.update-button');

let originalImage = document.getElementById('profileImage').src;

if (profilePictureInput) {
    profilePictureInput.addEventListener('change', (e) => {
        const input = e.target;
        const reader = new FileReader();
    
        reader.onload = function() {
          const profileImage = document.getElementById('profileImage');
          profileImage.src = reader.result;

          cancelUpdate.style.display = 'block';
          confirmButton.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    })
}

if (cancelUpdate) {
    cancelUpdate.addEventListener('click', function() {
        const profileImage = document.getElementById('profileImage');
        profileImage.src = originalImage; // placeholder

        updatePictureForm.reset();
        this.style.display = 'none';
        confirmButton.style.display = 'none';
    })
}

if (updatePictureForm) {
    updatePictureForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form submission
    
        // Construct FormData object with form data
        const file = profilePictureInput.files[0];

        if (!file) {
            alert('No file selected!');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert('Successfully Updated Profile Picture!');
            window.location.reload();
        } catch (error) {
            console.error('Error Updating Profile Picture: ', error);
            alert(error.message);
        }
    });
}