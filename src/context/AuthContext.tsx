import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, name?: string) => Promise<boolean>;
  signup: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_DEMO_USER: UserProfile = {
  name: 'John Doe',
  email: 'demo@healthguard.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  age: 32,
  weight: 78,
  weightUnit: 'kg',
  height: 180,
  heightUnit: 'cm',
  healthConditions: ['Mild Hypertension'],
  allergies: ['Peanuts'],
  dietaryPreferences: ['Low Sodium', 'High Protein'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hg_auth') === 'true';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('hg_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return isAuthenticated ? DEFAULT_DEMO_USER : null;
  });

  useEffect(() => {
    localStorage.setItem('hg_auth', String(isAuthenticated));
    if (user) {
      localStorage.setItem('hg_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hg_user');
    }
  }, [isAuthenticated, user]);

  const login = async (email: string, name?: string): Promise<boolean> => {
    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let profileToSet = { ...DEFAULT_DEMO_USER };
    if (email !== 'demo@healthguard.ai') {
      profileToSet = {
        ...DEFAULT_DEMO_USER,
        name: name || email.split('@')[0],
        email: email,
        avatar: undefined, // default initial
      };
    }
    
    setUser(profileToSet);
    setIsAuthenticated(true);
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const profileToSet: UserProfile = {
      name,
      email,
      age: 28,
      weight: 70,
      weightUnit: 'kg',
      height: 175,
      heightUnit: 'cm',
      healthConditions: [],
      allergies: [],
      dietaryPreferences: [],
    };
    
    setUser(profileToSet);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('hg_auth');
    localStorage.removeItem('hg_user');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
