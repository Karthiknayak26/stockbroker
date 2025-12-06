import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: () => void;
    logout: () => void;
    isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: clerkUser, isLoaded } = useUser();
    const { openSignIn, signOut } = useClerk();

    const user: User | null = (isLoaded && clerkUser) ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || ''
    } : null;

    const login = () => {
        openSignIn();
    };

    const logout = () => {
        signOut();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoaded }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
