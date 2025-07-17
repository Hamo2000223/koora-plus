import React from "react";

const TopScorers = () => (
  <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <section className="w-full max-w-3xl">
        <div className="rounded-2xl bg-[#23272f] shadow-md p-8 flex flex-col gap-4 border-2 border-[#0a2342]">
          <h2 className="text-2xl font-bold mb-2 text-right" style={{color: '#e63946'}}>الهدافين</h2>
          <p className="text-gray-300">صفحة الهدافين (نص تجريبي).</p>
        </div>
      </section>
    </main>
  </div>
);

export default TopScorers; 