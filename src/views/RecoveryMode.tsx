import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { triggerOverwhelmedMode } from '../lib/gemini';
import { Task } from '../App';

export function RecoveryMode({ tasks, onRecovered }: { key?: string, tasks: Task[], onRecovered: any }) {
  const [phase, setPhase] = useState<'breathing' | 'result'>('breathing');
  const [recoveryData, setRecoveryData] = useState<{message: string, tasks: any[]} | null>(null);

  useEffect(() => {
    // Start processing in background while breathing
    const process = async () => {
      try {
        const data = await triggerOverwhelmedMode(tasks);
        setRecoveryData(data);
      } catch (e) {
        console.error(e);
        // Fallback
        setRecoveryData({
          message: "Take it easy today.",
          tasks: tasks.filter(t => t.is_critical)
        });
      }
    };
    process();

    const timer = setTimeout(() => {
      setPhase('result');
    }, 4000); // 4 seconds of breathing

    return () => clearTimeout(timer);
  }, [tasks]);

  const handleAccept = () => {
    if (recoveryData) {
      // Merge back the tasks. Keep completed tasks, update pending with the new list
      const completed = tasks.filter(t => t.status === 'completed');
      const newPending = recoveryData.tasks.map(t => ({
        ...t,
        id: t.id || crypto.randomUUID(),
        status: 'pending'
      }));
      onRecovered([...completed, ...newPending]);
    } else {
      onRecovered(tasks);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <AnimatePresence mode="wait">
        {phase === 'breathing' ? (
          <motion.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full bg-white/10 border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.1)]"
            />
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="mt-12 text-xl font-light tracking-widest"
            >
              Breathe in...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
          >
            <p className="text-2xl font-light mb-8 opacity-90 leading-relaxed">
              {recoveryData?.message || "Let's clear the noise."}
            </p>
            
            {recoveryData?.tasks && recoveryData.tasks.length > 0 && (
              <GlassCard className="mb-8 bg-white/5 border-white/10">
                <span className="text-xs uppercase tracking-widest opacity-60">Only this matters today</span>
                <h3 className="text-xl font-medium mt-2">{recoveryData.tasks[0].title}</h3>
              </GlassCard>
            )}

            <button 
              onClick={handleAccept}
              className="px-8 py-3 rounded-full bg-white text-slate-900 font-medium hover:bg-white/90 transition-colors shadow-lg"
            >
              I feel better
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
