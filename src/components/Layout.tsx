import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, PieChart, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
    currentView: 'dashboard' | 'portfolio' | 'settings';
    setView: (view: 'dashboard' | 'portfolio' | 'settings') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
    const { user, logout } = useAuth();

    const NavItem = ({ view, icon: Icon, label }: { view: 'dashboard' | 'portfolio' | 'settings', icon: any, label: string }) => (
        <button
            onClick={() => setView(view)}
            className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all w-full",
                currentView === view
                    ? "bg-primary/20 text-primary border border-primary/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex min-h-screen bg-background text-white selection:bg-primary/30">
            {/* Sidebar */}
            <aside className="w-64 bg-surface/30 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent tracking-tight">TradePro</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem view="portfolio" icon={PieChart} label="Portfolio" />
                    <NavItem view="settings" icon={SettingsIcon} label="Settings" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="glass p-3 rounded-xl mb-4 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-lg">
                            <UserIcon size={18} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.email.split('@')[0]}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pro Acount</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-sm transition-all text-slate-400 hover:text-white"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};
