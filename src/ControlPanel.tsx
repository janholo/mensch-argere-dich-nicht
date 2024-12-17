import styled from "styled-components";
import Button from "./Button";
import { useEffect, useState } from "react";
import { GameState } from "./game-logic/model";

type Props = {
    className?: string;
    gameState: GameState;
    logger: (msg: string) => void
}

function ControlPanel(props: Props) {
    const [rolledDice, setRolledDice] = useState<number | undefined>()
    
    useEffect(() => {
        props.logger("Turn: " + props.gameState.players[props.gameState.turn].name)
        setRolledDice(undefined);
    }, [props.gameState.turn])

    return <Border className={props.className} >
        <STitle>Control panel</STitle>
        <p>Turn: {props.gameState.players[props.gameState.turn].name}</p>

        {rolledDice === undefined ? 
            <SButton text="Roll Dice" onClick={() => {
                const v = 1 + Math.floor(Math.random() * 6);
                setRolledDice(v);
                props.logger("Dice throw: " + v)
            }}></SButton> :
            <p>Rolled dice: {rolledDice}</p>}        
    </Border>
}

export default ControlPanel

const Border = styled.div`
    border-style: solid;
    border-color: black;
    border-width: 3px;
    filter: drop-shadow(black 3px 3px 10px);
    background: white;
`;

const ButtonWrapper = styled.div`
grid-area: button;
align-self: center;
margin: 0px 13px 0px 0px;
`

const SButton = styled(Button)`
`

const STitle = styled.p`
margin: 13px;
font-size: 14px;
font-weight: bold;
grid-area: title
`

const SList = styled.ul`
margin: 0px 13px 13px 13px;
padding: 0px;
list-style-type: none;
grid-area: log;
overflow: scroll;
`

const SListItem = styled.li`
`