import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';

const states = [
  { icon: Sun, color: 'text-amber-400' },
  { icon: Cloud, color: 'text-gray-400' },
  { icon: CloudRain, color: 'text-blue-400' },
  { icon: CloudSnow, color: 'text-blue-200' },
];

const WeatherLoader: React.FC = () => {
  const [stateIndex, setStateIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex(prev => (prev + 1) % states.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = states[stateIndex].icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={stateIndex}
          initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7, rotate: 30 }}
          transition={{ duration: 0.25 }}
        >
          <CurrentIcon size={48} className={states[stateIndex].color} strokeWidth={1.5} />
        </motion.div>
      </AnimatePresence>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="brand-gradient text-xl font-bold mt-4 tracking-tight"
      >
        WeatherDash
      </motion.span>
    </div>
  );
};

export default WeatherLoader;
