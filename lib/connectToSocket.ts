import { io, Socket } from 'socket.io-client'

export default async function connectToSocket(config: ComponentConfigs) {
  await fetch('/api/socket')
  const socket = io()
  switch (config.path) {
    case '/': {
      subToMessages(socket, config.msgHandler)
      return null
    }
    case '/admin': {
      const sendMsg = (msg: string) => {
        pubToMessage(socket, msg)
      }
      onConnect(socket, config.onConnectHandler)

      return { sendMsg }
    }
  }
}

function subToMessages(socket: AppSocket, msgHandler: MessageHandler) {
  socket.on('updateMessage', (msg) => {
    msgHandler(msg)
  })
}

function pubToMessage(socket: AppSocket, msg: string) {
  socket.emit('message', msg)
}

function onConnect(socket: AppSocket, handler: () => void) {
  socket.on('connect', handler)
}
