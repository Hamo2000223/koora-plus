import React from "react";

const HeroSection = () => (
  <section className="w-full max-w-5xl mb-8">
    <div className="rounded-3xl bg-gradient-to-b from-[#0a2342] to-neutral-900 shadow-lg p-8 flex flex-col items-center text-center border-2 border-[#e63946]">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-2">
        <span role="img" aria-label="كأس" style={{color: '#FFD700'}}>🏆</span>
        مرحباً بك في كورة بلس
      </h1>
      <p className="text-lg md:text-xl text-gray-200 mb-6">
        تابع أحدث المباريات والأخبار والإحصائيات لفرقك المفضلة مع أشمل منصة رياضية في العالم العربي
      </p>
    </div>
  </section>
);

export default HeroSection; 