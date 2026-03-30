import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import Benefits from './components/Benefits'
import Contact from './components/Contact'
import Footer from './components/Footer'
import EmergencySOS from './components/EmergencySOS'
import HospitalAvailability from './components/HospitalAvailability'
import FirstAid from './components/FirstAid'
import Login from './components/Login'
import Signup from './components/Signup'
import AdminDashboard from './components/AdminDashboard'
import AmbulanceBooking from './components/AmbulanceBooking'

// User Module (Original AmbuClone)
const UserModule = ({ auth, setAuth }) => (
  <div className="min-h-screen font-sans bg-gray-50 scroll-smooth">
    <EmergencySOS auth={auth} />
    <Navbar auth={auth} setAuth={setAuth} />
    <main>
      <Hero />
      <AmbulanceBooking auth={auth} />
      <Services />
      <HowItWorks />
      <HospitalAvailability />
      <FirstAid />
      <Benefits />
      <Contact />
    </main>
    <Footer />
  </div>
);

function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={
            auth?.role === 'driver' ? (
              <AdminDashboard auth={auth} setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/"
          element={<UserModule auth={auth} setAuth={setAuth} />}
        />
      </Routes>
    </Router>
  )
}

export default App
