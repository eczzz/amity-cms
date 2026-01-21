import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Auth/Login';
import { MainLayout } from './components/Layout/MainLayout';
import { Content } from './components/Content/Content';
import { ContentModels } from './components/ContentModels/ContentModels';
import { Media } from './components/Media/Media';
import { Settings } from './components/Settings/Settings';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('content');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
