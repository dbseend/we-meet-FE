import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.REACT_APP_SITE_URL}/dashboard`
        }
      })

      console.log("Google login attempt:", data)

      if (error) throw error
      
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button 
        onClick={handleGoogleLogin}
        disabled={loading}
        className="google-login-button"
      >
        {loading ? 'Loading...' : 'Sign in with Google'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default GoogleLogin