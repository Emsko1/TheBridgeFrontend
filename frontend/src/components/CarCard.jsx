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
              aria-label="Previous photo"
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                color: 'var(--text-main)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseOver={e => e.target.style.background = 'rgba(255,255,255,1)'}
              onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.9)'}
            >
              ◄
            </button>

            <button
              onClick={handleNextPhoto}
              aria-label="Next photo"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                color: 'var(--text-main)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseOver={e => e.target.style.background = 'rgba(255,255,255,1)'}
              onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.9)'}
            >
              ►
            </button>

            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              backdropFilter: 'blur(4px)',
              fontWeight: 600
            }}>
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: 'clamp(12px, 3vw, 20px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: 'clamp(13px, 2.5vw, 14px)', marginBottom: '8px', lineHeight: 1.4, height: 'auto', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: 600 }}>{car.title}</h3>

        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(11px, 2vw, 12px)', marginBottom: '12px' }}>
          {car.location} • {car.year || 'N/A'}
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: 'var(--text-muted)', marginBottom: '2px' }}>Price</div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(16px, 3vw, 18px)', color: 'var(--primary)' }}>
              ₦{typeof car.price === 'number' ? car.price.toLocaleString() : car.price}
            </div>
          </div>
          <Link to={`/listing/${car.id}`} className="btn-outline" style={{ padding: '8px 16px', fontSize: 'clamp(12px, 2vw, 14px)', borderRadius: '8px', flex: 'auto', minWidth: '80px', textAlign: 'center' }}>
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
