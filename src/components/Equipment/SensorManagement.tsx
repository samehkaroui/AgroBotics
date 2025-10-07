import React, { useState } from 'react';
import { 
  Thermometer,
  Droplets,
  Waves,
  FlaskRound as Flask,
  Sun,
  TestTube,
  Battery,
  Wifi,
  WifiOff,
  Plus,
  Edit,
  Trash2,
  Settings,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { SensorConfig } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface SensorManagementProps {
  sensors: SensorConfig[];
  onEditSensor: (sensor: SensorConfig) => void;
  onDeleteSensor: (sensorId: string) => void;
  onAddSensor: () => void;
  onCalibrateSensor: (sensorId: string) => void;
}

const SensorManagement: React.FC<SensorManagementProps> = ({
  sensors,
  onEditSensor,
  onDeleteSensor,
  onAddSensor,
  onCalibrateSensor
}) => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('all');

  const sensorTypes = [
    { id: 'all', label: 'Tous', icon: Settings },
    { id: 'temperature', label: 'Température', icon: Thermometer },
    { id: 'humidity', label: 'Humidité', icon: Droplets },
    { id: 'soil_moisture', label: 'Humidité Sol', icon: Waves },
    { id: 'npk', label: 'NPK', icon: Flask },
    { id: 'ph', label: 'pH', icon: TestTube },
    { id: 'light', label: 'Luminosité', icon: Sun },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSensorIcon = (type: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      temperature: Thermometer,
      humidity: Droplets,
      soil_moisture: Waves,
      npk: Flask,
      ph: TestTube,
      light: Sun,
    };
    return iconMap[type] || Flask;
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-emerald-600';
    if (level > 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isCalibrationDue = (nextCalibration: string) => {
    const nextDate = new Date(nextCalibration);
    const today = new Date();
    const diffDays = Math.floor((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const filteredSensors = selectedType === 'all' 
    ? sensors 
    : sensors.filter(sensor => sensor.type === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('sensors')}</h2>
          <p className="text-gray-600">Configuration et monitoring des capteurs</p>
        </div>
        <button
          onClick={onAddSensor}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Capteur</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sensorTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedType === type.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{type.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                selectedType === type.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {type.id === 'all' ? sensors.length : sensors.filter(s => s.type === type.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSensors.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);
          const calibrationDue = isCalibrationDue(sensor.nextCalibration);
          
          return (
            <div
              key={sensor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(sensor.status)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                    <p className="text-sm text-gray-600">{sensor.model}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(sensor.status)}`}>
                    {t(sensor.status)}
                  </span>
                  {sensor.status === 'active' ? (
                    <Wifi className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Battery and Location */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Battery className={`w-4 h-4 ${getBatteryColor(sensor.batteryLevel)}`} />
                  <span className="text-sm font-medium">{sensor.batteryLevel}%</span>
                </div>
                <span className="text-sm text-gray-600">{sensor.location}</span>
              </div>

              {/* Thresholds */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Seuils d'alerte</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Min:</span>
                    <span className="ml-2 font-medium text-orange-600">
                      {sensor.alertThresholds?.min || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {sensor.alertThresholds?.max || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Plage: {sensor.minValue} - {sensor.maxValue}
                </div>
              </div>

              {/* Calibration Info */}
              <div className={`rounded-lg p-3 mb-4 ${
                calibrationDue ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className={`w-4 h-4 ${calibrationDue ? 'text-orange-600' : 'text-blue-600'}`} />
                  <span className={`text-sm font-medium ${calibrationDue ? 'text-orange-800' : 'text-blue-800'}`}>
                    {t('calibration')}
                  </span>
                  {calibrationDue && (
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={calibrationDue ? 'text-orange-600' : 'text-blue-600'}>Dernière:</span>
                    <span>{formatDate(sensor.lastCalibration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={calibrationDue ? 'text-orange-600' : 'text-blue-600'}>Prochaine:</span>
                    <span className={`font-medium ${calibrationDue ? 'text-orange-800' : 'text-blue-800'}`}>
                      {formatDate(sensor.nextCalibration)}
                    </span>
                  </div>
                </div>
                {calibrationDue && (
                  <button
                    onClick={() => onCalibrateSensor(sensor.id)}
                    className="mt-2 w-full bg-orange-600 text-white py-1 px-3 rounded text-xs hover:bg-orange-700"
                  >
                    Calibrer maintenant
                  </button>
                )}
              </div>

              {/* Serial Number */}
              <div className="text-xs text-gray-500 mb-4 font-mono bg-gray-100 px-2 py-1 rounded">
                S/N: {sensor.serialNumber}
              </div>

              {/* Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditSensor(sensor)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Config</span>
                </button>
                
                <button
                  onClick={() => onEditSensor(sensor)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 border border-blue-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onDeleteSensor(sensor.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSensors.length === 0 && (
        <div className="text-center py-12">
          <Flask className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedType === 'all' ? 'Aucun capteur configuré' : `Aucun capteur de type ${sensorTypes.find(t => t.id === selectedType)?.label}`}
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedType === 'all' ? 'Ajoutez votre premier capteur pour commencer' : 'Ajoutez un capteur de ce type'}
          </p>
          <button
            onClick={onAddSensor}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Ajouter un capteur
          </button>
        </div>
      )}
    </div>
  );
};

export default SensorManagement;