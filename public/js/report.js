let isReply = false;
let id = null;

document.addEventListener('click', async (e) => {
    const clickedElement = e.target;
    const reportModal = document.querySelector('.modal15');

    if (clickedElement.classList.contains('report-button') || clickedElement.parentElement.classList.contains('report-button') 
    || clickedElement.parentElement.parentElement.classList.contains('report-button')) {

        const container = clickedElement.parentElement.parentElement.parentElement;

        isReply = container.classList.contains('reply-section');
        id = container.dataset.id;

        reportModal.classList.add('show');
    }
})

const closeReportBtn = document.getElementById('closeReportBtn');

if (closeReportBtn) {
    closeReportBtn.addEventListener('click', () => {
        const reportModal = document.querySelector('.modal15');
        reportModal.classList.remove('show');
    });
}

window.addEventListener('click', (e) => {
    const reportModal = document.querySelector('.modal15');

    if (e.target === reportModal) {
        reportModal.classList.remove('show');
    }
})

const reportTextArea = document.querySelector('#description');

if (reportTextArea) {
    reportTextArea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

const reportForm = document.querySelector('#report-form');

if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(reportForm);

        const reason = formData.get('reason');
        const description = formData.get('description');

        if (reason === '') {
            alert('Please select a reason for reporting.');
            return;
        }

        try {
            const response = await fetch('/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type: (isReply ? 'Reply' : 'Post'), id, reason, description })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            alert('Report submitted successfully!');

            const reportModal = document.querySelector('.modal15');
            reportModal.classList.remove('show');
            reportForm.reset();

        } catch (err) {
            console.error(err.message);
            alert(err.message);
        }
    });
}