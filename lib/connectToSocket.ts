import { io, Socket } from 'socket.io-client'

export default async function connectToSocket(config: ComponentConfigs) {
  await fetch('/api/socket')
  const socket: AppSocket = io()

  // Reusable function for both user types
  const requestSync = () => {
    socket.emit('requestSync')
  }

  switch (config.path) {
    case '/': {
      subToMessages(socket, config.msgHandler)
      subToGameSync(socket, config.gameStateHandler)
      const setName = (name: string) => {
        onSetName(socket, name)
      }
      const resubToMessages = (f: MessageHandler) => {
        subToMessages(socket, f)
      }

      const updateScore = (score: number, gid: GameModuleId) => {
        socket.emit('updateScore', score, gid)
      }

      return { setName, resubToMessages, requestSync, updateScore }
    }
    case '/admin': {
      const sendMsg = (msg: string) => {
        pubMessage(socket, msg)
      }
      const setGate = (open: boolean) => {
        socket.emit('setGate', open)
      }
      const setGameModule = (gid: GameModuleId) => {
        socket.emit('setGameModule', gid)
      }
      socket.emit('authCheck')
      subToClientList(socket, config.onClientUpdates)
      subToGameSync(socket, config.onSync)
      onConnect(socket, config.onConnect)

      return { sendMsg, requestSync, setGate, setGameModule }
    }
  }
}

function subToGameSync(socket: AppSocket, gameStateHandler: GameStateHandler) {
  socket.on('gameStateSync', (gs) => {
    gameStateHandler(gs)
  })
}

function subToMessages(socket: AppSocket, msgHandler: MessageHandler) {
  socket.on('updateMessage', (msg) => {
    msgHandler(msg)
  })
}

function pubMessage(socket: AppSocket, msg: string) {
  socket.emit('message', msg)
}

function onConnect(socket: AppSocket, handler: () => void) {
  socket.on('connect', handler)
}

function onSetName(socket: AppSocket, name: string) {
  socket.emit('checkIn', name)
  console.log(`Name has changed to: ${name}`)
}

function subToClientList(
  socket: AppSocket,
  handler: (s: ServerSocket[], history: ServerScoreLog[]) => void
) {
  socket.on('clientList', handler)
}

function subToMessageSync(socket: AppSocket, handler: (s: string) => void) {
  socket.on('messageSync', handler)
}

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>
