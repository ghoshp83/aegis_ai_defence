
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Github, GripVertical } from 'lucide-react';
import CodePanel from './components/CodePanel';
import AnalysisPanel from './components/AnalysisPanel';
import ChatPanel from './components/ChatPanel';
import { analyzeModelCode, streamChatResponse } from './services/geminiService';
import { AnalysisResult, ChatMessage } from './types';

function App() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);

  // Layout State
  const [leftWidth, setLeftWidth] = useState(30); // Percentage for Code Panel
  const [rightWidth, setRightWidth] = useState(25); // Percentage for Chat Panel
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [chatFullScreen, setChatFullScreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setAnalysisProgress('Initializing Gemini 3 Stream...');
    setAnalysisResult(null);
    setError(null);
    setChatMessages([]); 
    setChatHistory([]);

    try {
      const result = await analyzeModelCode(code, (bytes) => {
          // Format bytes to KB for display
          const kb = (bytes / 1024).toFixed(1);
          setAnalysisProgress(`Streaming Analysis... ${kb} KB received`);
      });
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const handleChatMessage = async (userMessage: string) => {
    if (!analysisResult) {
      alert("Please run an analysis first so I have context!");
      return;
    }

    const newUserMsg: ChatMessage = { role: 'user', text: userMessage, timestamp: new Date() };
    setChatMessages(prev => [...prev, newUserMsg]);
    setIsChatting(true);

    const currentHistory = [
       ...chatHistory,
       { role: 'user', parts: [{ text: userMessage }] }
    ];

    let fullResponse = '';
    
    // Create placeholder for bot response
    setChatMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

    await streamChatResponse(
      `Code: \n${code}\n\nAnalysis Summary: ${JSON.stringify(analysisResult.summary)}`,
      chatHistory, // Pass previous history (Gemini SDK manages formatting usually, but here we pass raw array)
      userMessage,
      (chunk) => {
        fullResponse += chunk;
        setChatMessages(prev => {
          const newArr = [...prev];
          newArr[newArr.length - 1].text = fullResponse;
          return newArr;
        });
      }
    );

    setChatHistory([...currentHistory, { role: 'model', parts: [{ text: fullResponse }] }]);
    setIsChatting(false);
  };

  // --- RESIZE HANDLERS ---
  const startResizeLeft = () => setIsResizingLeft(true);
  const startResizeRight = () => setIsResizingRight(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;

      if (isResizingLeft) {
        // Calculate new left width percentage
        const newLeftWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;
        // Constraints: Min 15%, Max (100 - right - 15)%
        const maxLeft = 100 - rightWidth - 15;
        setLeftWidth(Math.min(Math.max(15, newLeftWidth), maxLeft));
      }

      if (isResizingRight) {
         // Calculate new right width percentage (distance from right edge)
         const newRightWidth = ((containerRect.right - e.clientX) / containerWidth) * 100;
         // Constraints: Min 15%, Max (100 - left - 15)%
         const maxRight = 100 - leftWidth - 15;
         setRightWidth(Math.min(Math.max(15, newRightWidth), maxRight));
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, leftWidth, rightWidth]);


  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-slate-950 flex items-center justify-between px-6 shrink-0 z-20 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/50">
             <ShieldCheck className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest brand-font">
            AEGIS <span className="text-blue-500 font-medium text-sm tracking-normal">| AI DEFENSE PROTOCOL</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 font-mono">
             ENGINE: GEMINI 3 PRO
           </span>
           <a href="#" className="text-slate-500 hover:text-white transition-colors">
             <Github size={20} />
           </a>
        </div>
      </header>

      {/* Main Content Grid - Resizable */}
      <main ref={containerRef} className="flex-1 flex flex-row overflow-hidden relative bg-slate-950">
        
        {/* Left: Input Code Panel */}
        <div style={{ width: `${leftWidth}%` }} className="h-full z-10 shrink-0">
          <CodePanel 
            code={code} 
            setCode={setCode} 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing} 
          />
        </div>

        {/* Resizer Handle Left */}
        <div 
            className="w-1 bg-slate-900 hover:bg-blue-500 cursor-col-resize z-20 transition-colors flex flex-col justify-center items-center group border-l border-slate-800"
            onMouseDown={startResizeLeft}
        >
            <GripVertical size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Center: Analysis Result (Fills remaining space) */}
        <div className="flex-1 h-full z-0 overflow-hidden relative min-w-[200px] bg-slate-950">
           <AnalysisPanel 
             result={analysisResult} 
             loading={isAnalyzing} 
             progress={analysisProgress}
             error={error} 
             code={code} 
           />
        </div>

        {/* Resizer Handle Right */}
        <div 
            className="w-1 bg-slate-900 hover:bg-blue-500 cursor-col-resize z-20 transition-colors flex flex-col justify-center items-center group border-l border-slate-800"
            onMouseDown={startResizeRight}
        >
             <GripVertical size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Right: Sentinel Chat Panel */}
        <div 
           style={chatFullScreen ? { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 } : { width: `${rightWidth}%` }} 
           className={`h-full shrink-0 transition-all duration-300 ease-in-out ${chatFullScreen ? '' : 'z-10'}`}
        >
           <ChatPanel 
              onSendMessage={handleChatMessage} 
              messages={chatMessages} 
              isChatting={isChatting}
              isFullScreen={chatFullScreen}
              onToggleFullScreen={() => setChatFullScreen(!chatFullScreen)}
           />
        </div>

      </main>
    </div>
  );
}

export default App;
