const board = document.querySelector("#board");

const cells = document.querySelectorAll(".cell");

const X_CLASS = "X";
const O_CLASS = "O";
let currentPlayer = X_CLASS;

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

const Difficulty = {
    EASY: "easy",
    UNBEATABLE: "unbeatable"
};

let currentDifficulty = Difficulty.EASY;

startGame();

function startGame(){

    cells.forEach(cell => {
        cell.addEventListener("click", handleClickCell, {once: true});
    })

}
function handleClickCell(e) {
    const cell = e.target;
    placeMarker(cell, currentPlayer)
    if(checkWin(currentPlayer)){
        endGame();
    } else if (isDraw()) {
        alert("Draw!");
    } else {
        swapTurn();
        setTimeout(aiMove, 100);
    }
}

function endGame() {
    if(currentPlayer === X_CLASS){
        alert("X's win");
    }else{
        alert("O's win");
    }
    
}

function placeMarker(cell, currentPlayer){
    cell.classList.add(currentPlayer);
}

function swapTurn(){
    currentPlayer = currentPlayer == X_CLASS ? O_CLASS : X_CLASS;
}

function checkWin(currentPlayer) {
    return winningCombos.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentPlayer);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function aiMove() {

    if (currentDifficulty === Difficulty.EASY) {
        makeRandomMove();
    } else if (currentDifficulty === Difficulty.UNBEATABLE) {
        makeMinMaxMove();
    }
}

function makeRandomMove() {

    let emptyCells = [...cells].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let randomCell = emptyCells[randomIndex];
    placeMarker(randomCell, currentPlayer);

    if (checkWin(currentPlayer)) {
        endGame();
    } else if (isDraw()) {
        alert("Draw!");
    } else {
        swapTurn();
    }
}


function makeMinMaxMove() {
    let bestScore = -Infinity;
    let move;

    cells.forEach((cell, index) => {
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            cell.classList.add(currentPlayer);
            let score = minimax(cells, 0, false);
            cell.classList.remove(currentPlayer);
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    cells[move].classList.add(currentPlayer);
    cells[move].removeEventListener("click", handleClickCell);

    if (checkWin(currentPlayer)) {
        endGame();
    } else if (isDraw()) {
        alert("Draw!");
    } else {
        swapTurn();
    }
}

function minimax(cells, depth, isMaximizing) {

    if (checkWin(X_CLASS)) {
        return -10;
    } else if (checkWin(O_CLASS)) {
        return 10;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        cells.forEach((cell) => {
            if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
                cell.classList.add(O_CLASS);
                let score = minimax(cells, depth + 1, false);
                cell.classList.remove(O_CLASS);
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;

    } else {
        let bestScore = Infinity;
        cells.forEach((cell) => {
            if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
                cell.classList.add(X_CLASS);
                let score = minimax(cells, depth + 1, true);
                cell.classList.remove(X_CLASS);
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }

}


