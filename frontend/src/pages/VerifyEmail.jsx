import React, { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function VerifyEmail() {
    const [otp, setOtp] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const storedEmail = localStorage.getItem('pending_verification_email')
        if (storedEmail) {
            setEmail(storedEmail)
        } else {
            // If no email found, redirect to login as they shouldn't be here
            navigate('/login')
        }
    }, [navigate])

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            console.log('Sending verification request:', { email, otp })
            const response = await authAPI.verifyEmail(email, otp)
            console.log('Verification successful:', response.data)

            // Store token if returned on verification
            if (response.data.token) {
                localStorage.setItem('bridge_token', response.data.token)
                // Also store user info if needed
                if (response.data.user) {
                    localStorage.setItem('bridge_user', JSON.stringify(response.data.user))
                }
            }

            alert('✅ Email verified successfully! You can now access your account.')
            localStorage.removeItem('pending_verification_email')
            navigate('/profile')
        } catch (err) {
            console.error('Verification error:', err)
            setError(err.response?.data?.message || 'Verification failed. Invalid code.')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        // Implement resend logic if backend supports it
        alert("Please request a new registration if code expired.")
    }

    return (
        <div className='card' style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '16px' }}>Verify Your Email</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                We sent a 6-digit code to <br /><strong>{email}</strong>
            </p>

            {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
                    ❌ {error}
                </div>
            )}

            <form onSubmit={submit}>
                <div style={{ marginBottom: '24px' }}>
                    <input
                        required
                        type='text'
                        placeholder='0 0 0 0 0 0'
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        disabled={loading}
                        style={{
                            letterSpacing: '8px',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            padding: '12px'
                        }}
                    />
                </div>

                <button className='btn' disabled={loading || otp.length < 6} style={{ width: '100%' }}>
                    {loading ? 'Verifying...' : 'VERIFY ACCOUNT'}
                </button>
            </form>

            <p style={{ marginTop: '24px', fontSize: '0.9rem' }}>
                Didn't receive the code? <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Resend</button>
            </p>
        </div>
    )
}
