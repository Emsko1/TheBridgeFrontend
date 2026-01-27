import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import mock from '../_mock/listings'
import { listingsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ListingDetails() {
  const [bids, setBids] = useState([])
  const { user } = useAuth() // Assuming useAuth is available
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const fetchListingAndBids = async () => {
      try {
        const response = await listingsAPI.getById(id)
        setCar(response.data)

        // Fetch bids if it's a tender
        if (response.data.IsTender) {
          try {
            // Dynamic import to avoid circular dependency issues if any, or just standard import if api.js exports it
            const { bidsAPI } = await import('../services/api');
            const bidsRes = await bidsAPI.getByListing(id);
            setBids(bidsRes.data);
          } catch (e) {
            console.log("No bids or failed to fetch bids", e);
          }
        }

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

    fetchListingAndBids()
  }, [id])

  // Real-time Bids
  useEffect(() => {
    let cleanup;
    if (car && car.IsTender) {
      import('../services/signalr').then(s => {
        s.onBidPlaced((newBid) => {
          if (newBid.listingId === car.id || newBid.listingId === car.Id) {
            setBids(prev => [newBid, ...prev].sort((a, b) => b.amount - a.amount));
          }
        });
        cleanup = () => {
          // optional: s.offBidPlaced(...) if implemented
        };
      });
    }
    return cleanup;
  }, [car]);

  // Countdown Timer
  useEffect(() => {
    if (!car || !car.IsTender) return;
    const updateTimer = () => {
      const now = new Date();
      const start = new Date(car.SaleStartTime);
      const end = new Date(car.SaleEndTime);

      if (now < start) {
        const diff = start - now;
        setTimeLeft(`Starts in: ${formatDuration(diff)}`);
      } else if (now < end) {
        const diff = end - now;
        setTimeLeft(`Ends in: ${formatDuration(diff)}`);
      } else {
        setTimeLeft('Ended');
      }
    };
    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, [car]);

  const formatDuration = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <div className="p-4">Loading...</div>
  if (!car) return <div className="p-4">Listing not found</div>

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

  const placeBid = async () => {
    const amount = document.getElementById('bidAmount').value;
    if (!amount) return alert('Enter amount');

    // Validation against min bid
    if (car.MinimumBid && Number(amount) < car.MinimumBid) {
      return alert(`Bid must be at least ₦${car.MinimumBid.toLocaleString()}`);
    }
    // Validation against current highest
    if (bids.length > 0 && Number(amount) <= bids[0].amount) {
      return alert(`Bid must be higher than current highest bid of ₦${bids[0].amount.toLocaleString()}`);
    }

    try {
      const { bidsAPI } = await import('../services/api');
      await bidsAPI.placeBid({
        ListingId: car.id || car.Id,
        Amount: Number(amount)
      });
      alert('✅ Bid placed successfully!');
      document.getElementById('bidAmount').value = '';
    } catch (e) {
      console.error(e);
      alert('Error placing bid: ' + (e.response?.data || e.message));
    }
  }

  const initiate = async () => {
    try {
      const payload = {
        ListingId: car.id || car.Id,
        BuyerId: '00000000-0000-0000-0000-000000000000', // Should be from auth context
        SellerId: car.SellerId || '00000000-0000-0000-0000-000000000001',
        Amount: car.price || car.Price,
        Currency: 'NGN'
      }
      const res = await listingsAPI.create(payload)
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
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: 500 }}
          />

          {hasMultiplePhotos && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
              >
                ◄
              </button>

              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
              >
                ►
              </button>

              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {currentPhotoIndex + 1}/{photos.length}
              </div>

              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${currentPhotoIndex === idx ? 'border-primary' : 'border-gray-200'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">{car.title || car.Title}</h1>
        <p className="text-gray-600 mb-4">{car.description || car.Description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {(car.year || car.Year) && <div><strong>Year:</strong> {car.year || car.Year}</div>}
          {(car.location || car.Location) && <div><strong>Location:</strong> {car.location || car.Location}</div>}
        </div>

        {/* Bid History Section */}
        {car.IsTender && (
          <div className="mt-8 border-t pt-4">
            <h3 className="text-xl font-bold mb-4">Bid History</h3>
            {bids.length === 0 ? (
              <p className="text-gray-500">No bids yet. Be the first!</p>
            ) : (
              <div className="space-y-2">
                {bids.map((bid, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>{idx === 0 ? '👑 Highest Bidder' : 'Bidder'}</span>
                    <span className="font-bold">₦{bid.amount?.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="card h-fit sticky top-4">
        <div className="text-3xl font-bold text-primary mb-4">
          {car.IsTender && bids.length > 0
            ? `Current: ₦${bids[0].amount.toLocaleString()}`
            : `₦${((car.price || car.Price) || 0).toLocaleString()}`
          }
        </div>

        {car.IsTender && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <span>⏱️</span> Appointed Hour
            </h4>
            <div className="text-xl font-mono font-bold text-blue-800 text-center py-2 bg-white rounded border border-blue-200">
              {timeLeft}
            </div>
            {car.MinimumBid && <p className="text-sm text-center mt-2 text-gray-600">Starting Bid: ₦{car.MinimumBid.toLocaleString()}</p>}
          </div>
        )}

        {car.IsTender ? (
          <div className="mt-4">
            {timeLeft.startsWith('Ends') || timeLeft.includes('d') ? (
              <>
                <input
                  type="number"
                  placeholder={`Min: ₦${(bids.length > 0 ? bids[0].amount + 1000 : car.MinimumBid || 0).toLocaleString()}`}
                  id="bidAmount"
                  className="w-full p-3 border rounded mb-2 font-mono"
                />
                <button className="btn w-full bg-primary hover:bg-primary-dark" onClick={placeBid}>
                  Place Bid
                </button>
              </>
            ) : (
              <button disabled className="btn w-full bg-gray-300 cursor-not-allowed">
                {timeLeft === 'Ended' ? 'Auction Ended' : 'Not Started Yet'}
              </button>
            )}
          </div>
        ) : (
          <button className="btn w-full bg-green-600 hover:bg-green-700" onClick={initiate}>
            Buy Now (Escrow)
          </button>
        )}

        <div className="mt-4 text-xs text-center text-gray-500">
          {car.IsTender ? "Highest bidder wins at the Appointed Hour." : "Secure transaction via Paystack Escrow."}
        </div>
      </aside>
    </div>
  )
}
