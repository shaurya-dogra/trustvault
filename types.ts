

export type UserRole = 'client' | 'freelancer' | null;

export interface UserAccount {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  initials: string;
}

export interface AuthSession {
  user: UserAccount;
  role: UserRole;
}

export interface DeliverableItem {
  id: string;
  description: string;
  type: 'file' | 'link' | 'any';
  evidence?: string; // URL or filename when submitted
  verificationStatus?: 'pass' | 'fail' | 'pending' | 'warning';
  verificationNote?: string;
}

export interface Milestone {
  id: string;
  version: number;
  title: string; // Objective
  amount: number;
  status: 'draft' | 'pending' | 'funded' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'disputed' | 'paid' | 'active' | 'completed' | 'invited' | 'rejected';
  deadline: string;
  description: string; // Detailed objective
  deliverables: DeliverableItem[];
  acceptanceCriteria: string[]; // List of criteria
  outOfScope: string[];
  autoReleaseDate?: string;
  // Dispute fields
  disputeReason?: 'quality' | 'incomplete' | 'requirements' | 'delay';
  disputeComments?: string;
  failedCriteria?: string[];
  disputeRaisedAt?: string;
  disputeLevel?: 1 | 2; // 1: AI Verification, 2: Human Arbitration
}

export interface Contract {
  id: string;
  title: string;
  clientName: string;
  freelancerName: string;
  totalValue: number;
  escrowBalance: number;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'disputed' | 'invited' | 'rejected';
  milestones: Milestone[];
  createdAt: string;
}

export interface DisputeReportData {
  contractId: string;
  milestoneId: string;
  generatedDate: string;
  complianceScore: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  recommendation: 'Release Funds' | 'Partial Release' | 'Escalate';
  evidenceAnalysis: {
    item: string;
    status: 'pass' | 'fail' | 'warning';
    reason: string;
  }[];
}

// Global declaration for the Ethereum provider injected by wallets like MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
      isMetaMask?: boolean;
    };
  }
}