import React, { useState, useEffect } from 'react';
import AuctionCard from '../components/AuctionCard';
import { listingsAPI } from '../services/api';

export default function FlashSale() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await listingsAPI.getAll();
                const baseListings = response.data || [];
                // Filter for items capable of instant sale / auction
                const auctions = baseListings.filter(item => item.IsTender || item.SaleEndTime);
                setListings(auctions);
            } catch (error) {
                console.error("Failed to fetch listings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={{
                textAlign: 'center',
                padding: '60px 0',
                background: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url(https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '0 0 24px 24px',
                marginBottom: '40px',
                color: 'white'
            }}>
                <h1 style={{ color: '#D4AF37', marginBottom: '16px', fontSize: '48px' }}>THE APPOINTED HOUR</h1>
                <p style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
                    Exclusive deals. Live bidding. Greatest value.
                    <br />
                    Join the tensiometer of trading.
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '4px', height: '24px', background: 'var(--danger)' }}></div>
                <h2 style={{ margin: 0 }}>Live Auctions Happening Now</h2>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading auctions...</div>
            ) : (
                <div className="grid grid-cols-3">
                    {listings.map(listing => (
                        <AuctionCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}
