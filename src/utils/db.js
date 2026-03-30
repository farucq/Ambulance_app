// Real API client — talks to the Express + lowdb backend on /api
const API = '/api';

export const db = {
  // ── Auth ────────────────────────────────────────────────────────────────
  saveUser: async (user) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  verifyLogin: async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid email or password');
    return data;
  },

  // ── Bookings ─────────────────────────────────────────────────────────────
  // Pass phone to filter by guest phone; omit for admin (all bookings)
  getBookings: async (phone) => {
    const url = phone
      ? `${API}/bookings?phone=${encodeURIComponent(phone)}`
      : `${API}/bookings`;
    const res = await fetch(url);
    return res.json();
  },

  saveBooking: async (booking) => {
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    return res.json();
  },

  updateBookingStatus: async (id, status) => {
    const res = await fetch(`${API}/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // ── Tracking / Live Features ────────────────────────────────────────────────
  createEmergency: async (details) => {
    const res = await fetch(`${API}/tracking/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    });
    return res.json();
  },

  getNearbyDrivers: async (lat, lng, radius) => {
    const res = await fetch(`${API}/tracking/nearby-drivers?lat=${lat}&lng=${lng}&radius=${radius || 10}`);
    return res.json();
  },

  acceptRequest: async (driverId, requestId) => {
    const res = await fetch(`${API}/tracking/accept-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId, requestId }),
    });
    if (!res.ok) {
      const e = await res.json();
      throw new Error(e.error);
    }
    return res.json();
  },

  trackRequest: async (requestId) => {
    const res = await fetch(`${API}/tracking/track/${requestId}`);
    if (!res.ok) throw new Error('Not found');
    return res.json();
  },

  updateDriverLocation: async (driverId, lat, lng, status) => {
    const res = await fetch(`${API}/tracking/update-driver-location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId, latitude: lat, longitude: lng, status }),
    });
    return res.json();
  },

  saveEmergencyAlert: async (alertData) => {
    // Legacy route for saveEmergencyAlert, let's proxy through new one
    const res = await fetch(`${API}/tracking/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...alertData, type: 'EMERGENCY_SOS' }),
    });
    return res.json();
  },
};
