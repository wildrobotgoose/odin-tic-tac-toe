function createPlayer(id, name) {
    return {id, name};
}

function createCell() {
    let occupiedBy = null;

    const occupy = function(occupier) {
        occupiedBy = occupier;
    }

    const isOccupied = function() {
        return occupiedBy != null;
    }

    const getOccupier = function() {
        return occupiedBy;
    }

    return {occupy, isOccupied, getOccupier};
}

function createBoard() {
    const board = new Array(3);
    for (let i = 0; i < 3; i++) {
        board[i] = new Array(3);
        for (let j = 0; j < 3; j++) {
            board[i][j] = createCell();
        }
    }

    const isMoveValid = function(row, column) {
        return !board[row][column].isOccupied();
    }

    const placeMove = function(playerId, row, column) {
        board[row][column].occupy(playerId);
    }

    const areOccupiedBySamePlayer = function(c1, c2, c3) {
        return c1.isOccupied() && c1.getOccupier() == c2.getOccupier() &&
            c1.getOccupier() == c3.getOccupier();
    }

    const getWinner = function() {
        for (let i = 0; i < 3; i++) {
            if (areOccupiedBySamePlayer(board[i][0], board[i][1], board[i][2]))
                return board[i][0].getOccupier();
        }

        for (let j = 0; j < 3; j++) {
            if (areOccupiedBySamePlayer(board[0][j], board[1][j], board[2][j]))
                return board[0][j].getOccupier();
        }

        if (areOccupiedBySamePlayer(board[0][0], board[1][1], board[2][2]))
            return board[0][0].getOccupier();

        if (areOccupiedBySamePlayer(board[2][0], board[1][1], board[0][2]))
            return board[2][0].getOccupier();

        return null;
    }

    const getBoardStatus = function() {
        const boardStatus = new Array(3);
        for (let i = 0; i < 3; i++) {
            boardStatus[i] = board[i].map(cell => cell.getOccupier());
        }
        return boardStatus;
    }

    return {isMoveValid, placeMove, getWinner, getBoardStatus};
}

function createGameController() {
    const board = createBoard();

    let totalTurns = 0;
    let activePlayer = 0;

    const switchTurn = function() {
        activePlayer = 1 - activePlayer;
    }

    const playRound = function(row, column) {
        if (board.isMoveValid(row, column)) {
            board.placeMove(activePlayer, row, column);

            totalTurns++;

            switchTurn();

            const winner = board.getWinner();
            if (winner !== null) {
                return winner;
            }
            else if (totalTurns == 9) {
                return "tie";
            }
            else {
                return null;
            }
        }
    }

    return {playRound, getBoard: board.getBoardStatus};
}

function createScreenController() {
    const boardDiv = document.querySelector(".board");
    const game = createGameController();
    let winner = null;

    const updateScreen = function() {
        const board = game.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellDiv = document.querySelector(
                    `.cell[data-row="${i}"][data-col="${j}"]`);
                if (board[i][j] == null) {
                    cellDiv.textContent = "";
                }
                else {
                    cellDiv.textContent = board[i][j];
                }
            }
        }

        if (winner !== null) {
            const resultDiv = document.querySelector(".result");
            if (winner == "tie") {
                resultDiv.textContent = "It's a tie!";
            }
            else {
                resultDiv.textContent = `${winner} wins!`;
            }
        }
    }

    const addClickHandlers = function() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellDiv = document.querySelector(
                    `.cell[data-row="${i}"][data-col="${j}"]`);
                cellDiv.addEventListener("click", () => {
                    winner = game.playRound(i, j);
                    updateScreen();
                });
            }
        }
    }

    addClickHandlers();


    updateScreen();
}

createScreenController();
