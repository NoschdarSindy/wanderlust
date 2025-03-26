import { createContext, useContext } from "react";
import websitesData, { WebsiteData } from "../data";

const WebsiteContext = createContext<WebsiteData | undefined>(undefined);

export const WebsiteProvider = ({ children }) => (
  <WebsiteContext.Provider value={websitesData[process.env.REACT_APP_TYPE]}>
    {children}
  </WebsiteContext.Provider>
);

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context)
    throw new Error("useWebsite must be used within a WebsiteProvider");
  return context;
};
