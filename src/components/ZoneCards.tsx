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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900 text-sm">
                {zone.name}
              </h3>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(zone.status)}`}>
              {t(zone.status)}
            </span>
          </div>

          {/* Soil Humidity */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">{t('soilHumidity')}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {zone.soilHumidity}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  zone.soilHumidity > 60 ? 'bg-emerald-500' :
                  zone.soilHumidity > 30 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${zone.soilHumidity}%` }}
              />
            </div>
          </div>

          {/* Last Watered */}
          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatLastWatered(zone.lastWatered)}</span>
          </div>

          {/* Controls */}
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleZone(zone.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                zone.status === 'active'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
              }`}
            >
              {zone.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Démarrer</span>
                </>
              )}
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ZoneCards;