
import React from 'react';
import { Upload, Code2, Play } from 'lucide-react';
import { SampleModelType } from '../types';
import { SAMPLE_MODELS } from '../constants';

interface CodePanelProps {
  code: string;
  setCode: (code: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const CodePanel: React.FC<CodePanelProps> = ({ code, setCode, onAnalyze, isAnalyzing }) => {
  
  const handleSampleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as SampleModelType;
    if (SAMPLE_MODELS[type]) {
      setCode(SAMPLE_MODELS[type]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Code2 size={16} />
          Model Source
        </h2>
        <div className="flex items-center gap-2">
           <select 
            className="text-xs border border-slate-700 rounded px-2 py-1 bg-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
            onChange={handleSampleSelect}
            defaultValue=""
           >
             <option value="" disabled>Load Sample</option>
             {Object.values(SampleModelType).map((t) => (
               <option key={t} value={t}>{t}</option>
             ))}
           </select>
           <label className="cursor-pointer text-slate-500 hover:text-blue-400">
             <input type="file" className="hidden" accept=".py,.ipynb,.txt" onChange={handleFileUpload} />
             <Upload size={16} />
           </label>
        </div>
      </div>

      <div className="flex-1 relative bg-[#0d1117]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm bg-transparent text-slate-300 resize-none focus:outline-none leading-relaxed"
          placeholder="Paste your PyTorch/TensorFlow/Keras model code here..."
          spellCheck={false}
        />
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !code.trim()}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all shadow-lg ${
            isAnalyzing || !code.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 hover:shadow-blue-900/40 border border-blue-500'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Analyzing Architecture...
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              Run AEGIS Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodePanel;
