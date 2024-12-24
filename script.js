const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreValue");

canvas.width = 400;
canvas.height = 400;

const background = new Image();
background.src = 'background.png';

const playerImg = new Image();
playerImg.src = 'pacman.png';

const objectImg = new Image();
objectImg.src = 'Beer.png';

let score = 0;
let player = { x: 180, y: 350, width: 40, height: 40, speed: 20 };
let fallingObjects = [];
let gameOver = false;
let gameEndTime = 0;

function drawBackground() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawObject(obj) {
    ctx.drawImage(objectImg, obj.x, obj.y, obj.width, obj.height);
}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
    );
}

document.addEventListener("keydown", (e) => {
    if (!gameOver) {
        if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
        if (e.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += player.speed;
    }
});

function handleVirtualButton(direction) {
    if (!gameOver) {
        const step = 5.95; // Задаємо крок переміщення в 1 піксель
        if (direction === "left" && player.x > 0) player.x -= step;
        if (direction === "right" && player.x + player.width < canvas.width) player.x += step;
    }
}


let lastUpdateTime = 0;
function updateGame(timestamp) {
    if (gameOver) return;

    if (!lastUpdateTime) lastUpdateTime = timestamp;
    const delta = timestamp - lastUpdateTime;

    if (delta > 16) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();

        for (let i = 0; i < fallingObjects.length; i++) {
            let obj = fallingObjects[i];
            obj.y += obj.speed;

            if (checkCollision(player, obj)) {
                score++;
                scoreElement.textContent = score;
                fallingObjects.splice(i, 1);
                i--;
            } else if (obj.y > canvas.height) {
                fallingObjects.splice(i, 1);
                i--;
            } else {
                drawObject(obj);
            }
        }

        if (Math.random() < 0.05) createFallingObject();
        drawPlayer();

        lastUpdateTime = timestamp;
    }

    if (timestamp > gameEndTime) {
        endGame();
    } else {
        requestAnimationFrame(updateGame);
    }
}

function createFallingObject() {
    let x = Math.random() * (canvas.width - 20); // Випадкова позиція по X
    fallingObjects.push({
        x,
        y: 0,
        width: 20,
        height: 20,
        speed: 1 + Math.random() * 2 // Зменшена швидкість: від 1 до 2.5
    });
}

function endGame() {
    gameOver = true;
    alert("Час вичерпано! Ваш рахунок: " + score);
    document.getElementById("startButton").style.display = "block";
}

background.onload = playerImg.onload = objectImg.onload = () => {
    document.getElementById("startButton").addEventListener("click", function () {
        this.style.display = "none";
        score = 0;
        scoreElement.textContent = score;
        gameOver = false;
        gameEndTime = performance.now() + 60000;
        updateGame(performance.now());
    });

    // Віртуальні кнопки
    document.getElementById("btnLeft").addEventListener("click", () => handleVirtualButton("left"));
    document.getElementById("btnRight").addEventListener("click", () => handleVirtualButton("right"));
};
document.getElementById("leftButton").addEventListener("click", () => {
    if (!gameOver && player.x > 0) {
        player.x -= player.speed; // Використовуємо player.speed для кроку
    }
});

document.getElementById("rightButton").addEventListener("click", () => {
    if (!gameOver && player.x + player.width < canvas.width) {
        player.x += player.speed; // Використовуємо player.speed для кроку
    }
});
