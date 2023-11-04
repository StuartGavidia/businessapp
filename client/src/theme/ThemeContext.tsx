import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeType, ThemeContextType } from './theme.types';
import { themes } from './themes';

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
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Get the saved theme from local storage or default to 'light'
    const savedThemeName = localStorage.getItem('theme') || 'light';
    return themes[savedThemeName];
  });

  const toggleTheme = () => {
    const newThemeName = theme === themes.light ? 'dark' : 'light';
    setTheme(themes[newThemeName]);
    localStorage.setItem('theme', newThemeName);
    applyTheme(themes[newThemeName]);
  };

  const applyTheme = (theme: ThemeType) => {
    Object.keys(theme).forEach(key => {
      const value = theme[key];
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
