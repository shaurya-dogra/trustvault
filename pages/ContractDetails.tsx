
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Contract, UserRole } from '../types';
import { Calendar, FileText, Shield, CheckCircle, Download, Upload, AlertOctagon, Loader2, ChevronDown, ChevronUp, ExternalLink, XCircle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { downloadContract } from '../utils/contractGenerator';
import { useToast } from '../components/Toast';

interface ContractDetailsProps {
  userRole: UserRole;
  contracts: Contract[];
  onDisputeMilestone: (contractId: string, milestoneId: string, data: any) => void;
  onUpdateContract: (id: string, status: Contract['status']) => void;
  onApproveMilestone?: (contractId: string, milestoneId: string) => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({ 
    userRole, 
    contracts, 
    onUpdateContract,
    onApproveMilestone,
    walletAddress,
    onConnectWallet
}) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
    const [processingAction, setProcessingAction] = useState<string | null>(null);

    const contract = contracts.find(c => c.id === id);

    if (!contract) {
        return <div className="p-8 text-center text-slate-500">Contract not found</div>;
    }

    const isClient = userRole === 'client';

    const toggleMilestone = (mId: string) => {
        setExpandedMilestone(expandedMilestone === mId ? null : mId);
    };

    const handleDownload = () => {
        downloadContract(contract);
    };

    const handleRejectContract = () => {
        if (window.confirm("Reject this contract?")) {
            onUpdateContract(contract.id, 'rejected');
            navigate(-1);
        }
    };

    const handleModifyProposal = () => {
        navigate('/create-contract', { state: { existingContract: contract } });
    };

    const handleAcceptContract = async () => {
        if (!walletAddress) {
            addToast("Wallet connection required to sign.", "warning");
            onConnectWallet();
            return;
        }
        setProcessingAction('accept');
        await new Promise(r => setTimeout(r, 1500));
        onUpdateContract(contract.id, 'active');
        setProcessingAction(null);
        addToast("Contract accepted and active!", "success");
    };

    const handleFundMilestone = async (mId: string) => {
        if (!walletAddress) {
            addToast("Wallet required to deposit funds.", "warning");
            onConnectWallet();
            return;
        }
        setProcessingAction(`fund-${mId}`);
        await new Promise(r => setTimeout(r, 2000));
        
        // This is a simulation. In a real app, this would be a blockchain call
        // then we'd update state. For this prototype, we'll just simulate update via db in App.tsx 
        // For now, we update via local update logic if we had a specific handler for this.
        // Since we only have onUpdateContract for the whole contract, we'll assume funded state changes 
        // are handled via the contract status flow or we'd need a specific milestone updater.
        // For the demo flow, we'll just show success. 
        addToast("Funds deposited to escrow successfully.", "success");
        setProcessingAction(null);
    };

    const handleApproveWork = async (mId: string) => {
        if (!walletAddress) {
            addToast("Wallet required to release funds.", "warning");
            onConnectWallet();
            return;
        }
        if (!onApproveMilestone) return;

        setProcessingAction(`approve-${mId}`);
        await new Promise(r => setTimeout(r, 1500));
        onApproveMilestone(contract.id, mId);
        setProcessingAction(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-slate-400">#{contract.id}</span>
                        <StatusBadge status={contract.status} />
                    </div>
                    <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        <Download size={16} className="mr-1" /> Download PDF
                    </button>
                </div>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{contract.title}</h1>
                    <div className="flex flex-col sm:flex-row gap-6 text-sm text-slate-600 mb-6">
                        <div className="flex items-center">
                            <Shield size={16} className="mr-2 text-slate-400" />
                            {isClient ? `Freelancer: ${contract.freelancerName}` : `Client: ${contract.clientName}`}
                        </div>
                        <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-slate-400" />
                            Created: {contract.createdAt}
                        </div>
                        <div className="flex items-center font-bold text-slate-900">
                            Total Value: ₹{contract.totalValue.toLocaleString('en-IN')}
                        </div>
                    </div>

                    {/* Actions based on Contract Status: INVITATION (Client -> Freelancer) */}
                    {contract.status === 'invited' && !isClient && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-blue-900">Action Required</h4>
                                <p className="text-sm text-blue-700">You have been invited to this contract. Review terms and accept.</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleModifyProposal} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">Propose Changes</button>
                                <button onClick={handleRejectContract} className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-bold hover:bg-red-50">Reject</button>
                                <button onClick={handleAcceptContract} disabled={!!processingAction} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center">
                                    {processingAction === 'accept' ? <Loader2 size={16} className="animate-spin mr-2"/> : null}
                                    Accept & Sign
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Actions based on Contract Status: PENDING PROPOSAL (Freelancer -> Client) */}
                    {contract.status === 'pending' && isClient && (
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-purple-900">Proposal Received</h4>
                                <p className="text-sm text-purple-700">Freelancer has proposed this contract. Accept to lock funds and begin.</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleModifyProposal} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">Propose Changes</button>
                                <button onClick={handleRejectContract} className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-bold hover:bg-red-50">Reject</button>
                                <button onClick={handleAcceptContract} disabled={!!processingAction} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center">
                                    {processingAction === 'accept' ? <Loader2 size={16} className="animate-spin mr-2"/> : null}
                                    Approve & Fund
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 px-1">Project Milestones</h3>
                
                {contract.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div 
                            className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => toggleMilestone(milestone.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    milestone.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                                    milestone.status === 'active' || milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                                    milestone.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                                    'bg-slate-100 text-slate-500'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{milestone.title}</h4>
                                    <p className="text-sm text-slate-500">
                                        ₹{milestone.amount.toLocaleString('en-IN')} • Due {milestone.deadline}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={milestone.status} />
                                {expandedMilestone === milestone.id ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
                            </div>
                        </div>

                        {expandedMilestone === milestone.id && (
                            <div className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50/50">
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Deliverables</h5>
                                        <ul className="space-y-2">
                                            {milestone.deliverables.map(d => (
                                                <li key={d.id} className="text-sm text-slate-700">
                                                    <div className="flex items-start">
                                                        <FileText size={14} className="mt-0.5 mr-2 text-slate-400 flex-shrink-0"/>
                                                        <span>{d.description}</span>
                                                        {d.type === 'file' && <span className="ml-2 text-[10px] bg-slate-200 px-1 rounded">FILE</span>}
                                                    </div>
                                                    {/* Display Evidence if Submitted */}
                                                    {d.evidence && (
                                                        <div className="ml-6 mt-1 flex items-center text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded w-fit">
                                                            <CheckCircle size={10} className="mr-1"/> 
                                                            Submitted: 
                                                            <a href="#" className="ml-1 underline font-medium truncate max-w-[150px]">{d.evidence}</a>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Acceptance Criteria</h5>
                                        <ul className="space-y-2">
                                            {milestone.acceptanceCriteria.map((ac, i) => (
                                                <li key={i} className="text-sm text-slate-700 flex items-start">
                                                    <CheckCircle size={14} className="mt-0.5 mr-2 text-slate-400 flex-shrink-0"/>
                                                    {ac}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Milestone Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
                                    {isClient && milestone.status === 'pending' && contract.status === 'active' && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleFundMilestone(milestone.id); }}
                                            disabled={!!processingAction}
                                            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700"
                                        >
                                            {processingAction === `fund-${milestone.id}` ? <Loader2 size={16} className="animate-spin mr-2"/> : <Shield size={16} className="mr-2"/>}
                                            Fund Escrow
                                        </button>
                                    )}
                                    
                                    {/* Client Review Actions */}
                                    {isClient && milestone.status === 'submitted' && (
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm text-slate-500 italic mr-2">Work submitted for review</div>
                                            <Link to={`/dispute/${contract.id}/${milestone.id}`} className="flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                                                <AlertOctagon size={16} className="mr-2"/> Dispute
                                            </Link>
                                            <button 
                                                onClick={() => handleApproveWork(milestone.id)}
                                                disabled={!!processingAction}
                                                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm"
                                            >
                                                {processingAction === `approve-${milestone.id}` ? <Loader2 size={16} className="animate-spin mr-2"/> : <CheckCircle size={16} className="mr-2"/>}
                                                Approve & Release Funds
                                            </button>
                                        </div>
                                    )}

                                    {!isClient && (milestone.status === 'funded' || milestone.status === 'in_progress' || milestone.status === 'active') && (
                                        <button 
                                            onClick={() => navigate(`/submission/${contract.id}/${milestone.id}`)}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
                                        >
                                            <Upload size={16} className="mr-2"/> Submit Work
                                        </button>
                                    )}
                                    
                                    {!isClient && milestone.status === 'submitted' && (
                                         <span className="flex items-center text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-sm font-medium">
                                             <Loader2 size={16} className="mr-2 animate-spin"/> Waiting for Client Review
                                         </span>
                                    )}

                                    {milestone.status === 'disputed' && (
                                        <Link to={`/dispute/${contract.id}/${milestone.id}`} className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100">
                                            <AlertOctagon size={16} className="mr-2"/> View Dispute Report
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
