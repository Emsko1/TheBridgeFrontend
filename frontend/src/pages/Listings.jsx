import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CarCard from '../components/CarCard'
import SearchFilter from '../components/SearchFilter'
import { listingsAPI } from '../services/api'
import { initializeSignalR, onListingCreated, onListingUpdated, onListingDeleted, disconnectSignalR } from '../services/signalr'
import { useAuth } from '../context/AuthContext'

export default function Listings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterType, setFilterType] = useState(searchParams.get('type') === 'auction' ? 'auction' : 'marketplace')
  const [activeCity, setActiveCity] = useState(searchParams.get('city') || 'All')
  const [activePrice, setActivePrice] = useState(null)
  const { user } = useAuth()

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

        console.log(`📡 Fetching ${filterType} listings from API...`)

        // Call appropriate API based on filter
        if (filterType === 'marketplace') {
          const localRes = await listingsAPI.getAll()
          const externalRes = await listingsAPI.getExternal()
          response = {
            data: [...(localRes.data || []), ...(externalRes.data || [])]
          }
        } else if (filterType === 'external') {
          response = await listingsAPI.getExternal()
        } else if (filterType === 'local') {
          response = await listingsAPI.getAll()
        } else if (filterType === 'auction') {
          const localRes = await listingsAPI.getAll()
          const externalRes = await listingsAPI.getExternal()
          const allListings = [...(localRes.data || []), ...(externalRes.data || [])]
          response = {
            data: allListings.filter(item => item.IsTender || item.isTender)
          }
        }

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
          imageUrl: ((item.photos || item.Photos)?.[0]) ||
            (item.photo) ||
            'https://images.unsplash.com/photo-1552519507-da3a142c6e3d?w=800&h=600&fit=crop',
          Photo: ((item.photos || item.Photos)?.[0]) || 'https://images.unsplash.com/photo-1552519507-da3a142c6e3d?w=800&h=600&fit=crop',
          isTender: item.IsTender || item.isTender,
          saleEndTime: item.SaleEndTime || item.saleEndTime,
          minimumBid: item.MinimumBid || item.minimumBid
        }))

        const finalItems = filterType === 'local' && user
          ? normalizedData.filter(item => item.sellerId === user.id || item.sellerId === user.Id)
          : normalizedData

        setItems(finalItems)
      } catch (err) {
        console.error('❌ Failed to fetch listings:', err)
        setError(err.message || 'Failed to fetch listings')
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()

    onListingCreated((newListing) => {
      setItems(prev => {
        const exists = prev.some(item => item.id === (newListing.id || newListing.Id))
        return exists ? prev : [newListing, ...prev]
      })
    })

    onListingUpdated((updatedListing) => {
      setItems(prev => prev.map(item =>
        item.id === (updatedListing.id || updatedListing.Id) ? updatedListing : item
      ))
    })

    onListingDeleted((deletedId) => {
      setItems(prev => prev.filter(item => item.id !== deletedId))
    })

    return () => {
      disconnectSignalR()
    }
  }, [filterType])

  const filterItems = (items) => {
    return items.filter(item => {
      // City Filter
      const matchesCity = activeCity === 'All' ||
        (item.location && item.location.toLowerCase().includes(activeCity.toLowerCase()));

      // Price Filter
      let matchesPrice = true;
      if (activePrice) {
        const price = parseFloat(item.price);
        if (activePrice === '< 2 M') matchesPrice = price < 2000000;
        else if (activePrice === '2-3 M') matchesPrice = price >= 2000000 && price <= 3000000;
        else if (activePrice === '3-4 M') matchesPrice = price >= 3000000 && price <= 4000000;
        else if (activePrice === '> 4 M') matchesPrice = price > 4000000;
      }

      return matchesCity && matchesPrice;
    });
  };

  const filteredItems = filterItems(items);

  const handleCityChange = (city) => {
    setActiveCity(city);
    if (city === 'All') {
      searchParams.delete('city');
    } else {
      searchParams.set('city', city);
    }
    setSearchParams(searchParams);
  };

  if (loading) return <div style={{ padding: '20px' }}><h2>Loading listings...</h2></div>

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Listings {connected && <span style={{ color: 'green', fontSize: '0.8em' }}>● Live</span>}</h2>

      {error && <p style={{ color: 'orange', padding: '10px', background: '#fff3cd', borderRadius: '4px' }}>⚠️ {error}</p>}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterType('marketplace')}
          style={{
            padding: '8px 12px',
            background: filterType === 'marketplace' ? '#0ea5a4' : '#ddd',
            color: filterType === 'marketplace' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: filterType === 'marketplace' ? 'bold' : 'normal',
            fontSize: 'clamp(12px, 2vw, 14px)',
            flex: '1 1 auto',
            minWidth: '100px',
            transition: 'all 0.2s'
          }}
        >
          🏬 All Listings
        </button>
        <button
          onClick={() => setFilterType('auction')}
          style={{
            padding: '8px 12px',
            background: filterType === 'auction' ? '#ff4444' : '#ddd',
            color: filterType === 'auction' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: filterType === 'auction' ? 'bold' : 'normal',
            fontSize: 'clamp(12px, 2vw, 14px)',
            flex: '1 1 auto',
            minWidth: '100px',
            transition: 'all 0.2s'
          }}
        >
          🔴 Live Auctions
        </button>
        <button
          onClick={() => setFilterType('local')}
          style={{
            padding: '8px 12px',
            background: filterType === 'local' ? '#0ea5a4' : '#ddd',
            color: filterType === 'local' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: filterType === 'local' ? 'bold' : 'normal',
            fontSize: 'clamp(12px, 2vw, 14px)',
            flex: '1 1 auto',
            minWidth: '100px',
            transition: 'all 0.2s'
          }}
        >
          🏠 My Listings
        </button>
        <button
          onClick={() => setFilterType('external')}
          style={{
            padding: '8px 12px',
            background: filterType === 'external' ? '#0ea5a4' : '#ddd',
            color: filterType === 'external' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: filterType === 'external' ? 'bold' : 'normal',
            fontSize: 'clamp(12px, 2vw, 14px)',
            flex: '1 1 auto',
            minWidth: '100px',
            transition: 'all 0.2s'
          }}
        >
          ⭐ Premium Listings
        </button>
      </div>

      <SearchFilter
        onCityChange={handleCityChange}
        onPriceChange={setActivePrice}
        initialCity={activeCity}
        initialPrice={activePrice}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <p>No listings available. Try a different filter.</p>
        ) : (
          filteredItems.map(item => (
            <CarCard key={item.id} car={item} />
          ))
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

