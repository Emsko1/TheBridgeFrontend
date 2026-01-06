import React from 'react'
import { Link } from 'react-router-dom'
import WhyChooseUs from '../components/WhyChooseUs'
import SearchFilter from '../components/SearchFilter'
export default function Home() {
  const isLoggedIn = !!localStorage.getItem('bridge_token')

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '60px' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '24px', lineHeight: 1.1 }}>
            Secure Bridge for <br />
            <span style={{ color: 'var(--primary)' }}>Premium Cars.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '32px', maxWidth: '480px' }}>
            Buy and sell foreign used and Nigerian used cars with complete peace of mind. Our escrow service ensures you never lose a dime.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            {isLoggedIn ? (
              <>
                <Link className="btn" to="/listings" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                  Browse Cars
                </Link>
                <Link className="btn-outline" to="/sell" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                  Sell a Car
                </Link>
              </>
            ) : (
              <>
                <Link className="btn" to="/register" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                  Start Trading
                </Link>
                <Link className="btn-ghost" to="/login" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                  Login
                </Link>
              </>
            )}
          </div>

          <div style={{ marginTop: '40px', display: 'flex', gap: '40px', color: 'var(--text-muted)' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--text-main)' }}>500+</div>
              <div>Verified Cars</div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--text-main)' }}>₦2B+</div>
              <div>Traded Volume</div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--text-main)' }}>100%</div>
              <div>Secure Escrow</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100%',
            height: '100%',
            background: 'var(--primary-light)',
            borderRadius: '24px',
            zIndex: -1
          }}></div>
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
            alt="Hero Car"
            style={{
              width: '100%',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
          />
        </div>
      </div>

      <WhyChooseUs />
      <SearchFilter />

      <a
        href="https://wa.me/2341234567890"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          backgroundColor: '#E0F2F1',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #B2DFDB'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00D09C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </a>
    </div>
  )
}
