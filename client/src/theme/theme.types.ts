// This file will contain the types for your theme

export type ThemeType = {
  [key: string]: string; // This can be more specific based on your actual theme structure
};

export interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}
