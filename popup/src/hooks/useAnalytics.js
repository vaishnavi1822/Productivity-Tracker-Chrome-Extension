import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { analyticsAPI } from '../services/api';

export function useAnalytics(startDate, endDate) {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await analyticsAPI.getComprehensive(startDate, endDate);
        dispatch({ type: 'SET_ANALYTICS', payload: data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, dispatch]);

  return {
    analytics: state.analytics,
    loading,
    error
  };
} 