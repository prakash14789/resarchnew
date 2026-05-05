import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Map, BarChart2, Cpu, Zap, X, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const commands = [
    { id: 'map', title: 'Switch to 3D Map', icon: Map, path: '/', keywords: ['map', 'spatial', '3d'] },
    { id: 'insights', title: 'View Analytics Insights', icon: BarChart2, path: '/insights', keywords: ['insights', 'analytics', 'charts', 'report'] },
    { id: 'models', title: 'Compare ML Models', icon: Cpu, path: '/models', keywords: ['models', 'compare', 'algorithms'] },
    { id: 'predict', title: 'Run Consumption Prediction', icon: Zap, path: '/predict', keywords: ['predict', 'consumption', 'forecast'] },
  ];

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech Recognition not supported in this browser.');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setQuery(transcript);
      
      const match = commands.find(c => 
        transcript.includes(c.id) || c.keywords.some(k => transcript.includes(k))
      );
      if (match) {
        setTimeout(() => handleAction(match.path), 1000);
      }
    };

    recognition.start();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl glass border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="flex items-center p-4 border-b border-white/5">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                autoFocus
                placeholder="Search commands or navigate..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={startVoiceSearch}
                className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-danger/20 text-danger animate-pulse' : 'hover:bg-white/5 text-slate-400'}`}
                title="Voice Search"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/10 ml-2">
                <span className="text-[10px] text-slate-400 font-bold">ESC</span>
              </div>
            </div>

            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleAction(c.path)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-accent/20 transition-colors">
                        <c.icon className="w-4 h-4 text-slate-400 group-hover:text-accent" />
                      </div>
                      <span className="text-slate-300 font-medium group-hover:text-white">{c.title}</span>
                    </div>
                    <Command className="w-3.3 h-3.3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-slate-500 text-sm">No commands found for "{query}"</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-white/5 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-slate-400">↑↓</kbd>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-slate-400">ENTER</kbd>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 font-mono">v1.0.4-spatial</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
