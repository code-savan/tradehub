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
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus
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
import Sidebar from '../components/layout/Sidebar';
import TradingChart from '../components/charts/TradingChart';

interface OrderType {
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
}

interface TradeSide {
  side: 'buy' | 'sell';
}

export default function TradePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { assets, updatePrices } = useMarketStore();

  const [activeTab, setActiveTab] = useState('trade');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Trade states
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [tradeSide, setTradeSide] = useState<TradeSide['side']>('buy');
  const [orderType, setOrderType] = useState<OrderType['type']>('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 3000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  const currentAsset = assets.find(asset => asset.symbol === selectedAsset) || assets[0];

  const handleTrade = () => {
    if (!amount || (orderType !== 'market' && !price)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const orderData = {
      asset: selectedAsset,
      side: tradeSide,
      type: orderType,
      amount: parseFloat(amount),
      price: orderType === 'market' ? currentAsset.price : parseFloat(price),
      stopPrice: orderType.includes('stop') ? parseFloat(stopPrice) : undefined,
    };

    // Simulate order execution
    toast.success(`${tradeSide === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`);
    
    // Reset form
    setAmount('');
    setPrice('');
    setStopPrice('');
  };

  const calculateTotal = () => {
    if (!amount) return 0;
    const orderPrice = orderType === 'market' ? currentAsset.price : parseFloat(price) || 0;
    return parseFloat(amount) * orderPrice;
  };

  const filteredAssets = assets.filter(asset => 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">Trade</h2>
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
            </div>
          </div>
        </header>

        {/* Trade Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart & Asset Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trading Chart */}
              <TradingChart />

              {/* Asset Selection */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Select Asset</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredAssets.slice(0, 9).map((asset) => (
                      <button
                        key={asset.symbol}
                        onClick={() => setSelectedAsset(asset.symbol)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedAsset === asset.symbol
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{asset.symbol}</span>
                          <Badge variant={asset.change24h >= 0 ? "default" : "destructive"}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">${asset.price.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Trading Panel */}
            <div className="space-y-6">
              {/* Current Asset Info */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{selectedAsset}</h3>
                      <p className="text-gray-400">{currentAsset?.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${currentAsset?.price.toLocaleString()}</div>
                      <Badge variant={currentAsset?.change24h >= 0 ? "default" : "destructive"}>
                        {currentAsset?.change24h >= 0 ? '+' : ''}{currentAsset?.change24h.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">24h High</p>
                      <p className="font-medium">${currentAsset?.high24h.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">24h Low</p>
                      <p className="font-medium">${currentAsset?.low24h.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Volume</p>
                      <p className="font-medium">{currentAsset?.volume}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Market Cap</p>
                      <p className="font-medium">{currentAsset?.marketCap}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Form */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Place Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Buy/Sell Tabs */}
                  <Tabs value={tradeSide} onValueChange={(value) => setTradeSide(value as TradeSide['side'])}>
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="buy" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                        Buy
                      </TabsTrigger>
                      <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                        Sell
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Order Type */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Order Type</label>
                    <Select value={orderType} onValueChange={(value) => setOrderType(value as OrderType['type'])}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-deep-black border-white/10">
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop</SelectItem>
                        <SelectItem value="stop_limit">Stop Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price (for non-market orders) */}
                  {orderType !== 'market' && (
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Price</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  )}

                  {/* Stop Price (for stop orders) */}
                  {orderType.includes('stop') && (
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Stop Price</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={stopPrice}
                        onChange={(e) => setStopPrice(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  )}

                  {/* Amount */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Amount</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  {/* Total */}
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total</span>
                      <span className="text-xl font-bold">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map((percent) => (
                      <Button
                        key={percent}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const totalValue = 10000; // Simulated balance
                          const orderPrice = orderType === 'market' ? currentAsset.price : parseFloat(price) || currentAsset.price;
                          const calculatedAmount = (totalValue * percent / 100) / orderPrice;
                          setAmount(calculatedAmount.toFixed(6));
                        }}
                        className="bg-white/5 border-white/10 hover:bg-white/10"
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleTrade}
                    className={`w-full ${
                      tradeSide === 'buy' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {tradeSide === 'buy' ? 'Buy' : 'Sell'} {selectedAsset}
                  </Button>
                </CardContent>
              </Card>

              {/* Order Book */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Order Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Sell Orders */}
                    <div className="space-y-1">
                      {[69450, 69445, 69440, 69435, 69430].map((price, index) => (
                        <div key={price} className="flex justify-between text-sm">
                          <span className="text-red-400">${price.toLocaleString()}</span>
                          <span className="text-gray-400">{(Math.random() * 10).toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Current Price */}
                    <div className="flex justify-between py-2 border-y border-white/10">
                      <span className="font-bold">${currentAsset?.price.toLocaleString()}</span>
                      <span className="text-gray-400">67432.85</span>
                    </div>
                    
                    {/* Buy Orders */}
                    <div className="space-y-1">
                      {[69425, 69420, 69415, 69410, 69405].map((price, index) => (
                        <div key={price} className="flex justify-between text-sm">
                          <span className="text-green-400">${price.toLocaleString()}</span>
                          <span className="text-gray-400">{(Math.random() * 10).toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
