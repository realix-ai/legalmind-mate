
import { useTheme as useThemeInternal } from "@/components/theme-provider"

export const useTheme = () => {
  const context = useThemeInternal();
  
  // Initialize theme from localStorage on first render if it doesn't exist
  if (typeof window !== 'undefined' && !localStorage.getItem('vite-ui-theme')) {
    localStorage.setItem('vite-ui-theme', context.theme);
  }
  
  return context;
};
