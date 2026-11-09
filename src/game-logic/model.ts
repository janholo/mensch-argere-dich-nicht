
export enum Strategy {
    "Random",
    "MostAdvanced",
    "MostAdvancedAndTake",
    "MostBehindAndTake"
}

export type PlayerState = {
    number: number;
    name: string;
    pieces: number[];
    strategy?: Strategy;
}

export type GameState = {
    turn: number; // which player has the next turn
    winner: number | undefined;
    players: PlayerState[];
}

export type Field = {
    fieldNumber: number
    x: number;
    y: number;
    baseOfPlayer?: number | undefined;
    startFieldOfPlayer?: number | undefined;
    endFieldOfPlayer?: number | undefined;
}