// Get references to the screens and audio elements
const homeScreen = document.getElementById("home-screen");
const alienSelectionScreen = document.getElementById("alien-selection-screen");
const whiteScreen = document.getElementById("white-screen");
const homeImage = document.getElementById("home-image");
const openingSound = document.getElementById("opening-sound");
const transitionSound = document.getElementById("transition-sound");
const alienSound = document.getElementById("alien-sound");
const loopSound = document.getElementById("loop-sound");
const transformationSound = new Audio("sounds/transformation.mp3");
const powerdownSound = new Audio("sounds/powerdown.mp3");
const afterImage = document.getElementById("after-image");
//Get reference to the transformation video
//Create the transformation video dynamically
const transformationVideo = document.createElement("video");
transformationVideo.src = "videos/transformation.mp4";  // Set the correct path
transformationVideo.style.display = "none";  
transformationVideo.style.position = "absolute";
transformationVideo.style.width = "100%";
transformationVideo.style.height = "100%";
transformationVideo.style.objectFit = "cover";
transformationVideo.style.transition = "opacity 2s ease"; // Smooth transition effect
document.body.appendChild(transformationVideo);

// Array of Aliens with Image and Sound Data
const aliens = [
    { sound: "sounds/bezelswitch1.mp3", image: "images/alien1.png" },
    { sound: "sounds/bezelswitch2.mp3", image: "images/alien2.png" },
    { sound: "sounds/bezelswitch3.mp3", image: "images/alien3.png" },
    { sound: "sounds/bezelswitch4.mp3", image: "images/alien4.png" },
    { sound: "sounds/bezelswitch5.mp3", image: "images/alien5.png" },
    { sound: "sounds/bezelswitch6.mp3", image: "images/alien6.png" },
    { sound: "sounds/bezelswitch1.mp3", image: "images/alien7.png" },
    { sound: "sounds/bezelswitch2.mp3", image: "images/alien8.png" },
    { sound: "sounds/bezelswitch3.mp3", image: "images/alien9.png" },
    { sound: "sounds/bezelswitch4.mp3", image: "images/alien10.png" },
];

let currentIndex = 0;
let isBlinking = false; // To prevent multiple blinking processes
let isInTransition = false; // To prevent skipping the process

// Play opening sound when the app starts
window.addEventListener("load", () => {
    openingSound.play();
});

// Transition from home screen to alien selection screen
homeImage.addEventListener("click", () => {
    resetToFirstAlien();
    transitionSound.play();
    setTimeout(() => {
        homeScreen.style.display = "none";
        alienSelectionScreen.style.display = "flex";
        loopSound.play();
    }, 500);
});

// Update Display Function
function updateDisplay() {
    const alienIcon = document.getElementById("alien-icon");
    alienIcon.src = aliens[currentIndex].image;
    alienSound.src = aliens[currentIndex].sound;
    alienSound.play();
}

// Reset to the First Alien
function resetToFirstAlien() {
    currentIndex = 0;
    updateDisplay();
}

// Alien Selection Screen: Bezel Interaction
document.addEventListener("rotarydetent", (event) => {
    if (alienSelectionScreen.style.display === "none") return; // Ensure the interaction only happens on the alien selection screen

    if (event.detail.direction === "CW") {
        // Move to the next alien
        currentIndex = (currentIndex + 1) % aliens.length;
    } else if (event.detail.direction === "CCW") {
        // Move to the previous alien
        currentIndex = (currentIndex - 1 + aliens.length) % aliens.length;
    }
    updateDisplay();
});

//Alien Selection Logic (Click Event)
alienSelectionScreen.addEventListener("click", () => {
    if (isInTransition) return; 
    isInTransition = true;

    loopSound.pause();
    loopSound.currentTime = 0;
    transformationSound.play();
    
    // Hide alien selection screen *before* the video starts
    alienSelectionScreen.style.display = "none"; 
    

    // Show and play the transformation video
    transformationVideo.style.display = "block";
    transformationVideo.style.opacity = "1"; // Ensure video starts fully visible
    transformationVideo.play();

    // Ensure smooth transition after video ends
    transformationVideo.onended = () => {
        transformationVideo.style.opacity = "0"; // Start fade-out

        setTimeout(() => {
            transformationVideo.style.display = "none";  
            alienSelectionScreen.style.display = "none";
            whiteScreen.style.display = "flex";
            whiteScreen.style.backgroundColor = "white"; // Ensure it starts white
            isInTransition = false;
        }, 2000); // Matches the fade transition (2 seconds)
    };
});

// Start the Powerdown Process (Blinking and Transition)
function startPowerdownProcess() {
    powerdownSound.play();

    // Start blinking process
    startBlinking(() => {
        transitionToRed();
    });
}

// Attach the click handler to the 'after-image' for starting the blinking process
afterImage.addEventListener("click", () => {
    if (isInTransition || isBlinking) return; // Prevent re-triggering
    isBlinking = true; // Mark as blinking to prevent double execution

    startPowerdownProcess();
});

// Blinking process
function startBlinking(callback) {
    let isRed = false;
    let blinkCount = 0;
    const blinkInterval = 300; // Blinking interval in milliseconds
    const blinkDuration = 3000; // Total blinking duration (3 seconds)

    const blinkTimer = setInterval(() => {
        whiteScreen.style.backgroundColor = isRed ? "white" : "red";
        isRed = !isRed;
        blinkCount += blinkInterval;

        if (blinkCount >= blinkDuration) {
            clearInterval(blinkTimer);
            whiteScreen.style.backgroundColor = "white"; // Ensure it ends on white
            callback();
        }
    }, blinkInterval);
}

// Smooth transition from white to red
function transitionToRed() {
    let startTime = null;
    const duration = 3000; // Transition duration (3 seconds)

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1); // Calculate progress (0 to 1)

        // Interpolate color from white to red
        const redValue = Math.floor(progress * 255);
        whiteScreen.style.backgroundColor = `rgb(255, ${255 - redValue}, ${255 - redValue})`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Transition complete
            whiteScreen.style.backgroundColor = "red";
            attachRedScreenHandler(); // Attach click handler to red screen
        }
    }

    requestAnimationFrame(animate);
}

// Attach a click handler to the red screen (or the 'after' image) to reset the app
function attachRedScreenHandler() {
    afterImage.addEventListener(
        "click",
        () => {
            resetApp();
        },
        { once: true } // Ensure the event is triggered only once
    );
}

// Reset the app to its initial state
function resetApp() {
    resetToFirstAlien();
    whiteScreen.style.display = "none";
    alienSelectionScreen.style.display = "none";
    homeScreen.style.display = "flex";
    openingSound.play();
    loopSound.pause();
    loopSound.currentTime = 0;
    powerdownSound.pause();
    powerdownSound.currentTime = 0;

    // Reset flags
    isBlinking = false;
    isInTransition = false;
}

// Handle hardware back button
document.addEventListener("tizenhwkey", (event) => {
    const keyName = event.keyName;

    // If back button is pressed, reset the app
    if (keyName === "back") {
        resetApp();
    }
});
