import React from 'react';

const FloatingWhatsApp = ({ settings }) => {
  const whatsappNum = settings?.whatsappNumber || '9891067013';
  
  // Format matching the exact required format: https://wa.me/919891067013
  const prefilledMsg = encodeURIComponent("Hello Cyber Hub Services, mujhe aapki service ke baare me inquiry karni hai.");
  const waLink = `https://wa.me/91${whatsappNum}?text=${prefilledMsg}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 bg-[#25d366] hover:bg-[#128c7e] rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_20px_rgba(37,211,102,0.4)] transition-all duration-300 transform hover:-translate-y-1 group"
      aria-label="Contact us on WhatsApp"
    >
      {/* Wave animation effect */}
      <span className="absolute w-full h-full rounded-full bg-[#25d366] opacity-35 animate-ping -z-10 group-hover:animate-none"></span>
      
      {/* Custom Vector Icon */}
      <svg
        className="w-8 h-8 text-white fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.628 1.977 14.17 1.025 11.54 1.024 6.108 1.025 1.681 5.393 1.677 10.82c-.001 1.678.453 3.313 1.314 4.747L2.006 21.6l6.236-1.63a9.66 9.66 0 0 0 4.405 1.184zm11.393-7.668c-.301-.15-1.782-.879-2.057-.978-.275-.1-.475-.15-.675.15-.2.3-.775.978-.95 1.178-.175.2-.35.225-.65.075-.3-.15-1.268-.467-2.417-1.492-.892-.797-1.495-1.782-1.67-2.083-.175-.3-.019-.462.131-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.487-.51-.669-.519-.172-.008-.371-.01-.57-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.521.714.309 1.272.493 1.707.631.715.227 1.365.195 1.88.118.574-.085 1.782-.728 2.032-1.43.25-.702.25-1.3.175-1.43-.075-.13-.275-.23-.575-.38z" />
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
