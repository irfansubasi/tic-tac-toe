// Selecting DOM elements
const board = document.querySelector("#board");
const cells = document.querySelectorAll(".cell");
const aiButton = document.getElementById("player2-ai");
const humanButton = document.getElementById("player2-human");
const startButton = document.querySelector(".start-btn");
const game = document.getElementById("game");
const startScreen = document.getElementById("start-screen");
const announce = document.querySelector(".announce p");
const dialog = document.querySelector("dialog");
const restartButton = document.getElementById("restart-btn");
const aiDiffButton = document.querySelector(".diff");

// Constants for player classes
const X_CLASS = "X";
const O_CLASS = "O";

// Variables to track scores and current player
let xScore = 0;
let oScore = 0;
let currentPlayer = X_CLASS;

// Boolean to determine if the opponent is AI
let isOpponentAi = true;

// Winning combinations
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// AI difficulty levels
const Difficulty = {
    EASY: "easy",
    UNBEATABLE: "unbeatable"
};

// Default difficulty level
let currentDifficulty = Difficulty.EASY;

// Function to start the game
function startGame(){

    // If it's AI's turn, let AI make a move
    if(currentPlayer == O_CLASS && isOpponentAi){
        aiMove();
    }
    // Add event listeners to cells
    cells.forEach(cell => {
        cell.addEventListener("click", handleClickCell);
    })

    // Show game section and hide start screen
    game.style.display = "flex";
    startScreen.style.display = "none";

}

// Function to reset the board
function resetBoard(){

    // Remove all markers and blink class from cells
    cells.forEach(cell => {
        cell.classList.remove(`${X_CLASS}`);
        cell.classList.remove(`${O_CLASS}`);
        cell.classList.remove('blink');
    })

    // Start the game again
    startGame();
}

// Event listener for restart button
restartButton.addEventListener("click", () => {
    dialog.close();
    location.reload();
})

// Function to handle cell click event
function handleClickCell(e) {
    // Get the clicked cell
    const cell = e.target;

    // If the cell already has X or O class, or if it's AI's turn and the current player is not X, return
    if (cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS) || (isOpponentAi && currentPlayer !== X_CLASS)) {
        return;
    }

    // Place marker on the clicked cell
    placeMarker(cell, currentPlayer)

    // Check if the current player has won
    if(checkWin(currentPlayer)){
        // Handle score and remove click event listeners from all cells
        handleScore(currentPlayer);
        cells.forEach(cell => {
            cell.removeEventListener("click", handleClickCell);
        });
    } else if (isDraw()) {
        // If it's a draw
        // Reset the board after 2 seconds
        setTimeout(resetBoard, 2000);
    } else {
        // If the game continues
        // Swap turn
        swapTurn();
        if(isOpponentAi){
            // If opponent is AI, wait for 1 second and let AI make a move
            setTimeout(aiMove, 1000);
        }else{
            return;
        }
        
    }
}

// Function to handle score after a win
function handleScore(currentPlayer){
    // Select score elements
    const xScoreSpan = document.querySelector(".x-score");
    const oScoreSpan = document.querySelector(".o-score");
    // Update scores based on current player
    if(currentPlayer === X_CLASS){
        xScore++;
        xScoreSpan.textContent = xScore;
        setTimeout(resetBoard, 2000)
        if(xScore === 3){
            endGame(); 
        }

    } else{
        oScore++;
        oScoreSpan.textContent = oScore;
        setTimeout(resetBoard, 2000)
        
        if(oScore === 3){
            endGame();
        }
    }

    // Highlight winning combination cells
    const winningCombination = checkWin(currentPlayer);
    winningCombination.forEach(index => {
        cells[index].classList.add('blink');
    });

}

// Function to place marker on a cell
function placeMarker(cell, currentPlayer){
    cell.classList.add(currentPlayer);
}

// Function to swap player turn
function swapTurn(){
    // Select X and O labels
    const xLabel = document.querySelector("#x_label");
    const oLabel = document.querySelector("#o_label");
    // Change current player
    currentPlayer = currentPlayer == X_CLASS ? O_CLASS : X_CLASS;
    // Toggle label borders based on current player
    if(currentPlayer == X_CLASS){
        oLabel.classList.remove("o_label_border");
        xLabel.classList.add("x_label_border");
    }else{
        xLabel.classList.remove("x_label_border");
        oLabel.classList.add("o_label_border");
    }
}

// Function to check winning combination
function checkWin(currentPlayer) {
    return winningCombos.find(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentPlayer);
        });
    });
}

// Function to check if it's a draw
function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// Function for AI move
function aiMove() {
    // Depending on difficulty, choose the appropriate move
    if (currentDifficulty === Difficulty.EASY) {
        makeRandomMove();
    } else if (currentDifficulty === Difficulty.UNBEATABLE) {
        makeMinMaxMove();
    }
}

