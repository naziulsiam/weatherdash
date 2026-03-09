import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { motion } from 'framer-motion';

const TempToggle: React.FC = () => {
  const { unit, setUnit } = useWeather();

  return (
    <div className="glass-static rounded-full p-0.5 flex items-center relative w-[88px] h-9">
      <motion.div
        className="absolute w-10 h-8 rounded-full"
        style={{ background: 'hsl(187 85% 53% / 0.15)', border: '1px solid hsl(187 85% 53% / 0.3)' }}
        animate={{ x: unit === 'F' ? 2 : 44 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      <button
        onClick={() => setUnit('F')}
        className={`relative z-10 w-10 h-8 rounded-full text-xs font-semibold transition-colors duration-200 ${
          unit === 'F' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        °F
      </button>
      <button
        onClick={() => setUnit('C')}
        className={`relative z-10 w-10 h-8 rounded-full text-xs font-semibold transition-colors duration-200 ${
          unit === 'C' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        °C
      </button>
    </div>
  );
};

export default TempToggle;
