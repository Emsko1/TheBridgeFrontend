import React, { useState } from 'react'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      toast.success('Login successful!')
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      const message = err.response?.data?.message || err.response?.data || 'Invalid email or password'

      const finalMessage = typeof message === 'string' ? message : 'Login failed. Please check your credentials.'
      toast.error(finalMessage)
      setError(finalMessage)
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

      <form onSubmit={submit} autoComplete="off">
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

        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <label>Password</label>
          <input
            required
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            style={{ paddingRight: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '38px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {showPassword ? (
              // Eye slash icon (hide password)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              // Eye icon (show password)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
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
