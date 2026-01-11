import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Contract, UserRole } from '../types';
import { Calendar, FileText, Shield, CheckCircle, Download, Upload, AlertOctagon, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { downloadContract } from '../utils/contractGenerator';
import { useToast } from '../components/Toast';

interface ContractDetailsProps {
  userRole: UserRole;
  contracts: Contract[];
  onDisputeMilestone: (contractId: string, milestoneId: string, data: any) => void;
  onUpdateContract: (id: string, status: Contract['status']) => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({ 
    userRole, 
    contracts, 
    onUpdateContract,
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
        addToast("Funds deposited to escrow successfully.", "success");
        setProcessingAction(null);
        // In a real app, this would update milestone status. For demo, we might just toast.
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

                    {/* Actions based on Contract Status */}
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
                                                <li key={d.id} className="text-sm text-slate-700 flex items-start">
                                                    <FileText size={14} className="mt-0.5 mr-2 text-slate-400 flex-shrink-0"/>
                                                    {d.description}
                                                    {d.type === 'file' && <span className="ml-2 text-[10px] bg-slate-200 px-1 rounded">FILE</span>}
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

                                    {!isClient && (milestone.status === 'funded' || milestone.status === 'in_progress') && (
                                        <button 
                                            onClick={() => navigate('/submission')}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
                                        >
                                            <Upload size={16} className="mr-2"/> Submit Work
                                        </button>
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