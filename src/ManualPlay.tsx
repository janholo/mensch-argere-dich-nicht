import styled from "styled-components";
import Board from "./Board"
import { GameState } from "./game-logic/model"
import { ErrorBoundary } from "react-error-boundary";
import LogBook from "./LogBook";
import ControlPanel from "./ControlPanel";
import { useState } from "react";
import { initGameState } from "./game-logic/game-logic";

function ManualPlay() {
  const [logs, setLogs] = useState<string[]>([])

  const [gameState, setGameState] = useState<GameState>(initGameState())


  return <div>
    <h1>Mensch ärgere dich nicht!</h1>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <RootGrid>
        <SBoard gameState={gameState}></SBoard>
        <SLogBook logs={logs} onClearLogs={() => setLogs([])} />
        <SControlPanel gameState={gameState} setGameState={setGameState} logger={newMsg => setLogs(prevLogs => [...prevLogs, newMsg])} />
      </RootGrid>
    </ErrorBoundary>

  </div>
}

export default ManualPlay

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