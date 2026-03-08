"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Settings2, 
  RotateCcw, 
  Cpu, 
  Layers, 
  Code2,
  Trophy,
  History,
  Info
} from "lucide-react";
import { aStar, Result, Step, State } from "@/lib/hanoi-astar";

export default function HanoiSolver() {
  const [nDisks, setNDisks] = useState(3);
  const [heuristicType, setHeuristicType] = useState(1);
  const [formula, setFormula] = useState("2**k - 1");
  const [isSolving, setIsSolving] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  // Initial solve on mount or when settings change (if auto-solve is on)
  const handleSolve = () => {
    setIsSolving(true);
    // Use a small timeout to allow UI to show loading if needed
    setTimeout(() => {
      const res = aStar(nDisks, heuristicType, formula);
      setResult(res);
      setCurrentStepIdx(0);
      setIsSolving(false);
      setIsPlaying(false);
    }, 100);
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying && result && currentStepIdx < result.pasos.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => prev + 1);
      }, speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, result, currentStepIdx, speed]);

  const currentStepData = result?.pasos[currentStepIdx];
  const currentState = currentStepData?.estado || [
    Array.from({ length: nDisks }, (_, i) => nDisks - i),
    [],
    []
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Torres de Hanoi <span className="text-slate-500 font-light italic">A* Explorer</span>
            </h1>
            <p className="text-slate-400 mt-1">Explora heurísticas inteligentes en tiempo real</p>
          </div>
          <div className="flex gap-3">
             <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={!result}
                  className={`p-2 rounded-md transition-all ${isPlaying ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className="w-px bg-slate-800 mx-1" />
                <button 
                  onClick={() => setCurrentStepIdx(0)}
                  className="p-2 rounded-md hover:bg-slate-800 text-slate-400 transition-all"
                >
                  <RotateCcw size={20} />
                </button>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Controls */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                <Settings2 size={18} />
                <span>Configuración</span>
              </div>

              {/* Number of Disks */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <label className="text-slate-400">Número de Discos</label>
                  <span className="text-indigo-400 font-mono">{nDisks}</span>
                </div>
                <input 
                  type="range" 
                  min="3" max="8" 
                  value={nDisks} 
                  onChange={(e) => setNDisks(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Heuristic Selection */}
              <div className="space-y-3">
                <label className="text-sm text-slate-400">Heurística</label>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setHeuristicType(1)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      heuristicType === 1 
                        ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <Layers size={16} />
                    <div className="text-xs">
                      <p className="font-semibold uppercase tracking-wider">Clásica</p>
                      <p className="opacity-60">Discos fuera del destino</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setHeuristicType(2)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      heuristicType === 2 
                        ? 'bg-purple-600/10 border-purple-500/50 text-purple-300' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <Code2 size={16} />
                    <div className="text-xs">
                      <p className="font-semibold uppercase tracking-wider">Personalizada</p>
                      <p className="opacity-60">Fórmula matemática</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Formula Input */}
              {heuristicType === 2 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs text-slate-500 uppercase tracking-widest px-1">Fórmula (k=fuera, n=total)</label>
                  <input 
                    type="text"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-purple-300 font-mono focus:border-purple-500 outline-none transition-colors"
                    placeholder="2**k - 1"
                  />
                  <p className="text-[10px] text-slate-500 italic px-1">Ej: 2**k - 1 o (n-k)*2</p>
                </motion.div>
              )}

              {/* Speed Slider */}
              <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex justify-between text-xs uppercase tracking-widest text-slate-500">
                  <span>Velocidad</span>
                  <span>{speed}ms</span>
                </div>
                <input 
                  type="range" 
                  min="50" max="1000" step="50"
                  value={speed} 
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <button 
                onClick={handleSolve}
                disabled={isSolving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                {isSolving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Cpu size={18} className="group-hover:rotate-12 transition-transform" />
                    <span>EJECUTAR A*</span>
                  </>
                )}
              </button>
            </div>

            {/* Current Step Metrics */}
            <AnimatePresence mode="wait">
              {currentStepData && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                    <Info size={16} />
                    <span>Métricas del Nodo</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">g(n)</p>
                      <p className="text-lg font-mono text-indigo-400">{currentStepData.g}</p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">h(n)</p>
                      <p className="text-lg font-mono text-purple-400">{currentStepData.h.toFixed(1)}</p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">f(n)</p>
                      <p className="text-lg font-mono text-pink-400">{currentStepData.f.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-slate-500 italic">"{currentStepData.movimiento}"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* Main Visualizer */}
          <main className="lg:col-span-6 flex flex-col gap-6">
            <div className="relative flex-1 bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden min-h-[500px] flex items-end justify-center pb-20 px-4">
              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-20 right-20 h-2 bg-slate-800 rounded-full shadow-2xl shadow-indigo-500/20" />

              {/* Towers */}
              <div className="grid grid-cols-3 w-full h-full max-w-4xl gap-4">
                {[0, 1, 2].map((towerIdx) => (
                  <div key={towerIdx} className="relative flex flex-col justify-end items-center h-full pt-10">
                    {/* Tower Label */}
                    <div className="absolute bottom-[-2rem] text-xs text-slate-600 font-mono uppercase tracking-widest">
                      Torre {towerIdx + 1}
                    </div>
                    
                    {/* Tower Stand */}
                    <div className="w-2 md:w-3 h-[70%] bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-full relative z-0">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-700 blur-md opacity-50" />
                    </div>

                    {/* Disks */}
                    <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse items-center z-10 pb-0.5">
                      <AnimatePresence mode="popLayout">
                        {currentState[towerIdx].map((disk, idx) => (
                          <motion.div
                            key={disk}
                            layoutId={`disk-${disk}`}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 300, 
                              damping: 30,
                              layout: { duration: 0.3 }
                            }}
                            className="h-7 mb-0.5 rounded-lg shadow-lg relative cursor-default"
                            style={{
                              width: `${(disk / nDisks) * 85 + 15}%`,
                              background: `linear-gradient(to right, ${COLORS[disk % COLORS.length].from}, ${COLORS[disk % COLORS.length].to})`,
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            <div className="flex items-center justify-center h-full text-[10px] text-white/50 font-bold">
                              {disk}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentStepIdx === 0}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-30 transition-all active:scale-90"
                >
                  <SkipBack size={20} />
                </button>
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Paso</span>
                  <span className="text-lg font-mono text-white">{currentStepIdx} <span className="text-slate-600">/ {result ? result.pasos.length - 1 : 0}</span></span>
                </div>
                <button 
                  onClick={() => setCurrentStepIdx(prev => Math.min(result ? result.pasos.length - 1 : 0, prev + 1))}
                  disabled={!result || currentStepIdx === result.pasos.length - 1}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-30 transition-all active:scale-90"
                >
                  <SkipForward size={20} />
                </button>
              </div>
              
              <div className="h-2 flex-1 mx-8 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepIdx / (result?.pasos.length || 1)) * 100}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
              </div>

              {result && (
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Restantes</span>
                  <span className="text-sm font-mono text-indigo-300">{result.pasos.length - 1 - currentStepIdx} movts</span>
                </div>
              )}
            </div>
          </main>

          {/* Right Panel: Logs & Stats */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[500px]">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                  <History size={16} />
                  <span>Historial de Algoritmo</span>
                </div>
                {result && (
                   <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
                     FOUND
                   </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                {!result ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
                      <Cpu size={24} />
                    </div>
                    <p className="text-xs text-slate-500 px-4">Configura los parámetros y presiona "EJECUTAR A*" para ver la magia del algoritmo.</p>
                  </div>
                ) : (
                  result.pasos.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStepIdx(idx)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        idx === currentStepIdx 
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200' 
                          : 'bg-slate-950/50 border-slate-900 hover:border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono opacity-50">#{idx}</span>
                        <span className="text-[10px] font-mono opacity-50">f={step.f.toFixed(1)}</span>
                      </div>
                      <p className="text-xs font-medium truncate">{step.movimiento}</p>
                    </button>
                  ))
                )}
              </div>

              {result && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 rounded-b-2xl">
                  <div className="flex items-center justify-between text-xs mb-3 text-slate-400">
                    <Trophy size={14} className="text-yellow-500" />
                    <span className="font-semibold text-yellow-500/80">RESULTADOS</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expansiones:</span>
                      <span className="font-mono text-indigo-400">{result.nodosExpandidos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Longitud:</span>
                      <span className="font-mono text-indigo-400">{result.totalMovimientos} movts</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Info Card */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-indigo-300 mb-2">Tip Educativo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El algoritmo <strong>A*</strong> combina el costo real <strong>g(n)</strong> con un costo estimado <strong>h(n)</strong>. 
                Si la heurística es <em>admisible</em> (nunca sobreestima), A* garantiza encontrar la solución óptima.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(99,102,241,0.5);
        }
      `}</style>
    </div>
  );
}

const COLORS = [
  { from: "#4f46e5", to: "#6366f1" }, // indigo
  { from: "#9333ea", to: "#a855f7" }, // purple
  { from: "#db2777", to: "#ec4899" }, // pink
  { from: "#ea580c", to: "#f97316" }, // orange
  { from: "#059669", to: "#10b981" }, // emerald
  { from: "#2563eb", to: "#3b82f6" }, // blue
  { from: "#dc2626", to: "#ef4444" }, // red
  { from: "#ca8a04", to: "#eab308" }, // yellow
];
