import { useEffect, useState } from 'react'
import Layout from './Layout'
import styles from '../../styles/Game.module.css'

const initialPosition = 75
const initialTimeRemaining = 30
export default function GreenLightRedLight() {
  const [speed, setSpeed] = useState(1)
  const [motionState, setMotionState] = useState('idle')
  const [position, setPosition] = useState(initialPosition)
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining)
  const [timer, setTimer] = useState(null)
  const [light, setLight] = useState('red')
  const [illegalMove, setIllegalMove] = useState(light === 'red')
  const [gameover, setGameover] = useState(false)

  // Countdown + Light Switch logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining((timeRemaining) => timeRemaining - 1)
        // semaphore logic here
        if (timeRemaining % 5 === 0) {
          setLight('green')
          setIllegalMove(false)
        } else if (timeRemaining % 3 === 0 || timeRemaining % 7 === 0) {
          setLight('red')
          setTimeout(() => setIllegalMove(true), 700)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  // Game over logic
  useEffect(() => {
    if (
      illegalMove &&
      motionState === 'moving' &&
      !(window.innerHeight - (position + 50) <= 0)
    ) {
      setGameover(true)
    }
  }, [illegalMove, motionState, gameover, position])

  const reset = () => {
    setPosition(initialPosition)
    setMotionState('idle')
    stopMoving()
    setTimeRemaining(initialTimeRemaining)
    setTimer(null)
  }

  const move = () => {
    const t = setInterval(() => {
      setPosition((position) => position + speed)
    }, 10)
    setTimer(t)
  }

  const stopMoving = () => {
    clearInterval(timer)
  }
  const onMouseDown = () => {
    setMotionState('moving')
    move()
  }

  const onMouseUp = () => {
    setMotionState('idle')
    stopMoving()
  }

  if (gameover) return <GameOverScreen />
  if (
    typeof window !== 'undefined' &&
    window.innerHeight - (position + 50) <= 0
  ) {
    stopMoving()
    return <CongratsScreen onLoad={() => setMotionState('idle')} />
  }

  if (timeRemaining < 1) return <GameOverScreen />

  const style = {
    '--value': 100 * ((timeRemaining - 1) / initialTimeRemaining),
    '--thickness': '2px'
  } as React.CSSProperties
  return (
    <Layout>
      <div className="grid justify-end pt-4">
        <div className="radial-progress" style={style}>
          {timeRemaining - 1}s
        </div>
        <Semaphore light={light} />
      </div>
      <div className={styles.finishline}></div>
      <div className="absolute bottom-1 left-1">
        <button onClick={() => reset()} className="btn btn-primary">
          Reset
        </button>
      </div>
      <div
        className={`${
          motionState === 'idle' ? 'bg-primary' : 'bg-primary-focus'
        } absolute w-10 h-10 rounded-full left-[calc(50%_-_1.25rem)]`}
        style={{ bottom: position }}
      ></div>
      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        className={styles.pressbtn}
      >
        Move
      </div>
    </Layout>
  )
}

function Semaphore({ light }) {
  const greenComponent = (
    <>
      <div className="absolute w-10 h-10 left-[calc(50%_-_1.25rem)] rounded-full top-5 blur bg-green-400"></div>
      <div className="absolute w-10 h-10 left-[calc(50%_-_1.25rem)] rounded-full top-5 bg-green-400"></div>
    </>
  )

  const redComponent = (
    <>
      <div className="absolute w-10 h-10 left-[calc(50%_-_1.25rem)] rounded-full top-5 blur bg-red-500"></div>
      <div className="absolute w-10 h-10 left-[calc(50%_-_1.25rem)] rounded-full top-5 bg-red-500"></div>
    </>
  )
  return (
    <div className="absolute w-20 h-20 bg-black left-1 rounded-md">
      {light === 'red' ? redComponent : greenComponent}
    </div>
  )
}

function GameOverScreen() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold pb-2">❌</h1>
          <h1 className="text-5xl font-bold">GG = Get Good</h1>
          <p className="py-6">Better luck next time</p>
        </div>
      </div>
    </div>
  )
}

function CongratsScreen({ onLoad }) {
  useEffect(() => {
    onLoad()
  }, [onLoad])
  return (
    <div className="hero min-h-screen bg-green-400">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold pb-2">🎊🎉🎊</h1>
          <h1 className="text-5xl font-bold text-black">Well done champ!</h1>
        </div>
      </div>
    </div>
  )
}
