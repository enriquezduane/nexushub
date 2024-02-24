// modal functions

// modal for login
const modal = document.querySelector('.modal');
const openModalButton = document.querySelector('#login');
const closeModalButton = document.querySelector('.close-btn');
const signUpButton = document.querySelector('#sign-up');

if (openModalButton) {
    openModalButton.addEventListener('click', function() {
        modal.classList.add('show');
    });
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', function() {
        modal.classList.remove('show');
    });
}

if (signUpButton) {
    signUpButton.addEventListener('click', function() {
        modal.classList.remove('show');
        modal2.classList.add('show');
    });
}

// Close modal on window click
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});

// registration agreement modal
const modal2 = document.querySelector('.modal2');
const openModalButton2 = document.querySelector('#register');

if (openModalButton2) {
    openModalButton2.addEventListener('click', function() {
        modal2.classList.add('show');
    });
}

// Close modal2 on window click
window.addEventListener('click', function(event) {
    if (event.target === modal2) {
        modal2.classList.remove('show');
    }
});

// registration form modal
const modal3 = document.querySelector('.modal3');
const agreeButton = document.querySelector('.agree-button');

if (agreeButton) {
    agreeButton.addEventListener('click', function() {
    modal3.classList.add('show');
    modal2.classList.remove('show');
    });
}

window.addEventListener('click', function(event) {
    if (event.target === modal3) {
        modal3.classList.remove('show');
    }
});

// search bar modal
const modal4 = document.querySelector('.modal4');
const openModalButton3 = document.querySelector('#search');
const searchButton = document.querySelector('.search-button');

openModalButton3.addEventListener('click', function() {
    modal4.classList.add('show');
});

window.addEventListener('click', function(event) {
    if (event.target === modal4) {
        modal4.classList.remove('show');
    }
});

searchButton.addEventListener('click', function() {
    modal4.classList.remove('show');
});