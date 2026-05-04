import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';
import { Header } from '../components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModelComparison() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    api.get('/models/metrics').then(res => {
      setMetrics(res.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const { bestR2Model, worstMaeModel } = useMemo(() => {
    if (!metrics.length) return { bestR2Model: null, worstMaeModel: null };
    let bestR2 = -Infinity;
    let bestR2Model = '';
    let worstMae = -Infinity;
    let worstMaeModel = '';

    metrics.forEach(m => {
      if (m.r2 > bestR2) { bestR2 = m.r2; bestR2Model = m.model_name; }
      if (m.mae > worstMae) { worstMae = m.mae; worstMaeModel = m.model_name; }
    });

    return { bestR2Model, worstMaeModel };
  }, [metrics]);

  if (loading) return (
    <div className="flex-1 bg-[#0a0a0f] overflow-auto flex flex-col">
      <Header title="Model Performance" showFilterBtn={false} />
      <div className="p-10 w-full flex-1 flex flex-col gap-6">
        <div className="h-10 w-64 bg-card rounded shimmer-bg animate-shimmer" />
        <div className="h-64 w-full bg-card rounded-2xl shimmer-bg animate-shimmer" />
        <div className="h-64 w-full bg-card rounded-2xl shimmer-bg animate-shimmer" />
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#0a0a0f] overflow-auto flex flex-col">
      <Header title="Model Performance Comparison" showFilterBtn={false} />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="bg-card rounded-2xl border border-borderp shadow-xl overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-elevated text-slate-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold pl-6">Model</th>
              <th className="p-4 font-semibold">MAE</th>
              <th className="p-4 font-semibold">RMSE</th>
              <th className="p-4 font-semibold">R² Score</th>
              <th className="p-4 font-semibold">Train Time (ms)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderp">
            {metrics.map((m) => {
              const isBestR2 = m.model_name === bestR2Model;
              const isWorstMae = m.model_name === worstMaeModel;
              let borderClass = 'border-l-4 border-transparent';
              if (isBestR2) borderClass = 'border-l-4 border-success bg-success/5';
              else if (isWorstMae) borderClass = 'border-l-4 border-danger bg-danger/5';

              return (
                <tr key={m.model_name} className={`hover:bg-elevated transition-colors ${borderClass}`}>
                  <td className="p-4 font-medium text-white pl-6">{m.model_name}</td>
                  <td className="p-4 text-slate-300">{m.mae.toFixed(2)}</td>
                  <td className="p-4 text-slate-300">{m.rmse.toFixed(2)}</td>
                  <td className="p-4 text-slate-300">{m.r2.toFixed(4)}</td>
                  <td className="p-4 text-slate-300">{m.train_time_ms.toFixed(1)} ms</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-borderp shadow-xl h-[400px] mb-8">
        <h2 className="text-lg font-semibold mb-4 text-white">Error Metrics Overview (MAE vs RMSE)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" vertical={false} />
            <XAxis dataKey="model_name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis stroke="#94a3b8" />
            <RechartsTooltip cursor={{fill: '#2a2a3e'}} contentStyle={{backgroundColor: '#16161f', borderColor: '#2a2a3e', color: '#fff'}} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px' }} />
            <Bar dataKey="mae" name="MAE" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Bar dataKey="rmse" name="RMSE" fill="#a855f7" radius={[4, 4, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-2xl border border-borderp shadow-xl overflow-hidden">
        <button 
          onClick={() => setNotesOpen(!notesOpen)}
          className="w-full flex justify-between items-center p-6 hover:bg-elevated transition-colors text-left focus:outline-none"
        >
          <span className="text-lg font-semibold text-success">Understanding These Metrics</span>
          {notesOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>
        <AnimatePresence>
          {notesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-card"
            >
              <div className="p-6 text-slate-300 space-y-4 border-t border-borderp">
                <p><strong className="text-white">MAE (Mean Absolute Error):</strong> The average absolute difference between predicted and actual values. Lower is better. Tells you how far off predictions are on average in kWh.</p>
                <p><strong className="text-white">RMSE (Root Mean Squared Error):</strong> Similar to MAE but penalizes larger errors more heavily. Lower is better. If RMSE is much higher than MAE, the model occasionally makes very large errors.</p>
                <p><strong className="text-white">R² Score (Coefficient of Determination):</strong> Represents the proportion of variance in the dependent variable that is predictable from the independent variables. 1.0 is a perfect score. 0.0 means the model just predicts the average.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
};
