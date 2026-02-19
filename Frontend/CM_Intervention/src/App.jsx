import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./Componets/OfficeGame" 
import './App.css'
import OfficeGame from './Componets/OfficeGame'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <OfficeGame />
    </>
  )
}

export default App
