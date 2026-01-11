
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, Contract, UserAccount, AuthSession } from './types';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { FreelancerDashboard } from './pages/FreelancerDashboard';
import { CreateContract } from './pages/CreateContract';
import { ContractDetails } from './pages/ContractDetails';
import { MilestoneSubmission } from './pages/MilestoneSubmission';
import { DisputeReport } from './pages/DisputeReport';
import { ProfilePage } from './pages/ProfilePage';
import { ToastProvider, useToast } from './components/Toast';
import { db } from './services/database';

// AppContent contains the main logic and consumes the Toast Context
const AppContent: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  const { addToast } = useToast();
  
  // Initialize contracts from Database Service
  const [contracts, setContracts] = useState<Contract[]>(db.getAllContracts());

  // Check for existing session and wallet listener
  useEffect(() => {
    // Restore Session from DB
    const session = db.getSession();
    if (session) {
        setUserRole(session.role);
        setCurrentUser(session.user);
    }

    // Wallet Provider Setup (Listener only)
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          addToast("Wallet account changed.", "info");
        } else {
          setWalletAddress(null);
          addToast("Wallet disconnected.", "info");
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Check if already connected
      ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
            if (accounts && accounts.length > 0) {
                setWalletAddress(accounts[0]);
            }
        }).catch(() => {});

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [addToast]);

  const handleLogin = (account: UserAccount) => {
    setUserRole(account.role);
    setCurrentUser(account);
    db.saveSession({ user: account, role: account.role });
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setWalletAddress(null);
    db.clearSession();
    addToast("Logged out successfully.", "success");
  };

  const handleConnectWallet = async () => {
    const ethereum = (window as any).ethereum;
    
    // 1. Try Real Wallet Connection
    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          addToast("Wallet connected successfully!", "success");
          return;
        }
      } catch (error: any) {
        if (error.code === 4001) {
            addToast("Connection rejected by user.", "warning");
            return;
        }
        // If other error, fall through to simulation
        console.warn("Wallet connection failed, falling back to simulation.", error);
      }
    }

    // 2. Demo Fallback (Simulation)
    addToast("Connecting Demo Wallet...", "info");
    
    setTimeout(() => {
        const demoAddress = "0x71C...9A21";
        setWalletAddress(demoAddress);
        addToast("Demo Wallet Connected (Simulation Mode)", "success");
    }, 800);
  };

  const handleAddContract = (newContract: Contract) => {
    db.addContract(newContract);
    setContracts(db.getAllContracts()); // Refresh state from DB
  };

  // Used for status updates (Accept/Reject/Active)
  const handleUpdateContractStatus = (id: string, status: Contract['status']) => {
    const contract = contracts.find(c => c.id === id);
    if (contract) {
        const escrowBalance = status === 'active' ? contract.totalValue : contract.escrowBalance;
        const updated = { ...contract, status, escrowBalance };
        db.updateContract(updated);
        setContracts(db.getAllContracts());
    }
  };

  // Used for full edits (Modify Proposal)
  const handleEditContract = (updatedContract: Contract) => {
    db.updateContract(updatedContract);
    setContracts(db.getAllContracts());
  };

  // Handle Freelancer submitting work
  const handleSubmitWork = (contractId: string, milestoneId: string, evidenceData: Record<string, string>) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    const updatedMilestones = contract.milestones.map(m => {
        if (m.id !== milestoneId) return m;

        // Update deliverables with evidence
        const updatedDeliverables = m.deliverables.map(d => ({
            ...d,
            evidence: evidenceData[d.id] || d.evidence,
            verificationStatus: 'pending' as const // Reset verification
        }));

        return {
            ...m,
            status: 'submitted' as const, // Update status to submitted
            deliverables: updatedDeliverables
        };
    });

    const updatedContract = { ...contract, milestones: updatedMilestones } as Contract;
    db.updateContract(updatedContract);
    setContracts(db.getAllContracts());
    addToast("Work submitted successfully for Client review.", "success");
  };

  // Handle Client approving work (Release Funds)
  const handleApproveMilestone = (contractId: string, milestoneId: string) => {
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) return;

      const milestone = contract.milestones.find(m => m.id === milestoneId);
      if (!milestone) return;

      const updatedMilestones = contract.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          return { ...m, status: 'paid' as const };
      });

      // Deduct from escrow
      const newEscrowBalance = Math.max(0, contract.escrowBalance - milestone.amount);
      
      // Check if all milestones are complete
      const allComplete = updatedMilestones.every(m => m.status === 'paid' || m.status === 'completed');
      const newContractStatus = allComplete ? 'completed' as const : contract.status;

      const updatedContract = { 
          ...contract, 
          escrowBalance: newEscrowBalance,
          milestones: updatedMilestones,
          status: newContractStatus
      };

      db.updateContract(updatedContract);
      setContracts(db.getAllContracts());
      addToast(`Funds released for ${milestone.title}.`, "success");
  };

  const handleDisputeMilestone = (contractId: string, milestoneId: string, disputeData: { reason: string; comments: string; failedCriteria: string[] }) => {
      const contract = contracts.find(c => c.id === contractId);
      if (contract) {
          const updatedMilestones = contract.milestones.map(m => {
            if (m.id !== milestoneId) return m;
            return {
              ...m,
              status: 'disputed',
              disputeReason: disputeData.reason as any,
              disputeComments: disputeData.comments,
              failedCriteria: disputeData.failedCriteria,
              disputeLevel: 1, 
              disputeRaisedAt: new Date().toLocaleDateString('en-IN')
            } as any;
          });
          
          const updatedContract = { ...contract, status: 'disputed', milestones: updatedMilestones } as Contract;
          db.updateContract(updatedContract);
          setContracts(db.getAllContracts());
      }
  };

  // Filtering contracts based on current user email for robustness
  const clientContracts = contracts
    .filter(c => (c.clientEmail && c.clientEmail === currentUser?.email) || (!c.clientEmail && c.clientName === currentUser?.name))
    .sort((a, b) => b.id.localeCompare(a.id)); 
    
  const freelancerContracts = contracts
    .filter(c => (c.freelancerEmail && c.freelancerEmail === currentUser?.email) || (!c.freelancerEmail && c.freelancerName === currentUser?.name))
    .sort((a, b) => b.id.localeCompare(a.id));

  return (
    <Layout 
      userRole={userRole} 
      onLogout={handleLogout} 
      walletAddress={walletAddress}
      onConnectWallet={handleConnectWallet}
      currentUser={currentUser}
      contracts={contracts}
    >
      <Routes>
        <Route path="/" element={!userRole ? <LandingPage /> : <Navigate to={userRole === 'client' ? '/client-dashboard' : '/freelancer-dashboard'} />} />
        <Route path="/login" element={!userRole ? <AuthPage onLogin={handleLogin} /> : <Navigate to={userRole === 'client' ? '/client-dashboard' : '/freelancer-dashboard'} />} />

        <Route path="/client-dashboard" element={
          userRole === 'client' ? 
          <ClientDashboard contracts={clientContracts} userName={currentUser?.name} /> 
          : <Navigate to="/login" />
        } />
        
        <Route path="/create-contract" element={
          userRole === 'client' || userRole === 'freelancer' ? 
          <CreateContract 
            onAddContract={handleAddContract} 
            onUpdateContract={handleEditContract}
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
            currentUser={currentUser}
          /> : <Navigate to="/login" />
        } />

        <Route path="/freelancer-dashboard" element={
          userRole === 'freelancer' ? 
          <FreelancerDashboard 
            contracts={freelancerContracts} 
            onLogout={handleLogout} 
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
            userName={currentUser?.name}
            onUpdateContract={handleUpdateContractStatus}
          /> 
          : <Navigate to="/login" />
        } />
        
        <Route path="/submission/:contractId/:milestoneId" element={
          userRole === 'freelancer' ? 
          <MilestoneSubmission 
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
            contracts={contracts}
            onSubmitWork={handleSubmitWork}
          /> : <Navigate to="/login" />
        } />

        <Route path="/contract/:id" element={
            userRole ? 
            <ContractDetails 
                userRole={userRole} 
                contracts={contracts} 
                onDisputeMilestone={handleDisputeMilestone}
                onUpdateContract={handleUpdateContractStatus}
                onApproveMilestone={handleApproveMilestone}
                walletAddress={walletAddress}
                onConnectWallet={handleConnectWallet}
            /> : <Navigate to="/login" />
        } />
        
        <Route path="/dispute/:contractId/:milestoneId" element={userRole ? <DisputeReport contracts={contracts} /> : <Navigate to="/login" />} />
        <Route path="/dispute" element={userRole ? <DisputeReport contracts={contracts} /> : <Navigate to="/login" />} />
        
        <Route path="/profile" element={userRole ? <ProfilePage userRole={userRole} currentUser={currentUser} /> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

// Main App Component provides the Contexts
const App: React.FC = () => {
    return (
        <ToastProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </ToastProvider>
    );
};

export default App;
