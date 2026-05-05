import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DetailPanel = ({ feature, onClose }: any) => {
  return (
    <AnimatePresence>
      {feature && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-4 right-4 h-[calc(100%-32px)] w-80 glass border border-white/10 p-6 shadow-2xl z-40 rounded-2xl"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold text-emerald-400 mt-4 mb-6">{feature.properties.name}</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-1">Category</p>
              <p className="text-lg font-medium capitalize text-white">{feature.properties.category}</p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-1">Area Details</p>
              <div className="flex justify-between text-white mt-1">
                <span>{feature.properties.area_sqft} sqft</span>
                <span className="text-gray-500">|</span>
                <span>{feature.properties.occupants} occupants</span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-1">Appliances</p>
              <p className="text-lg font-medium text-white">{feature.properties.appliance_count}</p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-xl border border-emerald-500/30">
              <p className="text-sm text-emerald-400/80 mb-1 font-semibold">Predicted Usage</p>
              <p className="text-3xl font-bold text-emerald-400 mb-1">{feature.properties.predicted_kwh} <span className="text-sm font-normal text-emerald-400/60">kWh</span></p>
              <p className="text-sm text-gray-400">Avg Power: {feature.properties.power_watts} W</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
