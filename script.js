let mic, fft;
let bassEnergy;
let trebleEnergy;
let midEnergy;
let lowMidEnergy;
let highMidEnergy;
let lastBeatTime = 0;
let bpm = 120; // Set the BPM of the song (can be detected dynamically)
let beatInterval = (60 / bpm) * 1000; // Calculate time between beats in milliseconds
let audioOn = false;
let maxRadSlider; // Slider for maximum radius
let collageBackground;

let scene3pupils = [];
let scene3eyeliner = [];
let scene3eyes = [];
let scene2pupils = [];
let scene2eyeliner = [];

let currentScene = 1;
let sceneStartTime;

let volSense = 200; // Volume sensitivity
let sliderStep = 1; // Slider step size

let freqThreshold = 150; // Set the threshold for bass energy 0 is high 200 is low

let ratio = 1.6; // 16:10 aspect ratio
let globeScale;
let maxRadius; // Maximum radius of the circle

//EYES OBJECT --------------------------------
let eyesObject = []; 

//Transition
let alphaT = 100;
let fadeSpeed = 1;
let resetAlpha = false; 

function preload() {
    for (let i = 1; i <= 5; i++) {
        scene3pupils.push(loadImage(`./photos/scene3/Pupil${i}.png`));
    }

    for (let i = 1; i <= 5; i++) {
        scene3eyeliner.push(loadImage(`./photos/scene3/Eyeliner${i}.png`));
    }

    for (let i = 1; i <= 5; i++) {
        scene3eyes.push(loadImage(`./photos/scene3/Eye${i}.png`));
    }

    collageBackground = loadImage('./photos/temp_background.png');
}

function setup() {
    volSenseSlider = new sliders(20, volSense * 2, volSense / 2, sliderStep);
    volSenseSlider.position(10, 10);
    volSenseSlider.text('Volume Sensitivity');

    maxRadSlider = new sliders(10, 30, 15, sliderStep);
    maxRadSlider.position(10, 50);
    maxRadSlider.text('Maximum Radius');

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    getAudioContext().suspend();
    fft = new p5.FFT();
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);

    sceneStartTime = millis(); // Initialize the scene start time

    // Create instances of the Eyes class and store them in the eyes array
    for (let i = 0; i < scene3eyeliner.length; i++) {
        eyesObject.push(new Eyes(i));
    }   
}

function draw() {
    tint(255, 30); // alpha 0-100
    image(collageBackground, 0, 0, width, height);
    noTint();

    if (audioOn) {
        fft.analyze();
        bassEnergy = fft.getEnergy("bass"); // Low frequency energy
        lowMidEnergy = fft.getEnergy("lowMid"); // Low mid frequency energy
        midEnergy = fft.getEnergy("mid"); // Mid frequency energy
        highMidEnergy = fft.getEnergy("highMid"); // High mid frequency energy
        trebleEnergy = fft.getEnergy("treble"); // High frequency energy

        console.log("Bass Energy: ", bassEnergy); // Log bass energy for debugging
        console.log("Low Mid Energy: ", lowMidEnergy); // Log low mid energy for debugging
        console.log("Mid Energy: ", midEnergy); // Log mid energy for debugging
        console.log("High Mid Energy: ", highMidEnergy); // Log high mid energy for debugging
        console.log("Treble Energy: ", trebleEnergy); // Log treble energy for debugging

        // Check for a beat (if bass energy exceeds a threshold)
        if (bassEnergy > freqThreshold && millis() - lastBeatTime > beatInterval * 0.8) {
            lastBeatTime = millis();
            //console.log("Beat detected!");
        }
    }

    // Calculate the elapsed time since the scene started
    let elapsedTime = millis() - sceneStartTime;
    //console.log(`Elapsed Time: ${elapsedTime}, Current Scene: ${currentScene}`);

    // Switch scenes every 10 seconds (10000 milliseconds)
    if (elapsedTime > 10000) {
        currentScene++;
        if (currentScene > 3) {
            currentScene = 1; // Loop back to scene1
        }
        sceneStartTime = millis(); // Reset the scene start time
        resetAlpha = true; // Set the flag to reset alpha
        console.log(`Switching to Scene: ${currentScene}`);
    }

    // Call the current scene function
    if (currentScene === 1) {
        sceneTransition();
        scene1();
    } else if (currentScene === 2) {
        sceneTransition();
        scene3();
    } else if (currentScene === 3) {
        sceneTransition();
        scene3();
    }
}

function mousePressed() {
    audioOn = true;
    getAudioContext().resume();
    console.log("Audio context resumed and microphone started");
    console.log("Mouse Pressed X: " + mouseX);
    console.log("Mouse Pressed Y: " + mouseY);
}

// 1 pair of eyes
function scene1() {
    let angle = 0;

    fill(100, 0, 0);
    let timeSinceLastBeat = millis() - lastBeatTime;
    let radiusC = map(timeSinceLastBeat, 0, beatInterval, 0, maxRadius);
    maxRadius = globeScale * maxRadSlider.slider.value() / 10000; // Set the maximum radius of the circle

    radiusC = bassEnergy * maxRadius; // Set the radius of the circle based on the bass energy

    //console.log("Max Radius: ", maxRadius); // Log the maximum radius for debugging

    let starPoints = 4 + highMidEnergy / 10; // Set the number of points on the star based on treble energy

    drawStar(width / 3, height / 3, radiusC / 2, radiusC, starPoints); // Move the circle with the beat
    drawStar(width / 1.5, height / 3, radiusC / 2, radiusC, starPoints); // Move the circle with the beat
}

// 4-6 pairs of eyes
function scene2() {
    // fill(100, 0, 0);
    // let timeSinceLastBeat = millis() - lastBeatTime;
    // let radiusC = map(timeSinceLastBeat, 0, beatInterval, 0, maxRadius);
    // radiusC = min(radiusC, maxRadius);

    // ellipse(width/3, height / 3, radiusC, radiusC); // Move the circle with the beat
    // ellipse(width/1.5, height / 3, radiusC, radiusC); // Move the circle with the beat
    // for( let i = 1; i <= 4; i++) {
    //     image(scene2eyeliner[i], 0, 0);
    //     image(scene2pupils[i], 0, 0);
    // }
}

// 10-15 pairs of eyes
function scene3() {
    // Iterate over the eyes array and call displayEyes for each instance
    for (let i = 0; i < eyesObject.length; i++) {
        eyesObject[i].displayEyes();
    }
}

function sceneTransition() {
    if (resetAlpha) {
        alphaT = 100; // Reset alpha value
        resetAlpha = false; // Reset the flag
    }
    rectMode(CENTER);
    noStroke();
    fill(0, alphaT);
    rect(width / 2, height / 2, width, height);
    alphaT -= fadeSpeed;
    if (alphaT <= 0) {
        alphaT = 0;
    }
}