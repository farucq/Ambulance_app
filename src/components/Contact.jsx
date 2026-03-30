import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowUpRight, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HQ_COORDS = [12.9716, 77.5946];

const CONTACT_ITEMS = [
  { icon: Phone, label: 'Emergency Hotline', value: '108 / +91 98765 43210', href: 'tel:108' },
  { icon: Mail, label: 'Email Support', value: 'support@ambuclone.com', href: 'mailto:support@ambuclone.com' },
  { icon: MapPin, label: 'Headquarters', value: 'Lifesaver Ave, Bengaluru - 560001', href: '#' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', message: '' }); }, 3000);
  };

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section label ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-500 mb-3">Contact</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Let's<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-orange-400">
                Connect.
              </span>
            </h2>
            <p className="text-slate-500 font-medium max-w-sm text-sm leading-relaxed">
              Reach out for partnerships, support, or emergency service integration. Our team is available around the clock.
            </p>
          </div>
          <div className="mt-8 h-px bg-gradient-to-r from-red-400 via-rose-300 to-transparent" />
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Dark info panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-slate-900 rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-700/15 rounded-full blur-[80px]" />
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-10 flex flex-col flex-1">

              {/* Contact items */}
              <div className="space-y-4 mb-8">
                {CONTACT_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    viewport={{ once: true }}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                      <item.icon className="w-4 h-4 text-white/70 group-hover:text-red-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 mb-0.5">{item.label}</p>
                      <p className="text-white font-bold text-sm truncate">{item.value}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                  </motion.a>
                ))}
              </div>

              {/* Map */}
              <div className="relative flex-1 min-h-[200px] rounded-2xl overflow-hidden border border-white/10">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${HQ_COORDS[0]},${HQ_COORDS[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-[999] bg-slate-900/90 backdrop-blur-sm hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all border border-white/10"
                >
                  <Navigation className="w-3 h-3" />
                  Directions
                </a>
                <MapContainer
                  center={HQ_COORDS}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%', minHeight: '200px' }}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={HQ_COORDS}>
                    <Popup><strong>AmbuClone HQ</strong><br />Bengaluru, Karnataka</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-3xl p-10 border border-slate-100 self-start"
          >
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Send a Message</h3>
            <p className="text-slate-400 text-sm font-medium mb-10">Typically reply within 2 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                ].map(field => (
                  <div key={field.name} className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={e => setForm(p => ({ ...p, [field.name]: e.target.value }))}
                      required
                      className="w-full px-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-slate-900 font-bold transition-all shadow-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">Your Message</label>
                <textarea
                  rows={6}
                  placeholder="How can we help you today?"
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  className="w-full px-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-slate-900 font-bold transition-all shadow-sm resize-none"
                />
              </div>


              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full py-5 rounded-2xl font-black text-white flex items-center justify-center gap-3 shadow-xl transition-all duration-300
                  ${sent ? 'bg-green-500 shadow-green-500/20' : 'bg-slate-900 hover:bg-red-600 shadow-slate-900/20'}`}
              >
                {sent ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    SEND MESSAGE
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
