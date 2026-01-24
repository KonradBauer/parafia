import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '@/services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const data = await api.verifyAuth()
      setUser(data.user)
    } catch (err) {
      localStorage.removeItem('admin_token')
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (username, password) => {
    const data = await api.login(username, password)
    localStorage.setItem('admin_token', data.token)
    setUser({ username, role: 'admin' })
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAuth
