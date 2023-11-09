import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useContext } from 'react'
import { GlobalCtx } from '../context/GlobalCtx'
import connectToSocket from '../lib/connectToSocket'
import AppRouting from '../components/AppRouting'
import { useRouter } from 'next/router'
import { JSONTree } from 'react-json-tree'

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
            <div className="mockup-code bg-black text-white overflow-auto">
              <pre className="whitespace-pre-wrap">
                <div className='pl-4'>{state.msg || " "}</div>
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
      {debugMode && <DebugComponent content={state} />}
    </>
  )
}

function DebugComponent({ content }) {
  return (
    <div className="h-80 absolute bottom-1 right-1 w-120 overflow-auto bg-base-200 text-black rounded-md p-2">
        <JSONTree data={content} />
    </div>
  )
}
