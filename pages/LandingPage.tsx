
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, FileText, ArrowRight, BrainCircuit, Upload, CheckSquare, Server } from 'lucide-react';
import { Logo } from '../components/Logo';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="py-6 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo size={48} />
            <span className="text-xl font-bold text-slate-900 tracking-tight">TrustVault</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
            <Link to="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-200 font-medium">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 border border-blue-100">
          <span>🇮🇳 Built for Indian Freelancers & Agencies</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Milestone contracts with <br className="hidden md:block"/> <span className="text-blue-600">automated verification.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The fair way to work. Funds are held in escrow and released automatically based on objective milestone completion. No bias, no manual admins.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center">
            Draft Contract
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/login" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center">
            View Live Demo
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-400 font-medium">No one can override outcomes once rules are set.</p>
      </section>

      {/* 4-Step Flow */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
             <p className="mt-2 text-slate-500">A completely transparent, rule-based workflow.</p>
           </div>
           
           <div className="relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-slate-100 z-0"></div>
              
              <div className="grid md:grid-cols-4 gap-8 relative z-10">
                 {[
                   { icon: CheckSquare, title: "1. Define Milestones", desc: "Set strict deliverables & criteria." },
                   { icon: Lock, title: "2. Lock Funds", desc: "Client deposits amount safely." },
                   { icon: Upload, title: "3. Submit Evidence", desc: "Freelancer uploads proof of work." },
                   { icon: Server, title: "4. System Outcome", desc: "Auto-release or report generated." },
                 ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                       <div className="bg-white border-2 border-blue-50 h-24 w-24 rounded-full flex items-center justify-center mb-6 shadow-sm">
                          <step.icon className="h-10 w-10 text-blue-600" />
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                       <p className="text-sm text-slate-500 max-w-[200px]">{step.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">System-Driven Trust</h2>
            <p className="mt-4 text-slate-500">We don't take sides. The contract rules are the boss.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: FileText,
                title: "Structured Milestones",
                desc: "No vague promises. Define strict deliverables, acceptance criteria, and out-of-scope items."
              },
              {
                icon: Lock,
                title: "Funds Locked",
                desc: "Client deposits the milestone amount. It's held securely until work is submitted and verified."
              },
              {
                icon: BrainCircuit,
                title: "Automated Review",
                desc: "Disputes are first analyzed by our automated system, checking deliverables against criteria."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-12 md:p-16 text-white overflow-hidden relative">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why TrustVault?</h2>
              <ul className="space-y-4">
                {[
                  "Eliminate scope creep with strict acceptance criteria.",
                  "System-generated dispute reports.",
                  "Bank transfers (NEFT/IMPS) for Indian users.",
                  "Milestone Quality Scores guide better contracts."
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <CheckCircle2 className="text-emerald-400 h-6 w-6 flex-shrink-0" />
                    <span className="text-lg text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">AV</div>
                    <div>
                       <p className="font-medium">Ankit Verma</p>
                       <p className="text-xs text-slate-400">Freelance Developer</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium">Funds Released</span>
               </div>
               <p className="text-slate-300 italic">"The automated review report saved me. The system proved my code met the criteria despite the client's subjective complaints."</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-12 text-center text-slate-500 text-sm">
        <p>&copy; 2024 TrustVault India. All rights reserved.</p>
      </footer>
    </div>
  );
};
