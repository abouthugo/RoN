import { NextApiRequest, NextApiResponse } from 'next'
import { Server, Socket as IOSocket } from 'socket.io'
import { Socket } from 'net'

const GAME_ROOM = 'game-room'
const WAITING_ROOM = 'waiting-room'
const STATS_ROOM = 'stats-room'
const LOBBY = 'lobby'

export default function socketIOHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const socket = res.socket as EnhancedSocket
  let clients: ServerSocket[] = []
  let log: ServerScoreLog[] = []
  const gameState: ServerGameState = {
    message: 'Welcome!',
    open: false,
    activeModule: 'HOME'
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
      // This is like the general channel. It will act as a passer for when the user has not logged in yet but still needs to listen to events that happen in both rooms
      socket.join(LOBBY)

      socket.on('message', (msg) => {
        gameState.message = msg
        socket.broadcast.emit('updateMessage', msg)
      })

      socket.on('checkIn', (name) => {
        socket.leave(LOBBY)
        socket.data.name = name
        socket.data.score = 0
        socket.data.visited = new Set()
        if (gameState.open) socket.join(GAME_ROOM)
        else socket.join(WAITING_ROOM)

        clients.push(socket)
        console.log(`${name} entered the server`)
        if (adminId)
          io.to(adminId)
            .to(STATS_ROOM)
            .emit('clientList', reducedClients(clients), log)
        printClients(clients)
      })

      socket.conn.on('close', () => {
        clients = clients.filter((v) => v.id !== socket.id)
        log = log.filter((v) => v.playerId !== socket.id)
        console.log(`${socket.data.name} left.`)
        if (adminId)
          io.to(adminId)
            .to(STATS_ROOM)
            .emit('clientList', reducedClients(clients), log)
        printClients(clients)
      })

      socket.on('authCheck', () => {
        socket.leave(LOBBY)
        console.log('check emitted')
        console.log(gameState)
        adminId = socket.id
        io.to(adminId).emit('clientList', reducedClients(clients), log)
      })

      // Client requests a sync after render and the message is sent to the client
      socket.on('requestSync', () => {
        if (adminId && socket.id === adminId)
          io.to(adminId).emit('gameStateSync', gameState)
        else {
          io.to(socket.id).emit('updateMessage', gameState.message)
          io.to(socket.id).emit('gameStateSync', gameState)
        }
      })

      socket.on('setGate', (open) => {
        if (socket.id === adminId) {
          const gateState = open ? 'open' : 'closed'
          console.log(`admin triggered new state, gates are now ${gateState}`)
          gameState.open = open
          socket
            .to(WAITING_ROOM)
            .to(LOBBY)
            .to(STATS_ROOM)
            .emit('gameStateSync', gameState)
          if (open) {
            io.in(WAITING_ROOM).socketsJoin(GAME_ROOM)
            io.socketsLeave(WAITING_ROOM)
            io.to(adminId)
              .to(STATS_ROOM)
              .emit('clientList', reducedClients(clients), log)
          }
          printClients(clients)
        }
      })

      socket.on('setGameModule', (gid) => {
        if (socket.id === adminId) {
          console.log(`Admin is now changing the game module to ${gid}`)
          gameState.activeModule = gid
          io.to(WAITING_ROOM)
            .to(LOBBY)
            .to(STATS_ROOM)
            .emit('gameStateSync', gameState)
          // we don't want to kick players out when the gates are closed
          io.to(GAME_ROOM).emit('gameStateSync', { ...gameState, open: true })
        }
      })

      socket.on('updateScore', (score, gid) => {
        // prevent subsequent requests, only take the first one
        if (socket.data.visited.has(gid)) return
        socket.data.visited.add(gid)
        socket.data.score += score
        log.push({
          time: new Date().toISOString(),
          gid,
          score,
          playerId: socket.id,
          playerName: socket.data.name
        })
        io.to(adminId)
          .to(STATS_ROOM)
          .emit('clientList', reducedClients(clients), log)
      })

      socket.on('joinStats', () => {
        console.log('Socket joined stats')
        socket.leave(LOBBY)
        socket.join(STATS_ROOM)
        io.to(STATS_ROOM).emit('clientList', reducedClients(clients), log)
        io.to(STATS_ROOM).emit('gameStateSync', gameState)
      })

      socket.on('resetScores', async () => {
        log = []
        const sockets = await io.in(GAME_ROOM).fetchSockets()
        for (const s of sockets) {
          s.data.score = 0
          s.data.visited = new Set()
        }

        io.to(adminId)
          .to(STATS_ROOM)
          .emit('clientList', reducedClients(clients), log)

        console.log('scores were reset')
      })
    })
  }
  res.end()
}

function printClients(sockets: ServerSocket[]) {
  const socketList = sockets.map((socket) => {
    const { name } = socket.data
    const { id } = socket
    return `${id} -> ${name} rooms: ${getRooms(socket).join(', ')}`
  })
  console.log('Clients: ', socketList)
}

function reducedClients(sockets: ServerSocket[]): IOClient[] {
  const socketList = sockets.map((socket) => {
    const room: Room = socket.rooms.has(GAME_ROOM) ? GAME_ROOM : WAITING_ROOM
    const { name, score } = socket.data
    const { id } = socket
    return { name, id, room, score }
  })
  return socketList
}

function getRooms(socket: ServerSocket): string[] {
  const { id } = socket
  const rooms = []
  socket.rooms.forEach((v) => {
    if (v === id) return
    rooms.push(v)
  })
  return rooms
}

interface EnhancedSocket extends Socket {
  server: any
}
