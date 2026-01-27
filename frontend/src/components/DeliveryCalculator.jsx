import React, { useState } from 'react';

const LOCATIONS = [
    { name: 'Lagos (Island)', basePrice: 15000, days: '1-2' },
    { name: 'Lagos (Mainland)', basePrice: 10000, days: '1-2' },
    { name: 'Abuja', basePrice: 80000, days: '3-5' },
    { name: 'Port Harcourt', basePrice: 75000, days: '3-5' },
    { name: 'Ibadan', basePrice: 30000, days: '2-3' },
    { name: 'Kano', basePrice: 120000, days: '5-7' },
    { name: 'Enugu', basePrice: 60000, days: '3-4' },
];

export default function DeliveryCalculator() {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [estimate, setEstimate] = useState(null);

    const calculate = (e) => {
        const locName = e.target.value;
        setSelectedLocation(locName);

        if (!locName) {
            setEstimate(null);
            return;
        }

        const loc = LOCATIONS.find(l => l.name === locName);
        if (loc) {
            setEstimate(loc);
        }
    };

    return (
        <div style={{ marginTop: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                🚚 Logistics & Delivery
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                    <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>Select Delivery Location</label>
                    <select
                        value={selectedLocation}
                        onChange={calculate}
                        style={{ width: '100%', padding: '10px' }}
                    >
                        <option value="">-- Choose State/City --</option>
                        {LOCATIONS.map(loc => (
                            <option key={loc.name} value={loc.name}>{loc.name}</option>
                        ))}
                    </select>
                </div>

                {estimate && (
                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: '#166534' }}>Estimated Cost:</span>
                            <span style={{ fontWeight: 'bold', color: '#166534' }}>₦{estimate.basePrice.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#166534' }}>Delivery Time:</span>
                            <span style={{ fontWeight: 'bold', color: '#166534' }}>{estimate.days} Days</span>
                        </div>
                        <p style={{ fontSize: '12px', marginTop: '8px', color: '#15803d' }}>
                            *Estimate includes insurance and handling.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
