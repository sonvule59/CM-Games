import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./Componets/OfficeGame" 
import './App.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import OfficeGame from './Componets/OfficeGame'
import RockClimbing from './Componets/rockClimbing'
import WalkingActivity from './Componets/WalkingActivity'
import IndoorDomesticActivity from './Componets/IndoorDomesticActivity'
import SwimmingActivity from './Componets/SwimmingActivity'
import OfficeGameStart from './Componets/OfficeGameStart.jsx'
import LeisureHome from './Componets/leisureHome.jsx'
import OutdoorsActivities from './Componets/leisureHome.jsx'


function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route when you hit "/" */}
        <Route path="/" element={<LeisureHome Start/>} />
        

        {/* Individual routes for each mini‑game */}
        <Route path="/outdoors" element={<OutdoorsActivities />} />
        <Route path="/rock" element={<RockClimbing />} />
        <Route path="/walk" element={<WalkingActivity />} />
        <Route path='/office/test' element = {<OfficeGame/>} /> 
        <Route path="/swim" element = {<SwimmingActivity /> } />
        <Route path="/indoor-domestic" element = {<IndoorDomesticActivity /> } />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
