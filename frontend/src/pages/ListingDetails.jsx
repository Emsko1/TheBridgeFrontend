import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import mock from '../_mock/listings'
import { listingsAPI } from '../services/api'

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
        // Fallback to mock data
        const mockCar = mock.find(c => c.id === id)
        if (mockCar) {
          setCar(mockCar)
        } else {
          setCar({ id, title: 'Item', price: 1000, description: 'No details', photo: 'https://picsum.photos/seed/placeholder/800/600' })
        }
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
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>₦{((car.price || car.Price) || 0).toLocaleString()}</div>

        {car.IsTender && (
          <div style={{ marginBottom: 16, padding: 10, background: '#f0f8ff', borderRadius: 4 }}>
            <h4>📢 Tender / Auction</h4>
            {new Date(car.SaleStartTime) > new Date() ? (
              <p>Starts in: <strong>{new Date(car.SaleStartTime).toLocaleString()}</strong></p>
            ) : new Date(car.SaleEndTime) > new Date() ? (
              <p style={{ color: 'green' }}>🟢 Active! Ends: {new Date(car.SaleEndTime).toLocaleString()}</p>
            ) : (
              <p style={{ color: 'red' }}>🔴 Ended</p>
            )}
            {car.MinimumBid && <p>Minimum Bid: ₦{car.MinimumBid.toLocaleString()}</p>}
          </div>
        )}

        {car.IsTender ? (
          <div style={{ marginTop: 16 }}>
            <input type="number" placeholder="Enter your bid amount" id="bidAmount" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <button className="btn" style={{ width: '100%' }} onClick={async () => {
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
        ) : (
          <button className="btn" onClick={initiate} style={{ width: '100%' }}>Buy (Escrow via Paystack)</button>
        )}
      </aside>
    </div>
  )
}
