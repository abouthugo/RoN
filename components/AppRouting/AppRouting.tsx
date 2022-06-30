import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { GlobalCtx } from '../../context/GlobalCtx'
import Register from '../Forms/Register'
import GlassSteppingStones from '../Game/GlassSteppingStones'
import GreenLightRedLight from '../Game/GreenLightRedLight'
import NumberGuesser from '../Game/NumberGuesser'

export default function AppRouting({ children }) {
  const { state } = useContext(GlobalCtx)
  const { name, gameState } = state

  if (name === null || name.length < 2) return <Register />
  if (!gameState || (gameState && !gameState.open)) return <LockedOut />

  switch (gameState.activeModule) {
    case 'GLRL': {
      const title = 'Green Light Red Light'
      return (
        <SafeStart title={title}>
          <GreenLightRedLight />
        </SafeStart>
      )
    }
    case 'NMGR': {
      const title = 'Up next: Number Guesser'
      return (
        <SafeStart title={title}>
          <NumberGuesser />
        </SafeStart>
      )
    }
    case 'SPSN': {
      const title = 'Our last game: Stepping Stones'
      return (
        <SafeStart title={title}>
          <GlassSteppingStones />
        </SafeStart>
      )
    }
    default:
      return <>{children}</>
  }
}

function SafeStart({ title, children }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [count, setCount] = useState(5)

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setCount((count) => count - 1)
    }, 1000)
    setTimeout(() => {
      clearInterval(intervalRef)
      setGameStarted(true)
    }, 5000)
  }, [])

  if (gameStarted) return <>{children}</>

  return (
    <div className="hero min-h-screen">
      <div className="hero-content">
        <div className="grid gap-4">
          <h2 className="text-2xl">{title}</h2>
          <p className="text-sm">Game starts in {count}s</p>
          <progress
            className="progress w-56 progress-primary transition-all"
            value={count}
            max="5"
          ></progress>
        </div>
      </div>
    </div>
  )
}

function LockedOut() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content">
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold text-center">
            The server is currently closed
          </h2>
          <Image
            alt="swing"
            src="/SwingingDoodle.png"
            width="1024"
            height="768"
          />
        </div>
      </div>
    </div>
  )
}
