const board = document.querySelector("#board");

const cells = document.querySelectorAll(".cell");



const X_CLASS = "X";
const O_CLASS = "O";
let xScore = 0;
let oScore = 0;
let currentPlayer = X_CLASS;

let isOpponentAi = true;

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
        cell.addEventListener("click", handleClickCell);
    })

}

function resetBoard(){

    cells.forEach(cell => {
        cell.classList.remove(`${X_CLASS}`);
        cell.classList.remove(`${O_CLASS}`);
        cell.classList.remove('blink');
    })

    startGame();
}


function handleClickCell(e) {

    const cell = e.target;

    if (cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS) || (isOpponentAi && currentPlayer !== X_CLASS)) {
        return;
    }

    placeMarker(cell, currentPlayer)

    if(checkWin(currentPlayer)){
        handleScore(currentPlayer);
        cells.forEach(cell => {
            cell.removeEventListener("click", handleClickCell);
        });
    } else if (isDraw()) {
        alert("Draw!");
    } else {
        swapTurn();
        if(isOpponentAi){
            setTimeout(aiMove, 1000);
        }else{
            return;
        }
        
    }
}

function endGame() {
    if(currentPlayer === X_CLASS){
        alert("X's win");
    }else{
        alert("O's win");
    }
    
}

function handleScore(currentPlayer){

    const xScoreSpan = document.querySelector(".x-score");
    const oScoreSpan = document.querySelector(".o-score");

    if(currentPlayer === X_CLASS){
        xScore++;
        xScoreSpan.textContent = `${xScore}`;
        setTimeout(resetBoard, 2000)
        if(xScore === 3){
            endGame(); 
        }

    } else{
        oScore++;
        oScoreSpan.textContent = `${oScore}`;
        setTimeout(resetBoard, 2000)
        
        if(xScore === 3){
            endGame();
        }
    }

    
    const winningCombination = checkWin(currentPlayer);

    winningCombination.forEach(index => {
        cells[index].classList.add('blink');
    });

}

function placeMarker(cell, currentPlayer){
    cell.classList.add(currentPlayer);
}

function swapTurn(){
    const xLabel = document.querySelector("#x_label");
    const oLabel = document.querySelector("#o_label");

    currentPlayer = currentPlayer == X_CLASS ? O_CLASS : X_CLASS;

    if(currentPlayer == X_CLASS){
        oLabel.classList.remove("o_label_border");
        xLabel.classList.add("x_label_border");
    }else{
        xLabel.classList.remove("x_label_border");
        oLabel.classList.add("o_label_border");
    }
}

function checkWin(currentPlayer) {
    return winningCombos.find(combination => {
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
        handleScore(currentPlayer)
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
        handleScore(currentPlayer);
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


