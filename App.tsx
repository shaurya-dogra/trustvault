
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
import { MOCK_CONTRACTS } from './mockData';
import { ToastProvider, useToast } from './components/Toast';

// AppContent contains the main logic and consumes the Toast Context
const AppContent: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  // Safe access to toast context
  const { addToast } = useToast();
  
  // Initialize contracts from localStorage or use defaults
  // VERSION BUMP: v3 to ensure new sample data is loaded
  const [contracts, setContracts] = useState<Contract[]>(() => {
    const saved = localStorage.getItem('trustvault_contracts_v3');
    return saved ? JSON.parse(saved) : MOCK_CONTRACTS;
  });

  // Sync contracts to localStorage
  useEffect(() => {
    localStorage.setItem('trustvault_contracts_v3', JSON.stringify(contracts));
  }, [contracts]);

  // Check for existing session and wallet listener
  useEffect(() => {
    // Restore Session
    const savedSession = localStorage.getItem('trustvault_session');
    if (savedSession) {
        try {
            const session: AuthSession = JSON.parse(savedSession);
            setUserRole(session.role);
            setCurrentUser(session.user);
        } catch (e) {
            console.error("Failed to restore session", e);
        }
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
    const session: AuthSession = { user: account, role: account.role };
    localStorage.setItem('trustvault_session', JSON.stringify(session));
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setWalletAddress(null);
    localStorage.removeItem('trustvault_session');
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
    setContracts(prev => [newContract, ...prev]);
  };

  // Used for status updates (Accept/Reject/Active)
  const handleUpdateContractStatus = (id: string, status: Contract['status']) => {
    setContracts(prev => prev.map(c => {
        if (c.id === id) {
            // If activating, assume funds are now locked (demo logic)
            const escrowBalance = status === 'active' ? c.totalValue : c.escrowBalance;
            return { ...c, status, escrowBalance };
        }
        return c;
    }));
  };

  // Used for full edits (Modify Proposal)
  const handleEditContract = (updatedContract: Contract) => {
    setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
  };

  const handleDisputeMilestone = (contractId: string, milestoneId: string, disputeData: { reason: string; comments: string; failedCriteria: string[] }) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      
      const updatedMilestones = c.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          status: 'disputed',
          disputeReason: disputeData.reason as any,
          disputeComments: disputeData.comments,
          failedCriteria: disputeData.failedCriteria,
          disputeLevel: 1, // Start at Level 1 (AI Analysis)
          disputeRaisedAt: new Date().toLocaleDateString('en-IN')
        } as any;
      });

      return {
        ...c,
        status: 'disputed',
        milestones: updatedMilestones
      };
    }));
  };

  const clientContracts = contracts
    .filter(c => c.clientName === currentUser?.name)
    .sort((a, b) => b.id.localeCompare(a.id));
    
  const freelancerContracts = contracts
    .filter(c => c.freelancerName === currentUser?.name)
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
        
        <Route path="/submission" element={
          userRole === 'freelancer' ? 
          <MilestoneSubmission 
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
          /> : <Navigate to="/login" />
        } />

        <Route path="/contract/:id" element={
            userRole ? 
            <ContractDetails 
                userRole={userRole} 
                contracts={contracts} 
                onDisputeMilestone={handleDisputeMilestone}
                onUpdateContract={handleUpdateContractStatus}
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
