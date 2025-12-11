
import React, { useState } from 'react';
import { GitBranch, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DiffViewerProps {
    original: string;
    modified: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ original, modified }) => {
    // Very naïve split view - production would use 'diff' library
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    
    // Simple state to toggle view modes if we wanted to expand later
    const [viewMode, setViewMode] = useState<'side-by-side' | 'inline'>('side-by-side');

    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    return (
        <div className="flex flex-col h-full bg-[#0d1117] rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
            <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-red-400 font-bold">
                        <AlertTriangle size={14} /> Original
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                    <span className="flex items-center gap-2 text-green-400 font-bold">
                        <CheckCircle2 size={14} /> Remediated
                    </span>
                </div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    Auto-Patch v1.0
                </div>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar">
                {/* Using a grid for simple side-by-side */}
                <div className="min-w-[800px]">
                    {Array.from({ length: maxLines }).map((_, i) => {
                        const orgLine = originalLines[i] || "";
                        const modLine = modifiedLines[i] || "";
                        
                        // Simple heuristic for difference: exact string match
                        const isDiff = orgLine.trim() !== modLine.trim();
                        // Heuristic for added line: org empty, mod not
                        const isAdded = !orgLine && modLine;
                        // Heuristic for deleted line: org not empty, mod empty
                        const isDeleted = orgLine && !modLine;

                        return (
                            <div key={i} className={`grid grid-cols-2 hover:bg-slate-800/50 group border-b border-slate-800/30
                                ${isDiff ? 'bg-yellow-900/10' : ''} 
                                ${isAdded ? 'bg-green-900/10' : ''}
                                ${isDeleted ? 'bg-red-900/10' : ''}
                            `}>
                                {/* Left Side (Original) */}
                                <div className={`px-2 py-0.5 border-r border-slate-800 flex gap-2 overflow-hidden
                                     ${isDiff && !isAdded ? 'bg-red-900/10' : ''}
                                `}>
                                    <span className="text-slate-600 w-6 text-right shrink-0 select-none">{i + 1}</span>
                                    <span className={`whitespace-pre ${isDiff ? 'text-red-200' : 'text-slate-400'}`}>
                                        {orgLine}
                                    </span>
                                </div>

                                {/* Right Side (Modified) */}
                                <div className={`px-2 py-0.5 flex gap-2 overflow-hidden
                                     ${isDiff || isAdded ? 'bg-green-900/10' : ''}
                                `}>
                                    <span className="text-slate-600 w-6 text-right shrink-0 select-none">{i + 1}</span>
                                    <span className={`whitespace-pre ${isDiff || isAdded ? 'text-green-200 font-medium' : 'text-slate-400'}`}>
                                        {modLine}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DiffViewer;
