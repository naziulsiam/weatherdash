import React from 'react';
import { WeatherCondition } from '@/data/mockWeather';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

interface Props {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<Props> = ({ condition, size = 24, className = '' }) => {
  const configs: Record<WeatherCondition, { Icon: typeof Sun; color: string; anim: string }> = {
    sunny: { Icon: Sun, color: 'text-amber-400', anim: 'animate-float' },
    'clear-night': { Icon: Moon, color: 'text-indigo-200', anim: 'animate-pulse' },
    cloudy: { Icon: Cloud, color: 'text-gray-400', anim: 'animate-float' },
    rainy: { Icon: CloudRain, color: 'text-blue-400', anim: 'animate-float' },
    snowy: { Icon: CloudSnow, color: 'text-blue-200', anim: 'animate-float' },
    stormy: { Icon: CloudLightning, color: 'text-purple-400', anim: 'animate-float' },
  };

  const { Icon, color, anim } = configs[condition];
  return <Icon size={size} strokeWidth={1.5} className={`${color} ${anim} ${className}`} />;
};

export default WeatherIcon;
