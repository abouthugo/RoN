import GlassSteppingStones from '../components/Game/GlassSteppingStones'
import GreenLightRedLight from '../components/Game/GreenLightRedLight'
import NumberGuesser from '../components/Game/NumberGuesser'
import { useState } from 'react'

export default function GamePage() {
  const [selectedGame, setSelectedGame] = useState(null)

  const handleGameSelection = (event) => {
    setSelectedGame(event.target.value)
  }

  return (
    <>
      <select
        onChange={handleGameSelection}
        className="select select-bordered w-full max-w-xs"
        defaultValue="none"
      >
        <option disabled value="none">
          Select a game to test
        </option>
        <option value="GreenLightRedLight">Green Light Red Light</option>
        <option value="NumberGuesser">Number Guesser</option>
        <option value="GlassSteppingStones">Glass Stepping Stones</option>
      </select>
      {selectedGame === 'GreenLightRedLight' && <GreenLightRedLight />}
      {selectedGame === 'NumberGuesser' && <NumberGuesser />}
      {selectedGame === 'GlassSteppingStones' && <GlassSteppingStones />}
    </>
  )
}
