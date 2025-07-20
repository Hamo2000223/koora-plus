import { BarChart3, ChevronDown, Home, Info, Newspaper, Phone, Shield, Star, Users } from 'lucide-react';
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const infoRef = useRef(null);
  const dataRef = useRef(null);
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (infoRef.current && !infoRef.current.contains(e.target)) {
        setInfoOpen(false);
      }
      if (dataRef.current && !dataRef.current.contains(e.target)) {
        setDataOpen(false);
      }
    }
    if (infoOpen || dataOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [infoOpen, dataOpen]);

  const navLinks = [
    { to: "/", label: "الرئيسية", icon: <Home size={18} />, active: location.pathname === "/" },
    { to: "/news", label: "الأخبار", icon: <Newspaper size={18} />, active: location.pathname === "/news" },
    { to: "/matches", label: "المباريات", icon: <BarChart3 size={18} />, active: location.pathname === "/matches" },
    { to: "/tournaments", label: "البطولات", icon: <Star size={18} />, active: location.pathname === "/tournaments" },
  ];

  return (
    <header className="w-full bg-[#181818] border-b border-gray-800" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between py-2 px-2 sm:px-4">
        {/* Logo only, maximized, linked to home with animation */}
        <Link to="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-all duration-300 hover:scale-105 mb-2 sm:mb-0">
          <img src="/logo.svg" alt="logo" className="h-12 xs:h-16 sm:h-20 md:h-24 w-auto" />
        </Link>
        {/* Navigation */}
        <nav className="flex flex-wrap gap-2 xs:gap-4 sm:gap-6 md:gap-8 text-base xs:text-lg font-medium justify-center sm:justify-end items-center">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition bg-[#23272f] text-white hover:text-yellow-400 hover:bg-[#333] text-sm xs:text-base md:text-lg ${link.active ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          
          {/* البيانات Dropdown */}
          <div className="relative" ref={dataRef}>
            <button
              className={`flex items-center gap-2 text-white hover:text-yellow-400 text-sm xs:text-base md:text-lg px-4 py-2 rounded-xl transition bg-[#23272f] ${dataOpen ? 'ring-2 ring-yellow-400' : ''}`}
              onClick={() => setDataOpen(v => !v)}
              aria-haspopup="true"
              aria-expanded={dataOpen}
              type="button"
            >
              <Users size={18} />
              البيانات
              <ChevronDown size={18} className={`transition-transform ${dataOpen ? 'rotate-180' : ''}`} />
            </button>
            {dataOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#23272f] rounded-2xl shadow-lg border border-[#23272f] overflow-hidden z-50 animate-fade-in">
                <Link
                  to="/players"
                  className={`flex items-center justify-between gap-2 px-4 py-3 text-white hover:bg-[#333] text-right text-base border-b border-[#181818] transition ${location.pathname === '/players' ? 'bg-[#333] text-yellow-300' : ''}`}
                  onClick={() => setDataOpen(false)}
                >
                  اللاعبين
                  <Users size={18} />
                </Link>
                <Link
                  to="/teams"
                  className={`flex items-center justify-between gap-2 px-4 py-3 text-white hover:bg-[#333] text-right text-base transition ${location.pathname === '/teams' ? 'bg-[#333] text-yellow-300' : ''}`}
                  onClick={() => setDataOpen(false)}
                >
                  الفرق
                  <Shield size={18} />
                </Link>
              </div>
            )}
          </div>

          {/* معلومات Dropdown */}
          <div className="relative" ref={infoRef}>
            <button
              className={`flex items-center gap-2 text-white hover:text-yellow-400 text-sm xs:text-base md:text-lg px-4 py-2 rounded-xl transition bg-[#23272f] ${infoOpen ? 'ring-2 ring-yellow-400' : ''}`}
              onClick={() => setInfoOpen(v => !v)}
              aria-haspopup="true"
              aria-expanded={infoOpen}
              type="button"
            >
              <Info size={18} />
              معلومات
              <ChevronDown size={18} className={`transition-transform ${infoOpen ? 'rotate-180' : ''}`} />
            </button>
            {infoOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#23272f] rounded-2xl shadow-lg border border-[#23272f] overflow-hidden z-50 animate-fade-in">
                <Link
                  to="/about"
                  className={`flex items-center justify-between gap-2 px-4 py-3 text-white hover:bg-[#333] text-right text-base border-b border-[#181818] transition ${location.pathname === '/about' ? 'bg-[#333] text-yellow-300' : ''}`}
                  onClick={() => setInfoOpen(false)}
                >
                  من نحن
                  <Info size={18} />
                </Link>
                <Link
                  to="/contact"
                  className={`flex items-center justify-between gap-2 px-4 py-3 text-white hover:bg-[#333] text-right text-base transition ${location.pathname === '/contact' ? 'bg-[#333] text-yellow-300' : ''}`}
                  onClick={() => setInfoOpen(false)}
                >
                  اتصل بنا
                  <Phone size={18} />
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 