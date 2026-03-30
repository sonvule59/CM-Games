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
import SwimmingActivity from './Componets/SwimmingActivity'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/office" element = {<OfficeGame/>} />
      <Route path="/walk" element = {<WalkingActivity />} />
      <Route path="/rock" element = {<RockClimbing /> } />
      <Route path="/swim" element = {<SwimmingActivity /> } />
    </Routes>
    </BrowserRouter>
  
  )
}

export default App
