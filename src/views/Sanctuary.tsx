import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Task } from '../App';
import { Check, Plus, Wind } from 'lucide-react';

export function Sanctuary({ tasks, setTasks, onNavigate }: { key?: string, tasks: Task[], setTasks: any, onNavigate: any }) {
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const currentTask = pendingTasks[0];
  const onDeckTask = pendingTasks[1];

  const completeTask = (id: string) => {
    setTasks((prev: Task[]) => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 pt-24 pb-32 overflow-y-auto">
      <div className="fixed top-6 right-6 z-50">
        <button onClick={() => onNavigate('mind-canvas')} className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors shadow-sm">
          <Plus size={24} />
        </button>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col gap-6 relative">
        <AnimatePresence mode="popLayout">
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="w-full z-10"
              >
                <GlassCard className="flex flex-col items-center text-center py-8">
                  <span className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-4">
                    {index === 0 ? 'Next Best Action' : 'On Deck'}
                  </span>
                  <h2 className="text-2xl font-medium mb-6">{task.title}</h2>
                  <div className="flex items-center gap-4 text-sm opacity-70 mb-8">
                    <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10">{task.energy_vibe} Energy</span>
                    <span>{task.estimated_minutes} min</span>
                  </div>
                  <button 
                    onClick={() => completeTask(task.id)}
                    className="w-16 h-16 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                  >
                    <Check size={32} />
                  </button>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center opacity-60 mt-32"
            >
              <p className="text-xl">Your mind is clear.</p>
              <p className="text-sm mt-2">Tap + to dump your thoughts.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {pendingTasks.length > 1 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onNavigate('recovery')}
            className="px-8 py-4 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg flex items-center gap-3 hover:bg-white/50 transition-all pointer-events-auto text-slate-900"
          >
            <Wind size={20} />
            <span className="font-medium">I'm Overwhelmed</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
