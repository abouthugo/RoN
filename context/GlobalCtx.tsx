import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useReducer
} from 'react'

export const GlobalCtx = createContext<GlobalCtxInterface | null>(null)

export default function ContextProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(reducer, init())

  useEffect(() => {
    const localUsername = localStorage.getItem('user_name') || ''
    dispatch({ type: 'setName', payload: localUsername })
  }, [])

  useEffect(() => {
    const localUsername = localStorage.getItem('user_name') || ''
    if (localUsername.length > 0 && state.userSocket) {
      state.userSocket.setName(localUsername)
    }
  }, [state.userSocket])

  return (
    <GlobalCtx.Provider value={{ state, dispatch }}>
      {children}
    </GlobalCtx.Provider>
  )
}

/**
 * Initializes `state.name` from local storage
 * @returns
 */
function init(): AppState {
  if (typeof window !== 'undefined') {
  }
  return {
    name: '',
    userSocket: null,
    msg: 'Initial Message'
  }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setGameState':
      return { ...state, gameState: action.payload }
    case 'setName':
      localStorage.setItem('user_name', action.payload)
      return { ...state, name: action.payload }
    case 'setSocket':
      return { ...state, userSocket: action.payload }
    case 'setMsg':
      return { ...state, msg: action.payload }
    case 'clearStorage':
      localStorage.removeItem('user_name')
      return init()
  }
}

type ContextProps = {
  children?: ReactNode
}
