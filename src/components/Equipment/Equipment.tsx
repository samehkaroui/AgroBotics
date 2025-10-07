import React, { useState } from 'react';
import { 
  Wrench, 
  Power, 
  CircleDot, 
  Thermometer, 
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Plus,
  X,
  Save
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import PumpManagement from './PumpManagement';
import ValveManagement from './ValveManagement';
import SensorManagement from './SensorManagement';
import { Pump, Valve, SensorConfig, ZoneData } from '../../types';

interface EquipmentProps {
  pumps: Pump[];
  valves: Valve[];
  sensors: SensorConfig[];
  zones: ZoneData[];
  onTogglePump: (pumpId: string) => void;
  onToggleValve: (valveId: string) => void;
  onEditPump: (pump: Pump) => void;
  onEditValve: (valve: Valve) => void;
  onEditSensor: (sensor: SensorConfig) => void;
  onDeletePump: (pumpId: string) => void;
  onDeleteValve: (valveId: string) => void;
  onDeleteSensor: (sensorId: string) => void;
  onAddPump: () => void;
  onAddValve: () => void;
  onAddSensor: () => void;
  onAdjustValve: (valveId: string, percentage: number) => void;
  onCalibrateSensor: (sensorId: string) => void;
}

const Equipment: React.FC<EquipmentProps> = ({
  pumps,
  valves,
  sensors,
  zones,
  onTogglePump,
  onToggleValve,
  onEditPump,
  onEditValve,
  onEditSensor,
  onDeletePump,
  onDeleteValve,
  onDeleteSensor,
  onAddPump,
  onAddValve,
  onAddSensor,
  onAdjustValve,
  onCalibrateSensor
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pumps' | 'valves' | 'sensors'>('pumps');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    model: '',
    location: '',
    type: '',
    zoneId: ''
  });

  const tabs = [
    {
      id: 'pumps' as const,
      label: t('pumps'),
      icon: Power,
      count: pumps.length,
    },
    {
      id: 'valves' as const,
      label: t('valves'),
      icon: CircleDot,
      count: valves.length,
    },
    {
      id: 'sensors' as const,
      label: t('sensors'),
      icon: Thermometer,
      count: sensors.length,
    },
  ];

  const handleAddEquipment = () => {
    setShowAddModal(true);
  };

  const handleSaveEquipment = () => {
    if (newEquipment.name && newEquipment.model && newEquipment.location) {
      // Simuler l'ajout selon le type
      switch (activeTab) {
        case 'pumps':
          console.log('Nouvelle pompe:', newEquipment);
          onAddPump();
          break;
        case 'valves':
          console.log('Nouvelle vanne:', newEquipment);
          onAddValve();
          break;
        case 'sensors':
          console.log('Nouveau capteur:', newEquipment);
          onAddSensor();
          break;
      }
      
      alert(`${activeTab === 'pumps' ? 'Pompe' : activeTab === 'valves' ? 'Vanne' : 'Capteur'} ajouté(e) avec succès!`);
      
      // Réinitialiser le formulaire
      setNewEquipment({
        name: '',
        model: '',
        location: '',
        type: '',
        zoneId: ''
      });
      setShowAddModal(false);
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };
  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Wrench className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('equipmentManagement')}</h1>
            <p className="text-gray-600">Gestion et monitoring des équipements du système</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-emerald-50 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">
              {pumps.filter(p => p.status === 'running').length + valves.filter(v => v.status === 'open').length} Actifs
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-orange-50 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              {pumps.filter(p => p.status === 'maintenance').length + sensors.filter(s => s.status === 'maintenance').length} Maintenance
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-red-50 rounded-lg px-3 py-2">
            <Activity className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              {pumps.filter(p => p.status === 'error').length + valves.filter(v => v.status === 'error').length + sensors.filter(s => s.status === 'error').length} Erreurs
            </span>
          </div>
          <button
            onClick={handleAddEquipment}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Equipment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Power className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pompes</p>
              <p className="text-2xl font-bold text-gray-900">{pumps.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">{pumps.filter(p => p.status === 'running').length} en marche</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CircleDot className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vannes</p>
              <p className="text-2xl font-bold text-gray-900">{valves.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">{valves.filter(v => v.status === 'open').length} ouvertes</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Thermometer className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Capteurs</p>
              <p className="text-2xl font-bold text-gray-900">{sensors.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">{sensors.filter(s => s.status === 'active').length} actifs</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Efficacité</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600">+2.3% ce mois</span>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'pumps' && (
          <PumpManagement
            pumps={pumps}
            onTogglePump={onTogglePump}
            onEditPump={onEditPump}
            onDeletePump={onDeletePump}
            onAddPump={onAddPump}
          />
        )}
        
        {activeTab === 'valves' && (
          <ValveManagement
            valves={valves}
            zones={zones}
            onToggleValve={onToggleValve}
            onEditValve={onEditValve}
            onDeleteValve={onDeleteValve}
            onAddValve={onAddValve}
            onAdjustValve={onAdjustValve}
          />
        )}
        
        {activeTab === 'sensors' && (
          <SensorManagement
            sensors={sensors}
            onEditSensor={onEditSensor}
            onDeleteSensor={onDeleteSensor}
            onAddSensor={onAddSensor}
            onCalibrateSensor={onCalibrateSensor}
          />
        )}
      </div>
      </div>
      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nouveau{activeTab === 'pumps' ? 'lle Pompe' : activeTab === 'valves' ? 'lle Vanne' : ' Capteur'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={`Nom de la ${activeTab === 'pumps' ? 'pompe' : activeTab === 'valves' ? 'vanne' : 'capteur'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modèle *
                </label>
                <input
                  type="text"
                  value={newEquipment.model}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Modèle de l'équipement"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emplacement *
                </label>
                <input
                  type="text"
                  value={newEquipment.location}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Emplacement physique"
                />
              </div>
              
              {activeTab === 'valves' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone associée
                  </label>
                  <select
                    value={newEquipment.zoneId}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, zoneId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Sélectionner une zone</option>
                    {zones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {activeTab === 'sensors' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de capteur *
                  </label>
                  <select
                    value={newEquipment.type}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="temperature">Température</option>
                    <option value="humidity">Humidité</option>
                    <option value="soil_moisture">Humidité du sol</option>
                    <option value="npk">NPK</option>
                    <option value="ph">pH</option>
                    <option value="light">Luminosité</option>
                  </select>
                </div>
              )}
              
              {activeTab === 'valves' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de vanne *
                  </label>
                  <select
                    value={newEquipment.type}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="solenoid">Électrovanne</option>
                    <option value="motorized">Vanne motorisée</option>
                    <option value="manual">Vanne manuelle</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEquipment}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Créer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Equipment;