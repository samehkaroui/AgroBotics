import React from 'react';
import { 
  LayoutDashboard,
  Settings, 
  Users, 
  FileText, 
  Calendar,
  Activity,
  Wrench,
  Menu,
  X,
  LogOut,
  Bell,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), permission: 'view_dashboard' },
    { id: 'sensors', icon: FileText, label: t('history'), permission: 'view_sensors' },
    { id: 'programming', icon: Calendar, label: t('programming'), permission: 'manage_schedules' },
    { id: 'equipment', icon: Wrench, label: t('equipment'), permission: 'manage_equipment' },
    { id: 'users', icon: Users, label: t('users'), permission: 'manage_users' },
    { id: 'history', icon: Activity, label: 'Reports', permission: 'view_history' },
    { id: 'notifications', icon: Bell, label: 'Notifications', permission: 'view_dashboard' },
    { id: 'settings', icon: Settings, label: t('settings'), permission: 'manage_settings' },
    { id: 'chatbot', icon: MessageCircle, label: 'Assistant IA', permission: 'view_dashboard' },
  ];

  const hasPermission = (permission: string): boolean => {
    if (!user) {
      console.log('❌ No user logged in');
      return false;
    }
    
    console.log('🔍 Checking permission:', permission);
    console.log('👤 User role:', user.role);
    console.log('🔐 User permissions:', user.permissions);
    
    if (user.role === 'admin' || user.permissions.includes('all')) {
      console.log('✅ Admin access granted');
      return true;
    }
    
    const hasAccess = user.permissions.includes(permission);
    console.log('🎯 Permission result:', hasAccess);
    return hasAccess;
  };

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-emerald-800 text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-emerald-900 border-b border-emerald-700">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.jpg" 
              alt="AgroBotics Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold">AgroBotics</span>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-emerald-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {user.fullName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user.fullName}
                </p>
                <p className="text-emerald-200 text-xs">
                  {t(user.role)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-4">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${currentView === item.id
                        ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                        : 'text-emerald-200 hover:bg-emerald-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-emerald-700">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-emerald-200 hover:bg-emerald-700 hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-700">
          <div className="text-xs text-emerald-300 text-center">
            AgroBotics v2.0
            <br />
            © 2025 AgroBotics
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;