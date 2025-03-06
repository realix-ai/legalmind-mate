
import { useTheme as useThemeInternal } from "@/components/theme-provider"

export const useTheme = () => {
  // Simply return the context from the theme provider
  // No additional wrapping or timeouts that might cause issues
  return useThemeInternal();
};
