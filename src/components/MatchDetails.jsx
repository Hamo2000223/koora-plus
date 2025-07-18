import React from "react";

function getEventMinute(event) {
  let min = Number(event.time.elapsed) || 0;
  if (event.time.extra) min += Number(event.time.extra);
  return min;
}

const getEventColor = (event) => {
  if (event.type === "Goal") return "bg-green-700 text-white border-green-600";
  if (event.type === "Card" && event.detail === "Yellow Card") return "bg-yellow-400 text-black border-yellow-500";
  if (event.type === "Card" && event.detail === "Red Card") return "bg-red-600 text-white border-red-800";
  if (event.type === "subst") return "bg-gray-700 text-white border-gray-500";
  return "bg-[#23272f] text-white border-gray-600";
};

const MatchDetails = ({ fixture, events, loading, error }) => {
  if (!fixture) return null;
  const matchEvents = (events || []).slice();
  matchEvents.sort((a, b) => getEventMinute(a) - getEventMinute(b));

  // Group events by team
  const homeTeam = fixture.teams?.home;
  // All events from both teams, sorted by time
  const allEvents = matchEvents.slice().sort((a, b) => getEventMinute(a) - getEventMinute(b));

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#181818] p-6 rounded-lg border border-[#e63946] text-white text-sm" dir="rtl">
      {/* Loading/Error */}
      {loading && <div className="text-center text-gray-400 py-4">جاري تحميل الأحداث...</div>}
      {error && <div className="text-center text-red-400 py-4">{error}</div>}
      {/* Events Columns */}
      {!loading && !error && (
        <>
          {/* Unified Timeline */}
          <div className="flex flex-col gap-2 items-center mb-8 w-full">
            {allEvents.length === 0 && <span className="text-xs text-gray-400">لا يوجد أحداث</span>}
            {allEvents.map((event, idx) => (
              <div key={idx} className="flex w-full max-w-2xl">
                {/* Home event (right) */}
                {event.team?.id === homeTeam?.id ? (
                  <>
                    <div className={`flex-1 flex justify-end`}>
                      <div className={`min-w-[120px] max-w-xs border rounded-md px-3 py-1 mb-1 text-sm flex flex-col items-end ${getEventColor(event)}`}>
                        <span className="font-bold">{event.player?.name}</span>
                        {event.assist?.name && (
                          <span className="text-xs text-red-200">{event.type === 'subst' ? `↓ ${event.assist.name}` : `صناعة: ${event.assist.name}`}</span>
                        )}
                        <span className={`text-xs ${event.type === 'Card' && event.detail === 'Yellow Card' ? 'text-black' : 'text-gray-300'}`}>{event.time.elapsed}{event.time.extra ? `+${event.time.extra}` : ""}'</span>
                      </div>
                    </div>
                    <div className="flex-1" /> {/* Empty left side */}
                  </>
                ) : (
                  <>
                    <div className="flex-1" /> {/* Empty right side */}
                    <div className={`flex-1 flex justify-start`}>
                      <div className={`min-w-[120px] max-w-xs border rounded-md px-3 py-1 mb-1 text-sm flex flex-col items-start ${getEventColor(event)}`}>
                        <span className="font-bold">{event.player?.name}</span>
                        {event.assist?.name && (
                          <span className="text-xs text-red-200">{event.type === 'subst' ? `↓ ${event.assist.name}` : `صناعة: ${event.assist.name}`}</span>
                        )}
                        <span className={`text-xs ${event.type === 'Card' && event.detail === 'Yellow Card' ? 'text-black' : 'text-gray-300'}`}>{event.time.elapsed}{event.time.extra ? `+${event.time.extra}` : ""}'</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {/* Match Info Section */}
      <div className="text-center mt-6 text-sm text-gray-300">
        <div>(انتهت)</div>
        <div>{fixture.fixture?.date && new Date(fixture.fixture.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} م</div>
        <div>{fixture.fixture?.venue?.name && `🏟️ ${fixture.fixture.venue.name}`}</div>
        <div>{fixture.league?.round}</div>
        <div>{fixture.league?.name}</div>
      </div>
    </div>
  );
};

export default MatchDetails;
