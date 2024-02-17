document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('replyForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Collect reply content and post ID
        const content = document.querySelector('#reply-box').value.trim(); // Trim whitespace
        const postId = document.querySelector('input[name="postId"]').value;

        // Check if reply content is not empty
        if (content) {
            // Send AJAX request to add the reply
            fetch('/post/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content, postId: postId })
            })
            .then(response => response.json())
            .then( reply => {
                // On successful response, update the page with the new reply
                const replyContainer = document.querySelector('.content-container');
                const newReplySection = document.createElement('div');
                const repliesSectionFooter = document.querySelector('.reply-section-top');
                const replyBox = document.querySelector('#reply-box');

                newReplySection.classList.add('reply-section', 'post-section', 'post-container-template');
                newReplySection.dataset.id = reply.id;
                newReplySection.innerHTML = `
                        <div class="poster-info">
                            <div class="poster-name">
                                <strong><a href="/user/${reply.userId}">${reply.username}</a></strong>
                            </div>
                            <div class="poster-role ${reply.roleClass}">
                                ${reply.role}
                            </div>
                            <div class="poster-icon">
                                <img src="images/jejeling.gif" alt="jejeling">
                            </div>
                            <div class="poster-join-date">
                                Join Date: ${reply.joinDate}
                            </div>
                            <div class="poster-posts">
                                Posts: ${reply.postCount}
                            </div>
                        </div>
                        <div class="post-area">
                            <div class="post-info">
                                <div class="post-info-top">
                                    <div class="post-name">
                                    <a href="/post/${reply.title.toLowerCase()}"><strong>${reply.title}</strong></a>
                                    </div>
                                    <div class="vote-container">
                                        <button class="upvote-btn">Upvote</button>
                                        <p class="vote-count">0</p>
                                        <button class="downvote-btn">Downvote</button>
                                    </div>
                                </div>
                                <div class="post-info-bottom">
                                    <div class="post-date">
                                        ${reply.date}
                                    </div>
                                    <div class="post-edited">
                                    ${reply.edited ? `Last Edit: ${reply.updatedAtSGT}` : ''}
                                    </div>
                                </div>
                            </div>
                            <p class="post-content">
                                ${reply.reply}
                            </p>
                            <div class="post-content-footer">
                                <button class="edit-button">Edit</button>
                                <button class="delete-button">Delete</button>
                            </div>
                        </div>
                `;

                replyBox.value = '';
                replyContainer.insertBefore(newReplySection, repliesSectionFooter);

                alert('Reply added successfully!');
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
