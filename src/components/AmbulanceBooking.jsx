import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Phone, User, Clock, CheckCircle2, Siren, Truck, Navigation, Activity, Users, Target, Zap, ChevronDown } from 'lucide-react';
import { db } from '../utils/db';
import MapPicker from './MapPicker';
import DateTimePicker from './DateTimePicker';
import { socket } from '../utils/socket';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
  iconSize: [40, 40],
});

const AmbulanceBooking = () => {
  const [isBooking, setIsBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [mapTarget, setMapTarget] = useState(null); // 'pickup' | 'destination' | null
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickup: '',
    destination: '',
    pickupCoords: null,
    destinationCoords: null,
    type: 'Non-Emergency (BLS)',
    time: ''
  });

  useEffect(() => {
    socket.connect();

    socket.on('request_accepted', (data) => {
      if (activeBooking && activeBooking.id === data.requestId) {
        setActiveBooking(data.emergency);
        setAssignedDriver(data.driver);
        setDriverLocation({ lat: data.driver.latitude, lng: data.driver.longitude });
      }
    });

    socket.on('driver_location_update', (data) => {
      if (assignedDriver && data.driverId === assignedDriver.id) {
        setDriverLocation({ lat: data.latitude, lng: data.longitude });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [activeBooking, assignedDriver]);

  useEffect(() => {
    // Poll db to check for active bookings by this user phone
    const fetchBooking = async () => {
      const activePhone = localStorage.getItem('ambu_guest_phone');
      if (!activePhone) return;
      
      const bookings = await db.getBookings(activePhone);
      const activeBookings = bookings.filter(b => b.phone === activePhone && b.status !== 'Completed' && b.status !== 'Expired');
      // Sort to grab the absolute most recent mission based on ID/timestamp to resolve sticky old records
      activeBookings.sort((a, b) => b.id - a.id);
      const userBooking = activeBookings.length > 0 ? activeBookings[0] : null;
      
      if (userBooking) {
        // if userBooking is our tracking type (has user_latitude), it uses driver_id
        if (userBooking.user_latitude) {
           if (userBooking.driver_id && !assignedDriver) {
             const trackData = await db.trackRequest(userBooking.id);
             setAssignedDriver(trackData.driver);
             if (trackData.driver) {
               setDriverLocation({ lat: trackData.driver.latitude, lng: trackData.driver.longitude });
             }
           }
        }
      }
      setActiveBooking(userBooking || null);
    };
    fetchBooking();
    const interval = setInterval(fetchBooking, 3000);
    return () => clearInterval(interval);
  }, [assignedDriver]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    
    // Mock coordinates near a center point (e.g., New Delhi)
    const baseLat = 28.6139;
    const baseLng = 77.2090;
    
    const trackingData = {
      name: formData.name,
      phone: formData.phone,
      type: formData.type,
      pickup: formData.pickup,
      destination: formData.destination,
      latitude: formData.pickupCoords?.lat || baseLat,
      longitude: formData.pickupCoords?.lng || baseLng,
      hospital_coords: formData.destinationCoords,
    };

    try {
      const res = await db.createEmergency(trackingData);
      localStorage.setItem('ambu_guest_phone', formData.phone);
      
      setIsBooking(false);
      setSuccess(true);
      setActiveBooking(res);
      
      // Reset after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error("Booking Error:", e);
      setIsBooking(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapConfirm = ({ address, lat, lng }) => {
    if (mapTarget === 'pickup') {
      setFormData(f => ({ ...f, pickup: address, pickupCoords: { lat, lng } }));
    } else {
      setFormData(f => ({ ...f, destination: address, destinationCoords: { lat, lng } }));
    }
    setMapTarget(null);
  };

  return (
    <section id="booking" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-gray-900 mb-4"
            >
              Book an <span className="text-red-600">Ambulance</span>
            </motion.h2>
            <p className="text-gray-600 text-lg">Fast, reliable, and secure emergency transportation at your fingertips.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-2xl relative">
            {activeBooking ? (
              <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-blue-50 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${assignedDriver ? 'from-green-500 via-emerald-500 to-teal-500' : 'from-yellow-400 via-orange-500 to-red-500'}`}></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <h3 className={`text-2xl font-black text-gray-900 mb-2 border-l-4 ${assignedDriver ? 'border-green-500' : 'border-yellow-500'} pl-4 py-1`}>
                      {assignedDriver ? 'Tracking Stage' : 'Pending Request Stage'}
                    </h3>
                    <div className="flex items-center gap-2 ml-4">
                      <div className={`w-2 h-2 rounded-full ${assignedDriver ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{activeBooking.status}</span>
                    </div>
                  </div>
                  
                  <div className={`px-6 py-3 rounded-xl border flex items-center gap-3 shadow-lg ${
                    ['Dispatched', 'Critical_Dispatch', 'Transporting'].includes(activeBooking.status) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  }`}>
                    {['Dispatched', 'Critical_Dispatch', 'Transporting'].includes(activeBooking.status) ? (
                      <Truck className="w-6 h-6 animate-bounce" />
                    ) : (
                      <Clock className="w-6 h-6 animate-spin-slow" />
                    )}
                    <div>
                      <div className="font-black uppercase text-xs tracking-widest">
                        {activeBooking.status === 'Transporting' ? 'Heading to Hospital' : 
                         ['Dispatched', 'Critical_Dispatch'].includes(activeBooking.status) ? 'On The Way' : 'Finding Nearest Unit'}
                      </div>
                      <div className="text-sm font-bold opacity-80">
                         {activeBooking.status === 'Transporting' ? 'Care Initiated' : 
                          ['Dispatched', 'Critical_Dispatch'].includes(activeBooking.status) ? 'ETA: 8 Mins' : 'Please hold on'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2"><MapPin size={14} className="text-red-500" /> Patient Origin</span>
                    <span className="font-bold text-gray-800 break-words">{activeBooking.pickup || 'Reported Location'}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2"><Navigation size={14} className="text-blue-500" /> Emergency Hub</span>
                    <span className="font-bold text-gray-800 break-words">{activeBooking.destination || 'Nearest MedCenter Pending'}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2"><Activity size={14} className="text-green-500" /> Dispatch Unit</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg self-start tracking-widest border border-blue-100 uppercase">{assignedDriver ? assignedDriver.vehicle_number : (activeBooking.ambulance || 'PENDING DISPATCH')}</span>
                  </div>
                </div>

                {activeBooking.user_latitude && assignedDriver && driverLocation && (
                  <div className="mt-8 h-64 rounded-2xl overflow-hidden border border-slate-200">
                    <MapContainer center={[activeBooking.user_latitude, activeBooking.user_longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                      <Marker position={[activeBooking.user_latitude, activeBooking.user_longitude]}>
                        <Popup>Your Location</Popup>
                      </Marker>
                      <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
                        <Popup>{assignedDriver.name}</Popup>
                      </Marker>
                      <Polyline positions={[ [activeBooking.user_latitude, activeBooking.user_longitude], [driverLocation.lat, driverLocation.lng] ]} color="red" dashArray="5, 10" weight={3} />
                    </MapContainer>
                  </div>
                )}

                {['Dispatched', 'Critical_Dispatch', 'Transporting'].includes(activeBooking.status) && (assignedDriver || activeBooking.driverName) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden group"
                  >
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-slate-800 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute right-8 top-8 opacity-20">
                      <Siren size={100} />
                    </div>
                    
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">Assigned Responder Details</h4>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                      <div className="w-20 h-20 rounded-full bg-blue-600 border-4 border-slate-800 shadow-xl flex items-center justify-center text-white">
                        <User size={32} />
                      </div>
                      
                      <div className="flex-1">
                        <h5 className="text-3xl font-black text-white mb-2">{assignedDriver ? assignedDriver.name : activeBooking.driverName}</h5>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="px-3 py-1 bg-white/10 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/5 backdrop-blur-md">
                            Certified Paramedic
                          </span>
                          <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold uppercase tracking-widest border border-red-500/20">
                            {activeBooking.type || 'Emergency ALS'}
                          </span>
                        </div>
                      </div>

                      <div className="w-full md:w-auto self-stretch md:self-auto flex items-center justify-center">
                        <a 
                          href={`tel:${assignedDriver ? assignedDriver.phone : activeBooking.driverPhone}`}
                          className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group/call"
                        >
                          <Phone className="w-5 h-5 group-hover/call:animate-bounce" />
                          <span>Contact Driver</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
                
              </div>
            ) : (
              <>
                <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] p-10 text-white flex flex-col justify-between shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 z-0 transition-transform duration-1000 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay z-0"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl z-0"></div>
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/30">
                      <Siren className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <h3 className="text-4xl font-black mb-6 tracking-tight leading-tight flex flex-col">
                      <span>Seconds</span>
                      <span className="text-red-200">Matter.</span>
                    </h3>
                    <ul className="space-y-6">
                      {[
                        { text: 'Response under 10 mins', icon: Clock },
                        { text: 'Live GPS Unit Tracking', icon: Navigation },
                        { text: 'ICU-Equipped Vehicles', icon: Activity },
                        { text: 'Certified Paramedics', icon: Users }
                      ].map((item, i) => (
                        <motion.li 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={item.text} 
                          className="flex items-center gap-4 group/item"
                        >
                          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover/item:bg-white group-hover/item:text-red-600 transition-all duration-300">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <span className="font-bold tracking-wide text-sm">{item.text}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/20 relative z-10 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-white/80 font-bold text-xs uppercase tracking-widest mb-1">Emergency Hotline</p>
                      <p className="font-black text-2xl tracking-tighter">108</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 p-4 md:p-8">
                  <div className="mb-8">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">Schedule Dispatch</h4>
                    <p className="text-slate-500 font-bold text-sm mt-2">Fill in the details below to deploy an ambulance unit instantly to your location.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">Patient Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                          <input name="name" type="text" placeholder="John Doe" onChange={handleChange} required
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-slate-900 font-bold transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">Contact Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                          <input name="phone" type="tel" placeholder="+91 00000 00000" onChange={handleChange} required
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-slate-900 font-bold transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative group flex gap-3 items-end">
                      <div className="relative flex-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">Origin Coordinates</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                          <input name="pickup" type="text" placeholder="Select Pickup Location" value={formData.pickup || ''} onChange={handleChange} required
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-slate-900 font-bold transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      <button type="button" onClick={() => setMapTarget('pickup')} title="Drop Pin"
                        className="h-[60px] px-6 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center shadow-sm group/btn">
                        <MapPin className="w-5 h-5 group-hover/btn:animate-bounce" />
                      </button>
                    </div>

                    <div className="relative group flex gap-3 items-end">
                      <div className="relative flex-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">Destination Facility</label>
                        <div className="relative">
                          <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input name="destination" type="text" placeholder="Select Hospital (Optional)" value={formData.destination || ''} onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 font-bold transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      <button type="button" onClick={() => setMapTarget('destination')} title="Target Facility"
                        className="h-[60px] px-6 bg-blue-50 border-2 border-blue-100 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center shadow-sm group/btn">
                        <Target className="w-5 h-5 group-hover/btn:animate-spin-slow" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">Unit Class</label>
                        <div className="relative">
                          <Truck className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none transition-colors ${isTypeDropdownOpen ? 'text-red-500' : 'text-slate-400'}`} />
                          
                          {isTypeDropdownOpen && (
                            <div className="fixed inset-0 z-40" onClick={() => setIsTypeDropdownOpen(false)}></div>
                          )}

                          <div 
                            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                            className={`w-full py-4 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl cursor-pointer flex justify-between items-center transition-all shadow-sm ${isTypeDropdownOpen ? 'border-red-500 bg-white ring-4 ring-red-500/10' : 'border-slate-100'}`}
                          >
                            <span className="text-slate-900 font-bold select-none">{formData.type || 'Non-Emergency (BLS)'}</span>
                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isTypeDropdownOpen ? 'rotate-180 text-red-500' : 'text-slate-400'}`} />
                          </div>
                          
                          <AnimatePresence>
                            {isTypeDropdownOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-50 top-[110%] left-0 w-full bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden p-2"
                              >
                                {[
                                  { id: 'Non-Emergency (BLS)', label: 'Non-Emergency (BLS)', desc: 'Basic Life Support' },
                                  { id: 'ICU-on-Wheels', label: 'ICU-on-Wheels', desc: 'Critical Care Transport' },
                                  { id: 'Oxygen Ambulance', label: 'Oxygen Ambulance', desc: 'O2 Support Vehicles' }
                                ].map(type => (
                                  <div 
                                    key={type.id}
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, type: type.id }));
                                      setIsTypeDropdownOpen(false);
                                    }}
                                    className={`p-3 rounded-xl cursor-pointer transition-all flex flex-col ${formData.type === type.id ? 'bg-red-50' : 'hover:bg-slate-50'}`}
                                  >
                                    <span className={`font-black tracking-tight text-sm ${formData.type === type.id ? 'text-red-600' : 'text-slate-900'}`}>{type.label}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${formData.type === type.id ? 'text-red-400' : 'text-slate-400'}`}>{type.desc}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">Dispatch Time & Date</label>
                        <DateTimePicker
                          value={formData.time}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isBooking}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isBooking ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                            <Siren className="w-6 h-6" />
                          </motion.div>
                        ) : (
                          <>
                            <Zap className="w-6 h-6 fill-white/20" />
                            DEPLOY MEDICAL UNIT
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50"
              >
                <CheckCircle2 className="w-6 h-6" />
                <div className="font-bold">Booking Successful! Ambulance dispatched.</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <MapPicker
        isOpen={mapTarget !== null}
        onClose={() => setMapTarget(null)}
        onConfirm={handleMapConfirm}
        label={mapTarget === 'pickup' ? 'Pickup Location' : 'Destination'}
        color={mapTarget === 'pickup' ? 'red' : 'blue'}
      />
    </section>
  );
};

export default AmbulanceBooking;
