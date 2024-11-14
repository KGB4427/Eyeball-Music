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
        this.R = this.energyR * volSenseSlider.value() % 255;
        this.G = this.energyG * volSenseSlider.value();
        this.B = this.energyB * volSenseSlider.value();

        noTint();
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

  function browAnimUpdate() {
    if (millis() - lastBrowAnimUpdateTime > browAnimInterval) {
        //browIdx = (browIdx + 1) % browAnim.length;
        browIdx++;
        if (browIdx == browAnim.length - 1) {
            browIdx = 0;
        }
        lastBrowAnimUpdateTime = millis();
    }
  }