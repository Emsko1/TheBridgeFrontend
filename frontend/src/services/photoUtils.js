// Photo upload utility with base64 encoding for simple storage
// For production, use cloud storage like AWS S3, Cloudinary, or Azure Blob Storage

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const validatePhotoFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPG, PNG, or WebP')
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB')
  }

  return true
}

export const processPhotoFile = async (file) => {
  try {
    validatePhotoFile(file)
    const base64 = await convertFileToBase64(file)
    return base64
  } catch (error) {
    throw new Error(error.message)
  }
}

// For multiple files
export const processMultiplePhotos = async (files) => {
  try {
    const photos = []
    for (const file of files) {
      validatePhotoFile(file)
      const base64 = await convertFileToBase64(file)
      photos.push(base64)
    }
    return photos
  } catch (error) {
    throw new Error(error.message)
  }
}

// Get thumbnail from photos array
export const getThumbnail = (photos) => {
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return 'https://picsum.photos/seed/placeholder/800/600'
  }
  return photos[0]
}
