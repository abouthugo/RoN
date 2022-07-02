import Head from 'next/head'
import React, { useState, useEffect, Children } from 'react'
import Table from '../../components/Forms/Table'
import connectToSocket from '../../lib/connectToSocket'

let socketAPI: AdminSocketAPI
const GAME_MODULES: AdminGameState[] = [
  {
    name: 'Home',
    id: 'HOME',
    description: 'Initial greeting screen'
  },
  {
    name: 'Green Light Red Light',
    id: 'GLRL',
    description: "Squid's game GLRL"
  },
  {
    name: 'Number Guesser',
    id: 'NMGR',
    description: 'A game with a loop hole'
  },
  {
    name: 'Stepping Stones',
    id: 'SPSN',
    description: 'Everyone might fail this'
  }
]
export default function AdminPage() {
  const [ready, setReady] = useState(false)
  const [message, setmessage] = useState('')
  const [checked, setChecked] = useState(false)
  const [users, setusers] = useState<IOClient[]>([])
  const [history, setHistory] = useState<ServerScoreLog[]>([])
  const [activeModule, setActiveModule] = useState(
    GAME_MODULES.find((i) => i.id === 'HOME')
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setmessage(value)
    socketAPI.sendMsg(value)
  }

  const handleCheck = () => {
    setChecked(!checked)
    socketAPI.setGate(!checked)
  }

  const handleOnModuleChange = (id: GameModuleId) => {
    setActiveModule(GAME_MODULES.find((m) => m.id === id))
    socketAPI.setGameModule(id)
  }

  const triggerReset = () => {
    socketAPI.resetScore()
  }

  const ModsComponent = () => {
    const list = GAME_MODULES.map((m) => {
      return (
        <input
          key={m.id}
          type="radio"
          name="options"
          data-title={m.id}
          className="btn"
          data-tip={m.description}
          onChange={() => handleOnModuleChange(m.id)}
          checked={activeModule.id === m.id}
        />
      )
    })

    return <div className="btn-group">{list}</div>
  }

  useEffect(() => {
    const socketInit = async () => {
      const onConnect = () => {
        console.log('Connected to socket')
      }

      const onSync = (gs: ServerGameState) => {
        setmessage(gs.message)
        setActiveModule(GAME_MODULES.find((m) => m.id === gs.activeModule))
        setChecked(gs.open)
        setReady(true)
      }

      const onClientUpdates = (s: IOClient[], l: ServerScoreLog[]) => {
        setusers(s)
        setHistory(l)
      }

      socketAPI = (await connectToSocket({
        path: '/admin',
        msgHandler: setmessage,
        onConnect: onConnect,
        onClientUpdates: onClientUpdates,
        onSync
      })) as AdminSocketAPI
    }

    socketInit().then(() => {
      // Request sync after render
      socketAPI.requestSync()
    })
    console.log('Render triggered')
  }, [])

  if (!ready)
    return (
      <AdminHeader>
        <progress className="progress progress-secondary w-full"></progress>
      </AdminHeader>
    )

  return (
    <AdminHeader>
      <div className="container mx-auto  rounded-md mt-2 p-4 grid gap-6">
        <h1 className="text-3xl font-bold text-center">Admin Control Panel</h1>
        {/* Grid of cards */}
        <div className="grid grid-cols-8 place-content-center gap-10">
          <div className="card bg-base-100 shadow-md lg:col-span-2 sm:col-span-4">
            <div className="card-body">
              <h2 className="card-title">Broadcast</h2>
              <div className="card-actions justify-center">
                <input
                  name="message to users"
                  value={message}
                  onChange={handleChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
                <span className="">- {message.length} characters -</span>
              </div>
            </div>
          </div>

          <div className="grid card bg-base-100 shadow-md lg:col-span-2 sm:col-span-4">
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
                <div
                  className="btn btn-warning btn-outline mt-5"
                  onClick={triggerReset}
                >
                  Reset Scores
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md lg:col-span-2 sm:col-span-4">
            <div className="card-body">
              <div className="card-title">
                Active module: {activeModule.name}
              </div>
            </div>
            <div className="card-actions justify-center">
              <ModsComponent />
            </div>
          </div>
        </div>
        {/* Table */}
        <Table users={users} history={history} activeGid={activeModule.id} />
      </div>
    </AdminHeader>
  )
}

function AdminHeader({ children }) {
  return (
    <>
      <Head>
        <title>Admin Portal</title>
        <meta name="description" content="Control the game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  )
}
