import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, History, ChevronRight } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';

export default function PortfolioSection() {
  const { balance, holdings, transactions, totalValue, totalPnl, totalPnlPercent } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState<'holdings' | 'history'>('holdings');

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card-strong rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-neon-aqua/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-neon-aqua" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Total Portfolio Value</p>
            <p className="font-sora font-bold text-2xl text-text-primary">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* PnL */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {totalPnl >= 0 ? (
              <TrendingUp className="w-4 h-4 text-neon-aqua" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`font-mono ${totalPnl >= 0 ? 'text-neon-aqua' : 'text-red-400'}`}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-sm ${totalPnl >= 0 ? 'text-neon-aqua' : 'text-red-400'}`}>
              ({totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%)
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-secondary">Available Balance</p>
            <p className="font-mono text-sm text-text-primary">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab('holdings')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'holdings' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Holdings
          {activeTab === 'holdings' && (
            <motion.div
              layoutId="portfolio-tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-aqua"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'history' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          History
          {activeTab === 'history' && (
            <motion.div
              layoutId="portfolio-tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-aqua"
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'holdings' ? (
            <motion.div
              key="holdings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {holdings.map((holding, i) => (
                <motion.div
                  key={holding.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <span className="font-sora font-semibold text-sm text-text-primary">
                        {holding.symbol[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm">{holding.symbol}</p>
                      <p className="text-xs text-text-secondary">{holding.amount} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-text-primary">
                      ${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs flex items-center justify-end gap-1 ${holding.pnl >= 0 ? 'text-neon-aqua' : 'text-red-400'}`}>
                      {holding.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {transactions.slice(0, 5).map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      tx.type === 'buy' ? 'bg-neon-aqua/10' : 'bg-red-400/10'
                    }`}>
                      <History className={`w-4 h-4 ${tx.type === 'buy' ? 'text-neon-aqua' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm capitalize">
                        {tx.type} {tx.symbol}
                      </p>
                      <p className="text-xs text-text-secondary">{formatTime(tx.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono text-sm ${tx.type === 'buy' ? 'text-red-400' : 'text-neon-aqua'}`}>
                      {tx.type === 'buy' ? '-' : '+'}${tx.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {tx.amount} @ ${tx.price.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All */}
        <button className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
