import styled from "styled-components";
import Button from "./Button";
import { useEffect, useRef, useState } from "react";
import { GameState, Strategy } from "./game-logic/model";
import { canDoMove, doMove, getStartField, getToFinishField, isBaseField, isFinishField, isNormalField, pieceProgress, skipMove } from "./game-logic/game-logic";
import { doStrategy, mostAdvancedPieceStrategy, randomStrategy } from "./game-logic/player-agents";

type Props = {
    className?: string;
    gameState: GameState;
    logger: (msg: string) => void
    setGameState: (gameState: GameState) => void
}

function SimulateControlPanel(props: Props) {
    const [rolledDice, setRolledDice] = useState<number | undefined>();
    const [availablePiecesToMove, setAvailablePiecesToMove] = useState<number[]>([]);
    const doMoveButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        onRolledDice();
    }, [])

    const onRolledDice = () => {
        const diceNumber = 1 + Math.floor(Math.random() * 6);
        props.logger("Dice throw: " + diceNumber)
        setRolledDice(diceNumber);

        // Calculate the available moves
        const currentPlayer = props.gameState.players[props.gameState.turn];
        const newAvailablePiecesToMove = currentPlayer.pieces.map((_, i) => [i, canDoMove(props.gameState, diceNumber, i)]).filter(p => p[1]).map(p => p[0] as number);
        setAvailablePiecesToMove(newAvailablePiecesToMove);
    }

    const onMovePiece = () => {
        if (rolledDice === undefined) {
            return;
        }

        if (availablePiecesToMove.length === 0) {
            props.logger("No move available - skip turn");
            skipMove(props.gameState, rolledDice, props.logger);
        }
        else {
            let pieceNumber = availablePiecesToMove[0];
            if (availablePiecesToMove.length > 1) {
                pieceNumber = doStrategy(props.gameState, availablePiecesToMove, rolledDice)
            }

            props.logger("Move Piece number: " + pieceNumber);
            doMove(props.gameState, rolledDice, pieceNumber, props.logger);
        }

        props.setGameState(props.gameState);
        setRolledDice(undefined);
        setAvailablePiecesToMove([])
        
        if(props.gameState.winner === undefined) {
            onRolledDice();
            setTimeout(() => doMoveButtonRef.current?.click(), 50);
        }
    }


    if (props.gameState.winner !== undefined) {
        return <Border className={props.className} >
            <STitle>{"Player '" + props.gameState.players[props.gameState.winner].name + "' won"}</STitle>
        </Border>
    }

    return <Border className={props.className} >
        <STitle>Control panel</STitle>
        <p>Turn: {props.gameState.players[props.gameState.turn].name}</p>

        <p>Rolled dice: {rolledDice}</p>
        <p>Available pieces to move: {availablePiecesToMove.map(p => props.gameState.players[props.gameState.turn].pieces[p]).join(", ")}</p>
        <SButton ref={doMoveButtonRef} text="Do Move" onClick={() => onMovePiece()}></SButton>
    </Border>
}

export default SimulateControlPanel

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
