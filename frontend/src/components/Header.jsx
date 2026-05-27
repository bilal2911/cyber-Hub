import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

const Header = ({ onOpenLoanModal }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/#hero' },
    { name: 'Services', path: '/#services' },
    { name: 'Documents Guide', path: '/#documents' },
    { name: 'Why Us', path: '/#why-choose-us' },
    { name: 'FAQs', path: '/#faq' },
    { name: 'Contact', path: '/#contact' }
  ];

  const handleLinkClick = (path) => {
    setIsDrawerOpen(false);
    
    if (path.startsWith('/#')) {
      const elementId = path.substring(2);
      const element = document.getElementById(elementId);
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] py-4 transition-all duration-300 ${
        isSticky 
          ? 'bg-dark-blue/85 backdrop-blur-md border-b border-white/5 shadow-premium-lg py-3' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-gold-accent to-teal-accent rounded-lg flex items-center justify-center text-dark-blue font-bold shadow-premium-md">
              <ShieldCheck className="w-6 h-6 text-dark-blue" />
            </span>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-gold-accent leading-none">CYBER HUB</span>
              <span className="font-body font-medium text-[9px] tracking-[2.5px] text-white mt-1">SERVICES</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    handleLinkClick(link.path);
                  }
                }}
                className="font-display font-semibold text-sm text-white/90 hover:text-gold-accent transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:width-0 after:h-[2px] after:bg-gold-accent hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenLoanModal()}
              className="hidden sm:inline-flex items-center gap-2 bg-gold-accent text-dark-blue hover:bg-gold-accent-hover font-display font-semibold text-xs px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-premium-sm hover:shadow-premium-md"
            >
              <span>Apply for Loan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            
            {/* Hamburger toggle */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex flex-col justify-center items-center gap-1.5 cursor-pointer"
              aria-label="Open menu"
            >
              <span className="w-5 h-0.5 bg-white"></span>
              <span className="w-5 h-0.5 bg-white"></span>
              <span className="w-5 h-0.5 bg-white"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 w-[280px] h-full bg-cream-card z-[1000] p-8 flex flex-col shadow-premium-lg transition-all duration-500 ease-out transform ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-gold-accent to-teal-accent rounded-lg flex items-center justify-center text-dark-blue font-bold shadow-premium-sm">
              <ShieldCheck className="w-5 h-5 text-dark-blue" />
            </span>
            <span className="font-display font-bold text-lg text-dark-blue leading-none">CYBER HUB</span>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-dark-blue cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 mb-auto">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                }
                handleLinkClick(link.path);
              }}
              className="font-display font-semibold text-lg text-dark-blue border-b border-slate-100 pb-2 hover:text-teal-accent"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="border-t border-slate-200 pt-6">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Need Help? Call Us</p>
          <a href="tel:+919891067013" className="block text-base font-bold text-dark-blue hover:text-teal-accent mb-0.5">9891067013</a>
          <a href="tel:+918736909000" className="block text-base font-bold text-dark-blue hover:text-teal-accent mb-6">8736909000</a>
          <button 
            onClick={() => {
              setIsDrawerOpen(false);
              onOpenLoanModal();
            }}
            className="w-full bg-gold-accent hover:bg-gold-accent-hover text-dark-blue py-3 rounded-lg font-display font-semibold text-sm text-center shadow-premium-sm"
          >
            Apply for Loan
          </button>
        </div>
      </div>

      {/* Overlay backdrop */}
      <div 
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed top-0 left-0 w-full h-full bg-dark-blue/60 backdrop-blur-xs z-[999] transition-all duration-300 ${
          isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      ></div>
    </>
  );
};

export default Header;
