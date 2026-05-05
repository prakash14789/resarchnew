import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Zap, Clock, Car } from 'lucide-react';

interface Props {
  viewMode: 'consumption' | 'solar';
  setViewMode: (m: 'consumption' | 'solar') => void;
  time: number;
  setTime: (t: number) => void;
  scenario: 'baseline' | 'ev_impact';
  setScenario: (s: 'baseline' | 'ev_impact') => void;
}

export const MapControls = ({ viewMode, setViewMode, time, setTime, scenario, setScenario }: Props) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-4"
    >
      <div className="glass p-4 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between gap-6">
          {/* Mode Toggles */}
          <div className="flex glass p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setViewMode('consumption')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'consumption' ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Zap className="w-3.5 h-3.5" /> Consumption
            </button>
            <button 
              onClick={() => setViewMode('solar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'solar' ? 'bg-warning text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Sun className="w-3.5 h-3.5" /> Solar Potential
            </button>
          </div>

          {/* Scenario Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Scenario</span>
            <button 
              onClick={() => setScenario(scenario === 'baseline' ? 'ev_impact' : 'baseline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${scenario === 'ev_impact' ? 'bg-danger/20 border-danger/40 text-danger shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
            >
              <Car className="w-3.5 h-3.5" /> EV Load Impact
            </button>
          </div>
        </div>

        {/* Time Slider */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 min-w-[80px]">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-mono text-white">{time}:00</span>
          </div>
          <div className="relative flex-1 group">
            <input 
              type="range" 
              min="0" 
              max="23" 
              value={time} 
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full accent-accent h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            {/* Hour ticks */}
            <div className="flex justify-between px-1 mt-1">
              {[0, 6, 12, 18, 23].map(h => (
                <span key={h} className="text-[9px] text-slate-600 font-bold">{h}h</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
