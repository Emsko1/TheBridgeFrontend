import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function VerifyEmail() {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendDisabled, setResendDisabled] = useState(false)
    const [countdown, setCountdown] = useState(0)

    const location = useLocation()
    const navigate = useNavigate()
    const email = location.state?.email

    useEffect(() => {
        if (!email) {
            navigate('/register')
        }
    }, [email, navigate])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setResendDisabled(false)
        }
    }, [countdown])

    const handleVerify = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit code')
            setLoading(false)
            return
        }

        try {
            console.log('🔐 Verifying email:', { email, otp })
            await authAPI.verifyEmail(email, otp)
            alert('✅ Email verified successfully! Please login.')
            navigate('/login')
        } catch (err) {
            console.error('❌ Verification error:', err)
            const message = err.response?.data?.message || err.response?.data || 'Verification failed. Invalid or expired code.'
            setError(typeof message === 'string' ? message : 'Verification failed')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setError('')
        setResendDisabled(true)
        setCountdown(60) // 60 seconds cooldown

        try {
            console.log('📧 Resending verification code to:', email)
            await authAPI.resendVerification(email)
            alert('✅ Verification code resent! Check your email.')
        } catch (err) {
            console.error('❌ Resend error:', err)
            setError('Failed to resend code. Please try again later.')
            setResendDisabled(false)
            setCountdown(0)
        }
    }

    return (
        <div className='card' style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '16px' }}>Verify Your Email</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                We sent a 6-digit code to <br />
                <strong>{email}</strong>
            </p>

            {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'left' }}>
                    ❌ {error}
                </div>
            )}

            <form onSubmit={handleVerify}>
                <div style={{ marginBottom: '24px' }}>
                    <input
                        type="text"
                        maxLength="6"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        disabled={loading}
                        style={{
                            width: '100%',
                            fontSize: '2rem',
                            letterSpacing: '0.5rem',
                            textAlign: 'center',
                            padding: '12px',
                            fontWeight: 'bold'
                        }}
                    />
                </div>

                <button className='btn' disabled={loading || otp.length !== 6} style={{ width: '100%', marginBottom: '16px' }}>
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
            </form>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Didn't receive the code?{' '}
                <button
                    onClick={handleResend}
                    disabled={resendDisabled}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: resendDisabled ? 'var(--text-muted)' : 'var(--primary)',
                        fontWeight: 600,
                        cursor: resendDisabled ? 'default' : 'pointer',
                        padding: 0,
                        textDecoration: 'underline'
                    }}
                >
                    {resendDisabled ? `Resend in ${countdown}s` : 'Resend'}
                </button>
            </div>
        </div>
    )
}
