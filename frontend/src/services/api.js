import axios from 'axios'

// Configure the base URL for API calls
// In Dev, default to '' to use Vite Proxy. In Prod, default to localhost:5086 if env var is missing.
// Hardcoded for debugging to ensure we hit local backend
// Dynamic configuration:
// 1. If running locally (localhost), use the Vite Proxy ('') to avoid CORS and ensure connection.
// 2. If running on mobile/network (e.g., accessing via Ngrok), use the configured VITE_API_URL.
let API_BASE_URL = ''

if (typeof window !== 'undefined') {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  if (isLocal) {
    API_BASE_URL = '' // Use Vite proxy
  } else {
    // Mobile / External access
    API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mica-multifocal-marcell.ngrok-free.dev'
  }
} else {
  // Fallback for non-browser environments if any
  API_BASE_URL = import.meta.env.VITE_API_URL || ''
}

// FORCE OVERRIDE for debugging if needed:
// API_BASE_URL = '' 

console.log('🔗 Configured API URL:', API_BASE_URL || '(Relative/Proxy)')

console.log('🔗 API Base URL:', API_BASE_URL ? API_BASE_URL : '(Local Proxy)')
console.log('🌍 Environment:', import.meta.env.DEV ? 'Development' : 'Production')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Bypass Ngrok warning page
  },
  withCredentials: true // Enable credentials for CORS
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bridge_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('📤 API Request:', config.method.toUpperCase(), config.url)
  return config
}, (error) => {
  return Promise.reject(error)
})

// Log responses
api.interceptors.response.use((response) => {
  console.log('📥 API Response:', response.status, response.data)
  return response
}, (error) => {
  console.error('❌ API Error:', error.response?.status, error.response?.data || error.message)
  return Promise.reject(error)
})

// Listings API
export const listingsAPI = {
  getAll: () => api.get('/api/listings'),
  getById: (id) => api.get(`/api/listings/${id}`),
  getExternal: () => api.get('/api/listings/external'),
  getMarketplace: () => api.get('/api/listings/marketplace'),
  create: (listing) => api.post('/api/listings', listing)
}

// Auth API
export const authAPI = {
  login: (email, password) => {
    console.log('🔐 Login attempt:', email)
    return api.post('/api/auth/login', { email, password })
  },
  register: (nameOrPayload, email, password) => {
    if (typeof nameOrPayload === 'object') {
      console.log('📝 Register attempt (payload):', nameOrPayload)
      return api.post('/api/auth/register', nameOrPayload)
    }
    console.log('📝 Register attempt:', { name: nameOrPayload, email })
    return api.post('/api/auth/register', { name: nameOrPayload, email, passwordHash: password })
  },
  getProfile: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
  verifyEmail: (email, code) => {
    // Strip spaces from OTP code and send as 'otp' field
    const cleanOtp = code.replace(/\s/g, '')
    return api.post('/api/auth/verify-email', { email, otp: cleanOtp })
  },
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email })
}

// Payout API
export const payoutAPI = {
  getPendingPayouts: () => api.get('/api/payout/pending'),
  requestPayout: (amount) => api.post('/api/payout/request', { amount })
}

// Bids API
export const bidsAPI = {
  getForListing: (listingId) => api.get(`/api/bids/listing/${listingId}`),
  placeBid: (bid) => api.post('/api/bids', bid),
  acceptBid: (bidId) => api.post(`/api/bids/accept/${bidId}`)
}

// Paystack API
export const paystackAPI = {
  initializeTransaction: (reference, amount) => api.post('/api/paystack/initialize', { reference, amount }),
  verifyTransaction: (reference) => api.post('/api/paystack/verify', { reference })
}

// Deliveries API
export const deliveriesAPI = {
  getMyDeliveries: () => api.get('/api/deliveries/my-deliveries'),
  create: (delivery) => api.post('/api/deliveries', delivery),
  updateStatus: (id, status) => api.put(`/api/deliveries/${id}/status`, `"${status}"`, { headers: { 'Content-Type': 'application/json' } })
}

export default api
