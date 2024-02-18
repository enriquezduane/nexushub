const modal8 = document.getElementById('createPostModal');
const openPostModalBtn = document.getElementById("openPostModalBtn");
const closePostModalBtn = document.getElementById("closePostModalBtn");
const createPostForm = document.getElementById("createPostForm");

if (openPostModalBtn) {
    openPostModalBtn.addEventListener('click', () => {
        modal8.classList.add('show');
    });
}

if (closePostModalBtn) {
    closePostModalBtn.addEventListener('click', () => {
        modal8.classList.remove('show');
    });
}

if (modal8) {
    window.addEventListener('click', (event) => {
        if (event.target === modal8) {
            modal8.classList.remove('show');
        }
    });
}

if (createPostForm) {
    createPostForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const postTitleContainer = document.getElementById("postTitle");
        const refBoardContainer = document.getElementById("refBoard");
        const posterContainer = document.getElementById("poster");
        const contentContainer = document.getElementById("content");

        const postTitle = postTitleContainer.value;
        const refBoard = refBoardContainer.value;
        const poster = posterContainer.value;
        const content = contentContainer.value;

        fetch('/admin/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: postTitle,
                refBoard: refBoard,
                poster: poster,
                content: content
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            return response.json();
        })
        .then(() => {
            // alert the user
            alert('Post created successfully!');

            // refresh the page 
            window.location.href = '/admin?action=posts'; 
        })
        .catch(error => {
            console.error('Error creating post:', error);
            alert('Post creation failed. Please try again!');
        })
        .finally(() => {
            // Reset form fields and hide modal
            modal8.classList.remove('show');
            postTitleContainer.value = "";
            refBoardContainer.value = "";
            posterContainer.value = "";
            contentContainer.value = ""; 
        });
    });
}
