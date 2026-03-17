import { create } from 'zustand';

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changeValue: number;
  volume: string;
  marketCap: string;
  high24h: number;
  low24h: number;
  category: string;
}

interface MarketState {
  assets: Asset[];
  selectedAsset: string;
  isLoading: boolean;

  // Actions
  setSelectedAsset: (symbol: string) => void;
  updatePrices: () => void;
}

const INITIAL_ASSETS: Asset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67432.85,
    change24h: 2.34,
    changeValue: 1543.21,
    volume: '$28.4B',
    marketCap: '$1.32T',
    high24h: 68200.00,
    low24h: 65800.00,
    category: 'Cryptocurrency',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3521.47,
    change24h: -1.12,
    changeValue: -39.82,
    volume: '$15.2B',
    marketCap: '$423B',
    high24h: 3600.00,
    low24h: 3480.00,
    category: 'Cryptocurrency',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 148.32,
    change24h: 5.67,
    changeValue: 7.95,
    volume: '$3.8B',
    marketCap: '$68B',
    high24h: 152.00,
    low24h: 140.00,
    category: 'Cryptocurrency',
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: 612.18,
    change24h: 0.85,
    changeValue: 5.15,
    volume: '$1.2B',
    marketCap: '$89B',
    high24h: 618.00,
    low24h: 605.00,
    category: 'Cryptocurrency',
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 0.6234,
    change24h: -2.45,
    changeValue: -0.0156,
    volume: '$892M',
    marketCap: '$34B',
    high24h: 0.6450,
    low24h: 0.6100,
    category: 'Cryptocurrency',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.4582,
    change24h: 1.23,
    changeValue: 0.0056,
    volume: '$456M',
    marketCap: '$16B',
    high24h: 0.4700,
    low24h: 0.4500,
    category: 'Cryptocurrency',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.45,
    change24h: 1.23,
    changeValue: 2.18,
    volume: '$52.3M',
    marketCap: '$2.78T',
    high24h: 182.30,
    low24h: 176.80,
    category: 'Stocks',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.67,
    change24h: -0.45,
    changeValue: -0.64,
    volume: '$28.1M',
    marketCap: '$1.78T',
    high24h: 144.20,
    low24h: 141.50,
    category: 'Stocks',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.23,
    change24h: 0.89,
    changeValue: 3.67,
    volume: '$31.4M',
    marketCap: '$3.09T',
    high24h: 418.90,
    low24h: 412.30,
    category: 'Stocks',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 145.78,
    change24h: 2.15,
    changeValue: 3.06,
    volume: '$45.2M',
    marketCap: '$1.51T',
    high24h: 147.80,
    low24h: 143.20,
    category: 'Stocks',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 234.56,
    change24h: -3.45,
    changeValue: -8.37,
    volume: '$98.7M',
    marketCap: '$745B',
    high24h: 245.30,
    low24h: 232.10,
    category: 'Stocks',
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    price: 1.0845,
    change24h: 0.12,
    changeValue: 0.0013,
    volume: '$124.5B',
    marketCap: '-',
    high24h: 1.0878,
    low24h: 1.0812,
    category: 'Forex',
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound/US Dollar',
    price: 1.2634,
    change24h: -0.23,
    changeValue: -0.0029,
    volume: '$89.3B',
    marketCap: '-',
    high24h: 1.2689,
    low24h: 1.2601,
    category: 'Forex',
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar/Japanese Yen',
    price: 149.87,
    change24h: 0.34,
    changeValue: 0.51,
    volume: '$67.8B',
    marketCap: '-',
    high24h: 150.45,
    low24h: 149.23,
    category: 'Forex',
  },
  {
    symbol: 'GOLD',
    name: 'Gold',
    price: 2045.67,
    change24h: 0.78,
    changeValue: 15.89,
    volume: '$2.3B',
    marketCap: '-',
    high24h: 2058.90,
    low24h: 2034.20,
    category: 'Commodities',
  },
  {
    symbol: 'OIL',
    name: 'Crude Oil',
    price: 78.45,
    change24h: -1.56,
    changeValue: -1.24,
    volume: '$1.8B',
    marketCap: '-',
    high24h: 79.80,
    low24h: 77.90,
    category: 'Commodities',
  },
];

export const useMarketStore = create<MarketState>()((set, get) => ({
  assets: INITIAL_ASSETS,
  selectedAsset: 'BTC',
  isLoading: false,

  setSelectedAsset: (symbol: string) => {
    set({ selectedAsset: symbol });
  },

  updatePrices: () => {
    const { assets } = get();
    const updatedAssets = assets.map((asset) => {
      const volatility = asset.price * 0.002;
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = Math.max(0.01, asset.price + change);

      return {
        ...asset,
        price: newPrice,
      };
    });
    set({ assets: updatedAssets });
  },
}));
