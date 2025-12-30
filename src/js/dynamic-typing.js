/**
 * Dynamic Rainbow Typewriter
 * 
 * Cycles through words with a custom typewriter effect.
 * Each character is typed individually with a random color from a specific palette.
 * Constraint: No two adjacent characters share the same color.
 */

// Configuration
const WORDS = ["VISIONARY", "PIONEERING", "ASPIRING", "DRIVEN", "AMBITIOUS"];
// Indices for CSS classes .rainbow-color-1 through .rainbow-color-5
const COLOR_INDICES = [1, 2, 3, 4, 5];
const TYPING_SPEED_MIN = 0.05; // seconds
const TYPING_SPEED_MAX = 0.15; // seconds
const BACKSPACE_SPEED = 0.05;  // seconds
const PAUSE_BEFORE_BACKSPACE = 1.5; // seconds
const PAUSE_BEFORE_TYPE = 0.5; // seconds

document.addEventListener('DOMContentLoaded', () => {
    const targetElement = document.querySelector('.highlight-ambitious');
    if (!targetElement) {
        console.error('Rainbow Typewriter: Target .highlight-ambitious not found.');
        return;
    }

    // Clear initial content to start fresh
    targetElement.textContent = '';

    // Start the loop
    typeLoop(targetElement, 0);
});

function typeLoop(element, wordIndex) {
    const currentWord = WORDS[wordIndex % WORDS.length];
    const charArray = currentWord.split('');

    // Master timeline for this word's cycle
    const tl = gsap.timeline({
        onComplete: () => {
            // Proceed to next word
            typeLoop(element, wordIndex + 1);
        }
    });

    // --- TYPING PHASE ---
    let lastIndex = null;

    charArray.forEach((char, i) => {
        // Pick a random color index that isn't the same as the last one
        let availableIndices = COLOR_INDICES;
        if (lastIndex) {
            availableIndices = COLOR_INDICES.filter(idx => idx !== lastIndex);
        }
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        lastIndex = randomIndex;

        // Create the span for this character
        // We can't just append them all at once; we need to animate their appearance.
        // However, to keep it simple and robust, we can use the timeline to call a function that adds the char.

        tl.call(() => {
            const span = document.createElement('span');
            span.textContent = char;
            // Assign the class that maps to the theme variable
            span.className = `rainbow-color-${randomIndex}`;
            element.appendChild(span);
        }, null, `+=${random(TYPING_SPEED_MIN, TYPING_SPEED_MAX)}`);
    });

    // --- PAUSE PHASE ---
    tl.to({}, { duration: PAUSE_BEFORE_BACKSPACE });

    // --- BACKSPACE PHASE ---
    // Remove spans one by one from the end
    charArray.forEach((_, i) => {
        tl.call(() => {
            if (element.lastChild) {
                element.removeChild(element.lastChild);
            }
        }, null, `+=${BACKSPACE_SPEED}`);
    });

    // --- PAUSE BEFORE NEXT WORD ---
    tl.to({}, { duration: PAUSE_BEFORE_TYPE });
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}
