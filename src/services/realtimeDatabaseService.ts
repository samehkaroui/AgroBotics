import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  off,
  DataSnapshot
} from 'firebase/database';
import { database } from '../config/firebase';
import { User, Pump, Valve, SensorConfig, ZoneData, ScheduleItem, Alert, ActivityLog } from '../types';

// Database paths
const PATHS = {
  USERS: 'users',
  PUMPS: 'pumps',
  VALVES: 'valves',
  SENSORS: 'sensors',
  ZONES: 'zones',
  SCHEDULES: 'schedules',
  ALERTS: 'alerts',
  ACTIVITY_LOGS: 'activityLogs',
  HISTORY: 'history',
  // Hardware control paths
  HARDWARE_COMMANDS: 'hardware/commands',
  HARDWARE_STATUS: 'hardware/status',
  SENSOR_READINGS: 'hardware/sensorReadings'
};

// Generic CRUD operations for Realtime Database
export const realtimeDBService = {
  // Create with auto-generated ID
  async create<T>(path: string, data: Partial<T>): Promise<string> {
    try {
      const listRef = ref(database, path);
      const newRef = push(listRef);
      await set(newRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return newRef.key!;
    } catch (error) {
      console.error(`Error creating in ${path}:`, error);
      throw error;
    }
  },

  // Create with specific ID
  async createWithId<T>(path: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const itemRef = ref(database, `${path}/${id}`);
      await set(itemRef, {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error creating with ID in ${path}:`, error);
      throw error;
    }
  },

  // Read single item
  async getById<T>(path: string, id: string): Promise<T | null> {
    try {
      const itemRef = ref(database, `${path}/${id}`);
      const snapshot = await get(itemRef);
      
      if (snapshot.exists()) {
        return { id, ...snapshot.val() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting from ${path}:`, error);
      throw error;
    }
  },

  // Read all items
  async getAll<T>(path: string): Promise<T[]> {
    try {
      const listRef = ref(database, path);
      const snapshot = await get(listRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) as T[];
      }
      return [];
    } catch (error) {
      console.error(`Error getting all from ${path}:`, error);
      throw error;
    }
  },

  // Update item
  async update<T>(path: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const itemRef = ref(database, `${path}/${id}`);
      await update(itemRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error updating in ${path}:`, error);
      throw error;
    }
  },

  // Delete item
  async delete(path: string, id: string): Promise<void> {
    try {
      const itemRef = ref(database, `${path}/${id}`);
      await remove(itemRef);
    } catch (error) {
      console.error(`Error deleting from ${path}:`, error);
      throw error;
    }
  },

  // Real-time listener
  subscribe<T>(
    path: string,
    callback: (data: T[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    console.log(`🔥 Setting up real-time listener for: ${path}`);
    const listRef = ref(database, path);
    
    const listener = onValue(
      listRef,
      (snapshot: DataSnapshot) => {
        console.log(`📡 Real-time update received for ${path}:`, snapshot.exists());
        if (snapshot.exists()) {
          const data = snapshot.val();
          const items = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })) as T[];
          console.log(`✅ Parsed ${items.length} items from ${path}`);
          callback(items);
        } else {
          console.log(`⚠️ No data exists at ${path}`);
          callback([]);
        }
      },
      (error) => {
        console.error(`❌ Error in subscription for ${path}:`, error);
        if (errorCallback) errorCallback(error as Error);
      }
    );

    // Return unsubscribe function
    return () => {
      console.log(`🔌 Unsubscribing from ${path}`);
      off(listRef, 'value', listener);
    };
  }
};

// Specific service methods for each collection
export const userService = {
  getAll: () => realtimeDBService.getAll<User>(PATHS.USERS),
  getById: (id: string) => realtimeDBService.getById<User>(PATHS.USERS, id),
  create: (user: Partial<User>) => realtimeDBService.create<User>(PATHS.USERS, user),
  createWithId: (id: string, user: Partial<User>) => realtimeDBService.createWithId<User>(PATHS.USERS, id, user),
  update: (id: string, user: Partial<User>) => realtimeDBService.update<User>(PATHS.USERS, id, user),
  delete: (id: string) => realtimeDBService.delete(PATHS.USERS, id),
  subscribe: (callback: (users: User[]) => void) => 
    realtimeDBService.subscribe<User>(PATHS.USERS, callback)
};

export const pumpService = {
  getAll: () => realtimeDBService.getAll<Pump>(PATHS.PUMPS),
  getById: (id: string) => realtimeDBService.getById<Pump>(PATHS.PUMPS, id),
  create: (pump: Partial<Pump>) => realtimeDBService.create<Pump>(PATHS.PUMPS, pump),
  update: (id: string, pump: Partial<Pump>) => realtimeDBService.update<Pump>(PATHS.PUMPS, id, pump),
  delete: (id: string) => realtimeDBService.delete(PATHS.PUMPS, id),
  subscribe: (callback: (pumps: Pump[]) => void) => 
    realtimeDBService.subscribe<Pump>(PATHS.PUMPS, callback)
};

export const valveService = {
  getAll: () => realtimeDBService.getAll<Valve>(PATHS.VALVES),
  getById: (id: string) => realtimeDBService.getById<Valve>(PATHS.VALVES, id),
  create: (valve: Partial<Valve>) => realtimeDBService.create<Valve>(PATHS.VALVES, valve),
  update: (id: string, valve: Partial<Valve>) => realtimeDBService.update<Valve>(PATHS.VALVES, id, valve),
  delete: (id: string) => realtimeDBService.delete(PATHS.VALVES, id),
  subscribe: (callback: (valves: Valve[]) => void) => 
    realtimeDBService.subscribe<Valve>(PATHS.VALVES, callback)
};

export const sensorService = {
  getAll: () => realtimeDBService.getAll<SensorConfig>(PATHS.SENSORS),
  getById: (id: string) => realtimeDBService.getById<SensorConfig>(PATHS.SENSORS, id),
  create: (sensor: Partial<SensorConfig>) => realtimeDBService.create<SensorConfig>(PATHS.SENSORS, sensor),
  update: (id: string, sensor: Partial<SensorConfig>) => realtimeDBService.update<SensorConfig>(PATHS.SENSORS, id, sensor),
  delete: (id: string) => realtimeDBService.delete(PATHS.SENSORS, id),
  subscribe: (callback: (sensors: SensorConfig[]) => void) => 
    realtimeDBService.subscribe<SensorConfig>(PATHS.SENSORS, callback)
};

export const zoneService = {
  getAll: () => realtimeDBService.getAll<ZoneData>(PATHS.ZONES),
  getById: (id: string) => realtimeDBService.getById<ZoneData>(PATHS.ZONES, id),
  create: (zone: Partial<ZoneData>) => realtimeDBService.create<ZoneData>(PATHS.ZONES, zone),
  update: (id: string, zone: Partial<ZoneData>) => realtimeDBService.update<ZoneData>(PATHS.ZONES, id, zone),
  delete: (id: string) => realtimeDBService.delete(PATHS.ZONES, id),
  subscribe: (callback: (zones: ZoneData[]) => void) => 
    realtimeDBService.subscribe<ZoneData>(PATHS.ZONES, callback)
};

export const scheduleService = {
  getAll: () => realtimeDBService.getAll<ScheduleItem>(PATHS.SCHEDULES),
  getById: (id: string) => realtimeDBService.getById<ScheduleItem>(PATHS.SCHEDULES, id),
  create: (schedule: Partial<ScheduleItem>) => realtimeDBService.create<ScheduleItem>(PATHS.SCHEDULES, schedule),
  update: (id: string, schedule: Partial<ScheduleItem>) => realtimeDBService.update<ScheduleItem>(PATHS.SCHEDULES, id, schedule),
  delete: (id: string) => realtimeDBService.delete(PATHS.SCHEDULES, id),
  subscribe: (callback: (schedules: ScheduleItem[]) => void) => 
    realtimeDBService.subscribe<ScheduleItem>(PATHS.SCHEDULES, callback)
};

export const alertService = {
  getAll: () => realtimeDBService.getAll<Alert>(PATHS.ALERTS),
  getById: (id: string) => realtimeDBService.getById<Alert>(PATHS.ALERTS, id),
  create: (alert: Partial<Alert>) => realtimeDBService.create<Alert>(PATHS.ALERTS, alert),
  update: (id: string, alert: Partial<Alert>) => realtimeDBService.update<Alert>(PATHS.ALERTS, id, alert),
  delete: (id: string) => realtimeDBService.delete(PATHS.ALERTS, id),
  subscribe: (callback: (alerts: Alert[]) => void) => 
    realtimeDBService.subscribe<Alert>(PATHS.ALERTS, callback)
};

export const activityLogService = {
  getAll: () => realtimeDBService.getAll<ActivityLog>(PATHS.ACTIVITY_LOGS),
  getById: (id: string) => realtimeDBService.getById<ActivityLog>(PATHS.ACTIVITY_LOGS, id),
  create: (log: Partial<ActivityLog>) => realtimeDBService.create<ActivityLog>(PATHS.ACTIVITY_LOGS, log),
  subscribe: (callback: (logs: ActivityLog[]) => void) => 
    realtimeDBService.subscribe<ActivityLog>(PATHS.ACTIVITY_LOGS, callback)
};

export const historyService = {
  async getHistoryData(days: number = 30) {
    // Get all history and filter by date
    const allHistory = await realtimeDBService.getAll(PATHS.HISTORY);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return (allHistory as Array<Record<string, unknown>>).filter((item) => {
      const itemDate = new Date(item.date as string);
      return itemDate >= startDate;
    });
  },
  
  async addHistoryEntry(data: Record<string, unknown>) {
    return realtimeDBService.create(PATHS.HISTORY, data);
  }
};

// Hardware Control Service - للتحكم بالأجهزة الحقيقية
export const hardwareService = {
  // إرسال أمر للمحرك/المضخة
  async sendPumpCommand(pumpId: string, command: 'start' | 'stop') {
    const commandData = {
      deviceType: 'pump',
      deviceId: pumpId,
      command,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    return realtimeDBService.create(PATHS.HARDWARE_COMMANDS, commandData);
  },

  // إرسال أمر للصمام
  async sendValveCommand(valveId: string, command: 'open' | 'close', percentage?: number) {
    const commandData = {
      deviceType: 'valve',
      deviceId: valveId,
      command,
      percentage: percentage || (command === 'open' ? 100 : 0),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    return realtimeDBService.create(PATHS.HARDWARE_COMMANDS, commandData);
  },

  // الاستماع لحالة الأجهزة من الـ Hardware
  subscribeToHardwareStatus(callback: (status: Record<string, unknown>[]) => void) {
    return realtimeDBService.subscribe(PATHS.HARDWARE_STATUS, callback);
  },

  // الاستماع لقراءات الحساسات الحقيقية
  subscribeToSensorReadings(callback: (readings: Record<string, unknown>[]) => void) {
    return realtimeDBService.subscribe(PATHS.SENSOR_READINGS, callback);
  },

  // تحديث قراءة حساس (يستخدمه الـ Hardware)
  async updateSensorReading(sensorId: string, value: number, unit: string) {
    const readingData = {
      sensorId,
      value,
      unit,
      timestamp: new Date().toISOString()
    };
    return realtimeDBService.create(PATHS.SENSOR_READINGS, readingData);
  },

  // تحديث حالة جهاز (يستخدمه الـ Hardware)
  async updateDeviceStatus(deviceId: string, deviceType: string, status: Record<string, unknown>) {
    const statusData = {
      deviceId,
      deviceType,
      ...status,
      timestamp: new Date().toISOString()
    };
    const statusRef = ref(database, `${PATHS.HARDWARE_STATUS}/${deviceId}`);
    await set(statusRef, statusData);
  }
};

export { PATHS };
