export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  icon: string;
  lastUpdate?: string;
  batteryLevel?: number;
  location?: string;
}

export interface ZoneData {
  id: string;
  name: string;
  soilHumidity: number;
  status: 'active' | 'inactive' | 'scheduled';
  lastWatered: string;
  cropType?: string;
  area?: number;
}

export interface ScheduleItem {
  id: string;
  zoneId?: string;
  zone?: string;
  zoneName?: string;
  startTime: string;
  duration: number;
  days?: string[];
  frequency?: string;
  active?: boolean;
  isActive?: boolean;
  lastRun?: string;
  nextRun?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
  equipmentId?: string;
  userId?: string;
}

export interface SystemStatus {
  mode: 'manual' | 'automatic';
  pumpStatus: 'on' | 'off';
  waterLevel: number;
  pressure: number;
  lastUpdate: string;
}

export interface Pump {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'maintenance' | 'error';
  flowRate: number;
  pressure: number;
  power: number;
  totalHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  model: string;
}

export interface Valve {
  id: string;
  name: string;
  zoneId: string;
  status: 'open' | 'closed' | 'error';
  openingPercentage: number;
  lastOperation: string;
  operationCount: number;
  type: 'solenoid' | 'motorized' | 'manual';
  location: string;
}

export interface SensorConfig {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'soil_moisture' | 'npk' | 'ph' | 'light';
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  location: string;
  zoneId?: string;
  batteryLevel: number;
  lastCalibration: string;
  nextCalibration: string;
  minValue: number;
  maxValue: number;
  alertThresholds: {
    min: number;
    max: number;
  };
  model: string;
  serialNumber: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  fullName: string;
  lastLogin: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  equipmentId?: string;
  timestamp: string;
  details: string;
  category: 'pump' | 'valve' | 'sensor' | 'user' | 'system';
}

export type Language = 'fr' | 'ar' | 'en';

export interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
    en: string;
  };
}