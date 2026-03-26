import React, { useRef, useState, useEffect } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';

const HourlyForecast: React.FC = () => {
  const { weather, convertTemp, loading } = useWeather();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loading, weather]);

  if (loading || !weather) {
    return (
      <div className="glass-static rounded-2xl p-5">
        <div className="h-4 w-36 bg-white/10 rounded-full mb-5" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[56px] animate-pulse">
              <div className="h-3 w-8 bg-white/10 rounded" />
              <div className="h-5 w-5 bg-white/10 rounded-full" />
              <div className="h-4 w-8 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const temps = weather.hourly.map(h => convertTemp(h.temp));
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT || 1;

  // Build SVG bezier curve
  const minCurveWidth = weather.hourly.length * 56;
  const curveWidth = Math.max(minCurveWidth, containerWidth);
  const segmentWidth = curveWidth / weather.hourly.length;

  const curveHeight = 60;
  const padding = 8;

  const points = temps.map((t, i) => ({
    x: (segmentWidth / 2) + i * segmentWidth,
    y: curveHeight - padding - ((t - minT) / range) * (curveHeight - padding * 2),
  }));

  // Catmull-rom to bezier
  const buildPath = () => {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const curvePath = buildPath();
  const areaPath = `${curvePath} L ${points[points.length - 1].x} ${curveHeight} L ${points[0].x} ${curveHeight} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-static rounded-2xl p-5"
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        24-Hour Forecast
      </h3>
      <div ref={containerRef} className="overflow-x-auto snap-scroll pb-2 -mx-1 px-1">
        <div style={{ width: curveWidth, minWidth: curveWidth }} className="relative">
          {/* Bezier curve */}
          <svg width={curveWidth} height={curveHeight} className="absolute top-0 left-0">
            <defs>
              <linearGradient id="curveGradFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(187, 85%, 53%)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(187, 85%, 53%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#curveGradFill)" />
            <path d={curvePath} fill="none" stroke="hsl(187, 85%, 53%)" strokeWidth="2" strokeLinecap="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(187, 85%, 53%)" opacity="0.8" />
            ))}
          </svg>

          {/* Labels row */}
          <div className="flex pt-[68px]">
            {weather.hourly.map((hour, i) => (
              <div key={i} style={{ width: segmentWidth }} className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-foreground">{temps[i]}°</span>
                <WeatherIcon condition={hour.condition} size={14} />
                <span className="text-[10px] text-muted-foreground">{hour.time}</span>
                {hour.precipitation > 15 && (
                  <span className="text-[9px] text-blue-400">{hour.precipitation}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
