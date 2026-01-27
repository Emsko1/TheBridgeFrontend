import axios from 'axios'

// Configure the base URL for API calls
// In Dev, default to '' to use Vite Proxy. In Prod, default to localhost:5086 if env var is missing.
// Hardcoded for debugging to ensure we hit local backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5086'

console.log('🔗 API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
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
    return api.post('/api/auth/register', { name: nameOrPayload, email, password })
  },
  verifyEmail: (email, otp) => {
    console.log('🔐 Email verification attempt:', email)
    return api.post('/api/auth/verify-email', { email, otp })
  },
  getProfile: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout')
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


