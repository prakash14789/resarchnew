import { useState } from 'react';
import { api } from '../lib/api';

export const usePredict = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const predict = async (params: any) => {
    setLoading(true);
    try {
      const res = await api.post('/predict', params);
      setPrediction(res.data.prediction_kwh);
    } catch (err) {
      console.error("Error predicting", err);
    } finally {
      setLoading(false);
    }
  };

  return { predict, prediction, loading };
}
