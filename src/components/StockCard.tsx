import React from 'react';
import { Stock } from '../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Plus, Check } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface StockCardProps {
    stock: Stock;
}

export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
    const { isSubscribed, toggleSubscription } = useSubscription();
    const subscribed = isSubscribed(stock.symbol);
    const isPositive = stock.change >= 0;

    // Mock historical data for sparkline (would typically come from history)
    // Generating a pseudo-random trend based on current price
    const sparkData = Array.from({ length: 20 }, (_, i) => ({
        i,
        price: stock.price * (1 + (Math.random() - 0.5) * 0.02)
    }));
    // Ensure last point matches current price to look connected
    sparkData[sparkData.length - 1].price = stock.price;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-4 relative overflow-hidden group"
        >
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-lg tracking-tight">{stock.symbol}</h3>
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">{stock.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-2xl font-mono font-bold tracking-tight">₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className={clsx("flex items-center text-sm mt-1 font-mono", isPositive ? "text-success" : "text-danger")}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span className="ml-1 font-bold">{Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)</span>
                    </div>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); toggleSubscription(stock.symbol); }}
                    className={clsx(
                        "p-2 rounded-xl transition-all duration-300 backdrop-blur-md border",
                        subscribed
                            ? "bg-success/10 text-success border-success/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20"
                            : "bg-surface/50 text-slate-400 border-white/5 hover:bg-primary/20 hover:text-primary hover:border-primary/20"
                    )}
                    title={subscribed ? "Unsubscribe" : "Subscribe"}
                >
                    {subscribed ? <Check size={18} /> : <Plus size={18} />}
                </button>
            </div>

            {/* Sparkline Background */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 transition-opacity duration-300 group-hover:opacity-30 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                        <defs>
                            <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={isPositive ? "#22c55e" : "#ef4444"}
                            strokeWidth={2}
                            fill={`url(#gradient-${stock.symbol})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
