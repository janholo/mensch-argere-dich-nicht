import styled from "styled-components";
import Button from "./Button";
import { useState } from "react";

type Props = {
    className?: string
    logs: string[]
    onClearLogs: () => void
}

function LogBook(props: Props) {
    return <Border className={props.className} >
        <STitle>Logbook</STitle>
        <ButtonWrapper>
            <SButton text="Clear" onClick={() => props.onClearLogs()}></SButton>
        </ButtonWrapper>
        <SList>
            {props.logs.map((value, i) => <SListItem key={i}>{value}</SListItem>)}
        </SList>
    </Border>
}

export default LogBook

const Border = styled.div`
    border-style: solid;
    border-color: black;
    border-width: 3px;
    filter: drop-shadow(black 3px 3px 10px);
    background: white;

    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "title button"
      "log log";
    place-items: stretch;
    place-content: stretch;
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