interface GlobalCtxInterface {
  state: AppState
  dispatch: React.Dispatch<Action>
}

interface AppState {
  name: string
  userSocket: UserSocketAPI
  msg: string
}

type Action =
  | { type: 'setName'; payload: string }
  | { type: 'setSocket'; payload: UserSocketAPI }
  | { type: 'setMsg'; payload: string }
  | { type: 'clearStorage' }

type ClientToServerAction =
  | { type: 'setName'; payload: string }
  | { type: 'submitAnswer' }
