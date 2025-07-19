import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFootballStore } from "../store/football";

const Standings = () => {
  const { leagueId, season } = useParams();
  const { standings, standingsLoading, standingsError, fetchStandings } = useFootballStore();

  useEffect(() => {
    if (leagueId && season) {
      fetchStandings({ league: leagueId, season });
    }
  }, [leagueId, season, fetchStandings]);

  // Extract standingsGroups from the store's standings response
  const standingsGroups = standings?.response?.[0]?.league?.standings || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <section className="w-full max-w-3xl">
          <h2 className="text-xl font-bold text-[#e63946] mb-6 text-center">جدول الترتيب</h2>
          {standingsLoading && <div className="text-center text-gray-400 py-8">جاري تحميل الترتيب...</div>}
          {standingsError && <div className="text-center text-red-400 py-8">{standingsError}</div>}
          {!standingsLoading && !standingsError && standingsGroups.length === 0 && (
            <div className="text-center text-gray-400 py-8">لا يوجد ترتيب متاح لهذا الموسم</div>
          )}
          {!standingsLoading && !standingsError && standingsGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-8">
              {group[0]?.group && (
                <h3 className="text-lg font-bold text-[#e63946] mb-2 text-center">{group[0].group}</h3>
              )}
              <table className="w-full bg-[#23272f] rounded-lg overflow-hidden mb-4">
                <thead>
                  <tr className="text-[#e63946]">
                    <th className="py-2">#</th>
                    <th className="py-2">الفريق</th>
                    <th className="py-2">لعب</th>
                    <th className="py-2">فوز</th>
                    <th className="py-2">تعادل</th>
                    <th className="py-2">خسارة</th>
                    <th className="py-2">نقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {group.map((row) => (
                    <tr key={row.team.id} className="text-center border-b border-[#333]">
                      <td className="py-2">{row.rank}</td>
                      <td className="py-2 flex items-center gap-2 justify-center">
                        <img src={row.team.logo} alt={row.team.name} className="w-6 h-6 object-contain ml-2" />
                        {row.team.name}
                      </td>
                      <td className="py-2">{row.all.played}</td>
                      <td className="py-2">{row.all.win}</td>
                      <td className="py-2">{row.all.draw}</td>
                      <td className="py-2">{row.all.lose}</td>
                      <td className="py-2 font-bold">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Standings; 