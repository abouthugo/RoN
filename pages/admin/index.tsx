import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket<ServerToClientEvents, ClientToServerEvents>
export default function AdminPage() {
  const [message, setmessage] = useState('')
  const handleChange = (e) => {
    const { value } = e.target
    setmessage(value)
    socket.emit('message', value)
  }

  useEffect(() => {
    const socketInit = async () => {
      await fetch('/api/socket')
      socket = io()
      socket.on('connect', () => {
        alert('WE ARE CONNECTED BRO!')
      })
    }
    socketInit()
  }, [])

  return (
    <>
      <h1>This is the admin page</h1>
      <input name="message to users" value={message} onChange={handleChange} />
    </>
  )
}
