import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SensorCards from './SensorCards';
import ZoneCards from './ZoneCards';
import Charts from './Charts';
import AlertsPanel from './AlertsPanel';
import { SensorData, ZoneData, Alert } from '../types';

interface DashboardProps {
  sensors: SensorData[];
  zones: ZoneData[];
  alerts: Alert[];
  chartData: any[];
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
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Surveillance en temps réel de votre système d'irrigation</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Système opérationnel</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 rounded-lg px-3 py-2">
            <div className="text-sm text-blue-800 font-medium">Mode Démo</div>
            <div className="text-xs text-blue-600">Données simulées</div>
          </div>
          <div className="bg-green-50 rounded-lg px-3 py-2">
            <div className="text-sm text-green-800 font-medium">🤖 Assistant IA</div>
            <div className="text-xs text-green-600">Disponible 24/7</div>
          </div>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Sensor Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Capteurs Environnementaux</h2>
        <SensorCards sensors={sensors} />
      </div>

      {/* Zone Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Zones d'Irrigation</h2>
        <ZoneCards zones={zones} onToggleZone={onToggleZone} />
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Charts data={chartData} />
        </div>
        <div>
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