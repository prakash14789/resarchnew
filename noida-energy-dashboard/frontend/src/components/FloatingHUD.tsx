import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Info } from 'lucide-react';

interface Props {
  data: any[];
}

export const FloatingHUD = ({ data }: Props) => {
  const stats = useMemo(() => {
    if (!data.length) return { avg: 0, total: 0, high: 0 };
    const total = data.length;
    const sum = data.reduce((acc, curr) => acc + (curr.properties?.predicted_kwh || 0), 0);
    const high = data.filter(d => d.properties?.consumption_level === 'high').length;
    return {
      avg: Math.round(sum / total),
      total,
      high
    };
  }, [data]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute bottom-6 left-6 z-10 flex flex-col gap-3"
    >
      {/* System Status Card */}
      <div className="glass p-4 rounded-2xl border border-white/10 shadow-2xl min-w-[200px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Analytics Engine</p>
            <p className="text-xs text-white font-semibold">Active Monitoring</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Nodes</span>
            <span className="text-white font-mono">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Avg Load</span>
            <span className="text-white font-mono">{stats.avg} kWh</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Anomalies</span>
            <span className="text-danger font-mono font-bold">{stats.high}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success font-bold uppercase">System Nominal</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">0.4ms lat</span>
        </div>
      </div>

      {/* Mini Grid Status */}
      <div className="glass p-2 rounded-xl border border-white/10 flex gap-2">
        <div className="p-1.5 bg-success/20 rounded-lg">
          <Shield className="w-3 h-3 text-success" />
        </div>
        <div className="p-1.5 bg-warning/20 rounded-lg">
          <Zap className="w-3 h-3 text-warning" />
        </div>
        <div className="p-1.5 bg-slate-800/50 rounded-lg">
          <Info className="w-3 h-3 text-slate-400" />
        </div>
      </div>
    </motion.div>
  );
};
