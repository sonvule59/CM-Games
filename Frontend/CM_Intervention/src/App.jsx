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


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/office" element = {<OfficeGameStart/>} />
      <Route path="/walk" element = {<WalkingActivityDemo />} />
      <Route path="/rock" element = {<RockClimbing /> } />
      <Route path='/office/test' element = {<OfficeGame/>} /> 
    </Routes>
    </BrowserRouter>
  
  )
}

export default App
