import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Standings = () => {
  const { leagueId, season } = useParams();
  const [standingsGroups, setStandingsGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/standings?league=${leagueId}&season=${season}`)
      .then(res => res.json())
      .then(data => {
        // The response is an array of groups, each group is an array of teams
        setStandingsGroups(data.response?.[0]?.league?.standings || []);
        setLoading(false);
      })
      .catch(() => {
        setError("فشل تحميل جدول الترتيب");
        setLoading(false);
      });
  }, [leagueId, season]);

  return (
    <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <section className="w-full max-w-3xl">
          <h2 className="text-xl font-bold text-[#e63946] mb-6 text-center">جدول الترتيب</h2>
          {loading && <div className="text-center text-gray-400 py-8">جاري تحميل الترتيب...</div>}
          {error && <div className="text-center text-red-400 py-8">{error}</div>}
          {!loading && !error && standingsGroups.length === 0 && (
            <div className="text-center text-gray-400 py-8">لا يوجد ترتيب متاح لهذا الموسم</div>
          )}
          {!loading && !error && standingsGroups.map((group, groupIdx) => (
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