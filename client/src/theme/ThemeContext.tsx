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

  const toggleTheme = () => {
    const newThemeName = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newThemeName);
    applyTheme();
  };

  const toggleLightBackgroundColor = (color) => {
    themes['light'] = {...themes['light'], 'bs-body-bg': color}
    localStorage.setItem('themeLightBackgroundColor', color)
    console.log('Background', localStorage.getItem('theme'))
    if (localStorage.getItem('theme') == 'light') {
      Object.keys(themes['light']).forEach(key => {
          document.documentElement.style.setProperty(`--${key}`, themes['light'][key]);
      });
    }
  }

  const toggleLightSidebarColor = (color) => {
    themes['light'] = {...themes['light'], 'bs-background-color': color}
    localStorage.setItem('themeLightSidebarColor', color)
    console.log('SideBar', localStorage.getItem('theme'))
    if (localStorage.getItem('theme') == 'light') {
      Object.keys(themes['light']).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, themes['light'][key]);
      });
    }
  }



  const applyTheme = () => {
    var themeName = localStorage.getItem('theme') == null ? 'light' : localStorage.getItem('theme') 
    const theme = themes[themeName];
    if (localStorage.getItem('themeLightBackgroundColor') == "" && themeName == 'light') {
      localStorage.setItem('themeLightBackgroundColor', theme['bs-body-bg'])
    }
    if(localStorage.getItem('themeLightSidebarColor') == "" && themeName == 'light') {
      localStorage.setItem('themeLightSidebarColor', theme['bs-background-color'])
    }
    Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, theme[key]);
    });
  };

  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme, toggleLightBackgroundColor, toggleLightSidebarColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
