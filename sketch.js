let s;
let webImages;

function preload() {
  webImages = []
  webImages.push(loadImage('https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'))
  webImages.push(loadImage('https://images.unsplash.com/photo-1575140685026-1908fb64d279?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'))
  webImages.push(loadImage('https://images.unsplash.com/photo-1575121274665-9dd0af2b0eea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=976&q=80'))
}

function setup() {
  createCanvas(600, 600)
  s = {};
  s.bgColor = '#222222';
  s.rowCount = 100;
  s.columnCount = 15;
  s.seed = floor(random(10000));
  s.rectWidth = 8;
  s.oscAmplitude = 20;
  s.oscFrequency = 0.10;
  s.oscModFrequency = 0.1;
  s.activeImageIndex = 0;
  initColors()
  background(s.bgColor)
  let gui = new dat.GUI();
  gui.add(s, 'rectWidth', 0, 100).name('largeur rectangle');
  let rowCountController = gui.add(s, 'rowCount', 0, 100).name('nombre de ligne');
  let columnCountController = gui.add(s, 'columnCount', 1, s.rowCount).name('nombre de colonne');
  rowCountController.onChange(value => {
    s.rowCount = floor(value);
    initColors();
  });
  columnCountController.onChange(value => {
    s.columnCount = floor(value);
    initColors();
  });
  gui.add(this, 'initColors');
  gui.addColor(s, 'bgColor');
  let activeImageIndexController = gui.add(s, 'activeImageIndex', [...webImages.keys()]);
  activeImageIndexController.onChange(value => {
    s.activeImageIndex = value;
    initColors();
  });
}

function initColors() {
  s.rectColors = [];
  let webImage = webImages[s.activeImageIndex];
  for (let i = 0; i < s.rowCount * s.columnCount; i++) {
    let x = random(0, webImage.width)
    let y = random(0, webImage.height)
    let c = webImage.get(x, y);
    s.rectColors.push(c)
  }
}

function draw() {
  background(s.bgColor)
  drawGrid(500, 500)
}

function drawGrid(w, h) {
  let cellWidth = w / s.columnCount;
  let cellheight = h / s.rowCount;
  push()
  let k = 0;
  translate((width - w) / 2, (height - h) / 2)
  for (let i = 0; i < s.columnCount; i++) {
    for (let j = 0; j < s.rowCount; j++) {
      let c = s.rectColors[k];
      noStroke();
      fill(c);
      push();
      let shift = s.oscAmplitude * sin(frameCount * s.oscFrequency);
      shift += s.oscAmplitude * sin(frameCount * (s.oscFrequency + j / s.columnCount * s.oscModFrequency));
      shift += s.oscAmplitude * sin(frameCount * (s.oscFrequency + j / s.rowCount * s.oscModFrequency));
      translate((cellWidth - s.rectWidth) / 2 + shift, 0); // Centering
      translate((cellWidth - s.rectWidth) / 2 + shift, cellWidth / 2); // Centering
      rect((i * cellWidth), (j * cellheight), s.rectWidth, cellheight);
      // rectByCenter((i * cellWidth), (j * cellheight), s.rectWidth, cellheight);
      pop()
      k++
    }
  }
  // new
  // pop();
}

function rectByCenter(x, y, w, h) {
  push();
  translate(-w / 2, -h / 2);
  rect(x, y, w, h);
  pop();
}

function keyTyped() {
  if (key === 's') {
    initColors()
  }
}