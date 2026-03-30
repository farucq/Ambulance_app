import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'ambuclone.json');

const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [], bookings: [] });

await db.read();

const seedDriver = async (name, email, password, phone, vehicle_number) => {
  const exists = db.data.users.find(u => u.email === email);
  if (!exists) {
    db.data.users.push({
      id: Date.now(),
      name,
      email,
      phone,
      password_hash: bcrypt.hashSync(password, 10),
      role: 'driver',
      vehicle_number,
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'available', // available, busy, offline
      last_updated: Date.now()
    });
    await db.write();
  }
};

await seedDriver('Emergency Driver', 'driver@ambu.com', 'driver', '+91-9876543210', 'AMBU-DL-01');

export default db;
