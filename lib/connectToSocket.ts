import { io, Socket } from 'socket.io-client'

export default async function connectToSocket(config: ComponentConfigs) {
  await fetch('/api/socket')
  const socket: AppSocket = io()
  switch (config.path) {
    case '/': {
      subToMessages(socket, config.msgHandler)
      const setName = (name: string) => {
        onSetName(socket, name)
      }
      const resubToMessages = (f: MessageHandler) => {
        subToMessages(socket, f)
      }

      return { setName, resubToMessages }
    }
    case '/admin': {
      const sendMsg = (msg: string) => {
        pubMessage(socket, msg)
      }
      socket.emit('authCheck')
      subToClientList(socket, config.onClientUpdates)
      onConnect(socket, config.onConnect)

      return { sendMsg }
    }
  }
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
  handler: (s: ServerSocket[]) => void
) {
  socket.on('clientList', handler)
}

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>
