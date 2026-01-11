<div align="center">
  <img src="public/logo.png" alt="TrustVault Logo" width="80" height="80">
  <h1>TrustVault</h1>
</div>

> **Milestone contracts with automated verification.** The fair way to work.

TrustVault is a secure escrow platform built for Indian freelancers and agencies. It automates payment releases based on objective milestone completion, eliminating bias and manual intervention.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://shaurya-dogra.github.io/trustvault/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

### 🎯 **Smart Contract Management**

- **Milestone-Based Escrow**: Funds are locked in escrow and released only when milestones are completed
- **Automated Verification**: AI-powered review of deliverables against acceptance criteria
- **Objective Evaluation**: No manual overrides - outcomes are determined by predefined rules

### 🤖 **AI-Powered Dispute Resolution**

- Automated evidence analysis using Gemini AI
- Compliance scoring and confidence levels
- Smart recommendations: Release, Partial Release, or Escalate to human arbitration

### 💼 **Dual User Experience**

- **Client Dashboard**: Create contracts, review submissions, manage milestones
- **Freelancer Dashboard**: Accept invitations, submit deliverables, track payments

### 🔒 **Security & Transparency**

- Wallet integration ready (MetaMask support)
- Immutable milestone criteria once funded
- Auto-release mechanism after review period
- Complete audit trail for all transactions

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shaurya-dogra/trustvault.git
   cd trustvault
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

---

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

The site will be deployed to: `https://shaurya-dogra.github.io/trustvault/`

---

## 🎨 Tech Stack

- **Frontend**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google Gemini AI
- **Build Tool**: Vite 6
- **Deployment**: GitHub Pages

---

## 🏗️ Project Structure

```
trustvault/
├── components/         # Reusable UI components
│   ├── Layout.tsx     # Main layout wrapper
│   ├── Logo.tsx       # Brand logo component
│   ├── StatusBadge.tsx # Status indicators
│   └── Toast.tsx      # Notification system
├── pages/             # Application pages
│   ├── LandingPage.tsx
│   ├── AuthPage.tsx
│   ├── ClientDashboard.tsx
│   ├── FreelancerDashboard.tsx
│   ├── CreateContract.tsx
│   ├── ContractDetails.tsx
│   ├── MilestoneSubmission.tsx
│   ├── DisputeReport.tsx
│   └── ProfilePage.tsx
├── utils/             # Helper functions
│   └── contractGenerator.ts  # AI contract generation
├── types.ts           # TypeScript type definitions
├── mockData.ts        # Sample contract data
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

---

## 🎭 Demo Users

The application comes with demo accounts for testing:

### Client Account

- **Email**: `client@example.com`
- **Password**: `password123`

### Freelancer Account

- **Email**: `freelancer@example.com`
- **Password**: `password123`

---

## 🌟 How It Works

### 1. **Contract Creation**

Clients define milestones with:

- Clear objectives and descriptions
- Specific deliverables (files, links, or any evidence)
- Acceptance criteria
- Out-of-scope items
- Payment amounts and deadlines

### 2. **Escrow Funding**

Once the freelancer accepts, the client funds the milestone. Funds are locked in escrow.

### 3. **Milestone Execution**

Freelancers work on deliverables and submit evidence when complete.

### 4. **Automated Verification**

- AI analyzes submitted deliverables against acceptance criteria
- Generates compliance scores and recommendations
- Client reviews AI analysis and can approve or raise disputes

### 5. **Payment Release**

- Approved milestones trigger automatic fund release
- Disputed milestones go through AI arbitration
- Auto-release after review period protects freelancers

---

## 🔮 Future Enhancements

- [ ] Full blockchain integration (Polygon/Ethereum)
- [ ] Multi-signature wallet support
- [ ] Real-time notifications
- [ ] Chat system for client-freelancer communication
- [ ] Advanced analytics and reporting
- [ ] Integration with payment gateways (Razorpay, Stripe)
- [ ] Mobile app (React Native)
- [ ] Reputation system and reviews

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shaurya Dogra**

- GitHub: [@shaurya-dogra](https://github.com/shaurya-dogra)
- Project Link: [https://github.com/shaurya-dogra/trustvault](https://github.com/shaurya-dogra/trustvault)

---

## 🙏 Acknowledgments

- Built for the Indian freelancer community
- Inspired by the need for fair, transparent work agreements
- Powered by Google Gemini AI for smart contract analysis

---

<div align="center">
  <strong>Made with ❤️ for freelancers everywhere</strong>
</div>
