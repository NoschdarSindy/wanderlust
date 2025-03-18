
import { createContext, useContext, useState } from 'react';

const WebsiteContext = createContext();

export const DESIGN_MODES = {
  DECEPTIVE: 'deceptive',
  FAIR: 'fair',
  NO_STIMULUS: 'no_stimulus'
};

export const WebsiteProvider = ({ children }) => {
  const [websiteType, setWebsiteType] = useState('hotels');
  const [designMode, setDesignMode] = useState(DESIGN_MODES.DECEPTIVE);
  const theme = websiteThemes[websiteType];

  const value = {
    websiteType,
    setWebsiteType,
    designMode,
    setDesignMode,
    theme
  };

  return (
    <WebsiteContext.Provider value={value}>
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};

export function WebsiteProvider({ children }) {
  const [websiteType, setWebsiteType] = useState('hotels');

  return (
    <WebsiteContext.Provider value={{ websiteType, setWebsiteType }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite() {
  return useContext(WebsiteContext);
}
