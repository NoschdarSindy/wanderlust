
import { createContext, useContext, useState } from 'react';

const DesignModeContext = createContext();

export const DESIGN_MODES = {
  DECEPTIVE: 'deceptive',
  FAIR: 'fair',
  NO_STIMULUS: 'no_stimulus'
};

export function DesignModeProvider({ children }) {
  const [designMode, setDesignMode] = useState(DESIGN_MODES.DECEPTIVE);

  return (
    <DesignModeContext.Provider value={{ designMode, setDesignMode }}>
      {children}
    </DesignModeContext.Provider>
  );
}

export function useDesignMode() {
  return useContext(DesignModeContext);
}
