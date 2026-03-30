import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import bookingsRoutes from './routes/bookings.js';
import trackingRoutes from './routes/tracking.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.set('io', io);
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/tracking', trackingRoutes);

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`AmbuClone API (+WS) → http://localhost:${PORT}`);
});
