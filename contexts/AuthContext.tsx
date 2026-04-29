
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPlan } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => void;
  upgradePlan: () => void; 
  incrementUsage: (count: number) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // SIMULATION: Mock Backend Delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'usr_123456',
      name: email.split('@')[0],
      email: email,
      plan: 'ENTERPRISE', // FORCE ENTERPRISE
      avatar: `https://ui-avatars.com/api/?name=${email}&background=FF5C35&color=fff`,
      usage: 0,
      limit: 1000000 // Unlimited (Free App)
    };
    
    setUser(mockUser);
    localStorage.setItem('nexus_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const loginGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'usr_google_987',
      name: 'Google User',
      email: 'user@gmail.com',
      plan: 'ENTERPRISE',
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      usage: 0,
      limit: 1000000
    };

    setUser(mockUser);
    localStorage.setItem('nexus_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  const upgradePlan = () => {
    // No-op for free app
  };

  const incrementUsage = (count: number) => {
      if (user) {
          const updatedUser = { ...user, usage: user.usage + count };
          setUser(updatedUser);
          localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
      }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginGoogle, logout, upgradePlan, incrementUsage, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
