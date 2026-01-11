
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Contract } from '../types';
import { Plus, Wallet, FileText, AlertCircle, ChevronRight, Clock, LayoutDashboard, Inbox, ExternalLink, X, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { downloadContract } from '../utils/contractGenerator';

interface ClientDashboardProps {
  contracts: Contract[];
  userName?: string;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ contracts, userName = 'Rajesh' }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeView = searchParams.get('view') === 'inbox' ? 'inbox' : 'overview';
  
  const [showLedgerModal, setShowLedgerModal] = useState(false);

  // Filter Active vs Pending for dashboard views
  // Active = Everything NOT pending, invited, rejected, draft
  const activeContracts = contracts.filter(c => !['invited', 'pending', 'rejected', 'draft'].includes(c.status));
  // Pending = What's in the inbox
  const pendingProposals = contracts.filter(c => c.status === 'pending'); // Proposals from Freelancers

  // Calculate stats based on active contracts
  const totalLocked = activeContracts.reduce((sum, c) => sum + c.escrowBalance, 0);
  const activeCount = activeContracts.length;
  const pendingApprovals = activeContracts.filter(c => c.milestones.some(m => m.status === 'submitted')).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h2 className="text-xl font-bold text-slate-900">
                  {activeView === 'overview' ? `Welcome back, ${userName.split(' ')[0]}` : 'Proposals & Alerts'}
              </h2>
              {activeView === 'overview' && (
                <p className="text-sm text-slate-500">Here's what's happening with your active contracts.</p>
              )}
          </div>

          <div className="flex items-center">
              <Link
                  to="/create-contract"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
              >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Draft New Contract
              </Link>
          </div>
      </div>

      {activeView === 'overview' && (
          <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                            <Wallet className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                            <dt className="text-sm font-medium text-slate-500 truncate">Total Funds Locked</dt>
                            <dd>
                                <div className="text-2xl font-bold text-slate-900">₹{totalLocked.toLocaleString('en-IN')}</div>
                            </dd>
                            </dl>
                        </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
                        <div className="text-sm">
                        <button onClick={() => setShowLedgerModal(true)} className="font-medium text-blue-700 hover:text-blue-900 flex items-center w-full group">
                            View Escrow Ledger <ChevronRight size={14} className="ml-auto group-hover:translate-x-1 transition-transform"/>
                        </button>
                        </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 p-3 bg-slate-50 rounded-lg">
                            <FileText className="h-6 w-6 text-slate-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                            <dt className="text-sm font-medium text-slate-500 truncate">Active Contracts</dt>
                            <dd>
                                <div className="text-2xl font-bold text-slate-900">{activeCount}</div>
                            </dd>
                            </dl>
                        </div>
                        </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                        <div className={`flex-shrink-0 p-3 rounded-lg ${pendingApprovals > 0 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                            <AlertCircle className={`h-6 w-6 ${pendingApprovals > 0 ? 'text-amber-600' : 'text-emerald-600'}`} />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                            <dt className="text-sm font-medium text-slate-500 truncate">Action Required</dt>
                            <dd>
                                <div className="text-2xl font-bold text-slate-900">
                                {pendingApprovals > 0 ? `${pendingApprovals} Approvals` : 'All Caught Up'}
                                </div>
                            </dd>
                            </dl>
                        </div>
                        </div>
                    </div>
                  </div>
              </div>

              {/* Contracts Cards */}
              <div>
                <h3 className="text-lg leading-6 font-bold text-slate-900 mb-4">Active & Ongoing Contracts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeContracts.length === 0 ? (
                        <div className="col-span-2 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                            No active contracts found. Check your Inbox or Draft a new one.
                        </div>
                    ) : activeContracts.map((contract) => (
                    <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative overflow-hidden">
                        {contract.status === 'active' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                        {contract.status === 'disputed' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                        {contract.status === 'completed' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>}
                        
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
                                <p className="text-sm text-slate-500 mt-1">Freelancer: <span className="font-medium text-slate-900">{contract.freelancerName}</span></p>
                            </div>
                            <StatusBadge status={contract.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 pl-2">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Value</p>
                                <p className="text-lg font-bold text-slate-900">₹{contract.totalValue.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Milestones</p>
                                <p className="text-lg font-bold text-slate-900">{contract.milestones.length}</p>
                            </div>
                            </div>

                            <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-4 pl-2">
                            <div className="flex items-center text-slate-500">
                                <Clock size={16} className="mr-1.5" />
                                <span>{contract.createdAt === 'Today' ? 'Created Today' : `Created: ${contract.createdAt}`}</span>
                            </div>
                            <div className="flex items-center text-blue-600 font-medium group-hover:underline">
                                View Details <ChevronRight size={16} className="ml-1"/>
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
           <div className="max-w-4xl mx-auto">
              {pendingProposals.length === 0 ? (
                  <div className="text-center py-24 bg-white rounded-xl border border-slate-200 border-dashed">
                    <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Inbox className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No New Proposals</h3>
                    <p className="mt-2 text-slate-500 max-w-sm mx-auto">You have no pending proposals from freelancers at this time. Why not create a new contract?</p>
                    <Link 
                        to="/client-dashboard"
                        className="mt-6 inline-block text-blue-600 font-bold hover:underline"
                    >
                        Return to Dashboard
                    </Link>
                 </div>
              ) : (
                 <div className="space-y-6">
                     {pendingProposals.map(contract => (
                        <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                                            Action Required
                                        </span>
                                        <h4 className="text-xl font-bold text-slate-900">{contract.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1">Proposed by: <span className="font-semibold text-slate-900">{contract.freelancerName}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Total Value</p>
                                        <p className="text-2xl font-bold text-slate-900">₹{contract.totalValue.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                        <span>Milestones ({contract.milestones.length})</span>
                                        <span>Submitted: {contract.createdAt}</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {contract.milestones.map((m, i) => (
                                            <li key={i} className="flex justify-between text-sm text-slate-700 pb-2 border-b border-slate-200 last:border-0 last:pb-0">
                                                <span>{i+1}. {m.title}</span>
                                                <span className="font-medium">₹{m.amount.toLocaleString('en-IN')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button 
                                        onClick={() => downloadContract(contract)}
                                        className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
                                    >
                                        <FileText size={16} className="mr-2"/> Review PDF
                                    </button>
                                    <Link 
                                        to={`/contract/${contract.id}`}
                                        className="flex-[2] flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-sm text-sm font-bold"
                                    >
                                        Review to Fund or Modify
                                    </Link>
                                </div>
                            </div>
                        </div>
                     ))}
                 </div>
              )}
           </div>
      )}

      {/* Escrow Ledger Modal */}
      {showLedgerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setShowLedgerModal(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-slate-200">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white p-1.5 rounded-md border border-slate-200">
                                <Wallet size={16} className="text-blue-600"/>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">TrustVault Escrow Ledger</h3>
                        </div>
                        <button onClick={() => setShowLedgerModal(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Total Assets under Management</p>
                                    <p className="text-2xl font-mono font-bold text-slate-900">12.54 ETH <span className="text-sm font-sans text-slate-500 font-normal">(₹38.2L)</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Contract Address</p>
                                    <p className="text-xs font-mono bg-white px-2 py-1 rounded border border-blue-200 text-blue-700">0x71C...9A21</p>
                                </div>
                            </div>
                        </div>
                        
                        <h4 className="text-sm font-bold text-slate-900 mb-3">Recent On-Chain Transactions</h4>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Tx Hash</th>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Method</th>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Age</th>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">To</th>
                                        <th className="px-4 py-2 text-right text-xs font-bold text-slate-500 uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {[
                                        { hash: "0x3a1...b92", method: "Deposit (Lock)", age: "2 mins ago", to: "TrustVault: Escrow", val: "0.5 ETH" },
                                        { hash: "0x8f2...c10", method: "ReleaseMilestone", age: "1 hr ago", to: "Ankit Verma", val: "0.2 ETH" },
                                        { hash: "0x1d4...e55", method: "Deposit (Lock)", age: "3 hrs ago", to: "TrustVault: Escrow", val: "1.2 ETH" },
                                        { hash: "0x9c8...a11", method: "CreateContract", age: "5 hrs ago", to: "TrustVault: Registry", val: "0 ETH" },
                                    ].map((tx, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-blue-600 cursor-pointer hover:underline">{tx.hash}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-700 font-medium px-2"><span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{tx.method}</span></td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{tx.age}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-900">{tx.to}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-right text-slate-900">{tx.val}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-center">
                            <a href="#" className="text-xs text-slate-500 hover:text-blue-600 flex items-center justify-center">
                                View all transactions on Etherscan <ExternalLink size={10} className="ml-1"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
