import React, { useState } from 'react';
import { 
  CircleDot,
  Circle,
  Settings,
  AlertTriangle,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Gauge
} from 'lucide-react';
import { Valve, ZoneData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ValveManagementProps {
  valves: Valve[];
  zones: ZoneData[];
  onToggleValve: (valveId: string) => void;
  onEditValve: (valve: Valve) => void;
  onDeleteValve: (valveId: string) => void;
  onAddValve: () => void;
  onAdjustValve: (valveId: string, percentage: number) => void;
}

const ValveManagement: React.FC<ValveManagementProps> = ({
  valves,
  zones,
  onToggleValve,
  onEditValve,
  onDeleteValve,
  onAddValve,
  onAdjustValve
}) => {
  const { t } = useLanguage();
  const [adjustingValve, setAdjustingValve] = useState<string | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CircleDot className="w-4 h-4" />;
      case 'closed':
        return <Circle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : `Zone ${zoneId}`;
  };

  const formatLastOperation = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Il y a moins d\'1h';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${Math.floor(diffHours / 24)} jour(s)`;
  };

  const handleAdjustmentStart = (valveId: string, currentPercentage: number) => {
    setAdjustingValve(valveId);
    setAdjustmentValue(currentPercentage);
  };

  const handleAdjustmentApply = () => {
    if (adjustingValve) {
      onAdjustValve(adjustingValve, adjustmentValue);
      setAdjustingValve(null);
    }
  };

  const handleAdjustmentCancel = () => {
    setAdjustingValve(null);
    setAdjustmentValue(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('valves')}</h2>
          <p className="text-gray-600">Gestion et contrôle des électrovannes</p>
        </div>
        <button
          onClick={onAddValve}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Vanne</span>
        </button>
      </div>

      {/* Valves Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {valves.map((valve) => (
          <div
            key={valve.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(valve.status)}`}>
                  {getStatusIcon(valve.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{valve.name}</h3>
                  <p className="text-sm text-gray-600">{valve.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(valve.status)}`}>
                {t(valve.status)}
              </span>
            </div>

            {/* Zone Info */}
            <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <span className="text-sm font-medium text-blue-800">
                  {getZoneName(valve.zoneId)}
                </span>
                <p className="text-xs text-blue-600">{valve.location}</p>
              </div>
            </div>

            {/* Opening Percentage */}
            {valve.type !== 'manual' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">Ouverture</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {valve.openingPercentage}%
                  </span>
                </div>
                
                {adjustingValve === valve.id ? (
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={adjustmentValue}
                      onChange={(e) => setAdjustmentValue(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAdjustmentApply}
                        className="flex-1 bg-emerald-600 text-white py-1 px-3 rounded text-sm hover:bg-emerald-700"
                      >
                        Appliquer
                      </button>
                      <button
                        onClick={handleAdjustmentCancel}
                        className="flex-1 bg-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          valve.status === 'open' ? 'bg-emerald-500' :
                          valve.status === 'closed' ? 'bg-gray-400' : 'bg-red-500'
                        }`}
                        style={{ width: `${valve.openingPercentage}%` }}
                      />
                    </div>
                    <button
                      onClick={() => handleAdjustmentStart(valve.id, valve.openingPercentage)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Ajuster l'ouverture
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Dernière opération:</span>
                <span className="font-medium">{formatLastOperation(valve.lastOperation)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nb opérations:</span>
                <span className="font-medium">{valve.operationCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex space-x-2">
              <button
                onClick={() => onToggleValve(valve.id)}
                disabled={valve.status === 'error'}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  valve.status === 'open'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {valve.status === 'open' ? (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Fermer</span>
                  </>
                ) : (
                  <>
                    <CircleDot className="w-4 h-4" />
                    <span>Ouvrir</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => onEditValve(valve)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onDeleteValve(valve.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {valves.length === 0 && (
        <div className="text-center py-12">
          <CircleDot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune vanne configurée</h3>
          <p className="text-gray-600 mb-4">Ajoutez votre première électrovanne pour commencer</p>
          <button
            onClick={onAddValve}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Ajouter une vanne
          </button>
        </div>
      )}
    </div>
  );
};

export default ValveManagement;