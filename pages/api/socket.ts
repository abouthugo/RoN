import { NextApiRequest, NextApiResponse } from 'next'
import { Server, Socket as IOSocket } from 'socket.io'
import { Socket } from 'net'

export default function socketIOHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const socket = res.socket as EnhancedSocket
  let clients: ServerSocket[] = []
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

      socket.on('checkIn', (name) => {
        socket.data.name = name
        clients.push(socket)
        console.log(`Name for this socket has changed to ${name}`)
        printClients(clients)
      })

      socket.conn.on('close', () => {
        clients = clients.filter((v) => v.id !== socket.id)
        console.log(`${socket.data.name} left.`)
        printClients(clients)
      })
    })
  }
  res.end()
}

function printClients(sockets: ServerSocket[]) {
  const socketList = sockets.map((socket) => {
    const { name } = socket.data
    const { id } = socket
    return `${id} -> ${name}`
  })
  console.log('Clients: ', socketList)
}

interface EnhancedSocket extends Socket {
  server: any
}

type ServerSocket = IOSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
