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
let scene1eyes;

let currentScene = 1;
let sceneStartTime;

let volSense = 100; // Volume sensitivity
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

    scene1eyes = loadImage('./photos/scene1/Eyes1.png');

    for (let i = 1; i <= 4; i++) {
        scene2pupils.push(loadImage(`./photos/scene2/Sc2_Pupil${i}.png`));
    }
    for (let i = 1; i <= 4; i++) {
        scene2eyeliner.push(loadImage(`./photos/scene2/Sc2_Eyeliner${i}.png`));
    }
    for (let i = 1; i <= 5; i++) {
        scene3pupils.push(loadImage(`./photos/scene3/Pupil${i}.png`));
    }

    for (let i = 1; i <= 5; i++) {
        scene3eyeliner.push(loadImage(`./photos/scene3/Eyeliner${i}.png`));
    }

    for (let i = 1; i <= 5; i++) {
        scene3eyes.push(loadImage(`./photos/scene3/Eye${i}.png`));
    }

    collageBackground = loadImage('./photos/Collage bg1.png');
}

function setup() {
    volSenseSlider = new sliders(1, volSense, volSense / 2, sliderStep);
    volSenseSlider.position(10, 10);
    volSenseSlider.text('Volume Sensitivity');
    volSenseSlider.slider.id('sensitivitySlider'); // Assign an ID to the slider

    // maxRadSlider = new sliders(10, 30, 15, sliderStep);
    // maxRadSlider.position(10, 50);
    // maxRadSlider.text('Maximum Radius');

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    getAudioContext().suspend();
    fft = new p5.FFT();
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);

    sceneStartTime = millis(); // Initialize the scene start time
    
    colorMode(HSB, 100);
}

function draw() {
    tint(255, 90); // alpha 0-100
    image(collageBackground, 0, 0, width, height);
    noTint();

    if (audioOn) {
        fft.analyze();
        bassEnergy = fft.getEnergy("bass"); // Low frequency energy
        lowMidEnergy = fft.getEnergy("lowMid"); // Low mid frequency energy
        midEnergy = fft.getEnergy("mid"); // Mid frequency energy
        highMidEnergy = fft.getEnergy("highMid"); // High mid frequency energy
        trebleEnergy = fft.getEnergy("treble"); // High frequency energy

        // console.log("Bass Energy: ", bassEnergy); // Log bass energy for debugging
        // console.log("Low Mid Energy: ", lowMidEnergy); // Log low mid energy for debugging
        // console.log("Mid Energy: ", midEnergy); // Log mid energy for debugging
        // console.log("High Mid Energy: ", highMidEnergy); // Log high mid energy for debugging
        // console.log("Treble Energy: ", trebleEnergy); // Log treble energy for debugging

        // Check for a beat (if bass energy exceeds a threshold)
        if (bassEnergy > freqThreshold && millis() - lastBeatTime > beatInterval * 0.8) {
            lastBeatTime = millis();
            //console.log("Beat detected!");
        }
    }

    // Calculate the elapsed time since the scene started
    let elapsedTime = millis() - sceneStartTime;
    //console.log(`Elapsed Time: ${elapsedTime}, Current Scene: ${currentScene}`);

    // Switch scenes every 30 seconds (30000 milliseconds)
    if (elapsedTime > 30000) {
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
        scene2();
    // } else if (currentScene === 3) {
    //     sceneTransition();
    //     scene2();
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

    fill(map(trebleEnergy, 0, volSenseSlider.slider.value(), 0, 100), 100, 50); // Hue Shift
    let timeSinceLastBeat = millis() - lastBeatTime;
    let radiusC = map(timeSinceLastBeat, 0, beatInterval, 0, maxRadius);
    maxRadius = globeScale / 500; // Set the maximum radius of the circle

    radiusC = lowMidEnergy * maxRadius; // Set the radius of the circle based on the bass energy

    //console.log("Max Radius: ", maxRadius); // Log the maximum radius for debugging

    let starPoints = 4 + highMidEnergy / 10; // Set the number of points on the star based on treble energy

    drawStar(width / 3.5, height / 1.7, radiusC / 4, radiusC / 2, starPoints); // Move the circle with the beat
    drawStar(width / 1.35, height / 1.8, radiusC / 4, radiusC / 2, starPoints); // Move the circle with the beat

    image(scene1eyes, 0, 0, width, height);
}

// 4-6 pairs of eyes
function scene2() {
    //fill(100, 0, 0);
    //let timeSinceLastBeat = millis() - lastBeatTime;
    //let radiusC = map(timeSinceLastBeat, 0, beatInterval, 0, maxRadius);
    //radiusC = min(radiusC, maxRadius);

    //ellipse(width / 3, height / 3, radiusC, radiusC); // Move the circle with the beat
    //ellipse(width / 1.5, height / 3, radiusC, radiusC); // Move the circle with the beat
    let Sc2Brightness = map(highMidEnergy, 0, volSenseSlider.slider.value(), 0, 100);
    let Sc2Saturation = map(midEnergy, 0, volSenseSlider.slider.value(), 0, 100);


    new Sc2EYES(trebleEnergy, Sc2Saturation, Sc2Brightness, 1);
    new Sc2EYES(trebleEnergy, Sc2Saturation, Sc2Brightness, 2);
    new Sc2EYES(highMidEnergy, Sc2Saturation, Sc2Brightness, 3);
    new Sc2EYES(highMidEnergy, Sc2Saturation, Sc2Brightness, 4);
}

// 10-15 pairs of eyes
function scene3() {
    // Iterate over the eyes array and call displayEyes for each instance
    
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
