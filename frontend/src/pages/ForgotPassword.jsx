import React, { useState } from 'react'
import { authAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleReset = async (e) => {
        e.preventDefault()
        if (!email) return toast.error('Please enter your email')

        setLoading(true)
        try {
            await authAPI.forgotPassword(email)

            toast.success('Password reset link sent to your email!')
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset link')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='card' style={{ maxWidth: 400, margin: '50px auto' }}>
            <h2 className="text-center" style={{ marginBottom: '16px' }}>Reset Password</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleReset}>
                <div style={{ marginBottom: '24px' }}>
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

                <button className='btn' disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <a href='/login' style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Back to Login
                </a>
            </div>
        </div>
    )
}
