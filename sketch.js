let snakeX;
let snakeY;
let eggX;
let eggY;
let snakeGridW;
let snakeGridH;
let snakeLength;
let snakeDirection;
let wantedDirection;
const DIR_UP = 1;
const DIR_DOWN = 2;
const DIR_LEFT = 3;
const DIR_RIGHT = 4;
let lastTick;
let tickSpeedMs;
let minTickSpeedMs;
let changeTickSpeedMs;
let numEggs;
let isPlaying;
let numEggsEaten;

let soundEat;
let soundLose;
let soundWin;
let soundWow;

function preload() {
  soundFormats('mp3');
  soundEat = loadSound('snake_eat.mp3');
  soundWin = createAudio('snake_win.mp3');
  soundWow = loadSound('snake_win2.mp3');
  soundLose = loadSound('snake_lose.mp3');
}

function setup() {
  createCanvas(400, 400);
   
  snakeGridW = 15;
  snakeGridH = 15;
  
  viewportW = width;
  viewportH = height;
  
  scaleX = viewportW / snakeGridW;
  scaleY = viewportH / snakeGridH;
  
  snakeX = Array(snakeGridW * snakeGridH);
  snakeY = Array(snakeGridW * snakeGridH);
  
  //put snake in Array
  snakeLength = 3;
  snakeDirection = DIR_RIGHT;
  wantedDirection = null;
  snakeX[0] = Math.floor(snakeGridW / 2);
  snakeY[0] = Math.floor(snakeGridH / 2);
  snakeX[1] = snakeX[0] - 1;
  snakeY[1] = snakeY[0];
  snakeX[2] = snakeX[1] -1;
  snakeY[2] = snakeY[1]; 
  
  lastTick = millis();
  tickSpeedMs = 550;
  minTickSpeedMs = 50;
  numEggs = 25;
  changeTickSpeedMs = (tickSpeedMs - minTickSpeedMs) / numEggs;
  isPlaying = true;
  numEggsEaten = 0;
  
  moveEggNewPlace();
  
  soundWin.loop();
}

function viewX(snakeX) {
  return snakeX * scaleX;
}
function viewY(snakeY) {
  return snakeY * scaleY;
}

function draw() {
  if (isPlaying == false) {
    return;
  }
  let now = millis();
  if (now - lastTick >= tickSpeedMs) {
    tick();
    lastTick = now;
  }

  if (isPlaying) {
    background(200,255,0);
    drawSnake();
    drawEgg();
    drawScore();
  }
}

function tick() {
  moveSnake();
  wntedDirection = null;
}

function drawSnake() {
  rectMode(CORNER);
  for (let i = snakeLength - 1; i >= 0; i--) {
    if (i == 0) {
      fill(150);
    } else {
      fill(0);
    }
    rect(viewX(snakeX[i]), viewY(snakeY[i]), scaleX, scaleY);
  }
}

function drawEgg() {
  rectMode(CORNER);
  fill(255,200,0);
  rect(viewX(eggX), viewY(eggY), scaleX, scaleY);
}

function drawGameOver() {
  noStroke();
  fill(128,0,0,215);
  rect(0,0,400,400);
  
  fill(255,0,0);
  stroke(0);
  strokeWeight(4);
  textSize(90);
  textAlign(CENTER, CENTER);

  text("GAME OVER", 100, 100, 200, 200);
  
  drawScore();
}

function drawScore() {
  fill(0,255,255);
  stroke(0);
  strokeWeight(3);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Score:" + numEggsEaten, 100, 250, 200, 200);
  if (numEggsEaten >= 25) {
    fill(100,255,0)
    textSize(30);
    textAlign(CENTER, CENTER);
    text("You Win!", -25, 265, 200, 200);
    textSize(25);
    text("Can you grow longer?", 225, 240, 200, 200);
  }
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    //move up if not going down
    if (snakeDirection != DIR_DOWN) {
      wantedDirection = DIR_UP;
    }
  } else if (keyCode == DOWN_ARROW) {
    //move down if not going up
    if (snakeDirection != DIR_UP) {
      wantedDirection = DIR_DOWN;
    }
  } else if (keyCode == LEFT_ARROW) {
    //move left if not going right
    if (snakeDirection != DIR_RIGHT) {
      wantedDirection = DIR_LEFT;
    }
  } else if (keyCode == RIGHT_ARROW) {
    //move right if not going left
    if (snakeDirection != DIR_LEFT) {
      wantedDirection = DIR_RIGHT;
    }
  }
}

function isEggBeingEaten() {
  //is the egg in the same spot as the snake's head
  if (snakeX[0] == eggX && snakeY[0] == eggY) {
    return true;
  }
  return false;
}

function isSnakeEatingItself() {
  for (let i = 1; i < snakeLength; i++) {
    if (snakeX[0] == snakeX[i] && snakeY[0] == snakeY[i]) {
      return true;
    }
  }
  return false;
}

function moveSnake() {
  //move each bit of the snake forward
  for (let i = snakeLength - 1; i > 0; i--) {
    snakeX[i] = snakeX[i - 1];
    snakeY[i] = snakeY[i - 1];
  }
  if (wantedDirection != null) {
    snakeDirection = wantedDirection;
  }
  //move the head of the snake in a new direction
  if (snakeDirection == DIR_UP) {
    snakeY[0] = snakeY[0] - 1;
    if (snakeY[0] < 0) {
      snakeY[0] = snakeGridH - 1;
    }
  } else if (snakeDirection == DIR_DOWN) {
    snakeY[0] = snakeY[0] + 1;
    if (snakeY[0] > snakeGridH - 1) {
      snakeY[0] = 0;
    }
  } else if (snakeDirection == DIR_LEFT) {
    snakeX[0] = snakeX[0] - 1;
    if (snakeX[0] < 0) {
      snakeX[0] = snakeGridW - 1;
    }
  } else if (snakeDirection == DIR_RIGHT) {
    snakeX[0] = snakeX[0] + 1;
    if (snakeX[0] > snakeGridW - 1) {
      snakeX[0] = 0;
    }
  }
  
  if (isSnakeEatingItself()) {
    gameOver();
    return;
  }
  
  if (isEggBeingEaten()) {
    eatEgg();
  }
}

function eatEgg() {
  soundEat.play();
  moveEggNewPlace();
  numEggsEaten++;
  if (numEggsEaten < numEggs) {
    tickSpeedMs = tickSpeedMs - changeTickSpeedMs;
  }
  growSnake();
}

function gameOver() {
  isPlaying = false;
  soundWin.stop();
  if (numEggsEaten >= 25) {
    soundWow.play();
  } else soundLose.play();
  drawGameOver();
}

function moveEggNewPlace() {
  while (true) { 
    eggX = Math.floor(random(0, snakeGridW));
    eggY = Math.floor(random(0, snakeGridH));
    let eggOnSnake = false;
    for (let i = 0; i < snakeLength; i++) {
      if (eggX == snakeX[i] && eggY == snakeY[i]) {
        eggOnSnake = true;
        break;
      }
    }
    if (!eggOnSnake) {
      break;
    }
  }
}

function growSnake() {
  snakeX[snakeLength] = snakeX[snakeLength - 1];
  snakeY[snakeLength] = snakeY[snakeLength - 1];
  snakeLength++;
}