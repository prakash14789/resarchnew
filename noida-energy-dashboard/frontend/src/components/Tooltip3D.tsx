import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip3D = ({ info }: any) => {
  const isVisible = !!(info && info.object);
  const p = isVisible ? info.object.properties : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { 
              duration: isVisible ? 0.12 : 0.08 
            } 
          }}
          className="absolute bg-elevated/95 backdrop-blur-md border border-borderp text-white p-4 rounded-xl shadow-2xl pointer-events-none z-50"
          style={{ left: info.x + 15, top: info.y + 15 }}
        >
          <h3 className="font-bold text-lg text-success mb-2">{p.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-24">Category:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${p.category === 'residential' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'}`}>
                {p.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-24">Level:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize 
                ${p.consumption_level === 'low' ? 'bg-success/20 text-success' : 
                  p.consumption_level === 'medium' ? 'bg-warning/20 text-warning' : 
                  'bg-danger/20 text-danger'}`}>
                {p.consumption_level}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-24">Predicted:</span>
              <span className="font-semibold">{p.predicted_kwh} kWh</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-24">Avg Power:</span>
              <span className="font-semibold">{p.power_watts} W</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
