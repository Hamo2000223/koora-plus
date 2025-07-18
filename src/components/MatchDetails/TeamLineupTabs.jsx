import React, { useState } from "react";
import LineupView from "./LineupView";

const TeamLineupTabs = ({ lineup }) => {
  const [selected, setSelected] = useState(0);

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

export default TeamLineupTabs; 