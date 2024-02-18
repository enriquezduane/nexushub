const modal9 = document.getElementById('createReplyModal');
const openReplyModalBtn = document.getElementById("openReplyModalBtn");
const closeReplyModalBtn = document.getElementById("closeReplyModalBtn");
const createReplyForm = document.getElementById("createReplyForm");

if (openReplyModalBtn) {
    openReplyModalBtn.addEventListener('click', () => {
        modal9.classList.add('show');
    });
}

if (closeReplyModalBtn) {
    closeReplyModalBtn.addEventListener('click', () => {
        modal9.classList.remove('show');
    });
}

if (modal9) {
    window.addEventListener('click', (event) => {
        if (event.target === modal9) {
            modal9.classList.remove('show');
        }
    });
}

if (createReplyForm) {
    createReplyForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const refPostContainer = document.getElementById("refPost");
        const replyPosterContainer = document.getElementById("replyPoster");
        const replyContentContainer = document.getElementById("replyContent");

        const refPost = refPostContainer.value;
        const replyPoster = replyPosterContainer.value;
        const replyContent = replyContentContainer.value;

        fetch('/admin/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refPost: refPost,
                poster: replyPoster,
                reply: replyContent
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create reply');
            }
            return response.json();
        })
        .then(() => {
            // alert the user
            alert('Reply created successfully!');

            // refresh the page 
            window.location.href = '/admin?action=replies'; 
        })
        .catch(error => {
            console.error('Error creating reply:', error);
            alert('Reply creation failed. Please try again!');
        })
        .finally(() => {
            // Reset form fields and hide modal
            modal9.classList.remove('show');
            replyTitleContainer.value = "";
            refPostContainer.value = "";
            replyPosterContainer.value = "";
            replyContentContainer.value = ""; 
        });
    });
}
