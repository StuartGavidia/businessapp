import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

export type AppConfigType = {
  userId: string | undefined;
  timezone: string;
};

export type AppConfigContextType = {
  appConfig: AppConfigType;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfigType>>;
};

const AppConfigContext = createContext<AppConfigContextType>({} as AppConfigContextType);

export const AppConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [appConfig, setAppConfig] = useState<AppConfigType>({
    userId: undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return (
    <AppConfigContext.Provider value={{ appConfig, setAppConfig }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => useContext(AppConfigContext);
