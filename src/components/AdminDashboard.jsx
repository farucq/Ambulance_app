import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Truck, AlertTriangle, CheckCircle, Clock, MapPin, Phone, User, Siren, LogOut, Navigation, X, Globe, Activity, Compass, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/db';
import { socket } from '../utils/socket';

const AdminDashboard = ({ auth, setAuth }) => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming');
  const [driverStatus, setDriverStatus] = useState('available');
  const [incomingEmergency, setIncomingEmergency] = useState(null);
  const navigate = useNavigate();

  const bookingsRef = React.useRef(bookings);
  useEffect(() => { bookingsRef.current = bookings; }, [bookings]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    socket.connect();

    socket.on('emergency_request', (data) => {
      if (data.nearbyDriverIds.includes(auth?.id) && driverStatus === 'available') {
        setIncomingEmergency(data.emergency);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [auth, driverStatus]);

  useEffect(() => {
    let interval;
    if (driverStatus === 'available' || driverStatus === 'busy') {
      const updateFallback = () => {
        const currentBookings = bookingsRef.current;
        if (auth?.id && currentBookings.length > 0) {
          const latest = currentBookings[0];
          if (latest.user_latitude) {
            // Place driver ~2km away from the latest patient for demo/testing
            db.updateDriverLocation(auth.id, latest.user_latitude - 0.015, latest.user_longitude - 0.015, driverStatus).catch(console.error);
          }
        }
      };

      interval = setInterval(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (auth?.id) {
                const driverLat = pos.coords.latitude;
                const driverLng = pos.coords.longitude;
                db.updateDriverLocation(auth.id, driverLat, driverLng, driverStatus).catch(console.error);

                // Auto-transition based on proximity (200 meters = 0.2km)
                bookingsRef.current.forEach(async (b) => {
                  if (b.driver_id === auth.id) {
                    if (['Dispatched', 'Critical_Dispatch'].includes(b.status)) {
                      if (getDistance(driverLat, driverLng, b.user_latitude, b.user_longitude) <= 0.2) {
                        const updated = await db.updateBookingStatus(b.id, 'Transporting');
                        setBookings(updated);
                      }
                    } else if (b.status === 'Transporting' && b.hospital_coords) {
                      if (getDistance(driverLat, driverLng, b.hospital_coords.lat, b.hospital_coords.lng) <= 0.2) {
                        const updated = await db.updateBookingStatus(b.id, 'Completed');
                        setBookings(updated);
                        setDriverStatus('available'); // free up the driver automatically!
                      }
                    }
                  }
                });
              }
            },
            () => updateFallback(),
            { enableHighAccuracy: true, timeout: 8000 }
          );
        } else {
          updateFallback();
        }
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [auth, driverStatus]);

  useEffect(() => {
    const fetchBookings = async () => setBookings(await db.getBookings());
    fetchBookings();
    const interval = setInterval(fetchBookings, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    navigate('/login');
  };

  const updateStatus = async (id, status) => {
    const updated = await db.updateBookingStatus(id, status);
    setBookings(updated);
  };

  const filteredBookings = bookings.filter(b =>
    activeTab === 'incoming'
      ? !['Completed', 'Expired'].includes(b.status)
      : ['Completed', 'Expired'].includes(b.status)
  );

  const stats = [
    { title: 'Total Cases', value: bookings.length, icon: Truck, color: 'blue' },
    { title: 'Dispatched', value: bookings.filter(b => b.status === 'Dispatched').length, icon: Siren, color: 'red' },
    { title: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, icon: Clock, color: 'yellow' },
    { title: 'Completed', value: bookings.filter(b => b.status === 'Completed').length, icon: CheckCircle, color: 'green' }
  ];

  const getGoogleMapsUrl = (booking) => {
    const pLat = booking.user_latitude || booking.coordinates?.lat || 20.5937;
    const pLng = booking.user_longitude || booking.coordinates?.lng || 78.9629;
    const hLat = booking.hospital_coords?.lat || (pLat + 0.015);
    const hLng = booking.hospital_coords?.lng || (pLng + 0.015);
    // Origin is Current Location, Waypoint is Patient, Destination is Hospital
    return `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${hLat},${hLng}&waypoints=${pLat},${pLng}&travelmode=driving`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white min-h-screen p-6 fixed z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <Siren className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase">AmbuDriver</h1>
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`w-full text-left p-4 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'incoming' ? 'bg-red-600 text-white shadow-xl shadow-red-500/20' : 'text-slate-400 hover:bg-white/5'
              }`}
          >
            <Clock size={20} />
            Active Feed
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`w-full text-left p-4 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'completed' ? 'bg-green-600 text-white shadow-xl shadow-green-500/20' : 'text-slate-400 hover:bg-white/5'
              }`}
          >
            <CheckCircle size={20} />
            Archive
          </button>

          <div className="pt-8 border-t border-white/10 mt-8 space-y-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            <div className="p-3">Operations Details</div>
            <div className="p-3 text-slate-400 hover:text-white cursor-pointer transition-colors flex items-center gap-3 text-sm">
              <Users size={18} /> Driver Profile
            </div>
          </div>
        </nav>
        <button
          onClick={handleLogout}
          className="absolute bottom-8 left-6 flex items-center gap-3 text-slate-500 hover:text-red-500 transition-colors font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Terminate Session</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-12 bg-slate-50/50">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {activeTab === 'incoming' ? 'Strategic Dispatch' : 'Historical Archive'}
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest bg-blue-50 text-blue-600 inline-block px-3 py-1 rounded-lg">Driver Operations Console</p>
          </div>
          <div className="flex items-center gap-6 p-2 bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-slate-900">{auth?.name || 'Lead Driver'}</span>
              <button
                onClick={() => setDriverStatus(prev => prev === 'available' ? 'busy' : prev === 'busy' ? 'offline' : 'available')}
                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-white transition-all shadow-md ${driverStatus === 'available' ? 'bg-green-500 hover:bg-green-600' :
                    driverStatus === 'busy' ? 'bg-yellow-500 hover:bg-yellow-600' :
                      'bg-slate-400 hover:bg-slate-500'
                  }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${driverStatus !== 'offline' ? 'animate-pulse bg-white' : 'bg-slate-300'}`} />
                Status: {driverStatus}
              </button>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
              <User className="w-7 h-7" />
            </div>
          </div>
        </header>

        <AnimatePresence>
          {incomingEmergency && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            >
              <div className="bg-white max-w-lg w-full rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-rose-600 animate-pulse" />
                <Siren className="w-12 h-12 text-rose-600 mx-auto mb-6 animate-bounce" />
                <h2 className="text-3xl font-black text-center mb-2 uppercase tracking-tight">Emergency Dispatch</h2>
                <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Class Info</span>
                    <span className="text-rose-600">{incomingEmergency.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Locator</span>
                    <span className="text-slate-900 break-words flex-1 text-right ml-4">({incomingEmergency.user_latitude.toFixed(4)}, {incomingEmergency.user_longitude.toFixed(4)})</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIncomingEmergency(null)}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await db.acceptRequest(auth.id, incomingEmergency.id);
                        setBookings(prev => [res.emergency, ...prev.filter(b => b.id !== incomingEmergency.id)]);
                        setDriverStatus('busy');
                        setIncomingEmergency(null);
                      } catch (e) {
                        alert(e.message);
                        setIncomingEmergency(null);
                      }
                    }}
                    className="flex-1 py-4 bg-rose-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-600/30 hover:bg-rose-700 transition-all"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={stat.title} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 cursor-default">
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 ${stat.color === 'blue' ? 'bg-blue-600' :
                stat.color === 'red' ? 'bg-red-600' :
                  stat.color === 'yellow' ? 'bg-yellow-600' :
                    'bg-emerald-600'
                }`} />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 ${stat.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-500/20' :
                stat.color === 'red' ? 'bg-red-600 text-white shadow-red-500/20' :
                  stat.color === 'yellow' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                    'bg-emerald-600 text-white shadow-emerald-500/20'
                }`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.title}</h3>
              <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Dispatch Table */}
        <div className="bg-white rounded-[4rem] border border-white shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden min-h-[500px]">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Transmissions</h2>
              <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest text-red-500">Global Priority Streams: {filteredBookings.length}</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full text-white">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ready For Navigation</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/20">
                  <th className="w-[20%] px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Patient ID</th>
                  <th className="w-[30%] px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Mission Path</th>
                  <th className="w-[15%] px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Alert Class</th>
                  <th className="w-[15%] px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Unit Status</th>
                  <th className="w-[20%] px-10 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Dispatch Tool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Activity size={80} className="mb-6" />
                        <p className="font-black text-slate-500 uppercase tracking-[0.3em]">No Active Mission Flows</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                      <td className="px-10 py-10">
                        <div className="font-black text-slate-900 text-lg tracking-tight flex items-center gap-3">
                          {booking.name}
                          {booking.type === 'EMERGENCY_SOS' && <Siren size={20} className="text-rose-500 animate-pulse" />}
                        </div>
                        <div className="text-xs text-slate-400 mt-2 flex items-center gap-2 font-black uppercase tracking-widest">
                          <Phone size={14} className="text-blue-500" /> {booking.phone}
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="text-sm text-slate-900 font-black flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/20"></div>
                          {booking.pickup}
                        </div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-6 flex items-center gap-2">
                          <Target size={12} className="text-blue-600" /> {booking.destination || 'Medical Hub Alpha'}
                        </div>
                      </td>
                      <td className="px-10 py-10 text-center whitespace-nowrap">
                        <span className={`px-5 py-2 text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg transition-all border ${booking.type === 'EMERGENCY_SOS'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/30 animate-pulse'
                          : 'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                          {booking.type === 'EMERGENCY_SOS' ? 'SOS PRIORITY' : 'Standard'}
                        </span>
                      </td>
                      <td className="px-10 py-10 text-center">
                        <div className={`px-4 py-1.5 inline-block rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${booking.status === 'Critical_Dispatch' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          booking.status === 'Dispatched' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          booking.status === 'Transporting' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            'bg-slate-50 text-slate-400'
                          }`}>
                          {booking.status === 'Transporting' ? 'Destination Stage' : booking.status}
                        </div>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {(booking.status === 'Dispatched' || booking.status === 'Critical_Dispatch' || booking.status === 'Transporting') && (
                            <div className="flex gap-3">
                              <a
                                href={getGoogleMapsUrl(booking)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 bg-slate-900 text-white rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-blue-500/10 group/nav"
                              >
                                <MapPin size={16} className="group-hover/nav:animate-bounce" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Navigate</span>
                              </a>
                              {booking.status === 'Transporting' ? (
                                <button
                                  onClick={() => updateStatus(booking.id, 'Completed')}
                                  className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-lg border border-emerald-100"
                                  title="Finalize Mission (Hospital Reached)"
                                >
                                  <CheckCircle size={24} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateStatus(booking.id, 'Transporting')}
                                  className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-lg border border-purple-100"
                                  title="Patient Collected (To Hospital)"
                                >
                                  <Truck size={24} />
                                </button>
                              )}
                            </div>
                          )}

                          {(booking.status === 'Pending' || (booking.status === 'Critical_Dispatch' && booking.type !== 'EMERGENCY_SOS')) && (
                            <button
                              onClick={async () => {
                                try {
                                  // Update to dispatched via accept method if it's a tracking-based request, or raw status
                                  if (booking.user_latitude) {
                                    await db.acceptRequest(auth.id, booking.id);
                                    setDriverStatus('busy');
                                  } else {
                                    updateStatus(booking.id, 'Dispatched');
                                  }
                                } catch (e) { console.error(e) }
                              }}
                              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/20"
                            >
                              Confirm Dispatch
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
