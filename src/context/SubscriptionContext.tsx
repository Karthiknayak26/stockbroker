import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
    subscribedSymbols: string[];
    toggleSubscription: (symbol: string) => void;
    isSubscribed: (symbol: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [subscribedSymbols, setSubscribedSymbols] = useState<string[]>([]);

    // Load subscriptions when user changes
    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem(`subscriptions_${user.id}`);
            if (stored) {
                setSubscribedSymbols(JSON.parse(stored));
            } else {
                setSubscribedSymbols([]);
            }
        } else {
            setSubscribedSymbols([]);
        }
    }, [user]);

    const toggleSubscription = (symbol: string) => {
        if (!user) return;

        setSubscribedSymbols(prev => {
            const newSubs = prev.includes(symbol)
                ? prev.filter(s => s !== symbol)
                : [...prev, symbol];

            localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(newSubs));
            return newSubs;
        });
    };

    const isSubscribed = (symbol: string) => subscribedSymbols.includes(symbol);

    return (
        <SubscriptionContext.Provider value={{ subscribedSymbols, toggleSubscription, isSubscribed }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
