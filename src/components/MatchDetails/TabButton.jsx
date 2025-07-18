import React from "react";

const TabButton = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 rounded-t-lg font-bold text-sm md:text-base transition border-b-2 ${active ? "border-[#e63946] text-[#e63946] bg-[#23272f]" : "border-transparent text-gray-300 bg-transparent hover:bg-[#23272f]"}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default TabButton; 