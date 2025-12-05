import React, { useState } from 'react';
import { useStockData } from '../hooks/useStockData';
import { useSubscription } from '../context/SubscriptionContext';
import { StockCard } from './StockCard';
import { StockDetail } from './StockDetail';
import { PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export const Dashboard: React.FC = () => {
    const stocks = useStockData();
    const { subscribedSymbols, toggleSubscription } = useSubscription();
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

    // Filter stocks based on subscription for the watchlist
    const subscribedStocks = stocks.filter(s => subscribedSymbols.includes(s.symbol));

    // Find the full stock object for the selected symbol
    const selectedStock = stocks.find(s => s.symbol === selectedSymbol) || subscribedStocks[0] || stocks[0];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header Stats */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-surface/40 border-l-4 border-l-primary relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Total Portfolio Value</p>
                        <h3 className="text-4xl font-mono font-bold mt-2 tracking-tight">₹1,03,45,290</h3>
                        <span className="text-success text-sm font-bold bg-success/10 px-2 py-1 rounded inline-block mt-2">+2.4% today</span>
                    </div>
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mb-10"></div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-secondary">
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Available Cash</p>
                    <h3 className="text-4xl font-mono font-bold mt-2 tracking-tight">₹10,50,000</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-success">
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Day's P&L</p>
                    <h3 className="text-4xl font-mono font-bold mt-2 text-success tracking-tight">+₹2,68,960</h3>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Watchlist & Market (4 cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Market Overview (All Supported Stocks) */}
                    <div className="glass-card p-5">
                        <h3 className="font-bold mb-4 flex items-center text-sm uppercase tracking-wider text-slate-400">
                            <PlusCircle size={16} className="mr-2 text-primary" />
                            Market Overview
                        </h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {stocks.map(stock => (
                                <motion.div
                                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    key={stock.symbol}
                                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border border-transparent"
                                    onClick={() => setSelectedSymbol(stock.symbol)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-2 h-2 rounded-full ${stock.change >= 0 ? 'bg-success' : 'bg-danger'}`}></div>
                                        <div>
                                            <span className="font-bold block text-sm">{stock.symbol}</span>
                                            <span className="text-xs text-slate-400 font-mono">₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleSubscription(stock.symbol); }}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${subscribedSymbols.includes(stock.symbol)
                                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                            : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                            }`}
                                    >
                                        {subscribedSymbols.includes(stock.symbol) ? 'REMOVE' : 'ADD'}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* My Watchlist */}
                    <div>
                        <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">My Watchlist</h3>
                        <motion.div
                            className="space-y-4"
                        >
                            <AnimatePresence>
                                {subscribedStocks.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center p-8 border-2 border-dashed border-slate-700/50 rounded-xl text-slate-500 bg-surface/20"
                                    >
                                        <p>No stocks in watchlist.</p>
                                        <p className="text-sm mt-1">Add from Market Overview.</p>
                                    </motion.div>
                                ) : (
                                    subscribedStocks.map(stock => (
                                        <motion.div
                                            key={stock.symbol}
                                            variants={item}
                                            layout
                                            onClick={() => setSelectedSymbol(stock.symbol)}
                                            className="cursor-pointer"
                                        >
                                            <StockCard stock={stock} />
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Main Chart & Details (8 cols) */}
                <div className="lg:col-span-8">
                    <motion.div
                        layout
                        key={selectedSymbol || 'default'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {selectedStock ? (
                            <StockDetail stock={selectedStock} />
                        ) : (
                            <div className="h-96 flex flex-col items-center justify-center glass-card text-slate-500">
                                <p>Select a stock to view detailed analysis</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
