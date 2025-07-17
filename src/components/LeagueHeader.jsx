import React from "react";

const LeagueHeader = ({ league }) => {
  if (!league) return null;
  return (
    <div className="flex items-center gap-2 mb-2 bg-[#23272f] px-4 py-2 rounded-t-lg border-b border-[#23272f]" dir="rtl">
      <img
        src={league.logo}
        alt={league.name}
        className="h-7 w-7 rounded-full bg-white border border-gray-300 object-contain ml-2"
        loading="lazy"
      />
      <span className="text-base font-bold text-white ml-2">{league.name}</span>
      {league.country && (
        <span className="text-xs text-gray-400 ml-2">{league.country}</span>
      )}
      {league.flag && (
        <img src={league.flag} alt={league.country} className="h-4 w-6 object-contain ml-1" loading="lazy" />
      )}
      {league.round && (
        <span className="text-xs text-gray-400 ml-2">{league.round}</span>
      )}
      {/* يمكنك إضافة مزيد من التفاصيل هنا */}
    </div>
  );
};

export default LeagueHeader; 