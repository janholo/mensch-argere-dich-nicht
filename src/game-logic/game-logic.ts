import { Field, GameState } from "./model";

// Field numbers: 0 ... 39 normal fields
// 0, 10, 20, 30 -> from base fields
// 39, 9, 19, 29 -> to finish fields
// Field numbers: 40 ... 55 base fields
// Field numbers: 56 ... 71 finish fields

export function isNormalField(pos: number) {
    return pos >= 0 && pos <= 39;
}

export function isBaseField(pos: number) {
    return pos >= 40 && pos <= 55;
}

export function isFinishField(pos: number) {
    return pos >= 56 && pos <= 71;
}

export function pieceProgress(pos: number, startField: number) {
    if(isNormalField(pos)) {
        return pos < startField ? (pos - startField) + 40 : pos - startField; 
    }
    else if(isBaseField(pos)) {
        return -1000;
    }
    else if(isFinishField(pos)) {
        return pos;
    }
    else {
        throw "Something went wrong"
    }
}

export function initGameState(): GameState {
    return {
        turn: 0,
        winner: undefined,
        players: [
            {
                number: 0,
                name: "Player Red",
                pieces: [40, 41, 42, 43]
            },
            {
                number: 1,
                name: "Player Yellow",
                pieces: [44, 45, 46, 47]
            },
            {
                number: 2,
                name: "Player Green",
                pieces: [48, 49, 50, 51]
            },
            {
                number: 3,
                name: "Player Blue",
                pieces: [52, 53, 54, 55]
            }
        ]
    }
}

export function canDoMove(gameState: GameState, diceRoll: number, piece: number): boolean {
    const currentPlayer = gameState.players[gameState.turn];

    const start = currentPlayer.pieces[piece];

    const end = getFieldNumberAfterMove(start, gameState.turn, diceRoll)

    if (end === undefined) {
        return false;
    }

    for (const piece of currentPlayer.pieces) {
        if (piece === end) {
            // There is a piece at the target which belongs to this player
            return false;
        }
    }

    return true;
}

export function canTakePiece(gameState: GameState, diceRoll: number, piece: number): boolean {
    const currentPlayer = gameState.players[gameState.turn];

    const start = currentPlayer.pieces[piece];

    const end = getFieldNumberAfterMove(start, gameState.turn, diceRoll)

    if (end === undefined) {
        return false;
    }

    for( const player of gameState.players) {
        for (const piece of player.pieces) {
            if (piece === end && player.number !== gameState.turn) {
                // There is a piece at the target from another player
                return true;
            }
        }
    }

    return false;
}

export function doMove(gameState: GameState, diceRoll: number, piece: number, logger: (msg: string) => void) {
    const currentPlayer = gameState.players[gameState.turn];

    const start = currentPlayer.pieces[piece];

    const end = getFieldNumberAfterMove(start, gameState.turn, diceRoll)
    if (end === undefined) {
        throw "Error";
    }

    logger("Move piece at " + start + " to " + end);

    for (const player of gameState.players) {
        if (player.number === gameState.turn) {
            continue;
        }
        var i = 0
        for (var i = 0; i < player.pieces.length; i++) {
            const piece = player.pieces[i];
            if (piece === end) {
                // There is a piece at the target - move it to its start position
                player.pieces[i] = i + player.number * 4 + 40
                logger("Kicking out piece of player " + player.name)
            }
        }
    };

    currentPlayer.pieces[piece] = end;

    for(const player of gameState.players)
    {
        const isWinning = player.pieces.every(p => p >= 56 && p <= 71);
        if(isWinning)
        {
            gameState.winner = player.number;
            logger("Winner player " + player.name)
            return;
        }
    }

    if (diceRoll != 6) {
        gameState.turn = (gameState.turn + 1) % 4;
        logger("Turn: " + gameState.players[gameState.turn].name)
    }
}

export function skipMove(gameState: GameState, diceRoll: number, logger: (msg: string) => void) {
    if (diceRoll != 6) {
        gameState.turn = (gameState.turn + 1) % 4;
        logger("Turn: " + gameState.players[gameState.turn].name)
    }
}



function getFieldNumberAfterMove(start: number, turn: number, diceRoll: number): number | undefined {
    const toFinishField = getToFinishField(turn)
    const firstFinishField = 56 + (turn * 4)
    const lastFinishField = firstFinishField + 3

    if (isBaseField(start)) {
        // This is a base field
        // On 6 return the start field, otherwise undefined

        return diceRoll == 6 ? getStartField(turn) : undefined
    }
    else if (start >= firstFinishField && start <= lastFinishField) {
        const end = start + diceRoll

        if (end > lastFinishField) {
            // Overstepped in finish line
            return undefined;
        }

        return end;
    }
    else if (isNormalField(start)) {
        var end = start + diceRoll;

        if (end > toFinishField && start <= toFinishField) {
            // Move to end zone
            end = end - toFinishField + firstFinishField - 1
            if (end > lastFinishField) {
                // Overstepped in finish line
                return undefined;
            }

            return end;
        }

        return end % 40;
    }
    else {
        throw new Error("Something went wrong!");
    }

}

export function getToFinishField(turn: number): number {
    return (39 + (10 * turn)) % 40
}

export function getStartField(turn: number): number {
    return 10 * turn
}