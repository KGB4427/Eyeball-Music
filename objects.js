class sliders {
    constructor(minVal, maxVal, startVal, sliderStep) {
        this.slider = createSlider(minVal, maxVal, startVal, sliderStep); // Create a slider // min.max.value.stepValue
        this.label = ''; // Initialize the label
        this.labelP = createP(''); // Create a paragraph element for the label
    }

    position(x, y) {
        this.slider.position(x, y); // Set the position of the slider
        this.labelP.position(x, y); // Set the position of the label below the slider
    }

    text(label) {
        this.label = label; // Set the label of the slider
        this.labelP.html(label); // Update the paragraph element with the label text
    }
}

class pupils {
    constructor(x, y, radius, Red, Green, Blue) {
        this.x = x; // x-coordinate of the circle
        this.y = y; // y-coordinate of the circle
        this.radius = radius; // radius of the circle
        this.Red = Red; // Red color value
        this.Green = Green; // Green color value
        this.Blue = Blue; // Blue color value
    }

    display() {
        fill(this.color); // Set the fill color of the
        ellipse(this.x, this.y, this.radius, this.radius); // Draw the circle
    }

    color(Red, Green, Blue) {
        this.color = color(Red, Green, Blue); // Set the color of the circle
    }
}
class eyes {
    constructor(i) {
        this.i = i;
        // Calculate the positions and sizes based on the canvas dimensions and scaling factors
        let imgWidth = globeScale / 3; // Adjust the divisor to control the size
        let imgHeight = globeScale / 3; // Adjust the divisor to control the size

        // Calculate positions based on the canvas dimensions and scaling factors
        let xPos = width / 8; // Adjust the divisor to control the position
        let yPos = height / 4; // Adjust the divisor to control the position

        // Constrain the pupil to the position of the eyeliner image
        let pupilX = constrain(xPos + i * imgWidth / 1.25 + imgWidth / 2, 0, width);
        let pupilY = constrain(yPos + imgHeight / 2, 0, height);

        let timeSinceLastBeat = millis() - lastBeatTime;
        let radiusD = (bassEnergy / 100) * timeSinceLastBeat;

        // Set a fixed size for the pupil
        let pupilSize = imgWidth;

        // Check if there is active sound (bassEnergy above a threshold)
        let threshold = 160; // Adjust this threshold as needed
        if (bassEnergy > threshold || midEnergy > threshold || trebleEnergy > threshold) { 
            // Use noise to generate smooth random values for the pupil positions
            let baseNoiseOffsetX = noise(frameCount * 0.0005) * imgWidth / 4 - imgWidth / 8; // Slower noise
            let baseNoiseOffsetY = noise(frameCount * 0.0005) * imgHeight / 4 - imgHeight / 8; // Slower noise

            // Additional movement component based on bassEnergy
            let midMovementX = (midEnergy / 255) * (noise(frameCount * 0.0005) - 0.5) * imgWidth / 4; // Slower noise
            let midMovementY = (midEnergy / 255) * (noise(frameCount * 0.0005) - 0.5) * imgHeight / 4; // Slower noise

            // Scale the noise offsets by the volSenseSlider value to control shaking intensity
            let shakingIntensity = Math.log10(volSenseSlider.slider.value()) * 10;

            // Combine base movement and bass energy movement
            let noiseOffsetX = (baseNoiseOffsetX + midMovementX + trebleEnergy) + random([-0.05, 0.05]) + shakingIntensity;
            let noiseOffsetY = (baseNoiseOffsetY + midMovementY + bassEnergy) + random([-0.05, 0.05]) + shakingIntensity;

            // Constrain the pupil positions to the canvas
            pupilX = constrain(pupilX + noiseOffsetX, 0, width);
            pupilY = constrain(pupilY + noiseOffsetY, 0, height); // Adjusted to move the eyes up
        }

        imageMode(CENTER);
        image(scene3eyes[i % scene3pupils.length], pupilX, pupilY, pupilSize, pupilSize);
    }
}