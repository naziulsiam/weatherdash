import React, { useMemo } from 'react';
import { WeatherCondition } from '@/data/mockWeather';

interface Props {
  condition: WeatherCondition;
}

const PALETTES: Record<WeatherCondition, { mesh: string[]; accent: string }> = {
  sunny: {
    mesh: ['hsl(35 90% 55% / 0.35)', 'hsl(45 95% 60% / 0.25)', 'hsl(25 85% 50% / 0.2)', 'hsl(40 80% 65% / 0.15)'],
    accent: 'hsl(40 95% 60%)',
  },
  cloudy: {
    mesh: ['hsl(220 15% 40% / 0.3)', 'hsl(210 20% 50% / 0.2)', 'hsl(200 10% 45% / 0.25)', 'hsl(230 15% 35% / 0.15)'],
    accent: 'hsl(210 20% 60%)',
  },
  rainy: {
    mesh: ['hsl(220 60% 20% / 0.5)', 'hsl(200 70% 30% / 0.35)', 'hsl(210 50% 25% / 0.4)', 'hsl(190 60% 35% / 0.2)'],
    accent: 'hsl(200 70% 50%)',
  },
  snowy: {
    mesh: ['hsl(210 40% 35% / 0.3)', 'hsl(200 30% 50% / 0.2)', 'hsl(220 20% 60% / 0.15)', 'hsl(0 0% 90% / 0.08)'],
    accent: 'hsl(210 50% 80%)',
  },
  stormy: {
    mesh: ['hsl(270 50% 25% / 0.5)', 'hsl(250 60% 30% / 0.4)', 'hsl(280 40% 20% / 0.35)', 'hsl(240 50% 35% / 0.25)'],
    accent: 'hsl(270 60% 60%)',
  },
  'clear-night': {
    mesh: ['hsl(240 60% 15% / 0.5)', 'hsl(260 50% 10% / 0.4)', 'hsl(280 40% 12% / 0.45)', 'hsl(230 50% 20% / 0.3)'],
    accent: 'hsl(240 50% 80%)',
  },
};

