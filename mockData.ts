
import { Contract, DisputeReportData } from './types';

export const MOCK_CONTRACTS: Contract[] = [
  // --- ACTIVE CONTRACTS (Shared) ---
  {
    id: "CNT-2024-001",
    title: "E-commerce Platform Redesign",
    clientName: "Rajesh Gupta", 
    freelancerName: "Ankit Verma",
    totalValue: 120000,
    escrowBalance: 90000, 
    status: 'active',
    createdAt: "15/10/2023",
    milestones: [
      {
        id: "M1",
        version: 1,
        title: "UX Research & Wireframing",
        amount: 30000,
        status: 'paid', // Completed
        deadline: "2023-10-25",
        autoReleaseDate: "2023-11-01",
        description: "Complete user flow analysis and low-fidelity wireframes for the checkout process.",
        deliverables: [
          { id: "d1", description: "User Journey Map (PDF)", type: "file", evidence: "journey_map_v2.pdf", verificationStatus: 'pass', verificationNote: "Format Verified" },
          { id: "d2", description: "Low-fi Figma Link", type: "link", evidence: "figma.com/file/wireframes", verificationStatus: 'pass', verificationNote: "Link Active" }
        ],
        acceptanceCriteria: [
          "Includes flows for Guest Checkout and Registered User.",
          "Figma link is accessible and commented."
        ],
        outOfScope: ["High fidelity UI", "Logo design"]
      },
      {
        id: "M2",
        version: 1,
        title: "High Fidelity UI Components",
        amount: 50000,
        status: 'in_progress', // Active work
        deadline: "2024-03-10",
        description: "Create pixel-perfect UI kit and core page designs (Home, PDP, Cart).",
        deliverables: [
          { id: "d1", description: "Design System (Figma)", type: "link" },
          { id: "d2", description: "Home & Product Page Exports", type: "file" },
          { id: "d3", description: "Mobile Adaptive Views", type: "link" }
        ],
        acceptanceCriteria: [
          "Follows Material Design 3 guidelines.",
          "Mobile responsiveness verified on iPhone 13 frame."
        ],
        outOfScope: ["Dark mode", "Admin dashboard"]
      },
      {
        id: "M3",
        version: 1,
        title: "Frontend React Implementation",
        amount: 20000,
        status: 'funded', // Locked
        deadline: "2024-04-01",
        description: "Convert designs into responsive React components (Home & PDP).",
        deliverables: [
          { id: "d1", description: "GitHub Repository Link", type: "link" },
          { id: "d2", description: "Storybook Component Library", type: "link" }
        ],
        acceptanceCriteria: [
          "Clean code with TypeScript interfaces.",
          "Passes all unit tests."
        ],
        outOfScope: ["Backend API integration"]
      },
      {
        id: "M4",
        version: 1,
        title: "Cart & Checkout Integration",
        amount: 20000,
        status: 'funded',
        deadline: "2024-04-15",
        description: "Implement state management for Cart and Checkout flow.",
        deliverables: [
          { id: "d1", description: "Source Code Update", type: "link" }
        ],
        acceptanceCriteria: ["State persists on refresh", "Payment gateway sandbox connected"],
        outOfScope: []
      }
    ]
  },

  // --- NEW: ACTIVE (Freelancer's other client) ---
  {
    id: "CNT-2024-EXT-01",
    title: "Solidity Yield Farming Protocol",
    clientName: "Sarah Jenkins", // Different Client
    freelancerName: "Ankit Verma", // Our Freelancer
    totalValue: 300000,
    escrowBalance: 200000,
    status: 'active',
    createdAt: "05/01/2024",
    milestones: [
        {
            id: "M1",
            version: 1,
            title: "Smart Contract Architecture",
            amount: 100000,
            status: 'paid',
            deadline: "2024-01-20",
            description: "Define vault strategies and tokenomics structure.",
            deliverables: [{id: "d1", description: "Whitepaper Technical Spec", type: "file", evidence: "spec_v1.pdf", verificationStatus: 'pass'}],
            acceptanceCriteria: ["Gas optimization strategy defined", "Security patterns identified"],
            outOfScope: []
        },
        {
            id: "M2",
            version: 1,
            title: "Core Vault Implementation",
            amount: 100000,
            status: 'in_progress',
            deadline: "2024-03-15",
            description: "Develop the main vault contracts and strategy adapters.",
            deliverables: [{id: "d1", description: "GitHub Repo", type: "link"}],
            acceptanceCriteria: ["100% test coverage", "Passes Slither analysis"],
            outOfScope: ["Frontend integration"]
        },
        {
            id: "M3",
            version: 1,
            title: "Staking & Rewards Logic",
            amount: 50000,
            status: 'funded',
            deadline: "2024-04-01",
            description: "Implement the MasterChef style staking rewards logic.",
            deliverables: [{id: "d1", description: "Staking Contracts", type: "link"}],
            acceptanceCriteria: ["Math verified for APY calculations"],
            outOfScope: []
        },
        {
            id: "M4",
            version: 1,
            title: "Testnet Deployment & Scripts",
            amount: 50000,
            status: 'funded',
            deadline: "2024-04-10",
            description: "Deploy to Sepolia and provide interaction scripts.",
            deliverables: [{id: "d1", description: "Deployment Address List", type: "file"}],
            acceptanceCriteria: ["All contracts verified on Etherscan"],
            outOfScope: ["Mainnet Gas Fees"]
        }
    ]
  },

  // --- NEW: ACTIVE (Client's other freelancer) ---
  {
    id: "CNT-2024-EXT-02",
    title: "Marketing Video Production",
    clientName: "Rajesh Gupta", // Our Client
    freelancerName: "PixelPerfect Agency", // Different Freelancer
    totalValue: 55000,
    escrowBalance: 55000,
    status: 'active',
    createdAt: "12/02/2024",
    milestones: [
        {
            id: "M1",
            version: 1,
            title: "Script & Storyboard",
            amount: 15000,
            status: 'approved', // Waiting for payment release
            deadline: "2024-02-20",
            description: "Finalize the script for the 60s explainer video.",
            deliverables: [{id: "d1", description: "Storyboard PDF", type: "file", evidence: "storyboard_final.pdf", verificationStatus: 'pass'}],
            acceptanceCriteria: ["Client approved script", "Visual style matched brand guidelines"],
            outOfScope: []
        },
        {
            id: "M2",
            version: 1,
            title: "Animation & Voiceover",
            amount: 30000,
            status: 'funded',
            deadline: "2024-03-05",
            description: "Full animation production with professional VO.",
            deliverables: [{id: "d1", description: "MP4 Video File", type: "file"}],
            acceptanceCriteria: ["1080p resolution", "Background music licensed"],
            outOfScope: []
        },
        {
            id: "M3",
            version: 1,
            title: "Social Media Cuts",
            amount: 10000,
            status: 'funded',
            deadline: "2024-03-10",
            description: "Edit the main video into 3 shorts (15s, 30s) for Instagram/LinkedIn.",
            deliverables: [{id: "d1", description: "Vertical Video Zip", type: "file"}],
            acceptanceCriteria: ["9:16 Aspect Ratio", "Subtitles included"],
            outOfScope: []
        }
    ]
  },

  // --- NEW: COMPLETED (Historic) ---
  {
    id: "CNT-2023-OLD-01",
    title: "Q3 System Maintenance",
    clientName: "Rajesh Gupta", 
    freelancerName: "Ankit Verma",
    totalValue: 30000,
    escrowBalance: 0, 
    status: 'completed',
    createdAt: "01/08/2023",
    milestones: [
      {
        id: "M1",
        version: 1,
        title: "Server Patching & Updates",
        amount: 20000,
        status: 'paid',
        deadline: "2023-08-15",
        description: "Routine security patches for the AWS EC2 fleet.",
        deliverables: [{ id: "d1", description: "Maintenance Log", type: "file", evidence: "logs_aug23.txt", verificationStatus: 'pass'}],
        acceptanceCriteria: ["Uptime > 99.9% during patch", "No critical vulnerabilities remaining"],
        outOfScope: []
      },
      {
        id: "M2",
        version: 1,
        title: "Database Optimization",
        amount: 10000,
        status: 'paid',
        deadline: "2023-08-25",
        description: "Analyze slow queries and add necessary indices.",
        deliverables: [{ id: "d1", description: "Performance Report", type: "file", evidence: "perf_report.pdf", verificationStatus: 'pass'}],
        acceptanceCriteria: ["Query time reduced by 20%"],
        outOfScope: []
      }
    ]
  },

  // --- FREELANCER INBOX (3 Proposals Sent by Client) ---
  
  // 1. Corporate Branding
  {
    id: "CNT-2024-NEG-02",
    title: "Corporate Branding Identity",
    clientName: "Rajesh Gupta",
    freelancerName: "Ankit Verma",
    totalValue: 45000,
    escrowBalance: 0,
    status: 'invited', // Client -> Freelancer
    createdAt: "Today",
    milestones: [
      {
        id: "M1",
        version: 1,
        title: "Logo Concepts & Palette",
        amount: 20000,
        status: 'draft',
        deadline: "2024-03-20",
        description: "Deliver 3 initial logo concepts and a comprehensive color palette for the new startup.",
        deliverables: [
           { id: "d1", description: "Concept Presentation Deck (PDF)", type: "file" }
        ],
        acceptanceCriteria: ["Vector formats provided (SVG/EPS)", "CMYK and RGB variants included"],
        outOfScope: ["Website Design", "Social Media Assets"]
      },
      {
        id: "M2",
        version: 1,
        title: "Brand Guidelines Book",
        amount: 25000,
        status: 'draft',
        deadline: "2024-04-05",
        description: "PDF guidelines for usage, typography, and do's/don'ts.",
        deliverables: [{ id: "d1", description: "Brand Book PDF", type: "file" }],
        acceptanceCriteria: ["Includes print & digital usage rules", "Typography selection included"],
        outOfScope: ["Printing costs"]
      }
    ]
  },

  // 2. SEO Optimization (New)
  {
    id: "CNT-2024-NEG-03",
    title: "SEO Optimization & Content Strategy",
    clientName: "Rajesh Gupta",
    freelancerName: "Ankit Verma",
    totalValue: 35000,
    escrowBalance: 0,
    status: 'invited',
    createdAt: "2 hours ago",
    milestones: [
      {
        id: "M1",
        version: 1,
        title: "Technical SEO Audit",
        amount: 15000,
        status: 'draft',
        deadline: "2024-02-15",
        description: "Complete technical audit of existing website and fix Core Web Vitals.",
        deliverables: [{ id: "d1", description: "Audit Report & Fix Log", type: "file" }],
        acceptanceCriteria: ["Lighthouse Performance Score > 90", "Zero broken links reported"],
        outOfScope: ["Content writing"]
      },
      {
        id: "M2",
        version: 1,
        title: "Keyword Strategy Q2",
        amount: 10000,
        status: 'draft',
        deadline: "2024-02-28",
        description: "Develop a keyword map for the blog section targeting 'DeFi' keywords.",
        deliverables: [{ id: "d1", description: "Keyword Sheet (XLS)", type: "file" }],
        acceptanceCriteria: ["Includes 50+ long-tail keywords", "Difficulty score analysis included"],
        outOfScope: []
      },
      {
        id: "M3",
        version: 1,
        title: "On-Page Optimization (5 Pages)",
        amount: 10000,
        status: 'draft',
        deadline: "2024-03-10",
        description: "Implement meta tags, schema markup, and H1/H2 structures.",
        deliverables: [{ id: "d1", description: "Screenshot Proof", type: "file" }],
        acceptanceCriteria: ["Schema validator passes"],
        outOfScope: []
      }
    ]
  },

  // 3. Smart Contract Audit (New)
  {
    id: "CNT-2024-NEG-04",
    title: "Smart Contract Security Audit",
    clientName: "Rajesh Gupta",
    freelancerName: "Ankit Verma",
    totalValue: 150000,
    escrowBalance: 0,
    status: 'invited',
    createdAt: "Yesterday",
    milestones: [
      {
        id: "M1",
        version: 1,
        title: "Preliminary Code Review",
        amount: 50000,
        status: 'draft',
        deadline: "2024-03-01",
        description: "Initial scan using Slither and manual review for reentrancy vulnerabilities.",
        deliverables: [{ id: "d1", description: "Initial Vulnerability Report", type: "file" }],
        acceptanceCriteria: ["Identifies all critical severity issues", "Report follows standard format"],
        outOfScope: ["Gas optimization"]
      },
      {
        id: "M2",
        version: 1,
        title: "Final Certification",
        amount: 100000,
        status: 'draft',
        deadline: "2024-03-15",
        description: "Re-check after fixes and issue final audit certificate.",
        deliverables: [{ id: "d1", description: "Signed Audit Certificate", type: "file" }],
        acceptanceCriteria: ["Hash of deployed code matches audit target", "No critical bugs remaining"],
        outOfScope: []
      }
    ]
  },

  // --- CLIENT INBOX (2 Proposals Sent by Freelancer) ---

  // 1. Web3 Wallet (Existing)
  {
    id: "CNT-2024-NEG-01",
    title: "Web3 Wallet Integration",
    clientName: "Rajesh Gupta",
    freelancerName: "Ankit Verma",
    totalValue: 60000,
    escrowBalance: 0,
    status: 'pending', // Freelancer -> Client
    createdAt: "Yesterday",
    milestones: [
        {
            id: "M1",
            version: 1,
            title: "Smart Contract Integration",
            amount: 30000,
            status: 'draft',
            deadline: "2024-05-01",
            description: "Connect frontend to Ethereum testnet using Wagmi/Viem.",
            deliverables: [{ id: "d1", description: "Repo Link", type: "link" }],
            acceptanceCriteria: ["Connects to Metamask", "Reads balance correctly"],
            outOfScope: ["Mainnet Deployment"]
        },
        {
            id: "M2",
            version: 1,
            title: "Transaction Handling",
            amount: 30000,
            status: 'draft',
            deadline: "2024-05-15",
            description: "Implement send transaction and error handling UI.",
            deliverables: [{ id: "d1", description: "Demo Video", type: "file" }],
            acceptanceCriteria: ["Handles user rejection", "Shows success toast"],
            outOfScope: []
        }
    ]
  },

  // 2. Data Scraping Bot (New)
  {
    id: "CNT-2024-NEG-05",
    title: "Real-Estate Data Scraper",
    clientName: "Rajesh Gupta",
    freelancerName: "Ankit Verma",
    totalValue: 45000,
    escrowBalance: 0,
    status: 'pending',
    createdAt: "3 hours ago",
    milestones: [
        {
            id: "M1",
            version: 1,
            title: "Scraper Script Development",
            amount: 25000,
            status: 'draft',
            deadline: "2024-02-20",
            description: "Python script to scrape property listings from 3 major portals.",
            deliverables: [{ id: "d1", description: "Python Script (.py)", type: "file" }],
            acceptanceCriteria: ["Handles pagination correctly", "Bypasses basic captcha"],
            outOfScope: ["Rotating proxy subscription"]
        },
        {
            id: "M2",
            version: 1,
            title: "Database Integration",
            amount: 20000,
            status: 'draft',
            deadline: "2024-02-25",
            description: "Store scraped data into a structured PostgreSQL database.",
            deliverables: [{ id: "d1", description: "SQL Dump", type: "file" }],
            acceptanceCriteria: ["Normalized schema", "No duplicate entries"],
            outOfScope: ["Dashboard UI"]
        }
    ]
  },

  // --- OTHER STATES ---

  // Submitted / Client Review Needed
  {
    id: "CNT-2024-REV",
    title: "Social Media Marketing - Q1",
    clientName: "Rajesh Gupta",
    freelancerName: "Ankit Verma",
    totalValue: 25000,
    escrowBalance: 25000,
    status: 'active',
    createdAt: "10/01/2024",
    milestones: [
      {
        id: "M1",
        version: 1,
        title: "January Content Calendar",
        amount: 25000,
        status: 'submitted',
        deadline: "2024-01-25",
        description: "Create and schedule 12 posts for Instagram and LinkedIn.",
        deliverables: [
            { id: "d1", description: "Content Calendar Sheet", type: "link", evidence: "docs.google.com/sheet/abc", verificationStatus: 'pass', verificationNote: "Accessible" },
            { id: "d2", description: "Creative Assets Zip", type: "file", evidence: "assets_jan_v1.zip", verificationStatus: 'warning', verificationNote: "Size > 50MB" }
        ],
        acceptanceCriteria: ["Approved by brand team.", "No spelling errors in copy."],
        outOfScope: ["Community management", "Ad spend"]
      }
    ]
  },

  // Disputed
  {
    id: "CNT-2024-DSP1",
    title: "Logistics App GPS Module",
    clientName: "Rajesh Gupta",
    freelancerName: "Ankit Verma",
    totalValue: 80000,
    escrowBalance: 40000,
    status: 'disputed',
    createdAt: "01/09/2023",
    milestones: [
      {
        id: "M1",
        version: 2,
        title: "Real-time Tracking API",
        amount: 40000,
        status: 'disputed',
        deadline: "2023-10-10",
        description: "Backend WebSocket implementation for live location updates.",
        deliverables: [
          { id: "d1", description: "API Source Code", type: "link", evidence: "github.com/ankit/repo-gps", verificationStatus: 'pass', verificationNote: "Repo Scanned: Clean" },
          { id: "d2", description: "Load Test Report", type: "file", evidence: "jmeter_report_v2.pdf", verificationStatus: 'fail', verificationNote: "Analysis: Avg Latency 450ms" }
        ],
        acceptanceCriteria: [
          "Latency under 200ms for 1k concurrent users.",
          "Handles disconnect/reconnect gracefully."
        ],
        outOfScope: ["Frontend Map integration"],
        disputeLevel: 1,
        disputeReason: 'quality',
        disputeComments: "The latency is consistently above 400ms during peak loads, violating the 200ms requirement.",
        failedCriteria: ["Latency under 200ms for 1k concurrent users."]
      },
      {
        id: "M2",
        version: 1,
        title: "Frontend Map Integration",
        amount: 40000,
        status: 'draft',
        deadline: "2023-11-01",
        description: "Integrate Mapbox GL JS on the frontend.",
        deliverables: [],
        acceptanceCriteria: ["Smooth marker movement"],
        outOfScope: []
      }
    ]
  }
];

export const MOCK_DISPUTE_REPORT: DisputeReportData = {
  contractId: "CNT-2024-DSP1",
  milestoneId: "M1",
  generatedDate: "12/10/2023",
  complianceScore: 65,
  confidenceLevel: "High",
  recommendation: "Partial Release",
  evidenceAnalysis: [
    { item: "Latency Requirement (<200ms)", status: "fail", reason: "Log analysis indicates average latency of 450ms during load test provided in 'jmeter_report_v2.pdf'." },
    { item: "Code Quality / Architecture", status: "pass", reason: "Standard linting checks passed. WebSocket implementation follows standard patterns." },
    { item: "Reconnect Logic", status: "warning", reason: "Retry mechanism detected in code but lacks exponential backoff strategy." },
    { item: "Deliverable Completeness", status: "pass", reason: "All requested files (Source Code, Test Report) are present." }
  ]
};
