
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Skull, RefreshCw, Play, ShieldAlert, Zap, Lock } from 'lucide-react';

const AttackSimulator: React.FC = () => {
  const [data, setData] = useState<{ step: number; confidence: number; adversarial: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [attackStatus, setAttackStatus] = useState<'idle' | 'running' | 'breached'>('idle');
  const [examplesGenerated, setExamplesGenerated] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  // Initial secure state
  const startSimulation = () => {
    setIsRunning(true);
    setAttackStatus('running');
    setData([]);
    setExamplesGenerated(0);
    setSuccessRate(0);
    let step = 0;
    
    const interval = setInterval(() => {
        step++;
        setExamplesGenerated(prev => Math.min(prev + 4, 100)); // Simulate generation count
        
        // Simulate FGSM Gradient Descent
        // Confidence in correct class drops, Adversarial confidence rises
        // Add some noise
        const noise = Math.random() * 5;
        const decay = Math.min(step * 4, 90); // Cap at 90 drop
        const rise = Math.min(step * 4.5, 95); 

        const correctConf = Math.max(0, 98 - decay + noise);
        const advConf = Math.min(100, 2 + rise + noise);

        // Update Success Rate based on adversarial confidence
        if (advConf > 50) {
            setSuccessRate(prev => Math.min(prev + 2, 98));
        }

        setData(prev => [...prev, {
            step,
            confidence: parseFloat(correctConf.toFixed(1)),
            adversarial: parseFloat(advConf.toFixed(1))
        }]);

        if (step >= 25) {
            clearInterval(interval);
            setIsRunning(false);
            setAttackStatus('breached');
            setExamplesGenerated(100);
            setSuccessRate(87); // Final simulated rate
        }
    }, 200); // 200ms per step
  };

  return (
    <div className="space-y-6">
        {/* Top Metrics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adversarial Examples</span>
                     <Zap size={16} className="text-yellow-500" />
                 </div>
                 <div>
                     <div className="text-3xl font-bold text-slate-200 font-mono">{examplesGenerated}/100</div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                         <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${examplesGenerated}%` }}></div>
                     </div>
                 </div>
             </div>

             <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attack Success Rate</span>
                     <ShieldAlert size={16} className={`${successRate > 50 ? 'text-red-500' : 'text-slate-500'}`} />
                 </div>
                 <div>
                     <div className={`text-3xl font-bold font-mono ${successRate > 80 ? 'text-red-500' : 'text-slate-200'}`}>{successRate}%</div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                         <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${successRate}%` }}></div>
                     </div>
                 </div>
             </div>

             <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-center gap-4">
                <button 
                    onClick={startSimulation}
                    disabled={isRunning}
                    className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg
                        ${isRunning 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 border border-red-500'}`}
                >
                    {isRunning ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                    {isRunning ? 'Running Attack...' : 'Simulate FGSM Attack'}
                </button>
             </div>
        </div>

        {/* Main Chart Panel */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col h-[400px] relative overflow-hidden">
            {attackStatus === 'breached' && (
                <div className="absolute inset-0 bg-red-500/5 z-0 animate-pulse pointer-events-none"></div>
            )}
            
            <div className="flex justify-between items-center mb-4 z-10">
                <div>
                    <h4 className="font-bold text-slate-200 flex items-center gap-2">
                        <Skull className={`${attackStatus === 'breached' ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
                        Confidence Degradation Monitor
                    </h4>
                    <p className="text-xs text-slate-500">Real-time visualization of decision boundary shift during gradient attack</p>
                </div>
                {attackStatus === 'breached' && (
                    <span className="px-3 py-1 bg-red-950/50 border border-red-500/50 text-red-400 text-xs font-bold rounded flex items-center gap-2 animate-pulse">
                        <ShieldAlert size={12} /> CRITICAL BREACH
                    </span>
                )}
                {attackStatus === 'idle' && (
                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 text-slate-400 text-xs font-bold rounded flex items-center gap-2">
                        <Lock size={12} /> SYSTEM SECURE
                    </span>
                )}
            </div>

            <div className="flex-1 w-full z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                            dataKey="step" 
                            stroke="#64748b" 
                            label={{ value: 'Gradient Steps', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
                        />
                        <YAxis 
                            domain={[0, 100]} 
                            stroke="#64748b" 
                            label={{ value: 'Confidence %', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Decision Boundary', fill: '#ef4444', fontSize: 10 }} />
                        <Line 
                            type="monotone" 
                            dataKey="confidence" 
                            stroke="#3b82f6" 
                            strokeWidth={2} 
                            name="Correct Class (Panda)"
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="adversarial" 
                            stroke="#ef4444" 
                            strokeWidth={2} 
                            name="Adversarial Class (Gibbon)"
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default AttackSimulator;
