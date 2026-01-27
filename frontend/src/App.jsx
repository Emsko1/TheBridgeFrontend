import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Listings from './pages/Listings'
import ListingDetails from './pages/ListingDetails'
import Sell from './pages/SellCar'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import FlashSale from './pages/FlashSale'


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
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/flash-sale" element={<FlashSale />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
