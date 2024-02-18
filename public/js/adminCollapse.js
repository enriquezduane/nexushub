document.addEventListener('click', function(event) {
    // Check if the clicked element is a collapse button
    if (event.target.classList.contains('collapse-button')) {
        // Toggle the 'active' class on the clicked collapse button
        event.target.classList.toggle('active');

        // Get the next sibling of the parent of the clicked collapse button
        const boardList = event.target.parentElement.nextElementSibling.querySelectorAll('.board-list');
        
        // Toggle the display style of the nested list
        boardList.forEach( (board) => {
            board.style.display = (board.style.display === 'none') ? 'block' : 'none';
        });
    }
});
