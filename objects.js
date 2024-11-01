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
        //this.labelP.style('color', 'white'); // Set the color of the label text
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
        let xPos = width / 6; // Adjust the divisor to control the position
        let yPos = height / 4; // Adjust the divisor to control the position

        // Constrain the pupil to the position of the eyeliner image
        let pupilX = xPos + i * imgWidth / 1.2;
        let pupilY = yPos + imgHeight / 2;

        // Set a fixed size for the pupil
        let pupilSize = imgWidth;

        // Check if there is active sound (bassEnergy above a threshold)
        let bassThreshold = 160; // Adjust this threshold as needed
        let trebleThreshold = 0; // Adjust this threshold as needed
        let midThreshold = 0; // Adjust this threshold as needed
        
        if (bassEnergy > bassThreshold || midEnergy > midThreshold || trebleEnergy > trebleThreshold) { 
            // Use noise to generate smooth random values for the pupil positions
            let baseNoiseOffsetX = noise(frameCount * 0.01 * lerp(0, highMidEnergy, 0.001)) * imgWidth / 4 - imgWidth / 8; // Slower noise
            let baseNoiseOffsetY = noise(frameCount * 0.01 * lerp (0, bassEnergy, 0.001)) * imgHeight / 4 - imgHeight / 8; // Slower noise

            // Scale the noise offsets by the volSenseSlider value to control shaking intensity
            let shakingIntensity = volSenseSlider.slider.value();

            // Combine base movement and bass energy movement
            pupilX += (baseNoiseOffsetX * highMidEnergy) * shakingIntensity / 1000;
            pupilY += (baseNoiseOffsetY * bassEnergy) * shakingIntensity / 1000;

            // Constrain the pupil positions to the canvas
            pupilX = constrain(pupilX, 0, width - pupilSize / 2); // Adjusted to move the eyes up
            pupilY = constrain(pupilY, 0, height - pupilSize / 2); // Adjusted to move the eyes up

        }

        imageMode(CENTER);
        image(scene3eyes[i % scene3pupils.length], pupilX, pupilY, pupilSize, pupilSize);
        imageMode(CORNER);
    }
}


//Star made by smparks on p5.js forum

function drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2;
    beginShape();
    for (let a = -PI/2; a < TWO_PI - PI/2; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }