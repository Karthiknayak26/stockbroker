import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { TrendingUp } from 'lucide-react';

export const Login: React.FC = () => {
    // We import SignIn directly to embed it

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-success/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>

            <div className="z-10 flex flex-col items-center">
                <div className="mb-8 text-center">
                    <div className="inline-flex bg-primary/20 p-4 rounded-full mb-4">
                        <TrendingUp className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">TradePro</h1>
                    <p className="text-secondary">Enter the future of trading.</p>
                </div>

                <div className="glass-card p-2 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                    <SignIn />
                </div>
            </div>
        </div>
    );
};
