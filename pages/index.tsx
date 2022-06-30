import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useContext } from 'react'
import { GlobalCtx } from '../context/GlobalCtx'
import connectToSocket from '../lib/connectToSocket'
import AppRouting from '../components/AppRouting'
import { useRouter } from 'next/router'

let socketAPI: UserSocketAPI
const debugMode = false
export default function Home() {
  const { state, dispatch } = useContext(GlobalCtx)
  const router = useRouter()

  const handleClearStorage = () => {
    dispatch({ type: 'clearStorage' })
    router.reload()
  }

  useEffect(() => {
    const onNewMessage = (msg: string) => {
      dispatch({ type: 'setMsg', payload: msg })
    }
    const onGameStateSync = (gs: ServerGameState) => {
      dispatch({ type: 'setGameState', payload: gs })
    }
    const socketInit = async () => {
      socketAPI = (await connectToSocket({
        path: '/',
        msgHandler: onNewMessage,
        gameStateHandler: onGameStateSync,
        name: ''
      })) as UserSocketAPI
      dispatch({ type: 'setSocket', payload: socketAPI })
    }
    socketInit().then(() => {
      socketAPI.requestSync()
    })
  }, [dispatch])

  return (
    <>
      <AppRouting>
        <div className={styles.container}>
          <Head>
            <title>Home</title>
            <meta name="description" content="The games will begin soon" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="grid gap-4 max-w-xs mx-auto mt-10">
            <div className={styles.card}>
              <pre>
                <code>&gt; {state.msg}</code>
              </pre>
            </div>
            <div className="flex justify-start">
              <button onClick={handleClearStorage} className="btn btn-link">
                Leave
              </button>
            </div>
          </main>
        </div>
      </AppRouting>
      {debugMode && <DebugComponent content={JSON.stringify(state, null, 2)} />}
    </>
  )
}

function DebugComponent({ content }) {
  return (
    <textarea
      className="textarea textarea-warning h-80 absolute bottom-1 right-1 w-60"
      value={content}
      readOnly
    />
  )
}
