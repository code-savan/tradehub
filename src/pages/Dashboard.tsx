import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Bell,
  Search
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useMarketStore } from '../store/marketStore';

import Sidebar from '../components/layout/Sidebar';
import MobileSearchModal from '../components/layout/MobileSearchModal';
import TradingChart from '../components/charts/TradingChart';
import MarketOverview from '../components/MarketOverview';
import PortfolioSection from '../components/PortfolioSection';
import TradePanel from '../components/TradePanel';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { updatePrices } = useMarketStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 3000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  const notifications = [
    { id: 1, title: 'Price Alert', message: 'BTC reached $67,500', time: '2 min ago', unread: true },
    { id: 2, title: 'Trade Executed', message: 'Buy order filled for 0.5 ETH', time: '15 min ago', unread: true },
    { id: 3, title: 'System', message: 'Welcome to TradeFlow Pro', time: '1 hour ago', unread: false },
  ];

  return (
    <div className="flex h-screen bg-deep-black text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageIcon={TrendingUp}
        pageTitle="TradeFlow"
      />
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-deep-navy/50 backdrop-blur-xl border-b border-white/5 items-center justify-between px-6 sticky top-0 z-30">
          {/* Left - Search */}
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
            <Search className="w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search assets..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary/50 outline-none w-48"
            />
          </div>

          {/* Right - Notifications & User */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-neon-aqua rounded-full" />
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 glass-card-strong rounded-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-sora font-semibold text-text-primary">Notifications</h3>
                      <button className="text-xs text-neon-aqua">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                            notif.unread ? 'bg-neon-aqua/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.unread ? 'bg-neon-aqua' : 'bg-text-secondary/30'}`} />
                            <div className="flex-1">
                              <p className="font-medium text-text-primary text-sm">{notif.title}</p>
                              <p className="text-xs text-text-secondary mt-0.5">{notif.message}</p>
                              <p className="text-xs text-text-secondary/60 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar (mobile) */}
            <div className="lg:hidden w-9 h-9 rounded-full bg-gradient-to-br from-neon-aqua/30 to-neon-aqua/10 flex items-center justify-center">
              <span className="font-sora font-semibold text-sm text-neon-aqua">
                {user?.name?.[0] || 'D'}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6">
          {/* Welcome */}
          <div className="mb-6">
            <h1 className="font-sora font-bold text-2xl lg:text-3xl text-text-primary mb-1">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Trader'}
            </h1>
            <p className="text-text-secondary">Here's what's happening in the markets today.</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="xl:col-span-2 space-y-6">
              <TradingChart />
              <MarketOverview />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <TradePanel />
              <PortfolioSection />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Search Modal */}
      <MobileSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        placeholder="Search assets..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
