import styled from "styled-components";
import Board from "./Board"
import { GameState, Strategy } from "./game-logic/model"
import { ErrorBoundary } from "react-error-boundary";
import LogBook from "./LogBook";
import { useState } from "react";
import { initGameState } from "./game-logic/game-logic";
import SimulateControlPanel from "./SimulateControlPanel";

function SimulatePlay() {
  const [logs, setLogs] = useState<string[]>([])
  const [gameState, setGameState] = useState<GameState>(() => {
    let gs = initGameState()
    gs.players[0].name = "Random";
    gs.players[0].strategy = Strategy.Random;
    gs.players[1].name = "Most advanced first";
    gs.players[1].strategy = Strategy.MostAdvanced;
    gs.players[2].name = "Take then most advanced";
    gs.players[2].strategy = Strategy.MostAdvancedAndTake;
    gs.players[3].name = "Take then most behind peace";
    gs.players[3].strategy = Strategy.MostBehindAndTake;
    return gs;
})

  return <div>
    <h1>Simulate Strategies</h1>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <RootGrid>
        <SBoard gameState={gameState}></SBoard>
        <SLogBook logs={logs} onClearLogs={() => setLogs([])} />
        <SSimulateControlPanel gameState={gameState} setGameState={setGameState} logger={newMsg => setLogs(prevLogs => [...prevLogs, newMsg])} />
      </RootGrid>
    </ErrorBoundary>

  </div>
}

export default SimulatePlay

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

const SSimulateControlPanel = styled(SimulateControlPanel)`
grid-area: control;
`

const SLogBook = styled(LogBook)`
grid-area: log;
`