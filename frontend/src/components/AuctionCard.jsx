import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AuctionCard({ listing }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [currentBid, setCurrentBid] = useState(listing.price);
    const [bidders, setBidders] = useState(Math.floor(Math.random() * 5));

    function calculateTimeLeft() {
        if (!listing.SaleEndTime) return {};

        const difference = +new Date(listing.SaleEndTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Simulate random incoming bids
        const bidTimer = setInterval(() => {
            if (Math.random() > 0.7) {
                // In real app, bids come via websocket or polling
                // keeping simulation for visual feedback until socket is connected
            }
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(bidTimer);
        };
    }, [listing.SaleEndTime]);

    return (
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#EF4444',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '12px',
                zIndex: 10,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                LIVE BIDDING
            </div>

            <img
                src={listing.imageUrl || 'https://via.placeholder.com/300x200?text=Car'}
                alt={`${listing.year} ${listing.make} ${listing.model}`}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
            />

            <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                    {listing.year} {listing.make} {listing.model}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Current Bid</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '20px' }}>
                        ₦{currentBid.toLocaleString()}
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FEF2F2', padding: '8px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>⏰</span>
                        <span style={{ color: '#DC2626', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '16px' }}>
                            {timeLeft.h || '00'}:{timeLeft.m || '00'}:{timeLeft.s || '00'}
                        </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#DC2626' }}>{bidders} active bidders</span>
                </div>

                <Link to={`/listing/${listing.id}`} className="btn" style={{ width: '100%', textAlign: 'center' }}>
                    Place Bid
                </Link>
            </div>
        </div>
    );
}
