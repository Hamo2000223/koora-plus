import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MatchDetails from "../components/MatchDetails";
import LineupView from "../components/MatchDetails/LineupView";
import { useFootballStore } from "../store/football";

const TabButton = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 rounded-t-lg font-bold text-sm md:text-base transition border-b-2 ${active ? "border-[#e63946] text-[#e63946] bg-[#23272f]" : "border-transparent text-gray-300 bg-transparent hover:bg-[#23272f]"}`}
    onClick={onClick}
  >
    {children}
  </button>
);

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
  const [hasFetchedDetails, setHasFetchedDetails] = useState(false);

  // Fetch fixture details - only once when id changes
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      await fetchFixtures({ id });
    };
    fetchData();
  }, [id, fetchFixtures]);

  // Set fixture from store and fetch additional data - only once when fixture is found
  useEffect(() => {
    if (!fixtures?.response || hasFetchedDetails) return;
    
    const found = fixtures.response.find(f => String(f.fixture.id) === String(id));
    if (found) {
      setFixture(found);
      setHasFetchedDetails(true);
      
      // Fetch additional data only once
      fetchFixtureEvents(found.fixture.id);
      fetchLineups(found.fixture.id);
    }
  }, [fixtures, id, fetchFixtureEvents, fetchLineups, hasFetchedDetails]);

  // Reset fetch flag when id changes
  useEffect(() => {
    setHasFetchedDetails(false);
    setFixture(null);
  }, [id]);

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
        <div className="flex justify-center border-b border-[#444] mb-4">
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