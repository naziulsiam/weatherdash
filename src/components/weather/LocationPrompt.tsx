import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { findNearestCity } from '@/data/mockWeather';
import { useWeather } from '@/context/WeatherContext';
import { fetchWeatherByCoords } from '@/services/weatherApi';

const LocationPrompt: React.FC = () => {
  const { selectCity, selectCityByCoords, useRealApi } = useWeather();
  const [show, setShow] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if we've already asked for location permission in this session
    const hasPrompted = sessionStorage.getItem('locationPrompted');
    if (!hasPrompted) {
      // Small delay to let the UI load first
      const timer = setTimeout(() => {
        setShow(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setHasChecked(true);
    }
  }, []);

  const handleAllow = () => {
    sessionStorage.setItem('locationPrompted', 'true');
    setShow(false);

    if ('geolocation' in navigator) {
      setIsFetching(true);
      setErrorMessage(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('LocationPrompt: Got coordinates', latitude, longitude);

          try {
            if (useRealApi) {
              await selectCityByCoords(latitude, longitude);
            } else {
              const nearestCity = findNearestCity(latitude, longitude);
              selectCity(nearestCity.name);
            }
            setIsFetching(false);
            setShow(false);
          } catch (error) {
            console.error('LocationPrompt: selectCity Error', error);
            console.log('LocationPrompt: Falling back to nearest mock city');
            const nearestCity = findNearestCity(latitude, longitude);
            selectCity(nearestCity.name);
            setIsFetching(false);
            setShow(false);
          }
        },
        (error) => {
          console.error('LocationPrompt: Geolocation error:', error);
          setIsFetching(false);
          let msg = 'Location access denied or failed.';
          if (error.code === error.PERMISSION_DENIED) msg = 'Location permission was denied.';
          if (error.code === error.TIMEOUT) msg = 'Location request timed out.';
          setErrorMessage(msg);
          setTimeout(() => setShow(false), 3000);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser.');
      setTimeout(() => setShow(false), 3000);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('locationPrompted', 'true');
    setShow(false);
  };

  // Mark as checked once we've shown or skipped the prompt
  useEffect(() => {
    if (!show && !hasChecked) {
      setHasChecked(true);
    }
  }, [show, hasChecked]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass-static bg-background/95 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative bg-primary/10 rounded-full p-4">
                  <Navigation size={32} className="text-primary" />
                </div>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-center text-foreground mb-2">
              Enable Location Services
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Allow WeatherDash to access your location to show weather for your current area.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              {!isFetching ? (
                <>
                  <button
                    onClick={handleDismiss}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    Not Now
                  </button>
                  <button
                    onClick={handleAllow}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    Allow
                  </button>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center py-2 animate-pulse">
                  <span className="text-sm font-medium text-primary">Fetching Location...</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <p className="text-[12px] text-red-400 text-center mt-3 font-medium animate-in fade-in slide-in-from-bottom-2">
                {errorMessage}
              </p>
            )}

            {/* Privacy note */}
            <p className="text-[10px] text-muted-foreground text-center mt-4">
              Your location is only used to find the nearest city. We don&apos;t store your exact location.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LocationPrompt;
