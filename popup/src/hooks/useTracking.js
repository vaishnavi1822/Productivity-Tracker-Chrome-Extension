import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { trackingAPI } from '../services/api';

export function useTracking(startDate, endDate) {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await trackingAPI.getTracking(startDate, endDate);
        dispatch({ type: 'SET_TRACKING_DATA', payload: data });
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
    trackingData: state.trackingData,
    loading,
    error
  };
} 