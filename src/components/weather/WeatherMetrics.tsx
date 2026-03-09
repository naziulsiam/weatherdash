import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { motion } from 'framer-motion';
import { Wind, Droplets, Sun, Eye, Gauge, Thermometer } from 'lucide-react';
import Sparkline from './Sparkline';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  delay: number;
  sparkValues?: number[];
  sparkColor?: string;
  fillPercent?: number;
  fillColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon, label, value, subtitle, delay, sparkValues, sparkColor, fillPercent, fillColor,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    className="glass-card rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden"
  >
    {/* Liquid fill background */}
    {fillPercent !== undefined && (
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out rounded-b-2xl"
        style={{
          height: `${fillPercent}%`,
          background: `linear-gradient(to top, ${fillColor || 'hsl(200 70% 50% / 0.12)'}, transparent)`,
        }}
      />
    )}

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        {sparkValues && <Sparkline values={sparkValues} color={sparkColor} width={60} height={20} />}
      </div>
      <span className="text-2xl font-light text-foreground block">{value}</span>
      {subtitle && <span className="text-[11px] text-muted-foreground">{subtitle}</span>}
    </div>
  </motion.div>
);

const getUvInfo = (uv: number) => {
  if (uv <= 2) return { label: 'Low', color: 'hsl(142, 76%, 45%)' };
  if (uv <= 5) return { label: 'Moderate', color: 'hsl(48, 96%, 53%)' };
  if (uv <= 7) return { label: 'High', color: 'hsl(25, 95%, 53%)' };
  if (uv <= 10) return { label: 'Very High', color: 'hsl(0, 84%, 60%)' };
  return { label: 'Extreme', color: 'hsl(280, 70%, 55%)' };
};

const WeatherMetrics: React.FC = () => {
  const { weather, loading } = useWeather();

  if (loading || !weather) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-static rounded-2xl p-4 h-28 animate-pulse">
            <div className="h-3 w-16 bg-white/10 rounded mb-3" />
            <div className="h-6 w-12 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const { current, sparklines } = weather;
  const uv = getUvInfo(current.uvIndex);
  const baseDelay = 0.5;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <MetricCard
        icon={<Wind size={16} strokeWidth={1.5} className="text-muted-foreground" />}
        label="Wind"
        value={`${current.windSpeed} mph`}
        subtitle={`Direction: ${current.windDirection}`}
        delay={baseDelay}
        sparkValues={sparklines.wind.values}
        sparkColor="hsl(187, 85%, 53%)"
      />
      <MetricCard
        icon={<Droplets size={16} strokeWidth={1.5} className="text-blue-400" />}
        label="Humidity"
        value={`${current.humidity}%`}
        subtitle={current.humidity > 70 ? 'Very humid' : current.humidity > 50 ? 'Comfortable' : 'Dry'}
        delay={baseDelay + 0.05}
        sparkValues={sparklines.humidity.values}
        sparkColor="hsl(210, 80%, 60%)"
        fillPercent={current.humidity}
        fillColor="hsl(210 80% 50% / 0.08)"
      />
      <MetricCard
        icon={<Sun size={16} strokeWidth={1.5} style={{ color: uv.color }} />}
        label="UV Index"
        value={`${current.uvIndex}`}
        subtitle={uv.label}
        delay={baseDelay + 0.1}
        sparkValues={sparklines.uv.values}
        sparkColor={uv.color}
      />
      <MetricCard
        icon={<Eye size={16} strokeWidth={1.5} className="text-muted-foreground" />}
        label="Visibility"
        value={`${current.visibility} mi`}
        subtitle={current.visibility >= 8 ? 'Clear' : current.visibility >= 4 ? 'Moderate' : 'Poor'}
        delay={baseDelay + 0.15}
        sparkValues={sparklines.visibility.values}
        sparkColor="hsl(187, 85%, 53%)"
      />
      <MetricCard
        icon={<Gauge size={16} strokeWidth={1.5} className="text-muted-foreground" />}
        label="Pressure"
        value={`${current.pressure}`}
        subtitle="hPa"
        delay={baseDelay + 0.2}
        sparkValues={sparklines.pressure.values}
        sparkColor="hsl(187, 85%, 53%)"
      />
      <MetricCard
        icon={<Thermometer size={16} strokeWidth={1.5} className="text-orange-400" />}
        label="Dew Point"
        value={`${current.dewPoint}°`}
        subtitle="Moisture level"
        delay={baseDelay + 0.25}
        sparkValues={sparklines.temp.values}
        sparkColor="hsl(25, 95%, 53%)"
      />
    </div>
  );
};

export default WeatherMetrics;
