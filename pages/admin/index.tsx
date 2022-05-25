import React, { useState, useEffect } from 'react'
import connectToSocket from '../../lib/connectToSocket'

let socketAPI: AdminSocketAPI
export default function AdminPage() {
  const [message, setmessage] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setmessage(value)
    socketAPI.sendMsg(value)
  }

  useEffect(() => {
    const socketInit = async () => {
      const onConnect = () => {
        alert('Connected to socket')
      }
      socketAPI = (await connectToSocket({
        path: '/admin',
        msgHandler: setmessage,
        onConnect: onConnect
      })) as AdminSocketAPI
    }
    socketInit()
  }, [])

  return (
    <div>
      <h1>broadcast a message</h1>
      <input name="message to users" value={message} onChange={handleChange} />
    </div>
  )
}
