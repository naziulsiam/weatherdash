import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="glass-static rounded-full p-0.5 flex items-center relative w-[88px] h-9">
      <motion.div
        className="absolute w-10 h-8 rounded-full"
        style={{ background: 'hsl(var(--primary) / 0.15)', border: '1px solid hsl(var(--primary) / 0.3)' }}
        animate={{ x: theme === 'light' ? 2 : 44 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      <button
        onClick={() => setTheme('light')}
        className={`relative z-10 w-10 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          theme === 'light' ? 'text-primary' : 'text-muted-foreground'
        }`}
        aria-label="Light Mode"
      >
        <Sun size={16} strokeWidth={2} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`relative z-10 w-10 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          theme === 'dark' ? 'text-primary' : 'text-muted-foreground'
        }`}
        aria-label="Dark Mode"
      >
        <Moon size={16} strokeWidth={2} />
      </button>
    </div>
  );
};

export default ThemeToggle;
