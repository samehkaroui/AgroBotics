import { SensorData, ZoneData, Alert, SystemStatus, ScheduleItem, Pump, Valve, SensorConfig, User, ActivityLog } from '../types';

export const mockSensorData: SensorData[] = [
  {
    id: '1',
    name: 'airTemp',
    value: 24.5,
    unit: '°C',
    status: 'normal',
    icon: 'thermometer',
    lastUpdate: '2025-01-15T09:30:00Z',
    location: 'Serre A'
  },
  {
    id: '2',
    name: 'airHumidity',
    value: 65,
    unit: '%',
    status: 'normal',
    icon: 'droplets',
    lastUpdate: '2025-01-15T09:30:00Z',
    location: 'Serre A'
  },
  {
    id: '3',
    name: 'waterLevel',
    value: 85,
    unit: '%',
    status: 'normal',
    icon: 'waves',
    lastUpdate: '2025-01-15T09:30:00Z',
    location: 'Réservoir principal'
  },
  {
    id: '4',
    name: 'pressure',
    value: 2.3,
    unit: 'bar',
    status: 'normal',
    icon: 'gauge',
    lastUpdate: '2025-01-15T09:30:00Z',
    location: 'Station pompage'
  },
  {
    id: '5',
    name: 'nitrogen',
    value: 120,
    unit: 'ppm',
    status: 'warning',
    icon: 'flask',
    lastUpdate: '2025-01-15T09:30:00Z',
    location: 'Zone A'
  },
  {
    id: '6',
    name: 'phosphorus',
    value: 45,
    unit: 'ppm',
    status: 'normal',
    icon: 'flask',
    lastUpdate: '2025-01-15T09:30:00Z',
    location: 'Zone A'
  },
  {
    id: '7',
    name: 'potassium',
    value: 180,
    unit: 'ppm',
    status: 'normal',
    icon: 'flask',
    lastUpdate: '2025-01-15T09:30:00Z',
    location: 'Zone A'
  }
];

export const mockZoneData: ZoneData[] = [
  {
    id: '1',
    name: 'Zone A - Tomates',
    soilHumidity: 75,
    status: 'active',
    lastWatered: '2025-01-15T08:30:00Z',
    cropType: 'Tomates',
    area: 250
  },
  {
    id: '2',
    name: 'Zone B - Laitues',
    soilHumidity: 45,
    status: 'scheduled',
    lastWatered: '2025-01-14T18:00:00Z',
    cropType: 'Laitues',
    area: 180
  },
  {
    id: '3',
    name: 'Zone C - Concombres',
    soilHumidity: 82,
    status: 'inactive',
    lastWatered: '2025-01-15T06:15:00Z',
    cropType: 'Concombres',
    area: 320
  },
  {
    id: '4',
    name: 'Zone D - Poivrons',
    soilHumidity: 38,
    status: 'scheduled',
    lastWatered: '2025-01-14T16:45:00Z',
    cropType: 'Poivrons',
    area: 200
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Niveau d\'azote élevé détecté dans la zone A',
    timestamp: '2025-01-15T09:15:00Z',
    read: false,
    equipmentId: '5',
    userId: '2'
  },
  {
    id: '2',
    type: 'info',
    message: 'Irrigation automatique programmée pour 14h30',
    timestamp: '2025-01-15T08:45:00Z',
    read: false,
    userId: '1'
  },
  {
    id: '3',
    type: 'error',
    message: 'Niveau d\'eau bas - Réservoir à 15%',
    timestamp: '2025-01-15T07:20:00Z',
    read: true,
    equipmentId: '3',
    userId: '2'
  }
];

export const mockSystemStatus: SystemStatus = {
  mode: 'automatic',
  pumpStatus: 'off',
  waterLevel: 85,
  pressure: 2.3,
  lastUpdate: '2025-01-15T09:30:00Z'
};

export const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    zoneId: '1',
    startTime: '06:00',
    duration: 30,
    days: ['lundi', 'mercredi', 'vendredi'],
    active: true
  },
  {
    id: '2',
    zoneId: '2',
    startTime: '14:30',
    duration: 45,
    days: ['mardi', 'jeudi', 'samedi'],
    active: true
  },
  {
    id: '3',
    zoneId: '3',
    startTime: '18:00',
    duration: 25,
    days: ['lundi', 'mercredi', 'vendredi', 'dimanche'],
    active: false
  }
];

