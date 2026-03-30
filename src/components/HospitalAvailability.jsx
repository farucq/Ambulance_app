import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, ShieldAlert, Navigation } from 'lucide-react';

const hospitals = [
  {
    id: 1,
    name: 'Apollo Spectra Group',
    distance: '3.2 km',
    eta: '8 mins',
    icu_beds: 4,
    emergency_open: true,
  },
  {
    id: 2,
    name: 'City General Hospital',
    distance: '5.1 km',
    eta: '12 mins',
    icu_beds: 0,
    emergency_open: true,
  },
  {
    id: 3,
    name: 'St. Mary’s Care Center',
    distance: '7.8 km',
    eta: '18 mins',
    icu_beds: 12,
    emergency_open: true,
  },
];

const HospitalAvailability = () => {
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0].id);

  return (
    <section id="emergency" className="relative z-30 py-24 bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-red-100 text-red-600 font-bold text-sm tracking-widest uppercase"
          >
            Live Dashboard Mockup
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4"
          >
            Network Hospital <span className="text-[#ef4444]">Availability</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto"
          >
            In an emergency, knowing where to go saves lives. AmbuClone seamlessly connects you to real-time hospital bed availability and redirects your ambulance instantly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 z-0" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <Activity className="text-blue-500 mr-2 w-6 h-6" /> Nearby Partner Hospitals
                </h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>

              <div className="space-y-4">
                {hospitals.map((hospital) => (
                  <motion.div
                    key={hospital.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedHospital(hospital.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedHospital === hospital.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-100 hover:border-blue-200'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{hospital.name}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                          <span className="flex items-center"><Navigation className="w-4 h-4 mr-1" /> {hospital.distance} away</span>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> ETA {hospital.eta}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center ${hospital.icu_beds > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          ICU Beds: {hospital.icu_beds > 0 ? hospital.icu_beds : 'Full'}
                        </div>
                        {selectedHospital === hospital.id && (
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors block sm:hidden">
                            Route
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl h-full flex flex-col justify-center">
              <ShieldAlert className="w-12 h-12 text-red-500 mb-6 mx-auto sm:mx-0" />
              <h3 className="text-2xl font-bold mb-4">Why Pre-Admission Matters?</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Our paramedics instantly sync your vital signs with the destination hospital while you are in transit. The emergency team is prepared with the necessary equipment and doctors before you even arrive.
              </p>

              <ul className="space-y-3 mb-8 text-sm font-medium">
                <li className="flex items-center"><span className="w-6 text-blue-400">✓</span> Bypass triage waiting times</li>
                <li className="flex items-center"><span className="w-6 text-blue-400">✓</span> Instant vital signs sync</li>
                <li className="flex items-center"><span className="w-6 text-blue-400">✓</span> Seamless smart insurance claim</li>
              </ul>

              <button className="mt-auto w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                Partner with Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalAvailability;
