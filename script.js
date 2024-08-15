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

    const printBoard = function() {
        for (let i = 0; i < 3; i++) {
            console.log(board[i].map(cell =>
                cell.isOccupied() ? cell.getOccupier() : '.'));
        }
    }

    return {isMoveValid, placeMove, getWinner, printBoard};
}

function createGameController() {
    const board = createBoard();

    const players = [createPlayer(1, "Player One"),
                     createPlayer(2, "Player Two")];

    let totalTurns = 0;
    let currentTurn = 0;

    const switchTurn = function() {
        currentTurn = 1 - currentTurn;
    }

    const playRound = function(row, column) {
        if (board.isMoveValid(row, column)) {
            board.placeMove(players[currentTurn].id, row, column);
            board.printBoard();

            totalTurns++;
            const winnerId = board.getWinner();
            if (winnerId !== null) {
                const winner = players.find(player => player.id == winnerId);
                console.log(`${winner.name} wins!`);
            }
            else if (totalTurns == 9) {
                console.log("It's a tie!");
            }

            switchTurn();
        }
    }

    return {playRound};
}
