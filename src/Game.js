document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bricks = [];
var offSet = 10;
var brickWidth = 80;
var brickHeight = 30;
var wallHeight = canvas.height / 4;
var scoreTableHeight = 25;
var ball = {x: 300, y: 300, xVelocity: 2, yVelocity: 2};
var ballRadius = 10;
var ballTrace = 1;     //0 - without Trace,  1 - with Trace
var score = 0;
var lives = 10;
var isRightPressed = false;
var isLeftPressed = false;
var racket = {width: 150, height: 20, x: canvas.width / 2 - 75, y: canvas.height - 20};
var gameIsActive = true;

buildWall();
drawScores();

var intervalID = setInterval(function () {
    makeFrame();
}, 1);


//functions
function buildWall() {
    for (x = offSet; x < canvas.width - brickWidth; x += offSet + brickWidth) {
        for (y = offSet + scoreTableHeight; y < wallHeight; y += offSet + brickHeight) {
            bricks.push({x: x, y: y});
        }
    }
    bricks.forEach(function (brick) {
        ctx.fillStyle = "#" + Math.floor((1 << 24) * Math.random()).toString(16);
        ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
    });
}

function drawScores() {
    ctx.fillStyle = '#0bb';
    ctx.fillRect(0, 0, canvas.width, scoreTableHeight);
    ctx.font = "24px Times";
    ctx.fillStyle = "#000";
    ctx.fillText("Lives: " + lives, canvas.width - 100, 20);
    ctx.fillText("Scores: " + score, canvas.width - 250, 20);
    ctx.fillText("Press space to restart the game ", 50, 20);
}


function drawRacket() {

    if (isRightPressed === true && racket.x < canvas.width - racket.width) {
        racket.x += 5;
    } else if (isLeftPressed === true && racket.x > 0) {
        racket.x -= 5;
    }
    ctx.clearRect(0, racket.y, canvas.width, racket.height);
    ctx.fillStyle = '#0bb';
    ctx.fillRect(racket.x, racket.y, racket.width, racket.height);
}

function makeFrame() {
    eraseBall(ball.x, ball.y);
    ball.x += ball.xVelocity;
    ball.y += ball.yVelocity;
    detectCollision(ball);
    drawBall(ball.x, ball.y);
    drawRacket();
}

function remove(bricknumber) {
    var brick = bricks[bricknumber];
    ctx.clearRect(brick.x, brick.y, brickWidth, brickHeight);
    bricks.splice(bricknumber, 1);
}

function drawBall(x, y) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
}

function eraseBall(x, y) {
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(x, y, ballRadius + 1 - ballTrace, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
}

function detectCollision() {
    if (ball.x > canvas.width - ballRadius || ball.x < ballRadius) {
        ball.xVelocity = -ball.xVelocity;
    }
    if (ball.y < ballRadius + scoreTableHeight) {
        ball.yVelocity = -ball.yVelocity;
    }
    for (i = 0; i < bricks.length; i++) {
        brick = bricks[i];
        if ((ball.x > brick.x) && (ball.x < brick.x + brickWidth) && (ball.y < brick.y + brickHeight + ballRadius)) {
            ball.yVelocity = -ball.yVelocity;
            ball.xVelocity += randomDirection();
            remove(i);
            score++;
            drawScores();
            if (bricks.length === 0) {
                win();
            }
            break;
        }
    }
    if (ball.y > canvas.height - ballRadius) {
        ball.yVelocity = -ball.yVelocity;
        if (gameIsActive) {
            soundBoom();
            lives--;
            drawScores();
            if (lives === 0) {
                lose();
            }
        }
    }
    if (ball.y > racket.y - ballRadius && ball.x - ballRadius > racket.x && ball.x < racket.x + racket.width + ballRadius) {
        ball.yVelocity = -Math.abs(ball.yVelocity);
        if (gameIsActive) {
            soundPing();
        }
    }
}

function win() {
    gameIsActive = false;
    soundWin();
    var i = 1;
    setInterval(function () {
        ctx.fillStyle = '#0bb';
        ctx.fillRect(0, 0, canvas.width, 20 + i++);
        ctx.fillStyle = "#a00";
        ctx.font = "24px Times";
        ctx.fillText("Press space to restart the game ", 50, 20);
        ctx.font = '' + i + 'px Times';
        ctx.fillText("YOU WIN", 30, i);
    }, 150);
}
function lose() {
    clearInterval(intervalID);
    alert('Sorry, but you lose. Try again!');
    document.location.reload();
}

function randomDirection() {
    return Math.random() * 0.5 - 0.5;  //return (-0.25..0.25)
}
function mouseMoveHandler(event) {
    var relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > racket.width / 2 && relativeX < canvas.width - racket.width / 2) {
        racket.x = relativeX - racket.width / 2;
    }
}
function keyDownHandler(event) {
    if (event.keyCode == 39) {
        isRightPressed = true;
    }
    else if (event.keyCode == 37) {
        isLeftPressed = true;
    }
}
function keyUpHandler(event) {
    if (event.keyCode == 39) {
        isRightPressed = false;
    }
    else if (event.keyCode == 37) {
        isLeftPressed = false;
    }
    else if (event.keyCode == 32) {
        document.location.reload();
    }
}
function soundBoom() {
    var audio = new Audio();
    audio.src = 'sounds/steelsword.mp3';
    audio.autoplay = true;
    audio.volume = 0.2;
}
function soundPing() {
    var audio = new Audio();
    audio.src = 'sounds/woodbat.mp3';
    audio.autoplay = true;
    audio.volume = 0.05;
}
function soundWin() {
    var audio = new Audio();
    audio.src = 'sounds/Queen – We Are the Champions.mp3';
    audio.autoplay = true;
    audio.volume = 1;
}