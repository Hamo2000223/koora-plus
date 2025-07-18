import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MatchDetails from "../components/MatchDetails";
import { useFootballStore } from "../store/football";

const TabButton = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 rounded-t-lg font-bold text-sm md:text-base transition border-b-2 ${active ? "border-[#e63946] text-[#e63946] bg-[#23272f]" : "border-transparent text-gray-300 bg-transparent hover:bg-[#23272f]"}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Add DefaultPlayerIcon component
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

// Add InlineFieldView component for visualizing startXI on a football field
const InlineFieldView = ({ startXI, formation }) => {
  const { players, fetchPlayerProfile } = useFootballStore();

  useEffect(() => {
    if (!startXI) return;
    let idsToFetch = [];
    for (const p of startXI) {
      if (
        !p.player.photo &&
        p.player.id &&
        (!players[p.player.id] || (!players[p.player.id].profile && !players[p.player.id].loading))
      ) {
        idsToFetch.push(p.player.id);
      }
    }
    if (idsToFetch.length > 0) {
      idsToFetch.forEach((id) => {
        fetchPlayerProfile(id);
      });
    }
    // eslint-disable-next-line
  }, [startXI, formation]);

  if (!startXI || startXI.length === 0) return null;
  let formationArr = [];
  if (formation && /^\d+(?:-\d+)+$/.test(formation)) {
    formationArr = formation.split('-').map(Number);
  }
  const gk = startXI.filter(p => p.player.pos === 'G');
  let outfield = startXI.filter(p => p.player.pos !== 'G');
  let lines = [];
  if (formationArr.length > 0 && outfield.length === formationArr.reduce((a, b) => a + b, 0)) {
    let idx = 0;
    lines = [gk];
    for (let n of formationArr) {
      lines.push(outfield.slice(idx, idx + n));
      idx += n;
    }
  } else {
    const byPos = { DEF: [], MID: [], ATT: [] };
    outfield.forEach(p => {
      if (p.player.pos === 'D') byPos.DEF.push(p);
      else if (p.player.pos === 'M') byPos.MID.push(p);
      else if (p.player.pos === 'F') byPos.ATT.push(p);
      else byPos.MID.push(p);
    });
    lines = [gk, byPos.DEF, byPos.MID, byPos.ATT];
  }

  return (
    <div className="w-full flex flex-col items-center mb-2">
      <div className="relative w-full max-w-lg aspect-[2/3] bg-green-900 rounded-xl border-4 border-white overflow-hidden shadow-2xl mx-auto" style={{background: 'url("/field-texture.png"), linear-gradient(160deg, #3a7d3a 0%, #1e3d1e 100%)', backgroundSize: 'cover'}}>
        {/* Center line, circle, penalty boxes, etc. as before */}
        <div className="absolute left-1/2 top-0 h-full w-1 bg-white/60 z-10" style={{transform: 'translateX(-50%)'}} />
        <div className="absolute left-1/2 top-1/2 w-24 h-24 border-4 border-white/80 rounded-full z-10" style={{transform: 'translate(-50%,-50%)'}} />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-48 h-16 border-4 border-white/80 rounded-b-2xl z-10" style={{borderTop:0}} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-48 h-16 border-4 border-white/80 rounded-t-2xl z-10" style={{borderBottom:0}} />
        {/* Players */}
        <div className="relative z-20 flex flex-col justify-between h-full w-full py-6">
          {lines.map((line, i) => (
            
            <div key={i} className="flex justify-center gap-8 mb-4 last:mb-0 first:mt-4">
              {line.map((p, j) => {
                let photo = p.player.photo;
                if (!photo && p.player.id && players[p.player.id]?.profile?.photo) {
                  photo = players[p.player.id].profile.photo;
                }
                if (!photo) photo = '/default-player.png';
                return (
                  <div key={p.player.id || p.player.name || j} className="flex flex-col items-center relative group">
                    
                    {/* Player photo */}
                    <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden bg-gray-300 flex items-center justify-center">
                      {photo && photo !== '/default-player.png' ? (
                        <img src={photo} alt={p.player.name} className="w-full h-full object-cover" />
                      ) : (
                        <DefaultPlayerIcon />
                      )}
                    </div>
                    {/* Player number and name */}
                    <span className="text-xs text-white font-bold mt-1 drop-shadow text-center">{p.player.number} {p.player.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LineupView = ({ lineup }) => {
  const { players, fixtureEvents, fetchFixtureEvents } = useFootballStore();

  // Fetch player-specific events for substitutes
  useEffect(() => {
    if (!lineup || lineup.length === 0) return;
    lineup.forEach(team => {
      if (team.substitutes && team.fixture?.id) {
        team.substitutes.forEach(player => {
          if (player.player.id) {
            fetchFixtureEvents(team.fixture.id, player.player.id);
          }
        });
      }
    });
  }, [lineup, fetchFixtureEvents]);

  // Helper to get events for a specific player in this match
  const getPlayerEvents = (playerId, fixtureId) => {
    const key = `${fixtureId}-${playerId}`;
    if (!fixtureEvents || !fixtureEvents[key] || !fixtureEvents[key].events) {
      return [];
    }
    return fixtureEvents[key].events;
  };

  // Helper to render event icon based on event type
  const renderEventIcon = (event) => {
    switch (event.type) {
      case 'Goal':
        return <span className="text-green-400 text-sm" title="هدف">⚽</span>;
      case 'Card':
        if (event.detail === 'Yellow Card') {
          return <span className="text-yellow-400 text-sm" title="بطاقة صفراء">🟨</span>;
        } else if (event.detail === 'Red Card') {
          return <span className="text-red-600 text-sm" title="بطاقة حمراء">🟥</span>;
        }
        return <span className="text-gray-400 text-sm" title="بطاقة">🟨</span>;
      case 'subst':
        return event.player?.id ? 
          <span className="text-green-500 text-sm" title="دخول">↑</span> : 
          <span className="text-red-500 text-sm" title="خروج">↓</span>;
      default:
        return null;
    }
  };

  if (!lineup || lineup.length === 0) return <div className="text-center text-gray-400">التشكيلة غير متوفرة</div>;
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-start w-full">
      {lineup.map((team, idx) => (
        <div
          key={team.team.id || idx}
          className="flex-1 bg-[#1e1e1e] rounded-xl p-5 border border-[#333] shadow-md w-full transition hover:shadow-lg"
        >
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Field visualization */}
            <InlineFieldView startXI={team.startXI} formation={team.formation} />

            {/* Coach Section */}
            {team.coach && (
              <div className="flex items-center justify-end gap-2 w-full bg-[#2a2f38] rounded-lg px-5 py-3 border border-[#3a3f48]">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">المدرب</span>
                  <span className="text-white text-sm font-semibold">{team.coach.name}</span>
                </div>
                <div className="w-14 h-14 rounded-full border border-white overflow-hidden bg-gray-300 flex items-center justify-center">
                  {team.coach.photo ? (
                    <img
                      src={team.coach.photo}
                      alt={team.coach.name}
                      className="w-full h-full object-cover"
                      onError={e => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <DefaultPlayerIcon />
                  )}
                </div>
              </div>
            )}

            {/* Substitutes Section */}
            <div className="w-full">
              <h3 className="text-[#e63946] font-semibold text-sm mb-2">البدلاء</h3>
              {team.substitutes && team.substitutes.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {team.substitutes.map((p, i) => {
                    let photo = p.player.photo;
                    if (!photo && p.player.id && players?.[p.player.id]?.profile?.photo) {
                      photo = players[p.player.id].profile.photo;
                    }
                    const rating = p.rating || 6.5;
                    
                    // Get player events for this specific match using the new key format
                    const playerEvents = getPlayerEvents(p.player.id, team.fixture?.id);
                    
                    return (
                      <div
                        key={p.player.id || p.player.name || i}
                        className="flex items-center justify-between bg-[#181818] px-4 py-2 rounded-lg border border-[#2a2a2a]"
                      >
                        <div className="flex flex-col items-end flex-1 mr-3">
                          <div className="flex items-center gap-2 mb-1">
                            {/* Show real events from API */}
                            {playerEvents.map((event, eventIdx) => (
                              <span key={eventIdx} className="mx-0.5">
                                {renderEventIcon(event)}
                              </span>
                            ))}
                            <span className="bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded border border-yellow-700">
                              {rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-white font-medium">{p.player.name}</span>
                            <span className="text-gray-400">{p.player.number}</span>
                            <span className="text-gray-400">({p.player.pos})</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white overflow-hidden bg-gray-300 flex items-center justify-center ml-4">
                          {photo ? (
                            <img
                              src={photo}
                              alt={p.player.name}
                              className="w-full h-full object-cover"
                              onError={e => (e.target.style.display = 'none')}
                            />
                          ) : (
                            <DefaultPlayerIcon />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-500">غير متوفرة</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TeamLineupTabs = ({ lineup }) => {
  const [selected, setSelected] = React.useState(0);

  if (!lineup || lineup.length === 0)
    return <div className="text-center text-gray-400">التشكيلة غير متوفرة</div>;

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
        {/* Left Team */}
        <button
          onClick={() => setSelected(0)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 transition ${selected === 0
              ? "bg-gray-600 text-white font-semibold"
              : "bg-gray-500 text-gray-200"
            }`}
        >
          <span className="text-sm md:text-base">{lineup[0].formation}</span>
          <img
            src={lineup[0].team.logo}
            alt={lineup[0].team.name}
            className="w-7 h-7 object-contain"
          />
        </button>

        {/* Right Team */}
        <button
          onClick={() => setSelected(1)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 transition ${selected === 1
              ? "bg-gray-600 text-white font-semibold"
              : "bg-gray-500 text-gray-200"
            }`}
        >
          <span className="text-sm md:text-base">{lineup[1].formation}</span>
          <img
            src={lineup[1].team.logo}
            alt={lineup[1].team.name}
            className="w-7 h-7 object-contain"
          />
        </button>
      </div>

      <div className="mt-4 w-full">
        <LineupView lineup={[lineup[selected]]} />
      </div>
    </div>
  );
};


const MatchDetailsPage = () => {
  const { id } = useParams();
  const {
    fixtures,
    fetchFixtures,
    fetchFixtureEvents,
    fixtureEvents,
    fetchLineups,
    lineups
  } = useFootballStore();
  const [tab, setTab] = useState("details");
  const [fixture, setFixture] = useState(null);

  // Fetch fixture details
  useEffect(() => {
    const fetchData = async () => {
      await fetchFixtures({ id });
    };
    fetchData();
  }, [id, fetchFixtures]);

  // Set fixture from store
  useEffect(() => {
    if (fixtures?.response) {
      const found = fixtures.response.find(f => String(f.fixture.id) === String(id));
      setFixture(found || null);
      if (found) {
        fetchFixtureEvents(found.fixture.id);
        fetchLineups(found.fixture.id);
      }
    }
  }, [fixtures, id, fetchFixtureEvents, fetchLineups]);

  // Get events and lineups
  const eventsData = fixture ? fixtureEvents[fixture.fixture.id] : null;
  const events = eventsData?.events;
  const eventsLoading = eventsData?.loading;
  const eventsError = eventsData?.error;

  const lineupData = fixture ? lineups?.[fixture.fixture.id] : null;
  const lineup = lineupData?.lineup;
  const lineupLoading = lineupData?.loading;
  const lineupError = lineupData?.error;

  // League info
  const league = fixture?.league;
  const home = fixture?.teams?.home;
  const away = fixture?.teams?.away;
  const status = fixture?.fixture?.status?.long;
  const score = fixture?.goals;

  return (
    <div className="min-h-screen bg-[#181818] text-white font-sans flex flex-col items-center py-6 px-2" dir="rtl">
      <div className="w-full max-w-3xl bg-[#23272f] rounded-xl shadow-lg p-4 mb-6">
        {/* Top: Match result, teams, status, league */}
        {fixture ? (
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
        ) : (
          <div className="text-center text-gray-400">جاري تحميل بيانات المباراة...</div>
        )}
      </div>
      {/* Tabs */}
      <div className="w-full max-w-3xl">
        <div className="flex border-b border-[#444] mb-4">
          <TabButton active={tab === "details"} onClick={() => setTab("details")}>تفاصيل المباراة</TabButton>
          <TabButton active={tab === "lineup"} onClick={() => setTab("lineup")}>التشكيلة</TabButton>
        </div>
        {/* Tab content */}
        <div className="bg-[#23272f] rounded-b-xl p-4 min-h-[200px]">
          {tab === "details" && (
            <>
              {eventsLoading ? (
                <div className="text-center text-gray-400">جاري تحميل الأحداث...</div>
              ) : eventsError ? (
                <div className="text-center text-red-400">{eventsError}</div>
              ) : events && events.length > 0 ? (
                <MatchDetails fixture={fixture} events={events} />
              ) : (
                <div className="text-center text-gray-400">الأحداث غير متوفرة</div>
              )}
            </>
          )}
          {tab === "lineup" && (
            <>
              {lineupLoading ? (
                <div className="text-center text-gray-400">جاري تحميل التشكيلة...</div>
              ) : lineupError ? (
                <div className="text-center text-red-400">{lineupError}</div>
              ) : lineup && lineup.length > 1 ? (
                <TeamLineupTabs lineup={lineup} />
              ) : lineup && lineup.length > 0 ? (
                <TeamLineupTabs lineup={lineup} />
              ) : (
                <div className="text-center text-gray-400">التشكيلة غير متوفرة</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsPage; 