import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Menu,
  CreditCard,
  Building,
  Smartphone,
  QrCode,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import Sidebar from '../components/layout/Sidebar';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  fee: string;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
}

export default function DepositPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('deposit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form states
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositStep, setDepositStep] = useState(1);
  const [transactionId, setTransactionId] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building,
      description: 'Direct bank transfer from your account',
      fee: '0%',
      minAmount: 100,
      maxAmount: 50000,
      processingTime: '1-3 business days'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Instant deposit with your card',
      fee: '2.5%',
      minAmount: 50,
      maxAmount: 10000,
      processingTime: 'Instant'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Smartphone,
      description: 'Deposit with various cryptocurrencies',
      fee: '0.1%',
      minAmount: 10,
      maxAmount: 100000,
      processingTime: '15-30 minutes'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: QrCode,
      description: 'Scan QR code with your mobile app',
      fee: '1%',
      minAmount: 20,
      maxAmount: 5000,
      processingTime: 'Instant'
    }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
    { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' }
  ];

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const selectedCurrencyData = currencies.find(curr => curr.code === selectedCurrency);
  const calculatedFee = amount ? (parseFloat(amount) * (parseFloat(selectedPaymentMethod?.fee.replace('%', '') || '0') / 100)) : 0;
  const totalAmount = amount ? (parseFloat(amount) - calculatedFee) : 0;

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < (selectedPaymentMethod?.minAmount || 0)) {
      toast.error(`Minimum deposit amount is $${selectedPaymentMethod?.minAmount}`);
      return;
    }

    if (parseFloat(amount) > (selectedPaymentMethod?.maxAmount || 0)) {
      toast.error(`Maximum deposit amount is $${selectedPaymentMethod?.maxAmount}`);
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionId('TX' + Date.now());
      setDepositStep(2);
      toast.success('Deposit request submitted successfully!');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const generateDepositAddress = () => {
    return '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8';
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
              <h2 className="text-2xl font-bold">Deposit Funds</h2>
            </div>
          </div>
        </header>

        {/* Deposit Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {depositStep === 1 ? (
              <div className="space-y-6">
                {/* Balance Overview */}
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Current Balance</p>
                        <p className="text-2xl font-bold">$10,250.00</p>
                        <p className="text-sm text-green-400">+12.5% this month</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Deposited</p>
                        <p className="text-2xl font-bold">$25,000.00</p>
                        <p className="text-sm text-gray-400">All time</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Pending Deposits</p>
                        <p className="text-2xl font-bold">$500.00</p>
                        <p className="text-sm text-orange-400">2 transactions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => {
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

                {/* Deposit Form */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle>Deposit Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                          Min: ${selectedPaymentMethod?.minAmount} - Max: ${selectedPaymentMethod?.maxAmount}
                        </p>
                      </div>
                    </div>

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
                          <span className="text-gray-400">Deposit Amount:</span>
                          <span>{selectedCurrencyData?.symbol}{parseFloat(amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Processing Fee ({selectedPaymentMethod?.fee}):</span>
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
                        onClick={handleDeposit}
                        disabled={!amount || isProcessing}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600"
                        size="lg"
                      >
                        {isProcessing ? 'Processing...' : `Deposit ${selectedCurrencyData?.symbol}${amount || '0.00'}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Success/Confirmation Step */
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Deposit Initiated!</h2>
                    <p className="text-gray-400 mb-6">
                      Your deposit request has been submitted successfully. Your funds will be available once the payment is processed.
                    </p>

                    <div className="bg-white/5 rounded-lg p-4 text-left max-w-md mx-auto">
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
                          <span className="text-gray-400">Payment Method:</span>
                          <span>{selectedPaymentMethod?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Processing Time:</span>
                          <span>{selectedPaymentMethod?.processingTime}</span>
                        </div>
                      </div>
                    </div>

                    {selectedPaymentMethod?.id === 'crypto' && (
                      <div className="mt-6">
                        <h3 className="font-medium mb-3">Deposit Address</h3>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <code className="font-mono text-sm break-all">
                              {generateDepositAddress()}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(generateDepositAddress())}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

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
                          setDepositStep(1);
                          setAmount('');
                          setTransactionId('');
                        }}
                        className="flex-1 border-white/10 hover:bg-white/10"
                      >
                        Make Another Deposit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Important Notice */}
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-orange-400 mb-1">Important Notice</h3>
                        <p className="text-sm text-gray-300">
                          Please send the exact amount to avoid processing delays. Deposits typically appear in your account within {selectedPaymentMethod?.processingTime}.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
