interface ServerToClientEvents {
  updateMessage: (msg: string) => void
  messageSync: (msg: string) => void
  clientList: (clients: IOClient[]) => void
  gameStateSync: (gameState: ServerGameState) => void
}
type Room = 'game-room' | 'waiting-room' | 'lobby'
type IOClient = { name: string; id: string; room: Room }

interface ClientToServerEvents {
  message: (msg: string) => void
  checkIn: (name: string) => void
  authCheck: () => void
  requestSync: () => void
  setGate: (open: boolean) => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  name: string
  id: string
  room: Room
}

/**
 * Socket Hook Types
 */
type MessageHandler = (msg: string) => void
type GameStateHandler = (gs: ServerGameState) => void

type ComponentConfigs =
  | {
      path: '/'
      msgHandler: MessageHandler
      gameStateHandler: GameStateHandler
      name: string
    }
  | {
      path: '/admin'
      onConnect: () => void
      msgHandler: MessageHandler
      onClientUpdates: (s: IOClient[]) => void
      onSyncMessage: (msg: string) => void
    }
type AdminSocketAPI = {
  sendMsg: (v: string) => void
  requestSync: () => void
  setGate: (open: boolean) => void
}

type UserSocketAPI = {
  setName: (name: string) => void
  resubToMessages: (f: MessageHandler) => void
  requestSync: () => void
}

type ServerSocket = IOSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

type ServerGameState = {
  message: string
  open: boolean
}
