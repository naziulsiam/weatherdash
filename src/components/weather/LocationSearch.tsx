import React, { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { PRESET_CITIES, weatherScenarios } from '@/data/mockWeather';
import { MapPin, Search, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';

const LocationSearch: React.FC = () => {
  const { selectCity, selectedCity, convertTemp, unit } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = PRESET_CITIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGeolocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => selectCity('Miami'),
        () => console.log('Geolocation denied'),
        { timeout: 5000 }
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <div className="glass-static rounded-xl flex items-center gap-2 px-4 py-2.5">
          <Search size={16} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
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

        {showDropdown && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-1 left-0 right-0 glass-static rounded-xl overflow-hidden z-50"
          >
            {filteredCities.map(city => (
              <button
                key={city.name}
                onClick={() => { selectCity(city.name); setSearchQuery(''); setShowDropdown(false); }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <MapPin size={14} strokeWidth={1.5} className="text-muted-foreground" />
                <span>{city.name}</span>
                <span className="text-muted-foreground text-xs ml-auto">{city.country}</span>
              </button>
            ))}
            {filteredCities.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
            )}
          </motion.div>
        )}
      </div>

      {/* City pills with live data */}
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
