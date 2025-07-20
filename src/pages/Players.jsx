import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
import { useFootballStore } from "../store/football.js";

const PAGE_SIZE = 12;

const Players = () => {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedTeamForStats, setSelectedTeamForStats] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const {
    countries,
    teams,
    teamPlayers,
    playersSearch,
    playersSearchLoading,
    playerProfiles,
    fetchCountries,
    fetchTeams,
    searchPlayers,
    fetchPlayerProfile,
    fetchPlayerStats,
    fetchPlayerSeasons,
    countriesLoading,
    teamsLoading,
    playerStats,
    playerSeasons,
  } = useFootballStore();

  const [filteredTeams, setFilteredTeams] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Fetch teams when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchTeams({ country: selectedCountry });
      setSelectedTeam(""); // Reset team selection
    } else {
      setFilteredTeams([]);
    }
  }, [selectedCountry, fetchTeams]);

  // Fetch players when team changes
  useEffect(() => {
    if (selectedTeam) {
      setPlayersLoading(true);
      const { fetchTeamPlayers } = useFootballStore.getState();
      console.log('Fetching team players:', selectedTeam);
      fetchTeamPlayers(selectedTeam).finally(() => {
        setPlayersLoading(false);
      });
    }
  }, [selectedTeam]);

  // Filter teams based on country
  useEffect(() => {
    if (teams?.response) {
      setFilteredTeams(teams.response);
    }
  }, [teams]);

  // Handle search functionality
  useEffect(() => {
    if (search.trim().length >= 3) {
      setSearchMode(true);
      searchPlayers(search.trim());
    } else if (search.trim().length === 0) {
      setSearchMode(false);
      // Reset to team-based players
      const teamKey = selectedTeam?.toString();
      const teamData = teamPlayers[teamKey];
      
      if (teamData?.players && teamData.players.length > 0) {
        // The /players/squads endpoint returns a simple array of player objects
        const playersArray = teamData.players.map(player => ({
          id: player.id,
          name: player.name,
          photo: player.photo,
          position: player.position,
          age: player.age,
          nationality: player.nationality,
          number: player.number,
          birth: player.birth,
          height: player.height,
          weight: player.weight,
        }));
        setFilteredPlayers(playersArray);
        setVisibleCount(PAGE_SIZE);
      } else {
        setFilteredPlayers([]);
      }
    }
  }, [search, selectedTeam, teamPlayers, searchPlayers]);

  // Filter team players when not in search mode
  useEffect(() => {
    if (!searchMode && selectedTeam) {
      const teamKey = selectedTeam.toString();
      const teamData = teamPlayers[teamKey];
      
      if (teamData?.players && teamData.players.length > 0) {
        // The /players/squads endpoint returns a simple array of player objects
        const playersArray = teamData.players.map(player => ({
          id: player.id,
          name: player.name,
          photo: player.photo,
          position: player.position,
          age: player.age,
          nationality: player.nationality,
          number: player.number,
          birth: player.birth,
          height: player.height,
          weight: player.weight,
        }));
        setFilteredPlayers(playersArray);
        setVisibleCount(PAGE_SIZE);
      } else {
        setFilteredPlayers([]);
      }
    }
  }, [teamPlayers, selectedTeam, searchMode]);

  // Update filtered players from search results
  useEffect(() => {
    if (searchMode && playersSearch?.response) {
      // Extract player data from the nested structure
      const players = playersSearch.response.map(item => item.player);
      setFilteredPlayers(players);
      setVisibleCount(PAGE_SIZE);
    }
  }, [playersSearch, searchMode]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const handlePlayerClick = async (player) => {
    setSelectedPlayer(player);
    setShowProfile(true);
    setSelectedSeason(""); // Reset season selection
    setSelectedTeamForStats(""); // Reset team selection
    
    // For searched players, we already have detailed profile data
    // For team players, we need to fetch additional profile data
    if (searchMode) {
      // Searched players already have detailed data from /players/profiles
      await fetchPlayerSeasons(player.id);
      await fetchPlayerStats(player.id);
    } else {
      // Team players need to fetch detailed profile data
      await fetchPlayerProfile(player.id);
      await fetchPlayerSeasons(player.id);
      await fetchPlayerStats(player.id);
    }
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedPlayer(null);
  };

  const getPlayerStats = (playerId, season = null, teamId = null) => {
    const key = `${playerId}-${season}-${teamId}`;
    return playerStats[key]?.stats;
  };

  const getPlayerSeasons = (playerId) => {
    return playerSeasons[playerId]?.seasons;
  };

  const handleSeasonChange = async (season) => {
    setSelectedSeason(season);
    if (selectedPlayer && season) {
      await fetchPlayerStats(selectedPlayer.id, season, selectedTeamForStats);
    }
  };

  // Show loading component for initial data loading
  if (countriesLoading && !countries) {
    return <LoadingComponent />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
      <main className="flex-1 flex flex-col items-center px-2 xs:px-4 py-4 xs:py-8">
        <section className="w-full max-w-7xl">
          {/* Header */}
          <div className="rounded-2xl bg-[#23272f] shadow-md p-3 xs:p-6 md:p-8 flex flex-col gap-2 xs:gap-4 border-2 border-[#0a2342] mb-6">
            <h2 className="text-xl xs:text-2xl font-bold mb-1 xs:mb-2 text-right" style={{color: '#e63946'}}>
              اللاعبين
            </h2>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">الدولة</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  disabled={countriesLoading}
                >
                  <option value="">اختر الدولة</option>
                  {countries?.response?.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">الفريق</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  disabled={!selectedCountry || teamsLoading}
                >
                  <option value="">اختر الفريق</option>
                  {filteredTeams.map((team) => (
                    <option key={team.team.id} value={team.team.id}>
                      {team.team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">
                  {searchMode ? "البحث العام" : "البحث في الفريق"}
                </label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="w-full rounded-lg px-4 py-2 pr-10 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                    placeholder={searchMode ? "ابحث في جميع اللاعبين..." : "ابحث في فريق محدد..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    dir="rtl"
                  />
                </div>
                {searchMode && (
                  <p className="text-xs text-gray-400">
                    البحث العام: اكتب 3 أحرف أو أكثر للبحث في جميع اللاعبين مع معلومات مفصلة
                  </p>
                )}
                {!searchMode && selectedTeam && (
                  <p className="text-xs text-gray-400">
                    عرض لاعبين الفريق المحدد مع معلومات أساسية
                  </p>
                )}
              </div>
            </div>
          </div>





          {/* Loading State */}
          {(playersLoading || playersSearchLoading) ? (
            <LoadingComponent />
          ) : (
            <>


              {/* Players Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredPlayers.slice(0, visibleCount).map((player) => (
                  <div
                    key={`player-${player?.id || Math.random()}`}
                    className="flex flex-col items-center bg-white rounded-xl p-4 border border-[#333] shadow hover:shadow-lg transition cursor-pointer hover:scale-105"
                    onClick={() => handlePlayerClick(player)}
                  >
                    <img 
                      src={player?.photo || "/default-player.svg"} 
                      alt={player?.name || "Player"} 
                      className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = "/default-player.svg";
                      }}
                    />
                    <span className="text-center font-bold text-sm text-gray-900 mt-1 line-clamp-2">
                      {player?.name || "غير محدد"}
                    </span>
                    <span className="text-center text-xs text-gray-500 mt-1">
                      {player?.position || "غير محدد"}
                    </span>
                    {player?.age && (
                      <span className="text-center text-xs text-gray-400 mt-1">
                        العمر: {player.age}
                      </span>
                    )}
                    {/* Show nationality for searched players, team name for team players */}
                    {searchMode ? (
                      player?.nationality && (
                        <span className="text-center text-xs text-gray-400 mt-1">
                          {player.nationality}
                        </span>
                      )
                    ) : (
                      player?.number && (
                        <span className="text-center text-xs text-gray-400 mt-1">
                          الرقم: {player.number}
                        </span>
                      )
                    )}
                  </div>
                ))}
                {filteredPlayers.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-8">
                    {searchMode ? 
                      (search.trim().length >= 3 ? "لا توجد لاعبين مطابقين للبحث" : "اكتب 3 أحرف أو أكثر للبحث") :
                      (selectedTeam ? "لا توجد لاعبين مطابقين" : "اختر فريق لعرض اللاعبين")
                    }
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredPlayers.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="bg-[#e63946] text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-[#c72c41] transition"
                  >
                    عرض المزيد
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Player Profile Modal */}
      {showProfile && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#23272f] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">ملف اللاعب</h3>
                <button
                  onClick={closeProfile}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Player Info */}
                <div className="flex flex-col items-center md:items-start">
                  <img 
                    src={selectedPlayer.photo || "/default-player.svg"} 
                    alt={selectedPlayer.name} 
                    className="w-32 h-32 object-cover rounded-full border-4 border-[#e63946] mb-4"
                    onError={(e) => {
                      e.target.src = "/default-player.svg";
                    }}
                  />
                  <h4 className="text-lg font-bold text-white mb-2">{selectedPlayer.name}</h4>
                  
                  {/* Basic Info - Available for both types */}
                  <p className="text-gray-300 text-sm mb-1">
                    العمر: {selectedPlayer.age || "غير محدد"}
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    المركز: {selectedPlayer.position || "غير محدد"}
                  </p>
                  
                  {/* Detailed Info - Only for searched players or fetched profiles */}
                  {(() => {
                    // For searched players, use the data directly
                    if (searchMode) {
                      return (
                        <>
                          {selectedPlayer.nationality && (
                            <p className="text-gray-300 text-sm mb-1">
                              الجنسية: {selectedPlayer.nationality}
                            </p>
                          )}
                          {selectedPlayer.height && (
                            <p className="text-gray-300 text-sm mb-1">
                              الطول: {selectedPlayer.height}
                            </p>
                          )}
                          {selectedPlayer.weight && (
                            <p className="text-gray-300 text-sm mb-1">
                              الوزن: {selectedPlayer.weight}
                            </p>
                          )}
                          {selectedPlayer.number && (
                            <p className="text-gray-300 text-sm mb-1">
                              الرقم: {selectedPlayer.number}
                            </p>
                          )}
                          {selectedPlayer.birth && (
                            <div className="text-gray-300 text-sm mb-1">
                              <p>تاريخ الميلاد: {selectedPlayer.birth.date}</p>
                              {selectedPlayer.birth.place && (
                                <p>مكان الميلاد: {selectedPlayer.birth.place}</p>
                              )}
                              {selectedPlayer.birth.country && (
                                <p>بلد الميلاد: {selectedPlayer.birth.country}</p>
                              )}
                            </div>
                          )}
                        </>
                      );
                    } else {
                      // For team players, check if we have fetched profile data
                      const profileData = playerProfiles[selectedPlayer.id]?.profile;
                      if (profileData) {
                        return (
                          <>
                            {profileData.nationality && (
                              <p className="text-gray-300 text-sm mb-1">
                                الجنسية: {profileData.nationality}
                              </p>
                            )}
                            {profileData.height && (
                              <p className="text-gray-300 text-sm mb-1">
                                الطول: {profileData.height}
                              </p>
                            )}
                            {profileData.weight && (
                              <p className="text-gray-300 text-sm mb-1">
                                الوزن: {profileData.weight}
                              </p>
                            )}
                            {selectedPlayer.number && (
                              <p className="text-gray-300 text-sm mb-1">
                                الرقم: {selectedPlayer.number}
                              </p>
                            )}
                            {profileData.birth && (
                              <div className="text-gray-300 text-sm mb-1">
                                <p>تاريخ الميلاد: {profileData.birth.date}</p>
                                {profileData.birth.place && (
                                  <p>مكان الميلاد: {profileData.birth.place}</p>
                                )}
                                {profileData.birth.country && (
                                  <p>بلد الميلاد: {profileData.birth.country}</p>
                                )}
                              </div>
                            )}
                          </>
                        );
                      } else {
                        // Show only basic info for team players without profile data
                        return (
                          <>
                            {selectedPlayer.number && (
                              <p className="text-gray-300 text-sm mb-1">
                                الرقم: {selectedPlayer.number}
                              </p>
                            )}
                            <p className="text-gray-300 text-xs italic">
                              جاري تحميل المزيد من المعلومات...
                            </p>
                          </>
                        );
                      }
                    }
                  })()}
                </div>

                {/* Player Statistics */}
                <div className="flex-1">
                  <div className="flex flex-col gap-4 mb-4">
                    <h5 className="text-lg font-bold text-white">الإحصائيات</h5>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4">
                      {/* Season Dropdown */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-300">الموسم:</label>
                        <select
                          value={selectedSeason}
                          onChange={(e) => handleSeasonChange(e.target.value)}
                          className="bg-[#181818] text-white text-sm px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#e63946]"
                        >
                          <option value="">اختر الموسم</option>
                          {(() => {
                            const seasons = getPlayerSeasons(selectedPlayer.id);
                            if (!seasons) return null;
                            return seasons.map((season) => (
                              <option key={season} value={season}>
                                {season}
                              </option>
                            ));
                          })()}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {(() => {
                    const stats = getPlayerStats(selectedPlayer.id, selectedSeason, selectedTeamForStats);
                    if (!stats || stats.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <p className="text-gray-400 mb-2">
                            {!selectedSeason ? "اختر موسم لعرض الإحصائيات" : 
                             !selectedTeamForStats ? "اختر فريق لعرض الإحصائيات" : 
                             "لا توجد إحصائيات متاحة لهذا الموسم والفريق"}
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-4">
                        {/* Team Info */}
                        {stats[0]?.team && (
                          <div className="bg-[#181818] p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <img 
                                src={stats[0].team.logo || "/default-team.svg"} 
                                alt={stats[0].team.name} 
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  e.target.src = "/default-team.svg";
                                }}
                              />
                              <span className="text-white font-medium">{stats[0].team.name}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Statistics by League/Competition */}
                        <div className="space-y-4">
                          {stats.map((stat, index) => (
                            <div key={index} className="bg-[#181818] p-4 rounded-lg">
                              {/* League Info */}
                              {stat.league && (
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                                  <img 
                                    src={stat.league.logo || "/default-team.svg"} 
                                    alt={stat.league.name} 
                                    className="w-6 h-6 object-contain"
                                    onError={(e) => {
                                      e.target.src = "/default-team.svg";
                                    }}
                                  />
                                  <span className="text-white font-medium text-sm">{stat.league.name}</span>
                                  {stat.league.country && stat.league.country !== "World" && (
                                    <span className="text-gray-400 text-xs">({stat.league.country})</span>
                                  )}
                                </div>
                              )}
                              
                              {/* Statistics Grid */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#0a0a0a] p-2 rounded">
                                  <p className="text-gray-400 text-xs">المباريات</p>
                                  <p className="text-white font-bold text-sm">{stat.games?.appearences || 0}</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-2 rounded">
                                  <p className="text-gray-400 text-xs">الأهداف</p>
                                  <p className="text-white font-bold text-sm">{stat.goals?.total || 0}</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-2 rounded">
                                  <p className="text-gray-400 text-xs">التمريرات الحاسمة</p>
                                  <p className="text-white font-bold text-sm">{stat.goals?.assists || 0}</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-2 rounded">
                                  <p className="text-gray-400 text-xs">البطاقات الصفراء</p>
                                  <p className="text-white font-bold text-sm">{stat.cards?.yellow || 0}</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-2 rounded">
                                  <p className="text-gray-400 text-xs">البطاقات الحمراء</p>
                                  <p className="text-white font-bold text-sm">{stat.cards?.red || 0}</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-2 rounded">
                                  <p className="text-gray-400 text-xs">دقائق اللعب</p>
                                  <p className="text-white font-bold text-sm">{stat.games?.minutes || 0}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players; 