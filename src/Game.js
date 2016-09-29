document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bricks = [];
var ball = {x: 300, y: 300, xVelocity: 2, yVelocity: 2};
var offSet = 10;
var brickWidth = 80;
var brickHeight = 30;
var ballRadius = 10;
var score = 0;
var isRightPressed = false;
var isLeftPressed = false;


for (x = offSet; x < canvas.width - brickWidth; x += offSet + brickWidth) {
    for (y = offSet; y < 200; y += offSet + brickHeight) {
        bricks.push({x: x, y: y});
    }
}

bricks.forEach(function (brick) {
    ctx.fillStyle = "#" + Math.floor((1 << 24) * Math.random()).toString(16);
    ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
});

setInterval(function () {
    moveBall(ball)
}, 1)

function moveBall(ball) {
    eraseBall(ball.x, ball.y);
    ball.x += ball.xVelocity;
    ball.y += ball.yVelocity;
    detectCollision(ball)
    drawBall(ball.x, ball.y)
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
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
}

function detectCollision(ball) {
    if (ball.x > 1190 || ball.x < 10) {
        ball.xVelocity = -ball.xVelocity;
    }
    if (ball.y > 790 || ball.y < 10) {
        ball.yVelocity = -ball.yVelocity;
    }

    for (i = 0; i < bricks.length; i++) {
        brick = bricks[i];
        if ((ball.x > brick.x) && (ball.x < brick.x + brickWidth) && (ball.y < brick.y + brickHeight + ballRadius)) {
            ball.yVelocity = -ball.yVelocity;
            ball.xVelocity += randomDirection();
            remove(i);
            score++;
            break;
        }
    }
}
function randomDirection() {
    return Math.random() * 0.5 - 0.5  //return (-0.25..0.25)
}

function mouseMoveHandler(event) {
var relativeX = event.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;

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
}

