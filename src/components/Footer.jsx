import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 lg:col-span-1">
            <span className="text-3xl font-extrabold text-[#ef4444] tracking-tighter block mb-6">Ambu<span className="text-white">Clone</span></span>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Revolutionizing emergency medical transportation through technology, ensuring rapid response when every second matters.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex flex-col items-center justify-center text-gray-400 hover:bg-[#ef4444] hover:text-white transition-all"><Facebook size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex flex-col items-center justify-center text-gray-400 hover:bg-[#3b82f6] hover:text-white transition-all"><Twitter size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex flex-col items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex flex-col items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2">About Us</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-[#ef4444] text-sm transition-colors">Our Story</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#ef4444] text-sm transition-colors">Leadership Team</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#ef4444] text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#ef4444] text-sm transition-colors">Press & Media</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2">Connect With Us</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-[#ef4444] text-sm transition-colors">Partner With Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#ef4444] text-sm transition-colors">Corporate Tie-ups</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#ef4444] text-sm transition-colors">Investor Relations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#ef4444] text-sm transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2">Address</h4>
            <address className="not-italic text-sm text-gray-400 leading-relaxed space-y-2">
              <p>AmbuClone Medical Towers,</p>
              <p>123 Lifesaver Avenue, Sector 4</p>
              <p>Tech Park, Bengaluru - 560001</p>
              <p className="pt-2 text-[#ef4444] font-bold">Emergency No: 108</p>
            </address>
          </div>
          
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 AmbuClone. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
