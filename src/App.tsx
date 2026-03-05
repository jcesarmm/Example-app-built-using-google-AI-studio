import { useState, useEffect } from 'react';
import { VibeGradientBackground } from './components/VibeGradientBackground';
import { Sanctuary } from './views/Sanctuary';
import { MindCanvas } from './views/MindCanvas';
import { RecoveryMode } from './views/RecoveryMode';
import { AnimatePresence } from 'motion/react';

export type Task = {
  id: string;
  title: string;
  energy_vibe: 'High' | 'Medium' | 'Low';
  is_critical: boolean;
  estimated_minutes: number;
  status: 'pending' | 'completed';
};

export default function App() {
  const [view, setView] = useState<'sanctuary' | 'mind-canvas' | 'recovery'>('sanctuary');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [vibe, setVibe] = useState<'high' | 'medium' | 'low' | 'overwhelmed' | 'neutral'>('neutral');

  useEffect(() => {
    if (view === 'recovery') {
      setVibe('overwhelmed');
    } else if (tasks.length > 0) {
      const currentTask = tasks.find(t => t.status === 'pending');
      if (currentTask) {
        setVibe(currentTask.energy_vibe.toLowerCase() as any);
      } else {
        setVibe('neutral');
      }
    } else {
      setVibe('neutral');
    }
  }, [tasks, view]);

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-indigo-200">
      <VibeGradientBackground vibe={vibe} />
      
      <AnimatePresence mode="wait">
        {view === 'sanctuary' && (
          <Sanctuary 
            key="sanctuary" 
            tasks={tasks} 
            setTasks={setTasks} 
            onNavigate={setView} 
          />
        )}
        {view === 'mind-canvas' && (
          <MindCanvas 
            key="mind-canvas" 
            onTasksGenerated={(newTasks) => {
              setTasks(prev => [...prev, ...newTasks.map((t: any) => ({...t, id: crypto.randomUUID(), status: 'pending'}))]);
              setView('sanctuary');
            }}
            onCancel={() => setView('sanctuary')}
          />
        )}
        {view === 'recovery' && (
          <RecoveryMode 
            key="recovery" 
            tasks={tasks}
            onRecovered={(newTasks) => {
              setTasks(newTasks);
              setView('sanctuary');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