// Function for AI's random move
function makeRandomMove() {
    // Filter empty cells
    let emptyCells = [...cells].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    // Get a random index from the array of empty cells
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    // Get the random cell using the random index
    let randomCell = emptyCells[randomIndex];
    // Place marker on the random cell
    placeMarker(randomCell, currentPlayer);

    if (checkWin(currentPlayer)) {
        handleScore(currentPlayer)
    } else if (isDraw()) {
        setTimeout(resetBoard, 2000);
    } else {
        swapTurn();
    }
}

// Function for AI's move using Minimax algorithm
function makeMinMaxMove() {
    // Initialize variables to track the best score and the move
    let bestScore = -Infinity;
    let move;

    // Loop through each cell
    cells.forEach((cell, index) => {
        // Check if the cell is empty
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            // Try placing the current player's marker on the cell
            cell.classList.add(currentPlayer);
            // Use the Minimax algorithm to calculate the score for the move
            let score = minimax(cells, 0, false);
            // Remove the marker from the cell to backtrack
            cell.classList.remove(currentPlayer);
            // Update the best score and move if the current move is better
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    // Place the current player's marker on the cell with the best move
    cells[move].classList.add(currentPlayer);
    // Remove the click event listener from the cell to prevent further interaction
    cells[move].removeEventListener("click", handleClickCell);

    if (checkWin(currentPlayer)) {
        handleScore(currentPlayer);
    } else if (isDraw()) {
        setTimeout(resetBoard, 2000);
    } else {
        swapTurn();
    }
}

// Function for Minimax algorithm
function minimax(cells, depth, isMaximizing) {

    // Check for terminal states (win, lose, draw)
    if (checkWin(X_CLASS)) {
        return -10; // X wins
    } else if (checkWin(O_CLASS)) {
        return 10; // O wins
    } else if (isDraw()) {
        return 0; // Draw
    }

    // Recursive search for the best move
    if (isMaximizing) {
        let bestScore = -Infinity;
        cells.forEach((cell) => {
            if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
                // Try placing O's marker
                cell.classList.add(O_CLASS);
                // Recursive call for minimizing player (X)
                let score = minimax(cells, depth + 1, false);
                // Undo the move
                cell.classList.remove(O_CLASS);
                // Update the best score
                bestScore = Math.max(score, bestScore);
            }
        });
        // Return the best score for maximizing player (O)
        return bestScore;

    } else {
        let bestScore = Infinity;
        cells.forEach((cell) => {
            if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
                // Try placing X's marker
                cell.classList.add(X_CLASS);
                // Recursive call for maximizing player (O)
                let score = minimax(cells, depth + 1, true);
                // Undo the move
                cell.classList.remove(X_CLASS);
                // Update the best score
                bestScore = Math.min(score, bestScore);
            }
        });
        // Return the best score for minimizing player (X)
        return bestScore;
    }

}

// Function to set up game based on opponent type
function setupGame(state){

    isOpponentAi = state;

}

// Function to end the game and display the result
function endGame() {
    // Show the dialog modal
    dialog.showModal();

    // Set the announcement text based on the winner
    if(currentPlayer === X_CLASS){
        announce.textContent = `X's Win!`;
    }else{
        announce.textContent = `O's Win!`;
    }
    
}

// Event listener for human button
humanButton.addEventListener("click", function() {
    setupGame(false);
    // Highlight selected button
    this.style.backgroundColor = "white";
    this.style.color = "black";
    this.style.transform = "scale(1.12)";
    // Reset style for AI button
    aiButton.style.backgroundColor = "";
    aiButton.style.color = "";
    aiButton.style.transform = "";
    // Hide AI difficulty button
    aiDiffButton.style.display = "none";
});

// Event listener for AI button
aiButton.addEventListener("click", function() {
    setupGame(true);
    // Highlight selected button
    this.style.backgroundColor = "white";
    this.style.color = "black";
    this.style.transform = "scale(1.12)";
    // Reset style for human button
    humanButton.style.backgroundColor = "";
    humanButton.style.color = "";
    humanButton.style.transform = "";
    // Show AI difficulty button
    aiDiffButton.style.display = "block";
});

// Event listener for start button
startButton.addEventListener("click", startGame);

// Event listener for AI difficulty button
aiDiffButton.addEventListener("click", toggleAIDifficulty);

// Function to toggle AI difficulty
function toggleAIDifficulty() {

    if (currentDifficulty === Difficulty.EASY) {
        currentDifficulty = Difficulty.UNBEATABLE;
        aiDiffButton.textContent = "AI: Unbeatable";
    } else {
        currentDifficulty = Difficulty.EASY;
        aiDiffButton.textContent = "AI: Easy";
    }
}

// Highlight AI button on page load
window.onload = () =>{
    aiButton.style.backgroundColor = "white";
    aiButton.style.color = "black";
    aiButton.style.transform = "scale(1.12)";
}