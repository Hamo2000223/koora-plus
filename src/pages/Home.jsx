import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import LeagueHeader from "../components/LeagueHeader";
import MatchCard from "../components/MatchCard";
import TabsWithDate from "../components/Tabs";
import { useFootballStore } from "../store/football";

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

const getRelativeDate = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatDate = (date) => {
  // Accepts a Date object or a string
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const Home = () => {
  const { fixtures, fixturesLoading, fetchFixtures } = useFootballStore();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [activeTab, setActiveTab] = useState('today'); // 'yesterday', 'today', 'tomorrow', or null
  const [showingLive, setShowingLive] = useState(false);

  useEffect(() => {
    fetchFixtures({ date: selectedDate });
  }, [fetchFixtures, selectedDate]);

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

  // Live match count for today
  const liveMatchCount = groupedLeagues
    .reduce((acc, group) =>
      acc + group.fixtures.filter(f =>
        ["1H", "2H", "LIVE"].includes(f.fixture.status.short)
      ).length, 0
    );

  // Handlers for tab and date changes
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowingLive(false);
    if (tab === 'yesterday') setSelectedDate(getRelativeDate(-1));
    else if (tab === 'today') setSelectedDate(getToday());
    else if (tab === 'tomorrow') setSelectedDate(getRelativeDate(1));
  };
  const handleDateChange = (date) => {
    setSelectedDate(formatDate(date));
    setShowingLive(false);
  };
  const handleShowLive = () => setShowingLive(live => !live);

  return (
    <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
      <main className="flex-1 flex flex-col items-center px-1 xs:px-2 md:px-4 py-4 xs:py-6 md:py-8 gap-4 xs:gap-6 md:gap-8">
        <HeroSection />
        {/* تبويبات الأيام + اختيار التاريخ */}
        <section className="w-full max-w-5xl mb-1 xs:mb-2">
          <TabsWithDate
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            onShowLive={handleShowLive}
            showingLive={showingLive}
            liveMatchCount={liveMatchCount}
          />
        </section>
        {/* رأس الدوري + قائمة المباريات */}
        <section className="w-full max-w-5xl">
          <div className="rounded-2xl bg-[#23272f] shadow-md p-2 xs:p-4 flex flex-col gap-3 xs:gap-4 border-2 border-[#0a2342]">
            <h2 className="text-xl xs:text-2xl font-bold mb-1 xs:mb-2 text-right" style={{color: '#e63946'}}>
              مباريات اليوم
            </h2>
            {fixturesLoading && <div>جاري التحميل...</div>}
            {!fixturesLoading && filteredGroupedLeagues.length === 0 && <div>لا توجد مباريات اليوم</div>}
            {!fixturesLoading && filteredGroupedLeagues.map(group => (
              <div key={group.league.id} className="mb-4 xs:mb-6">
                <LeagueHeader league={group.league} />
                <div>
                  {group.fixtures.map(fixture => (
                    <MatchCard key={fixture.fixture.id} fixture={fixture} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 