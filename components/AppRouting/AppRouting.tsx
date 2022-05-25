import { useContext } from 'react'
import { GlobalCtx } from '../../context/GlobalCtx'
import Register from '../Forms/Register'

export default function AppRouting({ children }) {
  const { state } = useContext(GlobalCtx)
  const { name } = state

  if (name === null || name.length < 2) return <Register />
  return <>{children}</>
}
