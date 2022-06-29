interface GlobalCtxInterface {
  state: AppState
  dispatch: React.Dispatch<Action>
}

interface AppState {
  name: string
  userSocket: UserSocketAPI
  msg: string
  gameState?: ServerGameState
}

type Action =
  | { type: 'setName'; payload: string }
  | { type: 'setSocket'; payload: UserSocketAPI }
  | { type: 'setMsg'; payload: string }
  | { type: 'clearStorage' }
  | { type: 'setGameState'; payload: ServerGameState }

type ClientToServerAction =
  | { type: 'setName'; payload: string }
  | { type: 'submitAnswer' }
