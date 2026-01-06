import React, { useState } from 'react'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.login(email, password)
      const token = response.data.token
      login(token, response.data.user)
      alert('✅ Login successful!')
      navigate('/profile')
    } catch (err) {
      console.error('Login error:', err)
      const message = err.response?.data?.message || err.response?.data || 'Invalid email or password'
      setError(typeof message === 'string' ? message : 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card' style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2 className="text-center" style={{ marginBottom: '24px' }}>Welcome Back</h2>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={submit}>
        <div style={{ marginBottom: '16px' }}>
          <label>Email Address</label>
          <input
            required
            type='email'
            placeholder='e.g. user@example.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label>Password</label>
          <input
            required
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button className='btn' disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
        Don't have an account? <a href='/register' style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</a>
      </p>
    </div>
  )
}
