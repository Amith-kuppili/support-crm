import { createContext, useContext, ReactNode } from 'react';
import { useApp } from '../hooks/useApp';

interface AppContextType extends ReturnType<typeof useApp> {}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const appState = useApp();
  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
