interface ServerToClientEvents {
  updateMessage: (msg: string) => void
  messageSync: (msg: string) => void
  clientList: (clients: IOClient[], history: ServerScoreLog[]) => void
  gameStateSync: (gameState: ServerGameState) => void
}
type Room = 'game-room' | 'waiting-room' | 'lobby' | 'stats-room'
type IOClient = { name: string; id: string; room: Room; score: number }

interface ClientToServerEvents {
  message: (msg: string) => void
  checkIn: (name: string) => void
  authCheck: () => void
  requestSync: () => void
  setGate: (open: boolean) => void
  setGameModule: (gid: GameModuleId) => void
  updateScore: (score: number, gid: GameModuleId) => void
  joinStats: () => void
  resetScores: () => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  name: string
  id: string
  room: Room
  score: number
  visited: Set<GameModuleId>
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
      onClientUpdates: (s: IOClient[], history: ServerScoreLog[]) => void
      onSync: GameStateHandler
    }
  | {
      path: '/kpis'
      onClientUpdates: (s: IOClient[], history: ServerScoreLog[]) => void
      onGameSync: GameStateHandler
    }
type AdminSocketAPI = {
  sendMsg: (v: string) => void
  requestSync: () => void
  setGate: (open: boolean) => void
  setGameModule: (gid: GameModuleId) => void
  resetScore: () => void
}

type UserSocketAPI = {
  setName: (name: string) => void
  resubToMessages: (f: MessageHandler) => void
  requestSync: () => void
  updateScore: (score: number, gid: GameModuleId) => void
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
  activeModule: GameModuleId
}

type ServerScoreLog = {
  time: string
  gid: GameModuleId
  score: number
  playerId: string
  playerName: string
}

type GameModuleId = 'HOME' | 'GLRL' | 'NMGR' | 'SPSN'
type AdminGameState = {
  name: string
  id: GameModuleId
  description: string
}
