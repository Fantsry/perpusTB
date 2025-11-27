'use client';
import { motion } from 'framer-motion';

export default function AnimatedInfo({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
}