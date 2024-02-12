document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('replyForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Collect reply content and post ID
        const content = document.querySelector('#reply-box').value.trim(); // Trim whitespace
        const postId = document.querySelector('input[name="postId"]').value;

        // Check if reply content is not empty
        if (content) {
            // Send AJAX request to add the reply
            fetch('/post/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content, postId: postId })
            })
            .then(response => response.json())
            .then(newReplyData => {
                // On successful response, update the page with the new reply
                const replyContainer = document.querySelector('.content-container');
                const newReplySection = document.createElement('div');
                const repliesSectionFooter = document.querySelector('.reply-section-top');
                const replyBox = document.querySelector('#reply-box');

                newReplySection.classList.add('reply-section', 'post-section', 'post-container-template');

                newReplySection.innerHTML = `
                        <div class="poster-info">
                            <div class="poster-name">
                                <strong><a href="/user/id=${newReplyData.poster.id}">${newReplyData.poster.username}</a></strong>
                            </div>
                            <div class="poster-role ${newReplyData.poster.role.toLowerCase().replace(" ", "-")}">
                                ${newReplyData.poster.role}
                            </div>
                            <div class="poster-icon">
                                <img src="images/jejeling.gif" alt="jejeling">
                            </div>
                            <div class="poster-join-date">
                                Join Date: ${newReplyData.poster.joinDate.replace(/\d{2}, /, '')}
                            </div>
                            <div class="poster-posts">
                                Posts: ${newReplyData.poster.posts}
                            </div>
                        </div>
                        <div class="post-area">
                            <div class="post-info">
                                <div class="post-name">
                                    <a href="/post/${newReplyData.title.toLowerCase()}"><strong>${newReplyData.title}</strong></a>
                                </div>
                                <div class="post-date">
                                    ${newReplyData.date}
                                </div>
                            </div>
                            <p class="post-content" script="">
                                ${newReplyData.reply}
                            </p>
                        </div>
                `;

                replyBox.value = '';
                replyContainer.insertBefore(newReplySection, repliesSectionFooter);
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
        } else {
            // Optionally, you can provide feedback to the user that the reply is empty
            alert('Reply content is empty!');
        }
    });
});
