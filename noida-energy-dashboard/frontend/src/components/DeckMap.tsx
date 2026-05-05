import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { ColumnLayer, ScatterplotLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';

const FREE_DARK_STYLE = 'https://tiles.openfreemap.org/styles/dark';

const getConsumptionColor = (kwh: number, min: number, max: number) => {
  const t = Math.max(0, Math.min(1, (kwh - min) / (max - min)));
  if (t < 0.5) {
    const f = t * 2;
    return [Math.round(34+200*f), Math.round(197-18*f), Math.round(94-86*f), 220];
  }
  const f = (t - 0.5) * 2;
  return [Math.round(234+5*f), Math.round(179-111*f), Math.round(8+60*f), 220];
};

const getSolarColor = (potential: number) => {
  // Potential is typically 0 to 1 score
  const f = Math.max(0, Math.min(1, potential));
  // Yellow [253, 224, 71] to Orange [234, 88, 12]
  return [
    Math.round(253 - 19 * f),
    Math.round(224 - 136 * f),
    Math.round(71 - 59 * f),
    240
  ];
};

export function DeckMap({ data, onHover, onClick, viewMode, time, scenario }: any) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const map = new maplibregl.Map({
      container: container.current,
      style: FREE_DARK_STYLE,
      center: [77.4538, 28.4744],
      zoom: 12.5,
      pitch: 58,
      bearing: -15,
      antialias: true,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      const overlay = new MapboxOverlay({
        interleaved: false,
        layers: buildLayers(data, onHover, onClick, viewMode, time, scenario),
      });
      map.addControl(overlay as any);

      if (container.current) {
        (container.current as any)._overlay = overlay;
      }
    });

    (container.current as any)._map = map;
    return () => map.remove();
  }, []);

  useEffect(() => {
    const overlay = (container.current as any)?._overlay;
    if (overlay) {
      overlay.setProps({ 
        layers: buildLayers(data, onHover, onClick, viewMode, time, scenario) 
      });
    }
  }, [data, onHover, onClick, viewMode, time, scenario]);

  return <div ref={container} style={{ width: '100%', height: '100%' }} id="map-container" />;
}

function buildLayers(data: any[], onHover: any, onClick: any, viewMode: string, time: number, scenario: string) {
  if (!data?.length) return [];

  // Logic for dynamic values based on time and scenario
  const processedData = data.map(d => {
    const base = d.properties.predicted_kwh ?? 400;
    const cat = d.properties.category;
    
    let multiplier = 1.0;
    // Commercial peaks 9am-6pm
    if (cat === 'commercial') {
      if (time >= 9 && time <= 18) multiplier = 1.2 + Math.random() * 0.3;
      else multiplier = 0.4 + Math.random() * 0.2;
    } 
    // Residential peaks 6pm-11pm
    else {
      if (time >= 18 && time <= 23) multiplier = 1.3 + Math.random() * 0.4;
      else if (time >= 0 && time <= 5) multiplier = 0.5 + Math.random() * 0.2;
      else multiplier = 0.8 + Math.random() * 0.2;

      // EV Scenario adds load at night
      if (scenario === 'ev_impact' && time >= 22 || time <= 4) {
        multiplier += 0.5;
      }
    }

    const currentKwh = base * multiplier;
    // Solar potential is static area-based
    const solarScore = (d.properties.id.charCodeAt(0) % 10) / 10;
    const solarKwh = (d.properties.area || 1500) * 0.15 * 4.5 * solarScore;

    return {
      ...d,
      currentKwh,
      solarKwh,
      solarScore
    };
  });

  const vals = processedData.map(d => viewMode === 'solar' ? d.solarKwh : d.currentKwh);
  const min = Math.min(...vals), max = Math.max(...vals);

  return [
    new ColumnLayer({
      id: 'cols',
      data: processedData,
      getPosition: (d: any) => d.geometry.coordinates,
      getElevation: (d: any) => viewMode === 'solar' ? d.solarKwh * 0.8 : d.currentKwh * 1.2,
      radius: 80,
      getFillColor: (d: any) => viewMode === 'solar' ? getSolarColor(d.solarScore) : getConsumptionColor(d.currentKwh, min, max),
      pickable: true,
      autoHighlight: true,
      highlightColor: [255,255,255,70],
      transitions: { getElevation: { duration: 600 } },
      onHover: i => onHover?.(i.object ? i : null),
      onClick: i => i.object && onClick?.(i.object),
    }),
    new ScatterplotLayer({
      id: 'dots',
      data: processedData,
      getPosition: (d: any) => d.geometry.coordinates,
      getRadius: 40,
      getFillColor: (d: any) => viewMode === 'solar' ? getSolarColor(d.solarScore) : getConsumptionColor(d.currentKwh, min, max),
      opacity: 0.4,
    }),
  ];
}
