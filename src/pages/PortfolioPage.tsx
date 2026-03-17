import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Activity,
  Target,
  X,
  LogOut,
  Wallet,
  Search,
  RefreshCw,
  Download,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMarketStore } from '../store/marketStore';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import TradingChart from '../components/charts/TradingChart';
import Sidebar from '../components/layout/Sidebar';
import MobileHeader from '../components/layout/MobileHeader';
import MobileSearchModal from '../components/layout/MobileSearchModal';

// Mock portfolio data
interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  change24h: number;
  changeValue: number;
  profitLoss: number;
  profitLossPercent: number;
  allocation: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

const mockHoldings: Holding[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    quantity: 0.5234,
    avgBuyPrice: 45234.56,
    currentPrice: 67432.85,
    value: 35321.45,
    change24h: 2.34,
    changeValue: 826.53,
    profitLoss: 11798.67,
    profitLossPercent: 49.12,
    allocation: 45.2
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    quantity: 8.765,
    avgBuyPrice: 2845.23,
    currentPrice: 3521.47,
    value: 30873.89,
    change24h: -1.12,
    changeValue: -346.18,
    profitLoss: 5929.89,
    profitLossPercent: 23.78,
    allocation: 39.4
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    quantity: 125.43,
    avgBuyPrice: 98.45,
    currentPrice: 148.32,
    value: 18603.67,
    change24h: 5.67,
    changeValue: 998.23,
    profitLoss: 6252.34,
    profitLossPercent: 50.61,
    allocation: 23.8
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    quantity: 15.23,
    avgBuyPrice: 523.67,
    currentPrice: 612.18,
    value: 9321.45,
    change24h: 0.85,
    changeValue: 78.23,
    profitLoss: 1347.89,
    profitLossPercent: 16.92,
    allocation: 11.9
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    quantity: 2500,
    avgBuyPrice: 0.382,
    currentPrice: 0.4582,
    value: 1145.50,
    change24h: 1.23,
    changeValue: 13.89,
    profitLoss: 190.50,
    profitLossPercent: 19.95,
    allocation: 1.5
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    symbol: 'BTC',
    quantity: 0.1234,
    price: 65234.56,
    total: 8045.67,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '2',
    type: 'sell',
    symbol: 'ETH',
    quantity: 2.5,
    price: 3456.78,
    total: 8641.95,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '3',
    type: 'buy',
    symbol: 'SOL',
    quantity: 50,
    price: 142.34,
    total: 7117.00,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '4',
    type: 'buy',
    symbol: 'BNB',
    quantity: 5,
    price: 598.45,
    total: 2992.25,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: 'pending'
  }
];

