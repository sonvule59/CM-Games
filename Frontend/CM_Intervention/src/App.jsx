import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./Componets/OfficeGame" 
import './App.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import OfficeGame from './Componets/OfficeGame'
import WalkingActivityDemo from './Componets/WalkingActivityDemo'
import RockClimbing from './Componets/rockClimbing'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/office" element = {<OfficeGame/>} />
      <Route path="/walk" element = {<WalkingActivityDemo />} />
      <Route path="/rock" element = {<RockClimbing /> } />
    </Routes>
    </BrowserRouter>
  
  )
}

export default App
