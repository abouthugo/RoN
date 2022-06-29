interface TableProps {
  users: IOClient[]
}

export default function Table({ users }: TableProps) {
  const UserList = users.map((user, index) => {
    const getIcon = () => {
      switch (index) {
        case 0:
          return '🥇'
        case 1:
          return '🥈'
        case 2:
          return '🥉'
        default:
          return ''
      }
    }
    return (
      <tr key={user.id} className="hover">
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
            <div className="stat-value">{user.score}</div>
          </div>
        </td>
      </tr>
    )
  })

  return (
    <div className="card w-full bg-neutral text-neutral-content shadow-md">
      <div className="card-body text-center">
        <h2 className="card-title">Players Connected</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>{UserList}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
