
export type PlayerState = {
    number: number;
    name: string;
    pieces: number[];
}

export type GameState = {
    turn: number; // which player has the next turn
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