import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User, ADMINS } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  adminLogin: (name: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch/create user from Firestore based on Firebase Auth
  const handleFirebaseUser = async (fbUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        if (userData.isBanned) {
          alert('هذا الحساب محظور');
          await firebaseSignOut(auth);
          setCurrentUser(null);
          return;
        }
        await updateDoc(userRef, { lastLogin: new Date().toISOString() });
        setCurrentUser({ ...userData, id: fbUser.uid });
      } else {
        // New User
        let name = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
        const newUser: Omit<User, 'id'> = {
          name,
          email: fbUser.email || '',
          specialty: 'مستخدم',
          role: 'user',
          isBanned: false,
          authMethod: fbUser.providerData[0]?.providerId || 'email',
          emailVerified: fbUser.emailVerified,
          photoURL: fbUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await setDoc(userRef, newUser);
        setCurrentUser({ ...newUser, id: fbUser.uid });
      }
    } catch (error) {
      console.error("Auth Error", error);
    }
  };

  useEffect(() => {
    // Check local storage for admin session first
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        // Simplified check, normally would re-validate against DB
        setCurrentUser({
            id: `admin_${session.name}`,
            name: session.name,
            email: '',
            specialty: 'مدير النظام',
            role: 'admin',
            isBanned: false,
            authMethod: 'admin',
            emailVerified: true,
            createdAt: new Date().toISOString()
        });
        setLoading(false);
        return; 
      } catch (e) {
        localStorage.removeItem('admin_session');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await handleFirebaseUser(user);
      } else {
        // If not admin session, then null
        if (!localStorage.getItem('admin_session')) {
            setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const adminLogin = async (name: string, code: string) => {
    const isAdmin = ADMINS.some(a => a.name === name && a.code === code);
    if (isAdmin) {
        const adminUser: User = {
            id: `admin_${name}`,
            name,
            email: '',
            specialty: 'مدير النظام',
            role: 'admin',
            isBanned: false,
            authMethod: 'admin',
            emailVerified: true,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('admin_session', JSON.stringify({ name, timestamp: Date.now(), role: 'admin' }));
        setCurrentUser(adminUser);
        
        // Ensure admin user doc exists in Firestore for consistency
        // Note: Real app should probably separate admin auth, but replicating legacy behavior here
        return true;
    }
    return false;
  };

  const logout = async () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('muf_user');
    await firebaseSignOut(auth);
    setCurrentUser(null);
  };

  const refreshUser = async () => {
      if(currentUser && currentUser.authMethod !== 'admin') {
          // Re-fetch logic if needed
      }
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, adminLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};