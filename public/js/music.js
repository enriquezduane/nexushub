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