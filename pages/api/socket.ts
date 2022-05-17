import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { Socket } from 'net'

export default function socketIOHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const socket = res.socket as EnhancedSocket
  if (socket.server.io) {
    console.log('Socket already running')
  } else {
    const io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(socket.server)
    socket.server.io = io
    io.on('connection', (socket) => {
      socket.on('message', (msg) => {
        socket.broadcast.emit('updateMessage', msg)
      })
    })
  }
  res.end()
}

interface EnhancedSocket extends Socket {
  server: any
}
