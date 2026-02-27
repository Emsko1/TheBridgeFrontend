import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Listings from './pages/Listings'
import Buy from './pages/Buy'
import CarListings from './pages/CarListings'
import SparePartListings from './pages/SparePartListings'
import ListingDetails from './pages/ListingDetails'
import Sell from './pages/Sell'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Profile from './pages/Profile'
import FlashSale from './pages/FlashSale'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/cars" element={<CarListings />} />
              <Route path="/spare-parts" element={<SparePartListings />} />
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/flash-sale" element={<FlashSale />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
