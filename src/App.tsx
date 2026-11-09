import styled from "styled-components";
import ManualPlay from "./ManualPlay";
import Button from "./Button";
import { useState } from "react";
import SimulatePlay from "./SimulatePlay";
import RunSimulation from "./RunSimulation";

function App() {
  const [tab, setTab] = useState<number>(0);

return <div>
    <SNav>
      <SNavButton selected={tab === 0} text="Manual Play" onClick={() => setTab(0)}></SNavButton>
      <SNavButton selected={tab === 1} text="Simulate Play" onClick={() => setTab(1)}></SNavButton>
      <SNavButton selected={tab === 2} text="Run Simulations" onClick={() => setTab(2)}></SNavButton>
    </SNav>
    <SContent>
      {tab === 0 ? <ManualPlay></ManualPlay> : <></>}
      {tab === 1 ? <SimulatePlay></SimulatePlay> : <></>}
      {tab === 2 ? <RunSimulation></RunSimulation> : <></>}
    </SContent>

  </div>
}

export default App

const SNav = styled.div`
`

const SNavButton = styled(Button)`
margin-right: 10px;
`

const SContent = styled.div`
`
