import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

const severityConfig = {
  advisory: { border: 'border-l-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-200', icon: 'text-yellow-400' },
  watch: { border: 'border-l-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-200', icon: 'text-orange-400' },
  warning: { border: 'border-l-red-500', bg: 'bg-red-500/10', text: 'text-red-200', icon: 'text-red-400' },
};

const WeatherAlerts: React.FC = () => {
  const { weather, dismissAlert, dismissedAlerts } = useWeather();
  if (!weather) return null;

  const visible = weather.alerts.filter(a => !dismissedAlerts.includes(a.id));
  if (!visible.length) return null;

  return (
    <div className="space-y-2 mb-6">
      <AnimatePresence>
        {visible.map(alert => {
          const cfg = severityConfig[alert.severity];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 300, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl border-l-4 ${cfg.border} ${cfg.bg} ${cfg.text} px-4 py-3 flex items-start gap-3 animate-pulse-border glass-static`}
            >
              <AlertTriangle size={16} strokeWidth={1.5} className={`${cfg.icon} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                    {alert.severity}
                  </span>
                  <span className="font-semibold text-sm">{alert.title}</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">{alert.description}</p>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Dismiss alert"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default WeatherAlerts;
