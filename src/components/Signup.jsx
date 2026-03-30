import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Mail, Lock, AlertTriangle, ArrowRight, Siren, Phone, UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../utils/db';

const Signup = () => {
  const [role] = useState('driver');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const newUser = { 
        name: formData.name, 
        email: formData.email, 
        phone: formData.phone,
        password: formData.password, 
        role 
      };
      await db.saveUser(newUser);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="h-screen flex flex-col md:flex-row-reverse bg-[#080808] overflow-hidden relative font-sans selection:bg-red-500/30">
      {/* RIGHT SECTION (now Right for Branding): Minimal Text Branding */}
      <motion.div 
        layoutId="branding-section"
        className="relative w-full md:w-1/2 h-[30vh] md:h-screen flex items-center justify-center p-12 bg-gradient-to-br from-[#0a0a0a] to-[#121212] border-l border-white/5 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {/* Shifted gradient to Right for Signup */}
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.05)_0%,transparent_50%)]" />
        </div>
        
        <div className="relative z-10 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl shadow-2xl shadow-red-600/20 mb-8 mx-auto md:mx-0"
          >
            <Siren className="text-white w-9 h-9" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6"
          >
            AMBU<br/>
            <span className="text-red-600">CLONE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-bold text-sm uppercase tracking-[0.4em] mb-12"
          >
            Tactical Registration
          </motion.p>
          
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="w-12 h-1 bg-red-600 rounded-full mx-auto md:mx-0 mb-6"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-xs text-slate-500 font-medium text-xs leading-relaxed mx-auto md:mx-0"
          >
            Join the elite emergency coordination network. Establish your node identity to begin operations.
          </motion.p>
        </div>
      </motion.div>

      {/* LEFT SECTION (now Left for Signup): Signup Form */}
      <motion.div 
        layoutId="form-section"
        className="relative w-full md:w-1/2 h-full flex items-center justify-center p-8 lg:p-16 bg-[#080808] overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/[0.03] blur-[150px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg relative z-20"
        >
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/5 p-10 lg:p-12 shadow-[0_50px_100px_-15px_rgba(0,0,0,0.5)] relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
             
             <div className="mb-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <UserPlus className="text-red-600 w-6 h-6" />
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">DRIVER ENROLLMENT</h2>
                </div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Register as an Ambulance Driver</p>
             </div>

             <AnimatePresence mode="wait">
               {error && (
                 <motion.div 
                   initial={{ opacity: 0, y: -10 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   exit={{ opacity: 0, y: -10 }}
                   className="bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest"
                 >
                   <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                   {error}
                 </motion.div>
               )}
             </AnimatePresence>

             <form onSubmit={handleSignup} className="space-y-4 lg:space-y-6">


                <div className="space-y-4">
                   <div className="relative group">
                     <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-red-500 transition-colors" />
                     <input
                       name="name"
                       onChange={handleChange}
                       required
                       className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-sm"
                       placeholder="FULL NAME"
                     />
                   </div>
                   <div className="relative group">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-red-500 transition-colors" />
                     <input
                       name="email"
                       type="email"
                       onChange={handleChange}
                       required
                       className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-sm"
                       placeholder="EMAIL ID"
                     />
                   </div>
                   <div className="relative group">
                     <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-red-500 transition-colors" />
                     <input
                       name="phone"
                       type="tel"
                       onChange={handleChange}
                       required
                       className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-sm"
                       placeholder="CONTACT NUMBER"
                     />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="relative group">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-red-500 transition-colors" />
                       <input
                         name="password"
                         type="password"
                         onChange={handleChange}
                         required
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-sm"
                         placeholder="PASSWORD"
                       />
                     </div>
                     <div className="relative group">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-red-500 transition-colors" />
                       <input
                         name="confirm"
                         type="password"
                         onChange={handleChange}
                         required
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-bold text-sm"
                         placeholder="VERIFY"
                       />
                     </div>
                   </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-gradient-to-r from-red-600 to-rose-700 text-white font-black rounded-2xl shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-4 disabled:opacity-50 text-[10px] uppercase tracking-[0.3em] group/btn"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      REGISTER PROFILE
                      <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                    </>
                  )}
                </motion.button>

                <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest mt-8">
                  EXISTING OPERATOR? <Link to="/login" className="text-white hover:text-red-500 transition-colors border-b border-white/10 pb-1 ml-2">ESTABLISH LINK</Link>
                </p>
             </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
