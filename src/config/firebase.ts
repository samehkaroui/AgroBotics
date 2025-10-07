import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyARRC6CaggRYOKKzHCOZK5BAOjKDcNPY7A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agrobotics-1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agrobotics-1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agrobotics-1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "926725229927",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:926725229927:web:4bdf102bc182331a1b33c2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-K3R8KSMSG4",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://agrobotics-1-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app); // Realtime Database
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
