import { useContext } from 'react'
import { GlobalCtx } from '../../context/GlobalCtx'
import Register from '../Forms/Register'

export default function AppRouting({ children }) {
  const { state } = useContext(GlobalCtx)
  const { name, gameState } = state

  if (name === null || name.length < 2) return <Register />
  if (!gameState || (gameState && !gameState.open))
    return <div>The game has not started yet</div>
  return <>{children}</>
}
