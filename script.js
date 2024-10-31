let mic, fft;
let bassEnergy;
let trebleEnergy;
let midEnergy;
let lastBeatTime = 0;
let bpm = 120; // Set the BPM of the song (can be detected dynamically)
let beatInterval = (60 / bpm) * 1000; // Calculate time between beats in milliseconds
let audioOn = false;
let maxRadSlider; // Slider for maximum radius


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

function preload() {
    // for( let i = 1; i <= 4; i++) {
    //     scene2pupils.push(loadImage(`./photos/scene2/Sc2_Pupil${i}.png`));
    // }

    // for( let i = 1; i <= 4; i++) {
    //     scene2eyeliner.push(loadImage(`./photos/scene2/Sc2_Eyeliner${i}.png`));
    // }

    for (let i = 1; i <= 5; i++) {
        scene3pupils.push(loadImage(`./photos/scene3/Pupil${i}.png`));
    }

    for (let i = 1; i <= 5; i++) {
        scene3eyeliner.push(loadImage(`./photos/scene3/Eyeliner${i}.png`));
    }

    for (let i = 1; i <= 5; i++) {
        scene3eyes.push(loadImage(`./photos/scene3/Eye${i}.png`));
    }

}

function setup() {

    volSenseSlider = new sliders(20, volSense * 2, volSense / 2, sliderStep);
    volSenseSlider.position(10, 10);
    volSenseSlider.text('Volume Sensitivity');

    maxRadSlider = new sliders(20, 100, 50, sliderStep);
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
    
}
  
function draw() {

    background(220);

    if (audioOn) {
        fft.analyze();
        bassEnergy = fft.getEnergy("bass"); // Low frequency energy
        midEnergy = fft.getEnergy("mid"); // Mid frequency energy
        trebleEnergy = fft.getEnergy("treble"); // High frequency energy

        console.log("Bass Energy: ", bassEnergy); // Log bass energy for debugging

        // Check for a beat (if bass energy exceeds a threshold)
        if (bassEnergy > freqThreshold && millis() - lastBeatTime > beatInterval * 0.8) {
            lastBeatTime = millis();
            console.log("Beat detected!");
        }
        
    }

    // Calculate the elapsed time since the scene started
    let elapsedTime = millis() - sceneStartTime;
    console.log(`Elapsed Time: ${elapsedTime}, Current Scene: ${currentScene}`);

    // Switch scenes every 5 seconds (5000 milliseconds)
    if (elapsedTime > 5000) {
        currentScene++;
        if (currentScene > 3) {
            currentScene = 1; // Loop back to scene1
        }
        sceneStartTime = millis(); // Reset the scene start time
        console.log(`Switching to Scene: ${currentScene}`);
    }

    // Call the current scene function
    if (currentScene === 1) {
        scene3();
    } else if (currentScene === 2) {
        scene3();
    } else if (currentScene === 3) {
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

    fill(100, 0, 0);
    let timeSinceLastBeat = millis() - lastBeatTime;
    let radiusC = map(timeSinceLastBeat, 0, beatInterval, 0, maxRadius);
    radiusC = min(radiusC, maxRadius);

    maxRadius = globeScale * maxRadSlider.slider.value() / 100; // Set the maximum radius of the circle
    //console.log("Max Radius: ", maxRadius); // Log the maximum radius for debugging

    ellipse(width/3, height / 3, radiusC, radiusC); // Move the circle with the beat
    ellipse(width/1.5, height / 3, radiusC, radiusC); // Move the circle with the beat

    
}

// 4-6 pairs of eyes
function scene2() {
    
//     fill(100, 0, 0);
//     let timeSinceLastBeat = millis() - lastBeatTime;
//     let radiusC = map(timeSinceLastBeat, 0, beatInterval, 0, maxRadius);
//     radiusC = min(radiusC, maxRadius);
    
//     ellipse(width/3, height / 3, radiusC, radiusC); // Move the circle with the beat
//     ellipse(width/1.5, height / 3, radiusC, radiusC); // Move the circle with the beat
//     for( let i = 1; i <= 4; i++) {
//         image(scene2eyeliner[i], 0, 0);
//         image(scene2pupils[i], 0, 0);
//     }
    
}

// 10-15 pairs of eyes
function scene3() {

    // Draw the images at the calculated positions and sizes
    for (let i = 0; i < scene3eyeliner.length; i++) {
        let eye = new eyes(i);
    }    
}
