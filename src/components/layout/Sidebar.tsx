import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Settings,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

import { Button } from '../ui/button';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  pageIcon: React.ElementType;
  pageTitle: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  pageIcon: PageIcon,
  pageTitle
}: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (itemId: string) => {
    setActiveTab(itemId);
    if (itemId === 'dashboard') navigate('/dashboard');
    if (itemId === 'markets') navigate('/markets');
    if (itemId === 'portfolio') navigate('/portfolio');
    if (itemId === 'settings') navigate('/settings');
  };

  const handleMobileNavClick = (itemId: string) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
    if (itemId === 'dashboard') navigate('/dashboard');
    if (itemId === 'markets') navigate('/markets');
    if (itemId === 'portfolio') navigate('/portfolio');
    if (itemId === 'settings') navigate('/settings');
  };

  const handleTradeClick = () => {
    navigate('/trade');
  };

  const handleMobileTradeClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/trade');
  };

  const handleDepositClick = () => {
    navigate('/deposit');
  };

  const handleWithdrawClick = () => {
    navigate('/withdraw');
  };

  const handleMobileDepositClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/deposit');
  };

  const handleMobileWithdrawClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/withdraw');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <AnimatePresence>
        <motion.div
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-deep-navy border-r border-white/5 z-40 transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neon-aqua/10 flex items-center justify-center flex-shrink-0">
                  <PageIcon className="w-5 h-5 text-neon-aqua" />
                </div>
                {isSidebarOpen && (
                  <span className="font-sora font-semibold text-text-primary">{pageTitle}</span>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 overflow-y-auto">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? 'bg-neon-aqua/10 text-neon-aqua'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Trading Interface */}
            <div className="p-4 border-t border-white/5">
              <h3 className={`text-sm font-medium text-gray-400 mb-3 ${isSidebarOpen ? '' : 'text-center'}`}>{isSidebarOpen ? 'Trading' : 'T'}</h3>
              <div className="space-y-2">
                <button
                  onClick={handleTradeClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all ${
                    isSidebarOpen ? '' : 'justify-center'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  {isSidebarOpen && <span className="font-medium">Trade</span>}
                </button>
                <button
                  onClick={handleDepositClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all ${
                    isSidebarOpen ? '' : 'justify-center'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  {isSidebarOpen && <span className="font-medium">Deposit</span>}
                </button>
                <button
                  onClick={handleWithdrawClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-all ${
                    isSidebarOpen ? '' : 'justify-center'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  {isSidebarOpen && <span className="font-medium">Withdraw</span>}
                </button>
              </div>
            </div>

            {/* User & Logout */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-aqua/30 to-neon-aqua/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-sora font-semibold text-neon-aqua">
                    {user?.name?.[0] || 'J'}
                  </span>
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm truncate">{user?.name || 'John'}</p>
                    <p className="text-xs text-text-secondary truncate">{user?.email || 'demo@trade.com'}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-all ${
                  isSidebarOpen ? 'w-full' : 'w-12 justify-center'
                }`}
              >
                <LogOut className="w-5 h-5" />
                {isSidebarOpen && <span className="font-medium">Logout</span>}
              </button>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-neon-aqua text-deep-black flex items-center justify-center shadow-neon"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isSidebarOpen ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </motion.div>
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed top-0 left-0 w-64 bg-deep-black/50 backdrop-blur-xl border-r border-white/10 h-screen z-10"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <PageIcon className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold">{pageTitle}</h1>
              </div>

              <nav className="space-y-2 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Trading Interface */}
              <div className="p-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Trading</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleMobileTradeClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Trade</span>
                  </button>
                  <button
                    onClick={handleMobileDepositClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="font-medium">Deposit</span>
                  </button>
                  <button
                    onClick={handleMobileWithdrawClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-all"
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span className="font-medium">Withdraw</span>
                  </button>
                </div>
              </div>

              {/* User & Logout */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{user?.name || 'John'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || 'demo@trade.com'}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
