import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Contract } from '../types';
import { Wallet, FileText, CheckCircle, Clock, ChevronRight, Inbox, Edit3, X, Loader2 } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { downloadContract } from '../utils/contractGenerator';
import { useToast } from '../components/Toast';

interface FreelancerDashboardProps {
  contracts: Contract[];
  onLogout: () => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
  userName?: string;
  onUpdateContract?: (id: string, status: Contract['status']) => void;
}

export const FreelancerDashboard: React.FC<FreelancerDashboardProps> = ({ 
    contracts, 
    walletAddress, 
    onConnectWallet, 
    userName = 'Ankit',
    onUpdateContract
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const searchParams = new URLSearchParams(location.search);
    const activeView = searchParams.get('view') === 'inbox' ? 'inbox' : 'overview';

    const [acceptingContractId, setAcceptingContractId] = useState<string | null>(null);

    // Active: Work is ongoing or completed
    const activeContracts = contracts.filter(c => ['active', 'completed', 'disputed', 'funded'].includes(c.status));
    
    // Inbox: Contracts where action is needed from Freelancer (Invited by Client)
    const inboxContracts = contracts.filter(c => c.status === 'invited');

    // Sent: Proposals sent by Freelancer, waiting for Client
    const pendingProposals = contracts.filter(c => c.status === 'pending');

    const totalEarnings = contracts.reduce((sum, c) => {
        const paidMilestones = c.milestones.filter(m => m.status === 'paid');
        return sum + paidMilestones.reduce((mSum, m) => mSum + m.amount, 0);
    }, 0);

    const handleAcceptContract = async (id: string) => {
        if (!walletAddress) {
            addToast("Please connect your wallet to sign the contract.", "warning");
            onConnectWallet();
            return;
        }

        setAcceptingContractId(id);
        // Simulate blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (onUpdateContract) {
            onUpdateContract(id, 'active');
        }
        setAcceptingContractId(null);
        addToast("Contract accepted! Funds are now locked in escrow.", "success");
        navigate('/freelancer-dashboard');
    };

    const handleRejectContract = (id: string) => {
        if (window.confirm("Are you sure you want to reject this contract offer?")) {
            if (onUpdateContract) {
                onUpdateContract(id, 'rejected');
                addToast("Contract offer rejected.", "info");
            }
        }
    };

    const handleModifyProposal = (contract: Contract) => {
        navigate('/create-contract', { state: { existingContract: contract } });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        {activeView === 'overview' ? `Welcome back, ${userName.split(' ')[0]}` : 'Inbox & Proposals'}
                    </h2>
                    {activeView === 'overview' && (
                        <p className="text-sm text-slate-500">Manage your active projects and deliveries.</p>
                    )}
                </div>
                <div className="flex items-center">
                    <Link
                        to="/create-contract"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <FileText className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Send New Proposal
                    </Link>
                </div>
            </div>

            {activeView === 'overview' && (
                <div className="space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-emerald-50 rounded-lg">
                                        <Wallet className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-500 truncate">Total Earnings</dt>
                                            <dd className="text-2xl font-bold text-slate-900">₹{totalEarnings.toLocaleString('en-IN')}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                                        <Clock className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-500 truncate">Active Projects</dt>
                                            <dd className="text-2xl font-bold text-slate-900">{activeContracts.filter(c => c.status !== 'completed').length}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-purple-50 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-500 truncate">Success Rate</dt>
                                            <dd className="text-2xl font-bold text-slate-900">100%</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Contracts List */}
                    <div>
                        <h3 className="text-lg leading-6 font-bold text-slate-900 mb-4">Current Projects</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeContracts.length === 0 ? (
                                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                                    No active contracts. Check your Inbox for new offers.
                                </div>
                            ) : activeContracts.map((contract) => (
                                <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative overflow-hidden">
                                     {contract.status === 'active' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                                     {contract.status === 'disputed' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                                     
                                     <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="pl-2">
                                                <span className="text-xs font-mono text-slate-400 mb-1 block">{contract.id}</span>
                                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    <Link to={`/contract/${contract.id}`}>
                                                        {contract.title}
                                                        <span className="absolute inset-0"></span>
                                                    </Link>
                                                </h4>
                                                <p className="text-sm text-slate-500 mt-1">Client: <span className="font-medium text-slate-900">{contract.clientName}</span></p>
                                            </div>
                                            <StatusBadge status={contract.status} />
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 ml-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Total Value</span>
                                                <span className="font-bold text-slate-900">₹{contract.totalValue.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm mt-1">
                                                <span className="text-slate-500">Escrow Balance</span>
                                                <span className="font-bold text-emerald-600">₹{contract.escrowBalance.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-4 pl-2">
                                            <div className="flex items-center text-slate-500">
                                                <Clock size={16} className="mr-1.5" />
                                                <span>{contract.milestones.length} Milestones</span>
                                            </div>
                                            <div className="flex items-center text-blue-600 font-medium group-hover:underline">
                                                Manage Work <ChevronRight size={16} className="ml-1"/>
                                            </div>
                                        </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'inbox' && (
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Offers from Clients */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Inbox className="mr-2" size={20}/> New Offers ({inboxContracts.length})
                        </h3>
                        {inboxContracts.length === 0 ? (
                            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500 italic">
                                No new offers at the moment.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {inboxContracts.map(contract => (
                                    <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                                                        New Offer
                                                    </span>
                                                    <h4 className="text-xl font-bold text-slate-900">{contract.title}</h4>
                                                    <p className="text-sm text-slate-500 mt-1">Client: <span className="font-semibold text-slate-900">{contract.clientName}</span></p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400 uppercase font-semibold">Contract Value</p>
                                                    <p className="text-2xl font-bold text-slate-900">₹{contract.totalValue.toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
                                                <p className="text-sm text-slate-600 mb-2">Includes {contract.milestones.length} milestones:</p>
                                                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                                    {contract.milestones.slice(0, 3).map((m, i) => (
                                                        <li key={i}>{m.title} - <strong>₹{m.amount.toLocaleString('en-IN')}</strong></li>
                                                    ))}
                                                    {contract.milestones.length > 3 && <li className="text-slate-400 italic">...and more</li>}
                                                </ul>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button 
                                                    onClick={() => downloadContract(contract)}
                                                    className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
                                                >
                                                    <FileText size={16} className="mr-2"/> Review PDF
                                                </button>
                                                <button 
                                                    onClick={() => handleModifyProposal(contract)}
                                                    className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
                                                >
                                                    <Edit3 size={16} className="mr-2"/> Propose Changes
                                                </button>
                                                <button 
                                                    onClick={() => handleRejectContract(contract.id)}
                                                    className="flex-1 flex items-center justify-center px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium"
                                                >
                                                    <X size={16} className="mr-2"/> Reject
                                                </button>
                                                <button 
                                                    onClick={() => handleAcceptContract(contract.id)}
                                                    disabled={!!acceptingContractId}
                                                    className="flex-[2] flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-sm text-sm font-bold disabled:bg-slate-600"
                                                >
                                                    {acceptingContractId === contract.id ? (
                                                        <><Loader2 size={16} className="mr-2 animate-spin"/> Processing...</>
                                                    ) : (
                                                        'Accept & Sign'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Proposals Sent */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center text-slate-500">
                             Sent Proposals ({pendingProposals.length})
                        </h3>
                        {pendingProposals.length > 0 && (
                            <div className="space-y-4">
                                {pendingProposals.map(contract => (
                                    <div key={contract.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex justify-between items-center opacity-75">
                                        <div>
                                            <h4 className="font-bold text-slate-700">{contract.title}</h4>
                                            <p className="text-sm text-slate-500">Sent to: {contract.clientName} • ₹{contract.totalValue.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex items-center text-amber-600 text-sm font-medium bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                            <Clock size={14} className="mr-1"/> Awaiting Approval
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};