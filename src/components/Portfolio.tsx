import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useStockData } from '../hooks/useStockData';
import { useSubscription } from '../context/SubscriptionContext';

export const Portfolio: React.FC = () => {
    const stocks = useStockData();
    const { subscribedSymbols } = useSubscription();

    // Generate mock holdings based ONLY on currently subscribed symbols
    const holdings = subscribedSymbols.map(symbol => {
        // Deterministic mock data based on symbol string length
        const seed = symbol.length;
        // Mock Avg Cost roughly near base prices
        const mockCost = symbol === 'GOOG' ? 11200 : symbol === 'TSLA' ? 19500 : symbol === 'AMZN' ? 14000 : symbol === 'NVDA' ? 72000 : 38000;

        return {
            symbol,
            shares: seed * 10,
            avgCost: mockCost
        };
    });

    // Calculate current value dynamically based on live prices
    const portfolioData = holdings.map(h => {
        const liveStock = stocks.find(s => s.symbol === h.symbol) || { price: h.avgCost };
        const currentValue = h.shares * liveStock.price;
        const costBasis = h.shares * h.avgCost;
        const pl = currentValue - costBasis;
        const plPercent = (pl / costBasis) * 100;

        return {
            ...h,
            currentPrice: liveStock.price,
            currentValue,
            pl,
            plPercent
        };
    });

    const totalValue = portfolioData.reduce((acc, curr) => acc + curr.currentValue, 0);

    // Chart Data
    const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    const chartData = portfolioData.map(d => ({ name: d.symbol, value: d.currentValue }));

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-end"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Your Portfolio</h2>
                    <p className="text-slate-400">Detailed breakdown of your asset allocation.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Net Worth</p>
                    <h3 className="text-4xl font-mono font-bold text-white">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                </div>
            </motion.div>

            {portfolioData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Asset Allocation Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 flex flex-col items-center justify-center min-h-[400px]"
                    >
                        <h3 className="text-lg font-bold mb-6 w-full text-left">Asset Allocation</h3>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => `₹${value.toFixed(2)}`}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Holdings Table */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 glass-card p-6 overflow-hidden"
                    >
                        <h3 className="text-lg font-bold mb-6">Current Holdings</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                                        <th className="pb-4 font-semibold">Asset</th>
                                        <th className="pb-4 font-semibold text-right">Shares</th>
                                        <th className="pb-4 font-semibold text-right">Avg Cost</th>
                                        <th className="pb-4 font-semibold text-right">Current Price</th>
                                        <th className="pb-4 font-semibold text-right">Value</th>
                                        <th className="pb-4 font-semibold text-right">Unrealized P&L</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-mono">
                                    <AnimatePresence>
                                        {portfolioData.map((item, i) => (
                                            <motion.tr
                                                key={item.symbol}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="py-4 font-bold text-white font-sans">{item.symbol}</td>
                                                <td className="py-4 text-right text-slate-300">{item.shares}</td>
                                                <td className="py-4 text-right text-slate-400">₹{item.avgCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td className="py-4 text-right text-white font-bold">₹{item.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td className="py-4 text-right text-white font-bold">₹{item.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                                <td className={`py-4 text-right font-bold ${item.pl >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    {item.pl >= 0 ? '+' : ''}₹{Math.abs(item.pl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({item.plPercent.toFixed(2)}%)
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 glass-card text-center">
                    <p className="text-2xl text-slate-500 font-bold mb-2">Portfolio Empty</p>
                    <p className="text-slate-400">Subscribe to stocks in the Dashboard to see them here.</p>
                </div>
            )}
        </div>
    );
};
