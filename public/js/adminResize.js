const textareas = document.querySelectorAll('textarea');
const editPostContent = document.getElementById('editPostContent');
const editReplyContent = document.getElementById('editReplyContent');

textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});