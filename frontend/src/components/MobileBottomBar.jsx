import React from 'react';
import { Phone, BookOpen, MessageCircle } from 'lucide-react';

const MobileBottomBar = ({ settings }) => {
  const phone = settings?.phoneNumbers?.[0] || '9891067013';
  const whatsappNum = settings?.whatsappNumber || '9891067013';
  
  const prefilledMsg = encodeURIComponent("Hello Cyber Hub Services, mujhe aapki service ke baare me inquiry karni hai.");
  const waLink = `https://wa.me/91${whatsappNum}?text=${prefilledMsg}`;

  const scrollToDocs = (e) => {
    e.preventDefault();
    const docSection = document.getElementById('documents');
    if (docSection) {
      const offsetTop = docSection.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-dark-blue border-t border-white/10 z-[99] grid grid-cols-3 shadow-[0_-5px_20px_rgba(0,0,0,0.2)] font-display text-white">
      {/* Action 1: Call Now */}
      <a
        href={`tel:+91${phone}`}
        className="flex flex-col items-center justify-center gap-1 active:bg-white/5 border-r border-white/5"
      >
        <Phone className="w-5 h-5 text-gold-accent" />
        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-300">Call Office</span>
      </a>

      {/* Action 2: Check Documents */}
      <a
        href="#documents"
        onClick={scrollToDocs}
        className="flex flex-col items-center justify-center gap-1 active:bg-white/5 border-r border-white/5"
      >
        <BookOpen className="w-5 h-5 text-teal-accent" />
        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-300">Documents Guide</span>
      </a>

      {/* Action 3: WhatsApp Inquiry */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 active:bg-[#25d366]/10"
      >
        <MessageCircle className="w-5 h-5 text-[#25d366]" />
        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-300">WhatsApp</span>
      </a>
    </div>
  );
};

export default MobileBottomBar;
