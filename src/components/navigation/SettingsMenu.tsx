
import { useCallback, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { SettingsMenuDropdown } from "@/components/settings/SettingsMenuDropdown";
import { SettingsDialog } from "@/components/settings/SettingsDialog";

export const SettingsMenu = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setIsSettingsOpen(false);
      }, 10);
    } else {
      setIsSettingsOpen(true);
    }
  }, []);

  const handleOpenSettings = useCallback((tab: string) => {
    setActiveTab(tab);
    setIsSettingsOpen(true);
  }, []);

  const handleSaveSettings = useCallback((selectedTheme: string, selectedLanguage: string) => {
    if (selectedTheme !== theme) {
      setTheme(selectedTheme as "light" | "dark" | "system");
    }
    
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
    }
    
    setTimeout(() => {
      setIsSettingsOpen(false);
    }, 10);
  }, [theme, language, setTheme, setLanguage]);

  return (
    <>
      <SettingsMenuDropdown onOpenSettings={handleOpenSettings} />
      
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={handleOpenChange}
        activeTab={activeTab}
        theme={theme}
        language={language}
        onSaveSettings={handleSaveSettings}
      />
    </>
  );
};
