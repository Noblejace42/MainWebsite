import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from 'recharts';

const Charts = ({ stocks, weights, frontierPoints, currentStats }) => {
    const pieData = stocks.map((stock, index) => ({
        name: stock.ticker,
        value: weights[index],
        color: stock.color,
    })).filter(d => d.value > 0);

    const scatterData = frontierPoints.map(p => ({
        x: p.x * 100, // Volatility %
        y: p.y * 100, // Return %
        z: p.sharpe,
    }));

    const currentPoint = {
        x: currentStats.volatility * 100,
        y: currentStats.return * 100,
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Allocation Chart */}
            <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                    Portfolio Allocation
                </h3>
                <div className="h-[300px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    borderColor: 'rgba(51, 65, 85, 0.5)',
                                    color: '#fff',
                                    borderRadius: '0.75rem',
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 600 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-slate-400 text-sm font-medium">Total</span>
                        <span className="text-3xl font-bold text-white">100%</span>
                    </div>
                </div>
            </div>

            {/* Efficient Frontier Chart */}
            <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                    Efficient Frontier
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis
                                type="number"
                                dataKey="x"
                                name="Volatility"
                                unit="%"
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                tickLine={{ stroke: '#334155' }}
                                axisLine={{ stroke: '#334155' }}
                                label={{ value: 'Risk (Volatility)', position: 'bottom', fill: '#94a3b8', offset: 0 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="y"
                                name="Return"
                                unit="%"
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                tickLine={{ stroke: '#334155' }}
                                axisLine={{ stroke: '#334155' }}
                                label={{ value: 'Return', angle: -90, position: 'left', fill: '#94a3b8', offset: 10 }}
                            />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3', stroke: '#fff', strokeOpacity: 0.2 }}
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    borderColor: 'rgba(51, 65, 85, 0.5)',
                                    color: '#fff',
                                    borderRadius: '0.75rem',
                                    backdropFilter: 'blur(4px)'
                                }}
                            />
                            <Scatter name="Simulations" data={scatterData} fill="#38bdf8" fillOpacity={0.4} shape="circle" />
                            <Scatter name="Current" data={[currentPoint]} fill="#ef4444" shape="star" r={20} />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Charts;
