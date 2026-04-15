import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import OfficeGame from './Componets/OfficeGame'
import RockClimbing from './Componets/rockClimbing'
import WalkingActivity from './Componets/WalkingActivity'
import IndoorDomesticActivity from './Componets/IndoorDomesticActivity'
import SwimmingActivity from './Componets/SwimmingActivity'
import OfficeGameStart from './Componets/OfficeGameStart.jsx'
import OutdoorsActivities from './Componets/outdoorsActivities.jsx'
import LeisureHome from './Componets/leisureHome.jsx'
import TransportGame from './Componets/TransportGame.jsx'
import ParkingLot from './Componets/ParkingLot.jsx'
import TransportGame2 from './Componets/TransportGame2.jsx'
import DomesticHome from './Componets/domesticHome.jsx'
import OutsideDomestic from './Componets/outsideDomestic.jsx'
import HomeOfHomePages from './Componets/homeOfHomePages.jsx'
import MindfulnessHome from './Componets/mindfulnessHome.jsx'
import MindfulnessGame from './Componets/mindfulnessGame.jsx'


function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Top-level hub */}
        <Route path="/" element={<HomeOfHomePages />} />
        <Route path="/leisure" element={<LeisureHome />} />
        <Route path='/office' element={<OfficeGameStart />} />
        <Route path="/mindfulness-home" element={<MindfulnessHome />} />
        <Route path="/mindfulness" element={<MindfulnessGame />} />

        {/* Individual routes for each mini‑game */}
        <Route path="/outdoors" element={<OutdoorsActivities />} />
        <Route path="/rock" element={<RockClimbing />} />
        <Route path="/walk" element={<WalkingActivity />} />
        <Route path='/office/test' element = {<OfficeGame/>} /> 
        <Route path="/swim" element = {<SwimmingActivity /> } />
        <Route path="/indoor-domestic" element = {<IndoorDomesticActivity /> } />
        <Route path="/domestic-home" element={<DomesticHome />} />
        <Route path="/outside-domestic" element={<OutsideDomestic />} />
        <Route path='/transport' element={<TransportGame />} />
        <Route path="/parking" element={<ParkingLot />} />
        <Route path='/transport2' element={<TransportGame2 />} />

    </Routes>
    </BrowserRouter>
  );
}

export default App;
