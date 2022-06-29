interface ServerToClientEvents {
  updateMessage: (msg: string) => void
  messageSync: (msg: string) => void
  clientList: (clients: IOClient[]) => void
}
type IOClient = { name: string; id: string }

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
}

/**
 * Socket Hook Types
 */
type MessageHandler = (msg: string) => void
type ComponentConfigs =
  | {
      path: '/'
      msgHandler: MessageHandler
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
