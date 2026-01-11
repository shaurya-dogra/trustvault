
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UploadCloud, Link as LinkIcon, FileCheck, CheckCircle2 } from 'lucide-react';
import { MOCK_CONTRACTS } from '../mockData';
import { useToast } from '../components/Toast';

interface MilestoneSubmissionProps {
    walletAddress: string | null;
    onConnectWallet: () => void;
}

export const MilestoneSubmission: React.FC<MilestoneSubmissionProps> = ({ walletAddress, onConnectWallet }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  // Mock selecting the first pending milestone
  const contract = MOCK_CONTRACTS[0];
  const milestone = contract.milestones[2]; // Using M3 for demo

  const [evidence, setEvidence] = useState<{ [key: string]: string }>({});

  const handleEvidenceChange = (id: string, value: string) => {
    setEvidence({ ...evidence, [id]: value });
  };

  const handleSubmit = () => {
    if (!walletAddress) {
        addToast("Wallet connection required to sign evidence submission.", "warning");
        onConnectWallet();
        return;
    }
    navigate('/freelancer-dashboard');
  };

  const submittedCount = Object.keys(evidence).filter(k => evidence[k].length > 0).length;
  const totalDeliverables = milestone.deliverables.length;
  const isComplete = submittedCount === totalDeliverables;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-slate-200">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg leading-6 font-medium text-slate-900">
            Submit Milestone: {milestone.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Contract: {contract.title}
          </p>
        </div>
        
        <div className="p-6 space-y-8">
           <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
               <FileCheck className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
               <div>
                   <h4 className="text-sm font-bold text-blue-900">Evidence Binding Required</h4>
                   <p className="text-sm text-blue-700">
                       You must provide specific evidence (File or URL) for each deliverable listed below. This allows the automated system to verify your work against the acceptance criteria.
                   </p>
               </div>
           </div>

           {/* Evidence Mapping */}
           <div>
              <div className="flex justify-between items-end mb-4">
                  <h4 className="font-medium text-slate-900">Deliverables Checklist</h4>
                  <span className={`text-sm font-medium ${isComplete ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {submittedCount} / {totalDeliverables} Submitted
                  </span>
              </div>
              
              <div className="space-y-6">
                 {milestone.deliverables.map((item) => (
                     <div key={item.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm transition-all hover:border-blue-300">
                        <div className="flex justify-between mb-3">
                           <label className="text-sm font-medium text-slate-900">{item.description}</label>
                           {evidence[item.id] ? (
                               <span className="flex items-center text-xs text-emerald-600 font-medium"><CheckCircle2 size={12} className="mr-1"/> Attached</span>
                           ) : (
                               <span className="text-xs text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded">Required</span>
                           )}
                        </div>
                        
                        {item.type === 'link' || item.type === 'any' ? (
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon className="h-4 w-4 text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-2 border bg-white text-slate-900" 
                                    placeholder="https://..." 
                                    value={evidence[item.id] || ''}
                                    onChange={(e) => handleEvidenceChange(item.id, e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md bg-slate-50 hover:bg-white transition-colors cursor-pointer">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
                                    <p className="text-xs text-slate-500">Drag file here or click to upload</p>
                                    <input type="file" className="hidden" onChange={() => handleEvidenceChange(item.id, "uploaded_file.zip")} /> 
                                </div>
                            </div>
                        )}
                     </div>
                 ))}
              </div>
           </div>

           <div className="flex items-center p-4 bg-slate-50 text-slate-600 rounded-md text-sm border border-slate-200">
              <p>
                 By submitting, you confirm that all attached evidence matches the acceptance criteria defined in the contract.
              </p>
           </div>
        </div>

        <div className="px-4 py-3 bg-slate-50 text-right sm:px-6">
            <button 
                disabled={!isComplete}
                onClick={handleSubmit} 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Submit for Client Review
            </button>
        </div>
      </div>
    </div>
  );
};
