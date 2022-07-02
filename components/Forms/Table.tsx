import styles from '../../styles/Home.module.css'
interface TableProps {
  users: IOClient[]
  history: ServerScoreLog[]
  activeGid: GameModuleId
  hideIndicator?: boolean
}

export default function Table({
  users,
  history,
  activeGid,
  hideIndicator
}: TableProps) {
  const getScoreInHistory = (gid: GameModuleId, id: string) => {
    return history.find((i) => i.gid === gid && i.playerId === id)?.score || 0
  }

  const historyExists = (id: string) => {
    return !history.find((i) => i.gid === activeGid && i.playerId === id)
  }

  const sortByScore = (a, b) => {
    return b.score - a.score
  }
  const UserList = users.sort(sortByScore).map((user, index) => {
    const { id } = user
    const glrlScore = getScoreInHistory('GLRL', id)
    const nmgrScore = getScoreInHistory('NMGR', id)
    const spsnScore = getScoreInHistory('SPSN', id)
    const getIcon = () => {
      switch (index) {
        case 0:
          return '👑'
        case 1:
          return '🥈'
        case 2:
          return '🥉'
        default:
          return ''
      }
    }
    return (
      <tr key={id} className="hover">
        <th>{index + 1}</th>
        <td>
          <div className="indicator">
            <span className="indicator-item indicator-start">{getIcon()}</span>
            <div className="grid pl-2 place-items-center">{user.name}</div>
          </div>
        </td>
        <td>
          <label className="swap swap-rotate">
            <input type="checkbox" checked={user.room === 'game-room'} />
            <div className="swap-on text-green-400">LIVE</div>
            <div className="swap-off text-red-500">OFFLINE</div>
          </label>
        </td>
        <td>
          <div className="stat">
            <div className="stat-value">{glrlScore}</div>
          </div>
        </td>
        <td>
          <div className="stat">
            <div className="stat-value">{nmgrScore}</div>
          </div>
        </td>
        <td>
          <div className="stat">
            <div className="stat-value">{spsnScore}</div>
          </div>
        </td>
        <td>
          <div className="stat">
            <div className="stat-value">{user.score}</div>
          </div>
        </td>
        {!hideIndicator && (
          <td>
            <label className="swap swap-flip text-2xl">
              <input type="checkbox" checked={historyExists(id)} />
              <div className="swap-on">🎮</div>
              <div className="swap-off">✅</div>
            </label>
          </td>
        )}
      </tr>
    )
  })

  return (
    <div className="card w-full bg-neutral text-neutral-content shadow-md">
      <div className="card-body text-center">
        <h2 className="card-title">Players Connected</h2>
        <div
          className={`overflow-x-auto overflow-y-scroll max-h-[875px] scrollbar-hide ${styles['no-scrollbar']}`}
        >
          <table className="table w-full ">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Status</th>
                <th>GLRL 🚦</th>
                <th>NMGR 🎲</th>
                <th>SPSN 💎</th>
                <th>Total Score</th>
                {!hideIndicator && <th></th>}
              </tr>
            </thead>
            <tbody>{UserList}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
