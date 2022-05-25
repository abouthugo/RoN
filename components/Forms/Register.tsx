import Head from 'next/head'
import { useContext, useState } from 'react'
import { GlobalCtx } from '../../context/GlobalCtx'
import styles from '../../styles/Home.module.css'

export default function Register() {
  const { state, dispatch } = useContext(GlobalCtx)
  const [name, setName] = useState(state.name)
  const handleNameSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // inform the server
    state.userSocket.setName(name)
    dispatch({ type: 'setName', payload: name })
  }

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setName(e.target.value)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Registration</title>
        <meta name="description" content="Register before entering the game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.main}>
          <p>Welcome!</p>
          <p>What should we call you?</p>
          <form onSubmit={handleNameSubmission}>
            <input type="text" onChange={handleUserNameChange} value={name} />
            <button type="submit">Submit</button>
          </form>
        </div>
      </main>
    </div>
  )
}
