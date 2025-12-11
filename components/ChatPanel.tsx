
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: ChatMessage[];
  isChatting: boolean;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  onSendMessage, 
  messages, 
  isChatting, 
  isFullScreen, 
  onToggleFullScreen 
}) => {
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isFullScreen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatting) return;
    const msg = input;
    setInput('');
    await onSendMessage(msg);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 border-l border-slate-800 ${isFullScreen ? 'shadow-none' : 'shadow-2xl shadow-black'}`}>
      {/* HEADER */}
      <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-200">Ask AEGIS</h2>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
              onClick={onToggleFullScreen}
              className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          >
              {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <Bot size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-sm font-medium text-slate-400">
              Ready to analyze.
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Ask me about architecture, vulnerabilities, or performance bottlenecks.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'bg-blue-900/30 text-blue-400 border border-blue-900/50'
                }`}
              >
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div
                className={`max-w-[90%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm group relative ${
                  msg.role === 'user'
                    ? 'bg-slate-800 border border-slate-700 text-slate-200'
                    : 'bg-blue-950/30 border border-blue-900/30 text-slate-300'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.role === 'model' && (
                    <div className="flex justify-end mt-2 pt-2 border-t border-slate-700/50">
                        <button 
                        onClick={() => handleCopy(msg.text, idx)} 
                        className="flex items-center gap-1.5 text-[10px] font-medium text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wide"
                        >
                        {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                        {copiedIndex === idx ? "Copied" : "Copy"}
                        </button>
                    </div>
                )}
              </div>
            </div>
          ))
        )}
        {isChatting && (
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center shrink-0 border border-blue-900/50">
                    <Bot size={14} />
                </div>
                <div className="bg-blue-950/20 border border-blue-900/30 rounded-2xl p-3 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isChatting}
            className="flex-1 pl-4 pr-10 py-2.5 rounded-full border border-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-800 disabled:text-slate-500 shadow-sm bg-slate-900 text-slate-200 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatting}
            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={16} className={isChatting ? "opacity-0" : "ml-0.5"} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
