document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bricks = [];
var offSet = 10;
var brickWidth = 80;
var brickHeight = 30;
var wallHeight = 100;
var scoreTableHeight = 25;
var ball = {x: 300, y: 300, xVelocity: 2, yVelocity: 2};
var ballRadius = 10;
var ballTrace = 1;     //0 - without Trace,  1 - with Trace
var score = 0;
var lives = 10;
var isRightPressed = false;
var isLeftPressed = false;
var racket = {width: 150, height: 20, x: canvas.width / 2 - 75, y: canvas.height - 20};


for (x = offSet; x < canvas.width - brickWidth; x += offSet + brickWidth) {
    for (y = offSet + scoreTableHeight; y < wallHeight; y += offSet + brickHeight) {
        bricks.push({x: x, y: y});
    }
}

bricks.forEach(function (brick) {
    ctx.fillStyle = "#" + Math.floor((1 << 24) * Math.random()).toString(16);
    ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
});

function drawScores() {
    ctx.fillStyle = '#0bb';
    ctx.fillRect(0, 0, canvas.width, scoreTableHeight);
    ctx.font = "24px Times";
    ctx.fillStyle = "#000";
    ctx.fillText("Lives: " + lives, canvas.width - 100, 20);
    ctx.fillText("Scores: " + score, canvas.width - 250, 20);
    ctx.fillText("press space to restart the game ", 50, 20);
}


function drawRacket(racket) {
    if (isRightPressed === true && racket.x < canvas.width - racket.width) {
        ctx.clearRect(racket.x, racket.y, racket.width, racket.height);
        racket.x += 5;
        ctx.fillStyle = '#0bb';
        ctx.fillRect(racket.x, racket.y, racket.width, racket.height);
    } else if (isLeftPressed === true && racket.x > 0) {
        ctx.clearRect(racket.x, racket.y, racket.width, racket.height);
        racket.x -= 5;
        ctx.fillStyle = '#0bb';
        ctx.fillRect(racket.x, racket.y, racket.width, racket.height);
    }
}


var intervalID = setInterval(function () {
    makeFrame();
}, 1);


function makeFrame() {
    eraseBall(ball.x, ball.y);
    ball.x += ball.xVelocity;
    ball.y += ball.yVelocity;
    detectCollision(ball);
    drawBall(ball.x, ball.y);
    drawRacket(racket);
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

function detectCollision(ball) {
    if (ball.x > canvas.width - ballRadius || ball.x < ballRadius) {
        ball.xVelocity = -ball.xVelocity;
    }
    if (ball.y > canvas.height - ballRadius || ball.y < ballRadius + scoreTableHeight) {
        ball.yVelocity = -ball.yVelocity;
        // soundBoom();
        soundPing();
        lives--;
        if (lives === 0) {
            lose();
        }
        drawScores();
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
}
function randomDirection() {
    return Math.random() * 0.5 - 0.5;  //return (-0.25..0.25)
}

function mouseMoveHandler(event) {
    var relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        racket.x = relativeX - racket.width / 2;
        drawRacket(racket);

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

function win() {
    //  clearInterval(intervalID);
    var audio = new Audio();
    audio.src = 'Queen – We Are the Champions.mp3';
    audio.autoplay = true;

    var i = 1;
    setInterval(function () {
        ctx.fillStyle = '#0bb';
        ctx.fillRect(0, scoreTableHeight, canvas.width, 20 + i++);
        ctx.fillStyle = "#a00";
        ctx.font = '' + i + 'px Times';
        ctx.fillText("YOU WIN", 30, i + 23);
    }, 150);
}

function soundBoom() {
    var audio = new Audio();
    audio.src = 'steelsword.mp3';
    audio.autoplay = true;
}
function soundPing() {
    var audio = new Audio();
    audio.src = 'woodbat.mp3';
    audio.autoplay = true;
}