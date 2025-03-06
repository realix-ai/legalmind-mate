
import { useLanguage } from "@/hooks/use-language"

// Map of language codes to their display names
const languageDisplayNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
  hi: "हिन्दी",
  pt: "Português",
  ru: "Русский",
};

export const LanguageIndicator = () => {
  const { language } = useLanguage();
  
  // Get the display name for the current language code
  const displayName = languageDisplayNames[language] || language;
  
  return (
    <div className="flex items-center text-sm font-medium mr-2 px-2 py-1 rounded-md bg-accent/30">
      <span className="hidden sm:inline">{displayName}</span>
      <span className="sm:hidden">{language.toUpperCase()}</span>
    </div>
  );
};
