import React from 'react';
import { Thermometer, Droplets, Waves, Gauge, FlaskRound as Flask, TrendingUp, TrendingDown } from 'lucide-react';
import { SensorData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SensorCardsProps {
  sensors: SensorData[];
}

const SensorCards: React.FC<SensorCardsProps> = ({ sensors }) => {
  const { t } = useLanguage();

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      thermometer: Thermometer,
      droplets: Droplets,
      waves: Waves,
      gauge: Gauge,
      flask: Flask,
    };
    return icons[iconName] || Flask;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {sensors.map((sensor) => {
        const Icon = getIcon(sensor.icon);
        const statusColor = getStatusColor(sensor.status);
        const trend = Math.random() > 0.5 ? 'up' : 'down';
        
        return (
          <div
            key={sensor.id}
            className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${statusColor}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${statusColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-1">
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {Math.floor(Math.random() * 10 + 1)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">
                {t(sensor.name)}
              </h3>
              <div className="flex items-end space-x-1">
                <span className="text-2xl font-bold text-gray-900">
                  {sensor.value}
                </span>
                <span className="text-sm text-gray-500 pb-1">
                  {sensor.unit}
                </span>
              </div>
              
              {/* Progress bar for certain sensors */}
              {(sensor.name === 'waterLevel' || sensor.name === 'airHumidity') && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        sensor.status === 'normal' ? 'bg-emerald-500' :
                        sensor.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${sensor.value}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SensorCards;