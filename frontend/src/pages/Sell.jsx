import React, { useState } from 'react'
import SellCar from './SellCar'
import SellSpareParts from './SellSpareParts'

export default function Sell() {
  const [sellType, setSellType] = useState(null) // 'car', 'spareparts', or null

  if (sellType === 'car') {
    return (
      <div>
        <button
          onClick={() => setSellType(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: 'var(--border)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back
        </button>
        <SellCar />
      </div>
    )
  }

  if (sellType === 'spareparts') {
    return (
      <div>
        <button
          onClick={() => setSellType(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: 'var(--border)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back
        </button>
        <SellSpareParts />
      </div>
    )
  }

  // Show selection screen
  return (
    <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '16px', fontSize: 'clamp(28px, 5vw, 2.5rem)' }}>
          What are you <span style={{ color: 'var(--primary)' }}>selling?</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '48px' }}>
          Choose the type of item you want to list
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Sell Car Option */}
          <div
            onClick={() => setSellType('car')}
            style={{
              padding: '40px',
              border: '2px solid var(--border)',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: 'var(--background)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.backgroundColor = 'var(--primary-light)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.backgroundColor = 'var(--background)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
            <h2 style={{ marginBottom: '12px', fontSize: '24px' }}>Sell a Car</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              List your vehicle for sale with photos and details
            </p>
            <button
              className="btn"
              style={{ marginTop: 'auto', padding: '10px 24px' }}
              onClick={() => setSellType('car')}
            >
              Continue to Car Listing
            </button>
          </div>

          {/* Sell Spare Parts Option */}
          <div
            onClick={() => setSellType('spareparts')}
            style={{
              padding: '40px',
              border: '2px solid var(--border)',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: 'var(--background)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.backgroundColor = 'var(--primary-light)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.backgroundColor = 'var(--background)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
            <h2 style={{ marginBottom: '12px', fontSize: '24px' }}>Sell Spare Parts</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              List auto parts and accessories for sale
            </p>
            <button
              className="btn-outline"
              style={{ marginTop: 'auto', padding: '10px 24px' }}
              onClick={() => setSellType('spareparts')}
            >
              Continue to Parts Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
