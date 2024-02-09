// Add event listener to the post button inside the reply form
const postButton = document.querySelector('.post-button');
postButton.addEventListener('click', function() {
    const replyContent = document.querySelector('#reply-box').value;
    
    // validate the reply
    if (replyContent.trim() === '') {
        alert('Please enter some text before submitting.');
    } else {
        // fake reload page :)
        simulateReload();

        // Create a new div for the reply
        const replyDiv = document.createElement('div');
        replyDiv.className = 'post-section post-container-template';
        replyDiv.innerHTML = `
        <div class="poster-info">
            <div class="poster-name">
                <strong><a href="#">lokitrickster</a></strong>
            </div>
            <div class="poster-role forum-master">
                Forum Master
            </div>
            <div class="poster-icon">
                <img src="images/jejeling.gif" alt="jejeling">
            </div>
            <div class="poster-join-date">
                Join Date: Jan 2024
            </div>
            <div class="poster-posts">
                Posts: 23
            </div>
        </div>
        <div class="post-area">
            <div class="post-info">
                <div class="post-name">
                    <a href=""><strong>NexusHub Forum Upgraded</strong></a>
                </div>
                <div class="post-date">
                    February 1, 2024, 04:42 AM
                </div>
            </div>
            <p class="post-content">
            ${replyContent}
            </p>
        </div>
        `;

        // Append the reply to the content container
        const contentContainer = document.querySelector('.content-container');
        const contentFooter = document.querySelector('.reply-section-top')
        contentContainer.insertBefore(replyDiv, contentFooter);

        // Clear the reply form and hide it
        document.getElementById('reply-box').value = '';
    }
});

// fake reload page
function simulateReload() {
    // Hide the main content
    const mainContent = document.querySelector('main');
    mainContent.style.display = 'none';

    // Simulate a delay for the fake reload effect
    setTimeout(function () {
        // Show the main content again
        mainContent.style.display = 'block';
    }, 1000); // Adjust the delay duration as needed
}