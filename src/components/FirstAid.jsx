import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, ChevronDown, Stethoscope, Droplet, Wind, Flame, Zap, ShieldCheck, Search, Sparkles, Brain } from 'lucide-react';

const guides = [
  {
    id: 1,
    title: 'Adult CPR',
    subtitle: 'Cardiopulmonary Resuscitation',
    icon: <HeartPulse className="w-6 h-6 text-red-500" />,
    color: 'bg-red-50',
    content: [
      'Call 108 immediately.',
      'Place both hands in center of chest.',
      'Push hard & fast (2 inches deep).',
      'Rate: 100-120 compressions per minute.',
      'Keep going until paramedics arrive.'
    ],
    hasMetronome: true
  },
  {
    id: 2,
    title: 'Severe Bleeding',
    subtitle: 'Apply Pressure',
    icon: <Droplet className="w-6 h-6 text-rose-500" />,
    color: 'bg-rose-50',
    content: [
      'Apply direct pressure with clean cloth.',
      'Do not remove cloth if soaked.',
      'Elevate wound above heart level.',
      'Tie a bandage firmly over dressing.',
      'Wait for professional help.'
    ]
  },
  {
    id: 3,
    title: 'Choking',
    subtitle: 'Heimlich Maneuver',
    icon: <Wind className="w-6 h-6 text-blue-500" />,
    color: 'bg-blue-50',
    content: [
      'Stand behind the person.',
      'Wrap arms around their waist.',
      'Make a fist above their navel.',
      'Perform quick upward thrusts.',
      'Repeat until object is out.'
    ]
  },
  {
    id: 4,
    title: 'Thermal Burns',
    subtitle: 'Cool and Cover',
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    color: 'bg-orange-50',
    content: [
      'Remove from heat source.',
      'Run cool water for 20 minutes.',
      'Remove jewelry before swelling.',
      'Cover loosely with plastic wrap.',
      'Do not apply ice or butter.'
    ]
  },
  {
    id: 5,
    title: 'Seizures',
    subtitle: 'Stay Calm & Protect',
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    color: 'bg-yellow-50',
    content: [
      'Place them on their side.',
      'Clear sharp objects nearby.',
      'Cushion their head.',
      'Do not restrain them.',
      'Do not put things in mouth.'
    ]
  },
  {
    id: 6,
    title: 'Fractures',
    subtitle: 'Immobilize Area',
    icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
    color: 'bg-green-50',
    content: [
      'Do not move the injured limb.',
      'Apply a splint to stop movement.',
      'Apply ice to reduce swelling.',
      'Do not push bone back in.',
      'Seek medical help immediately.'
    ]
  }
];

const FirstAid = () => {
  const [activeGuide, setActiveGuide] = useState(null);
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(null);

  const handleAskAI = (e) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    
    setIsThinking(true);
    setAiAnswer(null);

    // Simulate ChatGPT-like response
    setTimeout(() => {
      setAiAnswer({
        query: query,
        answer: "Based on standard medical protocols: For " + query + ", you should focus on patient stabilization. Check breathing, keep the person calm, and ensure they are in a safe position. If consciousness is lost, roll them to their side into the recovery position. Always prioritize professional medical care - help is currently being dispatched."
      });
      setIsThinking(false);
    }, 1200);
  };

  return (
    <section id="firstaid" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest mb-4"
          >
            <Stethoscope className="w-4 h-4" />
            Emergency Instructions
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            First Aid <span className="text-red-600">Basics</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Clear, step-by-step instructions to stabilize patients while help is on the way.
          </p>
        </div>

        {/* ChatGPT Style AI Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleAskAI} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-3xl p-1 flex items-center shadow-sm border border-slate-100 overflow-hidden">
               <div className="pl-6 text-slate-400">
                  <Search className="w-5 h-5" />
               </div>
               <input 
                 type="text" 
                 placeholder="Type any health question... (e.g., 'What to do for chest pain?')"
                 className="w-full px-4 py-5 bg-transparent outline-none text-slate-800 font-bold placeholder:text-slate-300"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                />
               <button 
                 type="submit"
                 disabled={isThinking}
                 className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
               >
                 {isThinking ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                 ) : (
                    <Brain className="w-4 h-4" />
                 )}
                 {isThinking ? 'Thinking...' : 'Consult AI'}
               </button>
            </div>
          </form>

          {/* AI Response Display */}
          <AnimatePresence>
            {aiAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 bg-slate-50 border border-slate-100 p-8 rounded-3xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ChatGPT AI Response</p>
                </div>
                <h4 className="font-black text-slate-900 mb-3">"{aiAnswer.query}"</h4>
                <p className="text-slate-600 font-bold text-sm leading-relaxed">{aiAnswer.answer}</p>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Disclaimer: This is AI-generated advice. Dial 108 for life-threatening emergencies.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <motion.div
              layout
              key={guide.id}
              onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
              className={`relative bg-white border border-slate-100 rounded-3xl p-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:border-red-100`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-3xl ${guide.color}`}>
                  {guide.icon}
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${activeGuide === guide.id ? 'rotate-180 text-red-500' : ''}`} />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">{guide.title}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{guide.subtitle}</p>

              <AnimatePresence>
                {activeGuide === guide.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-slate-50">
                        <ul className="space-y-4">
                          {guide.content.map((step, i) => (
                            <li key={i} className="flex gap-4">
                              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                                {i + 1}
                              </span>
                              <p className="text-slate-600 font-bold text-sm leading-relaxed">{step}</p>
                            </li>
                          ))}
                        </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-20 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Disclaimer: Use these steps only as emergency stabilization.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FirstAid;
