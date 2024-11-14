//IMAGES//
let scene1eyes = [];
let scene2pupils = [];
let scene2eyeliner = [];
let sc2Eyes = [];
let browAnim = [];
let collageBackground;

//SCALING//
let ratio = 1.6; // 16:10 aspect ratio
let globeScale;

//ADUIO VALUES//
let fft;
let mic;
let audio;
let music;
let volSense = 1;
let sliderStep = 0.01;
let startAudio = false;
let audioOn = false;
let lastBeatTime = 0;
let bpm = 120; // Set the BPM of the song (can be detected dynamically)
let beatInterval = (60 / bpm) * 1000; // Calculate time between beats in milliseconds

//ENERGY VALUES//
let bassEnergy, lowMidEnergy, midEnergy, highMidEnergy, trebleEnergy;

//SCENE TIMER//
let currentScene = 1;
let lastSceneChangeTime = 0;
let sceneDuration = 30000; // Duration of each scene in milliseconds (30 seconds)

//SCENE 1 EYES//
let maxRadius; // Maximum radius of the circle

//SCENE 2 EYES//
let browIdx = 0;
let browHue;
let startAnim = true;
let lastBrowAnimUpdateTime = 0; // Initialize the last update time
let browAnimInterval = 100; // Interval of 0.25 seconds in milliseconds

//TRANSITION//
let alphaT = 255;
let fadeSpeed = 5;
let resetAlpha = false;


function preload() {

    scene1eyes = loadImage('./photos/scene1/Eyes1.png');

    for (let i = 1; i <= 4; i++) {
        scene2pupils.push(loadImage(`./photos/scene2/Sc2_Pupil${i}.png`));
    }
    for (let i = 1; i <= 4; i++) {
        scene2eyeliner.push(loadImage(`./photos/scene2/Sc2_Eyeliner${i}.png`));
    }
    for (let i = 0; i <= 7; i++) {
        browAnim.push(loadImage(`./photos/scene2/Eyebrow PNG Sequence/Eyebrow Movement${i}.png`));
    }

    collageBackground = loadImage('./photos/Collage bg1.png');
}

function setup() {

    volSenseSlider = createSlider(0, volSense, volSense / 2, sliderStep);
    volSenseSlider.id('sensitivitySlider'); // Assign an ID to the slider

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    colorMode(HSB, 255);

    globeScale = min(width, height);

    getAudioContext().suspend();
    audio = new Audio('./Brittle_Bones_Nicky_3.wav'); // Replace with your audio file path
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
        bassEnergy = Math.floor(fft.getEnergy(16)); // Low frequency energy
        lowMidEnergy = Math.floor(fft.getEnergy(32)); // Low mid frequency energy
        midEnergy = Math.floor(fft.getEnergy(64)); // Mid frequency energy
        highMidEnergy = Math.floor(fft.getEnergy(128)); // High mid frequency energy
        trebleEnergy = Math.floor(fft.getEnergy("treble")); // High frequency energy
    }

    if (millis() - lastSceneChangeTime > sceneDuration) {
        currentScene = (currentScene % 2) + 1; // Toggle between scene 1 and scene 2
        lastSceneChangeTime = millis(); // Update the last scene change time
    }

    if (currentScene === 1) {
        sceneTransition();
        scene1();
    } else if (currentScene === 2) {
        sceneTransition();
        scene2();
    }
}

function mousePressed() {

    audioOn = true;
    getAudioContext().resume().then(() => {
        console.log("Audio context resumed");
    }).catch(err => {
        console.error("Error resuming audio context:", err);
    });

    if (!startAudio) {
        mic = new p5.AudioIn(); // Create an audio input
        mic.start(() => {
            console.log("Microphone started");
        }, (err) => {
            console.error("Error starting microphone:", err);
        });

        fft = new p5.FFT(); // Create a Fast Fourier Transform
        fft.setInput(mic); // Set the audio input for the FFT

        // audio.play();
        // getAudioContext().resume().then(() => {
        //     console.log("Audio context resumed after play");
        // }).catch(err => {
        //     console.error("Error resuming audio context after play:", err);
        // });

        // mic = new p5.AudioIn(); // Create an audio input
        // fft = new p5.FFT(); // Create a Fast Fourier Transform
        // fft.setInput(mic); // Set the audio input for the FFT
        // fft.setInput(music); // Set the audio input for the FFT

        // music = new p5.SoundFile('./Brittle_Bones_Nicky_3.wav', () => {
        //     console.log('Music loaded successfully');
        //     music.play(); // Play the music once it's loaded
        // }, (err) => {
        //     console.error('Failed to load music:', err);
        // }); // Create a sound file for music

        startAudio = true;
    }
}

function scene1() {

    let hue = trebleEnergy * volSenseSlider.value() % 255; // Hue Shift
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

function scene2() {

    let Sc2Brightness = map(highMidEnergy, 0, volSenseSlider.value(), 0, 100);
    let Sc2Saturation = map(midEnergy, 0, volSenseSlider.value(), 0, 100);

    // Update properties of Sc2EYES instances
    sc2Eyes[0].update(trebleEnergy, Sc2Saturation, Sc2Brightness);
    sc2Eyes[1].update(trebleEnergy, Sc2Saturation, Sc2Brightness);
    sc2Eyes[2].update(highMidEnergy, Sc2Saturation, Sc2Brightness);
    sc2Eyes[3].update(highMidEnergy, Sc2Saturation, Sc2Brightness);

    // Display the eyes
    for (let eye of sc2Eyes) {
        eye.display();
    }

    browHue = bassEnergy * volSenseSlider.value() % 255

    tint(browHue, Sc2Saturation, Sc2Brightness); // alpha 0-100
    browAnimUpdate();
    image(browAnim[browIdx], 0, 0, width, height);
    noTint();

}

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
