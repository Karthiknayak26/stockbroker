import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { motion } from 'framer-motion';
import { User, Shield, Trash2, Bell, LogOut } from 'lucide-react';

export const Settings: React.FC = () => {
    const { user, logout } = useAuth();
    const { subscribedSymbols } = useSubscription();

    const handleClearData = () => {
        if (confirm('Are you sure you want to reset all data? This will clear subscriptions and logout locally.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h2>
                <p className="text-slate-400">Manage your profile and preferences.</p>
            </motion.div>

            <div className="bg-surface/30 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="font-bold flex items-center space-x-2">
                        <User size={20} className="text-primary" />
                        <span>Profile Information</span>
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Email Address</label>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-slate-300">
                            {user?.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Account Type</label>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-primary font-bold flex items-center justify-between">
                            <span>PRO TRADER</span>
                            <span className="px-2 py-0.5 bg-primary/20 text-xs rounded text-primary">ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="font-bold flex items-center space-x-2">
                        <Bell size={20} className="text-warning" />
                        <span>Notifications & Subscriptions</span>
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-400 mb-4">You are currently subscribed to real-time updates for:</p>
                    <div className="flex flex-wrap gap-2">
                        {subscribedSymbols.length > 0 ? subscribedSymbols.map(s => (
                            <span key={s} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-sm font-mono">{s}</span>
                        )) : (
                            <span className="text-slate-500 italic">No active subscriptions</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-red-500/5 backdrop-blur-md rounded-2xl border border-red-500/20 overflow-hidden">
                <div className="p-6 border-b border-red-500/20 bg-red-500/10">
                    <h3 className="font-bold flex items-center space-x-2 text-red-500">
                        <Shield size={20} />
                        <span>Danger Zone</span>
                    </h3>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-white">Reset Application Data</h4>
                        <p className="text-sm text-slate-400 mt-1">This will clear all local storage, subscriptions, and cached data.</p>
                    </div>
                    <button
                        onClick={handleClearData}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Trash2 size={16} />
                        <span>Reset Data</span>
                    </button>
                </div>
            </div>

            <div className="text-center pt-8">
                <button onClick={logout} className="text-slate-500 hover:text-white transition-colors flex items-center justify-center space-x-2 mx-auto">
                    <LogOut size={16} />
                    <span>Log out of {user?.email}</span>
                </button>
            </div>
        </div>
    );
};
