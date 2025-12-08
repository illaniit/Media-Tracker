// src/contexts/GuestContext.tsx
// Contexto para manejar el modo invitado con localStorage

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { MediaItem } from '../lib/supabase/types';

interface GuestContextType {
  isGuest: boolean;
  guestData: MediaItem[];
  addGuestItem: (item: Omit<MediaItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => MediaItem;
  updateGuestItem: (id: string, updates: Partial<MediaItem>) => void;
  deleteGuestItem: (id: string) => void;
  getGuestItemById: (id: string) => MediaItem | undefined;
  clearGuestData: () => void;
  setGuestMode: (isGuest: boolean) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'media-tracker-guest-data';
const GUEST_MODE_KEY = 'media-tracker-guest-mode';

export function GuestProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  
  const [isGuest, setIsGuestState] = useState<boolean>(() => {
    const stored = localStorage.getItem(GUEST_MODE_KEY);
    return stored === 'true';
  });
  
  const [guestData, setGuestData] = useState<MediaItem[]>(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Activar modo invitado cuando se accede a /guest
  useEffect(() => {
    if (location.pathname === '/guest' && !isGuest) {
      setIsGuestState(true);
    }
  }, [location.pathname]);

  // Sincronizar con localStorage cuando cambian los datos
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestData));
    }
  }, [guestData, isGuest]);

  // Sincronizar modo invitado
  useEffect(() => {
    localStorage.setItem(GUEST_MODE_KEY, isGuest.toString());
  }, [isGuest]);

  const setGuestMode = (guest: boolean) => {
    setIsGuestState(guest);
    if (!guest) {
      clearGuestData();
    }
  };

  const addGuestItem = (item: Omit<MediaItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): MediaItem => {
    const now = new Date().toISOString();
    const newItem: MediaItem = {
      ...item,
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'guest',
      created_at: now,
      updated_at: now,
    };
    
    setGuestData(prev => [...prev, newItem]);
    return newItem;
  };

  const updateGuestItem = (id: string, updates: Partial<MediaItem>) => {
    setGuestData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteGuestItem = (id: string) => {
    setGuestData(prev => prev.filter(item => item.id !== id));
  };

  const getGuestItemById = (id: string): MediaItem | undefined => {
    return guestData.find(item => item.id === id);
  };

  const clearGuestData = () => {
    setGuestData([]);
    localStorage.removeItem(GUEST_STORAGE_KEY);
  };

  return (
    <GuestContext.Provider
      value={{
        isGuest,
        guestData,
        addGuestItem,
        updateGuestItem,
        deleteGuestItem,
        getGuestItemById,
        clearGuestData,
        setGuestMode,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
}
