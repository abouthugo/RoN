interface TableProps {
  users: IOClient[]
}

export default function Table({ users }: TableProps) {
  const UserList = users.map((user, index) => {
    return (
      <tr key={user.id} className="hover">
        <th>{index + 1}</th>
        <td>{user.name}</td>
        <td>{user.id}</td>
      </tr>
    )
  })

  return (
    <div className="card w-full bg-neutral text-neutral-content shadow-md">
      <div className="card-body text-center">
        <h2 className="card-title">Users connected</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
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
