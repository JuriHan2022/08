// --- SETTINGS ------------------------------------
const STROKE_WEIGHT = 2.5

const INK_COLOR = [0, 0, 0]
const BACKGROUND_COLOR = [250, 246, 237]

document.body.style.backgroundColor = `rgb(${BACKGROUND_COLOR.join()})`

const ANIMATE_PLANETS = true

const OFFSET = 20
const SPACING = 50
// -------------------------------------------------

function makeGrid(w, h, spacing, offset) {
  this.w = w;
  this.h = h;
  this.spacing = spacing;
  this.offset = offset;
  // Array of 'spaces' that could be filled
  this.grid = [];
  // Array based off grid that contains circles data
  this.circleArray = [];
  
  this.initGrid = function () {
    const rows = (this.w - (this.offset)) / this.spacing
    const columns = (this.h - (this.offset)) / this.spacing
    for (let x = 1; x < rows; x++) {
      row = []
      for (let y = 1; y < columns; y++) {
        row.push(1);
      }
      this.grid.push(row);
    }
    this.circleArray = [...this.grid]
  };

  this.generateCircles = function () {
    let currentColor = INK_COLOR
    for (let i = 1; i < this.grid.length; i++) {
      for (let j = 1; j < this.grid[0].length; j++) {
        if (this.grid[i][j]) {
          let x, y, diameter, isFilled, rings, planet, planetOffset, itemRandom, shouldMakeLine;

          x = i * this.spacing + this.offset;
          y = j * this.spacing + this.offset;

          const rando = Math.random();
          
          if (rando >= 0.95) {
            shouldMakeLine = true
          }
          
          itemRandom = random(1)
          
          // Set Fill
          if (rando <= 0.4) {
            isFilled = true
          } else {
            isFilled = false
          }
          
          diameter = Math.floor(rando * (SPACING - 3))
          
          // Set inner rings or dot
          rings = 0
          if (diameter > 15 && rando > 0.95) {
            rings = 3
          } else if (diameter > 10 && rando > 0.75) {
            rings = 2
          } else if (rando > 0.85) {
            rings = 1
          }
          
          planet = rando > 0.5
          planetOffset = random(1) * (Math.PI * 2)
                  

          // Push to array of data points
          this.circleArray[i][j] = {x,y,i,j,diameter,isFilled,color: currentColor,rings,increment: 1, planet, planetOffset, itemRandom, shouldMakeLine}
        }
      }
    }
  }
}

function setup() {
  const wW = document.querySelector('body').clientWidth
  const wH = document.querySelector('body').clientHeight
  wx = wW;
  wy = wH;
  
  pixelDensity(1)
  createCanvas(wx, wy);
  frameRate(12);
  g = new makeGrid(wx, wy, SPACING, OFFSET);
  g.initGrid();
  g.generateCircles();
  strokeWeight(STROKE_WEIGHT)
  background(`rgb(${BACKGROUND_COLOR.join()})`)
}

