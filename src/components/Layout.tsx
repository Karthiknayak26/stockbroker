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

    const NavItem = ({ view, icon: Icon, label, mobile = false }: { view: 'dashboard' | 'portfolio' | 'settings', icon: any, label: string, mobile?: boolean }) => (
        <button
            onClick={() => setView(view)}
            className={clsx(
                "flex items-center transition-all",
                mobile ? "flex-col justify-center p-2 rounded-xl" : "space-x-3 px-4 py-3 rounded-lg w-full",
                currentView === view
                    ? mobile ? "text-primary bg-primary/10" : "bg-primary/20 text-primary border border-primary/20"
                    : mobile ? "text-slate-500" : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
        >
            <Icon size={mobile ? 24 : 20} />
            <span className={clsx(mobile ? "text-[10px] mt-1 font-bold" : "font-medium")}>{label}</span>
        </button>
    );

    return (
        <div className="flex min-h-screen bg-background text-white selection:bg-primary/30 pb-20 md:pb-0">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-surface/30 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col fixed inset-y-0 left-0 z-50">
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

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent tracking-tight">TradePro</h1>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-white">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto md:ml-64 pt-16 md:pt-0">
                {children}
            </main>

            {/* Bottom Navigation (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-2 flex justify-between items-center safe-area-bottom">
                <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" mobile />
                <NavItem view="portfolio" icon={PieChart} label="Portfolio" mobile />
                <NavItem view="settings" icon={SettingsIcon} label="Settings" mobile />
            </div>
        </div>
    );
};
