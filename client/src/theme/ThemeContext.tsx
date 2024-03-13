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

  const toggleLightBackgroundColor = (color) => {
    themes['light'] = {...themes['light'], 'bs-body-bg': color}
    localStorage.setItem('themeLightBackgroundColor', color)
    applyTheme('light')
  }

  const toggleLightSidebarColor = (color) => {
    themes['light'] = {...themes['light'], 'bs-background-color': color}
    localStorage.setItem('themeLightSidebarColor', color)
    applyTheme('light')
  }



  const applyTheme = (themeName: string) => {
    const theme = themes[themeName];
    if (localStorage.getItem('themeLightBackgroundColor') == "") {
      localStorage.setItem('themeLightBackgroundColor', theme['bs-body-bg'])
    }
    if(localStorage.getItem('themeLightSidebarColor') == "") {
      localStorage.setItem('themeLightSidebarColor', theme['bs-background-color'])
    }
    Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, theme[key]);
    });
  };

  useEffect(() => {
    applyTheme(themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme, toggleLightBackgroundColor, toggleLightSidebarColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
