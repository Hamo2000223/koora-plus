import { MapPin, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
import { useFootballStore } from "../store/football.js";

const PAGE_SIZE = 12;

const Teams = () => {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("2024"); // Default to current season
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const {
    countries,
    leagues,
    teams,
    fetchCountries,
    fetchLeagues,
    fetchTeams,
    fetchTeamStats,
    fetchTeamPlayers,
    countriesLoading,
    leaguesLoading,
    teamsLoading,
    teamStats,
    teamPlayers,
  } = useFootballStore();

  const [filteredTeams, setFilteredTeams] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Fetch leagues when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchLeagues({ country: selectedCountry });
      setSelectedLeague(""); // Reset league selection
    } else {
      setFilteredLeagues([]);
    }
  }, [selectedCountry, fetchLeagues]);

  // Fetch teams when league or season changes
  useEffect(() => {
    if (selectedLeague && selectedSeason) {
      // Try different parameter approaches for the API
      const leagueData = filteredLeagues.find(league => league.league.id === parseInt(selectedLeague));
      if (leagueData) {
        // Use league ID and season as parameters
        fetchTeams({ league: selectedLeague, season: selectedSeason });
      } else {
        // Clear teams when no league or season is selected
        setFilteredTeams([]);
      }
    } else {
      // Clear teams when no league or season is selected
      setFilteredTeams([]);
    }
  }, [selectedLeague, selectedSeason, fetchTeams, filteredLeagues]);

  // Filter leagues based on country
  useEffect(() => {
    if (leagues?.response) {
      setFilteredLeagues(leagues.response);
    }
  }, [leagues]);

  // Filter teams based on search and update when teams data changes
  useEffect(() => {
    if (teams?.response) {
      let filtered = teams.response;
      
      // Apply search filter if search term exists
      if (search.trim()) {
        filtered = filtered.filter(team =>
          team.team?.name?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setFilteredTeams(filtered);
      setVisibleCount(PAGE_SIZE);
    } else {
      setFilteredTeams([]);
    }
  }, [search, teams]);

  // Handle search functionality
  useEffect(() => {
    if (search.trim().length >= 3) {
      // Search for teams by name
      fetchTeams({ search: search.trim() });
    } else if (search.trim().length === 0) {
      // Reset to league-based teams
      if (selectedLeague && selectedSeason) {
        fetchTeams({ league: selectedLeague, season: selectedSeason });
      } else {
        setFilteredTeams([]);
      }
    }
  }, [search, selectedLeague, selectedSeason, fetchTeams]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const handleTeamClick = async (team) => {
    setSelectedTeam(team);
    setShowProfile(true);
    
    // Fetch team stats and players with current league and season
    if (selectedLeague && selectedSeason) {
      await fetchTeamStats(team.team.id, selectedSeason, selectedLeague);
      await fetchTeamPlayers(team.team.id, selectedSeason);
    }
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedTeam(null);
  };

  const getTeamStats = (teamId) => {
    const key = `${teamId}-${selectedSeason}-${selectedLeague}`;
    return teamStats[key]?.stats;
  };

  const getTeamPlayers = (teamId) => {
    const key = `${teamId}-${selectedSeason}`;
    const playersData = teamPlayers[key]?.players;
    
    // Ensure we return an array and handle different data structures
    if (Array.isArray(playersData)) {
      return playersData;
    } else if (playersData && Array.isArray(playersData[0]?.players)) {
      // Handle nested structure like in team squads
      return playersData[0].players;
    }
    
    return [];
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
              الفرق
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

              {/* League Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">البطولة</label>
                <select
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  disabled={!selectedCountry || leaguesLoading}
                >
                  <option value="">اختر البطولة</option>
                  {filteredLeagues.map((league) => (
                    <option key={league.league.id} value={league.league.id}>
                      {league.league.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Season Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">الموسم</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  disabled={!selectedLeague || leaguesLoading}
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">البحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="w-full rounded-lg px-4 py-2 pr-10 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                    placeholder="ابحث عن فريق (3 أحرف أو أكثر)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    dir="rtl"
                  />
                </div>
                {search.trim().length > 0 && search.trim().length < 3 && (
                  <p className="text-xs text-gray-400">
                    اكتب 3 أحرف أو أكثر للبحث
                  </p>
                )}
                {search.trim().length >= 3 && (
                  <p className="text-xs text-green-400">
                    البحث العام: جاري البحث في جميع الفرق
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {teamsLoading ? (
            <LoadingComponent />
          ) : (
            <>
              
              {/* Teams Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredTeams.slice(0, visibleCount).map((item) => (
                  <div
                    key={item.team.id}
                    className="flex flex-col items-center bg-white rounded-xl p-4 border border-[#333] shadow hover:shadow-lg transition cursor-pointer hover:scale-105"
                    onClick={() => handleTeamClick(item)}
                  >
                    <img 
                      src={item.team.logo || "/default-team.svg"} 
                      alt={item.team.name} 
                      className="w-16 h-16 object-contain mb-2"
                      onError={(e) => {
                        e.target.src = "/default-team.svg";
                      }}
                    />
                    <span className="text-center font-bold text-sm text-gray-900 mt-1 line-clamp-2">
                      {item.team.name}
                    </span>
                    <span className="text-center text-xs text-gray-500 mt-1">
                      {item.team.country || "غير محدد"}
                    </span>
                    {item.team.founded && (
                      <span className="text-center text-xs text-gray-400 mt-1">
                        تأسس: {item.team.founded}
                      </span>
                    )}
                  </div>
                ))}
                {filteredTeams.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-8">
                    {search.trim().length >= 3 ? 
                      (teams?.response && teams.response.length === 0 ? 
                        "لا توجد فرق مطابقة للبحث" : 
                        "جاري البحث..."
                      ) : 
                      selectedLeague && selectedSeason ? 
                        (teams?.response && teams.response.length === 0 ? 
                          "لا توجد فرق في هذه البطولة لهذا الموسم" : 
                          "جاري تحميل الفرق..."
                        ) : 
                        selectedLeague ? 
                          "اختر الموسم لعرض الفرق" :
                          "اختر بطولة لعرض الفرق"
                    }
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredTeams.length && (
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

      {/* Team Profile Modal */}
      {showProfile && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#23272f] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">ملف الفريق</h3>
                <button
                  onClick={closeProfile}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Info */}
                <div className="flex flex-col items-center lg:items-start">
                  <img 
                    src={selectedTeam.team.logo || "/default-team.svg"} 
                    alt={selectedTeam.team.name} 
                    className="w-32 h-32 object-contain mb-4"
                    onError={(e) => {
                      e.target.src = "/default-team.svg";
                    }}
                  />
                  <h4 className="text-lg font-bold text-white mb-2">{selectedTeam.team.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-gray-300 text-sm">{selectedTeam.team.country || "غير محدد"}</span>
                  </div>
                  {selectedTeam.team.founded && (
                    <p className="text-gray-300 text-sm mb-2">
                      تأسس: {selectedTeam.team.founded}
                    </p>
                  )}
                  {selectedTeam.venue && (
                    <div className="text-gray-300 text-sm">
                      <p>الملعب: {selectedTeam.venue.name}</p>
                      <p>السعة: {selectedTeam.venue.capacity?.toLocaleString() || "غير محدد"}</p>
                      <p>المدينة: {selectedTeam.venue.city}</p>
                    </div>
                  )}
                </div>

                {/* Team Statistics */}
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-white mb-4">الإحصائيات</h5>
                  {(() => {
                    const stats = getTeamStats(selectedTeam.team.id);
                    if (!stats || stats.length === 0) {
                      return <p className="text-gray-400">لا توجد إحصائيات متاحة</p>;
                    }
                    
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#181818] p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">المباريات</p>
                          <p className="text-white font-bold">{stats.fixtures?.played?.total || 0}</p>
                        </div>
                        <div className="bg-[#181818] p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">الانتصارات</p>
                          <p className="text-white font-bold">{stats.fixtures?.wins?.total || 0}</p>
                        </div>
                        <div className="bg-[#181818] p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">التعادلات</p>
                          <p className="text-white font-bold">{stats.fixtures?.draws?.total || 0}</p>
                        </div>
                        <div className="bg-[#181818] p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">الخسائر</p>
                          <p className="text-white font-bold">{stats.fixtures?.loses?.total || 0}</p>
                        </div>
                        <div className="bg-[#181818] p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">الأهداف المسجلة</p>
                          <p className="text-white font-bold">{stats.goals?.for?.total?.total || 0}</p>
                        </div>
                        <div className="bg-[#181818] p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">الأهداف المستلمة</p>
                          <p className="text-white font-bold">{stats.goals?.against?.total?.total || 0}</p>
                        </div>
                        <div className="bg-[#181818] p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">النقاط النظيفة</p>
                          <p className="text-white font-bold">{stats.clean_sheet?.total || 0}</p>
                        </div>
                        <div className="bg-[#181818] p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">فشل في التسجيل</p>
                          <p className="text-white font-bold">{stats.failed_to_score?.total || 0}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Team Players */}
              <div className="mt-8">
                <h5 className="text-lg font-bold text-white mb-4">اللاعبين</h5>
                {(() => {
                  const players = getTeamPlayers(selectedTeam.team.id);
                  if (!players || players.length === 0) {
                    return <p className="text-gray-400">لا توجد بيانات لاعبين متاحة</p>;
                  }
                  
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {players.slice(0, 10).map((player) => {
                        // Add null checks for player data
                        if (!player || !player.player) {
                          return null;
                        }
                        
                        return (
                          <div key={player.player.id || Math.random()} className="flex flex-col items-center bg-[#181818] rounded-lg p-3">
                            <img 
                              src={player.player?.photo || "/default-player.svg"} 
                              alt={player.player?.name || "Player"} 
                              className="w-12 h-12 object-cover rounded-full mb-2"
                              onError={(e) => {
                                e.target.src = "/default-player.svg";
                              }}
                            />
                            <span className="text-center font-bold text-xs text-white line-clamp-2">
                              {player.player?.name || "Unknown Player"}
                            </span>
                            <span className="text-center text-xs text-gray-400 mt-1">
                              {player.statistics?.[0]?.games?.position || player.player?.position || "غير محدد"}
                            </span>
                          </div>
                        );
                      })}
                      {players.length > 10 && (
                        <div className="flex items-center justify-center bg-[#181818] rounded-lg p-3">
                          <span className="text-gray-400 text-sm">
                            +{players.length - 10} لاعب آخر
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams; 