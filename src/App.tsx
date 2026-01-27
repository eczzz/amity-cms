import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
import { Login } from './components/Auth/Login';
import { MainLayout } from './components/Layout/MainLayout';
import { Content } from './components/Content/Content';
import { ContentModels } from './components/ContentModels/ContentModels';
import { Media } from './components/Media/Media';
import { Settings } from './components/Settings/Settings';
import { SetupWizard } from './components/Setup/SetupWizard';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { config, loading: configLoading } = useConfig();
  const [currentView, setCurrentView] = useState('content');

  // Show loading while config or auth is loading
  if (configLoading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show setup wizard if setup is not complete
  if (!config.setupComplete) {
    return <SetupWizard />;
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'content':
        return <Content />;
      case 'content-models':
        return <ContentModels />;
      case 'media':
        return <Media />;
      case 'settings':
        return <Settings />;
      default:
        return <Content />;
    }
  };

  return (
    <MainLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </MainLayout>
  );
}

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
