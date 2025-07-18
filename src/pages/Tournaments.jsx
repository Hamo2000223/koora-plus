import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFootballStore } from "../store/football.js";

const PAGE_SIZE = 12;

const Tournaments = () => {
  const [search, setSearch] = useState("");
  const { leagues, fetchLeagues, loading } = useFootballStore();
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeagues();
  }, [fetchLeagues]);

  useEffect(() => {
    const leaguesArray = Array.isArray(leagues)
      ? leagues
      : Array.isArray(leagues?.response)
      ? leagues.response
      : [];
    const filtered = leaguesArray.filter(l =>
      l.league?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLeagues(filtered);
    setVisibleCount(PAGE_SIZE); // Reset visible count on new search
  }, [search, leagues]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
      <main className="flex-1 flex flex-col items-center px-2 xs:px-4 py-4 xs:py-8">
        <section className="w-full max-w-7xl">
          <div className="rounded-2xl bg-[#23272f] shadow-md p-3 xs:p-6 md:p-8 flex flex-col gap-2 xs:gap-4 border-2 border-[#0a2342] mb-6">
            <h2 className="text-xl xs:text-2xl font-bold mb-1 xs:mb-2 text-right" style={{color: '#e63946'}}>
              البطولات
            </h2>
            <input
              type="text"
              className="w-full rounded-lg px-4 py-2 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              placeholder="ابحث في البطولات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              dir="rtl"
            />
          </div>
          {loading ? (
            <div className="text-center text-gray-400 py-8">جاري تحميل البطولات...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filteredLeagues.slice(0, visibleCount).map((item) => (
                  <div
                    key={item.league.id}
                    className="flex flex-col items-center bg-white rounded-xl p-4 border border-[#333] shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate(`/tournament/${item.league.id}`, { state: { league: item.league, country: item.country, seasons: item.seasons } })}
                  >
                    <img src={item.league.logo} alt={item.league.name} className="w-20 h-20 object-contain mb-2" />
                    <span className="text-center font-bold text-base text-gray-900 mt-1">{item.league.name}</span>
                    {item.country?.name && (
                      <span className="text-center text-xs text-gray-500 mt-1">{item.country.name}</span>
                    )}
                  </div>
                ))}
                {filteredLeagues.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-8">لا توجد بطولات مطابقة</div>
                )}
              </div>
              {visibleCount < filteredLeagues.length && (
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
    </div>
  );
};

export default Tournaments; 