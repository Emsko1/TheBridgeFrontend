import React, { useState } from 'react'

export default function SearchFilter() {
    const [activeCity, setActiveCity] = useState('All')
    const [activePrice, setActivePrice] = useState(null)

    const cities = ['All', 'Lagos', 'Abuja', 'Ikeja', 'Amuwo-Odofin', 'Ibadan', 'Other']
    const prices = ['< 2 M', '2-3 M', '3-4 M', '> 4 M']

    return (
        <div style={{ marginTop: '60px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Select your city:</span>
                {cities.map(city => (
                    <button
                        key={city}
                        onClick={() => setActiveCity(city)}
                        style={{
                            padding: '8px 24px',
                            borderRadius: '8px',
                            border: `1px solid ${activeCity === city ? 'var(--text-main)' : 'var(--text-main)'}`,
                            background: activeCity === city ? 'var(--text-main)' : 'transparent',
                            color: activeCity === city ? 'white' : 'var(--text-main)',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        {city}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {prices.map(price => (
                    <button
                        key={price}
                        onClick={() => setActivePrice(price)}
                        style={{
                            padding: '12px 32px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activePrice === price ? 'var(--primary-light)' : '#E2E8F0',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            minWidth: '120px'
                        }}
                    >
                        {price}
                    </button>
                ))}
            </div>
        </div>
    )
}
