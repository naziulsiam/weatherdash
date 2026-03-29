import React, { useMemo } from 'react';
import { WeatherCondition } from '@/data/mockWeather';

interface Props {
  condition: WeatherCondition;
}

const PALETTES: Record<WeatherCondition, { mesh: string[]; accent: string; vignette: string; overlay: string }> = {
  sunny: {
    mesh: ['hsl(45 100% 60% / 0.5)', 'hsl(35 90% 55% / 0.4)', 'hsl(50 95% 65% / 0.3)', 'hsl(25 80% 50% / 0.25)'],
    accent: 'hsl(45 100% 60%)',
    vignette: 'radial-gradient(circle, transparent 40%, hsl(35 80% 40% / 0.2))',
    overlay: 'bg-amber-500/5',
  },
  cloudy: {
    mesh: ['hsl(210 20% 65% / 0.5)', 'hsl(200 15% 55% / 0.45)', 'hsl(220 10% 45% / 0.4)', 'hsl(215 25% 75% / 0.3)'],
    accent: 'hsl(210 20% 70%)',
    vignette: 'radial-gradient(circle, transparent 50%, hsl(210 20% 30% / 0.15))',
    overlay: 'bg-slate-500/10',
  },
  rainy: {
    mesh: ['hsl(215 50% 20% / 0.6)', 'hsl(200 60% 30% / 0.5)', 'hsl(220 40% 15% / 0.55)', 'hsl(210 50% 25% / 0.45)'],
    accent: 'hsl(205 70% 55%)',
    vignette: 'radial-gradient(circle, transparent 30%, hsl(220 50% 5% / 0.3))',
    overlay: 'bg-blue-900/20',
  },
  snowy: {
    mesh: ['hsl(210 30% 90% / 0.5)', 'hsl(200 20% 80% / 0.4)', 'hsl(220 15% 95% / 0.35)', 'hsl(210 40% 98% / 0.2)'],
    accent: 'hsl(210 50% 90%)',
    vignette: 'radial-gradient(circle, transparent 60%, hsl(210 30% 60% / 0.1))',
    overlay: 'bg-white/10',
  },
  stormy: {
    mesh: ['hsl(260 40% 10% / 0.7)', 'hsl(280 50% 20% / 0.55)', 'hsl(240 60% 15% / 0.6)', 'hsl(270 30% 5% / 0.5)'],
    accent: 'hsl(270 70% 65%)',
    vignette: 'radial-gradient(circle, transparent 20%, hsl(280 60% 2% / 0.5))',
    overlay: 'bg-purple-900/25',
  },
  'clear-night': {
    mesh: ['hsl(230 60% 8% / 0.8)', 'hsl(250 50% 12% / 0.7)', 'hsl(240 70% 5% / 0.75)', 'hsl(260 40% 10% / 0.6)'],
    accent: 'hsl(230 60% 80%)',
    vignette: 'radial-gradient(circle, transparent 30%, hsl(240 80% 0% / 0.6))',
    overlay: 'bg-indigo-950/20',
  },
};

