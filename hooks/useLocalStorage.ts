'use client';
import { useSyncExternalStore, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener('storage', callback);
      
      const handleLocalChange = () => callback();
      window.addEventListener('local-storage', handleLocalChange);

      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener('local-storage', handleLocalChange);
      };
    },
    []
  );

  const getSnapshot = () => {
    return localStorage.getItem(key);
  };

  const getServerSnapshot = () => {
    return null; 
  };

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const state: T = store ? JSON.parse(store) : initialValue;

  const setState = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const nextState = value instanceof Function ? value(state) : value;
        localStorage.setItem(key, JSON.stringify(nextState));
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.error(error);
      }
    },
    [key, state]
  );

  return [state, setState] as const;
}
