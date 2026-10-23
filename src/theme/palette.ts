import { useThemeStore } from '../store/useThemeStore';

export interface Palette {
  background: string;
  card: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  error: string;
  shadow: string;
}

export const palettes: Record<'light' | 'dark', Palette> = {
  light: {
    background: '#ffffff',
    card: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    textSecondary: '#666666',
    textMuted: '#888888',
    error: '#d63384',
    shadow: '#000000',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#cccccc',
    textMuted: '#999999',
    error: '#ff6b6b',
    shadow: '#ffffff',
  },
};

/** Builds one StyleSheet per theme up front, so components never create inline styles. */
export function createThemedStyles<T>(factory: (palette: Palette) => T) {
  return {
    light: factory(palettes.light),
    dark: factory(palettes.dark),
  };
}

export const useTheme = () => useThemeStore(state => state.theme);
