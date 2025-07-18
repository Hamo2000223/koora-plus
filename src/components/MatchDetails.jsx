import React from "react";

function getEventMinute(event) {
  let min = Number(event.time.elapsed) || 0;
  if (event.time.extra) min += Number(event.time.extra);
  return min;
}

const MatchDetails = ({ fixture, events, loading, error }) => {
  if (!fixture) return null;
  const matchEvents = (events || []).slice();

  // Sort by time
  matchEvents.sort((a, b) => getEventMinute(a) - getEventMinute(b));

  const renderEventCard = (event, idx) => {
    const time = `${event.time.elapsed}'${event.time.extra ? `+${event.time.extra}` : ''}`;
    const isSub = event.type === "subst";
    const isGoal = event.type === "Goal";
    const isYellow = event.type === "Card" && event.detail === "Yellow Card";
    const isRed = event.type === "Card" && event.detail === "Red Card";

    let bg = "bg-[#23272f] text-white border-gray-600";
    if (isGoal) bg = "bg-green-700 text-white border-green-600";
    else if (isYellow) bg = "bg-yellow-400 text-black border-yellow-500";
    else if (isRed) bg = "bg-red-600 text-white border-red-800";

    const cardBase = `rounded-md px-3 py-2 text-sm border shadow min-w-[150px] max-w-xs ${bg}`;

    // Generate a unique key for each event
    const key = event.id || `${event.type}-${event.time.elapsed}-${event.time.extra || 0}-${event.player?.name || ''}-${idx}`;

    if (isSub) {
      return (
        <div key={key} className="w-full flex justify-center my-3">
          <div className={cardBase}>
            <div className="text-xs font-bold">{time}</div>
            <div className="text-green-400 font-semibold">↑ {event.player?.name}</div>
            {event.assist?.name && <div className="text-red-400">↓ {event.assist.name}</div>}
          </div>
        </div>
      );
    }
    if (isYellow || isRed) {
      return (
        <div key={key} className="w-full flex justify-center my-3">
          <div className={cardBase}>
            <div className="text-xs font-bold">{time}</div>
            <div className="font-semibold">
              {isYellow && "🟨 "}
              {isRed && "🟥 "}
              {event.player?.name}
            </div>
          </div>
        </div>
      );
    }
    if (isGoal) {
      return (
        <div key={key} className="w-full flex justify-center my-3">
          <div className={cardBase}>
            <div className="text-xs font-bold">{time}</div>
            <div className="font-semibold">
              {isGoal && "⚽ "}
              {event.player?.name}
            </div>
            {event.assist?.name && (
              <div className="text-xs mt-0.5 text-white/80">صناعة: {event.assist.name}</div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div key={key} className="w-full flex justify-center my-3">
        <div className={cardBase}>
          <div className="text-xs font-bold">{time}</div>
          <div className="font-semibold">
            {event.player?.name}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-[#181818] p-6 rounded-lg border border-[#e63946] text-white text-sm">
      {loading && <div className="text-center text-gray-400 py-4">جاري تحميل الأحداث...</div>}
      {error && <div className="text-center text-red-400 py-4">{error}</div>}
      {!loading && !error && (
        <div className="flex flex-col gap-0">
          {matchEvents.map((event, idx) => renderEventCard(event, idx))}
        </div>
      )}
    </div>
  );
};

export default MatchDetails;
