import React from 'react';

const PortfolioTable = ({ stocks, weights, onUpdateWeight, onRemoveStock }) => {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const isValid = Math.abs(totalWeight - 100) < 0.1;

    return (
        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-700/50">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full"></span>
                Portfolio Allocation
            </h2>

            {stocks.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <p className="text-slate-400">No assets added yet.</p>
                    <p className="text-slate-500 text-sm mt-1">Add stocks to start optimizing</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-700/50 text-sm uppercase tracking-wider">
                                <th className="py-4 px-4 font-semibold">Asset</th>
                                <th className="py-4 px-4 font-semibold">Exp. Return</th>
                                <th className="py-4 px-4 font-semibold">Volatility</th>
                                <th className="py-4 px-4 font-semibold">Allocation</th>
                                <th className="py-4 px-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock, index) => (
                                <tr key={stock.ticker} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors group">
                                    <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                                        <span
                                            className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                            style={{ backgroundColor: stock.color, boxShadow: `0 0 10px ${stock.color}40` }}
                                        ></span>
                                        {stock.ticker}
                                    </td>
                                    <td className="py-4 px-4 text-emerald-400 font-medium">{(stock.meanReturn * 100).toFixed(2)}%</td>
                                    <td className="py-4 px-4 text-amber-400 font-medium">{(stock.volatility * 100).toFixed(2)}%</td>
                                    <td className="py-4 px-4">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={weights[index]}
                                                onChange={(e) => onUpdateWeight(index, parseFloat(e.target.value) || 0)}
                                                className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white text-right font-mono transition-all"
                                            />
                                            <span className="absolute right-8 top-2 text-slate-500 pointer-events-none">%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => onRemoveStock(index)}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                            title="Remove Stock"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-slate-600/50">
                                <td colSpan="3" className="py-6 px-4 text-right font-bold text-slate-300">Total Allocation:</td>
                                <td className={`py-6 px-4 font-bold text-lg ${isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {totalWeight.toFixed(1)}%
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PortfolioTable;
