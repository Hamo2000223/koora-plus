import React from "react";

const DefaultPlayerIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="32" cy="12" r="6" fill="#d1d5db" />

    {/* Torso */}
    <path d="M26 18C26 16 30 14 32 14C34 14 38 16 38 18V30H26V18Z" fill="#9ca3af" />

    {/* Arms */}
    <path d="M26 20L20 28" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 20L44 28" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />

    {/* Legs */}
    <path d="M28 30L26 44" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
    <path d="M36 30L38 44" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />

    {/* Ball */}
    <circle cx="26" cy="48" r="4" fill="#1f2937" />
  </svg>
);

export default DefaultPlayerIcon; 