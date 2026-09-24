import { useContext, createContext, useState, useEffect } from 'react'
import { verifyUser, logout as logoutApi } from '../src/services/auth' 

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rate Limiting States
  const [isBlocked, setIsBlocked] = useState(false)
  const [countDown, setCountDown] = useState(60)
  const [blockMessage, setBlockMessage] = useState("") 

  useEffect(() => {
    const verifyUserStatus = async () => {
      try {
        const data = await verifyUser()
        if (data && data.success) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.log("Auth Context Error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verifyUserStatus()
  }, [])

  //  Timer Effect
  useEffect(() => {
    if (!isBlocked) return;

    const timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsBlocked(false)
          return 60 
        }
        return prev - 1
      })
    }, 1000); 

    return () => clearInterval(timer) 
  }, [isBlocked]) 

  const checkLoginStatus = (authResponse) => {
    if (authResponse && authResponse.user) {
      setUser(authResponse.user)
    } else if (authResponse) {
      setUser(authResponse)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.log(error)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      checkLoginStatus, 
      logout: handleLogout,
      isBlocked,
      setIsBlocked,
      countDown,
      blockMessage,    
      setBlockMessage  
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
