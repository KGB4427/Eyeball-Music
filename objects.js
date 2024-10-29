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