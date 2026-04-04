import { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isLoaded: boolean;
  setIsLoaded: (value: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <UIContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
