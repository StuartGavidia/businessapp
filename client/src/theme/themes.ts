import { ThemeType } from './theme.types';

export const themes: { [key: string]: ThemeType } = {
  light: {
    'body-bg': '#f8f9fa',
    'body-color': '#212529',
    'btn-primary-bg': '#007bff',
    'btn-primary-color': '#ffffff',
    'link-color': '#007bff',
    'link-hover-color': '#0056b3',
    // Add other Bootstrap variables you wish to override for the light theme
  },
  dark: {
    'body-bg': '#343a40',
    'body-color': '#f8f9fa',
    'btn-primary-bg': '#6c757d',
    'btn-primary-color': '#ffffff',
    'link-color': '#9ab',
    'link-hover-color': '#789',
    // Add other Bootstrap variables you wish to override for the dark theme
  },
  // You can define additional themes here
};
