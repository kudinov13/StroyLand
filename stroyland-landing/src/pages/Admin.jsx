import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext.jsx'

function Admin() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setIsAdmin, setToken, setChecking } = useAdmin()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    setChecking(true)
    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })
      if (!response.ok) throw new Error('Invalid credentials')
      const data = await response.json()
      localStorage.setItem('adminToken', data.token)
      setToken(data.token)
      setIsAdmin(true)
      navigate('/')
    } catch (err) {
      setError('Неверный логин или пароль')
    } finally {
      setLoading(false)
      setChecking(false)
    }
  }

  return (
    <section className="section admin">
      <div className="container">
        <div className="admin-card">
          <h1>Вход администратора</h1>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Логин
              <input value={login} onChange={(e) => setLogin(e.target.value)} />
            </label>
            <label>
              Пароль
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <p className="admin-message">{error}</p>}
            <div className="admin-actions">
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Admin
