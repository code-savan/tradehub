import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Maximize2, MoreHorizontal } from 'lucide-react';
import { useMarketStore } from '../../store/marketStore';

// Generate mock candlestick data
function generateCandleData(count: number, basePrice: number) {
  const data = [];
  let price = basePrice;
  const now = new Date();
  
  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const volatility = price * 0.002;
    const change = (Math.random() - 0.5) * volatility;
    
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
    
    price = close;
  }
  
  return data;
}

export default function TradingChart() {
  const { assets, selectedAsset, setSelectedAsset } = useMarketStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeframe, setTimeframe] = useState('1H');
  const [candleData, setCandleData] = useState<any[]>([]);
  
  const currentAsset = assets.find((a) => a.symbol === selectedAsset) || assets[0];
  
  // Generate initial data
  useEffect(() => {
    setCandleData(generateCandleData(60, currentAsset.price));
  }, [selectedAsset, currentAsset.price]);
  
  // Update data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCandleData((prev) => {
        const lastCandle = prev[prev.length - 1];
        const volatility = currentAsset.price * 0.002;
        const change = (Math.random() - 0.5) * volatility;
        
        const newClose = lastCandle.close + change;
        const newHigh = Math.max(lastCandle.high, newClose);
        const newLow = Math.min(lastCandle.low, newClose);
        
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...lastCandle,
          close: parseFloat(newClose.toFixed(2)),
          high: parseFloat(newHigh.toFixed(2)),
          low: parseFloat(newLow.toFixed(2)),
        };
        
        return updated;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [currentAsset.price]);
  
  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candleData.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 60, bottom: 30, left: 10 };
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate scales
    const prices = candleData.flatMap((d) => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const candleWidth = (chartWidth / candleData.length) * 0.7;
    const candleSpacing = chartWidth / candleData.length;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(244, 246, 255, 0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Price labels
      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = '#A7B0C8';
      ctx.font = '10px IBM Plex Mono';
      ctx.textAlign = 'left';
      ctx.fillText(price.toFixed(currentAsset.price < 10 ? 4 : 2), width - padding.right + 8, y + 3);
    }
    
    // Draw candles
    candleData.forEach((candle, i) => {
      const x = padding.left + i * candleSpacing + candleSpacing / 2;
      const isGreen = candle.close >= candle.open;
      
      const yOpen = padding.top + ((maxPrice - candle.open) / priceRange) * chartHeight;
      const yClose = padding.top + ((maxPrice - candle.close) / priceRange) * chartHeight;
      const yHigh = padding.top + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const yLow = padding.top + ((maxPrice - candle.low) / priceRange) * chartHeight;
      
      // Wick
      ctx.strokeStyle = isGreen ? '#4DFFCE' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();
      
      // Body
      ctx.fillStyle = isGreen ? '#4DFFCE' : '#ef4444';
      const bodyHeight = Math.max(1, Math.abs(yClose - yOpen));
      const bodyY = Math.min(yOpen, yClose);
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
    });
    
    // Draw time labels (every 10th candle)
    ctx.fillStyle = '#A7B0C8';
    ctx.font = '10px IBM Plex Mono';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < candleData.length; i += 10) {
      const x = padding.left + i * candleSpacing + candleSpacing / 2;
      ctx.fillText(candleData[i].time, x, height - 10);
    }
  }, [candleData, currentAsset.price]);

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card-strong rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Asset Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <span className="font-sora font-bold text-lg text-text-primary">
                {currentAsset.symbol[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sora font-semibold text-lg text-text-primary">
                  {currentAsset.symbol}
                </h3>
                <span className="text-sm text-text-secondary">{currentAsset.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl text-text-primary">
                  ${currentAsset.price.toLocaleString()}
                </span>
                <span className={`flex items-center gap-1 text-sm ${currentAsset.change24h >= 0 ? 'text-neon-aqua' : 'text-red-400'}`}>
                  {currentAsset.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {currentAsset.change24h > 0 ? '+' : ''}{currentAsset.change24h}%
                </span>
              </div>
            </div>
          </div>

          {/* Timeframes */}
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-neon-aqua/20 text-neon-aqua'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-all">
              <Maximize2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-all">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Asset Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {assets.map((asset) => (
            <button
              key={asset.symbol}
              onClick={() => setSelectedAsset(asset.symbol)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedAsset === asset.symbol
                  ? 'bg-neon-aqua/10 border border-neon-aqua/30'
                  : 'bg-white/5 border border-transparent hover:bg-white/10'
              }`}
            >
              <span className="font-mono text-sm text-text-primary">{asset.symbol}</span>
              <span className={`text-xs ${asset.change24h >= 0 ? 'text-neon-aqua' : 'text-red-400'}`}>
                {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-80 lg:h-96">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Stats Overlay */}
        <div className="absolute top-4 left-4 flex gap-6">
          <div>
            <p className="text-xs text-text-secondary mb-1">24h High</p>
            <p className="font-mono text-sm text-text-primary">${currentAsset.high24h.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">24h Low</p>
            <p className="font-mono text-sm text-text-primary">${currentAsset.low24h.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">Volume</p>
            <p className="font-mono text-sm text-text-primary">{currentAsset.volume}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
