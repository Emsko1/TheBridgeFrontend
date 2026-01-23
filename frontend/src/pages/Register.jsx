import React, { useState } from 'react'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!name || !email || !password) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const form = e.target
      const businessName = form.businessName.value
      const registrationNumber = form.registrationNumber.value
      const documentUrl = form.documentUrl.value

      const payload = {
        name,
        email,
        passwordHash: password,
        businessName,
        registrationNumber,
        documentUrls: documentUrl ? [documentUrl] : []
      }

      console.log('📤 Sending registration payload:', payload)
      const response = await authAPI.register(payload)
      console.log('✅ Registration successful:', response.data)
      alert('✅ Registration successful! Please check your email for the verification code.')
      navigate('/verify-email', { state: { email } })
    } catch (err) {
      console.error('❌ Register error:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error message:', err.message)
      console.error('Error config:', {
        url: err.config?.url,
        baseURL: err.config?.baseURL,
        method: err.config?.method
      })

      let message = 'Registration failed'
      if (err.code === 'ERR_NETWORK' || !err.response) {
        const apiUrl = import.meta.env.VITE_API_URL || '/api'
        message = `🔌 Cannot reach backend at ${apiUrl}`
      } else if (err.response?.status === 409) {
        message = '📧 Email already registered. Please login or use a different email.'
      } else if (err.response?.status === 400) {
        message = err.response?.data?.message || 'Invalid input. Please check your details.'
      } else if (err.response?.data?.message) {
        message = err.response.data.message
      } else if (err.response?.data?.error) {
        message = err.response.data.error
      } else if (typeof err.response?.data === 'string') {
        message = err.response.data
      } else if (err.message) {
        message = err.message
      }

      setError(typeof message === 'string' ? message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card' style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2 className="text-center" style={{ marginBottom: '24px' }}>Create Account</h2>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={submit}>
        <div style={{ marginBottom: '16px' }}>
          <label>Full Name *</label>
          <input
            required
            placeholder='e.g. John Doe'
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Email Address *</label>
          <input
            required
            type='email'
            placeholder='e.g. user@example.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Password *</label>
          <input
            required
            type='password'
            placeholder='At least 6 characters'
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ margin: '24px 0', borderTop: '1px solid var(--border)' }}></div>
        <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-main)' }}>Business / Seller Info (Optional)</h3>

        <div style={{ marginBottom: '16px' }}>
          <label>Business Name</label>
          <input
            placeholder='For KYB verification'
            name="businessName"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Registration Number</label>
          <input
            placeholder='RC Number / BN Number'
            name="registrationNumber"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label>Document URL</label>
          <input
            placeholder='Link to CAC or ID document'
            name="documentUrl"
          />
          <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Provide a public link to your document for verification.</small>
        </div>

        <button className='btn' disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
        Already have an account? <a href='/login' style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</a>
      </p>
    </div>
  )
}
