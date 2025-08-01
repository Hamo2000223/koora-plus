import React, { useCallback, useEffect } from "react";
import { useFootballStore } from "../../store/football.js";
import InlineFieldView from "./InlineFieldView";

const LineupView = ({ lineup }) => {
  const { playerProfiles, fixtureEvents, fetchFixtureEvents, fetchPlayerProfile } = useFootballStore();

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

  // Fetch missing substitute player photos (like startXI) - only run once when lineup changes
  useEffect(() => {
    if (!lineup || lineup.length === 0) return;
    
    const idsToFetch = [];
    lineup.forEach(team => {
      if (team.substitutes) {
        team.substitutes.forEach(p => {
          if (
            !p.player.photo &&
            p.player.id &&
            (!playerProfiles || !playerProfiles[p.player.id] || (!playerProfiles[p.player.id].profile && !playerProfiles[p.player.id].loading))
          ) {
            idsToFetch.push(p.player.id);
          }
        });
      }
    });
    
    // Fetch all missing player profiles at once
    idsToFetch.forEach(id => {
      fetchPlayerProfile(id);
    });
  }, [lineup, fetchPlayerProfile, playerProfiles]); // Added playerProfiles back since we need to check it

  // Helper to get events for a specific player in this match
  const getPlayerEvents = useCallback((playerId, fixtureId) => {
    if (!playerId || !fixtureId) return [];
    const key = `${fixtureId}-${playerId}`;
    if (!fixtureEvents || !fixtureEvents[key] || !fixtureEvents[key].events) {
      return [];
    }
    return fixtureEvents[key].events;
  }, [fixtureEvents]);

  // Helper to render event icon based on event type
  const renderEventIcon = useCallback((event) => {
    if (!event) return null;
    
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
  }, []);

  if (!lineup || lineup.length === 0) return <div className="text-center text-gray-400">التشكيلة غير متوفرة</div>;
  
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-start w-full" dir="rtl">
      {lineup.map((team, idx) => (
        <div
          key={team.team?.id || idx}
          className="flex-1 bg-[#1e1e1e] rounded-xl p-5 border border-[#333] shadow-md w-full transition hover:shadow-lg"
        >
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Field visualization */}
            <InlineFieldView startXI={team.startXI} formation={team.formation} />

            {/* Coach Section */}
            {team.coach && (
              <div className="flex items-center justify-between gap-2 w-full bg-[#2a2f38] rounded-lg px-5 py-3 border border-[#3a3f48]" dir="rtl">
                <div className="w-14 h-14 rounded-full border border-white overflow-hidden bg-gray-300 flex items-center justify-center mr-4">
                  {team.coach.photo ? (
                    <img
                      src={team.coach.photo}
                      alt={team.coach.name}
                      className="w-full h-full object-cover"
                      onError={e => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <img src="/default-player.svg" alt="Default Player" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">المدرب</span>
                  <span className="text-white text-sm font-semibold">{team.coach.name}</span>
                </div>
              </div>
            )}

            {/* Substitutes Section */}
            <div className="w-full" dir="rtl">
              <h3 className="text-[#e63946] font-semibold text-sm mb-2">البدلاء</h3>
              {team.substitutes && team.substitutes.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {team.substitutes.map((p, i) => {
                    let photo = p.player.photo;
                    if (!photo && p.player.id && playerProfiles && playerProfiles[p.player.id]?.profile?.photo) {
                      photo = playerProfiles[p.player.id].profile.photo;
                    }
                    // Get player events for this specific match using the new key format
                    const playerEvents = getPlayerEvents(p.player.id, team.fixture?.id);
                    return (
                      <div
                        key={p.player.id || p.player.name || i}
                        className="flex items-center justify-between bg-[#181818] px-4 py-2 rounded-lg border border-[#2a2a2a]"
                        dir="rtl"
                      >
                        <div className="w-10 h-10 rounded-full border border-white overflow-hidden bg-gray-300 flex items-center justify-center mr-4">
                          {photo ? (
                            <img
                              src={photo}
                              alt={p.player.name}
                              className="w-full h-full object-cover"
                              onError={e => (e.target.style.display = 'none')}
                            />
                          ) : (
                            <img src="/default-player.svg" alt="Default Player" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex flex-col items-end flex-1 mr-3">
                          <div className="flex items-center gap-2 mb-1">
                            {/* Show real events from API */}
                            {playerEvents.map((event, eventIdx) => (
                              <span key={eventIdx} className="mx-0.5">
                                {renderEventIcon(event)}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-white font-medium">{p.player.name || 'Unknown'}</span>
                            <span className="text-gray-400">{p.player.number}</span>
                            <span className="text-gray-400">({p.player.pos})</span>
                          </div>
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

export default LineupView; 