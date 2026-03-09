import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WeatherData, weatherScenarios } from '@/data/mockWeather';

interface WeatherContextType {
  weather: WeatherData | null;
  loading: boolean;
  unit: 'F' | 'C';
  setUnit: (u: 'F' | 'C') => void;
  selectCity: (city: string) => void;
  selectedCity: string;
  convertTemp: (f: number) => number;
  dismissAlert: (id: string) => void;
  dismissedAlerts: string[];
  ready: boolean;
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider');
  return ctx;
};

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<'F' | 'C'>('F');
  const [selectedCity, setSelectedCity] = useState('Miami');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const selectCity = useCallback((city: string) => {
    setLoading(true);
    setSelectedCity(city);
    setDismissedAlerts([]);
    setReady(false);
    setTimeout(() => {
      setWeather(weatherScenarios[city] || weatherScenarios['Miami']);
      setLoading(false);
      setTimeout(() => setReady(true), 100);
    }, 800);
  }, []);

  const convertTemp = useCallback((f: number) => {
    return unit === 'C' ? Math.round((f - 32) * 5 / 9) : f;
  }, [unit]);

  const dismissAlert = useCallback((id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  }, []);

  useEffect(() => {
    selectCity('Miami');
  }, [selectCity]);

  return (
    <WeatherContext.Provider value={{ weather, loading, unit, setUnit, selectCity, selectedCity, convertTemp, dismissAlert, dismissedAlerts, ready }}>
      {children}
    </WeatherContext.Provider>
  );
};
