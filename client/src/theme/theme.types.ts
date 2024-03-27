// theme.types.ts
export type ThemeType = {
  [key: string]: string; // This represents the styles for a theme
};

export interface ThemeContextType {
  themeName: string; // This now represents the name of the current theme
  toggleTheme: () => void; // Function to toggle between themes
  toggleLightThemeChange: () => void;  // Function to toggle between light themes
}
