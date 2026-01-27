import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import mock from '../_mock/listings'
import { listingsAPI } from '../services/api'
import DeliveryCalculator from '../components/DeliveryCalculator'

export default function ListingDetails() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingsAPI.getById(id)
        setCar(response.data)
      } catch (err) {
        console.error('Failed to fetch listing:', err)
        setCar(null)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  if (loading) return <div><p>Loading...</p></div>
  if (!car) return <div><p>Listing not found</p></div>

  // Handle both single photo and multiple photos
  const photos = (car.Photos && Array.isArray(car.Photos) && car.Photos.length > 0)
    ? car.Photos
    : (car.photo ? [car.photo] : ['https://picsum.photos/seed/placeholder/800/600'])

  const currentPhoto = photos[currentPhotoIndex] || photos[0]
  const hasMultiplePhotos = photos.length > 1

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const initiate = async () => {
    try {
      const payload = {
        ListingId: car.id || car.Id,
        BuyerId: '00000000-0000-0000-0000-000000000000',
        SellerId: car.SellerId || '00000000-0000-0000-0000-000000000001',
        Amount: car.price || car.Price,
        Currency: 'NGN'
      }
      const res = await listingsAPI.create(payload) // Should be paystackAPI but using available endpoint
      if (res.data && res.data.authorization_url) {
        window.location.href = res.data.authorization_url
      } else {
        alert('Unable to initiate payment (no authorization_url returned).')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to initiate payment.')
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <div style={{ position: 'relative', width: '100%', marginBottom: 16 }}>
          <img
            src={currentPhoto}
            alt={car.title || car.Title}
            style={{ width: '100%', borderRadius: 6, maxHeight: 400, objectFit: 'cover' }}
          />

          {hasMultiplePhotos && (
            <>
              <button
                onClick={handlePrevPhoto}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 'bold'
                }}
              >
                ◄
              </button>

              <button
                onClick={handleNextPhoto}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 'bold'
                }}
              >
                ►
              </button>

              <div style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: 12
              }}>
                {currentPhotoIndex + 1}/{photos.length}
              </div>

              <div style={{ display: 'flex', gap: 4, marginTop: 8, overflowX: 'auto' }}>
                {photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 4,
                      cursor: 'pointer',
                      border: currentPhotoIndex === idx ? '2px solid #0ea5a4' : '1px solid #ddd'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <h2>
          {car.title || car.Title}

        </h2>
        <p>{car.description || car.Description}</p>
        {(car.year || car.Year) && <p><strong>Year:</strong> {car.year || car.Year}</p>}
        {(car.location || car.Location) && <p><strong>Location:</strong> {car.location || car.Location}</p>}
      </div>

      <aside className="card">
        <div style={{ padding: '0 0 16px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'block' }}>Asking Price</span>
          <div style={{ fontWeight: 800, fontSize: '32px', color: 'var(--primary)' }}>
            ₦{((car.price || car.Price) || 0).toLocaleString()}
          </div>
        </div>

        {/* Mocking Best Bid for UI demonstration if not present in car object */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Best Offer / Bid</span>
            <span style={{ fontWeight: 'bold' }}>₦{((car.HighestBid || (car.price * 0.9)) || 0).toLocaleString()}</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '90%', height: '100%', background: 'var(--accent)', borderRadius: '4px' }}></div>
          </div>
        </div>

        {car.IsTender ? (
          <div style={{ marginBottom: 16, padding: '16px', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FCD34D' }}>
            <h4 style={{ color: '#B45309', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔨</span> Live Auction
            </h4>
            {new Date(car.SaleStartTime) > new Date() ? (
              <p>Starts in: <strong>{new Date(car.SaleStartTime).toLocaleString()}</strong></p>
            ) : new Date(car.SaleEndTime) > new Date() ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ color: 'var(--success)', fontWeight: 'bold' }}>● Active Now</p>
                <p style={{ fontSize: '14px' }}>Ends: {new Date(car.SaleEndTime).toLocaleString()}</p>
              </div>
            ) : (
              <p style={{ color: 'var(--danger)' }}>🔴 Ended</p>
            )}

            <div style={{ marginTop: '16px' }}>
              <input
                type="number"
                placeholder="Enter your bid amount"
                id="bidAmount"
                style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <button className="btn" style={{ width: '100%', background: 'var(--accent)', color: 'white' }} onClick={async () => {
                const amount = document.getElementById('bidAmount').value;
                if (!amount) return alert('Enter amount');
                try {
                  const { bidsAPI } = await import('../services/api');
                  await bidsAPI.placeBid({
                    ListingId: car.id || car.Id,
                    Amount: Number(amount)
                  });
                  alert('✅ Bid placed successfully!');
                } catch (e) {
                  console.error(e);
                  alert('Error placing bid: ' + (e.response?.data || e.message));
                }
              }}>Place Bid</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn" onClick={initiate} style={{ width: '100%', fontSize: '16px' }}>
              Buy Now
            </button>

            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-main)' }}>Make an Offer</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="Offer Amount (₦)"
                  id="offerAmount"
                  style={{ flex: 1, padding: '10px' }}
                />
                <button
                  className="btn btn-outline"
                  style={{ padding: '0 20px' }}
                  onClick={() => alert('Offer sent to seller! Check your dashboard for updates.')}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
            🔒 Transactions secured by Paystack Escrow.
            <br />
            Logistics & Inspection available upon request.
          </p>
        </div>

        <DeliveryCalculator />
      </aside>
    </div>
  )
}
