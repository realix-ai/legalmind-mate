
import { useTheme as useThemeInternal } from "@/components/theme-provider"

export const useTheme = () => {
  const context = useThemeInternal();
  
  // Use the theme from the context
  return {
    ...context,
    setTheme: (theme: "light" | "dark" | "system") => {
      // Use setTimeout to prevent UI blocking
      setTimeout(() => {
        context.setTheme(theme);
        console.log('Theme changed to:', theme);
      }, 0);
    }
  };
};
