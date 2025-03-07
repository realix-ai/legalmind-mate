
import { Settings, CreditCard, KeyRound, MessageSquarePlus, Cloud } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useTheme } from "@/hooks/use-theme"
import { useLanguage } from "@/hooks/use-language"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OpenAIKeySettings } from "@/components/settings/OpenAIKeySettings"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import FeedbackPanel from "@/components/settings/FeedbackPanel"
import IManageConfigDialog from "@/components/document/IManageConfigDialog"

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
  const [activeTab, setActiveTab] = useState('appearance');

  // Reset local states when external values change
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);
  
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Handle dialog open state change with proper timing
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      // Reset selections to current values when opening
      setSelectedTheme(theme);
      setSelectedLanguage(language);
      setIsSettingsOpen(true);
    } else {
      // Small delay to ensure animations complete before state changes
      setTimeout(() => {
        setIsSettingsOpen(false);
      }, 10);
    }
  }, [theme, language]);

  // Save settings - split into separate handlers for better performance
  const handleSaveSettings = useCallback(() => {
    // Apply changes first
    if (selectedTheme !== theme) {
      setTheme(selectedTheme);
    }
    
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
    }
    
    // Close dialog with a small delay to ensure proper closing
    setTimeout(() => {
      setIsSettingsOpen(false);
    }, 10);
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
          <DropdownMenuItem onClick={() => {
            setActiveTab('appearance');
            handleOpenChange(true);
          }}>
            <Settings className="mr-2 h-4 w-4" />
            Appearance
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setActiveTab('integrations');
            handleOpenChange(true);
          }}>
            <KeyRound className="mr-2 h-4 w-4" />
            Integrations
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setActiveTab('feedback');
            handleOpenChange(true);
          }}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Feedback
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Application Settings</DialogTitle>
            <DialogDescription>
              Customize your application experience
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4">
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
              <DialogFooter>
                <Button type="button" onClick={handleSaveSettings}>Save changes</Button>
              </DialogFooter>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <OpenAIKeySettings />
              
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="text-sm font-medium">iManage Integration</h3>
                <p className="text-xs text-muted-foreground">
                  Configure your connection to iManage Work document management system.
                </p>
                
                <div>
                  <IManageConfigDialog />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="feedback">
              <FeedbackPanel />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
