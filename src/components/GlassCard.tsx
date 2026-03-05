import { ReactNode } from 'react';
import { motion } from 'motion/react';

export function GlassCard({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}
