import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Portfolio } from './components/Portfolio';
import { Settings } from './components/Settings';
import { Layout } from './components/Layout';

const AppContent: React.FC = () => {
    const { user, isLoaded } = useAuth();
    const [currentView, setCurrentView] = React.useState<'dashboard' | 'portfolio' | 'settings'>('dashboard');

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <Layout currentView={currentView} setView={setCurrentView}>
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'portfolio' && <Portfolio />}
            {currentView === 'settings' && <Settings />}
        </Layout>
    );
};

function App() {
    return (
        <AuthProvider>
            <SubscriptionProvider>
                <AppContent />
            </SubscriptionProvider>
        </AuthProvider>
    );
}

export default App;
