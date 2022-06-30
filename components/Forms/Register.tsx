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
        <NewComp
          handleNameSubmission={handleNameSubmission}
          handleUserNameChange={handleUserNameChange}
          name={name}
        />
      </main>
    </div>
  )
}

function NewComp({ handleNameSubmission, handleUserNameChange, name }) {
  return (
    <form onSubmit={handleNameSubmission}>
      <div className="hero min-h-screen ">
        <div className="hero-content">
          <div className="max-w-md grid gap-4 mb-80">
            <h1 className="text-5xl font-bold">Sign in</h1>
            <h1 className="text-md">
              Before you enter the server let us know what to call you
            </h1>
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  className="input input-bordered"
                  style={{ fontSize: '16px' }}
                  onChange={handleUserNameChange}
                  value={name}
                />
                <button className="btn" type="submit">
                  Let{"'"}s go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
