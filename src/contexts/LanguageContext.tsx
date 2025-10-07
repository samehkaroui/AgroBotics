import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, Translations } from '../types';

const translations: Translations = {
  dashboard: { fr: 'Tableau de bord', ar: 'لوحة التحكم', en: 'Dashboard' },
  sensors: { fr: 'Capteurs', ar: 'أجهزة الاستشعار', en: 'Sensors' },
  programming: { fr: 'Programmation', ar: 'البرمجة', en: 'Programming' },
  history: { fr: 'Historique', ar: 'السجل', en: 'History' },
  settings: { fr: 'Paramètres', ar: 'الإعدادات', en: 'Settings' },
  equipment: { fr: 'Équipements', ar: 'المعدات', en: 'Equipment' },
  users: { fr: 'Utilisateurs', ar: 'المستخدمون', en: 'Users' },
  pumps: { fr: 'Pompes', ar: 'المضخات', en: 'Pumps' },
  valves: { fr: 'Vannes', ar: 'الصمامات', en: 'Valves' },
  manualMode: { fr: 'Mode Manuel', ar: 'الوضع اليدوي', en: 'Manual Mode' },
  automaticMode: { fr: 'Mode Automatique', ar: 'الوضع التلقائي', en: 'Automatic Mode' },
  airTemp: { fr: 'Température Air', ar: 'درجة حرارة الهواء', en: 'Air Temperature' },
  airHumidity: { fr: 'Humidité Air', ar: 'رطوبة الهواء', en: 'Air Humidity' },
  soilHumidity: { fr: 'Humidité Sol', ar: 'رطوبة التربة', en: 'Soil Humidity' },
  waterLevel: { fr: 'Niveau d\'eau', ar: 'مستوى المياه', en: 'Water Level' },
  pressure: { fr: 'Pression Pompe', ar: 'ضغط المضخة', en: 'Pump Pressure' },
  nitrogen: { fr: 'Azote (N)', ar: 'النيتروجين', en: 'Nitrogen (N)' },
  phosphorus: { fr: 'Phosphore (P)', ar: 'الفوسفور', en: 'Phosphorus (P)' },
  potassium: { fr: 'Potassium (K)', ar: 'البوتاسيوم', en: 'Potassium (K)' },
  zone: { fr: 'Zone', ar: 'المنطقة', en: 'Zone' },
  active: { fr: 'Actif', ar: 'نشط', en: 'Active' },
  inactive: { fr: 'Inactif', ar: 'غير نشط', en: 'Inactive' },
  scheduled: { fr: 'Programmé', ar: 'مجدول', en: 'Scheduled' },
  alerts: { fr: 'Alertes', ar: 'التنبيهات', en: 'Alerts' },
  waterConsumption: { fr: 'Consommation d\'eau', ar: 'استهلاك المياه', en: 'Water Consumption' },
  today: { fr: 'Aujourd\'hui', ar: 'اليوم', en: 'Today' },
  thisWeek: { fr: 'Cette semaine', ar: 'هذا الأسبوع', en: 'This Week' },
  on: { fr: 'ON', ar: 'تشغيل', en: 'ON' },
  off: { fr: 'OFF', ar: 'إيقاف', en: 'OFF' },
  pump: { fr: 'Pompe', ar: 'المضخة', en: 'Pump' },
  systemStatus: { fr: 'État du Système', ar: 'حالة النظام', en: 'System Status' },
  running: { fr: 'En marche', ar: 'يعمل', en: 'Running' },
  stopped: { fr: 'Arrêtée', ar: 'متوقف', en: 'Stopped' },
  maintenance: { fr: 'Maintenance', ar: 'صيانة', en: 'Maintenance' },
  error: { fr: 'Erreur', ar: 'خطأ', en: 'Error' },
  open: { fr: 'Ouverte', ar: 'مفتوح', en: 'Open' },
  closed: { fr: 'Fermée', ar: 'مغلق', en: 'Closed' },
  offline: { fr: 'Hors ligne', ar: 'غير متصل', en: 'Offline' },
  admin: { fr: 'Administrateur', ar: 'مدير', en: 'Administrator' },
  operator: { fr: 'Opérateur', ar: 'مشغل', en: 'Operator' },
  viewer: { fr: 'Observateur', ar: 'مراقب', en: 'Viewer' },
  login: { fr: 'Connexion', ar: 'تسجيل الدخول', en: 'Login' },
  logout: { fr: 'Déconnexion', ar: 'تسجيل الخروج', en: 'Logout' },
  username: { fr: 'Nom d\'utilisateur', ar: 'اسم المستخدم', en: 'Username' },
  password: { fr: 'Mot de passe', ar: 'كلمة المرور', en: 'Password' },
  // History page translations
  historicalDataAnalysis: { fr: 'Analyse des données historiques et rapports', ar: 'تحليل البيانات التاريخية والتقارير', en: 'Historical data analysis and reports' },
  refresh: { fr: 'Actualiser', ar: 'تحديث', en: 'Refresh' },
  export: { fr: 'Exporter', ar: 'تصدير', en: 'Export' },
  last7Days: { fr: '7 derniers jours', ar: 'آخر 7 أيام', en: 'Last 7 days' },
  last30Days: { fr: '30 derniers jours', ar: 'آخر 30 يوماً', en: 'Last 30 days' },
  last3Months: { fr: '3 derniers mois', ar: 'آخر 3 أشهر', en: 'Last 3 months' },
  lastYear: { fr: '1 année', ar: 'السنة الماضية', en: '1 year' },
  allMetrics: { fr: 'Toutes les métriques', ar: 'جميع المقاييس', en: 'All metrics' },
  waterConsumptionMetric: { fr: 'Consommation d\'eau', ar: 'استهلاك المياه', en: 'Water consumption' },
  sensorData: { fr: 'Données capteurs', ar: 'بيانات الحساسات', en: 'Sensor data' },
  equipmentData: { fr: 'Équipements', ar: 'المعدات', en: 'Equipment' },
  temperature: { fr: 'Température', ar: 'درجة الحرارة', en: 'Temperature' },
  humidity: { fr: 'Humidité', ar: 'الرطوبة', en: 'Humidity' },
  soilMoisture: { fr: 'Humidité du sol', ar: 'رطوبة التربة', en: 'Soil moisture' },
  pumpHours: { fr: 'Heures pompe', ar: 'ساعات المضخة', en: 'Pump hours' },
  totalAlerts: { fr: 'Total alertes', ar: 'إجمالي التنبيهات', en: 'Total alerts' },
  average: { fr: 'Moyenne', ar: 'المتوسط', en: 'Average' },
  day: { fr: 'jour', ar: 'يوم', en: 'day' },
  detailedData: { fr: 'Données Détaillées', ar: 'البيانات التفصيلية', en: 'Detailed Data' },
  date: { fr: 'Date', ar: 'التاريخ', en: 'Date' },
  consumption: { fr: 'Consommation', ar: 'الاستهلاك', en: 'Consumption' },
  email: { fr: 'Email', ar: 'البريد الإلكتروني', en: 'Email' },
  save: { fr: 'Sauvegarder', ar: 'حفظ', en: 'Save' },
  cancel: { fr: 'Annuler', ar: 'إلغاء', en: 'Cancel' },
  delete: { fr: 'Supprimer', ar: 'حذف', en: 'Delete' },
  edit: { fr: 'Modifier', ar: 'تعديل', en: 'Edit' },
  add: { fr: 'Ajouter', ar: 'إضافة', en: 'Add' },
  search: { fr: 'Rechercher', ar: 'البحث', en: 'Search' },
  filter: { fr: 'Filtrer', ar: 'تصفية', en: 'Filter' },
  location: { fr: 'Emplacement', ar: 'الموقع', en: 'Location' },
  model: { fr: 'Modèle', ar: 'الطراز', en: 'Model' },
  serialNumber: { fr: 'Numéro de série', ar: 'الرقم التسلسلي', en: 'Serial Number' },
  lastMaintenance: { fr: 'Dernière maintenance', ar: 'الصيانة الأخيرة', en: 'Last Maintenance' },
  nextMaintenance: { fr: 'Prochaine maintenance', ar: 'الصيانة القادمة', en: 'Next Maintenance' },
  flowRate: { fr: 'Débit', ar: 'معدل التدفق', en: 'Flow Rate' },
  power: { fr: 'Puissance', ar: 'القوة', en: 'Power' },
  totalHours: { fr: 'Heures totales', ar: 'إجمالي الساعات', en: 'Total Hours' },
  batteryLevel: { fr: 'Niveau batterie', ar: 'مستوى البطارية', en: 'Battery Level' },
  calibration: { fr: 'Calibrage', ar: 'المعايرة', en: 'Calibration' },
  thresholds: { fr: 'Seuils', ar: 'العتبات', en: 'Thresholds' },
  permissions: { fr: 'Permissions', ar: 'الصلاحيات', en: 'Permissions' },
  role: { fr: 'Rôle', ar: 'الدور', en: 'Role' },
  lastLogin: { fr: 'Dernière connexion', ar: 'آخر تسجيل دخول', en: 'Last Login' },
  activityLog: { fr: 'Journal d\'activité', ar: 'سجل النشاط', en: 'Activity Log' },
  equipmentManagement: { fr: 'Gestion des équipements', ar: 'إدارة المعدات', en: 'Equipment Management' },
  userManagement: { fr: 'Gestion des utilisateurs', ar: 'إدارة المستخدمين', en: 'User Management' },
  // Hardware Monitor translations
  realTimeHardwareMonitoring: { fr: 'Surveillance Matériel en Temps Réel', ar: 'مراقبة الأجهزة الحقيقية', en: 'Real-Time Hardware Monitoring' },
  liveDataFromDevices: { fr: 'Données en direct des appareils et capteurs', ar: 'بيانات مباشرة من الأجهزة والحساسات', en: 'Live data from devices and sensors' },
  connected: { fr: 'Connecté', ar: 'متصل', en: 'Connected' },
  liveSensorReadings: { fr: 'Lectures de Capteurs en Direct', ar: 'قراءات الحساسات المباشرة', en: 'Live Sensor Readings' },
  hardwareStatus: { fr: 'État du Matériel', ar: 'حالة الأجهزة', en: 'Hardware Status' },
  current: { fr: 'Courant', ar: 'التيار', en: 'Current' },
  voltage: { fr: 'Tension', ar: 'الجهد', en: 'Voltage' },
  openingPercentage: { fr: 'Pourcentage d\'ouverture', ar: 'نسبة الفتح', en: 'Opening Percentage' },
  deviceRunning: { fr: 'En marche', ar: 'يعمل', en: 'Running' },
  deviceStopped: { fr: 'Arrêté', ar: 'متوقف', en: 'Stopped' },
  deviceOpen: { fr: 'Ouvert', ar: 'مفتوح', en: 'Open' },
  deviceClosed: { fr: 'Fermé', ar: 'مغلق', en: 'Closed' },
  recentReadings: { fr: 'Lectures Récentes', ar: 'القراءات الأخيرة', en: 'Recent Readings' },
  sensor: { fr: 'Capteur', ar: 'الحساس', en: 'Sensor' },
  value: { fr: 'Valeur', ar: 'القيمة', en: 'Value' },
  time: { fr: 'Heure', ar: 'الوقت', en: 'Time' },
  unit: { fr: 'Unité', ar: 'الوحدة', en: 'Unit' },
  noDevicesConnected: { fr: 'Aucun appareil connecté', ar: 'لا توجد أجهزة متصلة', en: 'No devices connected' },
  startDevicesForData: { fr: 'Démarrez les appareils pour obtenir des données', ar: 'قم بتشغيل الأجهزة للحصول على البيانات', en: 'Start devices to get data' },
  noReadingsYet: { fr: 'Aucune lecture pour le moment', ar: 'لا توجد قراءات حتى الآن', en: 'No readings yet' },
  noReadings: { fr: 'Aucune lecture', ar: 'لا توجد قراءات', en: 'No readings' },
  since: { fr: 'Il y a', ar: 'منذ', en: 'Since' },
  seconds: { fr: 'secondes', ar: 'ثانية', en: 'seconds' },
  minutes: { fr: 'minutes', ar: 'دقيقة', en: 'minutes' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Force French as default, ignore localStorage for now
    console.log('🔍 Language Context: Forcing French as default');
    localStorage.removeItem('irrigation_language'); // Clear any saved language
    return 'fr';
  });

  // Save language to localStorage when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('irrigation_language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key]?.[language] || key;
    if (key === 'history') {
      console.log('🔍 Translating "history":', { key, language, translation });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};