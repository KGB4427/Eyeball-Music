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

let volSense = 1; // Volume sensitivity
let sliderStep = 0.01; // Slider step size

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

let music;
let startAudio = false; // Start audio flag

let sc2Eyes = []; // Array to hold instances of Sc2EYES

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
    volSenseSlider = new sliders(0, volSense, volSense / 2, sliderStep);
    volSenseSlider.position(10, 10);
    volSenseSlider.text('Volume Sensitivity');
    volSenseSlider.slider.id('sensitivitySlider'); // Assign an ID to the slider

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    colorMode(HSB, 255);
    globeScale = min(width, height);
    getAudioContext().suspend();
    let audio = new Audio('./Brittle_Bones_Nicky_3.wav'); // Replace with your audio file path
    fft = new p5.FFT();
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);

    sceneStartTime = millis(); // Initialize the scene start time

    sc2Eyes.push(new Sc2EYES(trebleEnergy, 0, 0, 1));
    sc2Eyes.push(new Sc2EYES(trebleEnergy, 0, 0, 2));
    sc2Eyes.push(new Sc2EYES(highMidEnergy, 0, 0, 3));
    sc2Eyes.push(new Sc2EYES(highMidEnergy, 0, 0, 4));

}

function draw() {
    background(0); // Clear the background
    tint(255, 90); // alpha 0-100
    image(collageBackground, 0, 0, width, height);
    noTint();

    if (audioOn) {
        fft.analyze();
        bassEnergy = fft.getEnergy(16); // Low frequency energy
        lowMidEnergy = fft.getEnergy(32); // Low mid frequency energy
        midEnergy = fft.getEnergy(64); // Mid frequency energy
        highMidEnergy = fft.getEnergy(128); // High mid frequency energy
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
        if (currentScene > 2) {
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
    }
    // } else if (currentScene === 3) {
    //     sceneTransition();
    //     scene2();
}

function mousePressed() {
    audioOn = true;
    getAudioContext().resume();
    console.log("Audio context resumed and microphone started");
    console.log("Mouse Pressed X: " + mouseX);
    console.log("Mouse Pressed Y: " + mouseY);

    if(!startAudio){
        mic = new p5.AudioIn(); // Create an audio input
        fft = new p5.FFT(); // Create a Fast Fourier Transform
        fft.setInput(mic); // Set the audio input for the FFT
        fft.setInput(music); // Set the audio input for the FFT

        music = new p5.SoundFile('./Brittle_Bones_Nicky_3.wav', () => {
            console.log('Music loaded successfully');
            music.play(); // Play the music once it's loaded
        }, (err) => {
            console.error('Failed to load music:', err);
        }); // Create a sound file for music


        // mic.start(); // Start the audio input
        startAudio = true; // Set the start audio flag to true;
    }

}

// 1 pair of eyes
function scene1() {

    let hue = (trebleEnergy * volSenseSlider.slider.value()) % 255; // Hue Shift
    //console.log(`Hue: ${hue}`); // Debugging: Log the hue value

    fill(hue, 255, 127); // Hue Shift
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

    // Update properties of Sc2EYES instances
    sc2Eyes[0].update(trebleEnergy, Sc2Saturation, Sc2Brightness);
    sc2Eyes[1].update(trebleEnergy, Sc2Saturation, Sc2Brightness);
    sc2Eyes[2].update(highMidEnergy, Sc2Saturation, Sc2Brightness);
    sc2Eyes[3].update(highMidEnergy, Sc2Saturation, Sc2Brightness);

    // Display the eyes
    for (let eye of sc2Eyes) {
        eye.display();
    }
}

// 10-15 pairs of eyes
//function scene3() {
    // Iterate over the eyes array and call displayEyes for each instance
    
//}

function sceneTransition() {
    if (resetAlpha) {
        alphaT = 100; // Reset alpha value
        resetAlpha = false; // Reset the flag
    }
    rectMode(CENTER);
    noStroke();
    fill(0, 0, 0, alphaT);
    rect(width / 2, height / 2, width, height);
    alphaT -= fadeSpeed;
    if (alphaT <= 0) {
        alphaT = 0;
    }
}
