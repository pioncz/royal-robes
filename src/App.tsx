import { useState } from 'react'
import GameComponent from './game/GameComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GameComponent />
    </>
  )
}

export default App
