import { useEffect, useState } from 'react'

type HintValues = 'not taken' | 'taken' | 'ignored'
type GuessValues = number | undefined
export default function NumberGuesser() {
  const [gameState, setgameState] = useState(generateRandomGrid())
  const [hintTaken, setHintTaken] = useState<HintValues>('not taken')
  const [guess, setGuess] = useState<GuessValues>(undefined)
  const [guessLocked, setGuessLocked] = useState(true)
  const [gameOver, setGameOver] = useState(false)

  const getSelection = (): { count: number; items: number[] } => {
    return gameState.reduce(
      (a, b) =>
        b.selected ? { count: a.count + 1, items: [...a.items, b.number] } : a,
      { count: 0, items: [] }
    )
  }

  const getItem = (n: number) => {
    return gameState.find((i) => i.number === n)
  }

  const getSum = () => getSelection().items.reduce((a, b) => a + b)

  const handleOnHintTaken = () => {
    const indexes = getRandomNumbers(2, 0, 8)
    console.log(indexes)
    const newGameState = gameState.map((item, i) => {
      if (indexes.indexOf(i) >= 0) {
        return {
          ...item,
          released: true,
          masked: false
        }
      }
      return item
    })
    setgameState(newGameState)
    setHintTaken('taken')
  }

  const handleOnItemClicked = (n: number) => {
    const selection = getSelection()
    const incomingItem = getItem(n)
    let newState
    if (incomingItem.released && !incomingItem.selected) {
      console.log('this ran')
      // set the other released item to disabled
      newState = gameState.map((i) => {
        if (i.released && i.number !== incomingItem.number) {
          return { ...i, disabled: true }
        }
        return i
      })
    } else if (incomingItem.released && incomingItem.selected) {
      // re enable the other released item
      newState = gameState.map((i) => {
        if (i.released && i.number !== incomingItem.number) {
          return { ...i, disabled: false }
        }
        return i
      })
    }

    if (selection.count < 2) {
      const mapper = (item) => {
        if (item.number === n) {
          return {
            ...item,
            selected: item.released ? !item.selected : true,
            masked: false
          }
        }
        return item
      }
      const newGameState = newState
        ? newState.map(mapper)
        : gameState.map(mapper)
      setgameState(newGameState)
      if (hintTaken !== 'taken') setHintTaken('ignored')
      if (hintTaken === 'taken' && selection.count < 1) setGuessLocked(false)
    }

    if (
      selection.count === 1 &&
      selection.items.indexOf(incomingItem.number) < 0
    ) {
      setGameOver(true)
    }
  }

  const handleOnGameOver = () => {
    const newGameState = gameState.map((i) => {
      return { ...i, masked: false }
    })

    setgameState(newGameState)
  }

  const handleLockItDown = () => {
    if (typeof guess === 'number') setGuessLocked(true)
  }

  const GridItems = gameState.map((i) => {
    return (
      <div
        onClick={() => {
          if (i.disabled || !guessLocked) return
          handleOnItemClicked(i.number)
        }}
        key={i.number}
        className={`cursor-pointer w-20 h-20 bg-neutral rounded-lg p-2 text-2xl flex justify-center items-center 
        ${i.released && !i.disabled && 'text-accent'} 
        ${i.selected && 'bg-neutral-focus border-double border-2 border-white'} 
        ${i.selected && gameOver && getSum() !== guess && 'border-yellow-400'} 
        ${i.selected && gameOver && getSum() === guess && 'border-green-400'} 
        ${i.disabled && 'cursor-not-allowed bg-slate-900 text-slate-600'}
        ${!guessLocked && 'cursor-not-allowed'}
        ${
          gameOver &&
          !i.selected &&
          'bg-slate-900 border-2 border-double border-neutral'
        }
        `}
      >
        {i.masked ? '' : i.number}
      </div>
    )
  })

  const message = () => {
    switch (true) {
      case gameOver && guess && getSum() === guess:
        return '👀 Holy cow you guessed it! Enjoy your 30 points'
      case gameOver:
        return `You get ${
          hintTaken === 'taken' ? getSum() / 2 : getSum()
        } points.`
      case hintTaken === 'taken' && getSelection().count > 0 && guessLocked:
        return 'Select your last cell'
      case hintTaken === 'taken' && getSelection().count > 0:
        return 'You need to type your guess before selecting the next cell. If you guess right you get 30 points'
      case hintTaken === 'taken':
        return 'You can select one of the revealed cells'
      case getSelection().count > 0:
        return 'Select another cell to claim your points'
      default:
        return 'Select a cell to reveal a number or attempt to guess'
    }
  }

  return (
    <div className="hero min-h-screen ">
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <div
            className="mt-5"
            style={{
              display: hintTaken === 'taken' && !guessLocked ? '' : 'none'
            }}
          >
            <div className="flex flex-wrap items-center justify-center">
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="#"
                    className="input input-bordered text-xl w-20"
                    value={guess}
                    onChange={(e) => setGuess(Number(e.target.value))}
                  />
                  <button className="btn" onClick={handleLockItDown}>
                    Lock it down
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="mb-5 text-2xl font-bold">{message()}</p>
          <div className="grid grid-cols-3 gap-4 w-72 mx-auto">{GridItems}</div>
          <button
            className="btn btn-accent mt-6"
            onClick={handleOnHintTaken}
            style={{
              display: hintTaken === 'taken' ? 'none' : '',
              visibility: hintTaken === 'ignored' ? 'hidden' : 'visible'
            }}
          >
            attempt to guess the number
          </button>
        </div>
        {gameOver && <GameOverComponent onGameOver={handleOnGameOver} />}
      </div>
    </div>
  )
}

/**
 * Creates an array of Grid Items with randomly assigned numbers
 * @returns
 */
function generateRandomGrid(): GridItemState[] {
  return getRandomNumbers(9, 1, 9).map(GridItemStateGenerator)
}

function getRandomNumbers(n: number, low: number, high: number) {
  const seen = []
  const getRand = () => Math.floor(Math.random() * high + low)
  for (let i = 0; i < n; i++) {
    let candidate = getRand()
    while (true) {
      if (seen.indexOf(candidate) >= 0) {
        candidate = getRand()
      } else {
        seen.push(candidate)
        break
      }
    }
  }
  return seen
}

/**
 * Creates the structured data object for the grid item
 * @param n number that acts as sort of an id in this case
 * @returns
 */
function GridItemStateGenerator(n: number): GridItemState {
  return {
    number: n,
    masked: true,
    selected: false,
    released: false,
    disabled: false
  }
}

type GridItemState = {
  number: number
  masked: boolean
  selected: boolean
  released: boolean
  disabled: boolean
}

// Helper empty component to trigger the game over state after one render cycle
function GameOverComponent({ onGameOver }) {
  useEffect(() => {
    console.log('this should have ran')
    onGameOver()
  }, [])

  return <></>
}
