
import { useTheme as useThemeInternal } from "@/components/theme-provider"

export const useTheme = () => {
  return useThemeInternal();
};
