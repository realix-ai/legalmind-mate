
import { Settings, CreditCard } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useTheme } from "@/hooks/use-theme"
import { useLanguage } from "@/hooks/use-language"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

// Language options for the settings menu
const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Español (Spanish)" },
  { value: "fr", label: "Français (French)" },
  { value: "de", label: "Deutsch (German)" },
  { value: "zh", label: "中文 (Chinese)" },
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "ar", label: "العربية (Arabic)" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "pt", label: "Português (Portuguese)" },
  { value: "ru", label: "Русский (Russian)" },
];

export const SettingsMenu = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  // Initialize theme selector value when theme changes
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);
  
  // Initialize language selector when language changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Save settings changes - using useCallback to prevent unnecessary re-renders
  const saveSettingsChanges = useCallback(() => {
    // Track if changes were made
    let changesMade = false;
    
    // Apply theme change if needed
    if (selectedTheme !== theme) {
      setTheme(selectedTheme);
      changesMade = true;
    }
    
    // Apply language change if needed
    if (selectedLanguage !== language) {
      console.log('Changing language from', language, 'to', selectedLanguage);
      setLanguage(selectedLanguage);
      changesMade = true;
    }
    
    // Close dialog immediately if no changes, or after a short delay if changes were made
    if (changesMade) {
      // Use a slightly longer timeout to ensure state changes have time to propagate
      setTimeout(() => {
        setIsSettingsOpen(false);
      }, 100);
    } else {
      setIsSettingsOpen(false);
    }
  }, [selectedTheme, selectedLanguage, theme, language, setTheme, setLanguage]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open settings menu" className="p-1 rounded-full hover:bg-accent transition-colors">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            App Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Application Settings</DialogTitle>
            <DialogDescription>
              Customize your application experience
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <select 
                id="theme" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as "light" | "dark" | "system")}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Language</Label>
              <select 
                id="language" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveSettingsChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
