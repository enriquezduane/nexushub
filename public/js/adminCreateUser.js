const modal7 = document.getElementById('createUserModal');
const openUserModalBtn = document.getElementById("openUserModalBtn");
const closeUserModalBtn = document.getElementById("closeUserModalBtn");
const createUserForm = document.getElementById("createUserForm");

if (openUserModalBtn) {
    openUserModalBtn.addEventListener('click', () => {
        modal7.classList.add('show');
    });
}

if (closeUserModalBtn) {
    closeUserModalBtn.addEventListener('click', () => {
        modal7.classList.remove('show');
    });
}

if (modal7) {
    window.addEventListener('click', (event) => {
        if (event.target === modal7) {
            modal7.classList.remove('show');
        }
    });
}

if (createUserForm) {
    createUserForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const usernameContainer = document.getElementById("username");
        const passwordContainer = document.getElementById("password");
        const emailContainer = document.getElementById("email");
        const roleContainer = document.getElementById("role");
        const descriptionContainer = document.getElementById("description");
        const ageContainer = document.getElementById("age");
        const currentServerContainer = document.getElementById("currentServer");

        const username = usernameContainer.value;
        const password = passwordContainer.value;
        const email = emailContainer.value;
        const role = roleContainer.value;
        const description = descriptionContainer.value;
        const age = ageContainer.value;
        const currentServer = currentServerContainer.value;

        fetch('/admin/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                role: role,
                description: description,
                age: age,
                currentServer: currentServer
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            return response.json();
        })
        .then(() => {
            // alert the user
            alert('User created successfully!');

            // refresh the page 
            window.location.href = '/admin?action=users'; 
        })
        .catch(error => {
            console.error('Error creating user:', error);
            alert('User creation failed. Please try again!');
        })
        .finally(() => {
            // Reset form fields and hide modal
            modal7.classList.remove('show');
            usernameContainer.value = "";
            passwordContainer.value = "";
            emailContainer.value = "";
            roleContainer.value = "";
            descriptionContainer.value = "";
            ageContainer.value = "18";
            currentServerContainer.value = ""; 
        });
    });
}
