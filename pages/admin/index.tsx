import React, { useState, useEffect } from 'react'
import connectToSocket from '../../lib/connectToSocket'

let socketAPI: { sendMsg: MessageHandler }
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
      socketAPI = await connectToSocket({
        path: '/admin',
        msgHandler: setmessage,
        onConnectHandler: onConnect
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
