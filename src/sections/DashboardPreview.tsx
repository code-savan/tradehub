import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCw, Activity } from 'lucide-react';

// Mock chart component
function MiniChart({ isPositive = true }: { isPositive?: boolean }) {
  const points = isPositive 
    ? [30, 45, 35, 55, 48, 65, 58, 75, 70, 85]
    : [85, 70, 75, 58, 65, 48, 55, 35, 45, 30];
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 10} ${100 - p}`).join(' ');
  
  return (
    <svg viewBox="0 0 90 100" className="w-full h-16">
      <defs>
        <linearGradient id={`gradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isPositive ? '#4DFFCE' : '#ef4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isPositive ? '#4DFFCE' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L 90 100 L 0 100 Z`}
        fill={`url(#gradient-${isPositive})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={isPositive ? '#4DFFCE' : '#ef4444'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  const cardY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const cardRotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const assets = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67432.85, change: 2.34, isPositive: true },
    { symbol: 'ETH', name: 'Ethereum', price: 3521.47, change: -1.12, isPositive: false },
    { symbol: 'SOL', name: 'Solana', price: 148.32, change: 5.67, isPositive: true },
  ];

  return (
    <section
      ref={sectionRef}
      id="dashboard"
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/dashboard_city_bg.jpg"
          alt="City background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 vignette-overlay" />
        <div className="absolute inset-0 bg-deep-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{
            y: cardY,
            rotateX: cardRotateX,
            scale: cardScale,
            opacity: cardOpacity,
          }}
          className="perspective-1100"
        >
          {/* Glass Dashboard Card */}
          <div className="glass-card-strong rounded-3xl p-6 sm:p-8 preserve-3d">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-aqua/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-neon-aqua" />
                </div>
                <div>
                  <h3 className="font-sora font-semibold text-lg text-text-primary">Dashboard</h3>
                  <p className="text-xs text-text-secondary">Portfolio Overview</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-aqua/10 border border-neon-aqua/20">
                <span className="w-2 h-2 rounded-full bg-neon-aqua animate-pulse" />
                <span className="text-xs font-mono text-neon-aqua uppercase tracking-wider">Live</span>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Balance & Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Balance Card */}
                <div className="glass-subtle rounded-2xl p-5">
                  <p className="text-sm text-text-secondary mb-2">Total Balance</p>
                  <div className="font-sora font-bold text-3xl text-text-primary mb-3">
                    $124,893.40
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-neon-aqua" />
                    <span className="text-sm text-neon-aqua">+2.4%</span>
                    <span className="text-xs text-text-secondary">this week</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: ArrowDownRight, label: 'Deposit' },
                    { icon: ArrowUpRight, label: 'Withdraw' },
                    { icon: RefreshCw, label: 'Convert' },
                  ].map((action, i) => (
                    <button
                      key={i}
                      className="glass-subtle rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors"
                    >
                      <action.icon className="w-5 h-5 text-text-secondary" />
                      <span className="text-xs text-text-secondary">{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Portfolio Distribution */}
                <div className="glass-subtle rounded-2xl p-5">
                  <p className="text-sm text-text-secondary mb-4">Distribution</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Bitcoin', value: 45, color: '#4DFFCE' },
                      { label: 'Ethereum', value: 30, color: '#627EEA' },
                      { label: 'Others', value: 25, color: '#A7B0C8' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-text-secondary">{item.label}</span>
                            <span className="text-text-primary">{item.value}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${item.value}%`, backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Chart & Assets */}
              <div className="lg:col-span-2 space-y-6">
                {/* Chart Area */}
                <div className="glass-subtle rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-text-secondary">Portfolio Performance</p>
                      <p className="font-sora font-semibold text-xl text-text-primary">+18.42%</p>
                    </div>
                    <div className="flex gap-2">
                      {['1D', '1W', '1M', '1Y'].map((period, i) => (
                        <button
                          key={period}
                          className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                            i === 1
                              ? 'bg-neon-aqua/20 text-neon-aqua'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-40 flex items-end gap-1">
                    {Array.from({ length: 30 }, (_, i) => {
                      const height = 30 + Math.random() * 60;
                      const isPositive = height > 50;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                          style={{
                            height: `${height}%`,
                            background: isPositive
                              ? 'linear-gradient(180deg, rgba(77,255,206,0.6) 0%, rgba(77,255,206,0.1) 100%)'
                              : 'linear-gradient(180deg, rgba(239,68,68,0.6) 0%, rgba(239,68,68,0.1) 100%)',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Assets List */}
                <div className="glass-subtle rounded-2xl p-5">
                  <p className="text-sm text-text-secondary mb-4">Top Assets</p>
                  <div className="space-y-3">
                    {assets.map((asset, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-mono text-sm text-text-primary">
                            {asset.symbol[0]}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{asset.symbol}</p>
                            <p className="text-xs text-text-secondary">{asset.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <MiniChart isPositive={asset.isPositive} />
                          <div className="text-right min-w-[100px]">
                            <p className="font-mono text-text-primary">
                              ${asset.price.toLocaleString()}
                            </p>
                            <p className={`text-xs flex items-center justify-end gap-1 ${asset.isPositive ? 'text-neon-aqua' : 'text-red-400'}`}>
                              {asset.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {Math.abs(asset.change)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-text-secondary">Updates every 2 seconds</p>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Syncing...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
