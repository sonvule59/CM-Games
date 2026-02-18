import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RockClimbing from './rockClimbing.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Add whatever here as you need */}
      <RockClimbing />
    </>
  )
}

export default App
