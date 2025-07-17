import React from "react";
import MatchCard from "./MatchCard";

const MatchList = () => (
  <div className="bg-[#222] rounded-b-lg overflow-x-auto border-r-2 xs:border-r-4 border-[#e63946]" dir="rtl">
    {/* قائمة المباريات */}
    <MatchCard />
    <MatchCard />
    <MatchCard />
    <MatchCard />
  </div>
);

export default MatchList; 