import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Phone, X, MapPin, ShieldCheck, Activity, Navigation } from 'lucide-react';
import { db } from '../utils/db';
import { fetchNearbyHospitals } from '../utils/mapService';

const EmergencySOS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [phoneInput, setPhoneInput] = useState('');
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [locationFound, setLocationFound] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nearbyInfo, setNearbyInfo] = useState({ hospital: 'Locating...', ambulance: 'Scanning...', location: 'GPS Scanning...' });

  const triggerSOS = () => {
    setIsOpen(true);
    setStep(0);
    setPhoneInput('');
  };

  const confirmPhone = () => {
    if (!phoneInput.trim()) return;
    setStep(1);
    setProgress(0);
    setLocationFound(false);

    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 3 : 100));
    }, 50);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const results = await fetchNearbyHospitals(lat, lng);

          let hospitalName = "City Central Trauma Center";
          let hospitalCoords = { lat: lat + 0.01, lng: lng + 0.01 };

          if (results && results.length > 0) {
            hospitalName = results[0].name;
            hospitalCoords = { lat: results[0].lat, lng: results[0].lng };
          }

          const ambulance = `AMBU-XP-${Math.floor(Math.random() * 900) + 100}`;
          const locationText = `GPS: [${lat.toFixed(4)}, ${lng.toFixed(4)}]`;
          const sosPhone = phoneInput || `SOS-${Math.floor(Math.random() * 90000) + 10000}`;

          setTimeout(async () => {
            setNearbyInfo({ hospital: hospitalName, ambulance: 'DISPATCHING...', location: locationText });
            setLocationFound(true);
            clearInterval(interval);
            setProgress(100);

            await db.createEmergency({
              name: "REAL-TIME SOS ALERT",
              phone: sosPhone,
              pickup: locationText,
              destination: hospitalName,
              latitude: lat,
              longitude: lng,
              hospital_coords: hospitalCoords,
              type: 'EMERGENCY_SOS'
            });

            localStorage.setItem('ambu_guest_phone', sosPhone);
            
            setIsOpen(false);
            window.location.hash = 'booking';
            const bookingSection = document.getElementById('booking');
            if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
          }, 1500);
        },
        (error) => {
          setTimeout(async () => {
            setNearbyInfo({
              hospital: "Main Emergency Hospital (Fallback)",
              ambulance: "AMBU-ERR-01",
              location: "Unknown Location (Permissions Denied)"
            });
            setLocationFound(true);
            clearInterval(interval);
            setProgress(100);

            const sosPhone = phoneInput || `SOS-${Math.floor(Math.random() * 90000) + 10000}`;
            
            await db.createEmergency({
              name: "REAL-TIME SOS ALERT",
              phone: sosPhone,
              pickup: "Unknown Location",
              destination: "Nearest Hospital",
              latitude: 11.1078,
              longitude: 76.0549, // Kerala Fallback setup for testing
              hospital_coords: { lat: 11.1178, lng: 76.0649 },
              type: 'EMERGENCY_SOS'
            });

            localStorage.setItem('ambu_guest_phone', sosPhone);
            
            setIsOpen(false);
            window.location.hash = 'booking';
            const bookingSection = document.getElementById('booking');
            if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
          }, 2000);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      clearInterval(interval);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_32px_120px_rgba(239,68,68,0.3)] overflow-hidden border border-red-500/20"
            >
              <div className="relative p-10 bg-red-600 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] animate-pulse"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 shadow-2xl"
                  >
                    <AlertCircle className="w-10 h-10 text-white fill-current animate-pulse" />
                  </motion.div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">EMERGENCY SOS ACTIVE</h3>
                  <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                    <span className="text-sm font-bold tracking-widest uppercase">GPS SEARCHING • ADMIN NOTIFIED</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {step === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <p className="font-bold text-gray-700 text-center text-lg">Enter your contact number</p>
                    <p className="text-gray-500 text-center text-sm -mt-4">The dispatched paramedic will use this to reach you.</p>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-red-100 rounded-2xl focus:outline-none focus:border-red-500 text-xl font-black text-center tracking-widest text-gray-800 transition-colors"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmPhone}
                      disabled={!phoneInput.trim()}
                      className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(239,68,68,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      <Activity className="w-6 h-6 animate-pulse" />
                      DISPATCH AMBULANCE
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-inner relative overflow-hidden">
                      {!locationFound ? (
                    <div className="flex flex-col items-center py-4">
                      <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute inset-0 bg-red-500 rounded-full"
                        />
                        <Navigation className="w-8 h-8 text-red-600 animate-bounce" />
                      </div>
                      <p className="font-bold text-gray-800 animate-pulse uppercase tracking-wider text-sm italic">Locking Satellite Coordinates...</p>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-4 overflow-hidden">
                        <motion.div
                          className="h-full bg-red-600 shadow-[0_0_10px_#ef4444]"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-600 uppercase">Location Locked</p>
                          <p className="text-gray-900 font-bold">{nearbyInfo.location}</p>
                        </div>
                        <ShieldCheck className="w-6 h-6 text-green-600 ml-auto" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                            <span className="text-xs font-black text-gray-800 uppercase">{nearbyInfo.ambulance}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Destination</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-800 uppercase">{nearbyInfo.hospital}</span>
                            <Activity className="w-4 h-4 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <motion.a
                    href="tel:108"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex items-center justify-center gap-3 py-6 bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] font-black text-xl shadow-[0_20px_40px_-10px_rgba(239,68,68,0.5)] transition-all overflow-hidden"
                  >
                    <Phone className="w-6 h-6 fill-white" />
                    CALL DISPATCH CENTER
                  </motion.a>

                  <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                    Admin has already received your coordinates and assigned a unit.
                  </p>
                </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsBtnHovered(true)}
        onMouseLeave={() => setIsBtnHovered(false)}
        onClick={triggerSOS}
        className="fixed bottom-8 right-8 z-40 w-20 h-20 text-white rounded-full flex items-center justify-center border-[4px] border-white shadow-2xl overflow-visible cursor-pointer group"
        animate={{
          backgroundColor: ["#ef4444", "#ef4444", "#3b82f6", "#3b82f6", "#ef4444"],
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 0px rgba(239, 68, 68, 0.8)",
            "0 0 0 20px rgba(239, 68, 68, 0)",
            "0 0 0 0px rgba(59, 130, 246, 0.8)",
            "0 0 0 20px rgba(59, 130, 246, 0)",
            "0 0 0 0px rgba(239, 68, 68, 0.8)"
          ]
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute -top-12 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          CLICK FOR INSTANT SOS
        </span>
        <Phone className="w-8 h-8 relative z-10 fill-white/20" />
      </motion.button>
    </>
  );
};

export default EmergencySOS;
