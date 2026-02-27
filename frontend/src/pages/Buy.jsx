import React, { useState } from 'react'
import CarListings from './CarListings'
import SparePartListings from './SparePartListings'

export default function Buy() {
  const [buyType, setBuyType] = useState('car') // Default to 'car'

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '24px', fontSize: 'clamp(28px, 5vw, 2.5rem)' }}>
          <span style={{ color: 'var(--primary)' }}>Browse</span> Our Marketplace
        </h1>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setBuyType('car')}
            style={{
              padding: '12px 24px',
              border: buyType === 'car' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: buyType === 'car' ? 'var(--primary-light)' : 'transparent',
              color: buyType === 'car' ? 'var(--primary)' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s',
              fontSize: '16px'
            }}
          >
            🚗 Cars
          </button>
          <button
            onClick={() => setBuyType('spareparts')}
            style={{
              padding: '12px 24px',
              border: buyType === 'spareparts' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: buyType === 'spareparts' ? 'var(--primary-light)' : 'transparent',
              color: buyType === 'spareparts' ? 'var(--primary)' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s',
              fontSize: '16px'
            }}
          >
            🔧 Spare Parts
          </button>
        </div>
      </div>

      {/* Display selected category */}
      {buyType === 'car' && <CarListings />}
      {buyType === 'spareparts' && <SparePartListings />}
    </div>
  )
}
