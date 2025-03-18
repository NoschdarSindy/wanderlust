import { createContext, useContext, useState } from 'react';
import websiteThemesData from '../theme/websiteThemes';

const WebsiteContext = createContext();

export function WebsiteProvider({ children }) {
  const [websiteType, setWebsiteType] = useState('hotels');

  return (
    <WebsiteContext.Provider value={{ websiteType, setWebsiteType }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite() {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
}

export const DESIGN_MODES = {
  DECEPTIVE: 'deceptive',
  FAIR: 'fair',
  NO_STIMULUS: 'no_stimulus'
};