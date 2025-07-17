import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="w-full bg-[#181818] border-b border-gray-800" dir="rtl">
    <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-4">
      {/* Logo only, maximized, linked to home with animation */}
      <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-all duration-300 hover:scale-105">
        <img src="/logo.svg" alt="logo" className="h-24" />
      </Link>
      {/* Navigation */}
      <nav className="flex gap-8 text-lg font-medium">
        <Link to="/" className="flex items-center gap-1 text-white hover:text-yellow-400">
          <span role="img" aria-label="كرة قدم">⚽</span> مباريات اليوم
        </Link>
        <Link to="/tournaments" className="flex items-center gap-1 text-white hover:text-yellow-400">
          <span role="img" aria-label="كأس">🏆</span> البطولات
        </Link>
        <Link to="/dates" className="flex items-center gap-1 text-white hover:text-yellow-400">
          <span role="img" aria-label="تقويم">📅</span> أهم التواريخ
        </Link>
        <Link to="/standings" className="flex items-center gap-1 text-white hover:text-yellow-400">
          <span role="img" aria-label="قائمة">📋</span> الترتيب
        </Link>
        <Link to="/scorers" className="flex items-center gap-1 text-white hover:text-yellow-400">
          <span role="img" aria-label="هداف">👑</span> الهدافين
        </Link>
      </nav>
    </div>
  </header>
);

export default Header; 