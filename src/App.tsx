import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Programming from './components/Programming';
import Equipment from './components/Equipment/Equipment';
import UserManagement from './components/Users/UserManagement';
import History from './components/History';
import Reports from './components/Reports';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Chatbot from './components/Chatbot/Chatbot';
import {
  mockSensorData,
  mockZoneData,
  mockAlerts,
  mockSystemStatus,
  mockSchedule,
  mockPumps,
  mockValves,
  mockSensorConfigs,
  mockUsers,
  mockActivityLogs
} from './utils/mockData';
import { useChartData } from './hooks/useChartData';
import { SystemStatus, Alert, ZoneData, ScheduleItem, Pump, Valve, SensorConfig, User, ActivityLog } from './types';
// Firebase hooks
import {
  useZones,
  useAlerts,
  usePumps,
  useValves,
  useSensors,
  useUsers,
  useActivityLogs,
  useSchedules
} from './hooks/useFirebaseData';
import {
  zoneService,
  alertService,
  pumpService,
  valveService,
  sensorService,
  userService,
  scheduleService,
  hardwareService
} from './services/realtimeDatabaseService';

function AppContent() {
  const { isAuthenticated, isLoading, useFirebase, user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(mockSystemStatus);
  // استخدام البيانات الحية للرسوم البيانية
  const { data: chartData } = useChartData(7, useFirebase);

  // Firebase data hooks (only active when useFirebase is true)
  // Always enable real-time when using Firebase
  const firebaseZones = useZones(true);
  const firebaseAlerts = useAlerts(true);
  const firebasePumps = usePumps(true);
  const firebaseValves = useValves(true);
  const firebaseSensors = useSensors(true);
  const firebaseUsers = useUsers(true);
  const firebaseActivityLogs = useActivityLogs(true);
  const firebaseSchedules = useSchedules(true);

  // Local state for mock mode
  const [mockAlertsState, setMockAlertsState] = useState<Alert[]>(mockAlerts);
  const [mockZonesState, setMockZonesState] = useState<ZoneData[]>(mockZoneData);
  const [mockSchedulesState, setMockSchedulesState] = useState<ScheduleItem[]>(mockSchedule);
  const [mockPumpsState, setMockPumpsState] = useState<Pump[]>(mockPumps);
  const [mockValvesState, setMockValvesState] = useState<Valve[]>(mockValves);
  const [mockSensorsState] = useState<SensorConfig[]>(mockSensorConfigs);
  const [mockUsersState, setMockUsersState] = useState<User[]>(mockUsers);
  const [mockActivityLogsState] = useState<ActivityLog[]>(mockActivityLogs);

  // Use Firebase data if enabled, otherwise use mock data
  const alerts = useFirebase ? firebaseAlerts.data : mockAlertsState;
  const zones = useFirebase ? firebaseZones.data : mockZonesState;
  const schedules = useFirebase ? firebaseSchedules.data : mockSchedulesState;
  const pumps = useFirebase ? firebasePumps.data : mockPumpsState;
  const valves = useFirebase ? firebaseValves.data : mockValvesState;
  const sensors = useFirebase ? firebaseSensors.data : mockSensorsState;
  const users = useFirebase ? firebaseUsers.data : mockUsersState;
  const activityLogs = useFirebase ? firebaseActivityLogs.data : mockActivityLogsState;

  // Debug: Log Firebase data
  console.log('🔍 Debug - useFirebase:', useFirebase);
  console.log('🔍 Debug - Firebase pumps data:', firebasePumps.data);
  console.log('🔍 Debug - Final pumps data:', pumps);

  // Update sensor data periodically (simulation)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // Update system status timestamp
      setSystemStatus(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Show loading if auth is loading or Firebase data is loading
  const isDataLoading = useFirebase && (
    firebaseZones.loading || 
    firebaseAlerts.loading || 
    firebasePumps.loading || 
    firebaseValves.loading
  );

  if (isLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? 'Chargement...' : 'Chargement des données Firebase...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleToggleMode = () => {
    setSystemStatus(prev => ({
      ...prev,
      mode: prev.mode === 'automatic' ? 'manual' : 'automatic'
    }));
  };

  const handleOpenSettings = () => {
    // Check if user has admin access
    if (user && (user.role === 'admin' || user.permissions.includes('manage_settings') || user.permissions.includes('all'))) {
      setCurrentView('settings');
      setSidebarOpen(false); // Close sidebar on mobile after navigation
    } else {
      // Show access denied message or redirect to dashboard
      console.warn('Access denied: Settings page requires admin privileges');
      setCurrentView('dashboard');
    }
  };

  const handleOpenNotifications = () => {
    setCurrentView('notifications');
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handleToggleZone = async (zoneId: string) => {
    if (useFirebase) {
      const zone = zones.find(z => z.id === zoneId);
      if (zone) {
        await zoneService.update(zoneId, {
          status: zone.status === 'active' ? 'inactive' : 'active',
          lastWatered: zone.status !== 'active' ? new Date().toISOString() : zone.lastWatered
        });
      }
    } else {
      setMockZonesState(prev => prev.map(zone => 
        zone.id === zoneId 
          ? { 
              ...zone, 
              status: zone.status === 'active' ? 'inactive' : 'active',
              lastWatered: zone.status !== 'active' ? new Date().toISOString() : zone.lastWatered
            }
          : zone
      ));
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    if (useFirebase) {
      await alertService.update(alertId, { read: true });
    } else {
      setMockAlertsState(prev => prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    if (useFirebase) {
      await alertService.delete(alertId);
    } else {
      setMockAlertsState(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  const handleAddSchedule = async (schedule: Omit<ScheduleItem, 'id'>) => {
    if (useFirebase) {
      await scheduleService.create(schedule);
    } else {
      const newSchedule: ScheduleItem = {
        ...schedule,
        id: Date.now().toString()
      };
      setMockSchedulesState(prev => [...prev, newSchedule]);
    }
  };

  const handleToggleSchedule = async (scheduleId: string) => {
    if (useFirebase) {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (schedule) {
        await scheduleService.update(scheduleId, { active: !schedule.active });
      }
    } else {
      setMockSchedulesState(prev => prev.map(schedule =>
        schedule.id === scheduleId
          ? { ...schedule, active: !schedule.active }
          : schedule
      ));
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (useFirebase) {
      await scheduleService.delete(scheduleId);
    } else {
      setMockSchedulesState(prev => prev.filter(schedule => schedule.id !== scheduleId));
    }
  };

  // Equipment handlers
  const handleTogglePumpEquipment = async (pumpId: string) => {
    if (useFirebase) {
      const pump = pumps.find(p => p.id === pumpId);
      if (pump) {
        const newStatus = pump.status === 'running' ? 'stopped' : 'running';
        
        // إرسال أمر للجهاز الحقيقي
        await hardwareService.sendPumpCommand(
          pumpId, 
          newStatus === 'running' ? 'start' : 'stop'
        );
        
        // تحديث قاعدة البيانات
        await pumpService.update(pumpId, {
          status: newStatus
        });
      }
    } else {
      setMockPumpsState(prev => prev.map(pump =>
        pump.id === pumpId
          ? { ...pump, status: pump.status === 'running' ? 'stopped' : 'running' }
          : pump
      ));
    }
  };

  const handleToggleValve = async (valveId: string) => {
    if (useFirebase) {
      const valve = valves.find(v => v.id === valveId);
      if (valve) {
        const newStatus = valve.status === 'open' ? 'closed' : 'open';
        const newPercentage = newStatus === 'open' ? 100 : 0;
        
        // إرسال أمر للصمام الحقيقي
        await hardwareService.sendValveCommand(
          valveId,
          newStatus === 'open' ? 'open' : 'close',
          newPercentage
        );
        
        // تحديث قاعدة البيانات
        await valveService.update(valveId, {
          status: newStatus,
          openingPercentage: newPercentage,
          lastOperation: new Date().toISOString(),
          operationCount: valve.operationCount + 1
        });
      }
    } else {
      setMockValvesState(prev => prev.map(valve =>
        valve.id === valveId
          ? { 
              ...valve, 
              status: valve.status === 'open' ? 'closed' : 'open',
              openingPercentage: valve.status === 'open' ? 0 : 100,
              lastOperation: new Date().toISOString(),
              operationCount: valve.operationCount + 1
            }
          : valve
      ));
    }
  };

  const handleAdjustValve = async (valveId: string, percentage: number) => {
    if (useFirebase) {
      const valve = valves.find(v => v.id === valveId);
      if (valve) {
        // إرسال أمر للصمام الحقيقي مع النسبة المحددة
        await hardwareService.sendValveCommand(
          valveId,
          percentage > 0 ? 'open' : 'close',
          percentage
        );
        
        // تحديث قاعدة البيانات
        await valveService.update(valveId, {
          openingPercentage: percentage,
          status: percentage > 0 ? 'open' : 'closed',
          lastOperation: new Date().toISOString(),
          operationCount: valve.operationCount + 1
        });
      }
    } else {
      setMockValvesState(prev => prev.map(valve =>
        valve.id === valveId
          ? {
              ...valve,
              openingPercentage: percentage,
              status: percentage > 0 ? 'open' : 'closed',
              lastOperation: new Date().toISOString(),
              operationCount: valve.operationCount + 1
            }
          : valve
      ));
    }
  };

  // User management handlers
  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // Implementation would show edit modal
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      if (useFirebase) {
        await userService.delete(userId);
      } else {
        setMockUsersState(prev => prev.filter(user => user.id !== userId));
      }
    }
  };

  const handleAddUser = () => {
    console.log('Add user');
    // Implementation would show add user modal
  };

  const handleToggleUserStatus = async (userId: string) => {
    if (useFirebase) {
      const user = users.find(u => u.id === userId);
      if (user) {
        await userService.update(userId, { isActive: !user.isActive });
      }
    } else {
      setMockUsersState(prev => prev.map(user =>
        user.id === userId
          ? { ...user, isActive: !user.isActive }
          : user
      ));
    }
  };

  // Equipment management handlers (placeholder implementations)
  const handleEditPump = (pump: Pump) => { console.log('Edit pump:', pump); };
  const handleDeletePump = async (pumpId: string) => {
    if (useFirebase) {
      await pumpService.delete(pumpId);
    } else {
      console.log('Delete pump:', pumpId);
    }
  };
  const handleAddPump = () => { console.log('Add pump'); };
  
  const handleEditValve = (valve: Valve) => { console.log('Edit valve:', valve); };
  const handleDeleteValve = async (valveId: string) => {
    if (useFirebase) {
      await valveService.delete(valveId);
    } else {
      console.log('Delete valve:', valveId);
    }
  };
  const handleAddValve = () => { console.log('Add valve'); };
  
  const handleEditSensor = (sensor: SensorConfig) => { console.log('Edit sensor:', sensor); };
  const handleDeleteSensor = async (sensorId: string) => {
    if (useFirebase) {
      await sensorService.delete(sensorId);
    } else {
      console.log('Delete sensor:', sensorId);
    }
  };
  const handleAddSensor = () => { console.log('Add sensor'); };
  const handleCalibrateSensor = (sensorId: string) => { console.log('Calibrate sensor:', sensorId); };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            sensors={mockSensorData}
            zones={zones}
            alerts={alerts}
            chartData={chartData}
            onToggleZone={handleToggleZone}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismissAlert}
          />
        );
      case 'sensors':
        return (
          <History />
        );
      case 'programming':
        return (
          <Programming
            zones={zones}
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onToggleSchedule={handleToggleSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        );
      case 'equipment':
        return (
          <Equipment
            pumps={pumps}
            valves={valves}
            sensors={sensors}
            zones={zones}
            onTogglePump={handleTogglePumpEquipment}
            onToggleValve={handleToggleValve}
            onEditPump={handleEditPump}
            onEditValve={handleEditValve}
            onEditSensor={handleEditSensor}
            onDeletePump={handleDeletePump}
            onDeleteValve={handleDeleteValve}
            onDeleteSensor={handleDeleteSensor}
            onAddPump={handleAddPump}
            onAddValve={handleAddValve}
            onAddSensor={handleAddSensor}
            onAdjustValve={handleAdjustValve}
            onCalibrateSensor={handleCalibrateSensor}
          />
        );
      case 'users':
        return (
          <UserManagement
            users={users}
            activityLogs={activityLogs}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onAddUser={handleAddUser}
            onToggleUserStatus={handleToggleUserStatus}
          />
        );
      case 'history':
        return (
          <Reports />
        );
      case 'notifications':
        return (
          <Notifications />
        );
      case 'settings':
        // Check if user has admin access to settings
        if (user && (user.role === 'admin' || user.permissions.includes('manage_settings') || user.permissions.includes('all'))) {
          return <Settings />;
        } else {
          // Redirect to dashboard if no access
          setCurrentView('dashboard');
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
                <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder aux paramètres.</p>
                <p className="text-sm text-gray-500 mt-2">Seuls les administrateurs peuvent accéder à cette page.</p>
              </div>
            </div>
          );
        }
      case 'chatbot':
        return (
          <Chatbot />
        );
      default:
        return (
          <Dashboard
            sensors={mockSensorData}
            zones={zones}
            alerts={alerts}
            chartData={chartData}
            onToggleZone={handleToggleZone}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismissAlert}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        <Header
          systemStatus={systemStatus}
          alerts={alerts}
          onToggleMode={handleToggleMode}
          onOpenSettings={handleOpenSettings}
          onOpenNotifications={handleOpenNotifications}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-hidden">
          <div className="max-w-full">
            {renderContent()}
          </div>
        </main>
        
        {/* Chatbot - Hidden on small screens, positioned better on larger screens */}
        <div className="hidden sm:block">
          <Chatbot 
            sensors={mockSensorData}
            zones={zones}
            alerts={alerts}
          />
        </div>
        
        {/* Mobile Chatbot Button */}
        <div className="sm:hidden fixed bottom-4 right-4 z-50">
          <button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              // This would open a mobile chatbot modal
              console.log('Open mobile chatbot');
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;