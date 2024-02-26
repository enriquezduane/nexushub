// resize textarea to fit content dynamically
var textarea = document.querySelector('.create-post-textarea');

// create post
document.querySelector('.create-post-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    // get form data
    const title = document.querySelector('#post-subject').value;
    const content = createPostQuill.getContents();
    const boardId = window.location.pathname.split('/')[2];

    const isEmptyContent = content.ops.every(op => {
      // Check if op.insert is a string before attempting to trim
      if (typeof op.insert === 'string') {
          // Remove leading and trailing whitespace from the insert
          const trimmedInsert = op.insert.trim();
          // Check if the trimmed insert is only newline characters
          return trimmedInsert === '\n' || trimmedInsert === '';
      }
    });

    if (isEmptyContent) {
        alert('Post content cannot be empty');
        return;
    }

    if (title === '') {
        alert('Post title cannot be empty');
        return;
    }
  
    try {
      const response = await fetch('/forum/:id/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, boardId })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Post created successfully! Redirecting to post...');
        window.location.href = `/forum/${boardId}/${data.id}`;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
});