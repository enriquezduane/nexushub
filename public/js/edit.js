const Delta = Quill.import('delta');

function initializeQuill(className) {
    const quill = new Quill(className, {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'font': [] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'header': '1'}, { 'header': '2' }, 'blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                ['direction', { 'align': [] }],
                ['link', 'image', 'video', 'formula'],
                ['clean']
            ]
        },
        placeholder: 'Write your reply here...',
        readOnly: false,
    });

    function updateQuillHeight() {
        let editor = document.querySelector('.ql-editor');
        let postContent = document.querySelector('.post-content'); 

        // Temporarily show the postContent element to get its height
        let originalDisplay = postContent.style.display;
        postContent.style.display = 'block';

        let postContentOffsetHeight = postContent.offsetHeight;

        // Restore the original display value of the postContent element
        postContent.style.display = originalDisplay;

        editor.style.height = postContentOffsetHeight + 'px';

        if (editor.scrollHeight <= postContentOffsetHeight) { // Adjust the value to match max-height
            editor.style.height = 'auto';
            editor.style.height = editor.scrollHeight + 'px';
        } else {
            editor.style.height = postContentOffsetHeight; // Set max-height
        }
    }

    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        // Loop through all the ops in the delta
        delta.ops.forEach(op => {
            // If the op has an insert property and it's an object
            if (op.insert && typeof op.insert === 'object') {
                // If the insert object has a background property, delete it
                if (op.insert.background) {
                    delete op.insert.background;
                }
            }
            // If the op has attributes
            if (op.attributes) {
                // If the attributes object has a background property, delete it
                if (op.attributes.background) {
                    delete op.attributes.background;
                }
            }
        });
        
        return delta;
    });

    quill.clipboard.addMatcher('IMG', function(node, delta) {
        return new Delta().insert({
            image: node.src
        });
    });

    function addPasteEventListener(quillInstance) {
        const quillContainer = quillInstance.container.querySelector('.ql-editor');

        quillContainer.addEventListener('paste', function() {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
            setTimeout(function() {
                window.scrollTo(0, scrollPosition);
            }, 1);
        });

        // Handle pasted images
        quillContainer.addEventListener('paste', function(event) {
            const clipboardData = (event.clipboardData || window.clipboardData);
            const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
            const tempElement = document.createElement('div');
            tempElement.innerHTML = pastedData;
    
            // Check if the pasted content contains images
            const images = tempElement.querySelectorAll('img');
            if (images.length > 0) {
                // Prevent default paste behavior to handle pasted images separately
                event.preventDefault();
    
                // Process each image individually
                images.forEach(image => {
                    // Create a new image element and set its src attribute
                    const newImage = document.createElement('img');
                    console.log('Image src: ' + image.src)
                    newImage.src = image.src;
    
                    // Insert the new image into the editor at the current selection point
                    quillInstance.clipboard.dangerouslyPasteHTML(quillInstance.getSelection(true).index, newImage.outerHTML);
                });
            }
        });
    }

    // Update Quill container height when content changes
    quill.on('text-change', updateQuillHeight);

    // Initially set Quill container height
    updateQuillHeight();
    addPasteEventListener(quill);
    
    return quill;
}

document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('edit-button')) {
        const postArea = clickedElement.closest('.post-area');
        const postContent = postArea.querySelector('.post-content');

        // Check if a Quill editor already exists
        let quillEditor = postArea.querySelector('.quill-editor');
        
        if (!quillEditor) {
            // Create a new div for the Quill editor if it doesn't exist
            quillEditor = document.createElement('div');
            quillEditor.className = 'quill-editor';

            // Hide original post content
            postContent.style.display = 'none';

            // Insert Quill editor before the post content
            postArea.insertBefore(quillEditor, postContent);

            // Initialize Quill on the new divs
            const editQuill = initializeQuill('.quill-editor');

            let quillToolbar = document.querySelector('.ql-toolbar');

            setDimensions(quillEditor, postContent);
            setDimensions(quillToolbar, postContent);

            quillToolbar.style.marginTop = '20px';

            editQuill.clipboard.dangerouslyPasteHTML(0, postContent.innerHTML);
            // Trigger paste event
            const pasteEvent = new Event('paste', {
                bubbles: true,
                cancelable: true,
            });
            quillEditor.dispatchEvent(pasteEvent);

            // Create save button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.className = 'save-button';

            // Create cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.className = 'cancel-button';

            // Create buttons div to contain save and cancel buttons
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'edit-buttons';
            buttonsDiv.appendChild(saveButton);
            buttonsDiv.appendChild(cancelButton);

            // Insert buttons below the Quill editor
            postArea.insertBefore(buttonsDiv, quillEditor.nextSibling);

            // Event listener for the save button
            saveButton.addEventListener('click', async () => {
                // Get the closest post or reply container
                const postContainer = clickedElement.closest('.post-section');

                // Get the edited container
                const editedContainer = postContainer.querySelector('.post-edited');

                // Get the updated content
                const updatedContent = editQuill.root.innerHTML;

                // Determine if the container is a post or a reply
                const isReply = postContainer.classList.contains('reply-section');

                // Get the id of the post or reply
                const id = postContainer.dataset.id;
                
                try {
                    const response = await fetch('edit', {
                        method: 'PATCH', // or 'PUT' depending on backend API
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ type: (isReply ? 'reply' : 'post'), content: updatedContent, id: id})
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update post');
                    }

                    postContent.style.display = ''; // Show original post content
            
                    // Remove the Quill editor container from the DOM
                    quillEditor.parentNode.removeChild(quillEditor);
                
                    // Remove the Quill toolbar from the DOM
                    quillToolbar = document.querySelector('.ql-toolbar');
                    quillToolbar.parentNode.removeChild(quillToolbar);
                
                    buttonsDiv.remove();

                    postContent.innerHTML = updatedContent;

                    alert(isReply ? 'Reply updated successfully' : 'Post updated successfully')

                    // Update the edited container
                    const responseData = await response.json(); // Parse JSON response
                    editedContainer.textContent = `Last Edit: ${responseData.updatedAt}`;
                    
                } catch (error) {
                    console.error('Error:', error.message);
                }
            });

            // Event listener for the cancel button
            cancelButton.addEventListener('click', () => {
                postContent.style.display = ''; // Show original post content
            
                // Remove the Quill editor container from the DOM
                quillEditor.parentNode.removeChild(quillEditor);
            
                // Remove the Quill toolbar from the DOM
                quillToolbar = document.querySelector('.ql-toolbar');
                quillToolbar.parentNode.removeChild(quillToolbar);
            
                buttonsDiv.remove();
            });
        } else {
            // Focus on the existing Quill editor
            quillEditor.focus();
        }
    }
});

function setDimensions(target, source) {
    const styles = ['fontSize', 'fontFamily', 'lineHeight', 'width', 'height'];
    const computedStyle = getComputedStyle(source);

    styles.forEach(style => {
        target.style[style] = computedStyle[style];
    });
}

