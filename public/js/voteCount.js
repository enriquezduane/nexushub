// Function to handle upvote button click
function handleUpvote(event) {
    const voteCount = event.target.nextElementSibling;
    const downvoteButton = event.target.nextElementSibling.nextElementSibling;
    let currentCount = parseInt(voteCount.textContent);
    let downvoted = downvoteButton.classList.contains('active');

    // If the upvote button is not active and the downvote button is not active, increase the count by 1 and mark upvote as active
    if (!event.target.classList.contains('active') && !downvoted) {
        currentCount++;
        event.target.classList.add('active');
    } else if (event.target.classList.contains('active')) {
        // If the upvote button is active, decrease the count by 1 and remove the active state
        currentCount--;
        event.target.classList.remove('active');
    } else if (downvoted) {
        // If the upvote button is not active but the downvote button is active, increase the count by 2 and mark upvote as active
        currentCount += 2;
        event.target.classList.add('active');
        downvoteButton.classList.remove('active');
    }
    
    voteCount.textContent = currentCount;
}

// Function to handle downvote button click
function handleDownvote(event) {
    const voteCount = event.target.previousElementSibling;
    const upvoteButton = event.target.previousElementSibling.previousElementSibling;
    let currentCount = parseInt(voteCount.textContent);
    let upvoted = upvoteButton.classList.contains('active');

    // If the downvote button is not active and the upvote button is not active, decrease the count by 1 and mark downvote as active
    if (!event.target.classList.contains('active') && !upvoted) {
        currentCount--;
        event.target.classList.add('active');
    } else if (event.target.classList.contains('active')) {
        // If the downvote button is active, increase the count by 1 and remove the active state
        currentCount++;
        event.target.classList.remove('active');
    } else if (upvoted) {
        // If the downvote button is not active but the upvote button is active, decrease the count by 2 and mark downvote as active
        currentCount -= 2;
        event.target.classList.add('active');
        upvoteButton.classList.remove('active');
    }
    
    voteCount.textContent = currentCount;
}

// Event listener for upvote and downvote buttons
document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('upvote-btn')) {
        handleUpvote(event);
    } else if (clickedElement.classList.contains('downvote-btn')) {
        handleDownvote(event);
    }
});
