import React, { useState, useEffect } from 'react'
import Table from '../../components/Forms/Table'
import connectToSocket from '../../lib/connectToSocket'

let socketAPI: AdminSocketAPI
export default function AdminPage() {
  const [message, setmessage] = useState('')
  const [checked, setChecked] = useState(false)
  const [users, setusers] = useState<IOClient[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setmessage(value)
    socketAPI.sendMsg(value)
  }

  const handleCheck = () => {
    setChecked(!checked)
    socketAPI.setGate(!checked)
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
      {/* Grid of cards */}
      <div className="grid grid-cols-8 place-content-center gap-10">
        <div className="card bg-base-100 shadow-md lg:col-span-2 sm:col-span-4">
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

        <div className="grid card bg-base-100 shadow-md place-content-center lg:col-span-2 sm:col-span-4">
          <div className="card-body">
            <div className="class-actions">
              <div className="form-control">
                <label className="label cursor-pointer gap-5">
                  <span className="label-text">Open the gates</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    onChange={handleCheck}
                    checked={checked}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <Table users={users} />
    </div>
  )
}