const WeatherBackground: React.FC<Props> = ({ condition }) => {
  const palette = PALETTES[condition];

  const cloudLayers = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      width: 300 + Math.random() * 400,
      height: 100 + Math.random() * 150,
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 100}%`,
      duration: `${40 + Math.random() * 60}s`,
      delay: `-${Math.random() * 60}s`,
      opacity: 0.05 + Math.random() * 0.1,
    })),
    []);

  const rainDrops = useMemo(() =>
    Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.3 + Math.random() * 0.3}s`,
      opacity: 0.2 + Math.random() * 0.5,
      height: 30 + Math.random() * 40,
    })),
    []);

  const snowFlakes = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${5 + Math.random() * 8}s`,
      size: 2 + Math.random() * 6,
      opacity: 0.3 + Math.random() * 0.6,
      blur: 1 + Math.random() * 3,
    })),
    []);

  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 0.5 + Math.random() * 2,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    })),
    []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-1000">
      {/* === ANIMATED MESH GRADIENT === */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        <div
          className="absolute w-full h-full rounded-full animate-mesh blur-[160px]"
          style={{ top: '-35%', left: '-25%', background: `radial-gradient(circle, ${palette.mesh[0]}, transparent 85%)` }}
        />
        <div
          className="absolute w-full h-full rounded-full animate-mesh-alt blur-[140px]"
          style={{ bottom: '-30%', right: '-25%', background: `radial-gradient(circle, ${palette.mesh[1]}, transparent 85%)`, animationDelay: '-8s' }}
        />
        <div
          className="absolute w-[90%] h-[90%] rounded-full animate-mesh blur-[120px]"
          style={{ top: '10%', right: '0%', background: `radial-gradient(circle, ${palette.mesh[2]}, transparent 85%)`, animationDelay: '-15s' }}
        />
        <div
          className="absolute w-[80%] h-[80%] rounded-full animate-mesh-alt blur-[130px]"
          style={{ bottom: '5%', left: '10%', background: `radial-gradient(circle, ${palette.mesh[3]}, transparent 85%)`, animationDelay: '-22s' }}
        />
      </div>

      {/* === VIGNETTE & DEPTH === */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000" style={{ background: palette.vignette }} />
      <div className={`absolute inset-0 pointer-events-none ${palette.overlay} transition-colors duration-1000`} />

      {/* === CONDITION-SPECIFIC EFFECTS === */}

      {/* SUNNY: Enhanced Sun + Glassmorphic Rays */}
      {condition === 'sunny' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Main Sun Orb */}
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full blur-[100px] opacity-60 animate-sun-pulse"
            style={{ background: 'radial-gradient(circle, hsl(45 100% 75%), hsl(35 90% 60% / 0.5) 40%, transparent 70%)' }} />
          {/* Inner Core */}
          <div className="absolute -top-10 -right-10 w-[400px] h-[400px] rounded-full blur-[40px] opacity-40 animate-sun-pulse"
            style={{ background: 'radial-gradient(circle, white, hsl(45 100% 80%) 50%, transparent 80%)' }} />
          
          {/* Rotating Glass Rays */}
          <div className="absolute top-0 right-0 w-[1200px] h-[1200px] animate-sun-rotate" style={{ animationDuration: '80s' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="absolute top-1/2 right-0 w-[600px] h-[40px] origin-right opacity-[0.05]"
                style={{ 
                  transform: `translateY(-50%) rotate(${i * 30}deg)`, 
                  background: 'linear-gradient(to left, hsl(45 100% 65%), transparent)',
                  clipPath: 'polygon(0 50%, 100% 0, 100% 100%)'
                }} />
            ))}
          </div>
        </div>
      )}

      {/* CLOUDY/RAINY/STORMY: Drifting Clouds */}
      {(condition === 'cloudy' || condition === 'rainy' || condition === 'stormy') && (
        <div className="absolute inset-0">
          {cloudLayers.map(c => (
            <div key={c.id} className="absolute rounded-full blur-[80px] animate-cloud-move"
              style={{
                width: `${c.width}px`,
                height: `${c.height}px`,
                top: c.top,
                background: condition === 'cloudy' ? 'hsl(210 20% 90%)' : 'hsl(220 30% 20%)',
                opacity: condition === 'cloudy' ? c.opacity : c.opacity * 2.5,
                animationDuration: c.duration,
                animationDelay: c.delay,
              }} />
          ))}
        </div>
      )}

      {/* RAINY: Enhanced Rain + Mist */}
      {condition === 'rainy' && (
        <div className="absolute inset-0">
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-blue-900/20 to-transparent blur-3xl opacity-50" />
          {rainDrops.map(p => (
            <div key={p.id} className="absolute animate-rain"
              style={{
                left: p.left, top: '-10%', width: '1.5px', height: `${p.height}px`,
                background: `linear-gradient(to bottom, transparent, hsl(200 80% 85% / ${p.opacity}))`,
                animationDelay: p.delay, animationDuration: p.duration,
              }} />
          ))}
        </div>
      )}

      {/* SNOWY: Enhanced Snowflakes + Fog */}
      {condition === 'snowy' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-[2px]" />
          {snowFlakes.map(p => (
            <div key={p.id} className="absolute rounded-full animate-snow"
              style={{
                left: p.left, top: '-5%',
                width: `${p.size}px`, height: `${p.size}px`,
                background: `radial-gradient(circle, white / ${p.opacity}, transparent)`,
                filter: `blur(${p.blur}px)`,
                animationDelay: p.delay, animationDuration: p.duration,
              }} />
          ))}
        </div>
      )}

      {/* STORMY: Dark Atmosphere + Lightning */}
      {condition === 'stormy' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 animate-lightning opacity-40 mix-blend-overlay" style={{ background: 'white' }} />
          <div className="absolute inset-0 animate-lightning" style={{ background: 'hsl(260 60% 85% / 0.2)', animationDelay: '1.2s' }} />
          {rainDrops.slice(0, 180).map(p => (
            <div key={p.id} className="absolute animate-rain"
              style={{
                left: p.left, top: '-10%', width: '1.8px', height: `${p.height + 20}px`,
                background: `linear-gradient(to bottom, transparent, hsl(210 90% 90% / ${p.opacity * 0.9}))`,
                animationDelay: p.delay, animationDuration: `${parseFloat(p.duration) * 0.5}s`,
              }} />
          ))}
        </div>
      )}

      {/* CLEAR NIGHT: Moon + Twinkling stars */}
      {condition === 'clear-night' && (
        <div className="absolute inset-0">
          {/* Moon */}
          <div className="absolute top-[15%] right-[20%] w-[120px] h-[120px] rounded-full bg-indigo-50/10 backdrop-blur-xl border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.15)] animate-float-slow" />
          <div className="absolute top-[18%] right-[22%] w-[100px] h-[100px] rounded-full bg-gradient-to-br from-indigo-50/40 to-transparent blur-md pointer-events-none" />
          
          {/* Stars */}
          {stars.map(s => (
            <div key={s.id} className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: s.left, top: s.top, width: `${s.size}px`, height: `${s.size}px`,
                boxShadow: s.size > 1.5 ? `0 0 ${s.size * 4}px white` : 'none',
                animationDelay: s.delay, animationDuration: s.duration,
              }} />
          ))}
        </div>
      )}

      {/* Final Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
};

export default WeatherBackground;
