import React from 'react';
import { WeatherCondition } from '@/data/mockWeather';

interface Props {
  condition: WeatherCondition;
}

const conditionStyles: Record<WeatherCondition, { gradient: string; elements: React.ReactNode }> = {
  sunny: {
    gradient: 'from-amber-400/20 via-yellow-500/10 to-orange-400/20',
    elements: (
      <>
        <div className="absolute inset-0 animate-sun-rotate" style={{
          background: 'conic-gradient(from 0deg, transparent, hsl(45 90% 60% / 0.3), transparent, hsl(45 90% 60% / 0.2), transparent, hsl(45 90% 60% / 0.3), transparent)',
        }} />
        <div className="absolute inset-[15%] rounded-full animate-sun-pulse" style={{
          background: 'radial-gradient(circle, hsl(45 95% 65% / 0.6), hsl(35 90% 55% / 0.2), transparent)',
        }} />
      </>
    ),
  },
  'clear-night': {
    gradient: 'from-indigo-900/40 via-purple-900/20 to-slate-900/40',
    elements: (
      <>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-100/20 blur-xl animate-pulse" />
        <div className="absolute top-[25%] right-[25%] w-[20%] h-[20%] rounded-full bg-indigo-50/40" />
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white opacity-40 animate-pulse" style={{
            top: `${Math.random() * 80}%`, left: `${Math.random() * 80}%`,
            width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        ))}
      </>
    ),
  },
  cloudy: {
    gradient: 'from-gray-400/10 via-slate-500/15 to-gray-300/10',
    elements: (
      <>
        {[
          { top: '20%', left: '10%', w: '65%', h: '30%', opacity: 0.15, dur: '8s' },
          { top: '35%', left: '25%', w: '55%', h: '25%', opacity: 0.1, dur: '12s' },
          { top: '50%', left: '5%', w: '50%', h: '20%', opacity: 0.12, dur: '10s' },
        ].map((c, i) => (
          <div key={i} className="absolute rounded-full blur-lg" style={{
            top: c.top, left: c.left, width: c.w, height: c.h,
            background: `hsl(0 0% 80% / ${c.opacity})`,
            animation: `float ${c.dur} ease-in-out infinite`,
          }} />
        ))}
      </>
    ),
  },
  rainy: {
    gradient: 'from-blue-500/15 via-indigo-600/10 to-blue-400/15',
    elements: (
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute animate-rain" style={{
            left: `${10 + Math.random() * 80}%`, top: '-10%',
            width: '1px', height: `${10 + Math.random() * 15}px`,
            background: 'linear-gradient(to bottom, transparent, hsl(210 80% 70% / 0.5))',
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${0.5 + Math.random() * 0.3}s`,
          }} />
        ))}
      </>
    ),
  },
  snowy: {
    gradient: 'from-blue-300/10 via-white/5 to-blue-200/10',
    elements: (
      <>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute rounded-full animate-snow" style={{
            left: `${10 + Math.random() * 80}%`, top: '-5%',
            width: `${2 + Math.random() * 4}px`, height: `${2 + Math.random() * 4}px`,
            background: 'hsl(210 40% 95% / 0.7)',
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }} />
        ))}
      </>
    ),
  },
  stormy: {
    gradient: 'from-purple-500/15 via-indigo-600/10 to-violet-500/15',
    elements: (
      <>
        <div className="absolute inset-0 animate-lightning" style={{ background: 'hsl(270 60% 80% / 0.2)' }} />
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute animate-rain" style={{
            left: `${10 + Math.random() * 80}%`, top: '-10%',
            width: '1.5px', height: `${12 + Math.random() * 12}px`,
            background: 'linear-gradient(to bottom, transparent, hsl(260 60% 70% / 0.4))',
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${0.4 + Math.random() * 0.3}s`,
          }} />
        ))}
      </>
    ),
  },
};

const WeatherVisualizer: React.FC<Props> = ({ condition }) => {
  const style = conditionStyles[condition];

  return (
    <div className="relative w-[200px] h-[200px] md:w-[280px] md:h-[280px] mx-auto">
      {/* Outer glow */}
      <div className={`absolute -inset-4 rounded-full bg-gradient-to-br ${style.gradient} blur-2xl opacity-60`} />
      {/* Glass circle */}
      <div className="absolute inset-0 rounded-full glass-static overflow-hidden">
        {style.elements}
      </div>
      {/* Inner ring */}
      <div className="absolute inset-1 rounded-full border border-white/5" />
    </div>
  );
};

export default WeatherVisualizer;
