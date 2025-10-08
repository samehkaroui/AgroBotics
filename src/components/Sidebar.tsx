import React from 'react';
import { 
  LayoutDashboard,
  Settings, 
  Users, 
  FileText, 
  Calendar,
  Activity,
  Wrench,
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

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white flex flex-col shadow-xl
        lg:sticky lg:top-0 lg:h-screen lg:transform-none lg:translate-x-0 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 bg-emerald-900/50 border-b border-emerald-700/50 backdrop-blur-sm px-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <img 
                src="/logo.jpg" 
                alt="AgroBotics Logo" 
                className="w-8 h-8 object-contain rounded"
              />
            </div>
            <span className="text-xl font-bold text-white">AgroBotics</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-emerald-700/50">
            <div className="flex items-center space-x-3 bg-emerald-800/30 rounded-lg p-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center ring-2 ring-emerald-400/20">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user.fullName}
                </p>
                <p className="text-emerald-200 text-xs capitalize">
                  {t(user.role)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group touch-target
                      ${isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg ring-2 ring-emerald-400/20'
                        : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-emerald-700/50">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-emerald-200 hover:bg-red-600/20 hover:text-red-200 rounded-xl transition-all duration-200 group touch-target"
          >
            <LogOut className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" />
            <span className="font-medium text-sm">{t('logout')}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-emerald-700/50 bg-emerald-900/30">
          <div className="text-xs text-emerald-300/80 text-center space-y-1">
            <div className="font-medium">AgroBotics v2.0</div>
            <div className="text-emerald-400/60">© 2025 AgroBotics</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;