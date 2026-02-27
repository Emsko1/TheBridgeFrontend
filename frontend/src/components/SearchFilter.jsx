import React, { useState, useEffect } from 'react'

export default function SearchFilter({
    onCityChange,
    onPriceChange,
    initialCity = 'All',
    initialPrice = null
}) {
    const [activeCity, setActiveCity] = useState(initialCity)
    const [activePrice, setActivePrice] = useState(initialPrice)

    const cities = ['All', 'Lagos', 'Abuja', 'Ikeja', 'Amuwo-Odofin', 'Ibadan', 'Other']
    const prices = ['< 2 M', '2-3 M', '3-4 M', '> 4 M']

    // Update internal state if props change (e.g., from URL)
    useEffect(() => {
        if (initialCity) setActiveCity(initialCity)
    }, [initialCity])

    useEffect(() => {
        if (initialPrice) setActivePrice(initialPrice)
    }, [initialPrice])

    const handleCityClick = (city) => {
        setActiveCity(city)
        if (onCityChange) onCityChange(city)
    }

    const handlePriceClick = (price) => {
        const newPrice = activePrice === price ? null : price
        setActivePrice(newPrice)
        if (onPriceChange) onPriceChange(newPrice)
    }

    return (
        <div style={{ marginTop: '40px', padding: '20px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 'clamp(14px, 3vw, 16px)', minWidth: 'fit-content' }}>Select your city:</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {cities.map(city => (
                        <button
                            key={city}
                            onClick={() => handleCityClick(city)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${activeCity === city ? 'var(--text-main)' : 'var(--text-main)'}`,
                                background: activeCity === city ? 'var(--text-main)' : 'transparent',
                                color: activeCity === city ? 'white' : 'var(--text-main)',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: 'clamp(12px, 2vw, 14px)',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {prices.map(price => (
                    <button
                        key={price}
                        onClick={() => handlePriceClick(price)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activePrice === price ? 'var(--primary-light)' : '#E2E8F0',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            minWidth: '100px',
                            fontSize: 'clamp(12px, 2vw, 14px)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {price}
                    </button>
                ))}
            </div>

            <style>{`
                @media (max-width: 640px) {
                    div[style*="display: flex"][style*="gap: '12px'"][style*="marginBottom"] {
                        flex-direction: column;
                        align-items: stretch;
                    }
                }
            `}</style>
        </div>
    )
}