const WeatherBackground: React.FC<Props> = ({ condition }) => {
  const palette = PALETTES[condition];

  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${4 + Math.random() * 4}s`,
      size: 1 + Math.random() * 3,
    })),
    []);

  const rainDrops = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.5 + Math.random() * 0.4}s`,
      opacity: 0.3 + Math.random() * 0.5,
      height: 18 + Math.random() * 20,
    })),
    []);

  const snowFlakes = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${3 + Math.random() * 5}s`,
      size: 2 + Math.random() * 6,
      opacity: 0.4 + Math.random() * 0.5,
    })),
    []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* === ANIMATED MESH GRADIENT === */}
      <div className="absolute inset-0">
        <div
          className="absolute w-[80%] h-[80%] rounded-full animate-mesh blur-[120px]"
          style={{ top: '-20%', left: '-10%', background: `radial-gradient(circle, ${palette.mesh[0]}, transparent 70%)` }}
        />
        <div
          className="absolute w-[70%] h-[70%] rounded-full animate-mesh-alt blur-[100px]"
          style={{ bottom: '-15%', right: '-10%', background: `radial-gradient(circle, ${palette.mesh[1]}, transparent 70%)` }}
        />
        <div
          className="absolute w-[60%] h-[60%] rounded-full animate-mesh blur-[80px]"
          style={{ top: '20%', right: '10%', background: `radial-gradient(circle, ${palette.mesh[2]}, transparent 70%)`, animationDelay: '5s' }}
        />
        <div
          className="absolute w-[50%] h-[50%] rounded-full animate-mesh-alt blur-[90px]"
          style={{ bottom: '10%', left: '20%', background: `radial-gradient(circle, ${palette.mesh[3]}, transparent 70%)`, animationDelay: '10s' }}
        />
      </div>

      {/* === WIND-REACTIVE PARTICLES === */}
      <div className="absolute inset-0">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full animate-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: palette.accent,
              opacity: 0.15,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* === CONDITION-SPECIFIC EFFECTS === */}

      {/* SUNNY: Large sun orb + rotating rays */}
      {condition === 'sunny' && (
        <>
          <div className="absolute -top-24 right-[5%] w-[500px] h-[500px] rounded-full animate-sun-pulse blur-[100px]"
            style={{ background: 'radial-gradient(circle, hsl(45 95% 65% / 0.4), transparent 70%)' }} />
          <div className="absolute -top-10 right-[12%] w-[350px] h-[350px] rounded-full animate-sun-pulse blur-[60px]"
            style={{ background: 'radial-gradient(circle, hsl(40 90% 70% / 0.3), transparent 70%)', animationDelay: '1.5s' }} />
          <div className="absolute top-0 right-[5%] w-[600px] h-[600px] opacity-25 animate-sun-rotate"
            style={{ background: 'conic-gradient(from 0deg, transparent, hsl(40 90% 60% / 0.4), transparent, hsl(40 90% 60% / 0.3), transparent, hsl(40 90% 60% / 0.35), transparent, hsl(40 90% 60% / 0.25), transparent)' }} />
          <div className="absolute bottom-0 inset-x-0 h-1/3" style={{ background: 'linear-gradient(to top, hsl(30 80% 50% / 0.12), transparent)' }} />
        </>
      )}

      {/* CLOUDY: Multiple drifting cloud layers */}
      {condition === 'cloudy' && (
        <>
          {[
            { top: '5%', w: 450, h: 90, opacity: 0.1, dur: '22s', delay: '0s' },
            { top: '12%', w: 350, h: 70, opacity: 0.08, dur: '30s', delay: '5s' },
            { top: '22%', w: 550, h: 110, opacity: 0.06, dur: '38s', delay: '12s' },
            { top: '8%', w: 280, h: 55, opacity: 0.09, dur: '18s', delay: '20s' },
            { top: '30%', w: 400, h: 80, opacity: 0.05, dur: '45s', delay: '8s' },
            { top: '18%', w: 320, h: 65, opacity: 0.07, dur: '28s', delay: '15s' },
          ].map((c, i) => (
            <div key={i} className="absolute animate-cloud blur-2xl rounded-full"
              style={{ top: c.top, width: c.w, height: c.h, background: `hsl(0 0% 80% / ${c.opacity})`, animationDuration: c.dur, animationDelay: c.delay }} />
          ))}
          <div className="absolute top-[10%] left-1/3 w-[500px] h-[400px] rounded-full blur-[120px]"
            style={{ background: 'hsl(210 15% 50% / 0.06)' }} />
        </>
      )}

      {/* RAINY: Dark clouds + rain streaks + puddle reflections */}
      {condition === 'rainy' && (
        <>
          {[
            { top: '0%', w: 500, h: 130, opacity: 0.12, dur: '18s', delay: '0s' },
            { top: '5%', w: 400, h: 100, opacity: 0.1, dur: '25s', delay: '6s' },
            { top: '2%', w: 350, h: 90, opacity: 0.08, dur: '22s', delay: '14s' },
          ].map((c, i) => (
            <div key={i} className="absolute animate-cloud blur-3xl rounded-full"
              style={{ top: c.top, width: c.w, height: c.h, background: `hsl(220 40% 30% / ${c.opacity})`, animationDuration: c.dur, animationDelay: c.delay }} />
          ))}
          {rainDrops.map(p => (
            <div key={p.id} className="absolute animate-rain"
              style={{
                left: p.left, top: '-5%', width: '1.5px', height: `${p.height}px`,
                background: `linear-gradient(to bottom, transparent, hsl(200 80% 70% / ${p.opacity}))`,
                animationDelay: p.delay, animationDuration: p.duration,
              }} />
          ))}
          <div className="absolute bottom-0 inset-x-0 h-1/4"
            style={{ background: 'linear-gradient(to top, hsl(210 60% 40% / 0.1), transparent)' }} />
        </>
      )}

      {/* SNOWY: Misty atmosphere + snowflakes + frost glow */}
      {condition === 'snowy' && (
        <>
          <div className="absolute top-[10%] left-[15%] w-[500px] h-[350px] rounded-full blur-[120px]"
            style={{ background: 'hsl(210 40% 70% / 0.08)' }} />
          <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[300px] rounded-full blur-[100px]"
            style={{ background: 'hsl(0 0% 95% / 0.05)' }} />
          {snowFlakes.map(p => (
            <div key={p.id} className="absolute rounded-full animate-snow"
              style={{
                left: p.left, top: '-3%',
                width: `${p.size}px`, height: `${p.size}px`,
                background: `radial-gradient(circle, hsl(210 40% 95% / ${p.opacity}), transparent)`,
                boxShadow: p.size > 4 ? `0 0 ${p.size * 3}px hsl(210 40% 95% / 0.3)` : 'none',
                animationDelay: p.delay, animationDuration: p.duration,
              }} />
          ))}
          <div className="absolute bottom-0 inset-x-0 h-1/5"
            style={{ background: 'linear-gradient(to top, hsl(210 30% 90% / 0.06), transparent)' }} />
        </>
      )}

      {/* STORMY: Ominous clouds + lightning + purple rain */}
      {condition === 'stormy' && (
        <>
          {[
            { top: '0%', w: 600, h: 160, opacity: 0.15, dur: '14s', delay: '0s' },
            { top: '4%', w: 450, h: 120, opacity: 0.1, dur: '20s', delay: '4s' },
          ].map((c, i) => (
            <div key={i} className="absolute animate-cloud blur-3xl rounded-full"
              style={{ top: c.top, width: c.w, height: c.h, background: `hsl(270 40% 25% / ${c.opacity})`, animationDuration: c.dur, animationDelay: c.delay }} />
          ))}
          <div className="absolute inset-0 animate-lightning" style={{ background: 'hsl(270 50% 80% / 0.12)' }} />
          <div className="absolute inset-0" style={{ background: 'hsl(0 0% 100% / 0.04)', animation: 'lightning-flash 6s ease-in-out infinite 2s' }} />
          {rainDrops.slice(0, 70).map(p => (
            <div key={p.id} className="absolute animate-rain"
              style={{
                left: p.left, top: '-5%', width: '2px', height: `${p.height + 10}px`,
                background: `linear-gradient(to bottom, transparent, hsl(260 60% 70% / ${p.opacity * 0.6}))`,
                animationDelay: p.delay, animationDuration: `${parseFloat(p.duration) * 0.7}s`,
              }} />
          ))}
          <div className="absolute top-[25%] left-[35%] w-[350px] h-[350px] rounded-full blur-[80px] animate-sun-pulse"
            style={{ background: 'hsl(270 50% 50% / 0.08)' }} />
        </>
      )}

      {/* CLEAR NIGHT: Moon + Twinkling Stars */}
      {condition === 'clear-night' && (
        <>
          <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, hsl(230 60% 30% / 0.3), transparent 70%)' }} />
          <div className="absolute top-[15%] right-[20%] w-[80px] h-[80px] rounded-full bg-indigo-50/10 backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.1)]" />
          {particles.slice(0, 30).map(p => (
            <div key={p.id} className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: p.left, top: p.top, width: '1.5px', height: '1.5px',
                opacity: 0.4, animationDelay: p.delay, animationDuration: '3s'
              }} />
          ))}
        </>
      )}

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
};

export default WeatherBackground;
