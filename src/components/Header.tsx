import React from 'react';
import { Bell, Wifi, WifiOff, Power, PowerOff, Globe, Settings, AlertCircle } from 'lucide-react';
import { SystemStatus, Alert } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  systemStatus: SystemStatus;
  alerts: Alert[];
  onTogglePump: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  systemStatus, 
  alerts, 
  onTogglePump 
}) => {
  const { language, setLanguage, t } = useLanguage();
  
  const unreadAlerts = alerts.filter(alert => !alert.read);
  const isOnline = true; // Mock connection status

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* System Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-emerald-500' : 'bg-red-500'
            } animate-pulse`} />
            <span className="text-sm text-gray-600">
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
            {isOnline ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
          </div>

          {/* System Status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{t('systemStatus')}:</span>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              systemStatus.mode === 'automatic'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-orange-100 text-orange-800 border border-orange-200'
            }`}>
              {systemStatus.mode === 'automatic' ? t('automaticMode') : t('manualMode')}
            </div>
          </div>

          {/* Pump Status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{t('pump')}:</span>
            <button
              onClick={onTogglePump}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                systemStatus.pumpStatus === 'on'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {systemStatus.pumpStatus === 'on' ? (
                <>
                  <Power className="w-4 h-4" />
                  <span>{t('on')}</span>
                </>
              ) : (
                <>
                  <PowerOff className="w-4 h-4" />
                  <span>{t('off')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Alerts */}
          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'ar' | 'en')}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-8 py-2 text-sm text-gray-700 hover:border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
            <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Water Level Indicator */}
          <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
            <div className={`w-2 h-2 rounded-full ${
              systemStatus.waterLevel > 20 ? 'bg-blue-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-blue-800">
              {systemStatus.waterLevel}% {t('waterLevel')}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1">
              <span className="text-xs font-medium text-yellow-800">🧪 MODE TEST</span>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Settings className="w-5 h-5" />
            </button>
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