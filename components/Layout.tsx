
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserRole, UserAccount, Contract } from '../types';
import { LogOut, Menu, X, LayoutDashboard, ChevronLeft, Wallet, Inbox } from 'lucide-react';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
  walletAddress?: string | null;
  onConnectWallet?: () => void;
  currentUser?: UserAccount | null;
  contracts?: Contract[];
}

export const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, walletAddress, onConnectWallet, currentUser, contracts = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/login';
  const isLandingPage = location.pathname === '/';
  const isDashboard = location.pathname === '/client-dashboard' || location.pathname === '/freelancer-dashboard';

  if (isAuthPage || isLandingPage) {
    return <>{children}</>;
  }

  // Calculate inbox count based on role AND specific user name to match dashboard logic
  const inboxCount = userRole === 'client' 
    ? contracts.filter(c => c.status === 'pending' && c.clientName === currentUser?.name).length 
    : contracts.filter(c => c.status === 'invited' && c.freelancerName === currentUser?.name).length;

  const NavLink = ({ to, icon: Icon, label, badgeCount }: { to: string; icon: any; label: string; badgeCount?: number }) => {
    // Logic to determine active state including query params
    const isActive = location.pathname === to.split('?')[0] && 
                     (to.includes('?') ? location.search.includes(to.split('?')[1]) : !location.search.includes('view=inbox'));

    return (
      <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 relative font-medium text-sm ${
          isActive
            ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200 transform scale-105'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <div className="relative flex items-center">
          <Icon size={18} className={isActive ? 'text-blue-600' : 'text-current'} />
          {badgeCount && badgeCount > 0 ? (
            <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                {badgeCount}
            </span>
          ) : null}
        </div>
        <span>{label}</span>
      </Link>
    );
  };

  const userName = currentUser?.name || (userRole === 'client' ? 'Rajesh Gupta' : 'Ankit Verma');
  const userInitials = currentUser?.initials || (userRole === 'client' ? 'RG' : 'AV');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 mr-2">
                <Logo size={36} />
                <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">TrustVault</span>
              </Link>
              
              {!isDashboard && (
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
              )}

              {/* Desktop Nav Links - Centered vertically in the left section */}
              {userRole && (
                <div className="hidden md:flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-100 ml-4">
                  <NavLink 
                    to={userRole === 'client' ? '/client-dashboard' : '/freelancer-dashboard'} 
                    icon={LayoutDashboard} 
                    label="Dashboard" 
                  />
                  <NavLink 
                    to={userRole === 'client' ? '/client-dashboard?view=inbox' : '/freelancer-dashboard?view=inbox'} 
                    icon={Inbox} 
                    label="Inbox"
                    badgeCount={inboxCount}
                  />
                </div>
              )}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              {onConnectWallet && (
                 <div className="border-r border-slate-200 pr-4 mr-2">
                    {walletAddress ? (
                        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 text-sm font-medium cursor-default shadow-sm">
                            <Wallet size={16} />
                            <span>{walletAddress.substring(0,6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                        </div>
                    ) : (
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onConnectWallet();
                            }}
                            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-4 py-2 rounded-full border border-slate-200 transition-all text-sm font-bold shadow-sm"
                        >
                            <Wallet size={16} />
                            <span>Connect Wallet</span>
                        </button>
                    )}
                 </div>
              )}

              <div className="flex items-center space-x-3 pl-2">
                <Link to="/profile" className="flex items-center space-x-3 group cursor-pointer">
                  <div className="text-sm text-right group-hover:opacity-80 transition-opacity hidden lg:block">
                    <p className="font-medium text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-500 capitalize">{userRole}</p>
                  </div>
                  <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-blue-200 transition-all">
                    {userInitials}
                  </div>
                </Link>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 ml-1 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to={userRole === 'client' ? '/client-dashboard' : '/freelancer-dashboard'}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to={userRole === 'client' ? '/client-dashboard?view=inbox' : '/freelancer-dashboard?view=inbox'}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Inbox {inboxCount > 0 && `(${inboxCount})`}
              </Link>
              <button 
                onClick={() => { onConnectWallet && onConnectWallet(); setIsMenuOpen(false); }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              >
                {walletAddress ? `Connected: ${walletAddress}` : 'Connect Wallet'}
              </button>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
