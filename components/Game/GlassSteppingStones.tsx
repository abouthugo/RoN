import { useContext, useState } from 'react'
import { GlobalCtx } from '../../context/GlobalCtx'

const totalLevels = 4
const initialStack = generateStack(totalLevels)
const allowReset = false
export default function GlassSteppingStones() {
  const { state } = useContext(GlobalCtx)
  const [stack, setstack] = useState<StackItemType[]>(initialStack)
  const [activeLevel, setActiveLevel] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [firstTime, setFirstTime] = useState(true)

  const handleOnPick = (s: StackItemType, wing: 'r' | 'l') => {
    if (s.position > activeLevel) return
    if (firstTime) setFirstTime(false)
    const correctChoice =
      (wing === 'r' && s.bin === 0) || (s.bin === 1 && wing === 'l')
    const newStack = stack.map((si) => {
      if (si.position === s.position) {
        if (correctChoice) return { ...si, popped: true }
        else return { ...si, broken: wing } // here is game over for the player
      }
      return si
    })
    setstack(newStack)
    if (correctChoice) {
      if (activeLevel + 1 >= totalLevels) {
        setTimeout(() => {
          setGameOver(true)
          setActiveLevel(activeLevel + 1)
        }, 250)
      } else setActiveLevel(activeLevel + 1)
    } else
      setTimeout(() => {
        setGameOver(true)
        const score = () => {
          switch (activeLevel) {
            case 1:
              return 25
            case 2:
              return 50
            case 3:
              return 75
            case 4:
              return 150
          }
        }
        state.userSocket.updateScore(score(), 'SPSN')
        setActiveLevel(-1)
      }, 250)
  }
  const StackComp = () => {
    const bgSwitch = (n) => {
      switch (true) {
        case gameOver:
          return 'bg-neutral-focus'
        case n % 3 === 0:
          return 'bg-accent text-accent-content'
        case n % 3 === 2:
          return 'bg-secondary text-secondary-content'
        default:
          return 'bg-primary text-primary-content'
      }
    }

    const mapper = (reverse = false) => {
      return function StackItem(s: StackItemType, i: number) {
        const commonStyles =
          'transition-all ease-in-out delay-150 grid w-32 h-20 rounded place-content-center cursor-pointer shadow'
        if (s.popped) return
        const isBroken =
          (reverse && s.broken === 'r') || (!reverse && s.broken === 'l')
        return (
          <div
            className={`${commonStyles} ${bgSwitch(s.position)} ${
              isBroken && 'invisible '
            }`}
            style={{ perspective: '100px' }}
            key={s.position}
            onClick={() => handleOnPick(s, !reverse ? 'l' : 'r')}
          >
            {!s.masked && (reverse ? (s.bin === 1 ? 0 : 1) : s.bin)}
          </div>
        )
      }
    }

    return (
      <>
        <div className="stack">{stack.map(mapper())}</div>
        <div className="stack">{stack.map(mapper(true))}</div>
      </>
    )
  }

  const handleOnReset = () => {
    setstack(generateStack(totalLevels))
    setActiveLevel(0)
    setGameOver(false)
  }

  const AlertElement = () => {
    return (
      <div className="alert alert-info shadow-lg absolute bottom-10 w-96">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Tap left or right to proceed</span>
        </div>
      </div>
    )
  }

  const message = () => {
    switch (true) {
      case gameOver && activeLevel === totalLevels:
        state.userSocket.updateScore(150, 'SPSN')
        return 'YOU WIN! 🎉'
      case gameOver && activeLevel < 0:
        return '❌ Game over ❌'
      default:
        return `${totalLevels - activeLevel} levels left`
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4 grid-rows-10 w-screen h-screen">
      <div className="col-span-12 row-span-1 row-start-1 box-border text-center flex justify-center items-center flex-col">
        <div className="text-3xl font-bold mb-4">Stepping Stones</div>
        <div className="text-sm ">{message()}</div>
      </div>
      <div className="col-span-10 col-start-2 row-span-6 box-border text-center flex justify-center items-center gap-2">
        <StackComp />
      </div>
      <div className="col-span-12 row-span-1 box-border text-center flex justify-center items-center">
        {allowReset && gameOver && (
          <button className="btn btn-primary" onClick={handleOnReset}>
            Reset
          </button>
        )}
      </div>
      {firstTime && <AlertElement />}
    </div>
  )
}

function generateStack(n: number): StackItemType[] {
  const switches = Array(n)
    .fill(1)
    .map((_, i) => {
      return {
        bin: Math.round(Math.random()),
        position: i,
        popped: false,
        masked: true,
        broken: null
      }
    })

  return switches
}

type StackItemType = {
  bin: number
  position: number
  popped: boolean
  masked: boolean
  broken: 'r' | 'l' | null
}
