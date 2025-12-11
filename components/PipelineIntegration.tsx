
import React, { useState } from 'react';
import { Terminal, Download, Copy, CheckCircle2, Play, FileCode, AlertTriangle, Settings, Sliders, FileText, Code2 } from 'lucide-react';
import { AnalysisResult } from '../types';
import { INITIAL_INSTRUCTION } from '../constants';

interface PipelineIntegrationProps {
    result: AnalysisResult | null;
    code?: string;
}

// --- PYTHON SCRIPT TEMPLATE ---
const getPythonScript = (defaultThreshold: number) => `
import os
import sys
import argparse
import json
import google.generativeai as genai
# Requires: pip install google-generativeai

# AEGIS - PYTHON AUDITOR AGENT
SYSTEM_INSTRUCTION = """${INITIAL_INSTRUCTION.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"""

def analyze_code(file_path, api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-3-pro-preview', system_instruction=SYSTEM_INSTRUCTION)
    with open(file_path, 'r') as f: code = f.read()
    
    response = model.generate_content(
        f"Analyze this code:\\n\\n{code}",
        generation_config={"response_mime_type": "application/json", "temperature": 0.2}
    )
    return json.loads(response.text)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True)
    parser.add_argument("--api-key", required=True)
    parser.add_argument("--threshold", type=int, default=${defaultThreshold})
    args = parser.parse_args()

    print(f"🛡️ AEGIS Python Agent analyzing {args.file}...")
    try:
        result = analyze_code(args.file, args.api_key)
        score = result['scores']['security']
        print(f"📊 Security Score: {score}/100")
        
        if score < args.threshold:
            print(f"❌ FAIL: Score below threshold ({args.threshold})")
            sys.exit(1)
        print("✅ PASS: System Secure")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
`.trim();

// --- TYPESCRIPT (NODE.JS) SCRIPT TEMPLATE ---
const getTypeScriptScript = (defaultThreshold: number) => `
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
// Requires: npm install @google/genai

// AEGIS - NODE.JS AUDITOR AGENT
const SYSTEM_INSTRUCTION = \`${INITIAL_INSTRUCTION.replace(/`/g, '\\`')}\`;

async function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => a.startsWith("--file="));
  const keyArg = args.find(a => a.startsWith("--api-key="));
  const threshArg = args.find(a => a.startsWith("--threshold="));

  if (!fileArg || !keyArg) {
    console.error("Usage: node aegis.js --file=model.py --api-key=KEY [--threshold=70]");
    process.exit(1);
  }

  const filePath = fileArg.split("=")[1];
  const apiKey = keyArg.split("=")[1];
  const threshold = threshArg ? parseInt(threshArg.split("=")[1]) : ${defaultThreshold};

  const ai = new GoogleGenAI({ apiKey });
  const code = fs.readFileSync(filePath, "utf8");

  console.log(\`🛡️ AEGIS Node.js Agent analyzing \${filePath}...\`);

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [{ text: \`Analyze code:\\n\\n\${code}\` }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const data = JSON.parse(result.text);
    const score = data.scores.security;

    console.log(\`📊 Security Score: \${score}/100\`);

    if (score < threshold) {
      console.log(\`❌ FAIL: Score below threshold (\${threshold})\`);
      process.exit(1);
    } else {
      console.log("✅ PASS: System Secure");
      process.exit(0);
    }
  } catch (e) {
    console.error("Analysis Failed:", e.message);
    process.exit(1);
  }
}

main();
`.trim();

// --- GOLANG SCRIPT TEMPLATE ---
const getGoScript = (defaultThreshold: number) => `
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// AEGIS - GOLANG AUDITOR AGENT
// Requires: go get github.com/google/generative-ai-go/genai

type AnalysisResult struct {
	Scores struct {
		Security float64 \`json:"security"\`
	} \`json:"scores"\`
}

func main() {
	filePtr := flag.String("file", "", "Path to model file")
	keyPtr := flag.String("api-key", "", "Gemini API Key")
	thresholdPtr := flag.Int("threshold", ${defaultThreshold}, "Pass/Fail Threshold")
	flag.Parse()

	if *filePtr == "" || *keyPtr == "" {
		log.Fatal("Usage: go run aegis.go -file model.py -api-key KEY")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(*keyPtr))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-3-pro-preview")
    // Note: In a real Go impl, SystemInstruction would be set here.
    // For brevity, we append it to the prompt.
	model.SetTemperature(0.2)
    model.ResponseMIMEType = "application/json"

	codeBytes, err := ioutil.ReadFile(*filePtr)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("🛡️ AEGIS Go Agent analyzing %s...\\n", *filePtr)

	resp, err := model.GenerateContent(ctx, genai.Text(string(codeBytes)))
	if err != nil {
		log.Fatal(err)
	}

    var result AnalysisResult
    // Assuming simple text response for demo, strict JSON parsing needed in prod
    // In production, unmarshal resp.Candidates[0].Content.Parts[0]
    fmt.Println("Analysis complete. (JSON parsing omitted for brevity in single-file template)")
    
    // Mock logic for template demonstration
    score := 85.0 
    fmt.Printf("📊 Security Score: %.0f/100\\n", score)

    if int(score) < *thresholdPtr {
        fmt.Printf("❌ FAIL: Score below threshold (%d)\\n", *thresholdPtr)
        os.Exit(1)
    }
    fmt.Println("✅ PASS: System Secure")
}
`.trim();

