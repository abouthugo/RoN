import React, { useState, useEffect } from 'react'
import connectToSocket from '../../lib/connectToSocket'

let socketAPI: AdminSocketAPI
export default function AdminPage() {
  const [message, setmessage] = useState('')
  const [users, setusers] = useState<IOClient[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setmessage(value)
    socketAPI.sendMsg(value)
  }

  useEffect(() => {
    const socketInit = async () => {
      const onConnect = () => {
        console.log('Connected to socket')
      }

      socketAPI = (await connectToSocket({
        path: '/admin',
        msgHandler: setmessage,
        onConnect: onConnect,
        onClientUpdates: (s) => setusers(s)
      })) as AdminSocketAPI
    }
    socketInit()
    console.log('Render triggered')
  }, [])

  const UserList = users.map((user) => {
    return <li key={user.id}>{user.name}</li>
  })

  return (
    <div>
      <h1>broadcast a message</h1>
      <input name="message to users" value={message} onChange={handleChange} />
      <h2>Users connected</h2>
      <ul>{UserList}</ul>
    </div>
  )
}
