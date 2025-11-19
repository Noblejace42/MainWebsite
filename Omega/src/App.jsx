import React, { useState, useEffect } from 'react';
import StockInput from './components/StockInput';
import PortfolioTable from './components/PortfolioTable';
import OptimizationDashboard from './components/OptimizationDashboard';
import Charts from './components/Charts';
import { calculatePortfolioStats, optimizePortfolio } from './utils/finance';

// Premium color palette
const STOCK_COLORS = [
  '#38bdf8', // Sky 400
  '#22c55e', // Green 500
  '#eab308', // Yellow 500
  '#ef4444', // Red 500
  '#a855f7', // Purple 500
  '#ec4899', // Pink 500
  '#f97316', // Orange 500
  '#6366f1', // Indigo 500
  '#14b8a6', // Teal 500
  '#8b5cf6', // Violet 500
];

function App() {
  const [stocks, setStocks] = useState([]);
  const [weights, setWeights] = useState([]);
  const [stats, setStats] = useState({ return: 0, volatility: 0, sharpe: 0, omega: 0 });
  const [frontierPoints, setFrontierPoints] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Recalculate stats whenever stocks or weights change
  useEffect(() => {
    if (stocks.length > 0 && weights.length > 0) {
      const newStats = calculatePortfolioStats(stocks, weights);
      setStats(newStats);
    } else {
      setStats({ return: 0, volatility: 0, sharpe: 0, omega: 0 });
    }
  }, [stocks, weights]);

  const handleAddStock = (stock) => {
    if (stocks.find(s => s.ticker === stock.ticker)) return;

    // Assign a color based on the current number of stocks
    const color = STOCK_COLORS[stocks.length % STOCK_COLORS.length];
    const stockWithColor = { ...stock, color };

    const newStocks = [...stocks, stockWithColor];
    // Distribute weights equally initially
    const newWeight = 100 / newStocks.length;
    const newWeights = newStocks.map(() => newWeight);

    setStocks(newStocks);
    setWeights(newWeights);
  };

  const handleUpdateWeight = (index, value) => {
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const handleRemoveStock = (index) => {
    const newStocks = stocks.filter((_, i) => i !== index);
    // Redistribute weights equally
    const newWeight = newStocks.length > 0 ? 100 / newStocks.length : 0;
    const newWeights = newStocks.map(() => newWeight);

    setStocks(newStocks);
    setWeights(newWeights);
    setFrontierPoints([]); // Reset optimization results
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Allow UI to update before heavy calculation
    setTimeout(() => {
      const { bestWeights, points } = optimizePortfolio(stocks);
      setWeights(bestWeights);
      setFrontierPoints(points);
      setIsOptimizing(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans selection:bg-accent selection:text-primary">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 mb-3 tracking-tight">
            Portfolio Optimizer
          </h1>
          <p className="text-slate-400 text-lg font-light">Advanced Analytics & Efficient Frontier Visualization</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <StockInput onAddStock={handleAddStock} />
            <PortfolioTable
              stocks={stocks}
              weights={weights}
              onUpdateWeight={handleUpdateWeight}
              onRemoveStock={handleRemoveStock}
            />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <OptimizationDashboard
              stats={stats}
              onOptimize={handleOptimize}
              isOptimizing={isOptimizing}
            />
            <Charts
              stocks={stocks}
              weights={weights}
              frontierPoints={frontierPoints}
              currentStats={stats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
