import React from 'react';

const OptimizationDashboard = ({ stats, onOptimize, isOptimizing }) => {
    const StatCard = ({ label, value, subtext, colorClass, gradientClass }) => (
        <div className="bg-slate-800/40 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/50 shadow-lg hover:bg-slate-800/60 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientClass}`}></div>
            <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-bold ${colorClass} mb-1`}>{value}</p>
            {subtext && <p className="text-slate-500 text-xs font-medium">{subtext}</p>}

            {/* Glow effect */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 blur-2xl ${gradientClass.replace('from-', 'bg-')}`}></div>
        </div>
    );

    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </span>
                    Performance Metrics
                </h2>
                <button
                    onClick={onOptimize}
                    disabled={isOptimizing}
                    className={`px-8 py-3 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all transform hover:scale-105 active:scale-95 border border-white/10 ${isOptimizing ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {isOptimizing ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Optimizing...
                        </span>
                    ) : 'Run Optimization'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Expected Return"
                    value={`${(stats.return * 100).toFixed(2)}%`}
                    subtext="Annualized"
                    colorClass="text-emerald-400"
                    gradientClass="from-emerald-500 to-teal-500"
                />
                <StatCard
                    label="Volatility"
                    value={`${(stats.volatility * 100).toFixed(2)}%`}
                    subtext="Annualized Std Dev"
                    colorClass="text-amber-400"
                    gradientClass="from-amber-500 to-orange-500"
                />
                <StatCard
                    label="Sharpe Ratio"
                    value={stats.sharpe.toFixed(2)}
                    subtext="Risk-adjusted return"
                    colorClass="text-sky-400"
                    gradientClass="from-sky-500 to-blue-500"
                />
                <StatCard
                    label="Omega Ratio"
                    value={stats.omega.toFixed(2)}
                    subtext="Gain/Loss probability"
                    colorClass="text-purple-400"
                    gradientClass="from-purple-500 to-pink-500"
                />
            </div>
        </div>
    );
};

export default OptimizationDashboard;
