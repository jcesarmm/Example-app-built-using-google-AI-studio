import { useState } from 'react';
import { motion } from 'motion/react';
import { Mic, X, Loader2 } from 'lucide-react';
import { parseBrainDump } from '../lib/gemini';

export function MindCanvas({ onTasksGenerated, onCancel }: { key?: string, onTasksGenerated: any, onCancel: any }) {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    try {
      const data = await parseBrainDump(text);
      onTasksGenerated(data.tasks || []);
    } catch (e) {
      console.error(e);
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent">
      <button onClick={onCancel} className="absolute top-6 right-6 p-3 opacity-50 hover:opacity-100 transition-opacity">
        <X size={24} />
      </button>

      <div className="w-full max-w-lg flex flex-col items-center">
        <motion.div 
          animate={isProcessing ? { scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-32 h-32 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-12 shadow-[0_0_40px_rgba(255,237,213,0.8)] dark:shadow-[0_0_40px_rgba(255,237,213,0.1)]"
        >
          {isProcessing ? <Loader2 size={48} className="text-orange-400 animate-spin" /> : <Mic size={48} className="text-orange-400" />}
        </motion.div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Dump your thoughts here..."
          className="w-full bg-transparent border-none outline-none resize-none text-center text-2xl font-medium text-slate-800 placeholder:text-slate-500 min-h-[150px]"
          autoFocus
          disabled={isProcessing}
        />

        {text.trim() && !isProcessing && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSubmit}
            className="mt-8 px-8 py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-md"
          >
            Organize My Mind
          </motion.button>
        )}
      </div>
    </div>
  );
}
