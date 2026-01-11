
import React, { useState, useEffect } from 'react';
import { UserRole, UserAccount } from '../types';
import { ArrowLeft, AlertCircle, CheckCircle2, User, Mail, Lock, UserCheck, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { db } from '../services/database';

interface AuthPageProps {
  onLogin: (account: UserAccount) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [view, setView] = useState<'choice' | 'auth'>('choice');
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset states when switching between Login and Sign Up or switching views
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [isLogin, view]);

  const selectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setView('auth');
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const users = db.getUsers();

    if (isLogin) {
      // --- Login Logic ---
      // Check against DB users (which now includes demo users)
      const registeredUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password && 
        u.role === role // Ensure role matches for registered users
      );
      
      if (registeredUser) {
        onLogin(registeredUser);
      } else {
        setError(`Invalid credentials for the ${role} portal. Please check your details.`);
      }
    } else {
      // --- Sign Up Logic ---
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all fields.');
        return;
      }

      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError('This email is already registered. Try signing in.');
        return;
      }

      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const newUser: UserAccount = {
        name,
        email: email.toLowerCase(),
        password,
        role: role!, // Explicitly use the role selected in the first step
        initials
      };

      db.addUser(newUser);
      setSuccess('Account created! Logging in...');
      onLogin(newUser); // Login immediately without delay
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 font-medium transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
            <Logo size={64} />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
          {view === 'choice' ? 'Welcome to TrustVault' : role === 'client' ? 'Client Portal' : 'Freelancer Portal'}
        </h2>
        {view === 'choice' && (
          <p className="mt-2 text-sm text-slate-500">Choose your path to get started</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        {view === 'choice' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Client */}
            <button 
              onClick={() => selectRole('client')}
              className="group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all text-left overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Briefcase size={80} />
              </div>
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600 w-fit mb-6">
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">I am a Client</h3>
              <p className="text-slate-500 text-sm mb-8 flex-grow">
                I want to hire talent, create smart escrow contracts, and ensure work is verified before payment.
              </p>
              <div className="flex items-center text-blue-600 font-bold text-sm">
                Enter Client Portal <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 2: Freelancer */}
            <button 
              onClick={() => selectRole('freelancer')}
              className="group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all text-left overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <UserCheck size={80} />
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 w-fit mb-6">
                <UserCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">I am a Freelancer</h3>
              <p className="text-slate-500 text-sm mb-8 flex-grow">
                I want to track my milestones, submit evidence, and get paid automatically for my quality work.
              </p>
              <div className="flex items-center text-emerald-600 font-bold text-sm">
                Enter Freelancer Portal <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        ) : (
          <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
            <button 
              onClick={() => setView('choice')}
              className="mb-6 text-xs text-slate-500 hover:text-blue-600 flex items-center font-semibold uppercase tracking-wider"
            >
              <ArrowLeft size={14} className="mr-1" /> Back to Role Selection
            </button>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-center animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl flex items-center animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={18} className="mr-3 flex-shrink-0" />
                {success}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleAuth}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm bg-white text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  {/* Changed type="email" to type="text" to allow test inputs like "a" */}
                  <input
                    id="email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all ${
                    role === 'client' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  }`}
                >
                  {isLogin ? `Sign in as ${role}` : 'Create Account'}
                </button>
              </div>

              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-sm font-medium text-slate-500 hover:text-slate-800"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              {isLogin && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="relative mb-4">
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                      <span className="px-2 bg-white text-slate-400">Demo Access</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => { 
                      setEmail(role === 'client' ? 'rajesh@example.com' : 'ankit@example.com'); 
                      setPassword('password'); 
                    }}
                    className="w-full text-xs py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors font-medium"
                  >
                    Load {role} Demo Credentials
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
