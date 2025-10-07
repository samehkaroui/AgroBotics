import { useState, useEffect } from 'react';
import {
  userService,
  pumpService,
  valveService,
  sensorService,
  zoneService,
  scheduleService,
  alertService,
  activityLogService
} from '../services/realtimeDatabaseService';
import {
  User,
  Pump,
  Valve,
  SensorConfig,
  ZoneData,
  ScheduleItem,
  Alert,
  ActivityLog
} from '../types';

// Generic hook for Firebase data with real-time updates
export function useFirebaseCollection<T>(
  service: {
    getAll: () => Promise<T[]>;
    subscribe: (callback: (data: T[]) => void) => () => void;
  },
  enableRealtime: boolean = true
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await service.getAll();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (enableRealtime) {
      // Set up real-time listener
      try {
        unsubscribe = service.subscribe((newData) => {
          console.log('Real-time update received:', newData);
          setData(newData);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error setting up subscription:', err);
        setError(err as Error);
        setLoading(false);
      }
    } else {
      // Fetch once
      fetchData();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableRealtime]);

  return { data, loading, error, setData };
}

// Specific hooks for each collection
export function useUsers(enableRealtime: boolean = true) {
  return useFirebaseCollection<User>(userService, enableRealtime);
}

export function usePumps(enableRealtime: boolean = true) {
  return useFirebaseCollection<Pump>(pumpService, enableRealtime);
}

export function useValves(enableRealtime: boolean = true) {
  return useFirebaseCollection<Valve>(valveService, enableRealtime);
}

export function useSensors(enableRealtime: boolean = true) {
  return useFirebaseCollection<SensorConfig>(sensorService, enableRealtime);
}

export function useZones(enableRealtime: boolean = true) {
  return useFirebaseCollection<ZoneData>(zoneService, enableRealtime);
}

export function useSchedules(enableRealtime: boolean = true) {
  return useFirebaseCollection<ScheduleItem>(scheduleService, enableRealtime);
}

export function useAlerts(enableRealtime: boolean = true) {
  return useFirebaseCollection<Alert>(alertService, enableRealtime);
}

export function useActivityLogs(enableRealtime: boolean = true) {
  return useFirebaseCollection<ActivityLog>(activityLogService, enableRealtime);
}

// Combined hook for dashboard data
export function useDashboardData(enableRealtime: boolean = true) {
  const zones = useZones(enableRealtime);
  const alerts = useAlerts(enableRealtime);
  const pumps = usePumps(enableRealtime);
  const valves = useValves(enableRealtime);

  return {
    zones,
    alerts,
    pumps,
    valves,
    loading: zones.loading || alerts.loading || pumps.loading || valves.loading,
    error: zones.error || alerts.error || pumps.error || valves.error
  };
}

// Combined hook for equipment data
export function useEquipmentData(enableRealtime: boolean = true) {
  const pumps = usePumps(enableRealtime);
  const valves = useValves(enableRealtime);
  const sensors = useSensors(enableRealtime);
  const zones = useZones(enableRealtime);

  return {
    pumps,
    valves,
    sensors,
    zones,
    loading: pumps.loading || valves.loading || sensors.loading || zones.loading,
    error: pumps.error || valves.error || sensors.error || zones.error
  };
}

// Combined hook for user management
export function useUserManagementData(enableRealtime: boolean = true) {
  const users = useUsers(enableRealtime);
  const activityLogs = useActivityLogs(enableRealtime);

  return {
    users,
    activityLogs,
    loading: users.loading || activityLogs.loading,
    error: users.error || activityLogs.error
  };
}
