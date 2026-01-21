import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt, faImages, faCubes, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { signOut, user } = useAuth();

  const menuItems = [
    { id: 'content', label: 'Content', icon: faFileLines },
    { id: 'content-models', label: 'Content Models', icon: faCubes },
    { id: 'media', label: 'Media', icon: faImages },
    { id: 'settings', label: 'Settings', icon: faCog },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div
      className="bg-navy text-white flex flex-col h-screen transition-all duration-300 ease-out"
      style={{ width: isCollapsed ? '80px' : '256px' }}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="h-20 p-4 border-b border-navy/50 flex items-center justify-center overflow-hidden">
        {isCollapsed ? (
          <img
            src="https://ketsuronmedia.com/media/favicon-icon.png"
            alt="Ketsuron"
            className="h-10 object-contain"
          />
        ) : (
          <div className="w-full">
            <img
              src="https://ketsuronmedia.com/media/ketsuron-logo-color.webp"
              alt="Ketsuron Logo"
              className="h-12 object-contain mx-auto"
            />
          </div>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md transition-all duration-300 ${
                  currentView === item.id
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <FontAwesomeIcon icon={item.icon} className="w-4 h-4 flex-shrink-0" />
                <span
                  className={`text-small whitespace-nowrap transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-navy/50">
        <div
          className={`text-tiny text-white/60 mb-3 px-4 transition-all duration-300 overflow-hidden ${
            isCollapsed ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'
          }`}
        >
          {user?.email}
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 flex-shrink-0" />
          <span
            className={`text-small whitespace-nowrap transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}
          >
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}