export default function PortfolioPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { assets, updatePrices } = useMarketStore();

  const [activeTab, setActiveTab] = useState('portfolio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [holdings, setHoldings] = useState<Holding[]>(mockHoldings);
  const [transactions] = useState<Transaction[]>(mockTransactions);

  // Calculate portfolio totals
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalProfitLoss = holdings.reduce((sum, holding) => sum + holding.profitLoss, 0);
  const totalProfitLossPercent = (totalProfitLoss / (totalValue - totalProfitLoss)) * 100;

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
      // Update holdings with new prices
      setHoldings(prev => prev.map(holding => {
        const currentAsset = assets.find(asset => asset.symbol === holding.symbol);
        if (currentAsset) {
          const newValue = holding.quantity * currentAsset.price;
          const newProfitLoss = newValue - (holding.quantity * holding.avgBuyPrice);
          return {
            ...holding,
            currentPrice: currentAsset.price,
            value: newValue,
            change24h: currentAsset.change24h,
            changeValue: newValue * (currentAsset.change24h / 100),
            profitLoss: newProfitLoss,
            profitLossPercent: (newProfitLoss / (holding.quantity * holding.avgBuyPrice)) * 100
          };
        }
        return holding;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [updatePrices, assets]);

  const filteredHoldings = holdings.filter(holding =>
    holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    holding.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportPortfolio = () => {
    toast.success('Portfolio data exported successfully');
  };

  const refreshData = () => {
    updatePrices();
    toast.success('Portfolio data refreshed');
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
        pageIcon={Wallet}
        pageTitle="TradeHub"
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Mobile Header */}
        <MobileHeader
          title="Portfolio"
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
          showNotifications={true}
          onNotificationsClick={() => setShowNotifications(!showNotifications)}
          notificationCount={2}
        />

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-deep-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold">Portfolio</h2>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search holdings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 w-64"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                className="border-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportPortfolio}
                className="border-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

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
                  onClick={() => {
                    logout();
                    navigate('/');
                    toast.success('Logged out successfully');
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Portfolio Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Trading Chart */}
            <TradingChart />

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Value</p>
                      <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total P&L</p>
                      <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${totalProfitLoss.toLocaleString()}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      totalProfitLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {totalProfitLoss >= 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Return %</p>
                      <p className={`text-2xl font-bold ${totalProfitLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      totalProfitLossPercent >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Holdings</p>
                      <p className="text-2xl font-bold">{holdings.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="holdings" className="space-y-6">
              <TabsList className="bg-white/5 border-white/10">
                <TabsTrigger value="holdings" className="data-[state=active]:bg-blue-500/20">
                  Holdings
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-500/20">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20">
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Holdings Tab */}
              <TabsContent value="holdings" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Your Holdings</span>
                      <Badge variant="outline" className="border-white/20">
                        {filteredHoldings.length} assets
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 font-medium text-gray-400">Asset</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">Quantity</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">Avg Buy Price</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">Current Price</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">Value</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">24h Change</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">P&L</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">Allocation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredHoldings.map((holding) => (
                            <tr
                              key={holding.symbol}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold">{holding.symbol.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{holding.symbol}</div>
                                    <div className="text-sm text-gray-400">{holding.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-4 px-4 font-mono">
                                {holding.quantity.toLocaleString()}
                              </td>
                              <td className="text-right py-4 px-4 font-mono">
                                ${holding.avgBuyPrice.toLocaleString()}
                              </td>
                              <td className="text-right py-4 px-4 font-mono">
                                ${holding.currentPrice.toLocaleString()}
                              </td>
                              <td className="text-right py-4 px-4 font-mono">
                                ${holding.value.toLocaleString()}
                              </td>
                              <td className="text-right py-4 px-4">
                                <div className={`flex items-center justify-end gap-1 ${
                                  holding.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {holding.change24h >= 0 ? (
                                    <ArrowUpRight className="w-4 h-4" />
                                  ) : (
                                    <ArrowDownRight className="w-4 h-4" />
                                  )}
                                  <span className="font-mono">
                                    {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(2)}%
                                  </span>
                                </div>
                              </td>
                              <td className="text-right py-4 px-4">
                                <div className={`font-mono ${
                                  holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  <div>
                                    {holding.profitLoss >= 0 ? '+' : ''}${holding.profitLoss.toLocaleString()}
                                  </div>
                                  <div className="text-sm">
                                    ({holding.profitLossPercent >= 0 ? '+' : ''}{holding.profitLossPercent.toFixed(2)}%)
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-16">
                                    <Progress
                                      value={holding.allocation}
                                      className="h-2 bg-white/10"
                                    />
                                  </div>
                                  <span className="text-sm text-gray-400">
                                    {holding.allocation.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Transaction History</span>
                      <Badge variant="outline" className="border-white/20">
                        {transactions.length} transactions
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 font-medium text-gray-400">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-400">Asset</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">Quantity</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">Price</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-400">Total</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-400">Time</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction) => (
                            <tr
                              key={transaction.id}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <Badge
                                  variant={transaction.type === 'buy' ? 'default' : 'secondary'}
                                  className={transaction.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                                >
                                  {transaction.type.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold">{transaction.symbol.charAt(0)}</span>
                                  </div>
                                  <span className="font-medium">{transaction.symbol}</span>
                                </div>
                              </td>
                              <td className="text-right py-4 px-4 font-mono">
                                {transaction.quantity.toLocaleString()}
                              </td>
                              <td className="text-right py-4 px-4 font-mono">
                                ${transaction.price.toLocaleString()}
                              </td>
                              <td className="text-right py-4 px-4 font-mono">
                                ${transaction.total.toLocaleString()}
                              </td>
                              <td className="py-4 px-4 text-gray-400">
                                {new Date(transaction.timestamp).toLocaleString()}
                              </td>
                              <td className="text-center py-4 px-4">
                                <Badge
                                  variant="outline"
                                  className={
                                    transaction.status === 'completed'
                                      ? 'border-green-400 text-green-400'
                                      : transaction.status === 'pending'
                                      ? 'border-yellow-400 text-yellow-400'
                                      : 'border-red-400 text-red-400'
                                  }
                                >
                                  {transaction.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Portfolio Allocation */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Portfolio Allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {holdings.map((holding) => (
                          <div key={holding.symbol} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold">{holding.symbol.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-medium">{holding.symbol}</div>
                                <div className="text-sm text-gray-400">${holding.value.toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24">
                                <Progress
                                  value={holding.allocation}
                                  className="h-2 bg-white/10"
                                />
                              </div>
                              <span className="text-sm text-gray-400 w-12 text-right">
                                {holding.allocation.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Best Performer</span>
                          <div className="text-right">
                            <div className="font-medium">SOL</div>
                            <div className="text-sm text-green-400">+50.61%</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Worst Performer</span>
                          <div className="text-right">
                            <div className="font-medium">BNB</div>
                            <div className="text-sm text-green-400">+16.92%</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Largest Holding</span>
                          <div className="text-right">
                            <div className="font-medium">BTC</div>
                            <div className="text-sm text-gray-400">45.2%</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Number of Trades</span>
                          <div className="text-right">
                            <div className="font-medium">127</div>
                            <div className="text-sm text-gray-400">Last 30 days</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Win Rate</span>
                          <div className="text-right">
                            <div className="font-medium">68.5%</div>
                            <div className="text-sm text-gray-400">87 wins / 40 losses</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Asset Performance Chart */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Asset Performance
                      </span>
                      <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                        <SelectTrigger className="w-32 bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-deep-black border-white/10">
                          <SelectItem value="24h">24h</SelectItem>
                          <SelectItem value="7d">7d</SelectItem>
                          <SelectItem value="30d">30d</SelectItem>
                          <SelectItem value="90d">90d</SelectItem>
                          <SelectItem value="1y">1y</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Performance chart would be rendered here</p>
                        <p className="text-sm">Integrate with charting library for detailed analytics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                      <Wallet className="w-6 h-6" />
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

                <div className="p-4 border-t border-white/10 mt-auto">
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
                    onClick={() => {
                      logout();
                      navigate('/');
                      toast.success('Logged out successfully');
                    }}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Modal */}
      <MobileSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        placeholder="Search holdings..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
    </div>
  );
}
