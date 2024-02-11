// modal functions

// modal for login
const modal = document.querySelector('.modal');
const openModalButton = document.querySelector('#login');
const closeModalButton = document.querySelector('.close-btn');

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

// Close modal on window click
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});

// registration agreement modal
const modal2 = document.querySelector('.modal2');
const openModalButton2 = document.querySelector('#register');

openModalButton2.addEventListener('click', function() {
    modal2.classList.add('show');
});

// Close modal2 on window click
window.addEventListener('click', function(event) {
    if (event.target === modal2) {
        modal2.classList.remove('show');
    }
});

// registration form modal
const modal3 = document.querySelector('.modal3');
const agreeButton = document.querySelector('.agree-button');

agreeButton.addEventListener('click', function() {
   modal3.classList.add('show');
   modal2.classList.remove('show');
});

window.addEventListener('click', function(event) {
    if (event.target === modal3) {
        modal3.classList.remove('show');
    }
});

// registration form submit
const registerButton = document.querySelector('#register-button');

registerButton.addEventListener('click', function() {
    alert("You have successfully registered!");
    modal3.classList.remove('show');
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


// music functions
const soundButton = document.querySelector('.music-button');
const soundEffect = document.querySelector('.sound-effect');
let isPlaying = false;

soundEffect.volume = 0.4;

soundButton.addEventListener('click', function () {
    if (!isPlaying) {
        // Play the sound
        soundEffect.play();
        soundButton.textContent = 'Stop Sound';
    } else {
        // Stop the sound
        soundEffect.pause();
        soundEffect.currentTime = 0; // Reset the playback to the beginning
        soundButton.textContent = 'Play Sound';
    }

    // Toggle the state
    isPlaying = !isPlaying;
});