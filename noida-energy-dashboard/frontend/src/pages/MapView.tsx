import React, { useState, useMemo } from 'react';
import { DeckMap } from '../components/DeckMap';
import { FilterPanel } from '../components/FilterPanel';
import { Tooltip3D } from '../components/Tooltip3D';
import { DetailPanel } from '../components/DetailPanel';
import { Header } from '../components/Header';
import { useMapData } from '../hooks/useMapData';
import throttle from 'lodash/throttle';
import { AnimatePresence } from 'framer-motion';

export default function MapView() {
  const { data, loading } = useMapData();
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ category: 'all', level: 'all' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredData = useMemo(() => {
    if (!data || !data.features) return null;
    return {
      ...data,
      features: data.features.filter((f: any) => {
        const matchCategory = filters.category === 'all' || f.properties.category === filters.category;
        const matchLevel = filters.level === 'all' || f.properties.consumption_level === filters.level;
        return matchCategory && matchLevel;
      })
    };
  }, [data, filters]);

  const handleHover = useMemo(
    () => throttle((info: any) => setHoverInfo(info), 50),
    []
  );

  const handleClick = (info: any) => {
    if (info && info.object) {
      setSelectedId(info.object.properties.id);
    } else {
      setSelectedId(null);
    }
  };

  const selectedFeature = useMemo(() => {
    if (!selectedId || !data || !data.features) return null;
    return data.features.find((f: any) => f.properties.id === selectedId) || null;
  }, [selectedId, data]);

  if (loading) {
    return (
      <div className="flex-1 bg-[#0a0a0f] overflow-auto flex flex-col">
        <Header title="3D Energy Map" showFilterBtn={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-success animate-pulse font-medium">Loading Map Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Map fills 100% of this container */}
      <DeckMap 
        data={filteredData?.features} 
        filters={filters}
        selectedId={selectedId}
        onHover={handleHover}
        onClick={handleClick}
      />

      {/* Header overlaid top-left */}
      <div className="glass" style={{
        position: 'absolute', top: 16, left: 16, zIndex: 10,
        borderRadius: 14, padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 10px #6366f1' }} />
          <h1 style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>3D SPATIAL ENGINE</h1>
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <button onClick={() => setIsFilterOpen(f => !f)}
          style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: '#fff', 
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            transition: 'transform 0.2s'
          }}>
          Map Filters
        </button>
      </div>

      {/* Filter panel overlaid top-right */}
      <AnimatePresence>
        {isFilterOpen && (
          <FilterPanel 
            filters={filters} 
            setFilters={setFilters} 
            onClose={() => setIsFilterOpen(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Tooltip overlaid */}
      <Tooltip3D info={hoverInfo} />

      {/* Detail panel slides in from right */}
      <DetailPanel feature={selectedFeature} onClose={() => setSelectedId(null)} />
    </div>
  );
}
