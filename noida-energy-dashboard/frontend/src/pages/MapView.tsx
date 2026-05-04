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
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 10,
        background: 'rgba(17,17,24,0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #2a2a3e',
        borderRadius: 12, padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        <h1 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>3D Energy Map</h1>
        <button onClick={() => setIsFilterOpen(f => !f)}
          style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6,
            background: '#6366f1', border: 'none', color: '#fff', cursor: 'pointer' }}>
          Filters
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
