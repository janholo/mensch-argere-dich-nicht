import { canDoMove, canTakePiece, doMove, getStartField, pieceProgress, skipMove } from "./game-logic";
import { GameState, Strategy } from "./model";

export function doStrategy(gameState: GameState, availablePiecesToMove: number[], diceRoll: number) {
    const currentPlayer = gameState.players[gameState.turn];
    if (currentPlayer.strategy === Strategy.Random) {
        return randomStrategy(availablePiecesToMove);
    }
    if (currentPlayer.strategy === Strategy.MostAdvanced) {

        return mostAdvancedPieceStrategy(gameState, availablePiecesToMove);
    }
    if (currentPlayer.strategy === Strategy.MostAdvancedAndTake) {

        return mostAdvancedPieceAndTakeStrategy(gameState, availablePiecesToMove, diceRoll);
    }
    if (currentPlayer.strategy === Strategy.MostBehindAndTake) {

        return mostBehindPieceAndTakeStrategy(gameState, availablePiecesToMove, diceRoll);
    }

    throw "Invalid strategy"
}

export function randomStrategy(availablePiecesToMove: number[]): number {
    return availablePiecesToMove[Math.floor(Math.random() * availablePiecesToMove.length)]
}

export function mostAdvancedPieceStrategy(gameState: GameState, availablePiecesToMove: number[]): number {
    const startField = getStartField(gameState.turn);
    const currentPlayer = gameState.players[gameState.turn];

    let mostAdvancedPiece = availablePiecesToMove[0];
    let mostAdvancedPieceProgress = -1000;

    for (const p of availablePiecesToMove) {
        const pos = currentPlayer.pieces[p];
        const progress = pieceProgress(pos, startField);
        if (progress > mostAdvancedPieceProgress) {
            mostAdvancedPiece = p;
            mostAdvancedPieceProgress = progress
        }
    }

    return mostAdvancedPiece;
}

export function mostAdvancedPieceAndTakeStrategy(gameState: GameState, availablePiecesToMove: number[], diceRoll: number): number {
    const startField = getStartField(gameState.turn);
    const currentPlayer = gameState.players[gameState.turn];

    let mostAdvancedPiece = availablePiecesToMove[0];
    let mostAdvancedPieceProgress = -1000;

    for (const p of availablePiecesToMove) {
        const pos = currentPlayer.pieces[p];
        let progress = pieceProgress(pos, startField);
        if (canTakePiece(gameState, diceRoll, p)) {
            // If we can take we add a large number to the "progress" metric
            progress = progress + 10000;
        }
        if (progress > mostAdvancedPieceProgress) {
            mostAdvancedPiece = p;
            mostAdvancedPieceProgress = progress
        }
    }

    return mostAdvancedPiece;
}

export function mostBehindPieceAndTakeStrategy(gameState: GameState, availablePiecesToMove: number[], diceRoll: number): number {
    const startField = getStartField(gameState.turn);
    const currentPlayer = gameState.players[gameState.turn];

    let leastAdvancedPiece = availablePiecesToMove[0];
    let leastAdvancedPieceProgress = 1000;

    for (const p of availablePiecesToMove) {
        const pos = currentPlayer.pieces[p];
        let progress = pieceProgress(pos, startField);
        if (canTakePiece(gameState, diceRoll, p)) {
            // If we can take we subtract a large number from the "progress" metric
            progress = progress - 10000;
        }
        if (progress < leastAdvancedPieceProgress) {
            leastAdvancedPiece = p;
            leastAdvancedPieceProgress = progress
        }
    }

    return leastAdvancedPiece;
}

export type SimulationResult = {
    playerStrategy: Strategy[];
    winner?: number;
}

export function simulateGame(gameState: GameState): SimulationResult {
    while (true) {
        if (gameState.winner !== undefined) {
            break;
        }

        const rolledDice = 1 + Math.floor(Math.random() * 6);

        const currentPlayer = gameState.players[gameState.turn];
        const availablePiecesToMove = currentPlayer.pieces.map((_, i) => [i, canDoMove(gameState, rolledDice, i)]).filter(p => p[1]).map(p => p[0] as number);

        if (availablePiecesToMove.length === 0) {
            skipMove(gameState, rolledDice, _ => { });
        }
        else {
            let pieceNumber = availablePiecesToMove[0];
            if (availablePiecesToMove.length > 1) {
                pieceNumber = doStrategy(gameState, availablePiecesToMove, rolledDice)
            }

            doMove(gameState, rolledDice, pieceNumber, _ => {});
        }
    }

    const newSimu = {
        playerStrategy: gameState.players.map(p => p.strategy!),
        winner: gameState.winner!
    }

    return newSimu;
}