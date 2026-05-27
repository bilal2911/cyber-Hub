import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 sm:bottom-8 sm:left-auto sm:right-8 sm:translate-x-0 z-[9999] flex items-center gap-3.5 px-5 py-4 rounded-xl shadow-premium-lg border transition-all duration-300 animate-bounce-subtle ${
      type === 'success'
        ? 'bg-emerald-950/90 backdrop-blur-md border-emerald-500/25 text-emerald-200'
        : 'bg-rose-950/90 backdrop-blur-md border-rose-500/25 text-rose-200'
    }`}>
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      )}
      
      <p className="font-body font-medium text-xs sm:text-sm tracking-wide leading-relaxed">{message}</p>
      
      <button 
        onClick={onClose}
        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="w-3.5 h-3.5 opacity-70" />
      </button>
    </div>
  );
};

export default Toast;
