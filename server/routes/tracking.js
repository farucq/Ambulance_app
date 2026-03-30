import { Router } from 'express';
import db from '../database.js';

const router = Router();

// Used to calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// POST /api/tracking/emergency (creates emergency request and notifies nearby drivers)
router.post('/emergency', async (req, res) => {
  const io = req.app.get('io');
  const b = req.body;

  const newEmergency = {
    id: Date.now(),
    phone: b.phone || 'UNKNOWN',
    name: b.name || 'GUEST',
    user_phone: b.phone || 'UNKNOWN',
    user_latitude: b.latitude,
    user_longitude: b.longitude,
    user_name: b.name || 'GUEST',
    type: b.type || 'Emergency',
    pickup: b.pickup || '',
    destination: b.destination || '',
    hospital_coords: b.hospital_coords || null,
    driver_id: null,
    status: 'Pending',
    timestamp: Date.now()
  };

  db.data.bookings.push(newEmergency);
  await db.write();

  // Find nearby available drivers (e.g., within 10km)
  const nearbyDrivers = db.data.users.filter(u => {
    if (u.role !== 'driver' || u.status !== 'available') return false;
    const dist = getDistanceFromLatLonInKm(b.latitude, b.longitude, u.latitude, u.longitude);
    return dist <= 10;
  });

  // Emit event to notify them
  if (io) {
    io.emit('emergency_request', {
      emergency: newEmergency,
      nearbyDriverIds: nearbyDrivers.map(d => d.id)
    });
  }

  // Auto expiry if nobody accepts in 60 seconds
  setTimeout(async () => {
    const checkBooking = db.data.bookings.find(b => b.id === newEmergency.id);
    if (checkBooking && !checkBooking.driver_id) {
      checkBooking.status = 'Expired';
      await db.write();
      if (io) io.emit('request_expired', { requestId: checkBooking.id });
    }
  }, 60000);

  res.json(newEmergency);
});

// GET /api/tracking/nearby-drivers
router.get('/nearby-drivers', (req, res) => {
  const { lat, lng, radius = 10 } = req.query;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Valid lat and lng are required' });
  }

  const drivers = db.data.users.filter(u => {
    if (u.role !== 'driver' || u.status !== 'available') return false;
    const dist = getDistanceFromLatLonInKm(latitude, longitude, u.latitude, u.longitude);
    return dist <= parseFloat(radius);
  });

  // strip password hash
  const safeDrivers = drivers.map(({ password_hash, ...safeUser }) => safeUser);
  res.json(safeDrivers);
});

// POST /api/tracking/accept-request
router.post('/accept-request', async (req, res) => {
  const io = req.app.get('io');
  const { driverId, requestId } = req.body;

  const emergency = db.data.bookings.find(b => b.id === Number(requestId));
  if (!emergency) return res.status(404).json({ error: 'Request not found' });

  if (emergency.driver_id) {
    return res.status(409).json({ error: 'Request already accepted by another driver' });
  }

  const driver = db.data.users.find(u => u.id === Number(driverId));
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  // Update backend state
  emergency.driver_id = driver.id;
  emergency.status = 'Dispatched';

  driver.status = 'busy';
  driver.last_updated = Date.now();

  await db.write();

  const { password_hash, ...safeDriver } = driver;

  // Notify everyone that the request has been accepted
  if (io) {
    io.emit('request_accepted', {
      requestId: emergency.id,
      driver: safeDriver,
      emergency
    });
  }

  res.json({ emergency, driver: safeDriver });
});

// GET /api/tracking/track/:requestId
router.get('/track/:requestId', (req, res) => {
  const requestId = Number(req.params.requestId);
  const emergency = db.data.bookings.find(b => b.id === requestId);
  if (!emergency) return res.status(404).json({ error: 'Request not found' });

  const driver = db.data.users.find(u => u.id === emergency.driver_id);

  res.json({
    emergency,
    driver: driver ? {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      vehicle_number: driver.vehicle_number,
      latitude: driver.latitude,
      longitude: driver.longitude,
      last_updated: driver.last_updated
    } : null
  });
});

// POST /api/tracking/update-driver-location
router.post('/update-driver-location', async (req, res) => {
  const io = req.app.get('io');
  const { driverId, latitude, longitude, status } = req.body;

  const driver = db.data.users.find(u => u.id === Number(driverId));
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  driver.latitude = latitude;
  driver.longitude = longitude;
  driver.last_updated = Date.now();
  if (status) driver.status = status;

  await db.write();

  // Notify clients about this driver's location change
  if (io) {
    io.emit('driver_location_update', {
      driverId: driver.id,
      latitude: driver.latitude,
      longitude: driver.longitude,
      status: driver.status,
      last_updated: driver.last_updated,
      vehicle_number: driver.vehicle_number
    });
  }

  res.json({ success: true, timestamp: driver.last_updated });
});

export default router;
