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
        this.labelP.style('color', 'white'); // Set the color of the label text
        this.labelP.html(label); // Update the paragraph element with the label text
    }
}


class Sc3EYES {
    constructor(i) {
        this.i = i;
        // Calculate the positions and sizes based on the canvas dimensions and scaling factors
        this.imgWidth = globeScale * 0.3; // Adjust the divisor to control the size
        this.imgHeight = globeScale * 0.5; // Adjust the divisor to control the size


        // Calculate positions based on the canvas dimensions and scaling factors
        this.xPos = width * 0.0001; // Adjust the divisor to control the position
        this.yPos = height * 0.25; // Adjust the divisor to control the position

        // Constrain the pupil to the position of the eyeliner image
        this.initialPupilX = this.xPos + i * this.imgWidth / 1.2;
        this.initialPupilY = this.yPos + this.imgHeight / 2;
        this.pupilX = this.initialPupilX;
        this.pupilY = this.initialPupilY;

        // Set a fixed size for the pupil
        this.pupilSize = this.imgWidth;

        // Check if there is active sound (bassEnergy above a threshold)
        this.bassThreshold = 160; // Adjust this threshold as needed
        this.trebleThreshold = 0; // Adjust this threshold as needed
        this.midThreshold = 90; // Adjust this threshold as needed

    }

    displayEyes() {
        if (bassEnergy > this.bassThreshold || midEnergy > this.midThreshold || trebleEnergy > this.trebleThreshold) {
            
        }

        imageMode(CENTER);
        image(scene3eyes[this.i % scene3pupils.length], this.pupilX, this.pupilY, this.pupilSize, this.pupilSize);
        imageMode(CORNER);
    }
}

class Sc2EYES {
    constructor(energyR, energyG, energyB,  i) {

        this.energyR = energyR;
        this.energyG = energyG;
        this.energyB = energyB;

        this.i = i;
    }
    update(energyR, energyG, energyB) {
        this.energyR = energyR;
        this.energyG = energyG;
        this.energyB = energyB;
    }
    display() {
        this.R = (this.energyR * volSenseSlider.slider.value()) % 255;
        this.G = this.energyG * volSenseSlider.slider.value();
        this.B = this.energyB * volSenseSlider.slider.value();

        tint(0, 0, 250);
        image(scene2eyeliner[this.i % scene2eyeliner.length], 0, 0, width, height);
        tint(this.R, this.G, this.B);
        image(scene2pupils[this.i % scene2pupils.length], 0, 0, width, height);
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