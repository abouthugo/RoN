import { useEffect, useState } from 'react'
import Layout from './Layout'
import styles from '../../styles/Game.module.css'

const initialPosition = 100
const speed = 1
const initialTimeRemaining = 30
export default function GreenLightRedLight() {
  const [color, setColor] = useState('red')
  const [position, setPosition] = useState(initialPosition)
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining((timeRemaining) => timeRemaining - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  const reset = () => {
    setPosition(initialPosition)
    setColor('red')
    stopMoving()
    setTimeRemaining(initialTimeRemaining)
    setTimer(null)
  }
  const goUp = () => {
    setPosition((position) => position + speed)
  }
  const move = () => {
    const t = setInterval(goUp, 5)
    setTimer(t)
  }

  const stopMoving = () => {
    clearInterval(timer)
  }
  const onMouseDown = () => {
    setColor('green')
    move()
  }

  const onMouseUp = () => {
    setColor('red')
    stopMoving()
  }

  if (
    typeof window !== 'undefined' &&
    window.innerHeight - (position + 50) <= 0
  ) {
    stopMoving()
    return (
      <>
        <button onClick={reset}>Reset</button>
        <h1>You won!</h1>
      </>
    )
  }

  return (
    <Layout>
      Time remaining: {timeRemaining} seconds
      <div className={styles.finishline}></div>
      <button onClick={() => setPosition(initialPosition)}>Reset</button>
      <div
        className={styles.character}
        style={{ background: color, bottom: position }}
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

function useTimer(setState) {}
