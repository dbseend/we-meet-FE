import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 사용자 데이터를 users 테이블에 저장하는 함수
    const saveUserToDatabase = async (userData) => {
      try {
        // 먼저 사용자가 이미 존재하는지 확인
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('email')
          .eq('email', userData.email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116는 결과가 없음을 의미
          console.error('Error fetching user:', fetchError)
          return
        }

        // 사용자가 존재하지 않는 경우에만 새로 추가
        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                email: userData.email,
                name: userData.user_metadata?.full_name || userData.email.split('@')[0]
              }
            ])

          if (insertError) {
            console.error('Error inserting user:', insertError)
          }
        }
      } catch (error) {
        console.error('Error in saveUserToDatabase:', error)
      }
    }

    const setData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Session error:", error)
        return
      }
      if (session?.user) {
        setUser(session.user)
        await saveUserToDatabase(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    setData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await saveUserToDatabase(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    signOut: () => supabase.auth.signOut(),
    user,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}