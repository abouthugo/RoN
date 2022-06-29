import { NextApiRequest, NextApiResponse } from 'next'
import { Server, Socket as IOSocket } from 'socket.io'
import { Socket } from 'net'

export default function socketIOHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const socket = res.socket as EnhancedSocket
  let clients: ServerSocket[] = []
  const gameState = {
    message: 'Welcome!',
    open: false
  }
  let adminId: string
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
        gameState.message = msg
        socket.broadcast.emit('updateMessage', msg)
      })

      socket.on('checkIn', (name) => {
        socket.data.name = name
        clients.push(socket)
        console.log(`Name for this socket has changed to ${name}`)
        if (adminId) io.to(adminId).emit('clientList', reducedClients(clients))
        printClients(clients)
      })

      socket.conn.on('close', () => {
        clients = clients.filter((v) => v.id !== socket.id)
        console.log(`${socket.data.name} left.`)
        if (adminId) io.to(adminId).emit('clientList', reducedClients(clients))
        printClients(clients)
      })

      socket.on('authCheck', () => {
        console.log('check emitted')
        adminId = socket.id
        io.to(adminId).emit('clientList', reducedClients(clients))
      })

      // Client requests a sync after render and the message is sent to the client
      socket.on('requestSync', () => {
        if (adminId && socket.id === adminId)
          io.to(adminId).emit('messageSync', gameState.message)
        else io.to(socket.id).emit('updateMessage', gameState.message)
      })

      socket.on('setGate', (open) => {
        if (socket.id === adminId) {
          const gateState = open ? 'open' : 'closed'
          gameState.open = open
          console.log(`admin triggered new state gates are now ${gateState}`)
        }
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

function reducedClients(sockets: ServerSocket[]): IOClient[] {
  const socketList = sockets.map((socket) => {
    const { name } = socket.data
    const { id } = socket
    return { name, id }
  })
  return socketList
}

interface EnhancedSocket extends Socket {
  server: any
}
