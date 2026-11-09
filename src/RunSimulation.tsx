import styled from "styled-components";
import { Strategy } from "./game-logic/model"
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";
import { initGameState } from "./game-logic/game-logic";
import Button from "./Button";
import { simulateGame, SimulationResult } from "./game-logic/player-agents";

function RunSimulation() {
  const [simulations, setSimulations] = useState<SimulationResult[]>([])
  const doSimulation = () => {
    let gs = initGameState()

    for(let playerIndex = 0; playerIndex < 4; playerIndex++) {

      const randomStrategy = Math.floor(Math.random() * 4) as Strategy;
    
      gs.players[playerIndex].name = Strategy[randomStrategy];
      gs.players[playerIndex].strategy = randomStrategy;
    }

    const result = simulateGame(gs);
    setSimulations(old => [...old, result]);
  };

  useEffect(() => {
    for(let i = 0; i < 1000; i++)
      doSimulation();
  }, [])

  const strategies = [ Strategy.Random, Strategy.MostAdvanced, Strategy.MostAdvancedAndTake, Strategy.MostBehindAndTake]

  const summary = [];

  for(let strat of strategies) {
    const stratWinCount = simulations.filter(s => s.winner === strat).length;
    summary.push(`${Strategy[strat]}: ${stratWinCount}/${simulations.length}`)
  }
  
  return <div>
    <h1>Run Simulations</h1>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <RootGrid>
        <SControl>
          <Button text="Run next simulation" onClick={() => doSimulation()} />
        </SControl>
        <SSimulationResults>
          <SList>
            {simulations.map((s, i) => {
              if (s.winner === undefined) {
                <SListItem>Not yet ready</SListItem>
              }

              return <SListItem key={i}>{s.playerStrategy.map((strat, i) => i == s.winner ? <SWinnerP>{Strategy[strat]}</SWinnerP> : <SNonWinnerP>{Strategy[strat]}</SNonWinnerP>)}</SListItem>
            })}
          </SList>
        </SSimulationResults>
        <SSimulationOverview>
            {summary.map(s => <p>{s}</p>)}
        </SSimulationOverview>
      </RootGrid>
    </ErrorBoundary>
  </div>
}

export default RunSimulation

const RootGrid = styled.div`
display: grid;
grid-template-columns: 3fr 1fr;
grid-template-rows: 50px 1fr;
grid-template-areas: 
  "results control"
  "results overview";
grid-gap: 10px;
place-items: stretch;
place-content: stretch;
`

const SControl = styled.div`
grid-area: control;
`

const SSimulationResults = styled.div`
grid-area: results;
`

const SSimulationOverview = styled.div`
grid-area: overview
`

const SList = styled.ul`
margin: 0px 13px 13px 13px;
padding: 0px;
list-style-type: none;
grid-area: log;
overflow: scroll;
`

const SListItem = styled.li`
display: flex;
gap: 10px;
`

const SNonWinnerP = styled.p`
margin: 4px 0px;
`

const SWinnerP = styled(SNonWinnerP)`
color: red;
`