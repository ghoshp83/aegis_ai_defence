
import React from 'react';
import { 
  FileCode, ArrowRight, ShieldCheck, Zap, Video, Network, 
  Terminal, BrainCircuit, Activity
} from 'lucide-react';
import { INITIAL_INSTRUCTION } from '../constants';

const SystemArchitecture: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up h-full flex flex-col">
      
      {/* 1. System Flowchart */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm shrink-0">
        <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Network size={20} className="text-blue-500" /> System Architecture Flow
        </h3>
        
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 p-4">
            {/* Input */}
            <div className="flex flex-col items-center gap-2 z-10 group">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg group-hover:border-slate-500 transition-colors">
                    <FileCode size={32} className="text-slate-400" />
                </div>
                <span className="text-xs font-mono text-slate-400">Code Upload</span>
            </div>

            <div className="hidden md:flex flex-col items-center text-slate-700">
                 <span className="text-[10px] font-mono mb-1">Stream</span>
                 <ArrowRight className="animate-pulse" />
            </div>

            {/* Core Brain */}
            <div className="flex flex-col items-center gap-2 z-10 relative group">
                 <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse group-hover:bg-blue-500/30 transition-all"></div>
                 <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/50 shadow-2xl backdrop-blur-sm relative group-hover:scale-105 transition-transform">
                    <BrainCircuit size={48} className="text-blue-400" />
                 </div>
                 <span className="text-sm font-bold text-blue-400 font-mono">Gemini 3 Pro</span>
            </div>

            <div className="hidden md:flex flex-col items-center text-slate-700">
                 <span className="text-[10px] font-mono mb-1">JSON/XML</span>
                 <ArrowRight className="animate-pulse" />
            </div>

            {/* Output Branches */}
            <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 w-48 hover:border-green-500/30 transition-colors">
                    <ShieldCheck size={20} className="text-green-400 shrink-0" />
                    <div>
                        <div className="text-xs font-bold text-slate-300">Analysis Engine</div>
                        <div className="text-[10px] text-slate-500">Vuln Scanning</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 w-48 hover:border-purple-500/30 transition-colors">
                    <Zap size={20} className="text-purple-400 shrink-0" />
                    <div>
                        <div className="text-xs font-bold text-slate-300">RL Optimizer</div>
                        <div className="text-[10px] text-slate-500">Policy Iteration</div>
                    </div>
                </div>
                 <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 w-48 hover:border-orange-500/30 transition-colors">
                    <Video size={20} className="text-orange-400 shrink-0" />
                    <div>
                        <div className="text-xs font-bold text-slate-300">Veo Generator</div>
                        <div className="text-[10px] text-slate-500">Exec Briefing</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
          {/* 2. Tech Stack */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-center">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Terminal size={14} /> Technology Stack
               </h3>
               <div className="flex flex-wrap gap-2">
                   {['React 19', 'TypeScript', 'Tailwind', 'Recharts', 'Google GenAI SDK', 'Gemini 3 Pro', 'Veo 3.1', 'Lucide Icons'].map(tag => (
                       <span key={tag} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs text-slate-400 font-mono hover:border-blue-500/30 hover:text-blue-400 transition-colors cursor-default">
                           {tag}
                       </span>
                   ))}
               </div>
          </div>
          
          {/* Metrics */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Activity size={14} /> Performance Telemetry
               </h3>
               <div className="space-y-3">
                   <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                       <span className="text-slate-400 text-sm">Avg. Analysis Latency</span>
                       <span className="text-green-400 font-mono font-bold">~8.4s</span>
                   </div>
                   <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                       <span className="text-slate-400 text-sm">Context Window Usage</span>
                       <span className="text-blue-400 font-mono font-bold">14% (32k/2M)</span>
                   </div>
                   <div className="flex justify-between items-center">
                       <span className="text-slate-400 text-sm">System Reliability</span>
                       <span className="text-purple-400 font-mono font-bold">99.9%</span>
                   </div>
               </div>
          </div>
      </div>

      {/* 3. Internals (Prompt) */}
       <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex-1 min-h-0 flex flex-col">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2 shrink-0">
                <FileCode size={16} className="text-yellow-500" /> System Instruction (Meta-Prompt)
            </h3>
            <div className="bg-black rounded-lg border border-slate-800 p-4 font-mono text-xs text-slate-500 overflow-y-auto whitespace-pre-wrap custom-scrollbar flex-1">
                {INITIAL_INSTRUCTION}
            </div>
       </div>

    </div>
  );
};

export default SystemArchitecture;
    