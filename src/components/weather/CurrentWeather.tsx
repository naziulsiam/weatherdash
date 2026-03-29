import React, { useEffect, useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { motion } from 'framer-motion';
import WeatherConditionBadge from './WeatherConditionBadge';
import { MapPin } from 'lucide-react';

const CountUpTemp: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{display}</>;
};

const CurrentWeather: React.FC = () => {
  const { weather, convertTemp, unit, loading, ready } = useWeather();

  if (loading || !weather) {
    return (
      <div className="py-12 space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full bg-white/5 animate-pulse" />
          <div className="space-y-4 flex-1">
            <div className="h-4 w-32 bg-white/10 rounded-full" />
            <div className="h-24 w-48 bg-white/10 rounded-2xl" />
            <div className="h-4 w-56 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const { current, location, country, timezone } = weather;

  // Safely calculate local time using UTC offset in seconds
  const getLocalTime = () => {
    try {
      const now = new Date();
      // Adjust system time to UTC, then add the city offset
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const cityTime = new Date(utc + (timezone * 1000));

      return cityTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      console.error('Time adjustment error:', e);
      return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  const localTime = getLocalTime();

  const temp = convertTemp(current.temp);
  const feelsLike = convertTemp(current.feelsLike);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-6 md:py-10"
    >
      <div className="flex flex-col items-center justify-center text-center">
        {/* Info */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <MapPin size={14} strokeWidth={1.5} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{location}, {country}</span>
            <span className="text-xs text-muted-foreground ml-2">{localTime}</span>
          </motion.div>

          <div className="mb-2">
            {ready ? (
              <span className="text-[96px] md:text-[140px] font-extralight tracking-tighter text-foreground leading-none animate-count-up inline-block">
                <CountUpTemp value={temp} />°
              </span>
            ) : (
              <span className="text-[96px] md:text-[140px] font-extralight tracking-tighter text-foreground leading-none opacity-30">
                --°
              </span>
            )}
          </div>

          {/* Real-time condition badge */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <WeatherConditionBadge />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground mb-1 font-medium"
          >
            {current.description}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            Feels like <span className="text-foreground font-medium">{feelsLike}°{unit}</span>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;
