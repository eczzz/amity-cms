import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  currentView: string;
  onViewChange: (view: string) => void;
  children: ReactNode;
}

export function MainLayout({ currentView, onViewChange, children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
