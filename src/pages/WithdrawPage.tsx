import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Menu,
  ArrowDownRight,
  CreditCard,
  Building,
  Smartphone,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import Sidebar from '../components/layout/Sidebar';

interface WithdrawMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  fee: string;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
}

interface WithdrawHistory {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
  address?: string;
  transactionId?: string;
}

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('withdraw');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form states
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(1);
  const [transactionId, setTransactionId] = useState('');

  const withdrawMethods: WithdrawMethod[] = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building,
      description: 'Transfer to your bank account',
      fee: '2%',
      minAmount: 100,
      maxAmount: 25000,
      processingTime: '1-3 business days'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Withdraw to your card',
      fee: '3%',
      minAmount: 50,
      maxAmount: 5000,
      processingTime: '3-5 business days'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Smartphone,
      description: 'Withdraw to external crypto wallet',
      fee: '0.5%',
      minAmount: 10,
      maxAmount: 100000,
      processingTime: '15-30 minutes'
    }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
    { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' }
  ];

  // Mock withdraw history
  const withdrawHistory: WithdrawHistory[] = [
    {
      id: '1',
      amount: 1500,
      currency: 'USD',
      method: 'Bank Transfer',
      status: 'completed',
      date: '2024-03-15',
      transactionId: 'TXN123456789'
    },
    {
      id: '2',
      amount: 500,
      currency: 'USD',
      method: 'Cryptocurrency',
      status: 'processing',
      date: '2024-03-14',
      transactionId: 'TXN123456788'
    },
    {
      id: '3',
      amount: 200,
      currency: 'USD',
      method: 'Credit/Debit Card',
      status: 'pending',
      date: '2024-03-13',
      transactionId: 'TXN123456787'
    }
  ];

  const selectedWithdrawMethod = withdrawMethods.find(method => method.id === selectedMethod);
  const selectedCurrencyData = currencies.find(curr => curr.code === selectedCurrency);
  const calculatedFee = amount ? (parseFloat(amount) * (parseFloat(selectedWithdrawMethod?.fee.replace('%', '') || '0') / 100)) : 0;
  const totalAmount = amount ? (parseFloat(amount) - calculatedFee) : 0;
  const availableBalance = 10250; // Mock available balance

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) < (selectedWithdrawMethod?.minAmount || 0)) {
      toast.error(`Minimum withdrawal amount is $${selectedWithdrawMethod?.minAmount}`);
      return;
    }

    if (parseFloat(amount) > availableBalance) {
      toast.error(`Insufficient balance. Available: $${availableBalance.toLocaleString()}`);
      return;
    }

    if (parseFloat(amount) > (selectedWithdrawMethod?.maxAmount || 0)) {
      toast.error(`Maximum withdrawal amount is $${selectedWithdrawMethod?.maxAmount}`);
      return;
    }

    if (selectedWithdrawMethod?.id === 'crypto' && !withdrawAddress) {
      toast.error('Please provide a withdrawal address for cryptocurrency withdrawals');
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionId('TX' + Date.now());
      setWithdrawStep(2);
      toast.success('Withdrawal request submitted successfully!');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
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
              <h2 className="text-2xl font-bold">Withdraw Funds</h2>
            </div>
          </div>
        </header>

        {/* Withdraw Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Withdraw Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Overview */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Available Balance</p>
                      <p className="text-2xl font-bold">${availableBalance.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">Ready to withdraw</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Withdrawn</p>
                      <p className="text-2xl font-bold">$3,200.00</p>
                      <p className="text-sm text-gray-400">All time</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Pending Withdrawals</p>
                      <p className="text-2xl font-bold">$500.00</p>
                      <p className="text-sm text-orange-400">1 transaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Withdraw Methods */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Select Withdrawal Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {withdrawMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`p-4 rounded-lg border transition-all ${
                            selectedMethod === method.id
                              ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium">{method.name}</h3>
                              <p className="text-sm text-gray-400 mt-1">{method.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs">
                                <span className="text-gray-400">Fee: {method.fee}</span>
                                <span className="text-gray-400">Min: ${method.minAmount}</span>
                                <span className="text-gray-400">Max: ${method.maxAmount}</span>
                                <span className="text-gray-400">{method.processingTime}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Withdraw Form */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Withdrawal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-deep-black border-white/10">
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Min: ${selectedWithdrawMethod?.minAmount} - Max: ${selectedWithdrawMethod?.maxAmount}
                      </p>
                    </div>
                  </div>

                  {/* Crypto Address (for crypto withdrawals) */}
                  {selectedWithdrawMethod?.id === 'crypto' && (
                    <div>
                      <Label htmlFor="address">Withdrawal Address</Label>
                      <div className="flex gap-2">
                        <Input
                          id="address"
                          placeholder="Enter your crypto wallet address"
                          value={withdrawAddress}
                          onChange={(e) => setWithdrawAddress(e.target.value)}
                          className="flex-1 bg-white/5 border-white/10"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(withdrawAddress)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-3 mt-6">
                    {[100, 500, 1000, 5000].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(value.toString())}
                        className="bg-white/5 border-white/10 hover:bg-white/10"
                      >
                        ${value}
                      </Button>
                    ))}
                  </div>

                  {/* Fee Calculation */}
                  {amount && (
                    <div className="bg-white/5 rounded-lg p-4 space-y-3 mt-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Withdrawal Amount:</span>
                        <span>{selectedCurrencyData?.symbol}{parseFloat(amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Fee ({selectedWithdrawMethod?.fee}):</span>
                        <span>{selectedCurrencyData?.symbol}{calculatedFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-3 border-t border-white/10">
                        <span>You'll Receive:</span>
                        <span className="text-green-400">{selectedCurrencyData?.symbol}{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handleWithdraw}
                      disabled={!amount || isProcessing}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600"
                      size="lg"
                    >
                      {isProcessing ? 'Processing...' : `Withdraw ${selectedCurrencyData?.symbol}${amount || '0.00'}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Withdraw History */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {withdrawHistory.map((withdrawal) => (
                      <div
                        key={withdrawal.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{withdrawal.method}</span>
                            <Badge variant={getStatusBadge(withdrawal.status)}>
                              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(withdrawal.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Amount:</span>
                            <span className="font-medium">
                              {withdrawal.currency} {withdrawal.amount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-medium ${getStatusColor(withdrawal.status)}`}>
                              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {withdrawal.transactionId && (
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <span className="text-gray-400">Transaction ID:</span>
                            <span className="font-mono">{withdrawal.transactionId}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => withdrawal.transactionId && copyToClipboard(withdrawal.transactionId)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        {withdrawal.address && (
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <span className="text-gray-400">Address:</span>
                            <span className="font-mono text-xs break-all">
                              {withdrawal.address}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => withdrawal.address && copyToClipboard(withdrawal.address)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {withdrawStep === 2 && (
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-deep-black border border-white/10 rounded-2xl p-8 max-w-md mx-auto"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Withdrawal Initiated!</h2>
                  <p className="text-gray-400 mb-6">
                    Your withdrawal request has been submitted successfully. Your funds will be processed according to the selected method's timeline.
                  </p>

                  <div className="bg-white/5 rounded-lg p-4 text-left">
                    <h3 className="font-medium mb-3">Transaction Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction ID:</span>
                        <span className="font-mono">{transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span>{selectedCurrencyData?.symbol}{parseFloat(amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Withdrawal Method:</span>
                        <span>{selectedWithdrawMethod?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Time:</span>
                        <span>{selectedWithdrawMethod?.processingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">You'll Receive:</span>
                        <span className="text-green-400">{selectedCurrencyData?.symbol}{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={() => navigate('/portfolio')}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      View Portfolio
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setWithdrawStep(1);
                        setAmount('');
                        setWithdrawAddress('');
                        setTransactionId('');
                      }}
                      className="flex-1 border-white/10 hover:bg-white/10"
                    >
                      Make Another Withdrawal
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>

  );
}
