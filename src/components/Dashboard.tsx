import { useLanguage } from '../contexts/LanguageContext';
import SensorCards from './SensorCards';
import ZoneCards from './ZoneCards';
import Charts from './Charts';
import AlertsPanel from './AlertsPanel';
import { SensorData, ZoneData, Alert } from '../types';

interface ChartDataPoint {
  date: string;
  temperature: number;
  humidity: number;
  soilHumidity: number;
  waterConsumption: number;
}

interface DashboardProps {
  sensors: SensorData[];
  zones: ZoneData[];
  alerts: Alert[];
  chartData: ChartDataPoint[];
  onToggleZone: (zoneId: string) => void;
  onMarkAsRead: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

export default function Dashboard({
  sensors,
  zones,
  alerts,
  chartData,
  onToggleZone,
  onMarkAsRead,
  onDismiss
}: DashboardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Title */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <p className="text-sm sm:text-base text-gray-600">Surveillance en temps réel de votre système d'irrigation</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-green-600 font-medium">Système opérationnel</span>
            </div>
          </div>
        </div>
        
        {/* Status Cards - Responsive layout */}
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
          <div className="bg-blue-50 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 flex-shrink-0">
            <div className="text-xs sm:text-sm text-blue-800 font-medium">Mode Démo</div>
            <div className="text-xxs sm:text-xs text-blue-600">Données simulées</div>
          </div>
          <div className="bg-green-50 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 flex-shrink-0">
            <div className="text-xs sm:text-sm text-green-800 font-medium">🤖 Assistant IA</div>
            <div className="text-xxs sm:text-xs text-green-600">Disponible 24/7</div>
          </div>
          <div className="hidden lg:block text-xs sm:text-sm text-gray-500 self-center">
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Capteurs Environnementaux</h2>
          <div className="lg:hidden text-xs text-gray-500">
            {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
        <SensorCards sensors={sensors} />
      </div>

      {/* Zone Cards */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Zones d'Irrigation</h2>
        <ZoneCards zones={zones} onToggleZone={onToggleZone} />
      </div>

      {/* Charts and Alerts - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Charts data={chartData} />
        </div>
        <div className="order-1 lg:order-2">
          <AlertsPanel 
            alerts={alerts} 
            onMarkAsRead={onMarkAsRead}
            onDismiss={onDismiss}
          />
        </div>
      </div>
    </div>
  );
}