interface TableProps {
  users: IOClient[]
}

export default function Table({ users }: TableProps) {
  const UserList = users.map((user, index) => {
    return (
      <tr key={user.id} className="hover">
        <th>{index + 1}</th>
        <td>{user.name}</td>
        <td>
          <label className="swap swap-rotate">
            <input type="checkbox" checked={user.room === 'game-room'} />
            <div className="swap-on text-green-400">LIVE</div>
            <div className="swap-off text-red-500">OFFLINE</div>
          </label>
        </td>
        <td>{user.id}</td>
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
                <th>Id</th>
              </tr>
            </thead>
            <tbody>{UserList}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
