import { useState, useEffect } from 'react';
import api from '../services/api';
import { Location } from '../types';

export const useGeolocation = (shouldTrack = false) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(newLocation);
        setError(null);
        setLoading(false);
        
        try {
          await api.post('/location', newLocation);
        } catch (err) {
          console.error("Failed to update location on server", err);
        }
      },
      (error) => {
        let errorMessage = 'Location access is required to provide accurate emergency assistance. Please enable location permission in your browser.';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable it in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    if (shouldTrack) {
      getLocation();
      const intervalId = setInterval(getLocation, 60000); // Update every minute
      return () => clearInterval(intervalId);
    } else {
      getLocation(); // Get at least once
    }
  }, [shouldTrack]);

  return { location, error, loading, refreshLocation: getLocation };
};