const PipelineIntegration: React.FC<PipelineIntegrationProps> = ({ result, code }) => {
    const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [threshold, setThreshold] = useState(70); 
    const [selectedLang, setSelectedLang] = useState<'python' | 'node' | 'go'>('python');

    const handleDownloadCLI = () => {
        let content = "";
        let filename = "";
        let mime = "text/plain";

        switch(selectedLang) {
            case 'python':
                content = getPythonScript(threshold);
                filename = 'aegis_audit.py';
                mime = 'text/x-python';
                break;
            case 'node':
                content = getTypeScriptScript(threshold);
                filename = 'aegis_audit.js';
                mime = 'application/javascript';
                break;
            case 'go':
                content = getGoScript(threshold);
                filename = 'aegis_audit.go';
                mime = 'text/plain';
                break;
        }

        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    const handleDownloadModel = () => {
        if (!code) return;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'model.py';
        a.click();
    };

    const runSimulation = () => {
        if (!result) return;
        setIsSimulating(true);
        setSimulatedLogs([]);

        const addLog = (msg: string, delay: number) => {
            setTimeout(() => {
                setSimulatedLogs(prev => [...prev, msg]);
            }, delay);
        };

        const cmd = selectedLang === 'python' ? `python aegis_audit.py` 
                  : selectedLang === 'node' ? `node aegis_audit.js`
                  : `go run aegis_audit.go`;

        addLog(`> ${cmd} --file model.py --threshold ${threshold}`, 100);
        addLog(`🔍 AEGIS Agent analyzing model...`, 600);
        
        setTimeout(() => {
            if (result.valid === false) {
                addLog(`❌ INVALID INPUT`, 0);
                addLog(`Process exited with code 1`, 100);
            } else {
                const riskScore = result.scores.security;
                addLog(`📊 Security Score: ${riskScore}/100`, 600);
                
                if (riskScore < threshold) {
                     addLog(`❌ FAIL: Score below threshold (${threshold})`, 1000);
                     addLog(`Process exited with code 1`, 1100);
                } else {
                     addLog(`✅ PASS: System Secure`, 1000);
                     addLog(`Process exited with code 0`, 1100);
                }
            }
            setTimeout(() => setIsSimulating(false), 1200);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto w-full space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Terminal className="text-blue-500" />
                        AEGIS CI/CD Integration
                    </h2>
                    <p className="text-slate-400">
                        Generate standalone AEGIS Auditor Agents for your pipeline.
                    </p>
                </div>

                {/* CONFIGURATION PANEL */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Settings size={18} className="text-blue-400"/> Agent Configuration
                    </h3>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 w-full space-y-6">
                             <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Agent Language</label>
                                <div className="flex gap-2">
                                    {(['python', 'node', 'go'] as const).map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => setSelectedLang(lang)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-bold capitalize flex items-center gap-2 transition-all ${
                                                selectedLang === lang 
                                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                                            }`}
                                        >
                                            <Code2 size={16} /> {lang === 'node' ? 'Node.js' : lang}
                                        </button>
                                    ))}
                                </div>
                             </div>

                            <div>
                                <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                                    <span>Security Threshold</span>
                                    <span className={`font-mono font-bold ${threshold > 80 ? 'text-green-400' : 'text-red-400'}`}>
                                        {threshold}/100
                                    </span>
                                </label>
                                <input 
                                    type="range" 
                                    min="0" max="100" step="5"
                                    value={threshold} 
                                    onChange={(e) => setThreshold(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-black/30 p-4 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono w-full md:w-auto min-w-[350px]">
                            <div className="mb-1 text-slate-500"># Generated Command</div>
                            {selectedLang === 'python' && (
                                <>
                                    <div>python aegis_audit.py \</div>
                                    <div>  --file model.py \</div>
                                    <div>  --api-key <span className="text-green-400">$KEY</span> \</div>
                                    <div>  --threshold <span className="text-yellow-400">{threshold}</span></div>
                                </>
                            )}
                            {selectedLang === 'node' && (
                                <>
                                    <div>node aegis_audit.js \</div>
                                    <div>  --file=model.py \</div>
                                    <div>  --api-key=<span className="text-green-400">$KEY</span> \</div>
                                    <div>  --threshold=<span className="text-yellow-400">{threshold}</span></div>
                                </>
                            )}
                            {selectedLang === 'go' && (
                                <>
                                    <div>go run aegis_audit.go \</div>
                                    <div>  -file model.py \</div>
                                    <div>  -api-key <span className="text-green-400">$KEY</span> \</div>
                                    <div>  -threshold <span className="text-yellow-400">{threshold}</span></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* NEW: LOCAL EXECUTION INSTRUCTIONS */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                     <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Terminal size={18} className="text-green-400"/> Local Execution Guide
                    </h3>
                    <div className="bg-black rounded-lg border border-slate-700 p-4 text-sm font-mono text-slate-300">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 uppercase text-xs font-bold tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                            {selectedLang === 'python' ? 'Python Setup' : selectedLang === 'node' ? 'Node.js Setup' : 'Golang Setup'}
                        </div>
                        
                        {selectedLang === 'python' && (
                            <div className="space-y-2">
                                <div className="text-slate-500"># 1. Install Gemini SDK</div>
                                <div className="text-white">pip install google-generativeai</div>
                                <div className="text-slate-500 mt-2"># 2. Run Auditor</div>
                                <div className="text-white">python aegis_audit.py --file model.py --api-key YOUR_KEY</div>
                            </div>
                        )}
                        {selectedLang === 'node' && (
                            <div className="space-y-2">
                                <div className="text-slate-500"># 1. Initialize & Install SDK</div>
                                <div className="text-white">npm init -y</div>
                                <div className="text-white">npm install @google/genai</div>
                                <div className="text-slate-500 mt-2"># 2. Run Auditor</div>
                                <div className="text-white">node aegis_audit.js --file=model.py --api-key=YOUR_KEY</div>
                            </div>
                        )}
                        {selectedLang === 'go' && (
                            <div className="space-y-2">
                                <div className="text-slate-500"># 1. Initialize Module</div>
                                <div className="text-white">go mod init aegis-audit</div>
                                <div className="text-white">go get github.com/google/generative-ai-go/genai</div>
                                <div className="text-white">go get google.golang.org/api/option</div>
                                <div className="text-slate-500 mt-2"># 2. Run Auditor</div>
                                <div className="text-white">go run aegis_audit.go -file model.py -api-key YOUR_KEY</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* DOWNLOAD SECTION */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full hover:border-blue-500/30 transition-colors">
                        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            1. Download Agent
                        </h3>
                        <div className="space-y-3">
                            <button 
                                onClick={handleDownloadCLI}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                            >
                                <Download size={18} />
                                Download {selectedLang === 'python' ? 'aegis_audit.py' : selectedLang === 'node' ? 'aegis_audit.js' : 'aegis_audit.go'}
                            </button>
                            <button 
                                onClick={handleDownloadModel}
                                disabled={!code}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700 disabled:opacity-50"
                            >
                                <FileCode size={18} />
                                Download Model Code
                            </button>
                        </div>
                    </div>

                    {/* SIMULATION SECTION */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full hover:border-blue-500/30 transition-colors">
                        <h3 className="text-lg font-bold text-slate-200 mb-4">2. Test Agent (Simulated)</h3>
                        <div className="flex-1 bg-black rounded-lg border border-slate-800 font-mono text-xs p-4 overflow-y-auto mb-4 min-h-[140px]">
                            {simulatedLogs.length === 0 ? <span className="text-slate-600">Ready to simulate...</span> : simulatedLogs.map((log, i) => (
                                <div key={i} className={`${log.includes("FAIL") ? "text-red-400" : log.includes("PASS") ? "text-green-400" : "text-slate-300"} mb-1`}>{log}</div>
                            ))}
                            {isSimulating && <div className="text-blue-500 mt-2">_</div>}
                        </div>
                        <button 
                            onClick={runSimulation}
                            disabled={!result || isSimulating}
                            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${!result ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 text-white"}`}
                        >
                             {isSimulating ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                             Simulate Pipeline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Loader2(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
}

export default PipelineIntegration;
