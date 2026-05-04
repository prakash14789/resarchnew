import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export const useMapData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/map-data')
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching map data", err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
