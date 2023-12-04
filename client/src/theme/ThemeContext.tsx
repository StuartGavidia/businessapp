// ThemeProvider component
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes } from './themes';
import { ThemeContextType } from './theme.types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<string>(() => localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newThemeName = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newThemeName);
    localStorage.setItem('theme', newThemeName);
    applyTheme(newThemeName);
  };

  const applyTheme = (themeName: string) => {
    const theme = themes[themeName];
    Object.keys(theme).forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    });
  };

  useEffect(() => {
    applyTheme(themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
