'use client';
import { motion } from 'framer-motion';

export default function AnimatedButton({ children, href }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors shadow-lg hover:shadow-xl"
    >
      {children}
    </motion.a>
  );
}