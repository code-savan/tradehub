import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { usePortfolioStore } from '../store/portfolioStore';
import { toast } from 'sonner';

export default function TradePanel() {
  const { assets, selectedAsset } = useMarketStore();
  const { executeTrade, balance } = usePortfolioStore();
  
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAsset = assets.find((a) => a.symbol === selectedAsset) || assets[0];
  const estimatedTotal = parseFloat(amount || '0') * currentAsset.price;
  const canExecute = tradeType === 'buy' ? estimatedTotal <= balance : parseFloat(amount || '0') > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (tradeType === 'buy' && estimatedTotal > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    executeTrade(
      tradeType,
      currentAsset.symbol,
      parseFloat(amount),
      orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : currentAsset.price
    );
    
    toast.success(`${tradeType === 'buy' ? 'Buy' : 'Sell'} order executed for ${amount} ${currentAsset.symbol}`);
    setAmount('');
    setLimitPrice('');
    setIsSubmitting(false);
  };

  const quickAmounts = ['25%', '50%', '75%', '100%'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card-strong rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-white/5">
        <h3 className="font-sora font-semibold text-lg text-text-primary">Trade</h3>
        <p className="text-sm text-text-secondary">
          {currentAsset.symbol} @ ${currentAsset.price.toLocaleString()}
        </p>
      </div>

      {/* Buy/Sell Toggle */}
      <div className="p-4">
        <div className="flex rounded-xl bg-white/5 p-1 mb-4">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
              tradeType === 'buy'
                ? 'bg-neon-aqua text-deep-black'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Buy
            </span>
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
              tradeType === 'sell'
                ? 'bg-red-400 text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowDownRight className="w-4 h-4" />
              Sell
            </span>
          </button>
        </div>

        {/* Order Type */}
        <div className="flex gap-2 mb-4">
          {(['market', 'limit'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                orderType === type
                  ? 'bg-white/10 text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm text-text-secondary mb-2">
              Amount ({currentAsset.symbol})
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.0001"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-text-primary placeholder:text-text-secondary/50 focus:border-neon-aqua focus:ring-1 focus:ring-neon-aqua/30 transition-all outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
                {currentAsset.symbol}
              </span>
            </div>
          </div>

          {/* Limit Price (if limit order) */}
          {orderType === 'limit' && (
            <div className="mb-4">
              <label className="block text-sm text-text-secondary mb-2">Limit Price (USD)</label>
              <div className="relative">
                <input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder={currentAsset.price.toString()}
                  step="0.01"
                  min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-text-primary placeholder:text-text-secondary/50 focus:border-neon-aqua focus:ring-1 focus:ring-neon-aqua/30 transition-all outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
                  USD
                </span>
              </div>
            </div>
          )}

          {/* Quick Amounts */}
          <div className="flex gap-2 mb-4">
            {quickAmounts.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => {
                  if (tradeType === 'buy') {
                    const maxAmount = balance / currentAsset.price;
                    const percentage = parseInt(pct) / 100;
                    setAmount((maxAmount * percentage).toFixed(4));
                  } else {
                    // For sell, would need holdings data
                    setAmount('1');
                  }
                }}
                className="flex-1 py-2 rounded-lg bg-white/5 text-xs text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all"
              >
                {pct}
              </button>
            ))}
          </div>

          {/* Estimated Total */}
          <div className="flex items-center justify-between py-3 border-t border-white/5 mb-4">
            <span className="text-sm text-text-secondary">Estimated Total</span>
            <span className="font-mono text-text-primary">
              ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Fee Info */}
          <div className="flex items-center gap-2 mb-4 text-xs text-text-secondary">
            <Info className="w-4 h-4" />
            <span>Trading fee: 0.1% (included)</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canExecute || isSubmitting || !amount}
            className={`w-full py-4 rounded-xl font-medium text-deep-black transition-all ${
              tradeType === 'buy'
                ? 'bg-neon-aqua hover:shadow-neon-strong'
                : 'bg-red-400 hover:shadow-lg hover:shadow-red-400/30'
            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-deep-black/30 border-t-deep-black rounded-full animate-spin" />
            ) : (
              <>
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {currentAsset.symbol}
                <ArrowUpRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Balance Info */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Available Balance</span>
            <span className="font-mono text-text-primary">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
