import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Stethoscope, Activity, Truck, Ambulance, ShieldAlert } from 'lucide-react';

const serviceData = [
  {
    icon: <Ambulance size={40} className="text-red-500" />,
    title: 'Advanced Life Support (ALS)',
    desc: 'Fully equipped ambulances with life-saving equipment and highly trained medical personnel for critical care.',
    color: 'red'
  },
  {
    icon: <Truck size={40} className="text-blue-500" />,
    title: 'Basic Life Support (BLS)',
    desc: 'Safe and monitored transport for stable patients who require medical supervision during transit.',
    color: 'blue'
  },
  {
    icon: <Activity size={40} className="text-red-500" />,
    title: 'ICU on Wheels',
    desc: 'Mobile Intensive Care Units designed to handle severe emergencies with ventilators and defibrillators.',
    color: 'red'
  },
  {
    icon: <HeartPulse size={40} className="text-blue-500" />,
    title: 'Neonatal Transport',
    desc: 'Specialized care for newborns and infants requiring immediate attention in transit.',
    color: 'blue'
  },
  {
    icon: <Stethoscope size={40} className="text-red-500" />,
    title: 'Patient Transfer',
    desc: 'Non-emergency transportation between hospitals, homes, and care facilities.',
    color: 'red'
  },
  {
    icon: <ShieldAlert size={40} className="text-blue-500" />,
    title: 'Event Medical Support',
    desc: 'On-site medical teams and standby ambulances for sports, concerts, and public events.',
    color: 'blue'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Our <span className="text-[#ef4444]">Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Comprehensive transportation and medical cover providing safety when you need it most.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {serviceData.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -12,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group cursor-default"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color === 'blue' ? 'from-blue-100' : 'from-red-100'} to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
              
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="bg-white p-4 inline-block rounded-xl shadow-md mb-6 relative z-10 group-hover:shadow-lg transition-all duration-300"
              >
                {service.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10 group-hover:text-gray-800 transition-colors">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed relative z-10 group-hover:text-gray-700 transition-colors">
                {service.desc}
              </p>
              <div className={`absolute bottom-0 left-0 w-0 h-1 ${service.color === 'blue' ? 'bg-blue-500' : 'bg-red-500'} group-hover:w-full transition-all duration-500`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
