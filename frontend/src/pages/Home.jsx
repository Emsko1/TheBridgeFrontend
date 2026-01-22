import React from 'react'
import { Link } from 'react-router-dom'
import WhyChooseUs from '../components/WhyChooseUs'
import SearchFilter from '../components/SearchFilter'
export default function Home() {
  const isLoggedIn = !!localStorage.getItem('bridge_token')

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '40px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 3.5rem)', marginBottom: '24px', lineHeight: 1.1 }}>
            Secure Bridge for <br />
            <span style={{ color: 'var(--primary)' }}>Premium Cars.</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px, 4vw, 1.2rem)', marginBottom: '32px', maxWidth: '480px' }}>
            Buy and sell foreign used and Nigerian used cars with complete peace of mind. Our escrow service ensures you never lose a dime.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexDirection: 'row', flexWrap: 'wrap' }}>
            {isLoggedIn ? (
              <>
                <Link className="btn" to="/listings" style={{ padding: '12px 24px', fontSize: 'clamp(14px, 3vw, 1.1rem)', flex: 'auto', minWidth: '150px' }}>
                  Browse Cars
                </Link>
                <Link className="btn-outline" to="/sell" style={{ padding: '12px 24px', fontSize: 'clamp(14px, 3vw, 1.1rem)', flex: 'auto', minWidth: '150px' }}>
                  Sell a Car
                </Link>
              </>
            ) : (
              <>
                <Link className="btn" to="/register" style={{ padding: '12px 24px', fontSize: 'clamp(14px, 3vw, 1.1rem)', flex: 'auto', minWidth: '150px' }}>
                  Start Trading
                </Link>
                <Link className="btn-ghost" to="/login" style={{ padding: '12px 24px', fontSize: 'clamp(14px, 3vw, 1.1rem)', flex: 'auto', minWidth: '150px' }}>
                  Login
                </Link>
              </>
            )}
          </div>

          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '24px', color: 'var(--text-muted)' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'clamp(18px, 4vw, 24px)', color: 'var(--text-main)' }}>500+</div>
              <div style={{ fontSize: '14px' }}>Verified Cars</div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'clamp(18px, 4vw, 24px)', color: 'var(--text-main)' }}>₦2B+</div>
              <div style={{ fontSize: '14px' }}>Traded Volume</div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'clamp(18px, 4vw, 24px)', color: 'var(--text-main)' }}>100%</div>
              <div style={{ fontSize: '14px' }}>Secure Escrow</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', minHeight: '300px' }}>
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
              boxShadow: 'var(--shadow-lg)',
              objectFit: 'cover'
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
          justifyContent: 'center'
        }}
      >
        💬
      </a>

      <style>{`
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  )
}
