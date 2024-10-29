let mic, fft;
let bassEnergy;
let lastBeatTime = 0;
let bpm = 120; // Set the BPM of the song (can be detected dynamically)
let beatInterval = (60 / bpm) * 1000; // Calculate time between beats in milliseconds
let audioOn = false;
let maxRadSlider; // Slider for maximum radius

let volSense = 200; // Volume sensitivity
let sliderStep = 1; // Slider step size

let freqThreshold = 150; // Set the threshold for bass energy 0 is high 200 is low

let globeScale = 1.6; // 16:10 aspect ratio
let maxRadius; // Maximum radius of the circle

function preload() {
    
}

function setup() {

    volSenseSlider = new sliders(0, volSense, volSense / 2, sliderStep);
    volSenseSlider.position(10, 10);
    volSenseSlider.text('Volume Sensitivity');

    maxRadSlider = new sliders(0, 100, 50, sliderStep);
    maxRadSlider.position(10, 50);
    maxRadSlider.text('Maxiumum Radius');

    createCanvas(window.innerWidth / globeScale, window.innerHeight / globeScale);
    getAudioContext().suspend();
    fft = new p5.FFT();
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);

    maxRadius = min(width, height) / (2*globeScale); // Set the maximum radius of the circle

    
    
}
  
function draw() {

    background(220);

    if (audioOn) {
        fft.analyze();
        bassEnergy = fft.getEnergy("bass"); // Low frequency energy

        console.log("Bass Energy: ", bassEnergy); // Log bass energy for debugging

        // Check for a beat (if bass energy exceeds a threshold)
        if (bassEnergy > freqThreshold && millis() - lastBeatTime > beatInterval * 0.8) {
            lastBeatTime = millis();
            console.log("Beat detected!");
        }
        
    }
    scene1();

}

function mousePressed() {
    audioOn = true;
    getAudioContext().resume();
    console.log("Audio context resumed and microphone started");
}

// 1 pair of eyes
function scene1() {

    fill(100, 0, 0);
    let timeSinceLastBeat = millis() - lastBeatTime;
    let radiusC = map(timeSinceLastBeat, 0, beatInterval, 0, maxRadius);
    radiusC = min(radiusC, maxRadius);

    //////////////////////////////////
    // TESTING CODE FOR pupils CLASS//
    //////////////////////////////////
    
    // let leftEye;
    // leftEye = new pupils(width/5, height / 5, radiusC, color(0, 0, 255));
    // leftEye.color(0, 255, 0);
    // leftEye.display();


    
    ellipse(width/3, height / 3, radiusC, radiusC); // Move the circle with the beat
    ellipse(width/1.5, height / 3, radiusC, radiusC); // Move the circle with the beat

    
}

// 4-6 pairs of eyes
function scene2() {
    
    fill(100, 0, 0);
    let timeSinceLastBeat = millis() - lastBeatTime;
    let radiusC = map(timeSinceLastBeat, 0, beatInterval, 0, maxRadius);
    radiusC = min(radiusC, maxRadius);
    
    ellipse(width/3, height / 3, radiusC, radiusC); // Move the circle with the beat
    ellipse(width/1.5, height / 3, radiusC, radiusC); // Move the circle with the beat
    
}

// 10-15 pairs of eyes
function scene3() {
    
}

function mousePressed() {
    console.log("width / " + width/mouseX);
    console.log("height / " + height/mouseY);


}
