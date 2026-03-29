import React, { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';

const DailyForecast: React.FC = () => {
  const { weather, convertTemp, loading } = useWeather();
  const [expanded, setExpanded] = useState<number | null>(null);

  if (loading || !weather) {
    return (
      <div className="glass-static rounded-2xl p-5">
        <div className="h-4 w-32 bg-white/10 rounded-full mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const allTemps = weather.daily.flatMap(d => [d.high, d.low]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const tempRange = globalMax - globalMin || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-static rounded-2xl p-5"
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        5-Day Forecast
      </h3>
      <div className="space-y-1">
        {weather.daily.map((day, i) => {
          const lowPct = ((day.low - globalMin) / tempRange) * 100;
          const highPct = ((day.high - globalMin) / tempRange) * 100;
          const isExpanded = expanded === i;

          return (
            <motion.div
              key={i}
              layout
              onClick={() => setExpanded(isExpanded ? null : i)}
              className="cursor-pointer rounded-xl transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3 py-3 px-3">
                <span className="text-sm font-medium w-12">{i === 0 ? 'Today' : day.day}</span>
                <WeatherIcon condition={day.condition} size={18} />
                {day.precipitation > 15 ? (
                  <div className="flex items-center gap-0.5 w-10">
                    <Droplets size={10} strokeWidth={1.5} className="text-blue-400" />
                    <span className="text-[10px] text-blue-400">{day.precipitation}%</span>
                  </div>
                ) : <div className="w-10" />}
                <span className="text-xs text-muted-foreground w-8 text-right">{convertTemp(day.low)}°</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 relative mx-1">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${lowPct}%`,
                      right: `${100 - highPct}%`,
                      background: 'linear-gradient(to right, hsl(210 80% 60%), hsl(var(--primary)), hsl(30 90% 60%))',
                    }}
                  />
                </div>
                <span className="text-xs font-medium w-8">{convertTemp(day.high)}°</span>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 flex gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Droplets size={12} strokeWidth={1.5} className="text-blue-400" />
                        <span>Humidity: {day.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind size={12} strokeWidth={1.5} />
                        <span>Wind: {day.wind} mph</span>
                      </div>
                      <span>{day.date}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DailyForecast;
