const modal6 = document.getElementById('createBoardModal');
const openBoardModalBtn = document.getElementById("openBoardModalBtn");
const closeBoardModalBtn = document.getElementById("closeBoardModalBtn");
const createBoardForm = document.getElementById("createBoardForm");

if (openBoardModalBtn) {
    openBoardModalBtn.addEventListener('click', () => {
        modal6.classList.add('show');
    });
}

if (closeBoardModalBtn) {
    closeBoardModalBtn.addEventListener('click', () => {
        modal6.classList.remove('show');
    });
}

if (modal6) {
    window.addEventListener('click', (event) => {
        if (event.target === modal6) {
            modal6.classList.remove('show');
        }
    });
}

if (createBoardForm) {
    createBoardForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const boardTitleContainer = document.getElementById("boardTitle");
        const boardDescriptionContainer = document.getElementById("boardDescription");
        const innerDescriptionContainer = document.getElementById("innerDescription");
        const categoryContainer = document.getElementById("category");

        const boardTitle = boardTitleContainer.value;
        const boardDescription = boardDescriptionContainer.value;
        const innerDescription = innerDescriptionContainer.value;
        const category = categoryContainer.value;

        fetch('/admin/board', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: boardTitle,
                description: boardDescription,
                innerDescription: innerDescription,
                category: category
            })
        })
        .then(response => {
            if (!response.ok) {
                response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then(() => {
            // alert the user
            alert('Board created successfully!');

            // refresh the page 
            window.location.href = '/admin?action=boards'; 
        })
        .catch(error => {
            console.error('Error creating board:', error);
            alert(error.message);
        })
        .finally(() => {
            // Reset form fields and hide modal
            modal6.classList.remove('show');
            boardTitleContainer.value = "";
            boardDescriptionContainer.value = "";
            innerDescriptionContainer.value = "";
            categoryContainer.value = ""; 
        });
    });
}
