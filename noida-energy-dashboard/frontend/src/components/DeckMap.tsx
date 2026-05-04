import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { ColumnLayer, ScatterplotLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';

const FREE_DARK_STYLE = 'https://tiles.openfreemap.org/styles/dark';

const getColor = (kwh: number, min: number, max: number) => {
  const t = Math.max(0, Math.min(1, (kwh - min) / (max - min)));
  if (t < 0.5) {
    const f = t * 2;
    return [Math.round(34+200*f), Math.round(197-18*f), Math.round(94-86*f), 220];
  }
  const f = (t - 0.5) * 2;
  return [Math.round(234+5*f), Math.round(179-111*f), Math.round(8+60*f), 220];
};

export function DeckMap({ data, onHover, onClick }: any) {
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
      // deck.gl overlay
      const overlay = new MapboxOverlay({
        interleaved: false,
        layers: buildLayers(data, onHover, onClick),
      });
      map.addControl(overlay as any);

      // Store overlay ref for updates
      if (container.current) {
        (container.current as any)._overlay = overlay;
      }
    });

    (container.current as any)._map = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    const overlay = (container.current as any)?._overlay;
    if (overlay) overlay.setProps({ layers: buildLayers(data, onHover, onClick) });
  }, [data, onHover, onClick]);

  return <div ref={container} style={{ width: '100%', height: '100%' }} />;
}

function buildLayers(data: any[], onHover: any, onClick: any) {
  if (!data?.length) return [];
  const vals = data.map(d => d.properties?.predicted_kwh ?? 0);
  const min = Math.min(...vals), max = Math.max(...vals);
  return [
    new ColumnLayer({
      id: 'cols',
      data,
      getPosition: (d: any) => d.geometry.coordinates,
      getElevation: (d: any) => (d.properties.predicted_kwh ?? 0) * 1.2,
      radius: 80,
      getFillColor: (d: any) => getColor(d.properties.predicted_kwh ?? 0, min, max),
      pickable: true,
      autoHighlight: true,
      highlightColor: [255,255,255,70],
      transitions: { getElevation: { duration: 600 } },
      onHover: i => onHover?.(i.object ? i : null),
      onClick: i => i.object && onClick?.(i.object),
    }),
    new ScatterplotLayer({
      id: 'dots',
      data,
      getPosition: (d: any) => d.geometry.coordinates,
      getRadius: 40,
      getFillColor: (d: any) => getColor(d.properties.predicted_kwh ?? 0, min, max),
      opacity: 0.4,
    }),
  ];
}
