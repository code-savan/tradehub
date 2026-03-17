import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  ArrowUpRight,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMarketStore } from '../store/marketStore';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import TradingChart from '../components/charts/TradingChart';
import Sidebar from '../components/layout/Sidebar';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const categories = ['All', 'Cryptocurrency', 'Stocks', 'Forex', 'Commodities'];
const sortOptions = [
  { value: 'marketCap', label: 'Market Cap' },
  { value: 'price', label: 'Price' },
  { value: 'change24h', label: '24h Change' },
  { value: 'volume', label: 'Volume' },
];

export default function MarketsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { assets, updatePrices, setSelectedAsset } = useMarketStore();

  const [activeTab, setActiveTab] = useState('markets');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('marketCap');
  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'ETH']);

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 5000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  // Filter and sort assets
  const filteredAssets = assets
    .filter(asset => {
      const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'marketCap': {
          const aCap = parseFloat(a.marketCap.replace(/[^0-9.]/g, '')) || 0;
          const bCap = parseFloat(b.marketCap.replace(/[^0-9.]/g, '')) || 0;
          return bCap - aCap;
        }
        case 'price':
          return b.price - a.price;
        case 'change24h':
          return b.change24h - a.change24h;
        case 'volume': {
          const aVol = parseFloat(a.volume.replace(/[^0-9.]/g, '')) || 0;
          const bVol = parseFloat(b.volume.replace(/[^0-9.]/g, '')) || 0;
          return bVol - aVol;
        }
        default:
          return 0;
      }
    });

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );

    toast.success(
      watchlist.includes(symbol)
        ? `${symbol} removed from watchlist`
        : `${symbol} added to watchlist`
    );
  };

  const handleAssetClick = (symbol: string) => {
    setSelectedAsset(symbol);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

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
        pageTitle="TradeHub"
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-deep-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold">Markets</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 w-64"
                />
              </div>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Markets Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Trading Chart */}
            <TradingChart />

            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Market Cap</p>
                      <p className="text-2xl font-bold">$2.1T</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">24h Volume</p>
                      <p className="text-2xl font-bold">$89.4B</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">BTC Dominance</p>
                      <p className="text-2xl font-bold">52.3%</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Assets</p>
                      <p className="text-2xl font-bold">{assets.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Filter className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-blue-500 hover:bg-blue-600" : "border-white/20"}
                  >
                    {category}
                    {category !== 'All' && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {assets.filter(asset => asset.category === category).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-deep-black border-white/10">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assets Table */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Market Overview</span>
                  <Badge variant="outline" className="border-white/20">
                    {filteredAssets.length} assets
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-medium text-gray-400">Asset</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-400">Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-400">24h Change</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-400">Market Cap</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-400">Volume</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-400">24h Range</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr
                          key={asset.symbol}
                          className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => handleAssetClick(asset.symbol)}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold">{asset.symbol.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-medium">{asset.symbol}</div>
                                <div className="text-sm text-gray-400">{asset.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-4 px-4">
                            <span className="font-mono">
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                            </span>
                          </td>
                          <td className="text-right py-4 px-4 text-gray-400">
                            {asset.marketCap}
                          </td>
                          <td className="text-right py-4 px-4 text-gray-400">
                            {asset.volume}
                          </td>
                          <td className="text-right py-4 px-4">
                            <div className="text-sm">
                              <div className="text-gray-400">${asset.low24h.toLocaleString()}</div>
                              <div className="text-gray-400">${asset.high24h.toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWatchlist(asset.symbol);
                              }}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  watchlist.includes(asset.symbol)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                }`}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-64 bg-deep-black h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold">TradeHub</h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                          if (item.id === 'dashboard') navigate('/dashboard');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === item.id
                            ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-500'
                            : 'hover:bg-white/5 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
