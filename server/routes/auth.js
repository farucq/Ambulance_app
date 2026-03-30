import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../database.js';

const router = Router();
const randomBaseLat = () => 28.6139 + (Math.random() - 0.5) * 0.1;
const randomBaseLng = () => 77.2090 + (Math.random() - 0.5) * 0.1;


// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = db.data.users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    phone: phone || '',
    password_hash: bcrypt.hashSync(password, 10),
    role: role || 'driver',
    vehicle_number: req.body.vehicle_number || `AMBU-${Math.floor(Math.random()*9000)+1000}`,
    latitude: req.body.latitude || randomBaseLat(),
    longitude: req.body.longitude || randomBaseLng(),
    status: 'available',
    last_updated: Date.now(),
  };

  db.data.users.push(newUser);
  await db.write();

  const { password_hash, ...safeUser } = newUser;
  res.json(safeUser);
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = db.data.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password_hash, ...safeUser } = user;
  res.json(safeUser);
});

export default router;
