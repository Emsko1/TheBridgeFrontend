import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { toast } from 'react-hot-toast'

export default function VerifyEmail() {
    const [code, setCode] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Try to get email from navigation state or URL query
        const stateEmail = location.state?.email
        const queryEmail = new URLSearchParams(location.search).get('email')
        if (stateEmail) setEmail(stateEmail)
        else if (queryEmail) setEmail(queryEmail)
    }, [location])

    const handleVerify = async (e) => {
        e.preventDefault()
        if (!code || !email) {
            toast.error('Email and verification code are required')
            return
        }

        setLoading(true)
        try {
            await authAPI.verifyEmail(email, code)
            toast.success('Email verified successfully! Redirecting to login...')

            // Short delay to let the toast be seen and ensure state updates clear
            setTimeout(() => {
                navigate('/login', { replace: true })
            }, 1500)
        } catch (err) {
            console.error('Verification error:', err)
            // Ensure we extract the error message correctly even if response is weird
            const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Verification failed.'
            const finalMsg = typeof errorMsg === 'string' ? errorMsg : 'Verification failed.'
            toast.error(finalMsg)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (!email) {
            toast.error('Email address is missing')
            return
        }

        setResending(true)
        try {
            await authAPI.resendVerification(email)
            toast.success('Verification code resent! Check your inbox.')
        } catch (err) {
            console.error('Resend error:', err)
            let errorMessage = 'Failed to resend code.'

            if (err.response) {
                // Server responded with a status code
                const data = err.response.data
                const message = data?.message || data?.title || (typeof data === 'string' ? data : '')
                errorMessage = `Error ${err.response.status}: ${message || 'Server error'}`
            } else if (err.request) {
                // Request made but no response
                errorMessage = 'Network error: No response from server.'
            } else {
                errorMessage = err.message
            }

            toast.error(errorMessage)
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="card" style={{ maxWidth: 400, margin: '50px auto' }}>
            <h2 className="text-center" style={{ marginBottom: '16px' }}>Verify Your Email</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px' }}>
                We sent a verification code to <strong>{email || 'your email'}</strong>.
                <br />
                Please enter it below to activate your account.
            </p>

            <form onSubmit={handleVerify}>
                <div style={{ marginBottom: '20px' }}>
                    <label>Email Address</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Confirm your email"
                        disabled={!!location.state?.email}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Verification Code</label>
                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g. 123456"
                        style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
                        maxLength={6}
                        required
                    />
                </div>

                <button className="btn" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Didn't receive the code?
                </p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: resending ? 'var(--text-muted)' : 'var(--primary)',
                        fontWeight: 'bold',
                        cursor: resending ? 'default' : 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    {resending ? 'Resending...' : 'Resend Code'}
                </button>
            </div>
        </div>
    )
}
