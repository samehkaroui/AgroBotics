import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  mockPumps,
  mockValves,
  mockSensorConfigs,
  mockZoneData,
  mockSchedule,
  mockAlerts,
  mockUsers,
  mockActivityLogs
} from '../utils/mockData';

/**
 * Initialize Firebase Firestore with sample data
 * Run this script once to populate your Firebase database with demo data
 */
export async function initializeFirebaseData() {
  console.log('🚀 Starting Firebase data initialization...');

  try {
    // Initialize Users (with specific IDs for auth mapping)
    console.log('📝 Adding users...');
    for (const user of mockUsers) {
      await setDoc(doc(db, 'users', user.id), user);
    }
    console.log(`✅ Added ${mockUsers.length} users`);

    // Initialize Pumps
    console.log('📝 Adding pumps...');
    for (const pump of mockPumps) {
      await addDoc(collection(db, 'pumps'), pump);
    }
    console.log(`✅ Added ${mockPumps.length} pumps`);

    // Initialize Valves
    console.log('📝 Adding valves...');
    for (const valve of mockValves) {
      await addDoc(collection(db, 'valves'), valve);
    }
    console.log(`✅ Added ${mockValves.length} valves`);

    // Initialize Sensors
    console.log('📝 Adding sensors...');
    for (const sensor of mockSensorConfigs) {
      await addDoc(collection(db, 'sensors'), sensor);
    }
    console.log(`✅ Added ${mockSensorConfigs.length} sensors`);

    // Initialize Zones
    console.log('📝 Adding zones...');
    for (const zone of mockZoneData) {
      await addDoc(collection(db, 'zones'), zone);
    }
    console.log(`✅ Added ${mockZoneData.length} zones`);

    // Initialize Schedules
    console.log('📝 Adding schedules...');
    for (const schedule of mockSchedule) {
      await addDoc(collection(db, 'schedules'), schedule);
    }
    console.log(`✅ Added ${mockSchedule.length} schedules`);

    // Initialize Alerts
    console.log('📝 Adding alerts...');
    for (const alert of mockAlerts) {
      await addDoc(collection(db, 'alerts'), alert);
    }
    console.log(`✅ Added ${mockAlerts.length} alerts`);

    // Initialize Activity Logs
    console.log('📝 Adding activity logs...');
    for (const log of mockActivityLogs) {
      await addDoc(collection(db, 'activityLogs'), log);
    }
    console.log(`✅ Added ${mockActivityLogs.length} activity logs`);

    // Initialize Historical Data
    console.log('📝 Adding historical data...');
    const historyData = generateHistoricalData(30);
    for (const entry of historyData) {
      await addDoc(collection(db, 'history'), entry);
    }
    console.log(`✅ Added ${historyData.length} history entries`);

    console.log('🎉 Firebase data initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${mockUsers.length}`);
    console.log(`   - Pumps: ${mockPumps.length}`);
    console.log(`   - Valves: ${mockValves.length}`);
    console.log(`   - Sensors: ${mockSensorConfigs.length}`);
    console.log(`   - Zones: ${mockZoneData.length}`);
    console.log(`   - Schedules: ${mockSchedule.length}`);
    console.log(`   - Alerts: ${mockAlerts.length}`);
    console.log(`   - Activity Logs: ${mockActivityLogs.length}`);
    console.log(`   - History Entries: ${historyData.length}`);

  } catch (error) {
    console.error('❌ Error initializing Firebase data:', error);
    throw error;
  }
}

// Generate historical data for the last N days
function generateHistoricalData(days: number) {
  const data = [];
  const baseDate = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split('T')[0],
      temperature: Math.round((18 + Math.random() * 12) * 10) / 10,
      humidity: Math.round((45 + Math.random() * 35) * 10) / 10,
      soilHumidity: Math.round((35 + Math.random() * 45) * 10) / 10,
      waterConsumption: Math.round((80 + Math.random() * 150) * 10) / 10,
      pumpHours: Math.round((2 + Math.random() * 8) * 10) / 10,
      alerts: Math.floor(Math.random() * 5),
      timestamp: date.toISOString()
    });
  }

  return data;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeFirebaseData()
    .then(() => {
      console.log('\n✨ All done! You can now use the application with Firebase.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Initialization failed:', error);
      process.exit(1);
    });
}
