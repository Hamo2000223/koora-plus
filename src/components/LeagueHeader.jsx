import React from "react";

const LeagueHeader = ({ league }) => {
  if (!league) return null;
  return (
    <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2 bg-[#23272f] px-2 xs:px-4 py-1 xs:py-2 rounded-t-lg border-b border-[#23272f]" dir="rtl">
      <img
        src={league.logo}
        alt={league.name}
        className="h-5 w-5 xs:h-7 xs:w-7 md:h-8 md:w-8 rounded-full bg-white border border-gray-300 object-contain ml-1 xs:ml-2"
        loading="lazy"
      />
      <span className="text-xs xs:text-base font-bold text-white ml-1 xs:ml-2">{league.name}</span>
      {league.country && (
        <span className="text-[10px] xs:text-xs text-gray-400 ml-1 xs:ml-2">{league.country}</span>
      )}
      {league.flag && (
        <img src={league.flag} alt={league.country} className="h-3 w-4 xs:h-4 xs:w-6 object-contain ml-1" loading="lazy" />
      )}
      {league.round && (
        <span className="text-[10px] xs:text-xs text-gray-400 ml-1 xs:ml-2">{league.round}</span>
      )}
      {/* يمكنك إضافة مزيد من التفاصيل هنا */}
    </div>
  );
};

export default LeagueHeader; 