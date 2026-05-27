import React from 'react';
import { MapPin, Phone, Clock, Facebook, Instagram, ShieldCheck, Mail } from 'lucide-react';

const Footer = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const address = settings?.address || '101 A, Street No. 13, Pratap Nagar, Mayur Vihar Phase-1, Delhi';
  const phones = settings?.phoneNumbers || ['9891067013', '8736909000'];
  const email = settings?.emailNotifications || 'cyberhubservicesdelhi@gmail.com';
  const hours = settings?.openingHours || {
    weekdays: '09:30 AM - 08:30 PM',
    saturday: '09:30 AM - 08:30 PM',
    sunday: '10:00 AM - 02:00 PM'
  };

  return (
    <footer className="bg-dark-blue text-slate-400 pt-16 border-t border-white/5 font-body">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
        {/* Col 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-gold-accent to-teal-accent rounded-lg flex items-center justify-center text-dark-blue font-bold shadow-premium-sm">
              <ShieldCheck className="w-5 h-5 text-dark-blue" />
            </span>
            <span className="font-display font-bold text-lg text-white">CYBER HUB SERVICES</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mt-2">
            Your single-point trusted destination in Delhi for official government documentations, Aadhaar & PAN card portal modifications, and secured high-value bank loans.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-gold-accent hover:text-dark-blue transition-all duration-300" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-gold-accent hover:text-dark-blue transition-all duration-300" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-display font-bold text-white text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-teal-accent">Quick Links</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li><a href="#hero" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Home</a></li>
            <li><a href="#services" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Our Services</a></li>
            <li><a href="#documents" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Document Guide</a></li>
            <li><a href="#why-choose-us" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Why Choose Us</a></li>
            <li><a href="#faq" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Frequently FAQs</a></li>
            <li><a href="#contact" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Contact Us</a></li>
          </ul>
        </div>

        {/* Col 3: Services Key */}
        <div>
          <h4 className="font-display font-bold text-white text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-teal-accent">Core Services</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li><a href="#documents" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Aadhaar Card Correction</a></li>
            <li><a href="#documents" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">New PAN Application</a></li>
            <li><a href="#services" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Home & Property Loans</a></li>
            <li><a href="#services" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Business & Personal Loans</a></li>
            <li><a href="#services" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Online Govt Form Filling</a></li>
            <li><a href="#services" className="hover:text-gold-accent hover:pl-1 transition-all duration-200">Laser Prints & Laminations</a></li>
          </ul>
        </div>

        {/* Col 4: Contact Office */}
        <div>
          <h4 className="font-display font-bold text-white text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-teal-accent">Office Address</h4>
          <ul className="flex flex-col gap-4 text-sm leading-relaxed">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-accent shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold-accent shrink-0" />
              <span>{phones.join(' / ')}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold-accent shrink-0" />
              <span>{email}</span>
            </li>
            <li className="bg-white/2 border-l-2 border-gold-accent p-3.5 rounded-r-md text-[13px] leading-relaxed">
              <Clock className="w-4 h-4 text-gold-accent inline shrink-0 mr-1.5 -mt-0.5" />
              <strong className="text-white">Office Hours:</strong>
              <div className="mt-1">
                Mon - Sat: {hours.weekdays}<br/>
                Sunday: {hours.sunday}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#070c1a] py-6 border-t border-white/5 text-xs text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-slate-500">
          <p>&copy; {currentYear} Cyber Hub Services. All Rights Reserved. Designed for maximum accessibility.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-accent">Privacy Policy</a>
            <a href="#" className="hover:text-gold-accent">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
