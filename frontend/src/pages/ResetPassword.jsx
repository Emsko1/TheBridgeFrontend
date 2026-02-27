import React, { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            toast.error('Invalid or missing reset token')
            navigate('/login')
        }
    }, [token, navigate])

    const handleReset = async (e) => {
        e.preventDefault()
        if (!newPassword || !confirmPassword) return toast.error('Please fill in all fields')
        if (newPassword !== confirmPassword) return toast.error('Passwords do not match')

        // Simple validation, minimum 8 characters, etc. handled partly by backend but good to check early
        if (newPassword.length < 8) return toast.error('Password must be at least 8 characters long')

        setLoading(true)
        try {
            const res = await authAPI.resetPassword(token, newPassword)
            toast.success(res.data?.message || 'Password reset successfully. You can now login.')
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password. The link might be expired.')
        } finally {
            setLoading(false)
        }
    }

    if (!token) return null

    return (
        <div className='card' style={{ maxWidth: 400, margin: '50px auto' }}>
            <h2 className="text-center" style={{ marginBottom: '16px' }}>Create New Password</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Enter your new password below.
            </p>

            <form onSubmit={handleReset}>
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <label>New Password</label>
                    <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        disabled={loading}
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
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </button>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label>Confirm Password</label>
                    <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button className='btn' disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    )
}
