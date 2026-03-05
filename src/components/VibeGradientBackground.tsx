import { motion } from 'motion/react';

export function VibeGradientBackground({ vibe }: { vibe: 'high' | 'medium' | 'low' | 'overwhelmed' | 'neutral' }) {
  const gradients = {
    high: 'radial-gradient(circle at 50% 50%, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    medium: 'radial-gradient(circle at 50% 50%, #fdfbfb 0%, #ebedee 100%)',
    low: 'radial-gradient(circle at 50% 50%, #e0c3fc 0%, #8ec5fc 100%)',
    overwhelmed: 'radial-gradient(circle at 50% 50%, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    neutral: 'radial-gradient(circle at 50% 50%, #d4fc79 0%, #96e6a1 100%)'
  };

  return (
    <motion.div
      className="fixed inset-0 -z-10 transition-colors duration-1000"
      animate={{ background: gradients[vibe] }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  );
}
