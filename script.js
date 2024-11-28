const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const url = "https://kool.krister.ee/chat/snake-game";
const username = prompt('Your name');

const box = 20;
const canvasSize = 400;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";

function sendHighScore(name, score) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, message: `Game Over! High Score: ${score}` })
    });
}

async function fetchHighScores() {
    const response = await fetch(url);
    const json = await response.json();

    console.log(json);

    const sortedScores = json
        .map(item => {
            const scoreMatch = item.message.match(/High Score: (\d+)/);
            const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
            return { ...item, score };
        })
        .sort((a, b) => b.score - a.score)


    const topScores = sortedScores.slice(0, 10);

    const highscoresDiv = document.getElementById("highscores");
    highscoresDiv.innerHTML = "";

    if (topScores.length > 0) {
        topScores.forEach((item) => {
            const scoreElement = document.createElement("p");
            scoreElement.textContent = `${item.name}: ${item.message}`;
            highscoresDiv.appendChild(scoreElement);
        });
    } else {
        highscoresDiv.innerHTML = "No high scores available.";
    }
}

window.onload = function() {
    fetchHighScores();
};

function resetGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = generateFood();
    score = 0;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 200);
}

let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
};
let score = 0;


document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT")
        direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN")
        direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT")
        direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP")
        direction = "DOWN";
}


function draw() {

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "darkgreen" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box,
        };
    } else {
console.log("HERE");

        snake.pop();
    }


    const newHead = { x: snakeX, y: snakeY };


    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || snake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)) {
        clearInterval(game);
        
        alert("Game Over! Your score: " + score);

        sendHighScore(username, score);
        return;

    }

    snake.unshift(newHead);


    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, canvasSize - 10);
}
const resetButton = document.querySelector(".reset");

// Add a click event listener to the reset button
resetButton.addEventListener("click", () => {
    // Reload the page
    location.reload();
});

let game = setInterval(draw, 200);
