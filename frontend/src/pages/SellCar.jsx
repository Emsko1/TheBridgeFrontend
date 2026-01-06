import React, { useState, useEffect } from 'react'
import { listingsAPI } from '../services/api'
import { initializeSignalR, notifyListingCreated } from '../services/signalr'
import { processMultiplePhotos } from '../services/photoUtils'

export default function SellCar() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [year, setYear] = useState('')
  const [photos, setPhotos] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    // Initialize SignalR for broadcasting
    const initConnection = async () => {
      try {
        await initializeSignalR()
        setConnected(true)
      } catch (err) {
        console.warn('SignalR connection failed:', err)
        setConnected(false)
      }
    }
    initConnection()
  }, [])

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadError('')

    try {
      // Limit to 10 photos
      if (files.length > 10) {
        throw new Error('Maximum 10 photos allowed')
      }

      const processedPhotos = await processMultiplePhotos(files)
      setPhotos(processedPhotos)
      setPhotoPreviews(processedPhotos)
    } catch (err) {
      setUploadError(err.message || 'Failed to process photos')
      setPhotos([])
      setPhotoPreviews([])
    }
  }

  const removePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index)
    const updatedPreviews = photoPreviews.filter((_, i) => i !== index)
    setPhotos(updatedPhotos)
    setPhotoPreviews(updatedPreviews)
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!title || !price) {
      alert('Please fill in all required fields')
      return
    }

    if (photos.length === 0) {
      alert('Please upload at least one photo')
      return
    }

    setLoading(true)

    const payload = {
      Type: 'Car',
      Title: title,
      Price: Number(price),
      Description: description || 'No description provided',
      Location: location || 'Unknown',
      Year: year ? Number(year) : null,
      Photos: photos,
      Status: 'Active',
      // Tender fields
      IsTender: !!e.target.saleStartTime.value,
      SaleStartTime: e.target.saleStartTime.value ? new Date(e.target.saleStartTime.value) : null,
      SaleEndTime: e.target.saleEndTime.value ? new Date(e.target.saleEndTime.value) : null,
      MinimumBid: e.target.minimumBid.value ? Number(e.target.minimumBid.value) : null
    }

    try {
      const response = await listingsAPI.create(payload)
      const createdListing = response.data

      // Broadcast to other users in real-time if connected
      if (connected) {
        await notifyListingCreated(createdListing)
      }

      alert('✅ Listing created successfully! Other users will see it live.')
      setTitle('')
      setPrice('')
      setDescription('')
      setLocation('')
      setYear('')
      setPhotos([])
      setPhotoPreviews([])
      setUploadError('')
    } catch (err) {
      console.error('Error creating listing:', err)
      alert(`Failed to create listing: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Sell a Car {connected && <span style={{ color: 'green', fontSize: '0.8em' }}>● Connected</span>}</h2>
      <form onSubmit={submit}>
        <label>Title *<br /><input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., 2015 Toyota Camry" /></label><br />

        <label>Price (₦) *<br /><input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Enter price" /></label><br />

        <label>Year<br /><input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="e.g., 2015" /></label><br />

        <label>Location<br /><input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Lagos, Nigeria" /></label><br />

        <label>Description<br /><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the car condition, mileage, features, etc." rows="3" /></label><br />

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Tender / Auction Settings (Optional)</h3>

        <label>Appointed Hour (Sale Start Time)<br />
          <input
            type="datetime-local"
            name="saleStartTime"
            style={{ width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </label><br />

        <label>Sale End Time<br />
          <input
            type="datetime-local"
            name="saleEndTime"
            style={{ width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </label><br />

        <label>Minimum Bid (₦)<br />
          <input
            type="number"
            name="minimumBid"
            placeholder="Enter minimum bid amount"
            style={{ width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </label><br />

        <label>Photos * (Up to 10)<br />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoSelect}
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, width: '100%' }}
          />
          <small style={{ color: '#666' }}>Supported formats: JPG, PNG, WebP | Max size per photo: 5MB</small>
        </label><br />

        {uploadError && <p style={{ color: 'red', marginTop: 8 }}>❌ {uploadError}</p>}

        {photoPreviews.length > 0 && (
          <div style={{ marginTop: 12, marginBottom: 12 }}>
            <label>Preview ({photoPreviews.length} photos)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8, marginTop: 8 }}>
              {photoPreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 4,
                      border: '1px solid #ddd'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn" style={{ marginTop: 16, width: '100%' }} disabled={loading || photos.length === 0}>
          {loading ? 'Creating...' : `Create Listing (${photos.length} photos)`}
        </button>
      </form>
    </div>
  )
}