function draw() {
  // Generate circles based on generated data
  // Very ugly code!
  g.circleArray.forEach((k) => {
    k.forEach((e) => {
      if (e.color === undefined) return
      if (e.isFilled) {
        fill(`rgb(${e.color.join()})`)
      } else {
        noFill()
      }
      stroke(`rgb(${e.color.join()})`)
      circle(e.x, e.y, e.diameter * e.increment)
      if (e.rings === 3) {
        circle(e.x, e.y, e.diameter * 0.666 * e.increment)
        circle(e.x, e.y, e.diameter * 0.333 * e.increment)
        fill(`rgb(${e.color.join()})`)
        circle(e.x, e.y, 2 * e.increment)  
        
        if (e.planet) {
          if(e.itemRandom <= 0.3) {
            circle(
              e.x + (e.diameter * 0.333 / 2) * Math.sin(e.planetOffset),
              e.y + (e.diameter * 0.333 / 2) * Math.cos(e.planetOffset),
              Math.round(5 - e.itemRandom) * e.increment
            )  
            movePlanets(e)
          } else if (e.itemRandom < 0.6) {
             circle(
              e.x + (e.diameter * 0.666 / 2) * Math.sin(e.planetOffset),
              e.y + (e.diameter * 0.666 / 2) * Math.cos(e.planetOffset),
              Math.round(5 - e.itemRandom) * e.increment
            )  
            movePlanets(e)       
          } else if (e.itemRandom < 0.9) {
             circle(
              e.x + (e.diameter / 2) * Math.sin(e.planetOffset),
              e.y + (e.diameter / 2) * Math.cos(e.planetOffset),
              Math.round(5 - e.itemRandom) * e.increment
            )  
            movePlanets(e)        
          } else {
            circle(
              e.x + (e.diameter * 0.333 / 2) * Math.sin(e.planetOffset + e.itemRandom),
              e.y + (e.diameter * 0.333 / 2) * Math.cos(e.planetOffset + e.itemRandom),
              Math.round(5 - e.itemRandom) * e.increment
            )  
            circle(
              e.x + (e.diameter * 0.666 / 2) * Math.sin(e.planetOffset - e.itemRandom),
              e.y + (e.diameter * 0.666 / 2) * Math.cos(e.planetOffset - e.itemRandom),
              Math.round(5 - e.itemRandom) * e.increment
            )  
            circle(
              e.x + (e.diameter / 2) * Math.sin(e.planetOffset),
              e.y + (e.diameter / 2) * Math.cos(e.planetOffset),
              Math.round(5 - e.itemRandom) * e.increment
            )  
            movePlanets(e)
          }
        }
      }
      if (e.rings === 2) {
        circle(e.x, e.y, e.diameter * 0.5 * e.increment)
        fill(`rgb(${e.color.join()})`)
        circle(e.x, e.y, 2 * e.increment)  
        circle(
          e.x + (e.diameter / 2) * Math.sin(e.planetOffset),
          e.y + (e.diameter / 2) * Math.cos(e.planetOffset),
          Math.round(5 - e.itemRandom) * e.increment
        )  
        movePlanets(e)
      }
      if (e.rings === 1) {
        fill(`rgb(${e.color.join()})`)
        circle(e.x, e.y, 2 * e.increment)          
      }
      if (e.shouldMakeLine) makeLine(e)
    })
  })
 
  loadPixels();
  let noiseAmount = 100;

  for(var y = 0; y < height; y++) {
    for(var x = 0; x < width; x++) {
      var index = (x + y * width)*4;
      if (
        pixels[index] === BACKGROUND_COLOR[0] &&
        pixels[index+1] === BACKGROUND_COLOR[1] &&
        pixels[index+2] === BACKGROUND_COLOR[2]
      ) {} else if (
        pixels[index] === 255 &&
        pixels[index+1] === 255 &&
        pixels[index+2] === 255
      ) {
        pixels[index] = BACKGROUND_COLOR[0]
        pixels[index+1] = BACKGROUND_COLOR[1]
        pixels[index+2] = BACKGROUND_COLOR[2]
      } else {
        const thisNoise = (noise(x/10.0, y/10.0) - 0.5) * 255

        pixels[index] += Math.max(0, Math.min(noiseAmount - thisNoise, 255))
        pixels[index+1] += Math.max(0, Math.min(noiseAmount - thisNoise, 255))
        pixels[index+2] += Math.max(0, Math.min(noiseAmount - thisNoise, 255))
        pixels[index+3] = 255
      }
    }
  }
  updatePixels()
}


function movePlanets (e) {
  if (ANIMATE_PLANETS) {
    e.planetOffset < (2 * Math.PI) ? e.planetOffset += 0.05 : e.planetOffset = 0 
  }
}

function makeLine(e) {
  const start = createVector(e.x, e.y);
  const direction = e.itemRandom < 0.5 ? -1 : 1;
  const distance = Math.round(e.itemRandom * 5)
  const end = createVector(e.x, (e.y + SPACING * distance * direction));
  const pixelsPerSegment = 0.25;
  let lineLength = start.dist(end);
  // Determine the number of segments, and make sure there is at least one.
  let segments = max(1, round(lineLength / pixelsPerSegment));
  // Determine the number of points, which is the number of segments + 1
  let points = 1 + segments;
  // We need to know the angle of the line so that we can determine the x
  // and y position for each point along the line, and when we offset based
  // on noise we do so perpendicular to the line.
  let angle = atan2(end.y - start.y, end.x - start.x);
  let xInterval = pixelsPerSegment * cos(angle);
  let yInterval = pixelsPerSegment * sin(angle);
  
  // for each point that is neither the start nor end point
  for (let i = 1; i < points - 1; i++) {
    // determine the x and y positions along the straight line
    let x = start.x + xInterval * i;
    let y = start.y + yInterval * i;
    stroke(`rgb(${e.color.join()})`)
    fill(`rgb(${e.color.join()})`)
    // if (Math.round(noise(x*50, y*50))) {
    // } else {
    //   noStroke()
    //   noFill()
    // }
    point(x, y);
  }
}