import { Router } from 'express';
import db from '../database.js';

const router = Router();

// GET /api/bookings?phone=xxx  (admin gets all, user filters by phone)
router.get('/', (req, res) => {
  const { phone } = req.query;
  const bookings = phone
    ? db.data.bookings.filter(b => b.phone === phone)
    : [...db.data.bookings].reverse();
  res.json(bookings);
});

// POST /api/bookings
router.post('/', async (req, res) => {
  const b = req.body;
  const newBooking = {
    id: Date.now(),
    name: b.name,
    guestToken: b.guestToken || null,
    phone: b.phone,
    pickup: b.pickup,
    destination: b.destination,
    coordinates: b.coordinates || null,
    hospital_coords: b.hospital_coords || null,
    ambulance: b.ambulance,
    driverName: b.driverName,
    driverPhone: b.driverPhone,
    type: b.type || 'Emergency',
    status: b.status || 'Pending',
    time: b.time || '',
    date: new Date().toLocaleString(),
  };

  db.data.bookings.push(newBooking);
  await db.write();
  res.json(newBooking);
});

// PATCH /api/bookings/:id  — update status, return all bookings
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const booking = db.data.bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = status;
  await db.write();

  res.json([...db.data.bookings].reverse());
});

export default router;
