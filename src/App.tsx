import styled from "styled-components";
import Board from "./Board"
import { GameState } from "./game-logic/model"
import { ErrorBoundary } from "react-error-boundary";
import LogBook from "./LogBook";
import ControlPanel from "./ControlPanel";
import { useState } from "react";

function App() {
  const [logs, setLogs] = useState<string[]>([])

  const gameState: GameState = {
    turn: 0,
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

  return <div>
    <h1>Mensch ärgere dich nicht!</h1>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <RootGrid>
        <SBoard gameState={gameState}></SBoard>
        <SLogBook logs={logs} onClearLogs={_ => setLogs([])} />
        <SControlPanel gameState={gameState} logger={newMsg => setLogs([...logs, newMsg])} />
      </RootGrid>
    </ErrorBoundary>

  </div>
}

export default App

const RootGrid = styled.div`
display: grid;
grid-template-columns: 510px 1fr;
grid-template-rows: 250px 250px;
grid-template-areas: 
  "board control"
  "board log";
grid-gap: 10px;
place-items: stretch;
place-content: stretch;
`

const SBoard = styled(Board)`
grid-area: board;
`

const SControlPanel = styled(ControlPanel)`
grid-area: control;
`

const SLogBook = styled(LogBook)`
grid-area: log;
`