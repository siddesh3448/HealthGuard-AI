import { useTheme as useContextTheme } from '../context/ThemeContext';

export function useTheme() {
  return useContextTheme();
}
