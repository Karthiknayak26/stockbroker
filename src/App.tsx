import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Portfolio } from './components/Portfolio';
import { Settings } from './components/Settings';
import { Layout } from './components/Layout';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [currentView, setCurrentView] = React.useState<'dashboard' | 'portfolio' | 'settings'>('dashboard');

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
