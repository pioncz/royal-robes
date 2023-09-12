import { useState } from 'react'
import './App.css'
import GameComponent from './game/GameComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      Royal Robes
      <GameComponent />
    </>
  )
}

export default App
