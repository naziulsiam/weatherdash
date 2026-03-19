import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WeatherData, weatherScenarios, WeatherAlert } from '@/data/mockWeather';
import { fetchWeatherByCity, fetchWeatherByCoords, WeatherApiResponse } from '@/services/weatherApi';

// Generate sparkline data from forecast
const generateSparklines = (hourly: any[]) => {
  const extractValues = (key: string, count: number = 12) => {
    return hourly.slice(0, count).map((h: any) => h[key] || Math.random() * 10);
  };

  return {
    wind: { values: extractValues('windSpeed', 12) },
    humidity: { values: extractValues('humidity', 12) },
    pressure: { values: Array.from({ length: 12 }, () => 1000 + Math.random() * 30) },
    uv: { values: extractValues('uvIndex', 12) },
    visibility: { values: extractValues('visibility', 12) },
    temp: { values: extractValues('temp', 12) },
  };
};

// Convert API response to our WeatherData format
const convertApiResponse = (apiData: WeatherApiResponse): WeatherData => {
  // Generate alerts based on weather conditions
  const alerts: WeatherAlert[] = [];

  if (apiData.current.condition === 'stormy') {
    alerts.push({
      id: 'storm',
      severity: 'warning',
      title: 'Severe Thunderstorm Warning',
      description: 'Thunderstorms detected in your area. Seek shelter if outdoors.',
    });
  }
  if (apiData.current.temp > 100) {
    alerts.push({
      id: 'heat',
      severity: 'warning',
      title: 'Extreme Heat Warning',
      description: 'Dangerously high temperatures. Stay hydrated and avoid prolonged sun exposure.',
    });
  }
  if (apiData.current.windSpeed > 25) {
    alerts.push({
      id: 'wind',
      severity: 'advisory',
      title: 'High Wind Advisory',
      description: 'Strong winds expected. Secure loose outdoor objects.',
    });
  }

  return {
    location: apiData.location,
    country: apiData.country,
    timezone: apiData.timezone,
    current: apiData.current,
    hourly: apiData.hourly,
    daily: apiData.daily,
    alerts,
    sparklines: generateSparklines(apiData.hourly),
  };
};

// Check if we have an API key
const hasApiKey = !!import.meta.env.VITE_OPENWEATHER_API_KEY;
console.log('WeatherContext: hasApiKey =', hasApiKey);
if (import.meta.env.PROD) {
  console.log('WeatherContext: Running in production mode');
}
console.log('WeatherContext: hasApiKey =', hasApiKey);
if (import.meta.env.PROD) {
  console.log('WeatherContext: Running in production mode');
}

interface WeatherContextType {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  unit: 'F' | 'C';
  setUnit: (u: 'F' | 'C') => void;
  selectCity: (city: string) => void;
  selectCityByCoords: (lat: number, lon: number) => Promise<void>;
  selectedCity: string;
  convertTemp: (f: number) => number;
  dismissAlert: (id: string) => void;
  dismissedAlerts: string[];
  ready: boolean;
  useRealApi: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'F' | 'C'>('F');
  const [selectedCity, setSelectedCity] = useState('Miami');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [useRealApi] = useState(hasApiKey);

  const selectCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    setSelectedCity(city);
    setDismissedAlerts([]);
    setReady(false);

    if (useRealApi) {
      try {
        const apiData = await fetchWeatherByCity(city);
        setWeather(convertApiResponse(apiData));
        setLoading(false);
        setTimeout(() => setReady(true), 100);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        // Fallback to mock data on error
        setTimeout(() => {
          setWeather(weatherScenarios[city] || weatherScenarios['Miami']);
          setLoading(false);
          setTimeout(() => setReady(true), 100);
        }, 500);
      }
    } else {
      // Use mock data
      setTimeout(() => {
        setWeather(weatherScenarios[city] || weatherScenarios['Miami']);
        setLoading(false);
        setTimeout(() => setReady(true), 100);
      }, 800);
    }
  }, [useRealApi]);

  const selectCityByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setDismissedAlerts([]);
    setReady(false);

    if (useRealApi) {
      try {
        const apiData = await fetchWeatherByCoords(lat, lon);
        setSelectedCity(apiData.location);
        setWeather(convertApiResponse(apiData));
        setLoading(false);
        setTimeout(() => setReady(true), 100);
      } catch (err) {
        console.error('WeatherContext: fetchWeatherByCoords error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        setLoading(false);
      }
    }
  }, [useRealApi]);

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
    <WeatherContext.Provider
      value={{
        weather,
        loading,
        error,
        unit,
        setUnit,
        selectCity,
        selectCityByCoords,
        selectedCity,
        convertTemp,
        dismissAlert,
        dismissedAlerts,
        ready,
        useRealApi,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
