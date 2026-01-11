
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { UploadCloud, Link as LinkIcon, FileCheck, CheckCircle2, ArrowLeft, X, File as FileIcon, Loader2, AlertCircle } from 'lucide-react';
import { Contract, DeliverableItem } from '../types';
import { useToast } from '../components/Toast';

interface MilestoneSubmissionProps {
    walletAddress: string | null;
    onConnectWallet: () => void;
    contracts?: Contract[];
    onSubmitWork?: (contractId: string, milestoneId: string, evidence: Record<string, string>) => void;
}

export const MilestoneSubmission: React.FC<MilestoneSubmissionProps> = ({ walletAddress, onConnectWallet, contracts = [], onSubmitWork }) => {
  const navigate = useNavigate();
  const { contractId, milestoneId } = useParams();
  const { addToast } = useToast();
  
  const contract = contracts.find(c => c.id === contractId);
  const milestone = contract?.milestones.find(m => m.id === milestoneId);

  // State to hold evidence values (URLs or Filenames)
  const [evidence, setEvidence] = useState<{ [key: string]: string }>({});
  
  // State for file upload simulation
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  
  // State for toggling 'any' type inputs (link vs file)
  const [inputTypeOverrides, setInputTypeOverrides] = useState<{ [key: string]: 'file' | 'link' }>({});

  useEffect(() => {
    if (!contract || !milestone) {
        addToast("Contract or Milestone not found.", "error");
        navigate(-1);
    }
  }, [contract, milestone, navigate, addToast]);

  if (!contract || !milestone) return null;

  const handleLinkChange = (id: string, value: string) => {
    setEvidence(prev => ({ ...prev, [id]: value }));
  };

  const handleFileSelect = async (id: string, file: File) => {
    // 1. Validation
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
        addToast("File is too large. Max size is 50MB.", "error");
        return;
    }

    // 2. Start Upload Simulation
    setUploading(prev => ({ ...prev, [id]: true }));
    setProgress(prev => ({ ...prev, [id]: 0 }));

    // Simulate network delay and progress
    const totalDuration = 1500; // 1.5 seconds
    const intervalTime = 100;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
        currentStep++;
        const newProgress = Math.min(100, Math.round((currentStep / steps) * 100));
        setProgress(prev => ({ ...prev, [id]: newProgress }));

        if (currentStep >= steps) {
            clearInterval(timer);
            
            // 3. "Upload" Complete
            // Create a fake URL for this session so the user can actually "view" their upload if they want
            // In a real app, this would be the S3/IPFS URL returned by the backend
            const objectUrl = URL.createObjectURL(file);
            
            // We store the filename as the display text, or the object URL if we want it clickable immediately
            // For this simulation, let's store the filename but hypothetically we'd send the URL
            setEvidence(prev => ({ ...prev, [id]: file.name }));
            
            setUploading(prev => ({ ...prev, [id]: false }));
            addToast(`"${file.name}" uploaded successfully.`, "success");
        }
    }, intervalTime);
  };

  const removeEvidence = (id: string) => {
      setEvidence(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
      });
      setProgress(prev => ({ ...prev, [id]: 0 }));
  };

  const handleSubmit = () => {
    if (!walletAddress) {
        addToast("Wallet connection required to sign evidence submission.", "warning");
        onConnectWallet();
        return;
    }
    
    if (onSubmitWork && contractId && milestoneId) {
        onSubmitWork(contractId, milestoneId, evidence);
        navigate('/freelancer-dashboard');
    }
  };

  const submittedCount = Object.keys(evidence).filter(k => evidence[k]?.length > 0).length;
  const totalDeliverables = milestone.deliverables.length;
  const isComplete = submittedCount === totalDeliverables;

  // Helper to determine input type for a deliverable
  const getInputType = (item: DeliverableItem) => {
      if (item.type === 'any') {
          return inputTypeOverrides[item.id] || 'link'; // Default to link for 'any'
      }
      return item.type;
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft size={18} className="mr-1"/> Back to Contract
      </button>

      <div className="bg-white shadow-xl shadow-slate-200/50 sm:rounded-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-slate-900">
                    Submit Milestone Evidence
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    {contract.title} • <span className="font-medium text-slate-700">{milestone.title}</span>
                </p>
            </div>
            <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {submittedCount}/{totalDeliverables} Completed
                </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
               <FileCheck className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
               <div>
                   <h4 className="text-sm font-bold text-blue-900">Proof of Work Required</h4>
                   <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                       This contract is secured by TrustVault. You must provide specific evidence for each deliverable. 
                       This data will be hashed on-chain and used for automated verification.
                   </p>
               </div>
           </div>

           {/* Deliverables List */}
           <div className="space-y-6">
              {milestone.deliverables.map((item) => {
                 const currentInputType = getInputType(item);
                 const hasValue = !!evidence[item.id];
                 const isUploading = uploading[item.id];
                 const uploadPercent = progress[item.id] || 0;

                 return (
                     <div key={item.id} className={`p-5 rounded-xl border transition-all duration-200 ${hasValue ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}>
                        {/* Header Label */}
                        <div className="flex justify-between mb-3">
                           <div className="flex items-center">
                               <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${hasValue ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                   {milestone.deliverables.indexOf(item) + 1}
                               </span>
                               <div>
                                   <label className="text-sm font-bold text-slate-900 block">{item.description}</label>
                                   <div className="flex items-center gap-2 mt-0.5">
                                       <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-1.5 rounded">{item.type}</span>
                                       {item.type === 'any' && !hasValue && (
                                           <div className="flex text-[10px] font-medium bg-slate-100 rounded p-0.5 border border-slate-200">
                                               <button 
                                                  onClick={() => setInputTypeOverrides(p => ({...p, [item.id]: 'link'}))}
                                                  className={`px-2 py-0.5 rounded transition-colors ${currentInputType === 'link' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                               >
                                                  Link
                                               </button>
                                               <button 
                                                  onClick={() => setInputTypeOverrides(p => ({...p, [item.id]: 'file'}))}
                                                  className={`px-2 py-0.5 rounded transition-colors ${currentInputType === 'file' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                               >
                                                  File
                                               </button>
                                           </div>
                                       )}
                                   </div>
                               </div>
                           </div>
                           
                           {hasValue ? (
                               <button onClick={() => removeEvidence(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Remove">
                                   <X size={18} />
                               </button>
                           ) : (
                               <span className="text-xs font-medium text-red-500 flex items-center bg-red-50 px-2 py-1 rounded h-fit">Required</span>
                           )}
                        </div>
                        
                        {/* Input Area */}
                        <div className="pl-9">
                            {hasValue ? (
                                // --- Completed State ---
                                <div className="flex items-center p-3 bg-white border border-emerald-200 rounded-lg shadow-sm">
                                    <div className="bg-emerald-100 p-2 rounded-full mr-3">
                                        {currentInputType === 'file' ? <FileIcon size={18} className="text-emerald-600"/> : <LinkIcon size={18} className="text-emerald-600"/>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{evidence[item.id]}</p>
                                        <p className="text-xs text-emerald-600 font-medium">Ready to submit</p>
                                    </div>
                                    <CheckCircle2 size={20} className="text-emerald-500 ml-2"/>
                                </div>
                            ) : isUploading ? (
                                // --- Uploading State ---
                                <div className="border border-blue-100 bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-blue-700 flex items-center">
                                            <Loader2 size={12} className="animate-spin mr-2"/> Uploading...
                                        </span>
                                        <span className="text-xs font-bold text-blue-700">{uploadPercent}%</span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadPercent}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                // --- Empty Input State ---
                                <>
                                    {currentInputType === 'file' ? (
                                        <FileUploader 
                                            id={item.id} 
                                            onFileSelect={(file) => handleFileSelect(item.id, file)} 
                                        />
                                    ) : (
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <LinkIcon className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input 
                                                type="url" 
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg p-2.5 border bg-white text-slate-900 placeholder:text-slate-400" 
                                                placeholder="https://github.com/project/repo..." 
                                                value={evidence[item.id] || ''}
                                                onChange={(e) => handleLinkChange(item.id, e.target.value)}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                     </div>
                 );
              })}
           </div>

           <div className="flex items-start p-4 bg-slate-50 text-slate-600 rounded-xl text-sm border border-slate-200">
              <AlertCircle size={18} className="mr-3 text-slate-400 flex-shrink-0 mt-0.5" />
              <p>
                 By submitting, you confirm that all attached evidence is accurate and matches the acceptance criteria defined in the contract. False submissions may lead to a dispute.
              </p>
           </div>
        </div>

        <div className="px-6 py-5 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button 
                disabled={!isComplete}
                onClick={handleSubmit} 
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-lg shadow-blue-200 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95"
            >
              Sign & Submit Work
            </button>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Drag & Drop File Upload
const FileUploader = ({ id, onFileSelect }: { id: string, onFileSelect: (f: File) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`
                mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all cursor-pointer group
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'}
            `}
        >
            <div className="space-y-1 text-center pointer-events-none">
                <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                    <UploadCloud size={24} />
                </div>
                <div className="flex text-sm text-slate-600 justify-center">
                    <span className="relative font-medium text-blue-600 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">
                    ZIP, PDF, PNG, JPG up to 50MB
                </p>
            </div>
            <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                onChange={handleInputChange} 
            /> 
        </div>
    );
};
