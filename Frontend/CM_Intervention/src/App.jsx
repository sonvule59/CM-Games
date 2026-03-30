import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import LeisureHome from './Componets/leisureHome';
import RockClimbing from './Componets/rockClimbing';
import OutdoorsActivities from './Componets/outdoorsActivities';
import WalkingActivityDemo from './Componets/WalkingActivityDemo';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route when you hit "/" */}
        <Route path="/" element={<LeisureHome />} />
        

        {/* Individual routes for each mini‑game */}
        <Route path="/outdoors" element={<OutdoorsActivities />} />
        <Route path="/rock" element={<RockClimbing />} />
        <Route path="/walk" element={<WalkingActivityDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
