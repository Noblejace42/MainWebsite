import React, { useState } from 'react';
import { getStockData } from '../utils/finance';

const StockInput = ({ onAddStock }) => {
    const [ticker, setTicker] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!ticker.trim()) return;

        try {
            // In a real app, we'd validate against an API here
            const stockData = getStockData(ticker.toUpperCase());
            onAddStock(stockData);
            setTicker('');
            setError('');
        } catch (err) {
            setError('Failed to add stock');
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-700/50">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                Add Assets
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative group">
                    <input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        placeholder="Ticker (e.g., AAPL)"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white placeholder-slate-500 transition-all uppercase font-semibold tracking-wide"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"></div>
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-900/30 hover:shadow-sky-500/30 active:scale-95"
                >
                    Add
                </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
            </p>}
        </div>
    );
};

export default StockInput;