export const mockPumps: Pump[] = [
  {
    id: '1',
    name: 'Pompe Principale',
    status: 'running',
    flowRate: 150,
    pressure: 2.3,
    power: 5.5,
    totalHours: 2847,
    lastMaintenance: '2024-12-01T00:00:00Z',
    nextMaintenance: '2025-03-01T00:00:00Z',
    location: 'Station de pompage A',
    model: 'Grundfos CR 15-2'
  },
  {
    id: '2',
    name: 'Pompe Secondaire',
    status: 'stopped',
    flowRate: 0,
    pressure: 0,
    power: 3.0,
    totalHours: 1523,
    lastMaintenance: '2024-11-15T00:00:00Z',
    nextMaintenance: '2025-02-15T00:00:00Z',
    location: 'Station de pompage B',
    model: 'Wilo VeroTwin-DP'
  },
  {
    id: '3',
    name: 'Pompe de Surpression',
    status: 'maintenance',
    flowRate: 0,
    pressure: 0,
    power: 2.2,
    totalHours: 3241,
    lastMaintenance: '2025-01-10T00:00:00Z',
    nextMaintenance: '2025-04-10T00:00:00Z',
    location: 'Local technique',
    model: 'Pedrollo JSWm 2AX'
  }
];

export const mockValves: Valve[] = [
  {
    id: '1',
    name: 'Électrovanne Zone A',
    zoneId: '1',
    status: 'open',
    openingPercentage: 100,
    lastOperation: '2025-01-15T08:30:00Z',
    operationCount: 1247,
    type: 'solenoid',
    location: 'Zone A - Secteur Nord'
  },
  {
    id: '2',
    name: 'Électrovanne Zone B',
    zoneId: '2',
    status: 'closed',
    openingPercentage: 0,
    lastOperation: '2025-01-14T18:00:00Z',
    operationCount: 892,
    type: 'solenoid',
    location: 'Zone B - Secteur Centre'
  },
  {
    id: '3',
    name: 'Vanne Motorisée Zone C',
    zoneId: '3',
    status: 'closed',
    openingPercentage: 25,
    lastOperation: '2025-01-15T06:15:00Z',
    operationCount: 445,
    type: 'motorized',
    location: 'Zone C - Secteur Sud'
  },
  {
    id: '4',
    name: 'Électrovanne Zone D',
    zoneId: '4',
    status: 'closed',
    openingPercentage: 0,
    lastOperation: '2025-01-14T16:45:00Z',
    operationCount: 656,
    type: 'solenoid',
    location: 'Zone D - Secteur Est'
  },
  {
    id: '5',
    name: 'Vanne Principale',
    zoneId: '1',
    status: 'open',
    openingPercentage: 80,
    lastOperation: '2025-01-15T09:00:00Z',
    operationCount: 2134,
    type: 'motorized',
    location: 'Distribution principale'
  }
];

