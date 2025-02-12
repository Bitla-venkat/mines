const gridSize = 5;
const totalTiles = gridSize * gridSize;
const initialCredits = 1000;
let credits = initialCredits;
let stake = 100;
let numMines = 3;
let grid = [];
let gameOver = false;
let multiplier = 1.0;
let revealedTiles = 0;

document.addEventListener("DOMContentLoaded", () => {
    createUI();
    startGame();
});

function createUI() {
    const gameContainer = document.getElementById("game-container");
    
    let creditsDisplay = document.createElement("div");
    creditsDisplay.id = "credits";
    creditsDisplay.innerText = `Credits: ${credits}`;
    gameContainer.appendChild(creditsDisplay);
    
    let multiplierDisplay = document.createElement("div");
    multiplierDisplay.id = "multiplier";
    multiplierDisplay.innerText = `Multiplier: x${multiplier.toFixed(2)}`;
    gameContainer.appendChild(multiplierDisplay);
    
    let stakeInput = document.createElement("input");
    stakeInput.id = "stake-input";
    stakeInput.type = "number";
    stakeInput.min = "10";
    stakeInput.value = stake;
    stakeInput.onchange = (e) => adjustStake(e.target.value);
    gameContainer.appendChild(stakeInput);
    
    let gridContainer = document.createElement("div");
    gridContainer.id = "grid";
    gameContainer.appendChild(gridContainer);
    
    let cashoutButton = document.createElement("button");
    cashoutButton.id = "cashout-button";
    cashoutButton.innerText = "Cash Out";
    cashoutButton.onclick = cashOut;
    gameContainer.appendChild(cashoutButton);
    
    let restartButton = document.createElement("button");
    restartButton.id = "restart-button";
    restartButton.innerText = "Restart Game";
    restartButton.onclick = startGame;
    gameContainer.appendChild(restartButton);
}

function startGame() {
    gameOver = false;
    multiplier = 1.0;
    revealedTiles = 0;
    document.getElementById("credits").innerText = `Credits: ${credits}`;
    document.getElementById("multiplier").innerText = `Multiplier: x${multiplier.toFixed(2)}`;
    generateGrid();
    renderGrid();
}

function generateGrid() {
    grid = Array(totalTiles).fill(0);
    let minePositions = new Set();
    while (minePositions.size < numMines) {
        minePositions.add(Math.floor(Math.random() * totalTiles));
    }
    minePositions.forEach(pos => grid[pos] = 1);
}

function renderGrid() {
    const gridContainer = document.getElementById("grid");
    gridContainer.innerHTML = "";
    grid.forEach((val, index) => {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.onclick = () => revealTile(index, tile);
        gridContainer.appendChild(tile);
    });
}

function adjustStake(amount) {
    let newStake = parseInt(amount);
    if (newStake >= 10 && newStake <= credits) {
        stake = newStake;
    }
}

function revealTile(index, tile) {
    if (gameOver || grid[index] === -1) return;
    
    if (grid[index] === 1) {
        gameOver = true;
        tile.style.backgroundColor = "red";
        tile.innerText = "💣";
        credits -= stake; // Deduct stake amount on loss
        document.getElementById("credits").innerText = `Credits: ${credits}`;
        alert("Boom! You hit a mine and lost your stake.");
    } else {
        revealedTiles++;
        multiplier = 1 + (revealedTiles * 0.3);
        document.getElementById("multiplier").innerText = `Multiplier: x${multiplier.toFixed(2)}`;
        tile.style.backgroundColor = "green";
        tile.innerText = "✔";
        grid[index] = -1;
    }
}

function cashOut() {
    if (gameOver) return;
    let winnings = stake * multiplier;
    credits += winnings;
    document.getElementById("credits").innerText = `Credits: ${credits}`;
    alert(`You cashed out with ${winnings.toFixed(2)} credits!`);
    startGame();
}
