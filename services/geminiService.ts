
import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { INITIAL_INSTRUCTION } from "../constants";
import { AnalysisResult, RLOptimizationResult } from "../types";

// Initialize Gemini Client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};

// Define the response schema for the analysis
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    valid: { type: Type.BOOLEAN, description: "Set to FALSE if the input is junk, random text, or not code." },
    error: { type: Type.STRING, description: "Reason why input is invalid (if valid is false)." },
    summary: { type: Type.STRING, description: "Executive summary of the model." },
    scores: {
      type: Type.OBJECT,
      description: "0-100 scores for dashboard gauges",
      properties: {
        security: { type: Type.NUMBER },
        robustness: { type: Type.NUMBER },
        efficiency: { type: Type.NUMBER },
        accuracy: { type: Type.NUMBER },
      },
      required: ["security", "robustness", "efficiency", "accuracy"]
    },
    architecture: {
      type: Type.OBJECT,
      properties: {
        overview: { type: Type.STRING },
        layers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              params: { type: Type.STRING },
              paramCount: { type: Type.NUMBER, description: "Raw integer count of parameters" },
              details: { type: Type.STRING },
              isBottleneck: { type: Type.BOOLEAN, description: "True if this layer has >80% of total params or causes issues" },
            },
            required: ["name", "type", "params", "paramCount", "details", "isBottleneck"]
          },
        },
        totalParams: { type: Type.STRING },
      },
    },
    explainability: {
      type: Type.OBJECT,
      properties: {
        decisionProcess: { type: Type.STRING },
        topFeatures: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              feature: { type: Type.STRING },
              importance: { type: Type.NUMBER, description: "0 to 100" },
            },
          },
        },
        attentionMechanism: { type: Type.STRING, nullable: true },
      },
    },
    vulnerabilities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
          description: { type: Type.STRING },
          mitigation: { type: Type.STRING },
          businessImpact: { type: Type.STRING, description: "Monetary or operational impact (e.g. '$50k/hr loss')" },
          exploitability: { type: Type.STRING, description: "Time or difficulty to exploit" },
        },
        required: ["id", "name", "severity", "description", "mitigation", "businessImpact", "exploitability"]
      },
    },
    securityAnalysis: {
        type: Type.OBJECT,
        properties: {
            adversarial: {
                type: Type.OBJECT,
                properties: {
                    susceptibilityScore: { type: Type.NUMBER, description: "0-100% susceptibility" },
                    attackVectors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                successRate: { type: Type.STRING }
                            }
                        }
                    },
                    description: { type: Type.STRING }
                }
            },
            privacy: {
                type: Type.OBJECT,
                properties: {
                    riskScore: { type: Type.NUMBER },
                    leakageRisk: { type: Type.STRING },
                    membershipInference: { type: Type.STRING }
                }
            },
            robustness: {
                type: Type.ARRAY,
                description: "Metrics for Radar Chart",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        metric: { type: Type.STRING, description: "e.g. Noise, Blur, Rotation" },
                        score: { type: Type.NUMBER, description: "0-100 robustness score" }
                    }
                }
            },
            attackScenarios: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        description: { type: Type.STRING },
                        timeToExploit: { type: Type.STRING },
                        severity: { type: Type.STRING, enum: ["Critical", "High", "Medium"] }
                    }
                }
            },
            compliance: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        regulation: { type: Type.STRING },
                        status: { type: Type.STRING, enum: ["Pass", "Fail", "Warning"] },
                        details: { type: Type.STRING }
                    }
                }
            }
        },
        required: ["adversarial", "privacy", "robustness", "attackScenarios", "compliance"]
    },
    performance: {
      type: Type.OBJECT,
      properties: {
        metrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              value: { type: Type.NUMBER },
              unit: { type: Type.STRING, nullable: true },
              benchmark: { type: Type.NUMBER, nullable: true },
              status: { type: Type.STRING, enum: ["good", "average", "poor"] },
            },
          },
        },
        parameterBreakdown: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
               layer: { type: Type.STRING },
               count: { type: Type.NUMBER },
               percentage: { type: Type.NUMBER },
             }
          }
        },
        efficiencyAnalysis: { type: Type.STRING },
        bottlenecks: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    remediatedCode: { type: Type.STRING, description: "The full original code rewritten with security fixes applied." },
    exploitPoC: {
        type: Type.OBJECT,
        description: "A Python script that demonstrates how to attack this model.",
        properties: {
            title: { type: Type.STRING },
            code: { type: Type.STRING },
            description: { type: Type.STRING }
        },
        required: ["title", "code", "description"]
    },
    threatIntelligence: {
      type: Type.OBJECT,
      properties: {
        cves: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "e.g. CVE-2023-1234"},
              description: { type: Type.STRING },
              severity: { type: Type.STRING },
            }
          }
        },
        realWorldIncidents: { type: Type.STRING, description: "Brief description of real world attacks on this architecture."},
        affectedSystemsCount: { type: Type.STRING, description: "e.g. '10,000+'"},
      },
      required: ["cves", "realWorldIncidents", "affectedSystemsCount"]
    }
  },
  required: ["valid", "summary", "scores", "architecture", "explainability", "vulnerabilities", "securityAnalysis", "performance", "recommendations", "remediatedCode", "exploitPoC", "threatIntelligence"],
};

