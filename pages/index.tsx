import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useContext } from 'react'
import { GlobalCtx } from '../context/GlobalCtx'
import connectToSocket from '../lib/connectToSocket'
import AppRouting from '../components/AppRouting'

let socketAPI: UserSocketAPI
export default function Home() {
  const { state, dispatch } = useContext(GlobalCtx)

  const handleClearStorage = () => {
    dispatch({ type: 'clearStorage' })
  }

  useEffect(() => {
    const onNewMessage = (msg: string) => {
      dispatch({ type: 'setMsg', payload: msg })
    }
    const socketInit = async () => {
      socketAPI = (await connectToSocket({
        path: '/',
        msgHandler: onNewMessage,
        name: ''
      })) as UserSocketAPI
      dispatch({ type: 'setSocket', payload: socketAPI })
    }
    socketInit()
  }, [])

  return (
    <AppRouting>
      <div className={styles.container}>
        <Head>
          <title>{state.msg}</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1>Hi {state.name}! </h1>
          <div className={styles.card}>
            <p>{state.msg}</p>
          </div>
          <button onClick={handleClearStorage}>Clear Storage</button>
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </AppRouting>
  )
}