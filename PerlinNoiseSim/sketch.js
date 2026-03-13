let angle = 0;
let shatter = 0;
let targetShatter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  detail = 40; 
}

function draw() {
  background(10);
  pointLight(0, 100, 255, -500, 0, 200);
  pointLight(255, 0, 100, 500, 0, 200);
  directionalLight(255, 255, 255, 0, 1, -1);
  
  orbitControl();

  shatter = lerp(shatter, targetShatter, 0.1);
  if (shatter > 0.01) targetShatter *= 0.9;

  rotateY(angle);
  rotateX(angle * 0.5);


  noFill();
  strokeWeight(0.5);
  
  let r = 200;
  
  for (let i = 0; i <= detail; i++) {
    let lat = map(i, 0, detail, 0, PI);
    
    stroke(map(i, 0, detail, 100, 255), 150, 255, 150);
    
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j <= detail; j++) {
      let lon = map(j, 0, detail, 0, TWO_PI);
      
      let xOff = sin(lat) * cos(lon);
      let yOff = sin(lat) * sin(lon);
      let zOff = cos(lat);
      
      let n = noise(xOff + frameCount * 0.02, yOff + frameCount * 0.02, zOff);
      
      let displacement = map(n, 0, 1, -50, 50) + (shatter * random(-100, 100));
      let dr = r + displacement;

      let x = dr * sin(lat) * cos(lon);
      let y = dr * sin(lat) * sin(lon);
      let z = dr * cos(lat);
      
      fill(20, 20, 40, 50);
      vertex(x, y, z);
    }
    endShape();
  }

  angle += 0.01;
}

function mousePressed() {
  targetShatter = 2.0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}