export const analyzeModelCode = async (
    code: string,
    onProgress?: (bytesReceived: number) => void
): Promise<AnalysisResult> => {
  try {
    const ai = getAiClient();
    
    const SYSTEM_INSTRUCTION = `
    ${INITIAL_INSTRUCTION}

    ### EXTENDED SECURITY AUDIT INSTRUCTIONS (MANDATORY)
    You are a hostile red-team security auditor AND a benevolent blue-team engineer.
    
    ### PHASE 0: INPUT VALIDATION (CRITICAL)
    Before analyzing, you MUST check if the input is valid source code (Python, Go, C++, etc.) for a neural network or machine learning model.
    - If the input is junk text (e.g., "adsfasdf"), a recipe, a novel, or random data:
      - Set "valid" to false.
      - Set "error" to "Input is not valid source code."
      - Fill other fields with dummy/empty data.
      - STOP.
    - If valid, set "valid" to true and proceed.

    ### PHASE 1: ACTIVE DEFENSE (THE UNIQUE SELLING POINT)
    1. **Remediated Code**: You MUST rewrite the provided code to fix the vulnerabilities you found.
       - Add Dropouts, Batch Normalization, Input Validation (assert shape), and secure randomness.
       - Return the FULL corrected code in \`remediatedCode\`.
    
    2. **Proof of Exploit (PoC)**: You MUST write a standalone Python script (even if the model is Go/C++) that would theoretically attack this model.
       - E.g., A script that generates an adversarial image using FGSM, or a script that sends 10GB of data to cause OOM.
       - Put this in \`exploitPoC\`.
       
    ### PHASE 2: METRICS & VISUALS
    - **Hypothetical Feature Importance**: Do NOT return an empty topFeatures array.
    - **Threat Intelligence**: Hallucinate realistic CVEs and threat data that *would* apply to libraries used in this code (e.g. if using old TensorFlow, list known TF CVEs).
    `;

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3-pro-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze this neural network code and provide a comprehensive audit report with detailed security metrics, fixed code, and exploit script:\n\n${code}` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, 
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      },
    });

    let fullText = "";
    for await (const chunk of responseStream) {
        if (chunk.text) {
            fullText += chunk.text;
            onProgress?.(fullText.length);
        }
    }

    if (fullText) {
      const result = parseJSONRobust(fullText);
      // Ensure basic structure if parse returns weirdness
      if (!result || typeof result !== 'object') {
          throw new Error("Invalid response format from AI");
      }
      return result;
    }

    throw new Error("No response generated from Gemini API.");
  } catch (error: any) {
    console.error("Analysis failed:", error);
    if (error.message?.includes("API_KEY is missing")) throw error;
    if (error.code === 429 || error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED") {
        throw new Error("Gemini Quota Exceeded. Please check your billing/quota limits.");
    }
    if (error.message?.includes("403") || error.message?.includes("API key not valid")) throw new Error("Invalid API Key or Model Access Denied.");
    if (error.message?.includes("503")) throw new Error("Gemini Service is currently overloaded. Please try again in a few moments.");
    if (error instanceof SyntaxError) throw new Error("The AI model generated an invalid or incomplete response. Please try again.");
    throw new Error(error.message || "An unexpected error occurred during analysis.");
  }
};

export const optimizeModelWithRL = async (
    code: string,
    rewardFocus: 'security' | 'efficiency' | 'balanced',
    onChunk: (text: string) => void
): Promise<RLOptimizationResult> => {
    const ai = getAiClient();

    // Use Structured Text format instead of JSON Schema for complex code generation
    // This is much more robust for Gemini 3 Pro when generating large code blocks
    const SYSTEM_PROMPT = `You are a Reinforcement Learning Agent (Policy Network).
    Goal: Optimize the user's neural network code for: ${rewardFocus.toUpperCase()}.
    
    Task:
    1. Analyze the input code.
    2. Simulate 3-5 iterations (Episodes) of improvements.
    3. Generate the final optimized code.

    OUTPUT FORMAT:
    You must output a structured log using the tags below. Do not use Markdown code blocks for the tags.
    
    <EPISODE>
    Episode: 1
    Action: [What you changed, e.g. Added Dropout]
    Reward: [Number, e.g. +10]
    Outcome: [Brief result description]
    </EPISODE>
    
    <EPISODE>
    Episode: 2
    ...
    </EPISODE>
    
    <FINAL_CODE>
    [Insert the FULL runnable optimized code here. No truncation.]
    </FINAL_CODE>
    
    <STATS>
    SecurityGain: [e.g. +25%]
    PerformanceImpact: [e.g. -5% latency]
    </STATS>
    `;

    // Wrap the entire streaming process in a promise that handles timeouts and errors
    const runStream = async (): Promise<RLOptimizationResult> => {
        try {
            const responseStream = await ai.models.generateContentStream({
                model: "gemini-3-pro-preview",
                contents: [{
                    role: "user",
                    parts: [{ text: `Optimize this code using RL Simulation. Focus: ${rewardFocus}\n\n${code}` }]
                }],
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    temperature: 0.4, // Slightly higher temp for creative code generation
                    safetySettings: [
                      {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                      },
                    ],
                }
            });

            let fullText = "";
            for await (const chunk of responseStream) {
                const text = chunk.text;
                if (text) {
                    // Filter out garbage repetition if it occurs
                    if (text.length > 20 && /^0+$/.test(text)) continue; 
                    fullText += text;
                    onChunk(fullText);
                }
            }

            // Parsing the Structured Text Output
            const result: RLOptimizationResult = {
                iterations: [],
                finalStats: { securityGain: "Unknown", performanceImpact: "Unknown" },
                optimizedCode: ""
            };

            // 1. Extract Episodes
            const episodeRegex = /<EPISODE>([\s\S]*?)<\/EPISODE>/g;
            let match;
            while ((match = episodeRegex.exec(fullText)) !== null) {
                const content = match[1];
                const episode = parseInt(content.match(/Episode:\s*(\d+)/)?.[1] || "0");
                const action = content.match(/Action:\s*(.*)/)?.[1]?.trim() || "Unknown Action";
                const rewardStr = content.match(/Reward:\s*([+\-]?\d+)/)?.[1] || "0";
                const outcome = content.match(/Outcome:\s*(.*)/)?.[1]?.trim() || "Processed";
                
                if (episode > 0) {
                    result.iterations.push({
                        episode,
                        action,
                        reward: parseInt(rewardStr),
                        outcome
                    });
                }
            }

            // 2. Extract Code
            const codeMatch = fullText.match(/<FINAL_CODE>([\s\S]*?)<\/FINAL_CODE>/);
            if (codeMatch) {
                let codeClean = codeMatch[1].trim();
                // Remove markdown code fences if the model added them inside the tag
                codeClean = codeClean.replace(/^```\w*\n/, '').replace(/\n```$/, '');
                result.optimizedCode = codeClean;
            } else {
                 result.optimizedCode = "// Code generation incomplete or format error.\n// Check logs for partial output.";
            }

            // 3. Extract Stats
            const statsMatch = fullText.match(/<STATS>([\s\S]*?)<\/STATS>/);
            if (statsMatch) {
                const content = statsMatch[1];
                result.finalStats.securityGain = content.match(/SecurityGain:\s*(.*)/)?.[1]?.trim() || "Unknown";
                result.finalStats.performanceImpact = content.match(/PerformanceImpact:\s*(.*)/)?.[1]?.trim() || "Unknown";
            }

            return result;

        } catch (error: any) {
            console.error("RL Optimization failed:", error);
             if (error.code === 429 || error.message?.includes("429")) {
                throw new Error("RL Simulation Quota Exceeded. Upgrade plan.");
            }
            throw new Error(`Failed to run RL simulation: ${error.message}`);
        }
    };

    // Timeout Promise (90s for slower Pro model)
    const timeoutPromise = new Promise<RLOptimizationResult>((_, reject) => 
        setTimeout(() => reject(new Error("Simulation timed out (90s limit).")), 90000)
    );

    return Promise.race([runStream(), timeoutPromise]);
};

// Helper: Context-Aware Robust JSON Parsing with Stack-Based Repair
function parseJSONRobust(text: string): any {
    let clean = text.trim();
    // remove markdown wrappers
    clean = clean.replace(/^```(json)?\s*/, "").replace(/\s*```$/, "");

    try {
        return JSON.parse(clean);
    } catch (e) {
        // Advanced Repair Logic
        let repaired = clean;
        let inString = false;
        let escaped = false;
        
        // 1. Handle truncated string at the end
        // Iterate to find end state
        for (let i = 0; i < clean.length; i++) {
            if (clean[i] === '"' && !escaped) inString = !inString;
            if (clean[i] === '\\' && !escaped) escaped = true;
            else escaped = false;
        }
        
        // If truncated inside a string, close it
        if (inString) {
             if (escaped) repaired = repaired.slice(0, -1); // remove trailing escape
             repaired += '"';
        }

        // 2. Handle truncated structures (arrays/objects) using a STACK
        // We only care about matching { [ with } ] outside strings
        const stack: string[] = [];
        inString = false;
        escaped = false;
        
        for (let i = 0; i < repaired.length; i++) {
            const char = repaired[i];
            if (char === '"' && !escaped) inString = !inString;
            
            if (!inString) {
                if (char === '{') stack.push('}');
                else if (char === '[') stack.push(']');
                else if (char === '}' || char === ']') {
                    // Check if matches top of stack
                    if (stack.length > 0) {
                        const last = stack[stack.length - 1];
                        if (last === char) stack.pop();
                    }
                }
            }
            
            if (char === '\\' && !escaped) escaped = true;
            else escaped = false;
        }
        
        // Pop stack to close
        while (stack.length > 0) {
            repaired += stack.pop();
        }

        try {
            return JSON.parse(repaired);
        } catch (e2) {
             // Fallback: Try regex to at least get 'iterations'
             const iterMatch = clean.match(/"iterations"\s*:\s*\[([\s\S]*?)\]/);
             if (iterMatch) {
                 // Clean trailing commas in array items to be safe
                 const iterContent = iterMatch[1].replace(/,\s*$/, "");
                 const safeJson = `{ "iterations": [${iterContent}], "finalStats": {"securityGain": "unknown", "performanceImpact": "unknown"}, "optimizedCode": "// Output Truncated" }`;
                 try { return JSON.parse(safeJson); } catch (e3) { /* ignore */ }
             }
             throw new Error("Response truncated and unrecoverable.");
        }
    }
}

export const streamChatResponse = async (
  codeContext: string,
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  onChunk: (text: string) => void
) => {
  try {
    const ai = getAiClient();
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: `You are AEGIS (Advanced Electronic Guard & Intelligence System).
        
        ### YOUR IDENTITY
        - You are NOT just a generic AI assistant. You are the AEGIS Platform.
        - Your goal is to secure neural networks against adversarial attacks, privacy leaks, and inefficiency.
        
        ### YOUR CAPABILITIES (Self-Knowledge)
        If asked "Why use AEGIS?", "What can you do?", or "Features", you MUST explain:
        1. **Deep Security Audit**: You analyze PyTorch/TensorFlow/Go code for hardcoded shapes, missing regularization, and gradient attack vectors.
        2. **Active Defense**: You don't just find bugs; you fix them. You generate remediated code (Blue Team) and proof-of-concept exploit scripts (Red Team).
        3. **RL Auto-Optimizer**: You simulate a Reinforcement Learning agent to iteratively improve the model's security and efficiency.
        4. **Veo Executive Briefings**: You generate cinematic 4K video reports for non-technical stakeholders using Google Veo.
        5. **CI/CD Integration**: You provide standalone CLI agents (Python/Node/Go) to gate deployments in pipelines.

        ### CONTEXT
        The user is asking about the following model code: 
        \n${codeContext}\n. 
        
        Answer specific questions about its logic, flaws, or why it might behave in certain ways. 
        Keep answers concise but technically accurate.`,
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error: any) {
    console.error("Chat stream failed:", error);
    if (error.code === 429 || error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED") {
        onChunk("Error: Quota exceeded. Please check your billing.");
    } else {
        onChunk(`Error: ${error.message || "Failed to generate response."}`);
    }
  }
};

export const generateAuditVideo = async (
    result: AnalysisResult,
    onStatusUpdate?: (status: string) => void
): Promise<string> => {
    
    // 1. Helper to handle API Key Selection in Browser
    const ensureKey = async (forcePrompt = false) => {
        const win = window as any;
        // Only run this logic if we are in an environment that supports aistudio key selection
        if (!win.aistudio) return;

        try {
            const hasKey = await win.aistudio.hasSelectedApiKey();
            if (forcePrompt || !hasKey) {
                onStatusUpdate?.("Please select a paid API Key...");
                await win.aistudio.openSelectKey();
            }
        } catch (e) {
            console.warn("Error checking API key status:", e);
        }
    };

    // Initial check
    await ensureKey();

    let ai = getAiClient();

    // 2. Deterministic Prompt (No hallucinations)
    onStatusUpdate?.("Designing video...");
    const score = result.scores.security;
    const isPass = score > 70;
    
    // Simplified safe prompts to avoid blocks
    const prompt = isPass
        ? `Futuristic HUD interface. Glowing green 3D neural network. Text "SECURE SCORE ${score}". Clean, high-tech, photorealistic, 4k.`
        : `Futuristic HUD interface. Red alert status. Neural network with errors. Text "CRITICAL ALERT SCORE ${score}". Dark, cinematic, photorealistic, 4k.`;

    // 3. Generate Video with Retry Logic
    onStatusUpdate?.("Initializing Veo Model...");
    let operation;
    
    try {
        operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });
    } catch (e: any) {
        console.error("Veo init failed:", e);

        // Explicitly handle Quota/Billing errors (429 / RESOURCE_EXHAUSTED)
        if (e.code === 429 || e.status === "RESOURCE_EXHAUSTED" || e.message?.includes("429") || e.message?.includes("quota") || e.message?.includes("RESOURCE_EXHAUSTED")) {
             throw new Error("Veo Quota Exceeded. Please check your Google Cloud billing or try a different API Key (Paid Tier Required).");
        }
        
        // Handle "Entity not found" (Access denied / Wrong Key)
        if (e.message?.includes("Requested entity was not found") || e.message?.includes("404")) {
             onStatusUpdate?.("Access denied. Prompting for key...");
             // Force user to pick a key
             await ensureKey(true);
             
             // Refresh client with new key
             ai = getAiClient(); 
             
             // Retry once
             try {
                operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: prompt,
                    config: {
                        numberOfVideos: 1,
                        resolution: '720p',
                        aspectRatio: '16:9'
                    }
                });
             } catch (retryE: any) {
                 if (retryE.code === 429 || retryE.status === "RESOURCE_EXHAUSTED" || retryE.message?.includes("429") || retryE.message?.includes("quota")) {
                    throw new Error("Veo Quota Exceeded. Please check your Google Cloud billing.");
                 }
                 throw retryE;
             }
        } else {
            throw e; // Bubble up other errors
        }
    }

    if (!operation) {
        throw new Error("Failed to initialize video operation.");
    }

    // 4. Poll for completion
    const MAX_RETRIES = 60; // 10 minutes max (10s * 60)
    let retries = 0;

    while (!operation.done) {
        if (retries >= MAX_RETRIES) {
             throw new Error("Video generation timed out.");
        }
        onStatusUpdate?.(`Rendering Video... ${Math.round((retries / 6) * 10)}%`); // Fake progress estimate
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10s
        operation = await ai.operations.getVideosOperation({operation: operation});
        retries++;
    }

    if (operation.error) {
         if (operation.error.code === 429 || operation.error.message?.includes("quota") || operation.error.status === "RESOURCE_EXHAUSTED") {
             throw new Error("Veo Quota Exceeded during processing. Please check your billing.");
         }
        throw new Error(`Veo Error: ${operation.error.message || "Generation failed"}`);
    }

    // 5. Get URI
    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) throw new Error("No video URI returned.");

    // 6. Download (with timeout)
    onStatusUpdate?.("Downloading...");
    const videoUrl = `${uri}&key=${process.env.API_KEY}`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout
        const videoResponse = await fetch(videoUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!videoResponse.ok) {
             // Fallback: If fetch fails (CORS?), return the direct URL with key
             console.warn("Direct download failed, falling back to stream URL");
             return videoUrl; 
        }
        const blob = await videoResponse.blob();
        return URL.createObjectURL(blob);
    } catch (e: any) {
        console.warn("Download error, using direct URL:", e);
        return videoUrl; // Fallback to playing strictly from URL
    }
};
