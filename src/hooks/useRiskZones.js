import { useState, useEffect } from 'react';
import { riskApi } from '../services/api';

export const useRiskZones = (lat = null, lng = null, radius = 5000) => {
  const [zones, setZones] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskZones = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await riskApi.zones(lat, lng, radius);
        setZones(data.zones);
        setSummary(data.summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskZones();
  }, [lat, lng, radius]);

  return { zones, summary, loading, error };
};

export const useRiskPredictions = (lat, lng, hours = 6) => {
  const [predictions, setPredictions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await riskApi.predictions(lat, lng, hours);
        setPredictions(data.predictions);
        setSummary(data.summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [lat, lng, hours]);

  return { predictions, summary, loading, error };
};