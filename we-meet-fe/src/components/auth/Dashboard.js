import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import axios from 'axios'

function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchCalendarEvents()
  }, [user])

  const fetchCalendarEvents = async () => {
    try {
      const session = await supabase.auth.getSession()
      const token = session?.data?.session?.provider_token
      
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/calendar/events`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setEvents(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching calendar events:', err)
      setError('Failed to load calendar events')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading calendar events...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-600">Welcome, {user?.email}</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="border-b pb-4"
              >
                <h4 className="font-medium">{event.summary}</h4>
                <p className="text-gray-600 text-sm">
                  {new Date(event.start.dateTime).toLocaleString()} - 
                  {new Date(event.end.dateTime).toLocaleString()}
                </p>
                {event.description && (
                  <p className="text-gray-700 mt-1">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events found</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard;