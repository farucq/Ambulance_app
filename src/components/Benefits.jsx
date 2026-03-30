import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldCheck, Clock, Award, User, Users, Building2, Star, Zap, HeartPulse, BarChart3, Phone } from 'lucide-react';

const plans = [
  {
    id: 'individual',
    icon: <User size={20} />,
    label: 'Individual',
    price: '₹499',
    period: '/yr',
    tagline: 'Personal safety coverage',
    badge: null,
    bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    border: 'border-slate-500/40',
    accent: 'text-cyan-400',
    checkColor: 'text-cyan-400',
    features: ['1 Member', '3 Ambulance rides/yr', '24/7 App SOS', 'Basic triage support'],
    cta: 'Get Started',
    benefits: [
      { icon: <Zap size={26} />, title: 'Instant SOS Dispatch', desc: 'One tap sends the nearest ambulance to your GPS location instantly.' },
      { icon: <Clock size={26} />, title: '15-Min ETA Guarantee', desc: 'Fastest personal response time — guaranteed first in the industry.' },
      { icon: <HeartPulse size={26} />, title: 'Live Vitals Relay', desc: 'Your paramedic streams your vitals to the ER before arrival.' },
      { icon: <ShieldCheck size={26} />, title: 'Zero Cash Upfront', desc: 'Cashless admission at all 200+ network hospitals. No paperwork.' },
    ],
    ctaLabel: 'Get Individual Plan — ₹499/yr',
    ctaDesc: 'Perfect personal emergency cover for one.',
    accentBg: 'bg-cyan-500/10 text-cyan-400',
  },
  {
    id: 'family',
    icon: <Users size={20} />,
    label: 'Family Plan',
    price: '₹999',
    period: '/yr',
    tagline: 'Best value for families',
    badge: 'Popular',
    bg: 'bg-gradient-to-br from-blue-950 to-slate-900',
    border: 'border-blue-800/50',
    accent: 'text-white',
    checkColor: 'text-blue-300',
    features: ['Up to 5 Members', '24/7 Tele-medicine', 'Health Checkup', 'Priority ER access'],
    cta: 'Subscribe Now',
    benefits: [
      { icon: <Users size={26} />, title: 'Covers Up to 5 Members', desc: 'Full emergency cover for your entire household under one plan.' },
      { icon: <Clock size={26} />, title: 'Priority ER Admissions', desc: 'All family members skip triage queues for immediate critical care.' },
      { icon: <HeartPulse size={26} />, title: 'Free Health Checkups', desc: 'Semi-annual health check for every member included at no extra cost.' },
      { icon: <ShieldCheck size={26} />, title: 'Smart Insurance Claim', desc: 'Automated, seamless insurance claim filing during emergencies.' },
    ],
    ctaLabel: 'Subscribe Now — ₹999/yr',
    ctaDesc: 'Most popular plan for families of up to 5.',
    accentBg: 'bg-blue-500/10 text-blue-400',
  },
  {
    id: 'corporate',
    icon: <Building2 size={20} />,
    label: 'Corporate',
    price: '₹4,999',
    period: '/yr',
    tagline: 'Enterprise workforce protection',
    badge: 'New',
    bg: 'bg-gradient-to-br from-violet-950 to-slate-900',
    border: 'border-violet-800/50',
    accent: 'text-violet-200',
    checkColor: 'text-violet-300',
    features: ['50+ Employees', 'Fleet Dashboard', 'Account Manager', 'Annual Health Camp'],
    cta: 'Subscribe Now',
    benefits: [
      { icon: <Building2 size={26} />, title: '50+ Employee Coverage', desc: 'Scale emergency protection across your entire workforce seamlessly.' },
      { icon: <BarChart3 size={26} />, title: 'Real-Time Fleet Dashboard', desc: 'Monitor all active dispatches and employee health status live.' },
      { icon: <Phone size={26} />, title: 'Dedicated Account Manager', desc: 'A named emergency liaison on call 24/7 exclusively for your company.' },
      { icon: <Award size={26} />, title: 'Annual Health Camps', desc: 'On-site corporate health camps and first-aid training for all staff.' },
    ],
    ctaLabel: 'Contact Sales — ₹4,999/yr',
    ctaDesc: 'Enterprise-grade protection for your team.',
    accentBg: 'bg-violet-500/10 text-violet-400',
  },
];

const Benefits = () => {
  const [topCard, setTopCard] = useState(1);

  const handleCardClick = (idx) => {
    if (idx !== topCard) setTopCard(idx);
  };

  const activePlan = plans[topCard];

  return (
    <section id="benefits" className="min-h-screen bg-[#111827] text-white relative overflow-hidden flex items-center">
      <div
        className="absolute inset-0 opacity-10 blur-xl pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at top right, #3b82f6, transparent 40%), radial-gradient(circle at bottom left, #ef4444, transparent 40%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16">

        {/* ── LEFT: Dynamic Benefits (changes with selected card) ── */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlan.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <span className="text-[#3b82f6] font-bold text-sm tracking-widest uppercase mb-4 block">
                {activePlan.label} Plan
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                AmbuClone <span className="text-[#ef4444]">Shield</span>
              </h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                {activePlan.ctaDesc} Get unprecedented access to emergency services when every second counts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activePlan.benefits.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`p-3 rounded-xl shadow-inner flex-shrink-0 ${activePlan.accentBg} bg-gray-800`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12">
                <button className="bg-gradient-to-r from-[#ef4444] to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-red-500/20 transform hover:-translate-y-1 transition-all">
                  {activePlan.ctaLabel}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT: 3-Card Carousel (Left · Center · Right) ── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative" style={{ width: '300px', height: '460px' }}>
            {plans.map((plan, i) => {
              const pos = (i - topCard + 3) % 3;
              const isCenter = pos === 0;
              const isRight  = pos === 1;

              const x       = isCenter ? 0  : isRight ? 130 : -130;
              const rotate  = isCenter ? 0  : isRight ?  10 :  -10;
              const scale   = isCenter ? 1  : 0.80;
              const zIdx    = isCenter ? 30 : 10;
              const opacity = isCenter ? 1  : 0.75;

              return (
                <motion.div
                  key={plan.id}
                  animate={{ x, rotate, scale, opacity }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  onClick={() => !isCenter && handleCardClick(i)}
                  className={`absolute inset-0 ${plan.bg} border-2 rounded-3xl p-6 flex flex-col overflow-hidden
                    ${isCenter ? plan.border + ' cursor-default' : 'border-white/10 cursor-pointer'}`}
                  style={{
                    zIndex: zIdx,
                    transformOrigin: 'center center',
                    boxShadow: isCenter
                      ? '0 32px 80px -12px rgba(0,0,0,0.7)'
                      : '0 8px 20px -6px rgba(0,0,0,0.45)',
                  }}
                >
                  {isCenter && (
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                  )}

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                        {plan.icon}
                      </div>
                      <span className="text-white font-black text-lg">{plan.label}</span>
                    </div>
                    {plan.badge && (
                      <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        plan.badge === 'Popular'
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-violet-400/20 text-violet-300 border-violet-400/30'
                      }`}>
                        {plan.badge === 'Popular' && <Star size={9} fill="currentColor" />}
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-1">
                    <span className={`text-4xl font-black ${plan.accent}`}>{plan.price}</span>
                    <span className="text-white/40 text-sm pb-0.5">{plan.period}</span>
                  </div>
                  <p className="text-white/50 text-xs mb-4">{plan.tagline}</p>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-xs font-medium text-white/80">
                        <CheckCircle size={13} className={`flex-shrink-0 ${plan.checkColor}`} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 w-full py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all border border-white/10"
                  >
                    {plan.cta}
                  </button>

                  {/* Dim overlay for side cards */}
                  {!isCenter && (
                    <div className="absolute inset-0 rounded-3xl bg-black/20 flex items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Tap to select</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Benefits;
