import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, Stars } from '@react-three/drei';
import { ArrowRight } from 'lucide-react';
import ambulanceBg from '../assets/ambulance_bg.jpg';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <div id="home" className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-gray-950">

      {/* Cinematic Ambulance Background Image */}
      <div
        className="absolute inset-0 w-full h-full z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url(${ambulanceBg})` }}
      ></div>
      {/* Real Ambulance Light Effect (Physical Strobe + Ambient Glow) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {/* Overhead Strobe Lights (Physical Bar Emulation) */}
        <div className="absolute top-0 inset-x-0 h-2 flex justify-between px-[10%] opacity-80 mix-blend-screen">
          <div className="w-1/3 h-full bg-red-500 strobe-emitter-red rounded-b-xl"></div>
          <div className="w-1/3 h-full bg-blue-500 strobe-emitter-blue rounded-b-xl"></div>
        </div>

        {/* Ambient Environment Flashing (Room Illumination) */}
        <div className="absolute -inset-[50%] mix-blend-multiply">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(239,68,68,0.8)_0%,transparent_50%)] ambient-glow-red"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.8)_0%,transparent_50%)] ambient-glow-blue"></div>
        </div>
      </div>

      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-[2px] pointer-events-none"></div>

      {/* Background abstract elements */}
      <motion.div style={{ y: y1 }} className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-red-400 opacity-10 blur-3xl"></motion.div>
      <motion.div style={{ y: y2 }} className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-blue-400 opacity-10 blur-3xl"></motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Saving Lives, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
              One Second
            </span> at a Time.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
            AmbuClone provides unparalleled emergency medical transportation with state-of-the-art vehicles and highly trained paramedics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg shadow-red-500/30 transition-all"
            >
              <span>Book Ambulance</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/60 hover:border-white rounded-full font-bold text-lg transition-all"
            >
              Our Services
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
