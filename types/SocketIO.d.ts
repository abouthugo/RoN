interface ServerToClientEvents {
  updateMessage: (msg: string) => void
}

interface ClientToServerEvents {
  message: (msg: string) => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  message: string
}

/**
 * Socket Hook Types
 */
type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>
type MessageHandler = (msg: string) => void
type ComponentConfigs =
  | { path: '/'; msgHandler: (msg: string) => void }
  | {
      path: '/admin'
      onConnectHandler: () => void
      msgHandler: (msg: string) => void
    }
