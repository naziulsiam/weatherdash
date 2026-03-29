import React from 'react';
import { motion } from 'framer-motion';

const BrandLogo: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="flex items-center gap-2"
  >
    <span className="brand-gradient text-2xl md:text-3xl font-extrabold tracking-tight">
      WeatherDash
    </span>
  </motion.div>
);

export default BrandLogo;
