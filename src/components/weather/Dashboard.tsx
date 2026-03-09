import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { motion } from 'framer-motion';
import WeatherBackground from '@/components/weather/WeatherBackground';
import WeatherAlerts from '@/components/weather/WeatherAlerts';
import LocationSearch from '@/components/weather/LocationSearch';
import TempToggle from '@/components/weather/TempToggle';
import CurrentWeather from '@/components/weather/CurrentWeather';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import WeatherMetrics from '@/components/weather/WeatherMetrics';
import BrandLogo from '@/components/weather/BrandLogo';
import WeatherLoader from '@/components/weather/WeatherLoader';

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Dashboard: React.FC = () => {
  const { weather, loading } = useWeather();

  // Show loader on initial load
  if (!weather && loading) {
    return <WeatherLoader />;
  }

  return (
    <div className="relative min-h-screen">
      <WeatherBackground condition={weather?.current.condition || 'sunny'} />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Sticky Header */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-between gap-4 mb-6 sticky top-0 z-30 py-3 -mx-4 px-4"
          style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          <BrandLogo />
          <TempToggle />
        </motion.div>

        {/* Location */}
        <motion.div variants={fadeUp}>
          <LocationSearch />
        </motion.div>

        {/* Alerts */}
        <motion.div variants={fadeUp} className="mt-4">
          <WeatherAlerts />
        </motion.div>

        {/* Hero: Current Weather */}
        <motion.div variants={fadeUp}>
          <CurrentWeather />
        </motion.div>

        {/* Forecasts & Metrics */}
        <motion.div variants={fadeUp} className="space-y-4 pb-12">
          <HourlyForecast />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DailyForecast />
            <WeatherMetrics />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
