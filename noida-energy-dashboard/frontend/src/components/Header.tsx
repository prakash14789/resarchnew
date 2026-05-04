import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

export const Header = ({ title, onToggleFilter, showFilterBtn }: any) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-page/80 backdrop-blur-md border-b border-borderp h-16 px-4 md:px-6 flex items-center justify-between">
      <h1 className="text-lg md:text-xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        {showFilterBtn && (
          <button 
            onClick={onToggleFilter}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-elevated hover:bg-borderp rounded-lg transition-colors border border-borderp text-sm font-semibold text-slate-300"
          >
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filters</span>
          </button>
        )}
        <div className="text-xs md:text-sm text-slate-400 font-medium">Updated: {time}</div>
      </div>
    </div>
  );
};
