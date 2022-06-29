import { useContext } from 'react'
import { GlobalCtx } from '../../context/GlobalCtx'
import Register from '../Forms/Register'
import GlassSteppingStones from '../Game/GlassSteppingStones'
import GreenLightRedLight from '../Game/GreenLightRedLight'
import NumberGuesser from '../Game/NumberGuesser'

export default function AppRouting({ children }) {
  const { state } = useContext(GlobalCtx)
  const { name, gameState } = state

  if (name === null || name.length < 2) return <Register />
  if (!gameState || (gameState && !gameState.open))
    return <div>The game has not started yet</div>

  switch (gameState.activeModule) {
    case 'GLRL':
      return <GreenLightRedLight />
    case 'NMGR':
      return <NumberGuesser />
    case 'SPSN':
      return <GlassSteppingStones />
    default:
      return <>{children}</>
  }
}
