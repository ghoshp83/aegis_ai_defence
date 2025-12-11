
import React, { useState, useRef } from 'react';
import { AnalysisResult, RLOptimizationResult } from '../types';
import PipelineIntegration from './PipelineIntegration';
import DiffViewer from './DiffViewer';
import AttackSimulator from './AttackSimulator';
import ComplianceCertificate from './ComplianceCertificate';
import SystemArchitecture from './SystemArchitecture';
import { generateAuditVideo, optimizeModelWithRL } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  ShieldAlert, Activity, BrainCircuit, CheckCircle2, AlertTriangle, 
  Layers, Zap, Search, FileCode, XCircle, AlertOctagon,
  Clock, Loader2, Cpu, Network, Lock, Eye, Gavel, 
  Terminal, DollarSign, Skull, Download, Sparkles, Workflow, Bug, Video, RefreshCw,
  GitBranch, Box, TrendingUp, Trophy, Play, FileCheck, Globe
} from 'lucide-react';

interface AnalysisPanelProps {
  result: AnalysisResult | null;
  loading: boolean;
  progress?: string;
  error?: string | null;
  code?: string;
}

type TabType = 'architecture' | 'attack_sim' | 'active_defense' | 'explainability' | 'vulnerabilities' | 'rl_optimizer' | 'performance' | 'pipeline';

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ result, loading, progress, error, code }) => {
  // Architecture first, as requested previously
  const [activeTab, setActiveTab] = useState<TabType>('architecture');
  const [defenseMode, setDefenseMode] = useState<'fix' | 'break'>('fix');
  
  // Video State
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>("");

  // Certificate State
  const [showCertificate, setShowCertificate] = useState(false);

  // RL State
  const [rlResult, setRlResult] = useState<RLOptimizationResult | null>(null);
  const [isRlLoading, setIsRlLoading] = useState(false);
  const [rlMode, setRlMode] = useState<'security' | 'efficiency' | 'balanced'>('balanced');
  const [rlLog, setRlLog] = useState<string>("");
  const [partialEpisodes, setPartialEpisodes] = useState<any[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleGenerateVideo = async () => {
    if (!result) return;
    setIsVideoLoading(true);
    setVideoError(null);
    setVideoStatus("Initializing...");
    try {
      const uri = await generateAuditVideo(result, (status) => {
          setVideoStatus(status);
      });
      setVideoUri(uri);
    } catch (e: any) {
      console.error("Video Generation Error:", e);
      setVideoError(e.message || "Failed to generate video.");
      if (contentRef.current) {
          contentRef.current.scrollTop = 0;
      }
    } finally {
      setIsVideoLoading(false);
      setVideoStatus("");
    }
  };

  const handleRLOptimization = async () => {
     if (!code) return;
     setIsRlLoading(true);
     setRlLog("Initializing Environment...");
     setPartialEpisodes([]);
     setRlResult(null);

     try {
         const optimization = await optimizeModelWithRL(code, rlMode, (text) => {
             setRlLog(text.slice(-500)); 
             try {
                const iterationsMatch = text.match(/"iterations"\s*:\s*\[([\s\S]*?)\]/);
                if (iterationsMatch) {
                    const rawContent = iterationsMatch[1];
                    const chunks = rawContent.split('},');
                    const valid = chunks.map(chunk => {
                        let s = chunk.trim();
                        if (!s) return null;
                        if (!s.endsWith('}')) s += '}';
                        if (!s.startsWith('{')) {
                            const firstBrace = s.indexOf('{');
                            if (firstBrace === -1) return null;
                            s = s.substring(firstBrace);
                        }
                        try { return JSON.parse(s); } catch { return null; }
                    }).filter(Boolean);
                    if (valid.length > 0) setPartialEpisodes(valid);
                }
             } catch (e) {}
         });
         setRlResult(optimization);
         setPartialEpisodes([]); 
     } catch(e: any) {
         setRlLog(`Critical Error: ${e.message}`);
     } finally {
         setIsRlLoading(false);
     }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-8 text-slate-400 relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-[0.05] pointer-events-none">
            {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="bg-blue-500/30 w-full h-full rounded-full animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}></div>
            ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-blue-900/50 relative">
                    <Activity className="w-12 h-12 text-blue-500 animate-bounce" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-900/50">
                    LIVE STREAM
                </div>
            </div>
            
            <div className="font-mono text-center">
                <h3 className="text-xl font-bold text-slate-200 mb-2">
                    Analyzing Model...
                </h3>
                {progress && (
                    <div className="text-blue-400 text-sm animate-pulse">
                        {progress}
                    </div>
                )}
            </div>

            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden relative mt-6">
                <div className="absolute top-0 bottom-0 left-0 bg-blue-500 w-1/3 animate-progress"></div>
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-8 text-center animate-fadeIn">
        <div className="bg-red-900/20 p-4 rounded-full mb-4 border border-red-900/50">
            <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-red-400 mb-2">Analysis Failed</h3>
        <p className="text-slate-400 max-w-md bg-slate-900/50 p-4 rounded-lg border border-red-900/30 shadow-sm font-medium text-sm">
            {error}
        </p>
      </div>
    );
  }

  if (result && result.valid === false) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-8 text-center animate-fadeIn">
            <div className="bg-red-900/20 p-6 rounded-full mb-6 border border-red-500/30 shadow-xl shadow-red-900/20">
                <AlertOctagon className="w-16 h-16 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-red-400 mb-3">Validation Failed</h3>
            <p className="text-slate-300 max-w-lg mb-6 leading-relaxed">
                The input provided does not appear to be valid neural network source code. 
                AEGIS only processes valid Python, Go, or C++ model definitions.
            </p>
            <div className="bg-slate-900 p-4 rounded-lg border border-red-900/30 text-red-300 font-mono text-sm">
                Error: {result.error || "Unknown validation error"}
            </div>
        </div>
    );
  }

  if (!result) {
    if (activeTab === 'pipeline') {
         return (
             <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
                <div className="flex border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
                    <button onClick={() => setActiveTab('explainability')} className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-300 border-b-2 border-transparent">Back to Analysis</button>
                    <button className="flex-1 py-3 text-sm font-medium text-blue-400 border-b-2 border-blue-500 bg-slate-900 flex items-center justify-center gap-2">
                        <Workflow size={16} /> CI/CD Integration
                    </button>
                </div>
                <PipelineIntegration result={null} code={code} />
             </div>
         )
    }

    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400 p-8 text-center">
        <div className="bg-slate-900 p-6 rounded-full shadow-2xl border border-slate-800 mb-6 group transition-all hover:scale-110 hover:border-blue-500/50 cursor-default">
            <BrainCircuit className="w-16 h-16 text-slate-600 group-hover:text-blue-500 transition-colors" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200">Ready to Analyze</h3>
        <p className="max-w-sm mt-3 text-slate-500 leading-relaxed text-sm mb-8">
            Paste your model code and run the AEGIS Analysis to reveal <span className="text-blue-400 font-medium">architecture insights</span>, <span className="text-red-400 font-medium">security flaws</span>, and <span className="text-green-400 font-medium">performance metrics</span>.
        </p>

        <button 
            onClick={() => setActiveTab('pipeline')}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-blue-500/50"
        >
            <Workflow size={16} />
            Configure CI/CD Pipeline
        </button>
      </div>
    );
  }

  // Stats Logic
  const vulnCounts = {
    Critical: result.vulnerabilities.filter(v => v.severity === 'Critical').length,
    High: result.vulnerabilities.filter(v => v.severity === 'High').length,
    Medium: result.vulnerabilities.filter(v => v.severity === 'Medium').length,
    Low: result.vulnerabilities.filter(v => v.severity === 'Low').length,
  };
  const pieData = [
    { name: 'Critical', value: vulnCounts.Critical, fill: '#EF4444' },
    { name: 'High', value: vulnCounts.High, fill: '#F97316' },
    { name: 'Medium', value: vulnCounts.Medium, fill: '#EAB308' },
    { name: 'Low', value: vulnCounts.Low, fill: '#22C55E' },
  ].filter(d => d.value > 0);
  const totalVulns = result.vulnerabilities.length;
  const riskScore = result.scores.security;
  const riskLabel = riskScore < 50 ? 'Critical Risk' : riskScore < 75 ? 'High Risk' : riskScore < 90 ? 'Moderate' : 'Secure';
  const riskColor = riskScore < 50 ? 'text-red-500' : riskScore < 75 ? 'text-orange-500' : riskScore < 90 ? 'text-yellow-500' : 'text-green-500';

  const renderDashboard = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-slate-950 border-b border-slate-800 shrink-0">
       <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition-colors group">
          <div className="flex items-start justify-between">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Score</span>
             <ShieldAlert size={16} className={`${riskColor} group-hover:scale-110 transition-transform`} />
          </div>
          <div className="mt-2">
             <div className={`text-3xl font-bold ${riskColor}`}>{riskScore}/100</div>
             <div className={`text-xs font-medium ${riskColor} mt-1 flex items-center gap-1`}>
                {riskScore < 50 ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                {riskLabel}
             </div>
          </div>
       </div>

       <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition-colors">
          <div className="flex items-start justify-between">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Issues</span>
             <AlertTriangle size={16} className="text-orange-500" />
          </div>
          <div className="mt-2">
             <div className="text-3xl font-bold text-slate-200">{totalVulns}</div>
             <div className="text-xs text-slate-500 mt-1 flex gap-2">
               {vulnCounts.Critical > 0 && <span className="text-red-500 font-bold">{vulnCounts.Critical} Critical</span>}
               {vulnCounts.High > 0 && <span className="text-orange-500 font-bold">{vulnCounts.High} High</span>}
             </div>
          </div>
       </div>

       <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition-colors">
          <div className="flex items-start justify-between">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remediation</span>
             <Clock size={16} className="text-blue-500" />
          </div>
          <div className="mt-2">
             <div className="text-3xl font-bold text-slate-200">~{Math.ceil(totalVulns * 0.5)}h</div>
             <div className="text-xs text-slate-500 mt-1">Est. fix time</div>
          </div>
       </div>

       <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition-colors">
            <div className="flex gap-2 h-full">
                <button 
                    onClick={() => setShowCertificate(true)}
                    className="flex-1 h-full flex flex-col items-center justify-center text-green-400 hover:text-green-300 hover:bg-slate-800/50 rounded-lg transition-all gap-2"
                >
                    <FileCheck size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">Certificate</span>
                </button>
                <div className="w-[1px] bg-slate-800 h-2/3 my-auto"></div>
                <button 
                    onClick={handleGenerateVideo}
                    disabled={isVideoLoading}
                    className={`flex-1 h-full flex flex-col items-center justify-center rounded-lg transition-all gap-2 disabled:opacity-100 disabled:cursor-wait
                        ${isVideoLoading ? 'bg-purple-900/20 text-purple-300' : 'text-purple-400 hover:text-purple-300 hover:bg-slate-800/50'}`}
                >
                    {isVideoLoading ? <Loader2 size={20} className="animate-spin" /> : <Video size={20} />}
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
                            Briefing
                        </span>
                        {isVideoLoading && <span className="text-[9px] text-purple-200 font-mono mt-0.5">{videoStatus}</span>}
                    </div>
                </button>
            </div>
       </div>
    </div>
  );

  const renderTabs = () => (
    <div className="flex border-b border-slate-800 bg-slate-950 sticky top-0 z-10 overflow-x-auto shrink-0">
      <button onClick={() => setActiveTab('architecture')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'architecture' ? 'border-yellow-500 text-yellow-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
        <Network size={16} /> Architecture
      </button>
      <button onClick={() => setActiveTab('attack_sim')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'attack_sim' ? 'border-red-500 text-red-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
        <Skull size={16} /> Attack Sim
      </button>
       <button onClick={() => setActiveTab('active_defense')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'active_defense' ? 'border-indigo-500 text-indigo-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
        <Bug size={16} /> Active Defense
      </button>
      <button onClick={() => setActiveTab('explainability')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'explainability' ? 'border-blue-500 text-blue-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
        <Search size={16} /> Analysis
      </button>
      <button onClick={() => setActiveTab('vulnerabilities')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'vulnerabilities' ? 'border-orange-500 text-orange-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
        <ShieldAlert size={16} /> Vulnerabilities
      </button>
       <button onClick={() => setActiveTab('rl_optimizer')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'rl_optimizer' ? 'border-purple-500 text-purple-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
        <GitBranch size={16} /> RL Optimizer
      </button>
      <button onClick={() => setActiveTab('performance')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'performance' ? 'border-green-500 text-green-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
        <Activity size={16} /> Performance
      </button>
      <button onClick={() => setActiveTab('pipeline')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'pipeline' ? 'border-cyan-500 text-cyan-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
        <Workflow size={16} /> CI/CD
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'architecture':
        return <SystemArchitecture />;
      case 'attack_sim':
        return (
            <div className="h-full flex flex-col animate-slide-up">
                <AttackSimulator />
            </div>
        );
      case 'pipeline':
        return <PipelineIntegration result={result} code={code} />;
      case 'rl_optimizer':
          return (
              <div className="space-y-6 animate-slide-up h-full flex flex-col">
                  <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-xl flex items-center gap-4 shrink-0">
                      <div className="bg-purple-500/20 p-3 rounded-full text-purple-400">
                          <BrainCircuit size={24} />
                      </div>
                      <div className="flex-1">
                          <h3 className="text-lg font-bold text-purple-100">Reinforcement Learning Auto-Optimizer</h3>
                          <p className="text-sm text-purple-300/80">Simulate an RL Agent (Policy Network) iterating over your code.</p>
                      </div>
                      <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                          <button onClick={() => setRlMode('security')} className={`px-3 py-1.5 text-xs font-bold rounded ${rlMode === 'security' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>Max Security</button>
                          <button onClick={() => setRlMode('balanced')} className={`px-3 py-1.5 text-xs font-bold rounded ${rlMode === 'balanced' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>Balanced</button>
                          <button onClick={() => setRlMode('efficiency')} className={`px-3 py-1.5 text-xs font-bold rounded ${rlMode === 'efficiency' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>Max Speed</button>
                      </div>
                      <button onClick={handleRLOptimization} disabled={isRlLoading} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50">
                          {isRlLoading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />} Run Simulation
                      </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                       <div className="bg-black rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-y-auto custom-scrollbar flex flex-col">
                          <div className="flex items-center gap-2 text-slate-500 border-b border-slate-800 pb-2 mb-2">
                              <Terminal size={14} /> Agent Logs (Episodes)
                          </div>
                          <div className="space-y-1 flex-1">
                              {!isRlLoading && !rlResult && <div className="text-slate-600 italic">Waiting to start agent...</div>}
                              {isRlLoading && partialEpisodes.length === 0 && (
                                  <><div className="text-purple-400">Initializing...</div><div className="text-slate-500 mt-2 whitespace-pre-wrap">{rlLog}</div></>
                              )}
                              {((rlResult?.iterations && rlResult.iterations.length > 0) ? rlResult.iterations : partialEpisodes).map((iter, i) => (
                                  <div key={i} className="mb-3 border-l-2 border-purple-500/30 pl-3 animate-fadeIn">
                                      <div className="text-purple-300 font-bold">EPISODE {iter.episode}</div>
                                      <div className="text-slate-300">Action: {iter.action}</div>
                                      <div className="text-slate-400">Reward: {iter.reward > 0 ? '+' : ''}{iter.reward}</div>
                                  </div>
                              ))}
                          </div>
                       </div>
                       <div className="bg-[#0d1117] rounded-xl border border-slate-800 flex flex-col overflow-hidden relative">
                           <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
                               <span className="text-xs font-mono text-purple-400 font-bold flex items-center gap-2"><Sparkles size={12} /> Optimal Policy Code</span>
                           </div>
                           <div className="flex-1 overflow-auto custom-scrollbar p-4">
                               <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{rlResult ? rlResult.optimizedCode : "// Optimized code will appear here after RL simulation"}</pre>
                           </div>
                       </div>
                  </div>
              </div>
          );
      case 'active_defense':
        return (
            <div className="space-y-6 animate-slide-up h-full flex flex-col">
                <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                             <ShieldAlert className="text-indigo-400" /> Active Defense Console
                        </h3>
                        <p className="text-sm text-slate-400">
                            Gemini 3 Pro has analyzed your model and generated both a <span className="text-blue-400">Fix</span> and an <span className="text-red-400">Exploit</span>.
                        </p>
                    </div>
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button onClick={() => setDefenseMode('fix')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${defenseMode === 'fix' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            <FileCode size={16} /> Remediation (Diff)
                        </button>
                        <button onClick={() => setDefenseMode('break')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${defenseMode === 'break' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            <Skull size={16} /> Exploit PoC (Red Team)
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] relative">
                    {defenseMode === 'fix' ? (
                        <DiffViewer original={code || ''} modified={result.remediatedCode || ''} />
                    ) : (
                        <div className="h-full flex flex-col">
                             <div className="p-3 bg-red-950/20 border-b border-red-900/30 flex justify-between items-center">
                                <span className="text-xs font-mono text-red-400">exploit_poc.py</span>
                                <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded border border-red-900/50">Generated Exploit</span>
                            </div>
                            <div className="p-4 bg-red-900/10 border-b border-red-900/20">
                                <h4 className="text-red-400 font-bold text-sm mb-1">{result.exploitPoC?.title}</h4>
                                <p className="text-slate-400 text-xs">{result.exploitPoC?.description}</p>
                            </div>
                            <div className="flex-1 overflow-auto custom-scrollbar p-4">
                                <pre className="font-mono text-sm text-red-200/80 leading-relaxed whitespace-pre-wrap">
                                    {result.exploitPoC?.code || "No exploit generated."}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
      case 'explainability':
        return (
          <div className="space-y-6 animate-slide-up">
            {videoUri && (
                <div className="bg-black p-1 rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 mb-6 animate-fadeIn">
                     <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center group">
                        <video src={videoUri} controls autoPlay loop muted className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md flex items-center gap-1 pointer-events-none">
                            <Video size={10} className="text-purple-400" /> AI SECURITY BRIEFING
                        </div>
                     </div>
                </div>
            )}
            
            {/* THREAT INTEL - Enhanced as requested */}
             <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={64} className="text-blue-500"/></div>
                 <div className="flex justify-between items-start mb-4">
                     <h3 className="font-semibold text-slate-200 flex items-center gap-2"><Globe className="text-blue-400" size={20} /> Threat Intelligence Feed</h3>
                     <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-900/50 animate-pulse">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> LIVE
                     </span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                         {result.threatIntelligence?.cves.map((cve, i) => (
                             <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-1">
                                 <div className="flex justify-between items-center">
                                     <span className="text-red-400 font-mono font-bold text-xs">{cve.id}</span>
                                     <span className="text-[10px] bg-red-900/30 text-red-300 px-1.5 py-0.5 rounded border border-red-900/50">{cve.severity}</span>
                                 </div>
                                 <p className="text-slate-400 text-xs">{cve.description}</p>
                             </div>
                         ))}
                     </div>
                     <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                         <h4 className="text-slate-300 font-bold text-sm mb-2">Global Impact Analysis</h4>
                         <div className="space-y-3">
                             <div>
                                 <div className="text-slate-500 text-xs uppercase font-bold">Real World Incidents</div>
                                 <div className="text-slate-300 text-sm">{result.threatIntelligence?.realWorldIncidents || "None reported"}</div>
                             </div>
                             <div>
                                 <div className="text-slate-500 text-xs uppercase font-bold">Affected Systems</div>
                                 <div className="text-slate-300 text-sm">{result.threatIntelligence?.affectedSystemsCount || "Unknown"}</div>
                             </div>
                             <div className="mt-4 pt-4 border-t border-slate-800">
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                     <div className="text-xs font-mono text-red-400">47 attacks on similar models this month</div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>

            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
              <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <Layers className="text-indigo-400" size={20} />
                Architecture Topology
              </h3>
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 my-6">
                {result.architecture.layers.map((layer, idx) => (
                    <div key={idx} className="relative group animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-slate-900 transition-transform group-hover:scale-125
                            ${layer.isBottleneck ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500'}`}>
                            {layer.isBottleneck ? <AlertOctagon size={12} /> : <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <div className={`p-4 rounded-lg border transition-all ${layer.isBottleneck ? 'border-red-900/50 bg-red-950/20 hover:bg-red-900/30' : 'border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-blue-500/30'}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className={`font-bold ${layer.isBottleneck ? 'text-red-400' : 'text-slate-200'}`}>{layer.name}</span>
                                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shadow-sm">{layer.params}</span>
                            </div>
                            <div className="text-sm text-slate-400 mb-1">{layer.type}</div>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'vulnerabilities':
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 gap-4">
                 <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col items-center justify-center relative min-h-[300px]">
                   <h4 className="absolute top-5 left-5 text-sm font-bold text-slate-500 uppercase tracking-wide">Vulnerability Severity Distribution</h4>
                   {totalVulns > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>} />
                                <RechartsTooltip contentStyle={{borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #334155'}} itemStyle={{color: '#f8fafc'}} />
                            </PieChart>
                        </ResponsiveContainer>
                   ) : (
                       <div className="h-[250px] flex items-center justify-center text-slate-600 text-xs">
                           No issues detected
                       </div>
                   )}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-slate-500 text-xs uppercase tracking-wider mt-6 mb-2">Detailed Vulnerability List</h4>
                {result.vulnerabilities.length === 0 ? (
                    <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 border-dashed text-center">
                        <CheckCircle2 size={48} className="mx-auto text-green-500/50 mb-3" />
                        <h4 className="text-slate-300 font-bold">No Vulnerabilities Detected</h4>
                        <p className="text-slate-500 text-sm mt-1">
                            This architecture appears secure based on current static analysis rules.
                        </p>
                    </div>
                ) : (
                    result.vulnerabilities.map((vuln) => (
                        <div key={vuln.id} className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow relative">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${vuln.severity === 'Critical' ? 'bg-red-600' : vuln.severity === 'High' ? 'bg-orange-500' : vuln.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                            <div className="p-5 pl-7">
                                <div className="flex justify-between mb-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${vuln.severity === 'Critical' ? 'bg-red-900/30 text-red-400 border-red-900/50' : 'bg-blue-900/30 text-blue-400 border-blue-900/50'}`}>{vuln.severity}</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-200 mb-2">{vuln.name}</h4>
                                <p className="text-slate-400 text-sm mb-4">{vuln.description}</p>
                                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                    <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Mitigation</span>
                                    <p className="text-sm text-slate-300">{vuln.mitigation}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6 animate-slide-up">
             <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-green-500" /> SOTA Benchmarking
                </h4>
                <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={[{ name: 'Your Model', score: result.scores.accuracy * 100, fill: '#3b82f6' }, { name: 'ResNet50', score: 92, fill: '#475569' }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                                { [0,1].map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#475569'} />) }
                            </Bar>
                         </BarChart>
                     </ResponsiveContainer>
                </div>
             </div>
             
             {result.performance.metrics.length === 0 ? (
                 <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 border-dashed text-center">
                    <Activity size={48} className="mx-auto text-slate-700 mb-3" />
                    <h4 className="text-slate-300 font-bold">No Metrics Available</h4>
                    <p className="text-slate-500 text-sm mt-1">
                        Could not extract granular performance metrics for this specific architecture.
                    </p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.performance.metrics.map((metric, i) => (
                    <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.name}</span>
                        {metric.status === 'good' ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-yellow-500" />}
                      </div>
                      <div className="text-2xl font-bold text-slate-200">{metric.value} <span className="text-sm text-slate-500 font-normal">{metric.unit || ''}</span></div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
        {result && !loading && !error && result.valid !== false && renderDashboard()}
        {renderTabs()}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            {renderContent()}
        </div>
        {showCertificate && result && (
            <ComplianceCertificate 
                score={result.scores.security} 
                modelName={result.architecture.overview.split(' ')[0] || "Neural Network"} 
                onClose={() => setShowCertificate(false)} 
            />
        )}
    </div>
  );
};

export default AnalysisPanel;
