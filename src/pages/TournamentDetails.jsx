import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const TournamentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leagueId } = useParams();
  const league = location.state?.league;
  const country = location.state?.country;
  const seasons = location.state?.seasons || [];

  if (!league) return <div className="text-center text-gray-400 py-8">لا توجد بيانات البطولة</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <section className="w-full max-w-2xl">
          <div className="flex flex-col items-center bg-white rounded-xl p-6 border border-[#333] shadow mb-8">
            <img src={league.logo} alt={league.name} className="w-24 h-24 object-contain mb-2" />
            <span className="text-center font-bold text-2xl text-gray-900">{league.name}</span>
            {country?.name && (
              <span className="text-center text-sm text-gray-500 mt-1">{country.name}</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-[#e63946] mb-4 text-center">المواسم المتاحة</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {seasons.map((season) => (
              <button
                key={season.year}
                className="bg-[#23272f] text-white rounded-lg px-4 py-3 font-bold hover:bg-[#e63946] transition"
                onClick={() => navigate(`/standings/${leagueId}/${season.year}`)}
              >
                {season.year}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TournamentDetails; 