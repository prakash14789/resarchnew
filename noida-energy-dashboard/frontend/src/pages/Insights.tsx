import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line } from 'recharts';
import { useMapData } from '../hooks/useMapData';
import { Header } from '../components/Header';
import { motion } from 'framer-motion';

const CountUp = ({ end, duration = 1000, decimals = 0 }: any) => {
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

  return <span>{count.toFixed(decimals)}</span>;
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Insights() {
  const { data, loading } = useMapData();

  const stats = useMemo(() => {
    if (!data?.features) return { totalKwh: 0, avgRes: 0, avgCom: 0, highCount: 0, chart1: [], chart2: [], chart3: [], totalRecords: 0 };
    
    const feats = data.features.map((f: any) => f.properties);
    let totalKwh = 0, resCount = 0, resKwh = 0, comCount = 0, comKwh = 0, highCount = 0;
    
    const areaMap: any = {};
    const monthMap: any = {};
    for (let i = 1; i <= 12; i++) monthMap[i] = { month: i, resKwh: 0, resCount: 0, comKwh: 0, comCount: 0 };

    feats.forEach((p: any) => {
      totalKwh += p.predicted_kwh;
      if (p.category === 'residential') {
        resKwh += p.predicted_kwh;
        resCount++;
        monthMap[p.month].resKwh += p.predicted_kwh;
        monthMap[p.month].resCount++;
      } else {
        comKwh += p.predicted_kwh;
        comCount++;
        monthMap[p.month].comKwh += p.predicted_kwh;
        monthMap[p.month].comCount++;
      }
      if (p.consumption_level === 'high') highCount++;

      if (!areaMap[p.name]) areaMap[p.name] = { name: p.name, total: 0, count: 0 };
      areaMap[p.name].total += p.predicted_kwh;
      areaMap[p.name].count++;
    });

    const chart1 = Object.values(areaMap).map((a: any) => ({
      name: a.name,
      avg: a.total / a.count,
      level: (a.total / a.count) > 1200 ? 'high' : (a.total / a.count) > 300 ? 'medium' : 'low'
    })).sort((a: any, b: any) => b.avg - a.avg).slice(0, 15);

    const chart2 = [
      { name: 'Residential', value: resKwh, fill: '#10b981' },
      { name: 'Commercial', value: comKwh, fill: '#6366f1' }
    ];

    const chart3 = Object.values(monthMap).map((m: any) => ({
      month: `M${m.month}`,
      residential: m.resCount ? m.resKwh / m.resCount : 0,
      commercial: m.comCount ? m.comKwh / m.comCount : 0
    }));

    return {
      totalKwh,
      avgRes: resCount ? resKwh / resCount : 0,
      avgCom: comCount ? comKwh / comCount : 0,
      highCount,
      chart1, chart2, chart3,
      totalRecords: feats.length
    };
  }, [data]);

  const getLevelColor = (level: string) => {
    if (level === 'high') return '#ef4444';
    if (level === 'medium') return '#f59e0b';
    return '#10b981';
  };

  if (loading) return <div className="flex-1 bg-[#0a0a0f] overflow-auto flex items-center justify-center text-success">Loading Insights...</div>;

  return (
    <div className="flex-1 bg-[#0a0a0f] overflow-auto flex flex-col">
      <Header title="Energy Insights" showFilterBtn={false} />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <motion.div variants={itemVariants} className="bg-card p-6 rounded-2xl border border-borderp shadow-lg">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Consumption</p>
          <p className="text-3xl font-bold text-white"><CountUp end={stats.totalKwh} /> <span className="text-base text-slate-500 font-normal">kWh</span></p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-card p-6 rounded-2xl border border-borderp shadow-lg">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Avg Residential</p>
          <p className="text-3xl font-bold text-success"><CountUp end={stats.avgRes} decimals={1} /> <span className="text-base text-slate-500 font-normal">kWh</span></p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-card p-6 rounded-2xl border border-borderp shadow-lg">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Avg Commercial</p>
          <p className="text-3xl font-bold text-accent"><CountUp end={stats.avgCom} decimals={1} /> <span className="text-base text-slate-500 font-normal">kWh</span></p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-card p-6 rounded-2xl border border-borderp shadow-lg">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">High Users</p>
          <p className="text-3xl font-bold text-danger"><CountUp end={stats.highCount} /> <span className="text-base text-slate-500 font-normal">Zones</span></p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-elevated p-6 rounded-2xl border border-borderp h-[400px]">
          <h2 className="text-lg font-semibold mb-4 text-white">Avg Consumption by Area (Top 15)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chart1} layout="vertical" margin={{ left: 40, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tick={{ fill: '#94a3b8' }} />
              <RechartsTooltip cursor={{fill: '#2a2a3e'}} contentStyle={{backgroundColor: '#16161f', borderColor: '#2a2a3e'}} />
              <Bar dataKey="avg" animationBegin={0} animationDuration={800} radius={[0, 4, 4, 0]}>
                {stats.chart1.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getLevelColor(entry.level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-elevated p-6 rounded-2xl border border-borderp h-[400px] relative">
          <h2 className="text-lg font-semibold mb-4 text-white">Commercial vs Residential Share</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={stats.chart2} innerRadius={80} outerRadius={120} dataKey="value" stroke="none" animationDuration={800}>
                {stats.chart2.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(val: number) => Math.round(val).toLocaleString() + ' kWh'} contentStyle={{backgroundColor: '#16161f', borderColor: '#2a2a3e'}} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{stats.totalRecords}</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-elevated p-6 rounded-2xl border border-borderp h-[400px]">
        <h2 className="text-lg font-semibold mb-4 text-white">Monthly Consumption Trend</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats.chart3} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <RechartsTooltip contentStyle={{backgroundColor: '#16161f', borderColor: '#2a2a3e'}} />
            <Legend />
            <Line type="monotone" dataKey="residential" name="Residential (kWh)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} animationDuration={800} />
            <Line type="monotone" dataKey="commercial" name="Commercial (kWh)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} animationDuration={800} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
};
