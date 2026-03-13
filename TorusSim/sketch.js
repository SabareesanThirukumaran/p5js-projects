let A = 0,
  B = 0;
let isSpinning = true;
let stopButton;
const chars = ".,-~:;=!*#$@";
const cols = 80,
  rows = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
  textAlign(CENTER, CENTER);
  colorMode(HSB, 255);

  stopButton = createButton("Stop/Start Rotation");
  stopButton.position(20, 60);
  stopButton.mousePressed(() => {
    isSpinning = !isSpinning;
  });
}

function draw() {
  background(0);

  let output = new Array(cols * rows).fill(" ");
  let zBuffer = new Array(cols * rows).fill(0);
  let colorBuffer = new Array(cols * rows).fill(0);

  if (!isSpinning) {
    A = map(mouseY, 0, height, 0, TWO_PI);
    B = map(mouseX, 0, width, 0, TWO_PI);
  }

  let cosA = cos(A),
    sinA = sin(A);
  let cosB = cos(B),
    sinB = sin(B);

  for (let theta = 0; theta < TWO_PI; theta += 0.07) {
    let cosTheta = cos(theta),
      sinTheta = sin(theta);
    for (let phi = 0; phi < TWO_PI; phi += 0.02) {
      let cosPhi = cos(phi),
        sinPhi = sin(phi);

      let circleX = 2 + 1 * cosTheta;
      let circleY = 1 * sinTheta;

      let x =
        circleX * (cosB * cosPhi + sinA * sinB * sinPhi) -
        circleY * cosA * sinB;
      let y =
        circleX * (sinB * cosPhi - sinA * cosB * sinPhi) +
        circleY * cosA * cosB;
      let z = 5 + cos(A) * circleX * sinPhi + circleY * sin(A);
      let ooz = 1 / z;

      let xp = floor(cols / 2 + 40 * ooz * x);
      let yp = floor(rows / 2 - 20 * ooz * y);

      let L =
        cosPhi * cosTheta * sinB -
        cosA * cosTheta * sinPhi -
        sinA * sinTheta +
        cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);

      if (L > 0) {
        let idx = xp + yp * cols;
        if (idx >= 0 && idx < cols * rows && ooz > zBuffer[idx]) {
          zBuffer[idx] = ooz;
          output[idx] = chars[floor(L * 8)] || ".";
          colorBuffer[idx] = ((theta + phi + frameCount * 0.02) * 40) % 255;
        }
      }
    }
  }

  let charW = width / cols;
  let charH = height / rows;
  textSize(charH);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let index = i + j * cols;
      if (output[index] !== " ") {
        fill(colorBuffer[index], 200, 255);
        text(output[index], i * charW + charW / 2, j * charH + charH / 2);
      }
    }
  }

  if (isSpinning) {
    A += 0.03;
    B += 0.02;
  }

  fill(255);
  noStroke();
  textSize(16);
  text("Drag mouse to rotate when stopped", width / 2, height - 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
