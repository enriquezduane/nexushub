// Accordion functions
const accordionButton = document.querySelector('.accordion-button');
const accordionContent = document.querySelector('.info-center-frame');

accordionButton.addEventListener('click', function() {
    this.classList.toggle('active');

    // Check if the accordion is active to determine how to animate
    if (this.classList.contains('active')) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
    } else {
        accordionContent.style.maxHeight = '0';
    }
});