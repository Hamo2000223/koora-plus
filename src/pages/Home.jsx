import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import LeagueHeader from "../components/LeagueHeader";
import MatchCard from "../components/MatchCard";
import { useFootballStore } from "../store/football";
import { useNewsStore } from "../store/news";

function groupFixturesByLeague(fixtures) {
  const grouped = {};
  fixtures.forEach(fixture => {
    const leagueId = fixture.league.id;
    if (!grouped[leagueId]) {
      grouped[leagueId] = {
        league: fixture.league,
        fixtures: [],
      };
    }
    grouped[leagueId].fixtures.push(fixture);
  });
  return Object.values(grouped);
}

const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};


const Home = () => {
  const { fixtures, fixturesLoading, fetchFixtures,  } = useFootballStore();
  const { articles, loading: newsLoading, fetchNews } = useNewsStore();
  const [selectedDate] = useState(getToday());
  const [showingLive] = useState(false);
  const navigate = useNavigate();

  const statsBarItems = [
    { icon: <span className="text-yellow-400">🏆</span>, text: 'أكثر من 50 دوري حول العالم' },
    { icon: <span className="text-green-400">⚽</span>, text: 'تحديث مباشر للمباريات' },
    { icon: <span className="text-pink-400">📊</span>, text: 'آلاف الإحصائيات الحصرية' },
    { icon: <span className="text-cyan-400">📰</span>, text: 'أحدث الأخبار الرياضية' },
    { icon: <span className="text-orange-400">👥</span>, text: 'ملايين المشجعين العرب' },
  ];

  useEffect(() => {
    fetchFixtures({ date: selectedDate });
  }, [fetchFixtures, selectedDate]);

  useEffect(() => {
    fetchNews(1, false);
  }, [fetchNews]);

  const groupedLeagues = fixtures?.response ? groupFixturesByLeague(fixtures.response) : [];

  // Filter for live matches if showingLive is true
  const filteredGroupedLeagues = showingLive
    ? groupedLeagues
        .map(group => ({
          ...group,
          fixtures: group.fixtures.filter(f =>
            ["1H", "2H", "LIVE"].includes(f.fixture.status.short)
          )
        }))
        .filter(group => group.fixtures.length > 0)
    : groupedLeagues;

  return (
    <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
      <main className="flex-1 flex flex-col items-center px-1 xs:px-2 md:px-4 py-4 xs:py-6 md:py-8 gap-4 xs:gap-6 md:gap-8">
        <HeroSection />
        
        {/* Stats Bar */}
        <section className="w-full max-w-7xl">
          <div className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 py-4 px-2 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="relative w-full overflow-hidden h-8 flex items-center justify-center">
              {statsBarItems.map((item, idx) => (
                <span 
                  key={idx} 
                  className="absolute flex items-center gap-2 text-white font-bold text-lg animate-stats-item"
                  style={{ 
                    animationDelay: `${idx * 6}s`,
                    animationDuration: '30s',
                    animationFillMode: 'both',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </div>
        </section>
        
        
        
        {/* رأس الدوري + قائمة المباريات */}
        <section className="w-full max-w-7xl">
          <div className="rounded-2xl bg-[#23272f] shadow-md p-2 xs:p-4 flex flex-col gap-3 xs:gap-4 border-2 border-[#0a2342]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl xs:text-2xl font-bold text-right" style={{color: '#e63946'}}>
                مباريات اليوم
              </h2>
              <button
                onClick={() => navigate('/matches')}
                className="px-4 py-2 rounded-lg bg-[#e63946] text-white font-bold hover:bg-[#c92d3b] transition text-sm"
              >
                عرض جميع المباريات
              </button>
            </div>
            {fixturesLoading && <div>جاري التحميل...</div>}
            {!fixturesLoading && filteredGroupedLeagues.length === 0 && <div>لا توجد مباريات اليوم</div>}
            {!fixturesLoading && filteredGroupedLeagues.slice(0, 3).map(group => (
              <div key={group.league.id} className="mb-4 xs:mb-6">
                <LeagueHeader league={group.league} />
                <div>
                  {group.fixtures.slice(0, 5).map(fixture => (
                    <React.Fragment key={fixture.fixture.id}>
                      <div onClick={() => navigate(`/match/${fixture.fixture.id}`)} className="cursor-pointer">
                        <MatchCard fixture={fixture} />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {!fixturesLoading && filteredGroupedLeagues.length > 3 && (
              <div className="text-center text-gray-400 py-4">
                عرض {filteredGroupedLeagues.slice(0, 3).reduce((acc, group) => acc + group.fixtures.slice(0, 5).length, 0)} من {filteredGroupedLeagues.reduce((acc, group) => acc + group.fixtures.length, 0)} مباراة
              </div>
            )}
          </div>
        </section>

        {/* News Section */}
        <section className="w-full max-w-7xl">
          <div className="rounded-2xl bg-[#23272f] shadow-md p-2 xs:p-4 flex flex-col gap-3 xs:gap-4 border-2 border-[#0a2342]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl xs:text-2xl font-bold text-right" style={{color: '#e63946'}}>
                آخر الأخبار
              </h2>
              <button
                onClick={() => navigate('/news')}
                className="px-4 py-2 rounded-lg bg-[#e63946] text-white font-bold hover:bg-[#c92d3b] transition text-sm"
              >
                المزيد من الأخبار
              </button>
            </div>
            
            {newsLoading && (
              <div className="text-center text-gray-400 py-8">جاري التحميل... / Loading...</div>
            )}
            
            {!newsLoading && articles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {articles.slice(0, 3).map((article, idx) => (
                  <div key={idx} className="flex flex-col bg-[#181818] rounded-xl shadow-lg border border-[#23272f] overflow-hidden hover:scale-[1.02] transition-transform duration-200">
                    <img
                      src={article.image || "/logo.svg"}
                      alt={article.title}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                      onError={e => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
                    />
                    <div className="flex flex-col flex-1 p-3 gap-2">
                      <h3 className="font-bold text-sm text-[#FFD700] text-right line-clamp-2">{article.title}</h3>
                      <p className="text-gray-300 text-xs text-right line-clamp-3">{article.description}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <span>{article.source?.name}</span>
                        <span>{new Date(article.publishedAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-2 text-blue-400 hover:underline text-xs text-left"
                      >
                        اقرأ المزيد
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!newsLoading && articles.length === 0 && (
              <div className="text-center text-gray-400 py-8">لا توجد أخبار متاحة حالياً / No news available.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 