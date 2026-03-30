import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { PhoneCall, MapPin, Navigation, Ambulance } from 'lucide-react';

const steps = [
  {
    icon: <PhoneCall size={32} className="text-white" />,
    title: 'Call or Tap',
    desc: 'Dial 108 or use the AmbuClone app to request an ambulance instantly.',
    color: 'bg-red-500',
    dotColor: 'border-red-500',
    textColor: 'group-hover:text-red-500'
  },
  {
    icon: <MapPin size={32} className="text-white" />,
    title: 'Auto-Locate',
    desc: 'Our advanced system pinpoints your exact location for fastest routing.',
    color: 'bg-blue-500',
    dotColor: 'border-blue-500',
    textColor: 'group-hover:text-blue-500'
  },
  {
    icon: <Navigation size={32} className="text-white" />,
    title: 'Dispatch',
    desc: 'The nearest equipped ambulance is immediately dispatched to your location.',
    color: 'bg-indigo-500',
    dotColor: 'border-indigo-500',
    textColor: 'group-hover:text-indigo-500'
  },
  {
    icon: <Ambulance size={32} className="text-white" />,
    title: 'Rapid Response',
    desc: 'Medical professionals arrive to stabilize and transport the patient.',
    color: 'bg-red-600',
    dotColor: 'border-red-600',
    textColor: 'group-hover:text-red-600'
  }
];

const HowItWorks = () => {
  const containerRef = useRef(null);

  // Create a much taller container to provide the scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate reveal ranges for each of the 4 steps
  // Step 1 now starts immediately at 0
  const stepOpacity1 = useTransform(scrollYProgress, [0, 0.01], [0, 1]);
  const baseScale1 = useTransform(scrollYProgress, [0, 0.001], [0.5, 1]);
  const stepScale1 = useSpring(baseScale1, { stiffness: 200, damping: 15 });

  const stepOpacity2 = useTransform(scrollYProgress, [0.30, 0.31], [0, 1]);
  const baseScale2 = useTransform(scrollYProgress, [0.30, 0.301], [0.5, 1]);
  const stepScale2 = useSpring(baseScale2, { stiffness: 200, damping: 15 });

  const stepOpacity3 = useTransform(scrollYProgress, [0.6, 0.61], [0, 1]);
  const baseScale3 = useTransform(scrollYProgress, [0.6, 0.601], [0.5, 1]);
  const stepScale3 = useSpring(baseScale3, { stiffness: 200, damping: 15 });

  const stepOpacity4 = useTransform(scrollYProgress, [0.9, 0.91], [0, 1]);
  const baseScale4 = useTransform(scrollYProgress, [0.9, 0.901], [0.5, 1]);
  const stepScale4 = useSpring(baseScale4, { stiffness: 200, damping: 15 });

  const stepAnimations = [
    { opacity: stepOpacity1, scale: stepScale1 },
    { opacity: stepOpacity2, scale: stepScale2 },
    { opacity: stepOpacity3, scale: stepScale3 },
    { opacity: stepOpacity4, scale: stepScale4 },
  ];

  return (                                  
    <section id="howitworks" ref={containerRef} className="relative h-[600vh] lg:h-[400vh] bg-gray-50 z-20">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center">
          <div className="text-center mb-10 md:mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-2 md:mb-4 rounded-full bg-blue-100 text-blue-600 font-bold text-sm tracking-widest uppercase"
            >
              Process
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4 md:mb-6"
            >
              How <span className="text-[#3b82f6]">AmbuClone</span> Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto"
            >
              A seamless tech-enabled process designed to save precious time during emergencies.
            </motion.p>
          </div>

          <div className="relative h-full max-h-[85vh] overflow-visible pb-12">
            {/* Desktop Horizontal Progress Line */}
            <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-2 bg-gray-200 z-0 opacity-30 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-500 to-red-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>

            {/* Mobile/Tablet Vertical Progress Line */}
            <div className="lg:hidden absolute left-[28px] top-0 bottom-0 w-1.5 bg-gray-200 -translate-x-1/2 z-0 opacity-30 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                className="absolute inset-0 bg-gradient-to-b from-red-500 via-blue-500 to-red-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-8 relative z-10 h-full">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  style={{
                    opacity: stepAnimations[index].opacity,
                    scale: stepAnimations[index].scale
                  }}
                  whileHover={{ y: -10 }}
                  className="relative flex flex-row lg:flex-col items-center gap-3 lg:gap-0 group cursor-pointer"
                >
                  {/* Visual Step Marker */}
                  <div className="relative mb-0 lg:mb-10 flex-shrink-0">
                    <div className={`w-14 h-14 md:w-20 md:h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-xl relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                      {React.cloneElement(step.icon, { size: 30 })}
                    </div>
                    {/* Ring Glow Overlay */}
                    <div className={`absolute -inset-2.5 rounded-2xl border-2 ${step.dotColor} opacity-20 group-hover:scale-125 group-hover:opacity-60 transition-all duration-500`}></div>
                  </div>

                  {/* Card Content Interior */}
                  <div className="bg-white rounded-[1.2rem] md:rounded-[2rem] p-4 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100/50 text-left lg:text-center w-full relative group-hover:border-blue-500/10">
                    <div className="absolute -top-3 left-4 lg:left-1/2 lg:-translate-x-1/2 px-2.5 py-0.5 bg-gray-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest z-20">
                      Step 0{index + 1}
                    </div>
                    <h3 className={`text-base md:text-2xl font-black text-gray-900 mb-1 md:mb-4 transition-colors uppercase tracking-tight ${step.textColor}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-base text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition-colors">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Scroll Indicator Tip */}
            <motion.div
              style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-2"
            >
              <span className="text-xs font-bold uppercase tracking-widest">Scroll to explore</span>
              <div className="w-1 h-8 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  animate={{ y: [0, 24, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-full h-1/3 bg-blue-500 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
