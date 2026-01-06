import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="/Bridgelogo.svg" alt="Bridge Logo" style={{ height: '50px', width: 'auto' }} />
          <span style={{ color: '#d4af37', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>BRIDGE</span>
        </Link>

        <nav style={{ display: 'flex', gap: 24 }}>
          <Link to="/listings" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.3s' }}>
            Browse
          </Link>
          <Link to="/sell" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.3s' }}>
            Sell
          </Link>
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link to="/profile" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', transition: 'color 0.3s' }}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid #d4af37',
                  color: '#d4af37',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.3s' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', transition: 'color 0.3s' }}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header >
  )
}
