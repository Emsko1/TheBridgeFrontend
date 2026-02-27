import React, { useEffect, useState } from 'react'
import CarCard from '../components/CarCard'
import { listingsAPI } from '../services/api'
import { initializeSignalR, onListingCreated, onListingUpdated, onListingDeleted, disconnectSignalR } from '../services/signalr'
import { useAuth } from '../context/AuthContext'

export default function CarListings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)
  const [filterType, setFilterType] = useState('marketplace') // 'marketplace', 'local', 'external'
  const [selectedLocation, setSelectedLocation] = useState('All')
  const { user } = useAuth()

  const locations = ['All', 'Lagos', 'Abuja', 'Ikeja', 'Amuwo-Odofin', 'Ibadan', 'Other']

  useEffect(() => {
    // Initialize SignalR connection
    const initConnection = async () => {
      try {
        await initializeSignalR()
        setConnected(true)
        console.log('✅ Real-time updates enabled')
      } catch (err) {
        console.warn('⚠️ SignalR connection failed, using polling:', err)
        setConnected(false)
      }
    }

    initConnection()

    // Fetch initial listings based on filter
    const fetchListings = async () => {
      setLoading(true)
      setError(null)
      try {
        let response

        console.log(`📡 Fetching ${filterType} car listings from API...`)

        // Call appropriate API based on filter
        if (filterType === 'marketplace') {
          // Get combined marketplace listings (local + external)
          const localRes = await listingsAPI.getAll()
          const externalRes = await listingsAPI.getExternal()
          response = {
            data: [...(localRes.data || []), ...(externalRes.data || [])]
          }
          console.log('📊 Marketplace listings:', response.data.length)
        } else if (filterType === 'external') {
          // Get premium/external listings
          response = await listingsAPI.getExternal()
          console.log('⭐ Premium listings:', response.data?.length)
        } else if (filterType === 'local') {
          // Get user's local listings
          response = await listingsAPI.getAll()
          console.log('🏠 Local listings:', response.data?.length)
        }

        // Normalize the data - ensure images are properly mapped
        const normalizedData = (Array.isArray(response.data) ? response.data : []).map(item => ({
          id: item.id || item.Id,
          sellerId: item.sellerId || item.SellerId,
          title: item.title || item.Title,
          price: item.price || item.Price,
          year: item.year || item.Year,
          location: item.location || item.Location,
          description: item.description || item.Description,
          type: item.type || item.Type,
          photos: Array.isArray(item.photos || item.Photos) ? (item.photos || item.Photos) : [],
          // Primary image for card display
          imageUrl: ((item.photos || item.Photos)?.[0]) ||
            (item.photo) ||
            'https://images.unsplash.com/photo-1552519507-da3a142c6e3d?w=800&h=600&fit=crop',
          Photo: ((item.photos || item.Photos)?.[0]) || 'https://images.unsplash.com/photo-1552519507-da3a142c6e3d?w=800&h=600&fit=crop'
        }))

        // Filter only cars (exclude spare parts)
        const carItems = normalizedData.filter(item => {
          const itemType = (item.type || item.Type || 'car').toLowerCase()
          return itemType === 'car' || itemType === 'vehicle'
        })

        // Filter by location
        const locationFilteredItems = selectedLocation === 'All' 
          ? carItems 
          : carItems.filter(item => {
              const itemLocation = (item.location || item.Location || '').toLowerCase()
              return itemLocation.includes(selectedLocation.toLowerCase())
            })

        // Filter local listings by user ID if filterType is 'local'
        const finalItems = filterType === 'local' && user
          ? locationFilteredItems.filter(item => item.sellerId === user.id || item.sellerId === user.Id)
          : locationFilteredItems

        console.log('✅ Normalized car listings:', finalItems)
        setItems(finalItems)
        setError(null)
      } catch (err) {
        console.error('❌ Failed to fetch car listings:', err)
        setError(err.message || 'Failed to fetch car listings')
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()

    // Setup real-time listeners
    onListingCreated((newListing) => {
      console.log('🆕 New car listing created:', newListing)
      setItems(prev => {
        const exists = prev.some(item => item.id === (newListing.id || newListing.Id))
        return exists ? prev : [newListing, ...prev]
      })
    })

    onListingUpdated((updatedListing) => {
      console.log('✏️ Car listing updated:', updatedListing)
      setItems(prev =>
        prev.map(item => (item.id === (updatedListing.id || updatedListing.Id)) ? updatedListing : item)
      )
    })

    onListingDeleted((deletedId) => {
      console.log('🗑️ Car listing deleted:', deletedId)
      setItems(prev => prev.filter(item => item.id !== deletedId))
    })

    return () => {
      disconnectSignalR()
    }
  }, [filterType, selectedLocation, user])

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '24px', fontSize: 'clamp(28px, 5vw, 2.5rem)' }}>
          Available <span style={{ color: 'var(--primary)' }}>Cars</span>
        </h1>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterType('marketplace')}
            style={{
              padding: '10px 20px',
              border: filterType === 'marketplace' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: filterType === 'marketplace' ? 'var(--primary-light)' : 'transparent',
              color: filterType === 'marketplace' ? 'var(--primary)' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            Marketplace
          </button>
          <button
            onClick={() => setFilterType('external')}
            style={{
              padding: '10px 20px',
              border: filterType === 'external' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: filterType === 'external' ? 'var(--primary-light)' : 'transparent',
              color: filterType === 'external' ? 'var(--primary)' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            Premium Cars
          </button>
          <button
            onClick={() => setFilterType('local')}
            style={{
              padding: '10px 20px',
              border: filterType === 'local' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: filterType === 'local' ? 'var(--primary-light)' : 'transparent',
              color: filterType === 'local' ? 'var(--primary)' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            My Listings
          </button>
        </div>

        {/* Connection Status */}
        {connected && (
          <div style={{ padding: '12px', backgroundColor: '#d4edda', borderRadius: '8px', color: '#155724', marginBottom: '20px', fontSize: '14px' }}>
            ✅ Real-time updates enabled
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Loading cars...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '8px', color: '#721c24', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '12px' }}>No cars found</div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Try adjusting your filters or check back later</div>
        </div>
      )}

      {/* Cars Grid */}
      {!loading && items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {items.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}
