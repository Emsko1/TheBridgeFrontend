import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth()
  const isOnline = useOnlineStatus()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #d4af37 100%)', padding: '16px 24px', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)', position: 'sticky', top: 0, zIndex: 999 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="/Bridgelogo.svg" alt="Bridge Logo" style={{ height: '60px', width: 'auto' }} />
          <span style={{ color: '#ffffff', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', display: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }} className="desktop-text">BRIDGE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="desktop-nav">
          <Link to="/buy" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.3s', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            Browse
          </Link>
          <Link to="/sell" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.3s', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            Sell
          </Link>
          <Link to="/flash-sale" style={{ color: '#fef3c7', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', transition: 'color 0.3s', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            LIVE AUCTIONS
          </Link>
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  title={isOnline ? "Online" : "Offline"}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isOnline ? '#10B981' : '#94A3B8',
                    boxShadow: isOnline ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
                <Link to="/profile" style={{ color: '#fef3c7', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', transition: 'color 0.3s', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  Profile
                </Link>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: '#ffffff',
                  border: '2px solid #ffffff',
                  color: '#1e3a8a',
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
              <Link to="/login" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.3s', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: '#fef3c7', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', transition: 'color 0.3s', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#fef3c7',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px'
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '2px solid rgba(255,255,255,0.2)',
          alignItems: 'flex-start',
          background: 'rgba(30, 40, 138, 0.95)',
          padding: '16px 0 16px 0',
          marginLeft: '-24px',
          marginRight: '-24px',
          paddingLeft: '24px',
          paddingRight: '24px'
        }} className="mobile-nav">
          <Link to="/buy" onClick={() => setMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            Browse
          </Link>
          <Link to="/sell" onClick={() => setMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            Sell
          </Link>
          <Link to="/flash-sale" onClick={() => setMenuOpen(false)} style={{ color: '#fef3c7', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            LIVE AUCTIONS
          </Link>
          {isAuthenticated ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isOnline ? '#10B981' : '#94A3B8',
                    boxShadow: isOnline ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none'
                  }}
                />
                <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: '#fef3c7', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  Profile
                </Link>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: '#ffffff',
                  border: '2px solid #ffffff',
                  color: '#1e3a8a',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ color: '#fef3c7', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Register
              </Link>
            </>
          )}
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .desktop-text {
            display: inline !important;
            font-size: 18px !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  )
}
