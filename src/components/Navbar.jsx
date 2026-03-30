import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Phone, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ auth, setAuth }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Book Ambulance', href: '#booking' },
    { name: 'Services', href: '#services' },
    { name: 'Emergencies', href: '#emergency' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed z-50 w-full flex justify-center transition-all duration-500 ${
        scrolled ? 'top-6 px-4 pointer-events-none' : 'top-0 px-0 pointer-events-auto'
      }`}
    >
      <nav
        className={`w-full transition-all duration-500 relative ${
          scrolled
            ? 'bg-black/60 backdrop-blur-lg max-w-5xl rounded-full py-3 px-6 md:px-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto'
            : 'max-w-7xl bg-transparent py-5 px-4 sm:px-6 lg:px-8 pointer-events-auto'
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="text-3xl font-extrabold text-[#ef4444] tracking-tighter">Ambu<span className="text-white">Clone</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-[#ef4444] font-medium transition-colors text-sm uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-4 border-l border-white/20 pl-6 ml-2">
              {auth ? (
                <>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                      <UserIcon size={16} className="text-red-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">{auth.name || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Driver Login
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#ef4444] focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`md:hidden absolute left-0 w-full overflow-hidden ${
              scrolled
                ? 'top-[calc(100%+1rem)] glass-dark rounded-2xl border border-gray-700/50 shadow-2xl pointer-events-auto'
                : 'top-full glass-dark border-t border-gray-700/50 pointer-events-auto'
            }`}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-3 rounded-md text-base font-medium text-white hover:text-[#ef4444] hover:bg-gray-800/50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a href="tel:108" className="mt-4 flex justify-center items-center gap-2 w-full bg-[#ef4444] text-white px-5 py-3 rounded-full font-bold shadow-lg">
                <Phone size={18} />
                <span>Call Emergency</span>
              </a>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.div>
  );
};

export default Navbar;
