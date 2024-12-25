import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  console.log("Dashboard user state:", user)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.email}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default Dashboard