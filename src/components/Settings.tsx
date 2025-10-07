import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Bell, 
  Thermometer,
  Save,
  RotateCcw,
  Mail,
  Smartphone,
  MessageSquare,
  Clock,
  Shield,
  Database,
  HardDrive,
  Cpu,
  Activity
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const [settings, setSettings] = useState({
    // Thresholds
    tempMin: 18,
    tempMax: 35,
    humidityMin: 40,
    humidityMax: 80,
    soilHumidityMin: 30,
    soilHumidityMax: 80,
    npkLimits: {
      nitrogen: { min: 50, max: 200 },
      phosphorus: { min: 20, max: 80 },
      potassium: { min: 80, max: 250 }
    },
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    criticalAlertsOnly: false,
    // System
    autoMode: true,
    waterSaving: true,
    nightMode: false,
    // Network
    wifiSSID: 'AgriNetwork',
    mqttBroker: 'mqtt.agrtech.com',
    dataRetention: 365,
    backupFrequency: 'daily',
    // Notification Settings
    notificationChannels: {
      email: true,
      sms: false,
      push: true,
      webhook: false
    },
    notificationTypes: {
      critical: true,
      maintenance: true,
      irrigation: true,
      reports: false
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    },
    // Security
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireSpecialChars: true,
      requireNumbers: true
    },
    // Language
    selectedLanguage: language
  });

  const handleSave = () => {
    setLanguage(settings.selectedLanguage);
    // Here you would typically save to backend/localStorage
    console.log('Settings saved:', settings);
    alert('Paramètres sauvegardés avec succès!');
  };

  const handleReset = () => {
    if (confirm('Réinitialiser tous les paramètres aux valeurs par défaut?')) {
      // Reset to defaults
      setSettings({
        tempMin: 18,
        tempMax: 35,
        humidityMin: 40,
        humidityMax: 80,
        soilHumidityMin: 30,
        soilHumidityMax: 80,
        npkLimits: {
          nitrogen: { min: 50, max: 200 },
          phosphorus: { min: 20, max: 80 },
          potassium: { min: 80, max: 250 }
        },
        emailNotifications: true,
        smsNotifications: false,
        criticalAlertsOnly: false,
        autoMode: true,
        waterSaving: true,
        nightMode: false,
        wifiSSID: 'AgriNetwork',
        mqttBroker: 'mqtt.agrtech.com',
        dataRetention: 365,
        backupFrequency: 'daily',
        notificationChannels: {
          email: true,
          sms: false,
          push: true,
          webhook: false
        },
        notificationTypes: {
          critical: true,
          maintenance: true,
          irrigation: true,
          reports: false
        },
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '07:00'
        },
        sessionTimeout: 30,
        passwordPolicy: {
          minLength: 8,
          requireSpecialChars: true,
          requireNumbers: true
        },
        selectedLanguage: 'fr'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Configuration du système d'irrigation</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Réinitialiser</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            <Save className="w-5 h-5" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Paramètres de Notification</h3>
          </div>
          
          <div className="space-y-6">
            {/* Notification Channels */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Canaux de Notification</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email</span>
                      <p className="text-xs text-gray-500">Notifications par email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationChannels.email}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notificationChannels: { ...prev.notificationChannels, email: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">SMS</span>
                      <p className="text-xs text-gray-500">Notifications par SMS</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationChannels.sms}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notificationChannels: { ...prev.notificationChannels, sms: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Push</span>
                      <p className="text-xs text-gray-500">Notifications push</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationChannels.push}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notificationChannels: { ...prev.notificationChannels, push: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Notification Types */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Types d'Alertes</h4>
              <div className="space-y-3">
                {[
                  { key: 'critical', label: 'Alertes Critiques', desc: 'Pannes et urgences' },
                  { key: 'maintenance', label: 'Maintenance', desc: 'Rappels de maintenance' },
                  { key: 'irrigation', label: 'Irrigation', desc: 'Événements d\'irrigation' },
                  { key: 'reports', label: 'Rapports', desc: 'Rapports automatiques' }
                ].map((type) => (
                  <div key={type.key} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notificationTypes[type.key as keyof typeof settings.notificationTypes]}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notificationTypes: { ...prev.notificationTypes, [type.key]: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quiet Hours */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Heures Silencieuses</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Mode Ne Pas Déranger</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.quietHours.enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, enabled: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                
                {settings.quietHours.enabled && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <input
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, start: e.target.value }
                      }))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-500">à</span>
                    <input
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, end: e.target.value }
                      }))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Thresholds */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Thermometer className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Seuils Environnementaux</h3>
          </div>
          
          <div className="space-y-4">
            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Température (°C)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    value={settings.tempMin}
                    onChange={(e) => setSettings(prev => ({ ...prev, tempMin: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    value={settings.tempMax}
                    onChange={(e) => setSettings(prev => ({ ...prev, tempMax: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Air Humidity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidité de l'air (%)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    value={settings.humidityMin}
                    onChange={(e) => setSettings(prev => ({ ...prev, humidityMin: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    value={settings.humidityMax}
                    onChange={(e) => setSettings(prev => ({ ...prev, humidityMax: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Soil Humidity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidité du sol (%)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    value={settings.soilHumidityMin}
                    onChange={(e) => setSettings(prev => ({ ...prev, soilHumidityMin: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    value={settings.soilHumidityMax}
                    onChange={(e) => setSettings(prev => ({ ...prev, soilHumidityMax: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout de session (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Politique de mot de passe
              </label>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Longueur minimale: {settings.passwordPolicy.minLength}</span>
                  <input
                    type="range"
                    min="6"
                    max="20"
                    value={settings.passwordPolicy.minLength}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value) }
                    }))}
                    className="w-24"
                  />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Caractères spéciaux requis</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.passwordPolicy.requireSpecialChars}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, requireSpecialChars: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chiffres requis</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.passwordPolicy.requireNumbers}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, requireNumbers: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Gestion des Données</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rétention des données (jours)
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => setSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={30}>30 jours</option>
                <option value={90}>90 jours</option>
                <option value={365}>1 an</option>
                <option value={730}>2 ans</option>
                <option value={-1}>Illimitée</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence de sauvegarde
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="hourly">Toutes les heures</option>
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <HardDrive className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Activity className="w-4 h-4" />
                  <span>Restaurer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Cpu className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Système</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">CPU</span>
                </div>
                <p className="text-lg font-bold text-blue-900">23%</p>
                <div className="w-full bg-blue-200 rounded-full h-1 mt-1">
                  <div className="bg-blue-600 h-1 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <HardDrive className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Mémoire</span>
                </div>
                <p className="text-lg font-bold text-green-900">67%</p>
                <div className="w-full bg-green-200 rounded-full h-1 mt-1">
                  <div className="bg-green-600 h-1 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Database className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-800">Stockage</span>
              </div>
              <p className="text-lg font-bold text-orange-900">2.4 GB / 10 GB</p>
              <div className="w-full bg-orange-200 rounded-full h-1 mt-1">
                <div className="bg-orange-600 h-1 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uptime système</span>
                  <span>15 jours, 7h 23min</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Dernière sauvegarde</span>
                  <span>Il y a 2 heures</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Version système</span>
                  <span>AgroBotics v2.1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <SettingsIcon className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Système</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Mode Automatique</label>
                <p className="text-xs text-gray-500">Irrigation automatique selon programmation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoMode}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoMode: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Mode Économie d'Eau</label>
                <p className="text-xs text-gray-500">Optimiser la consommation d'eau</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.waterSaving}
                  onChange={(e) => setSettings(prev => ({ ...prev, waterSaving: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Language & Regional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Langue & Région</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue de l'interface
              </label>
              <select
                value={settings.selectedLanguage}
                onChange={(e) => setSettings(prev => ({ ...prev, selectedLanguage: e.target.value as 'fr' | 'ar' | 'en' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;