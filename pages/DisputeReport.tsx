
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MOCK_DISPUTE_REPORT } from '../mockData';
import { Contract, DisputeReportData } from '../types';
import { AlertOctagon, Check, X, AlertTriangle, ArrowLeft, BrainCircuit, Shield, Loader2, FileCode, Terminal, Server, Activity } from 'lucide-react';

interface DisputeReportProps {
    contracts?: Contract[];
}

export const DisputeReport: React.FC<DisputeReportProps> = ({ contracts = [] }) => {
  const { contractId, milestoneId } = useParams();
  
  const [report, setReport] = useState<DisputeReportData>(MOCK_DISPUTE_REPORT);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const loadingSteps = [
    { text: "Initializing Arbitration Node...", icon: Shield },
    { text: "Fetching Deliverables from IPFS...", icon: Server },
    { text: "Cloning Repository Codebase...", icon: FileCode },
    { text: "Parsing Quality Assurance Logs...", icon: Terminal },
    { text: "Verifying Acceptance Criteria Constraints...", icon: Activity },
    { text: "Calculating Compliance Score...", icon: BrainCircuit }
  ];

  // Logic to simulate dynamic report generation based on the disputed milestone
  useEffect(() => {
    if (contractId && milestoneId) {
        const contract = contracts.find(c => c.id === contractId);
        const milestone = contract?.milestones.find(m => m.id === milestoneId);
        
        if (milestone) {
            // Generate dynamic report data
            const failedCriteria = milestone.failedCriteria || [];
            const criteriaCount = milestone.acceptanceCriteria.length;
            const failCount = failedCriteria.length;
            
            // Simple logic: more fails = lower score
            const calculatedScore = Math.max(0, 100 - (failCount * 25) - 5); 
            
            const evidenceAnalysis = milestone.acceptanceCriteria.map(crit => {
                const isFailed = failedCriteria.includes(crit);
                return {
                    item: crit,
                    status: isFailed ? 'fail' : 'pass',
                    reason: isFailed ? 'Evidence provided does not meet this criteria based on automated checks.' : 'Verified against provided evidence.'
                };
            });

            // Add specific logic for the dispute reason if available
            if (milestone.disputeReason === 'delay') {
                evidenceAnalysis.push({
                    item: "Deadline Compliance",
                    status: "fail",
                    reason: `Milestone missed deadline of ${milestone.deadline}`
                });
            }

            const newReport: DisputeReportData = {
                contractId: contractId,
                milestoneId: milestoneId,
                generatedDate: new Date().toLocaleDateString('en-IN'),
                complianceScore: calculatedScore,
                confidenceLevel: calculatedScore > 80 ? 'High' : 'Medium',
                recommendation: calculatedScore > 80 ? 'Release Funds' : calculatedScore > 40 ? 'Partial Release' : 'Escalate',
                evidenceAnalysis: evidenceAnalysis as any
            };
            setReport(newReport);
        }
    }
  }, [contractId, milestoneId, contracts]);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= loadingSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
      const currentStepObj = loadingSteps[Math.min(loadingStep, loadingSteps.length - 1)];
      const CurrentIcon = currentStepObj.icon;
      
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full text-center relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                    <div 
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${(loadingStep / loadingSteps.length) * 100}%` }}
                    ></div>
                </div>
                
                {/* Pulsing Icon */}
                <div className="mb-8 relative inline-block mt-4">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-white p-6 rounded-full border-4 border-blue-500 z-10">
                        <CurrentIcon className="h-12 w-12 text-blue-600 animate-pulse" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">AI Arbitrator Working</h2>
                <p className="text-slate-500 font-mono text-sm mb-8 h-6">
                    {">"} {currentStepObj.text}
                </p>

                {/* Step List */}
                <div className="space-y-3 text-left pl-4 border-l-2 border-slate-100">
                    {loadingSteps.map((s, i) => (
                        <div key={i} className={`flex items-center text-xs transition-all duration-500 ${i > loadingStep ? 'opacity-30 grayscale' : 'opacity-100'}`}>
                            {i < loadingStep ? (
                                <Check className="text-emerald-500 mr-3 h-4 w-4" />
                            ) : i === loadingStep ? (
                                <Loader2 className="text-blue-500 mr-3 h-4 w-4 animate-spin" />
                            ) : (
                                <div className="h-4 w-4 mr-3 rounded-full border border-slate-300"></div>
                            )}
                            <span className={i === loadingStep ? 'font-bold text-blue-700' : 'text-slate-600'}>{s.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <p className="mt-8 text-slate-400 text-xs uppercase tracking-widest font-bold">TrustVault Protocol v1.0.4</p>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
       <Link to={contractId ? `/contract/${contractId}` : '/'} className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Contract
       </Link>

       <div className="bg-white shadow-xl shadow-slate-200/50 rounded-lg overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <BrainCircuit size={120} />
             </div>
             <div className="relative z-10 flex justify-between items-start">
                <div>
                   <div className="flex items-center space-x-2 text-blue-400 mb-2">
                      <Shield size={18} />
                      <span className="font-bold uppercase tracking-wider text-xs">Automated Level-1 Report</span>
                   </div>
                   <h1 className="text-2xl font-bold">System Generated Analysis</h1>
                   <p className="text-slate-400 text-sm mt-1">Generated on {report.generatedDate} • ID: #DSP-{report.contractId?.substring(report.contractId.length - 4) || '8922'}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-400 uppercase">System Confidence</p>
                   <p className={`text-xl font-bold ${report.confidenceLevel === 'High' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {report.confidenceLevel}
                   </p>
                </div>
             </div>
          </div>

          <div className="p-8">
             {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                   <p className="text-xs text-slate-500 uppercase">Compliance Score</p>
                   <div className="mt-4 relative inline-flex items-center justify-center">
                      <svg className="h-24 w-24">
                         <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="38" cx="48" cy="48"/>
                         <circle className={report.complianceScore > 70 ? "text-emerald-500" : report.complianceScore > 40 ? "text-amber-500" : "text-red-500"} strokeWidth="8" strokeDasharray={38 * 2 * Math.PI} strokeDashoffset={38 * 2 * Math.PI * (1 - report.complianceScore/100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="38" cx="48" cy="48"/>
                      </svg>
                      <span className="absolute text-2xl font-bold text-slate-900">{report.complianceScore}%</span>
                   </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 col-span-2 flex flex-col justify-center">
                   <p className="text-xs text-slate-500 uppercase mb-2">System Recommendation</p>
                   <h3 className="text-2xl font-bold text-slate-900 mb-2">{report.recommendation}</h3>
                   <p className="text-sm text-slate-600 leading-relaxed">
                      The automated analysis compared submitted deliverables against the strict acceptance criteria defined in the milestone. 
                      {report.complianceScore < 100 ? " Discrepancies were detected in the provided evidence." : " All checks passed."}
                   </p>
                </div>
             </div>

             {/* Detailed Analysis */}
             <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Evidence vs. Criteria Analysis</h3>
                <div className="space-y-4">
                   {report.evidenceAnalysis.map((item, idx) => (
                      <div key={idx} className="flex items-start p-4 rounded-lg bg-white border border-slate-200 hover:shadow-md transition-shadow">
                         <div className="flex-shrink-0 mt-0.5">
                            {item.status === 'pass' && <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Check size={14}/></div>}
                            {item.status === 'fail' && <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600"><X size={14}/></div>}
                            {item.status === 'warning' && <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><AlertTriangle size={14}/></div>}
                         </div>
                         <div className="ml-4 flex-1">
                            <h4 className="text-sm font-bold text-slate-900">{item.item}</h4>
                            <p className="text-sm text-slate-600 mt-1">{item.reason}</p>
                         </div>
                         <span className={`text-xs font-semibold px-2 py-1 rounded uppercase ${
                            item.status === 'pass' ? 'bg-emerald-50 text-emerald-700' : 
                            item.status === 'fail' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                         }`}>
                            {item.status}
                         </span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                <p className="text-xs text-slate-400 italic">This report is generated automatically based on binding evidence.</p>
                <div className="space-x-4">
                    <button 
                        onClick={() => alert("Downloading PDF report...")}
                        className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium"
                    >
                    Download PDF
                    </button>
                    <button 
                        onClick={() => alert("Ticket escalated to TrustVault Support.")}
                        className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm font-medium"
                    >
                    Escalate to Human Mediator
                    </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
