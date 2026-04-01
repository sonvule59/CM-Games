import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./Componets/OfficeGame" 
import './App.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import OfficeGame from './Componets/OfficeGame'
import WalkingActivityDemo from './Componets/WalkingActivityDemo.tsx'
import RockClimbing from './Componets/rockClimbing'
import OfficeGameStart from './Componets/OfficeGameStart.jsx'
import LeisureHome from './Componets/leisureHome.jsx'
import OutdoorsActivities from "./Componets/outdoorsActivities"


function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home page routes */}
        <Route path="/" element={<LeisureHome Start/>} />
        <Route path='/office' element={<OfficeGameStart />} />
        

        {/* Individual routes for each mini‑game */}
        <Route path="/outdoors" element={<OutdoorsActivities />} />
        <Route path="/rock" element={<RockClimbing />} />
        <Route path="/walk" element={<WalkingActivityDemo />} />
        <Route path='/office/test' element = {<OfficeGame/>} /> 

    </Routes>
    </BrowserRouter>
  );
}

export default App;
