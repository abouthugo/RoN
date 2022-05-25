interface ServerToClientEvents {
  updateMessage: (msg: string) => void
}

interface ClientToServerEvents {
  message: (msg: string) => void
  checkIn: (name: string) => void
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
    }
type AdminSocketAPI = {
  sendMsg: (v: string) => void
}

type UserSocketAPI = {
  setName: (name: string) => void
  resubToMessages: (f: MessageHandler) => void
}
