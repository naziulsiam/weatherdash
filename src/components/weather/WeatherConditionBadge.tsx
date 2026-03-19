import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { motion } from 'framer-motion';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, Zap } from 'lucide-react';

const conditionConfig = {
  sunny: {
    icon: Sun,
    label: 'Sunny',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-500/20',
    animate: 'spin-slow'
  },
  'clear-night': {
    icon: Moon,
    label: 'Clear Night',
    gradient: 'from-indigo-400 to-purple-500',
    bg: 'bg-indigo-500/20',
    animate: 'pulse-glow'
  },
  cloudy: {
    icon: Cloud,
    label: 'Cloudy',
    gradient: 'from-slate-400 to-gray-500',
    bg: 'bg-slate-500/20',
    animate: 'float'
  },
  rainy: {
    icon: CloudRain,
    label: 'Rainy',
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-500/20',
    animate: 'bounce-subtle'
  },
  snowy: {
    icon: CloudSnow,
    label: 'Snowy',
    gradient: 'from-blue-300 to-cyan-400',
    bg: 'bg-cyan-500/20',
    animate: 'float'
  },
  stormy: {
    icon: Zap,
    label: 'Stormy',
    gradient: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-500/20',
    animate: 'pulse-glow'
  },
};

const WeatherConditionBadge: React.FC = () => {
  const { weather, loading } = useWeather();

  if (loading || !weather) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-static animate-pulse">
        <div className="w-4 h-4 rounded-full bg-white/20" />
        <div className="w-12 h-3 bg-white/20 rounded" />
      </div>
    );
  }

  const condition = weather.current.condition;
  const config = conditionConfig[condition];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} border border-white/10`}
    >
      {/* Animated icon container */}
      <div className={`relative flex items-center justify-center w-5 h-5`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} opacity-50 blur-sm`} />

        {/* Icon with animation */}
        <motion.div
          animate={
            config.animate === 'spin-slow' ? { rotate: 360 } :
              config.animate === 'float' ? { y: [-1, 1, -1] } :
                config.animate === 'bounce-subtle' ? { y: [0, 2, 0] } :
                  config.animate === 'pulse-glow' ? { opacity: [1, 0.6, 1] } :
                    {}
          }
          transition={
            config.animate === 'spin-slow' ? { duration: 8, repeat: Infinity, ease: 'linear' } :
              { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative"
        >
          <Icon
            size={16}
            className={`bg-gradient-to-br ${config.gradient} bg-clip-text`}
            style={{
              filter: `drop-shadow(0 0 4px currentColor)`,
              color: 'currentColor'
            }}
          />
        </motion.div>

        {/* Live indicator dot */}
        <motion.span
          className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${config.gradient}`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Condition label */}
      <span className={`text-xs font-medium bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
        {config.label}
      </span>

      {/* Live text */}
      <motion.span
        className="text-[9px] text-muted-foreground uppercase tracking-wider"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Live
      </motion.span>
    </motion.div>
  );
};

export default WeatherConditionBadge;
