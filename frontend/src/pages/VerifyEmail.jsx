import React, { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

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

            // Do not auto-login. Force user to login manually.
            toast.success('✅ Email verified successfully! Redirecting to login...')
            localStorage.removeItem('pending_verification_email')

            // Short delay to let the toast be seen
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            console.error('Verification error:', err)
            setError(err.response?.data?.message || 'Verification failed. Invalid code.')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (!email) {
            toast.error("No email address found. Please register again.")
            return
        }

        const loadingToast = toast.loading('Resending code...')
        try {
            await authAPI.resendVerification(email)
            toast.dismiss(loadingToast)
            toast.success('✅ Verification code resent! Check your email.')
        } catch (err) {
            toast.dismiss(loadingToast)
            console.error('Resend error:', err)

            let msg = 'Failed to resend code.'
            if (err.response) {
                const data = err.response.data
                msg = data?.message || data?.Message || data?.title || msg
                if (err.response.status === 404) msg = 'Endpoint not found (404)'
                if (err.response.status === 401) msg = 'Unauthorized (401)'
                if (err.response.status === 500) msg = 'Server Error (500)'
            } else if (err.request) {
                msg = 'Network Error - Backend unreachable'
            }

            toast.error(msg)
        }
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
