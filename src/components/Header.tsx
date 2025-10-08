import React from 'react';
import { Bell, Wifi, WifiOff, Globe, Settings, AlertCircle, Menu } from 'lucide-react';
import { SystemStatus, Alert } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  systemStatus: SystemStatus;
  alerts: Alert[];
  onToggleMode: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  systemStatus, 
  alerts,
  onToggleMode,
  onOpenSettings,
  onOpenNotifications,
  sidebarOpen,
  setSidebarOpen
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  
  const unreadAlerts = alerts.filter(alert => !alert.read);
  const isOnline = true; // Mock connection status
  
  // Check if user has admin access for settings
  const hasSettingsAccess = user && (user.role === 'admin' || user.permissions.includes('manage_settings') || user.permissions.includes('all'));

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 lg:px-6 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between">
        {/* Mobile menu button & System Status - Left Side */}
        <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 flex-1 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Connection Status */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              isOnline ? 'bg-emerald-500' : 'bg-red-500'
            } animate-pulse`} />
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
            {isOnline ? <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" /> : <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />}
          </div>

          {/* System Mode - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            <span className="text-sm text-gray-600">{t('systemStatus')}:</span>
            <button
              onClick={onToggleMode}
              className={`px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                systemStatus.mode === 'automatic'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                  : 'bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200'
              }`}
            >
              {systemStatus.mode === 'automatic' ? t('automaticMode') : t('manualMode')}
            </button>
          </div>

        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* Alerts */}
          <div className="relative flex-shrink-0">
            <button 
              onClick={onOpenNotifications}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
            </button>
          </div>

          {/* Language Selector - Simplified on mobile */}
          <div className="relative flex-shrink-0">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'ar' | 'en')}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-6 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
            >
              <option value="fr">FR</option>
              <option value="ar">AR</option>
              <option value="en">EN</option>
            </select>
            <Globe className="absolute left-1.5 sm:left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Water Level - Hidden on small mobile */}
          <div className="hidden xs:flex items-center space-x-1 sm:space-x-2 bg-blue-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 flex-shrink-0">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
              systemStatus.waterLevel > 20 ? 'bg-blue-500' : 'bg-red-500'
            }`} />
            <span className="text-xs sm:text-sm text-blue-800">
              {systemStatus.waterLevel}%
              <span className="hidden sm:inline"> {t('waterLevel')}</span>
            </span>
          </div>

          {/* Quick Actions - Simplified on mobile */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {hasSettingsAccess && (
              <>
                <button 
                  onClick={onOpenSettings}
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 sm:hidden"
                  title="Paramètres"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={onOpenSettings}
                  className="hidden sm:block p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Paramètres"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Critical Alerts Bar */}
      {unreadAlerts.some(alert => alert.type === 'error') && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800 font-medium">Alerte critique:</span>
            <span className="text-red-700">
              {unreadAlerts.find(alert => alert.type === 'error')?.message}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;