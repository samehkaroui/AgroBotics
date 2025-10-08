import React from 'react';
import { 
  MapPin, 
  Droplets, 
  Clock, 
  Play, 
  Pause,
  Calendar
} from 'lucide-react';
import { ZoneData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ZoneCardsProps {
  zones: ZoneData[];
  onToggleZone: (zoneId: string) => void;
}

const ZoneCards: React.FC<ZoneCardsProps> = ({ zones, onToggleZone }) => {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLastWatered = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Il y a moins d\'1h';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${Math.floor(diffHours / 24)} jour(s)`;
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200/60 p-3 sm:p-4 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1 group"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5 flex-1 min-w-0">
              <div className="p-1.5 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors duration-200">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                {zone.name}
              </h3>
            </div>
            <span className={`px-1.5 py-0.5 rounded-full text-xxs font-medium border flex-shrink-0 ${getStatusColor(zone.status)}`}>
              {t(zone.status)}
            </span>
          </div>

          {/* Soil Humidity */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-gray-600 font-medium">{t('soilHumidity')}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {zone.soilHumidity}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  zone.soilHumidity > 60 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                  zone.soilHumidity > 30 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                }`}
                style={{ width: `${zone.soilHumidity}%` }}
              />
            </div>
          </div>

          {/* Last Watered */}
          <div className="flex items-center space-x-1.5 mb-3 p-1.5 bg-gray-50 rounded-lg">
            <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-600 truncate">{formatLastWatered(zone.lastWatered)}</span>
          </div>

          {/* Controls */}
          <div className="flex space-x-1.5">
            <button
              onClick={() => onToggleZone(zone.id)}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                zone.status === 'active'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md'
              }`}
            >
              {zone.status === 'active' ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span className="hidden sm:inline">Arrêter</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span className="hidden sm:inline">Démarrer</span>
                </>
              )}
            </button>
            <button className="px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-200 flex-shrink-0 hover:scale-105 active:scale-95">
              <Calendar className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ZoneCards;