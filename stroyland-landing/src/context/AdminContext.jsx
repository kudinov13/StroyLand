import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'))
  const [isAdmin, setIsAdmin] = useState(() => Boolean(localStorage.getItem('adminToken')))
  const [checking, setChecking] = useState(false)
  const [activePage, setActivePage] = useState(null)
  const [pageHandlers, setPageHandlers] = useState({})

  const registerPage = useCallback((page, handlers) => {
    setPageHandlers((prev) => ({ ...prev, [page]: handlers }))
    return () => {
      setPageHandlers((prev) => {
        const next = { ...prev }
        delete next[page]
        return next
      })
    }
  }, [])

  const getHandlers = useCallback((page) => pageHandlers[page], [pageHandlers])

  const value = useMemo(
    () => ({
      isAdmin,
      setIsAdmin,
      token,
      setToken,
      checking,
      setChecking,
      activePage,
      setActivePage,
      registerPage,
      getHandlers,
      logout: () => {
        localStorage.removeItem('adminToken')
        setToken(null)
        setIsAdmin(false)
      },
    }),
    [activePage, checking, getHandlers, isAdmin, registerPage, token],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return ctx
}
