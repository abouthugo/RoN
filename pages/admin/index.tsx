import React, { useState, useEffect } from 'react'
import Table from '../../components/Forms/Table'
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
        onClientUpdates: (s) => setusers(s),
        onSyncMessage: (msg) => setmessage(msg)
      })) as AdminSocketAPI
    }

    socketInit().then(() => {
      // Request sync after render
      socketAPI.requestSync()
    })
    console.log('Render triggered')
  }, [])

  return (
    <div className="container mx-auto  rounded-md mt-2 p-4 grid gap-6">
      <h1 className="text-3xl font-bold text-center">Admin Control Panel</h1>
      <div className="card w-96 bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Broadcast a message!</h2>
          <div className="card-actions justify-center">
            <input
              name="message to users"
              value={message}
              onChange={handleChange}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>
      </div>

      <Table users={users} />
    </div>
  )
}
