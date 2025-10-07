import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  useFirebase: boolean;
  toggleFirebaseMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration (fallback when Firebase is not configured)
const mockUsers: User[] = [
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
    fullName: 'Opérateur Principal',
    lastLogin: '2025-01-15T09:15:00Z',
    isActive: true,
    permissions: ['view_dashboard', 'control_irrigation', 'view_sensors', 'manage_schedules'],
    createdAt: '2024-06-01T00:00:00Z',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '3',
    username: 'viewer',
    email: 'viewer@irrigationsystem.com',
    role: 'viewer',
    fullName: 'Observateur',
    lastLogin: '2025-01-14T16:45:00Z',
    isActive: true,
    permissions: ['view_dashboard', 'view_sensors', 'view_history'],
    createdAt: '2024-09-01T00:00:00Z',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFirebase, setUseFirebase] = useState(false);

  useEffect(() => {
    // Check Firebase mode preference
    const firebaseMode = localStorage.getItem('use_firebase') === 'true';
    
    // Force Firebase mode to true (temporary for testing)
    setUseFirebase(true);
    localStorage.setItem('use_firebase', 'true');

    if (firebaseMode) {
      // Set up Firebase auth listener
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setFirebaseUser(fbUser);
          // Fetch user data from Realtime Database
          try {
            // Map email to user ID in database
            const emailToUserIdMap: { [key: string]: string } = {
              'admin@irrigationsystem.com': 'user-admin',
              'operator@irrigationsystem.com': 'user-operator',
              'viewer@irrigationsystem.com': 'user-viewer'
            };
            
            const userId = emailToUserIdMap[fbUser.email || ''];
            
            if (userId) {
              const userRef = ref(database, `users/${userId}`);
              const snapshot = await get(userRef);
              
              if (snapshot.exists()) {
                const userData = snapshot.val() as User;
                setUser({ ...userData, id: userId });
                console.log('✅ User loaded:', userData.role, userData.permissions);
              } else {
                console.error('❌ User not found in database:', userId);
              }
            } else {
              console.error('❌ Email not mapped:', fbUser.email);
              // Create default user profile if doesn't exist
              const newUser: User = {
                id: fbUser.uid,
                email: fbUser.email || '',
                username: fbUser.email?.split('@')[0] || 'user',
                fullName: fbUser.displayName || 'User',
                role: 'viewer',
                isActive: true,
                permissions: ['view_dashboard', 'view_sensors', 'view_history'],
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
              };
              const userRef = ref(database, `users/${fbUser.uid}`);
              await set(userRef, newUser);
              setUser(newUser);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          setFirebaseUser(null);
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Check for stored auth on app load (mock mode)
      const storedUser = localStorage.getItem('irrigation_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    }
  }, [useFirebase]);

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User data will be set by onAuthStateChanged listener
      return true;
    } catch (error) {
      console.error('Firebase login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    if (useFirebase) {
      // Firebase mode: map username to email
      const userEmailMap: { [key: string]: string } = {
        'admin': 'admin@irrigationsystem.com',
        'operator': 'operator@irrigationsystem.com',
        'viewer': 'viewer@irrigationsystem.com'
      };
      
      const email = userEmailMap[username];
      if (email) {
        return loginWithEmail(email, password);
      }
      return false;
    }

    // Mock authentication
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => 
      u.username === username && u.isActive
    );
    
    if (foundUser && (password === 'password' || password === username)) {
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('irrigation_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    if (useFirebase && firebaseUser) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Firebase logout error:', error);
      }
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('irrigation_user');
  };

  const toggleFirebaseMode = () => {
    const newMode = !useFirebase;
    setUseFirebase(newMode);
    localStorage.setItem('use_firebase', String(newMode));
    // Logout when switching modes
    logout();
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      login,
      loginWithEmail,
      logout,
      isAuthenticated: !!user,
      isLoading,
      useFirebase,
      toggleFirebaseMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};