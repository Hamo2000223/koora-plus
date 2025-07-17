import React from "react";

const Footer = () => (
  <footer className="w-full py-2 xs:py-3 md:py-4 text-center border-t border-gray-800 text-xs xs:text-sm md:text-base" style={{background: '#0a2342'}} dir="rtl">
    <span style={{color: '#FFD700'}}>&copy; {new Date().getFullYear()} كورة بلس. جميع الحقوق محفوظة.</span>
  </footer>
);

export default Footer; 