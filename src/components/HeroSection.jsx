import React from "react";

const HeroSection = () => (
  <section className="w-full max-w-7xl mb-4 xs:mb-6 md:mb-8 px-2 xs:px-4 md:px-0 mx-auto">
    <div className="rounded-2xl xs:rounded-3xl bg-gradient-to-b from-[#0a2342] to-neutral-900 shadow-lg p-4 xs:p-6 md:p-8 flex flex-col items-center text-center border-2 border-[#e63946]">
      <h1 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 xs:mb-3 md:mb-4 flex items-center justify-center gap-1 xs:gap-2">
        <span role="img" aria-label="كأس" style={{color: '#FFD700'}}>🏆</span>
        مرحباً بك في كورة بلس
      </h1>
      <p className="text-base xs:text-lg md:text-xl text-gray-200 mb-3 xs:mb-4 md:mb-6">
        تابع أحدث المباريات والأخبار والإحصائيات لفرقك المفضلة مع أشمل منصة رياضية في العالم العربي
      </p>
    </div>
  </section>
);

export default HeroSection; 