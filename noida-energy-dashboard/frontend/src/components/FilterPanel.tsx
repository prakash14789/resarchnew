import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const FilterPanel = ({ filters, setFilters, onClose }: any) => {
  const categories = ['All', 'Residential', 'Commercial'];
  const levels = ['All', 'Low', 'Medium', 'High'];

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-page/40 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div 
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-0 left-0 right-0 bg-elevated/95 border-b border-borderp p-6 shadow-2xl pointer-events-auto"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Map Filters</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-borderp text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold mb-3 block tracking-wider">Category</label>
              <div className="flex bg-card/50 rounded-xl p-1 gap-1">
                {categories.map((cat) => {
                  const isSelected = filters.category === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, category: cat.toLowerCase() })}
                      className={`relative flex-1 py-2 text-sm font-semibold transition-colors rounded-lg ${isSelected ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {isSelected && (
                        <motion.div 
                          layoutId="cat-active"
                          className="absolute inset-0 bg-accent rounded-lg shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold mb-3 block tracking-wider">Consumption Level</label>
              <div className="flex bg-card/50 rounded-xl p-1 gap-1">
                {levels.map((lvl) => {
                  const isSelected = filters.level === lvl.toLowerCase();
                  return (
                    <button
                      key={lvl}
                      onClick={() => setFilters({ ...filters, level: lvl.toLowerCase() })}
                      className={`relative flex-1 py-2 text-sm font-semibold transition-colors rounded-lg ${isSelected ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {isSelected && (
                        <motion.div 
                          layoutId="lvl-active"
                          className="absolute inset-0 bg-accent rounded-lg shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{lvl}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
