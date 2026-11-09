import styled from "styled-components";
import Button from "./Button";
import { useState } from "react";
import { GameState } from "./game-logic/model";
import { canDoMove, doMove, skipMove } from "./game-logic/game-logic";

type Props = {
    className?: string;
    gameState: GameState;
    logger: (msg: string) => void
    setGameState: (gameState: GameState) => void
}

function ControlPanel(props: Props) {
    const [rolledDice, setRolledDice] = useState<number | undefined>();
    const [availablePiecesToMove, setAvailablePiecesToMove] = useState<number[]>([]);

    const onRolledDice = () => {
        const diceNumber = 1 + Math.floor(Math.random() * 6);
        props.logger("Dice throw: " + diceNumber)
        setRolledDice(diceNumber);

        // Calculate the available moves
        const currentPlayer = props.gameState.players[props.gameState.turn];
        const newAvailablePiecesToMove = currentPlayer.pieces.map((_, i) => [i, canDoMove(props.gameState, diceNumber, i)]).filter(p => p[1]).map(p => p[0] as number);
        setAvailablePiecesToMove(newAvailablePiecesToMove);
    }

    const onMovePiece = (pieceNumber: number) => {
        if (rolledDice === undefined) {
            return;
        }
        props.logger("Move Piece number: " + pieceNumber);
        doMove(props.gameState, rolledDice, pieceNumber, props.logger);
        props.setGameState(props.gameState);
        setRolledDice(undefined);
        setAvailablePiecesToMove([])

        onRolledDice();
    }

    const onSkipTurn = () => {
        if (rolledDice === undefined) {
            return;
        }
        props.logger("Skip turn");
        skipMove(props.gameState, rolledDice, props.logger);
        props.setGameState(props.gameState);
        setRolledDice(undefined);
        setAvailablePiecesToMove([]);

        onRolledDice();
    }

    if (props.gameState.winner !== undefined) {
        return <Border className={props.className} >
            <STitle>{"Player '" + props.gameState.players[props.gameState.winner].name + "' won" }</STitle>
        </Border>
    }

    return <Border className={props.className} >
        <STitle>Control panel</STitle>
        <p>Turn: {props.gameState.players[props.gameState.turn].name}</p>

        {rolledDice === undefined ?
            <SButton text="Roll Dice" onClick={() => {
                onRolledDice();

            }}></SButton> :
            <>
                <p>Rolled dice: {rolledDice}</p>
                <p>With which piece to you wanna move:</p>
                {availablePiecesToMove.map(p =>
                    <SButton text={"Move piece on field " + props.gameState.players[props.gameState.turn].pieces[p]} onClick={() => onMovePiece(p)}></SButton>)}
                {availablePiecesToMove.length == 0 && <SButton text="Skip Move" onClick={() => onSkipTurn()}></SButton>}
            </>}
    </Border>
}

export default ControlPanel

const Border = styled.div`
    border-style: solid;
    border-color: black;
    border-width: 3px;
    filter: drop-shadow(black 3px 3px 10px);
    background: white;
    padding: 13px;
`;

const SButton = styled(Button)`
`

const STitle = styled.p`
font-size: 14px;
font-weight: bold;
grid-area: title
`
