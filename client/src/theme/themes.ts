import { ThemeType } from './theme.types';

export const themes: { [key: string]: ThemeType } = {
  casual: {
    'bs-body-bg': '#ECE3CE',
    'bs-body-color': '#3A4D39',
    'bs-btn-primary-bg': '#007bff',
    'bs-btn-primary-color': '#ffffff',
    'bs-link-color': '#007bff',
    'bs-link-hover-color': '#0056b3',
    'bs-background-color': '#4F6F52',
    'sidebar-text-color': '#ffffff',
    'sidebar-text-color-active': '#3A4D39',
    // Typography
    'bs-font-sans-serif': 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
  dark: {
    'bs-body-bg': '#343a40',
    'bs-body-color': '#f8f9fa',
    'bs-btn-primary-bg': '#6c757d',
    'bs-btn-primary-color': '#ffffff',
    'bs-link-color': '#9ab',
    'bs-link-hover-color': '#789',
    'bs-background-color': '#000000',
    'sidebar-text-color': '#ffffff',
    'sidebar-text-color-active': 'grey',
    // Typography
    'bs-font-sans-serif': 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
  construction: {
    'bs-body-bg': '#FFA500',
    'bs-body-color': '#FFFF00',
    'bs-btn-primary-bg': '#00FF00',
    'bs-btn-primary-color': '#ffffff',
    'bs-link-color': '#0000FF',
    'bs-link-hover-color': '#789',
    'bs-background-color': '#000000',
    'sidebar-text-color': '#ffffff',
    'sidebar-text-color-active': 'grey',
    // Typography
    'bs-font-sans-serif': 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  }, 
  medicine: {
    'bs-body-bg': '#1E90FF',
    'bs-body-color': '#FFFFFF', 
    'bs-btn-primary-bg': '#F5F5F5', 
    'bs-btn-primary-color': '#000000',
    'bs-link-color': '#FF0000', 
    'bs-link-hover-color': '#800000',
    'bs-background-color': '#FFFFFF',
    'sidebar-bg-color': '#FFFFFF',
    'sidebar-text-color': '#000000',
    'sidebar-text-color-active': '#FF1493'
  }
  //additional themes will go here
};