import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Header } from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const CountUp = ({ end, duration = 1000 }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrame: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };
    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{Math.round(count).toLocaleString()}</span>;
};

const GaugeChart = ({ value, level }: any) => {
  const max = 2000;
  const clampedValue = Math.min(value, max);
  const data = [
    { name: 'value', value: clampedValue },
    { name: 'empty', value: max - clampedValue }
  ];
  
  let color = '#10b981'; // success
  if (level === 'medium') color = '#f59e0b'; // warning
  if (level === 'high') color = '#ef4444'; // danger

  return (
    <div className="relative w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            animationDuration={800}
          >
            <Cell key="cell-0" fill={color} />
            <Cell key="cell-1" fill="#2a2a3e" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-end justify-center pb-2">
        <span className="text-sm text-slate-400 font-semibold uppercase tracking-widest">{level}</span>
      </div>
    </div>
  );
};

export default function Prediction() {
  const [form, setForm] = useState({
    area_sqft: 1500,
    occupants: 4,
    appliance_count: 10,
    month: 5,
    category: 'residential',
    model_name: 'XGBoost'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [comparisons, setComparisons] = useState<any[]>([]);

  const models = ['Linear Regression', 'Ridge', 'XGBoost', 'LSTM (approx)', 'SARIMA (approx)'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/predict', form);
      setResult(res.data);

      const promises = models.map(m => api.post('/predict', { ...form, model_name: m }));
      const results = await Promise.all(promises);
      setComparisons(results.map((r, i) => ({ model: models[i], value: r.data.predicted_kwh })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0a0a0f] overflow-auto flex flex-col">
      <Header title="Predict Consumption" showFilterBtn={false} />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl">
          <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 font-semibold">Area (sq ft)</label>
                <span className="text-success font-bold">{form.area_sqft}</span>
              </div>
              <input type="range" min="100" max="5000" step="50" value={form.area_sqft} onChange={e => setForm({...form, area_sqft: Number(e.target.value)})} className="w-full accent-accent" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 font-semibold mb-2">Occupants</label>
                <input type="number" min="1" max="20" value={form.occupants} onChange={e => setForm({...form, occupants: Number(e.target.value)})} className="w-full glass border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-2">Appliances</label>
                <input type="number" min="1" max="30" value={form.appliance_count} onChange={e => setForm({...form, appliance_count: Number(e.target.value)})} className="w-full glass border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 font-semibold mb-2">Month</label>
                <select value={form.month} onChange={e => setForm({...form, month: Number(e.target.value)})} className="w-full glass border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:outline-none">
                  {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-2">Model</label>
                <select value={form.model_name} onChange={e => setForm({...form, model_name: e.target.value})} className="w-full glass border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:outline-none">
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-2">Category</label>
              <div className="flex glass p-1 rounded-xl border border-white/10">
                <button type="button" onClick={() => setForm({...form, category: 'residential'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${form.category === 'residential' ? 'bg-success text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>Residential</button>
                <button type="button" onClick={() => setForm({...form, category: 'commercial'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${form.category === 'commercial' ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>Commercial</button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-success hover:brightness-110 hover:scale-[1.02] active:scale-95 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Predicting...</> : 'Predict Consumption'}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="glass-card p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden"
              >
                <h2 className="text-xl font-bold text-white mb-6 text-center">Prediction Result</h2>
                <GaugeChart value={result.predicted_kwh} level={result.consumption_level} />
                <div className="text-center mt-6">
                  <p className="text-5xl font-extrabold text-white mb-2"><CountUp end={result.predicted_kwh} /> <span className="text-xl text-slate-500 font-normal">kWh</span></p>
                  <p className="text-success font-medium">Avg Power: <CountUp end={result.power_watts} /> W</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {comparisons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl"
              >
                <h3 className="text-slate-400 font-semibold mb-4 uppercase tracking-widest text-xs">Model Comparison</h3>
                <div className="space-y-3">
                  {comparisons.map(c => (
                    <div key={c.model} className="flex justify-between items-center p-3 glass rounded-lg border border-white/5">
                      <span className="text-slate-300 font-medium">{c.model}</span>
                      <span className={`font-bold ${c.model === form.model_name ? 'text-success' : 'text-slate-400'}`}>
                        {Math.round(c.value).toLocaleString()} kWh
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
};
