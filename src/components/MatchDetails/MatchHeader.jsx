import React from "react";

const MatchHeader = ({ fixture }) => {
  if (!fixture) {
    return <div className="text-center text-gray-400">جاري تحميل بيانات المباراة...</div>;
  }

  const league = fixture?.league;
  const home = fixture?.teams?.home;
  const away = fixture?.teams?.away;
  const status = fixture?.fixture?.status?.long;
  const score = fixture?.goals;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex flex-col items-center">
          <img src={home?.logo} alt={home?.name} className="h-12 w-12 object-contain mb-1" />
          <span className="font-bold text-base md:text-lg">{home?.name}</span>
        </div>
        <div className="flex flex-col items-center mx-4">
          <span className="text-3xl md:text-4xl font-extrabold text-[#e63946]">{score?.home} - {score?.away}</span>
          <span className="text-xs text-gray-400 mt-1">{status}</span>
        </div>
        <div className="flex flex-col items-center">
          <img src={away?.logo} alt={away?.name} className="h-12 w-12 object-contain mb-1" />
          <span className="font-bold text-base md:text-lg">{away?.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {league?.logo && <img src={league.logo} alt={league.name} className="h-6 w-6 object-contain" />}
        <span className="text-sm text-gray-300">{league?.name}</span>
      </div>
    </div>
  );
};

export default MatchHeader; 