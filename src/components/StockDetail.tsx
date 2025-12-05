import React, { useState, useEffect } from 'react';
import { Stock } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StockDetailProps {
    stock: Stock;
}

export const StockDetail: React.FC<StockDetailProps> = ({ stock }) => {
    const [data, setData] = useState<{ time: string; price: number }[]>([]);
    const [typedText, setTypedText] = useState('');

    // Accumulate data
    useEffect(() => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        setData(prev => {
            const newData = [...prev, { time: timeStr, price: stock.price }];
            return newData.length > 30 ? newData.slice(newData.length - 30) : newData;
        });
    }, [stock.price]);

    // AI Logic
    const getInsight = () => {
        // Calculate dynamic confidence based on trend strength + jitter
        // Stronger trends = higher confidence
        const trendStrength = Math.min(Math.abs(stock.changePercent) * 100, 20); // Cap boost at 20%
        const baseConfidence = 75;
        const jitter = (Math.random() - 0.5) * 5; // +/- 2.5% random fluctuation
        const confidence = Math.min(Math.floor(baseConfidence + trendStrength + jitter), 99);

        if (stock.changePercent > 0.3) return { text: "Strong Buy Signal! Momentum is building up rapidly.", sentiment: 'bullish', confidence };
        if (stock.changePercent > 0) return { text: "Moderate Growth. Good for long-term holding.", sentiment: 'neutral-bullish', confidence };
        if (stock.changePercent < -0.3) return { text: "Oversold conditions detected. Watch for a bounce.", sentiment: 'bearish', confidence };
        return { text: "Market is consolidating. Wait for a breakout.", sentiment: 'neutral', confidence };
    };

    const insight = getInsight();

    // Typewriter Effect
    useEffect(() => {
        let i = 0;
        setTypedText('');
        const speed = 30; // ms per char
        const timer = setInterval(() => {
            if (i < insight.text.length) {
                setTypedText(insight.text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [insight.text]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Chart Section */}
            <motion.div
                layout
                className="lg:col-span-2 glass-card p-6 border-t-4 border-t-primary"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-3xl font-bold tracking-tight">{stock.name}</h2>
                            <span className="px-2 py-1 bg-surface/80 rounded text-xs font-mono text-slate-400 border border-white/5">{stock.symbol}</span>
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Live Market Data</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-mono font-bold tracking-tight">₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className={`font-mono font-medium flex items-center justify-end ${stock.change >= 0 ? "text-success" : "text-danger"}`}>
                            {stock.change >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                            {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </p>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={stock.change >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={stock.change >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" hide />
                            <YAxis domain={['auto', 'auto']} hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                                itemStyle={{ fontFamily: 'JetBrains Mono, monospace' }}
                                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={stock.change >= 0 ? "#22c55e" : "#ef4444"}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* AI Insights Section */}
            <motion.div
                layout
                className="glass-card p-6 relative overflow-hidden flex flex-col justify-between"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BrainCircuit size={150} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2 text-primary">
                            <BrainCircuit size={24} />
                            <h3 className="font-bold text-lg tracking-tight">AI Analyst</h3>
                        </div>
                        <Activity className="text-primary animate-pulse" size={20} />
                    </div>

                    <div className="bg-surface/30 backdrop-blur-md p-5 rounded-xl border border-white/5 mb-6">
                        <p className="text-xs text-primary uppercase font-bold tracking-widest mb-2">Live Sentiment</p>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={insight.sentiment}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center space-x-3"
                            >
                                {insight.sentiment.includes('bullish') ? <TrendingUp size={28} className="text-success" /> : <TrendingDown size={28} className="text-danger" />}
                                <span className={`text-2xl font-bold capitalize ${insight.sentiment.includes('bullish') ? 'text-success' : 'text-danger'}`}>
                                    {insight.sentiment.replace('-', ' ')}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="bg-surface/30 backdrop-blur-md p-5 rounded-xl border border-white/5 h-48">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3">Recommendation</p>
                        <p className="text-lg font-mono text-slate-200 leading-relaxed">
                            {typedText}
                            <span className="animate-pulse text-primary">_</span>
                        </p>
                    </div>
                </div>

                <div className="mt-4 relative z-10">
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono">
                        <span>CONFIDENCE</span>
                        <span>{insight.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.confidence}%` }}
                            transition={{ duration: 0.5 }}
                            className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
