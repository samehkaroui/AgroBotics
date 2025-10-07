import React from 'react';
import { 
  Power, 
  PowerOff, 
  Wrench, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';
import { Pump } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface PumpManagementProps {
  pumps: Pump[];
  onTogglePump: (pumpId: string) => void;
  onEditPump: (pump: Pump) => void;
  onDeletePump: (pumpId: string) => void;
  onAddPump: () => void;
}

const PumpManagement: React.FC<PumpManagementProps> = ({
  pumps,
  onTogglePump,
  onEditPump,
  onDeletePump,
  onAddPump
}) => {
  const { t } = useLanguage();
  // const [selectedPump] = useState<string | null>(null); // TODO: استخدام لاحقاً

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Power className="w-4 h-4" />;
      case 'stopped':
        return <PowerOff className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <PowerOff className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('pumps')}</h2>
          <p className="text-gray-600">Gestion et monitoring des pompes</p>
        </div>
        <button
          onClick={onAddPump}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Pompe</span>
        </button>
      </div>

      {/* Pumps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pumps.map((pump) => (
          <div
            key={pump.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(pump.status)}`}>
                  {getStatusIcon(pump.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{pump.name}</h3>
                  <p className="text-sm text-gray-600">{pump.model}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(pump.status)}`}>
                {t(pump.status)}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Débit</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {pump.flowRate} L/min
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Pression</span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {pump.pressure} bar
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Puissance:</span>
                <span className="font-medium">{pump.power} kW</span>
              </div>
              <div className="flex justify-between">
                <span>Heures totales:</span>
                <span className="font-medium">{pump.totalHours}h</span>
              </div>
              <div className="flex justify-between">
                <span>Emplacement:</span>
                <span className="font-medium">{pump.location}</span>
              </div>
            </div>

            {/* Maintenance Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Maintenance</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Dernière:</span>
                  <span>{formatDate(pump.lastMaintenance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prochaine:</span>
                  <span className="text-orange-600 font-medium">
                    {formatDate(pump.nextMaintenance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex space-x-2">
              <button
                onClick={() => onTogglePump(pump.id)}
                disabled={pump.status === 'maintenance' || pump.status === 'error'}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pump.status === 'running'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {pump.status === 'running' ? (
                  <>
                    <PowerOff className="w-4 h-4" />
                    <span>Arrêter</span>
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    <span>Démarrer</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => onEditPump(pump)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onDeletePump(pump.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pumps.length === 0 && (
        <div className="text-center py-12">
          <Power className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune pompe configurée</h3>
          <p className="text-gray-600 mb-4">Ajoutez votre première pompe pour commencer</p>
          <button
            onClick={onAddPump}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Ajouter une pompe
          </button>
        </div>
      )}
    </div>
  );
};

export default PumpManagement;