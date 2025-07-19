import React from "react";

const getRelativeDate = (offset, baseDate) => {
  const d = baseDate ? new Date(baseDate) : new Date();
  d.setDate(d.getDate() + offset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const TabsWithDate = ({ selectedDate, onDateChange, activeTab, onTabClick, onShowLive, showingLive, liveMatchCount }) => {
  const isYesterday = selectedDate === getRelativeDate(-1);
  const isToday = selectedDate === getRelativeDate(0);
  const isTomorrow = selectedDate === getRelativeDate(1);

  return (
    <div className="w-full bg-[#444c56] rounded-2xl p-0 flex flex-col gap-0 relative" dir="rtl">
      {/* Tabs */}
      <div className="flex w-full items-center overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          className={`flex-1 min-w-[90px] py-2 xs:py-3 font-bold text-base xs:text-lg border-b-4
            ${(activeTab === 'yesterday' || isYesterday) ? 'text-[#e63946] bg-[#181818] border-[#e63946]' : 'text-white bg-transparent border-transparent hover:bg-[#0a2342] hover:border-[#e63946]'}`}
          onClick={() => onTabClick('yesterday')}
        >
          أمس
        </button>
        <button
          className={`flex-1 min-w-[90px] py-2 xs:py-3 font-bold text-base xs:text-lg border-b-4
            ${(activeTab === 'today' || isToday) ? 'text-[#e63946] bg-[#181818] border-[#e63946]' : 'text-white bg-transparent border-transparent hover:bg-[#0a2342] hover:border-[#e63946]'}`}
          onClick={() => onTabClick('today')}
        >
          اليوم
        </button>
        <button
          className={`flex-1 min-w-[90px] py-2 xs:py-3 font-bold text-base xs:text-lg border-b-4
            ${(activeTab === 'tomorrow' || isTomorrow) ? 'text-[#e63946] bg-[#181818] border-[#e63946]' : 'text-white bg-transparent border-transparent hover:bg-[#0a2342] hover:border-[#e63946]'}`}
          onClick={() => onTabClick('tomorrow')}
        >
          غداً
        </button>
      </div>
      {/* Date Picker Row */}
      <div className="flex flex-row xs:flex-row items-center justify-center gap-2 py-4 xs:py-6 bg-[#23272f] rounded-b-2xl">
        <button
          className="text-xl xs:text-2xl text-white px-2 hover:text-[#e63946] transition"
          onClick={() => onDateChange(getRelativeDate(-1, selectedDate))}
        >
          &#60;
        </button>
        <div className="flex items-center gap-2 bg-[#181818] px-2 xs:px-4 py-1 xs:py-2 rounded-lg border border-[#0a2342]">
          <input
            type="date"
            value={selectedDate}
            onChange={e => onDateChange(e.target.value)}
            className="bg-transparent text-white border-none focus:outline-none text-base xs:text-lg w-30 xs:w-32 text-center"
            style={{ direction: 'ltr' }}
          />
        </div>
        <button
          className="text-xl xs:text-2xl text-white px-2 hover:text-[#e63946] transition"
          onClick={() => onDateChange(getRelativeDate(1, selectedDate))}
        >
          &#62;
        </button>
      </div>
      {/* Live Matches Button - bottom right */}
      {(isToday || isYesterday) && liveMatchCount > 0 && (
        <button
          className={`absolute bottom-2 xs:bottom-3 right-2 xs:right-3 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg font-bold text-xs xs:text-sm transition z-10
            ${showingLive ? 'bg-green-400 text-white' : 'bg-[#23272f] text-green-400 hover:bg-green-400 hover:text-white'}`}
          onClick={onShowLive}
        >
          <span className="animate-pulse">مباشر</span>
          <span className="mr-2 xs:mr-4 bg-white text-green-600 rounded-full px-1.5 xs:px-2 py-0.5 text-[10px] xs:text-xs font-bold">
            {liveMatchCount}
          </span>
        </button>
      )}
    </div>
  );
};

export default TabsWithDate; 