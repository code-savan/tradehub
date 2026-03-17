import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Star, ArrowUpDown } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';

export default function MarketOverview() {
  const { assets } = useMarketStore();
  const [sortBy, setSortBy] = useState<'price' | 'change'>('change');
  const [favorites, setFavorites] = useState<string[]>(['BTC', 'ETH']);

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const sortedAssets = [...assets].sort((a, b) => {
    if (sortBy === 'price') return b.price - a.price;
    return b.change24h - a.change24h;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card-strong rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-sora font-semibold text-lg text-text-primary">Market Overview</h3>
        <button
          onClick={() => setSortBy(sortBy === 'price' ? 'change' : 'price')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort by {sortBy === 'price' ? 'Price' : 'Change'}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-4 lg:px-6 text-xs text-text-secondary font-medium uppercase tracking-wider">
                Asset
              </th>
              <th className="text-right py-3 px-4 lg:px-6 text-xs text-text-secondary font-medium uppercase tracking-wider">
                Price
              </th>
              <th className="text-right py-3 px-4 lg:px-6 text-xs text-text-secondary font-medium uppercase tracking-wider">
                24h Change
              </th>
              <th className="text-right py-3 px-4 lg:px-6 text-xs text-text-secondary font-medium uppercase tracking-wider hidden sm:table-cell">
                Volume
              </th>
              <th className="text-right py-3 px-4 lg:px-6 text-xs text-text-secondary font-medium uppercase tracking-wider hidden lg:table-cell">
                Market Cap
              </th>
              <th className="text-center py-3 px-4 lg:px-6 text-xs text-text-secondary font-medium uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset, i) => (
              <motion.tr
                key={asset.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-4 px-4 lg:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <span className="font-sora font-semibold text-text-primary">
                        {asset.symbol[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{asset.symbol}</p>
                      <p className="text-xs text-text-secondary">{asset.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 lg:px-6 text-right">
                  <p className="font-mono text-text-primary">
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price < 10 ? 4 : 2 })}
                  </p>
                </td>
                <td className="py-4 px-4 lg:px-6 text-right">
                  <div className={`flex items-center justify-end gap-1 ${asset.change24h >= 0 ? 'text-neon-aqua' : 'text-red-400'}`}>
                    {asset.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-mono">{asset.change24h > 0 ? '+' : ''}{asset.change24h}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 lg:px-6 text-right hidden sm:table-cell">
                  <p className="font-mono text-text-secondary">{asset.volume}</p>
                </td>
                <td className="py-4 px-4 lg:px-6 text-right hidden lg:table-cell">
                  <p className="font-mono text-text-secondary">{asset.marketCap}</p>
                </td>
                <td className="py-4 px-4 lg:px-6 text-center">
                  <button
                    onClick={() => toggleFavorite(asset.symbol)}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.includes(asset.symbol)
                        ? 'text-neon-aqua bg-neon-aqua/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(asset.symbol) ? 'fill-current' : ''}`} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
