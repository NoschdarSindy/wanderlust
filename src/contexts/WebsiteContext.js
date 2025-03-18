
import { createContext, useContext, useState } from 'react';

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
  return useContext(WebsiteContext);
}
