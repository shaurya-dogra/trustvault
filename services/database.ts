
import { Contract, UserAccount, AuthSession } from '../types';
import { MOCK_CONTRACTS } from '../mockData';

const KEYS = {
  SESSION: 'trustvault_session'
};

class DatabaseService {
  private contracts: Contract[] = [];
  private users: UserAccount[] = [];

  constructor() {
    this.reset();
  }

  private reset() {
    // Deep copy mock data to ensure fresh state on every reload
    this.contracts = JSON.parse(JSON.stringify(MOCK_CONTRACTS));
    
    // Initialize with Demo Users so they are always available,
    // but any new users added at runtime will be wiped on reload.
    this.users = [
        { 
            email: 'rajesh@example.com', 
            password: 'password', 
            name: 'Rajesh Gupta', 
            role: 'client', 
            initials: 'RG' 
        },
        { 
            email: 'ankit@example.com', 
            password: 'password', 
            name: 'Ankit Verma', 
            role: 'freelancer', 
            initials: 'AV' 
        }
    ];
  }

  // --- Contract Operations ---
  
  getAllContracts(): Contract[] {
    return [...this.contracts];
  }

  addContract(contract: Contract): Contract {
    // Ensure ID uniqueness just in case
    if (this.contracts.some(c => c.id === contract.id)) {
        contract.id = `${contract.id}-${Date.now().toString().slice(-4)}`;
    }
    this.contracts = [contract, ...this.contracts];
    return contract;
  }

  updateContract(updatedContract: Contract): Contract {
    this.contracts = this.contracts.map(c => 
      c.id === updatedContract.id ? updatedContract : c
    );
    return updatedContract;
  }
  
  // --- User Operations ---

  getUsers(): UserAccount[] {
    return [...this.users];
  }

  addUser(user: UserAccount): UserAccount {
    this.users.push(user);
    return user;
  }

  // --- Session Operations ---
  // Using sessionStorage so login survives a refresh, but is cleared on tab close
  
  saveSession(session: AuthSession) {
    sessionStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  }

  getSession(): AuthSession | null {
    try {
      const s = sessionStorage.getItem(KEYS.SESSION);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  clearSession() {
    sessionStorage.removeItem(KEYS.SESSION);
  }
}

export const db = new DatabaseService();
