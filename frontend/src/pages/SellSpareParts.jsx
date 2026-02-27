import React, { useState, useEffect } from 'react'
import { listingsAPI } from '../services/api'
import { initializeSignalR, notifyListingCreated } from '../services/signalr'
import { processMultiplePhotos } from '../services/photoUtils'

export default function SellSpareParts() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [partType, setPartType] = useState('') // Engine, Transmission, Brakes, etc.
  const [compatibility, setCompatibility] = useState('') // Compatible car models
  const [quantity, setQuantity] = useState('1')
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
      Type: 'Spare Part',
      Title: title,
      Price: Number(price),
      Description: description || 'No description provided',
      Location: location || 'Unknown',
      PartType: partType || 'General Part',
      Compatibility: compatibility || 'Universal',
      Quantity: Number(quantity) || 1,
      Photos: photos,
      Status: 'Active'
    }

    try {
      const response = await listingsAPI.create(payload)
      const createdListing = response.data

      // Broadcast to other users in real-time if connected
      if (connected) {
        await notifyListingCreated(createdListing)
      }

      alert('✅ Spare parts listing created successfully! Other users will see it live.')
      setTitle('')
      setPrice('')
      setDescription('')
      setLocation('')
      setPartType('')
      setCompatibility('')
      setQuantity('1')
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

  const partCategories = [
    'Engine Components',
    'Transmission',
    'Brakes',
    'Suspension',
    'Electrical',
    'Interior',
    'Exterior',
    'Lights',
    'Filters',
    'Belts & Hoses',
    'Other'
  ]

  return (
    <div className="card">
      <h2>Sell Spare Parts {connected && <span style={{ color: 'green', fontSize: '0.8em' }}>● Connected</span>}</h2>
      <form onSubmit={submit}>
        <label>Part Name/Title *<br /><input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Original Brake Pads Set" /></label><br />

        <label>Part Category<br />
          <select value={partType} onChange={e => setPartType(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}>
            <option value="">Select a category</option>
            {partCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </label><br />

        <label>Compatibility (e.g., Toyota Camry 2015-2020)<br /><input value={compatibility} onChange={e => setCompatibility(e.target.value)} placeholder="Which car models? Leave blank if universal" /></label><br />

        <label>Quantity Available<br /><input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="1" /></label><br />

        <label>Price per Unit (₦) *<br /><input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Enter price" /></label><br />

        <label>Location<br /><input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Lagos, Nigeria" /></label><br />

        <label>Description<br /><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the part condition, specifications, usage history, etc." rows="3" /></label><br />

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
