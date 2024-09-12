const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const newGameButton = document.getElementById('newGameButton');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const moveSound = document.getElementById('moveSound');
const winSound = document.getElementById('winSound');
const collisionSound = document.getElementById('collisionSound');

let isXTurn = true;
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let score = 0;
let timer;
let seconds = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes("") ? null : "draw";
}

function handleClick(event) {
    const cell = event.target;
    const index = Array.from(cells).indexOf(cell);

    if (!isGameActive || board[index]) {
        collisionSound.play();
        return;
    }

    board[index] = isXTurn ? "X" : "O";
    cell.textContent = board[index];
    cell.classList.add(isXTurn ? "x" : "o");
    cell.classList.add("animate");
    moveSound.play();

    const winner = checkWin();
    if (winner) {
        isGameActive = false;
        clearInterval(timer);  // Stop the timer when game ends
        if (winner === "draw") {
            status.textContent = "It's a draw!";
        } else {
            status.textContent = `Congratulations, ${winner} is the winner!`;
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            winSound.play();
        }
        newGameButton.style.display = 'block';  // Show the "New Game" button
        return;
    }

    isXTurn = !isXTurn;
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `Timer: ${seconds}s`;
    }, 1000);
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isXTurn = true;
    isGameActive = true;
    status.textContent = "";
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    seconds = 0;
    timerDisplay.textContent = `Timer: ${seconds}s`;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "animate");
    });

    clearInterval(timer);
    startTimer();
    newGameButton.style.display = 'none';  // Hide the "New Game" button on restart
}

function startNewGame() {
    restartGame();
    status.textContent = "";  // Clear previous game status
}

// Add click listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);
newGameButton.addEventListener('click', startNewGame);

// Start the timer when the page loads
startTimer();
