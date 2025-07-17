import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="w-full bg-[#181818] border-b border-gray-800" dir="rtl">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between py-2 px-2 sm:px-4">
      {/* Logo only, maximized, linked to home with animation */}
      <Link to="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-all duration-300 hover:scale-105 mb-2 sm:mb-0">
        <img src="/logo.svg" alt="logo" className="h-12 xs:h-16 sm:h-20 md:h-24 w-auto" />
      </Link>
      {/* Navigation */}
      <nav className="flex flex-wrap gap-2 xs:gap-4 sm:gap-6 md:gap-8 text-base xs:text-lg font-medium justify-center sm:justify-end">
        <Link to="/" className="flex items-center gap-1 text-white hover:text-yellow-400 text-sm xs:text-base md:text-lg">
          <span role="img" aria-label="كرة قدم">⚽</span> مباريات اليوم
        </Link>
        <Link to="/tournaments" className="flex items-center gap-1 text-white hover:text-yellow-400 text-sm xs:text-base md:text-lg">
          <span role="img" aria-label="كأس">🏆</span> البطولات
        </Link>
        <Link to="/dates" className="flex items-center gap-1 text-white hover:text-yellow-400 text-sm xs:text-base md:text-lg">
          <span role="img" aria-label="تقويم">📅</span> أهم التواريخ
        </Link>
        <Link to="/standings" className="flex items-center gap-1 text-white hover:text-yellow-400 text-sm xs:text-base md:text-lg">
          <span role="img" aria-label="قائمة">📋</span> الترتيب
        </Link>
        <Link to="/scorers" className="flex items-center gap-1 text-white hover:text-yellow-400 text-sm xs:text-base md:text-lg">
          <span role="img" aria-label="هداف">👑</span> الهدافين
        </Link>
      </nav>
    </div>
  </header>
);

export default Header; 