export const mockSensorConfigs: SensorConfig[] = [
  {
    id: '1',
    name: 'Capteur Température Serre A',
    type: 'temperature',
    status: 'active',
    location: 'Serre A - Centre',
    zoneId: '1',
    batteryLevel: 87,
    lastCalibration: '2024-11-15T00:00:00Z',
    nextCalibration: '2025-02-15T00:00:00Z',
    minValue: -10,
    maxValue: 50,
    alertThresholds: { min: 15, max: 35 },
    model: 'SenseCAP S2103',
    serialNumber: 'SC2103-A001'
  },
  {
    id: '2',
    name: 'Capteur Humidité Sol Zone A',
    type: 'soil_moisture',
    status: 'active',
    location: 'Zone A - Secteur 1',
    zoneId: '1',
    batteryLevel: 92,
    lastCalibration: '2024-12-01T00:00:00Z',
    nextCalibration: '2025-03-01T00:00:00Z',
    minValue: 0,
    maxValue: 100,
    alertThresholds: { min: 30, max: 80 },
    model: 'Decagon 5TM',
    serialNumber: '5TM-B002'
  },
  {
    id: '3',
    name: 'Capteur NPK Zone A',
    type: 'npk',
    status: 'maintenance',
    location: 'Zone A - Point central',
    zoneId: '1',
    batteryLevel: 34,
    lastCalibration: '2024-10-01T00:00:00Z',
    nextCalibration: '2025-01-20T00:00:00Z',
    minValue: 0,
    maxValue: 500,
    alertThresholds: { min: 50, max: 300 },
    model: 'Yara N-Sensor ALS',
    serialNumber: 'YN-ALS-C003'
  },
  {
    id: '4',
    name: 'Capteur pH Zone B',
    type: 'ph',
    status: 'active',
    location: 'Zone B - Irrigation',
    zoneId: '2',
    batteryLevel: 76,
    lastCalibration: '2024-11-20T00:00:00Z',
    nextCalibration: '2025-02-20T00:00:00Z',
    minValue: 0,
    maxValue: 14,
    alertThresholds: { min: 5.5, max: 7.5 },
    model: 'Hanna HI-2020',
    serialNumber: 'HI2020-D004'
  },
  {
    id: '5',
    name: 'Capteur Lumière Serre B',
    type: 'light',
    status: 'error',
    location: 'Serre B - Toit',
    batteryLevel: 12,
    lastCalibration: '2024-09-15T00:00:00Z',
    nextCalibration: '2024-12-15T00:00:00Z',
    minValue: 0,
    maxValue: 100000,
    alertThresholds: { min: 1000, max: 80000 },
    model: 'Apogee SQ-500',
    serialNumber: 'SQ500-E005'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@irrigationsystem.com',
    role: 'admin',
    fullName: 'Administrateur Système',
    lastLogin: '2025-01-15T10:30:00Z',
    isActive: true,
    permissions: ['all'],
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '2',
    username: 'operator',
    email: 'operator@irrigationsystem.com',
    role: 'operator',
    fullName: 'Jean Dupont',
    lastLogin: '2025-01-15T09:15:00Z',
    isActive: true,
    permissions: ['view_dashboard', 'control_irrigation', 'view_sensors', 'manage_schedules', 'manage_equipment'],
    createdAt: '2024-06-01T00:00:00Z',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '3',
    username: 'viewer',
    email: 'viewer@irrigationsystem.com',
    role: 'viewer',
    fullName: 'Marie Martin',
    lastLogin: '2025-01-14T16:45:00Z',
    isActive: true,
    permissions: ['view_dashboard', 'view_sensors', 'view_history'],
    createdAt: '2024-09-01T00:00:00Z',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '4',
    username: 'tech',
    email: 'tech@irrigationsystem.com',
    role: 'operator',
    fullName: 'Pierre Technicien',
    lastLogin: '2025-01-13T14:20:00Z',
    isActive: false,
    permissions: ['view_dashboard', 'manage_equipment', 'view_sensors'],
    createdAt: '2024-08-15T00:00:00Z'
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '2',
    action: 'Démarrage pompe principale',
    equipmentId: '1',
    timestamp: '2025-01-15T09:30:00Z',
    details: 'Démarrage manuel de la pompe principale',
    category: 'pump'
  },
  {
    id: '2',
    userId: '1',
    action: 'Modification utilisateur',
    timestamp: '2025-01-15T09:00:00Z',
    details: 'Modification des permissions utilisateur "operator"',
    category: 'user'
  },
  {
    id: '3',
    userId: '2',
    action: 'Ouverture vanne Zone A',
    equipmentId: '1',
    timestamp: '2025-01-15T08:30:00Z',
    details: 'Ouverture électrovanne Zone A à 100%',
    category: 'valve'
  },
  {
    id: '4',
    userId: '3',
    action: 'Consultation dashboard',
    timestamp: '2025-01-14T16:45:00Z',
    details: 'Accès au tableau de bord principal',
    category: 'system'
  },
  {
    id: '5',
    userId: '1',
    action: 'Calibrage capteur NPK',
    equipmentId: '3',
    timestamp: '2025-01-14T15:20:00Z',
    details: 'Calibrage du capteur NPK Zone A',
    category: 'sensor'
  }
];

export const generateChartData = (days: number) => {
  const data = [];
  const baseDate = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      temperature: Math.round((20 + Math.random() * 15) * 10) / 10,
      humidity: Math.round((40 + Math.random() * 40) * 10) / 10,
      soilHumidity: Math.round((30 + Math.random() * 50) * 10) / 10,
      waterConsumption: Math.round((50 + Math.random() * 200) * 10) / 10
    });
  }
  
  return data;
}