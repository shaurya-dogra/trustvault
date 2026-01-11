
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2, Check, AlertTriangle, Info, XCircle, ShieldCheck, Loader2, ArrowRight, Gauge, FileText, Download, RotateCcw, ListPlus } from 'lucide-react';
import { Milestone, DeliverableItem, Contract, UserAccount } from '../types';
import { useToast } from '../components/Toast';
import { downloadContract } from '../utils/contractGenerator';

interface CreateContractProps {
  onAddContract: (contract: Contract) => void;
  onUpdateContract?: (contract: Contract) => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
  currentUser?: UserAccount | null;
}

export const CreateContract: React.FC<CreateContractProps> = ({ onAddContract, onUpdateContract, walletAddress, onConnectWallet, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const isClient = currentUser?.role === 'client';
  
  // Check if we are editing an existing contract
  const editingContract = location.state?.existingContract as Contract | undefined;
  const isEditMode = !!editingContract;

  const [step, setStep] = useState(1);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [finalizeProgress, setFinalizeProgress] = useState(0);
  const [finalizeMessage, setFinalizeMessage] = useState('');
  
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    counterpartyEmail: '',
  });

  const [milestones, setMilestones] = useState<Partial<Milestone>[]>([
    {
      id: 'm1',
      title: '',
      amount: 0,
      description: '',
      deliverables: [],
      acceptanceCriteria: [],
      outOfScope: [],
      status: 'funded', 
      version: 1,
      deadline: ''
    }
  ]);

  const [tempInput, setTempInput] = useState<{ [key: string]: string }>({});
  const [tempDelType, setTempDelType] = useState<{ [key: string]: 'file' | 'link' | 'any' }>({});

  // Populate form if editing
  useEffect(() => {
    if (editingContract) {
      const otherPartyEmail = isClient 
        ? (editingContract.freelancerName.includes('Ankit') ? 'ankit@example.com' : 'freelancer@example.com')
        : (editingContract.clientName.includes('Rajesh') ? 'rajesh@example.com' : 'client@example.com');

      setFormData({
        title: editingContract.title,
        counterpartyEmail: otherPartyEmail
      });

      setMilestones(editingContract.milestones.map(m => ({
          ...m,
          version: m.version + 1
      })));
      
      addToast("Contract loaded for modification.", "info");
    }
  }, [editingContract, isClient, addToast]);

  const getMilestoneQuality = (m: Partial<Milestone>) => {
    let score = 0;
    if (m.title && m.title.length > 3) score += 10;
    if (m.description && m.description.length > 10) score += 20;
    if (m.amount && m.amount > 0) score += 10;
    if (m.deadline) score += 10;
    if (m.deliverables && m.deliverables.length > 0) score += 20;
    if (m.acceptanceCriteria && m.acceptanceCriteria.length > 0) score += 20;
    if (m.outOfScope && m.outOfScope.length > 0) score += 10;
    return Math.min(100, score);
  };

  const validateMilestones = (): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];
      milestones.forEach((m, idx) => {
          if (!m.title) errors.push(`Milestone ${idx+1}: Missing Title`);
          if (!m.amount || m.amount <= 0) errors.push(`Milestone ${idx+1}: Invalid Amount`);
          if (!m.deadline) errors.push(`Milestone ${idx+1}: Missing Deadline`);
          if (!m.deliverables || m.deliverables.length === 0) errors.push(`Milestone ${idx+1}: Needs at least one Deliverable`);
          if (!m.acceptanceCriteria || m.acceptanceCriteria.length === 0) errors.push(`Milestone ${idx+1}: Needs at least one Acceptance Criteria`);
      });
      return { valid: errors.length === 0, errors };
  };

  const handleNext = () => {
      if (step === 2) {
          const { valid, errors } = validateMilestones();
          if (!valid) {
              addToast(errors[0], 'error');
              return;
          }
      }
      setStep(step + 1);
  };
  
  const handleBack = () => setStep(step - 1);

  const addMilestone = () => {
    setMilestones([...milestones, {
      id: `m${milestones.length + 1}`,
      title: '',
      amount: 0,
      description: '',
      deliverables: [],
      deadline: '',
      acceptanceCriteria: [],
      outOfScope: [],
      status: 'funded',
      version: 1
    }]);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const addToList = (index: number, listType: 'deliverables' | 'acceptanceCriteria' | 'outOfScope', value: string) => {
    if (!value.trim()) return;
    const newMilestones = [...milestones];
    
    if (listType === 'deliverables') {
        const typeKey = `${index}-delType`;
        const type = tempDelType[typeKey] || 'any';
        const newItem: DeliverableItem = {
            id: Date.now().toString(),
            description: value,
            type: type
        };
        (newMilestones[index].deliverables as DeliverableItem[]).push(newItem);
    } else {
        (newMilestones[index][listType] as string[]).push(value);
    }
    
    setMilestones(newMilestones);
    setTempInput({ ...tempInput, [`${index}-${listType}`]: '' });
  };

  const removeFromList = (index: number, listType: 'deliverables' | 'acceptanceCriteria' | 'outOfScope', itemIndex: number) => {
      const newMilestones = [...milestones];
      if (listType === 'deliverables') {
          (newMilestones[index].deliverables as DeliverableItem[]).splice(itemIndex, 1);
      } else {
          (newMilestones[index][listType] as string[]).splice(itemIndex, 1);
      }
      setMilestones(newMilestones);
  };

  const getTempContract = (): Contract => {
      const totalValue = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
      const counterpartyEmail = formData.counterpartyEmail.toLowerCase();
      let otherName = counterpartyEmail.split('@')[0];
      if (counterpartyEmail.includes('ankit')) otherName = "Ankit Verma";
      if (counterpartyEmail.includes('rajesh')) otherName = "Rajesh Gupta";
      
      return {
          id: editingContract ? editingContract.id : `CNT-2024-DRAFT`,
          title: formData.title,
          clientName: isClient ? (currentUser?.name || "Rajesh Gupta") : otherName,
          freelancerName: isClient ? otherName : (currentUser?.name || "Ankit Verma"),
          totalValue: totalValue,
          escrowBalance: 0,
          status: 'draft',
          createdAt: editingContract ? editingContract.createdAt : new Date().toLocaleDateString('en-IN'),
          milestones: milestones as Milestone[]
      };
  };

  const handleDownloadPreview = () => {
      const contract = getTempContract();
      downloadContract(contract);
      setHasDownloaded(true);
      addToast("Contract PDF generating... Please allow pop-ups.", 'info');
  };

  const handleFinalize = async () => {
    if (!walletAddress) {
        addToast("Wallet connection required to sign the contract transaction.", "warning");
        onConnectWallet();
        return;
    }

    setIsFinalizing(true);
    
    const temp = getTempContract();
    
    // Stage 1: Initializing
    setFinalizeMessage('Creating Secure Vault...');
    setFinalizeProgress(20);
    await new Promise(r => setTimeout(r, 800));
    
    // Stage 2: Transaction
    setFinalizeMessage(isClient ? 'Drafting Invitation...' : 'Uploading Proposal...');
    setFinalizeProgress(50);
    await new Promise(r => setTimeout(r, 1200));
    
    // Stage 3: Notifying
    setFinalizeMessage('Notifying Counterparty...');
    setFinalizeProgress(85);
    await new Promise(r => setTimeout(r, 1000));
    
    // LOGIC FIX: 
    // If Client creates -> 'invited' (Not active yet, no funds locked yet).
    // If Freelancer creates -> 'pending' (Waiting for client to fund).
    const finalStatus = isClient ? 'invited' : 'pending';

    const finalContract: Contract = {
      ...temp,
      id: editingContract ? editingContract.id : `CNT-2024-${Math.floor(Math.random() * 900) + 100}`,
      escrowBalance: 0, // Funds are not locked in draft/invite stage. Only upon 'active'.
      status: finalStatus,
    };

    if (isEditMode && onUpdateContract) {
        onUpdateContract(finalContract);
    } else {
        onAddContract(finalContract);
    }

    setFinalizeProgress(100);
    setFinalizeMessage(isEditMode ? 'Proposal Revised!' : 'Proposal Sent!');
    await new Promise(r => setTimeout(r, 500));
    
    setIsFinalizing(false);
    setShowSuccess(true);
  };

  const totalAmount = milestones.reduce((acc, m) => acc + (Number(m.amount) || 0), 0);

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-center">
          <div className="bg-emerald-500 py-12 flex justify-center">
            <div className="bg-white/20 p-6 rounded-full animate-bounce">
              {isEditMode ? <RotateCcw size={80} className="text-white" /> : (isClient ? <ShieldCheck size={80} className="text-white" /> : <FileText size={80} className="text-white" />)}
            </div>
          </div>
          <div className="p-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{isEditMode ? 'Proposal Revised' : 'Proposal Submitted'}</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Your terms have been sent to the {isClient ? 'Freelancer' : 'Client'} for approval. 
              {isClient ? ' Funds will be locked once they accept or you activate it.' : ' Work can begin once the Client accepts and funds the contract.'}
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-200 inline-block w-full text-left">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Contract Value</span>
                <span className="text-2xl font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-medium">{isClient ? 'Freelancer' : 'Client'}</span>
                <span className="font-semibold text-slate-900">{formData.counterpartyEmail}</span>
              </div>
              <div className="flex items-start bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Info className="text-blue-600 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Status: <strong>{isClient ? 'Invitation Sent' : 'Pending Approval'}</strong>. Wait for the other party to Accept or Propose Changes.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate(isClient ? '/client-dashboard' : '/freelancer-dashboard')}
              className="w-full flex items-center justify-center py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
            >
              Go to My Dashboard
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto relative">
      {/* Loading Overlay */}
      {isFinalizing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
               <div className="relative">
                  <div className="absolute inset-0 animate-ping bg-blue-100 rounded-full"></div>
                  <div className="relative bg-white p-5 rounded-full border-4 border-blue-500">
                    <Loader2 size={48} className="text-blue-600 animate-spin" />
                  </div>
               </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{finalizeMessage}</h3>
            <p className="text-sm text-slate-500 mb-6">Communicating with the Smart Contract...</p>
            
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${finalizeProgress}%` }}
               ></div>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <nav aria-label="Progress" className="mb-8">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {['Contract Basics', 'Structure Milestones', 'Review & Finalize'].map((label, idx) => {
             const isCurrent = step === idx + 1;
             const isCompleted = step > idx + 1;
             return (
              <li key={label} className="md:flex-1">
                <div className={`group pl-4 py-2 flex flex-col border-l-4 ${isCurrent ? 'border-blue-600' : isCompleted ? 'border-emerald-500' : 'border-slate-200'} md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`}>
                  <span className={`text-xs font-bold uppercase tracking-wide ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-500' : 'text-slate-500'}`}>
                    Step {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{label}</span>
                </div>
              </li>
             )
          })}
        </ol>
      </nav>

      {/* STEP 1: Basics */}
      {step === 1 && (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-slate-200">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-slate-900">Contract Basics</h3>
                    <p className="mt-1 text-sm text-slate-500">Who is this contract for and what is it about?</p>
                </div>
                {isEditMode && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold border border-amber-200">
                        Editing Existing Proposal
                    </span>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-slate-700">Contract Title</label>
                <div className="mt-1">
                  <input type="text" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md p-2 border bg-white text-slate-900" placeholder="e.g. Android App Development - Phase 1" 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-slate-700">{isClient ? 'Freelancer Email' : 'Client Email'}</label>
                <div className="mt-1">
                  <input type="email" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md p-2 border bg-white text-slate-900" placeholder={isClient ? "ankit@example.com" : "rajesh@example.com"} 
                    value={formData.counterpartyEmail} onChange={e => setFormData({...formData, counterpartyEmail: e.target.value})}
                  />
                </div>
                <p className="mt-2 text-sm text-blue-600 flex items-center">
                    <Info size={14} className="mr-1"/> Clear milestones reduce disputes later.
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-slate-50 text-right sm:px-6">
            <button onClick={handleNext} disabled={!formData.title} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300">
              Next: Define Milestones
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Structured Milestones */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Structured Data Required:</strong> Milestones require verifiable deliverables and strict criteria to pass automated review.
                </p>
              </div>
            </div>
          </div>

          {milestones.map((milestone, index) => {
            const qualityScore = getMilestoneQuality(milestone);
            const isGood = qualityScore >= 80;
            const isPoor = qualityScore < 60;
            
            return (
            <div key={milestone.id || index} className={`bg-white shadow sm:rounded-lg border ${isPoor ? 'border-red-200' : 'border-slate-200'} p-6 relative transition-all`}>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-bold text-slate-900">Milestone {index + 1}</h4>
                    {/* Quality Indicator */}
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border ${
                        isPoor ? 'bg-red-50 text-red-700 border-red-200' : 
                        isGood ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                        <Gauge size={14} />
                        <span>Quality Score: {qualityScore}/100</span>
                    </div>
                </div>
                {index > 0 && (
                  <button onClick={() => {
                     const newM = [...milestones];
                     newM.splice(index, 1);
                     setMilestones(newM);
                  }} className="text-red-500 hover:text-red-700 text-sm flex items-center">
                    <Trash2 size={16} className="mr-1"/> Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Objective <span className="text-red-500">*</span></label>
                        <input type="text" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900" 
                            placeholder="e.g. Complete Homepage UI"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Detailed Description</label>
                        <textarea rows={2} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900"
                            value={milestone.description}
                            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Amount (₹) <span className="text-red-500">*</span></label>
                            <input type="number" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900"
                                value={milestone.amount}
                                onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Deadline <span className="text-red-500">*</span></label>
                            <input type="date" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900" 
                                value={milestone.deadline}
                                onChange={(e) => updateMilestone(index, 'deadline', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <label className="block text-sm font-medium text-slate-900 mb-2">Deliverables Checklist <span className="text-red-500">*</span></label>
                        <div className="space-y-2 mb-3">
                            {milestone.deliverables?.map((d, i) => (
                                <div key={i} className="flex items-center justify-between bg-white px-3 py-2 border border-slate-200 rounded text-sm text-slate-700">
                                    <div className="flex items-center">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mr-2 uppercase ${d.type === 'file' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{d.type}</span>
                                        <span>{d.description}</span>
                                    </div>
                                    <button onClick={() => removeFromList(index, 'deliverables', i)} className="text-slate-400 hover:text-red-500"><XCircle size={16}/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                             <select 
                                className="text-sm border border-slate-300 rounded-md px-2 bg-white text-slate-900"
                                value={tempDelType[`${index}-delType`] || 'any'}
                                onChange={(e) => setTempDelType({...tempDelType, [`${index}-delType`]: e.target.value as any})}
                             >
                                <option value="file">File</option>
                                <option value="link">Link</option>
                                <option value="any">Any</option>
                             </select>
                            <input type="text" className="flex-1 min-w-0 border-slate-300 rounded-md text-sm border p-2 bg-white text-slate-900" 
                                placeholder="Add deliverable..."
                                value={tempInput[`${index}-deliverables`] || ''}
                                onChange={(e) => setTempInput({...tempInput, [`${index}-deliverables`]: e.target.value})}
                                onKeyDown={(e) => e.key === 'Enter' && addToList(index, 'deliverables', tempInput[`${index}-deliverables`])}
                            />
                            <button onClick={() => addToList(index, 'deliverables', tempInput[`${index}-deliverables`])} className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 text-sm flex items-center"><ListPlus size={14}/></button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">Acceptance Criteria (Measurable) <span className="text-red-500">*</span></label>
                        <div className="space-y-2 mb-3">
                             {milestone.acceptanceCriteria?.map((ac, i) => (
                                <div key={i} className="flex items-center justify-between bg-white px-3 py-2 border border-slate-200 rounded text-sm text-slate-700">
                                    <span>{ac}</span>
                                    <button onClick={() => removeFromList(index, 'acceptanceCriteria', i)} className="text-slate-400 hover:text-red-500"><XCircle size={16}/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                             <input type="text" className="flex-1 min-w-0 border-slate-300 rounded-md text-sm border p-2 bg-white text-slate-900" 
                                placeholder="e.g. Latency < 200ms"
                                value={tempInput[`${index}-acceptanceCriteria`] || ''}
                                onChange={(e) => setTempInput({...tempInput, [`${index}-acceptanceCriteria`]: e.target.value})}
                                onKeyDown={(e) => e.key === 'Enter' && addToList(index, 'acceptanceCriteria', tempInput[`${index}-acceptanceCriteria`])}
                            />
                            <button onClick={() => addToList(index, 'acceptanceCriteria', tempInput[`${index}-acceptanceCriteria`])} className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 text-sm flex items-center"><ListPlus size={14}/></button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            )})}

          <button onClick={addMilestone} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center font-medium">
            <Plus size={20} className="mr-2"/> Add Another Milestone
          </button>
          
          <div className="flex justify-between pt-4">
             <button onClick={handleBack} className="inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                Back
             </button>
             
             <button 
                onClick={handleNext} 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all"
             >
                Next: Preview Summary
             </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Finalize */}
      {step === 3 && (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-slate-200">
          <div className="px-4 py-5 sm:p-6">
             <h3 className="text-lg leading-6 font-medium text-slate-900 mb-6">Review & Dispute Readiness</h3>
             
             <div className="bg-slate-50 p-4 rounded-md mb-6">
                <div className="flex justify-between mb-2">
                   <span className="text-slate-500">Contract Title</span>
                   <span className="font-medium text-slate-900">{formData.title}</span>
                </div>
                <div className="flex justify-between mb-2">
                   <span className="text-slate-500">{isClient ? 'Freelancer' : 'Client'}</span>
                   <span className="font-medium text-slate-900">{formData.counterpartyEmail}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500">Total Contract Value</span>
                   <span className="font-bold text-slate-900 text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                {isEditMode && (
                   <div className="mt-3 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded border border-amber-200 text-center">
                       <strong>Note:</strong> Modifying this contract will require the other party to approve the changes again.
                   </div>
                )}
             </div>

             {/* Contract Download Section */}
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6 flex items-center justify-between">
                 <div>
                     <h4 className="text-sm font-bold text-blue-900 mb-1">Legal Agreement</h4>
                     <p className="text-xs text-blue-700">Review the generated smart contract terms before signing.</p>
                 </div>
                 <button 
                    onClick={handleDownloadPreview}
                    className="flex items-center px-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
                 >
                     <Download size={16} className="mr-2"/> Download Agreement
                 </button>
             </div>

             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center">
                    <AlertTriangle size={16} className="mr-2"/>
                    Final Confirmation
                </h4>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                    <input 
                        id="confirm" 
                        type="checkbox" 
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded" 
                    />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="confirm" className="font-medium text-slate-900">
                        {isEditMode 
                            ? "I confirm these are the revised terms I wish to propose. Submitting this will reset the approval status."
                            : "I have reviewed the contract PDF. I understand that finalizing this contract will invoke the TrustVault protocol and funds will be managed via the Smart Contract."
                        }
                    </label>
                    </div>
                </div>
             </div>

          </div>
          <div className="px-4 py-3 bg-slate-50 text-right sm:px-6 flex justify-between">
             <button onClick={handleBack} className="inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                Back
             </button>
             
             <div className="relative group">
                <button 
                    disabled={!agreedToTerms || !hasDownloaded}
                    onClick={handleFinalize} 
                    className={`inline-flex justify-center py-3 px-8 border border-transparent shadow-lg text-base font-bold rounded-xl text-white transition-all transform active:scale-95 ${
                        isEditMode ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    } disabled:bg-slate-300 disabled:cursor-not-allowed`}
                >
                    {isEditMode ? <><RotateCcw className="mr-2 h-5 w-5"/> Submit Revised Proposal</> : (isClient ? <><FileText className="mr-2 h-5 w-5"/> Send Invitation</> : <><FileText className="mr-2 h-5 w-5"/> Submit Proposal</>)}
                </button>
                {(!agreedToTerms || !hasDownloaded) && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 text-xs bg-slate-800 text-white p-2 rounded shadow-lg text-center left-1/2 -translate-x-1/2">
                        You must download the agreement and check the confirmation box.
                    </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
