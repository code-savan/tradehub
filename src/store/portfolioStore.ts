import { create } from 'zustand';

export interface Holding {
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  timestamp: Date;
}

interface PortfolioState {
  balance: number;
  holdings: Holding[];
  transactions: Transaction[];
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  
  // Actions
  executeTrade: (type: 'buy' | 'sell', symbol: string, amount: number, price: number) => void;
}

const INITIAL_HOLDINGS: Holding[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.85,
    avgPrice: 64200.00,
    currentPrice: 67432.85,
    value: 57317.92,
    pnl: 2747.92,
    pnlPercent: 4.28,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 12.5,
    avgPrice: 3200.00,
    currentPrice: 3521.47,
    value: 44018.38,
    pnl: 4018.38,
    pnlPercent: 10.05,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    amount: 245,
    avgPrice: 135.00,
    currentPrice: 148.32,
    value: 36338.40,
    pnl: 3263.40,
    pnlPercent: 9.86,
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    symbol: 'BTC',
    amount: 0.5,
    price: 64200.00,
    total: 32100.00,
    timestamp: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '2',
    type: 'buy',
    symbol: 'ETH',
    amount: 5,
    price: 3200.00,
    total: 16000.00,
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    type: 'sell',
    symbol: 'SOL',
    amount: 50,
    price: 145.00,
    total: 7250.00,
    timestamp: new Date(Date.now() - 3600000 * 4),
  },
];

export const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  balance: 45234.18,
  holdings: INITIAL_HOLDINGS,
  transactions: INITIAL_TRANSACTIONS,
  totalValue: 137674.70,
  totalPnl: 10029.70,
  totalPnlPercent: 7.86,

  executeTrade: (type: 'buy' | 'sell', symbol: string, amount: number, price: number) => {
    const { holdings, transactions, balance } = get();
    const total = amount * price;
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      symbol,
      amount,
      price,
      total,
      timestamp: new Date(),
    };
    
    let updatedHoldings = [...holdings];
    const existingHolding = holdings.find((h) => h.symbol === symbol);
    
    if (type === 'buy') {
      if (existingHolding) {
        const newTotalAmount = existingHolding.amount + amount;
        const newAvgPrice = ((existingHolding.amount * existingHolding.avgPrice) + total) / newTotalAmount;
        updatedHoldings = holdings.map((h) =>
          h.symbol === symbol
            ? { ...h, amount: newTotalAmount, avgPrice: newAvgPrice }
            : h
        );
      } else {
        updatedHoldings.push({
          symbol,
          name: symbol,
          amount,
          avgPrice: price,
          currentPrice: price,
          value: total,
          pnl: 0,
          pnlPercent: 0,
        });
      }
    } else {
      if (existingHolding && existingHolding.amount >= amount) {
        const newAmount = existingHolding.amount - amount;
        if (newAmount === 0) {
          updatedHoldings = holdings.filter((h) => h.symbol !== symbol);
        } else {
          updatedHoldings = holdings.map((h) =>
            h.symbol === symbol ? { ...h, amount: newAmount } : h
          );
        }
      }
    }
    
    // Recalculate totals
    const newTotalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0);
    const newTotalPnl = updatedHoldings.reduce((sum, h) => sum + h.pnl, 0);
    const newTotalPnlPercent = newTotalValue > 0 ? (newTotalPnl / (newTotalValue - newTotalPnl)) * 100 : 0;
    
    set({
      holdings: updatedHoldings,
      transactions: [newTransaction, ...transactions],
      balance: type === 'buy' ? balance - total : balance + total,
      totalValue: newTotalValue,
      totalPnl: newTotalPnl,
      totalPnlPercent: newTotalPnlPercent,
    });
  },
}));
