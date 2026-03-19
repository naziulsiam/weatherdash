import React, { useState, useEffect, useCallback } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { PRESET_CITIES, weatherScenarios, findNearestCity } from '@/data/mockWeather';
import { searchCities, CitySearchResult } from '@/services/weatherApi';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const LocationSearch: React.FC = () => {
  const { selectCity, selectedCity, convertTemp, unit, useRealApi } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Search cities when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      if (useRealApi) {
        setIsSearching(true);
        try {
          const results = await searchCities(debouncedQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }
    };

    performSearch();
  }, [debouncedQuery, useRealApi]);

  const handleGeolocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestCity = findNearestCity(latitude, longitude);
          selectCity(nearestCity.name);
        },
        () => console.log('Geolocation denied'),
        { timeout: 10000, enableHighAccuracy: false }
      );
    }
  };

  const handleCitySelect = (cityName: string) => {
    selectCity(cityName);
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  // Filter preset cities for fallback (when no API)
  const filteredPresetCities = PRESET_CITIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine what to show in dropdown
  const showApiResults = useRealApi && searchResults.length > 0;
  const showPresetResults = !useRealApi && filteredPresetCities.length > 0;
  const showNoResults = searchQuery.length >= 2 && !isSearching && 
    ((useRealApi && searchResults.length === 0) || (!useRealApi && filteredPresetCities.length === 0));

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <div className="glass-static rounded-xl flex items-center gap-2 px-4 py-2.5">
          <Search size={16} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder={useRealApi ? "Search any city worldwide..." : "Search location..."}
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
          {isSearching && (
            <Loader2 size={16} className="text-muted-foreground animate-spin shrink-0" />
          )}
          <button
            onClick={handleGeolocate}
            className="shrink-0 p-1.5 rounded-lg transition-all duration-200 active:animate-press"
            aria-label="Use my location"
          >
            <div className="animate-radar rounded-full p-0.5">
              <Navigation size={14} strokeWidth={1.5} className="text-primary" />
            </div>
          </button>
        </div>

        {showDropdown && searchQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-1 left-0 right-0 glass-static rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
          >
            {/* API Search Results */}
            {showApiResults && (
              <>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-white/5">
                  Search Results
                </div>
                {searchResults.map((city, index) => (
                  <button
                    key={`${city.name}-${city.lat}-${index}`}
                    onClick={() => handleCitySelect(city.name)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <MapPin size={14} strokeWidth={1.5} className="text-primary shrink-0" />
                    <span className="truncate">{city.name}</span>
                    {city.state && (
                      <span className="text-muted-foreground text-xs">{city.state}</span>
                    )}
                    <span className="text-muted-foreground text-xs ml-auto shrink-0">{city.country}</span>
                  </button>
                ))}
              </>
            )}

            {/* Preset Cities Fallback */}
            {showPresetResults && (
              <>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-white/5">
                  Preset Cities
                </div>
                {filteredPresetCities.map(city => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <MapPin size={14} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
                    <span>{city.name}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{city.country}</span>
                  </button>
                ))}
              </>
            )}

            {/* No Results */}
            {showNoResults && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                {useRealApi ? 'No cities found. Try a different search.' : 'No preset cities found.'}
              </div>
            )}

            {/* Searching Indicator */}
            {isSearching && (
              <div className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Searching cities...
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Quick Access Pills */}
      <div className="flex gap-2 flex-wrap">
        {PRESET_CITIES.map(city => {
          const data = weatherScenarios[city.name];
          const isSelected = selectedCity === city.name;
          return (
            <motion.button
              key={city.name}
              onClick={() => selectCity(city.name)}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300
                ${isSelected
                  ? 'glass-static border-primary/40 shadow-[0_0_20px_-5px_hsl(187_85%_53%_/_0.3)] scale-105'
                  : 'glass-static hover:bg-white/[0.06]'
                }`}
            >
              <WeatherIcon condition={data.current.condition} size={14} />
              <span className={isSelected ? 'text-foreground' : 'text-muted-foreground'}>{city.name}</span>
              <span className={`text-[11px] ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                {convertTemp(data.current.temp)}°
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LocationSearch;
