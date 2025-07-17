import React from "react";

const Footer = () => (
  <footer className="w-full py-4 text-center border-t border-gray-800" style={{background: '#0a2342'}} dir="rtl">
    <span style={{color: '#FFD700'}}>&copy; {new Date().getFullYear()} كورة بلس. جميع الحقوق محفوظة.</span>
  </footer>
);

export default Footer; 