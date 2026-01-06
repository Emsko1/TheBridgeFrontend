import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getThumbnail } from '../services/photoUtils'

export default function CarCard({ car }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Handle both single photo (car.photo) and multiple photos (car.Photos array)
  const photos = car.Photos && Array.isArray(car.Photos) && car.Photos.length > 0
    ? car.Photos
    : (car.photo ? [car.photo] : ['https://picsum.photos/seed/placeholder/800/600'])

  const currentPhoto = photos[currentPhotoIndex] || getThumbnail(photos)
  const hasMultiplePhotos = photos.length > 1

  const handlePrevPhoto = (e) => {
    e.preventDefault()
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNextPhoto = (e) => {
    e.preventDefault()
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="card" style={{ padding: 0, border: 'none', boxShadow: 'var(--shadow-md)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden', background: '#f0f0f0' }}>
        <img
          src={currentPhoto}
          alt={car.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
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
                background: 'rgba(255,255,255,0.9)',
                color: 'var(--text-main)',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
                background: 'rgba(255,255,255,0.9)',
                color: 'var(--text-main)',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              ►
            </button>

            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 12,
              fontSize: 11,
              backdropFilter: 'blur(4px)',
              fontWeight: 600
            }}>
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '14px', marginBottom: '8px', lineHeight: 1.4, height: '50px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: 600 }}>{car.title}</h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px' }}>
          {car.location} • {car.year || 'N/A'}
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 2 }}>Price</div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--primary)' }}>
              ₦{typeof car.price === 'number' ? car.price.toLocaleString() : car.price}
            </div>
          </div>
          <Link to={`/listing/${car.id}`} className="btn-outline" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>
            View
          </Link>
        </div>
      </div>
    </div >
  )
}
