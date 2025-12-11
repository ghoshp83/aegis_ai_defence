
import React from 'react';
import { ShieldCheck, Award, Lock, Fingerprint } from 'lucide-react';

interface CertificateProps {
    score: number;
    modelName: string;
    onClose: () => void;
}

const ComplianceCertificate: React.FC<CertificateProps> = ({ score, modelName, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    const passed = score >= 70;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
             <div className="bg-white text-slate-900 w-[800px] min-h-[600px] p-10 relative shadow-2xl animate-fade-in print:w-full print:h-full print:fixed print:inset-0 print:z-50 print:p-0">
                 {/* Decorative Border */}
                 <div className="absolute inset-4 border-4 border-double border-slate-800 pointer-events-none"></div>
                 <div className="absolute inset-6 border border-slate-300 pointer-events-none"></div>

                 {/* Header */}
                 <div className="text-center mt-6">
                     <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-full mb-6 shadow-xl">
                         <ShieldCheck className="text-white w-12 h-12" />
                     </div>
                     <h1 className="text-4xl font-serif font-bold tracking-wider text-slate-900 uppercase mb-2">
                         Certificate of Compliance
                     </h1>
                     <p className="text-slate-500 font-serif italic text-lg">
                         AEGIS AI Defense Protocol
                     </p>
                 </div>

                 {/* Body */}
                 <div className="mt-12 text-center space-y-6">
                     <p className="text-lg text-slate-700">This document certifies that the neural network:</p>
                     
                     <div className="text-2xl font-bold font-mono text-blue-900 border-b-2 border-slate-900 inline-block px-8 py-2">
                         {modelName}
                     </div>

                     <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed px-8">
                         Has been audited by the AEGIS Automated Defense System for robustness, accuracy, and cybersecurity resilience.
                     </p>

                     <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto mt-8">
                        <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Security Score</div>
                            <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                {score}/100
                            </div>
                        </div>
                        <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Compliance Status</div>
                            <div className="text-xl font-bold text-blue-900 flex items-center justify-center gap-2">
                                <Award size={20} />
                                {passed ? 'PASSED' : 'FAILED'}
                            </div>
                        </div>
                     </div>

                     <div className="bg-slate-100 p-3 rounded text-sm text-slate-600 font-mono inline-block border border-slate-200">
                         EU AI Act Article 15 (Robustness & Cybersecurity) Compliant
                     </div>
                 </div>

                 {/* Footer */}
                 <div className="mt-16 flex justify-between items-end px-12">
                     <div className="text-center">
                         <div className="w-48 border-b border-slate-900 mb-2"></div>
                         <p className="text-sm font-bold text-slate-500 uppercase">Gemini 3 Pro Engine</p>
                     </div>
                     <div className="text-center flex flex-col items-center">
                         <div className="border-2 border-slate-900 rounded p-2 mb-2 opacity-50">
                             <Fingerprint className="w-10 h-10 text-slate-900" />
                         </div>
                         <p className="text-[10px] font-mono text-slate-400">ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                     </div>
                     <div className="text-center">
                        <div className="font-serif text-2xl italic text-slate-800 mb-2" style={{fontFamily: 'Cursive'}}>AI Sentinel</div>
                         <div className="w-48 border-b border-slate-900 mb-2"></div>
                         <p className="text-sm font-bold text-slate-500 uppercase">System Signature</p>
                     </div>
                 </div>
                 
                 <div className="absolute bottom-6 left-0 right-0 text-center">
                     <p className="text-xs text-slate-400">Audit Date: <span className="font-bold text-slate-600">{date}</span></p>
                 </div>

                 {/* No-Print Controls */}
                 <div className="absolute top-0 right-0 p-4 print:hidden flex gap-2">
                     <button 
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg font-bold"
                     >
                         Print / Save PDF
                     </button>
                     <button 
                        onClick={onClose}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded shadow-lg font-bold"
                     >
                         Close
                     </button>
                 </div>
             </div>
        </div>
    );
};

export default ComplianceCertificate;
