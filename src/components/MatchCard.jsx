import React from "react";

const MatchCard = ({ fixture }) => {
  if (!fixture) return null;
  const { teams, fixture: fixtureInfo, goals } = fixture;
  const isLive = fixtureInfo.status.short === "1H" || fixtureInfo.status.short === "2H" || fixtureInfo.status.short === "LIVE";
  const isFinished = fixtureInfo.status.short === "FT";
  const isNotStarted = fixtureInfo.status.short === "NS";
  const matchTime =
    isNotStarted
      ? new Date(fixtureInfo.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      : `${goals.home ?? 0} - ${goals.away ?? 0}`;

  // Status text (minute, FT, etc.)
  let statusText = "";
  if (isLive) statusText = `${fixtureInfo.status.elapsed}'`;
  else if (isFinished) statusText = "نهاية";
  else if (isNotStarted) statusText = "";
  else statusText = fixtureInfo.status.short;

  return (
    <div
      className="flex items-center bg-[#181818] px-4 py-3 border-b border-gray-800 relative"
      dir="rtl"
      style={{ minHeight: 56 }}
    >
      {/* Home Team (right) */}
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-start">
        <img
          src={teams.home.logo}
          alt={teams.home.name}
          className="h-7 w-7 rounded-full border-2 border-white bg-white object-contain"
          loading="lazy"
        />
        <span className="text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">{teams.home.name}</span>
      </div>

      {/* Match Info (center) - absolutely centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center min-w-[70px]">
        {statusText && (
          <span
            className={`text-xs mb-1 ${isLive ? "text-green-400 font-bold animate-pulse" : isFinished ? "text-gray-400" : "text-[#e63946]"}`}
          >
            {statusText}
          </span>
        )}
        <span
          className={`font-bold text-lg ${isLive ? "text-green-400" : "text-[#e63946]"}`}
          style={{ letterSpacing: 1 }}
        >
          {matchTime}
        </span>
      </div>

      {/* Away Team (left) */}
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
        <span className="text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">{teams.away.name}</span>
        <img
          src={teams.away.logo}
          alt={teams.away.name}
          className="h-7 w-7 rounded-full border-2 border-white bg-white object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default MatchCard;