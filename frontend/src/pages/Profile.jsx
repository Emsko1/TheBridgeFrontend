import React, { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authAPI.getProfile()
                setUser(response.data)
            } catch (err) {
                console.error('Failed to fetch profile:', err)
                navigate('/login')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [navigate])

    if (loading) return <div className="card">Loading...</div>
    if (!user) return null

    return (
        <div className="card" style={{ maxWidth: 600, margin: '20px auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#0ea5a4',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginRight: 16
                }}>
                    {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>{user.name}</h2>
                    <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                    <h3 style={{ marginTop: 0, fontSize: 16 }}>Account Status</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>Role:</span>
                        <strong>{user.role}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>KYC Status:</span>
                        <span style={{
                            fontWeight: 'bold',
                            color: user.kycStatus === 'Verified' ? 'green' :
                                user.kycStatus === 'Rejected' ? 'red' : 'orange'
                        }}>
                            {user.kycStatus}
                        </span>
                    </div>
                    {user.rejectionReason && (
                        <div style={{ marginTop: 8, color: 'red', fontSize: 14 }}>
                            Reason: {user.rejectionReason}
                        </div>
                    )}
                </div>

                {(user.businessName || user.registrationNumber) && (
                    <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                        <h3 style={{ marginTop: 0, fontSize: 16 }}>Business Details</h3>
                        {user.businessName && (
                            <div style={{ marginBottom: 8 }}>
                                <strong>Business Name:</strong> {user.businessName}
                            </div>
                        )}
                        {user.registrationNumber && (
                            <div>
                                <strong>Reg Number:</strong> {user.registrationNumber}
                            </div>
                        )}
                    </div>
                )}

                <button
                    className="btn"
                    onClick={() => {
                        localStorage.removeItem('bridge_token')
                        navigate('/login')
                    }}
                    style={{ background: '#ff4444', marginTop: 16 }}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
