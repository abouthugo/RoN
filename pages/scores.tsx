import Head from 'next/head'
import { useEffect, useState } from 'react'
import Table from '../components/Forms/Table'
import connectToSocket from '../lib/connectToSocket'

let socketAPI: AdminSocketAPI
export default function ScoreBoardPage() {
  const [users, setUsers] = useState<IOClient[]>([])
  const [history, setHistory] = useState<ServerScoreLog[]>([])
  const [gameState, setGameState] = useState<ServerGameState>()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const socketInit = async () => {
      const onClientUpdates = (s: IOClient[], h: ServerScoreLog[]) => {
        console.log({ s, h })
        setUsers(s)
        setHistory(h)
      }

      const onGameSync = async (g: ServerGameState) => {
        setGameState(g)
      }

      socketAPI = (await connectToSocket({
        path: '/kpis',
        onClientUpdates,
        onGameSync
      })) as AdminSocketAPI
    }

    socketInit().then(() => {
      setLoaded(true)
    })
  }, [])

  if (!loaded || !gameState)
    return <progress className="progress progress-secondary w-full"></progress>

  return (
    <ScoreBoardHead>
      <div className="container mx-auto mt-2 p-4 grid gap-6">
        <Table
          history={history}
          activeGid={gameState.activeModule}
          users={users}
          hideIndicator
        />
      </div>
    </ScoreBoardHead>
  )
}

function ScoreBoardHead({ children }) {
  return (
    <>
      <Head>
        <title>Score Board</title>
        <meta name="description" content="See the score of the game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  )
}
