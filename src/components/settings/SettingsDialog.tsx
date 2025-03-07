
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { OpenAIKeySettings } from "./OpenAIKeySettings";
import { useEffect, useState } from "react";
import FeedbackPanel from "./FeedbackPanel";
import IManageConfigDialog from "@/components/document/IManageConfigDialog";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

const SettingsDialog = ({ open, onOpenChange, defaultTab = "appearance" }: SettingsDialogProps) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Update active tab when defaultTab prop changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // This ensures the dialog properly closes and doesn't leave any artifacts
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Small delay to ensure animations complete before state changes
      setTimeout(() => {
        onOpenChange(newOpen);
      }, 10);
    } else {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`p-3 rounded-md flex flex-col items-center border ${
                    theme === "light" ? "border-primary bg-primary/10" : "border-input"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <span className="sr-only">Light</span>
                  <div className="h-16 w-full rounded-md bg-[#FAFAFA] border" />
                  <span className="mt-2">Light</span>
                </button>
                
                <button
                  type="button"
                  className={`p-3 rounded-md flex flex-col items-center border ${
                    theme === "dark" ? "border-primary bg-primary/10" : "border-input"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <span className="sr-only">Dark</span>
                  <div className="h-16 w-full rounded-md bg-[#131313] border" />
                  <span className="mt-2">Dark</span>
                </button>
                
                <button
                  type="button"
                  className={`p-3 rounded-md flex flex-col items-center border ${
                    theme === "system" ? "border-primary bg-primary/10" : "border-input"
                  }`}
                  onClick={() => setTheme("system")}
                >
                  <span className="sr-only">System</span>
                  <div className="h-16 w-full rounded-md bg-gradient-to-b from-[#FAFAFA] to-[#131313] border" />
                  <span className="mt-2">System</span>
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="language" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Language</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`p-3 rounded-md border ${
                    language === "en" ? "border-primary bg-primary/10" : "border-input"
                  }`}
                  onClick={() => setLanguage("en")}
                >
                  English
                </button>
                
                <button
                  type="button"
                  className={`p-3 rounded-md border ${
                    language === "es" ? "border-primary bg-primary/10" : "border-input"
                  }`}
                  onClick={() => setLanguage("es")}
                >
                  Español
                </button>
                
                <button
                  type="button"
                  className={`p-3 rounded-md border ${
                    language === "fr" ? "border-primary bg-primary/10" : "border-input"
                  }`}
                  onClick={() => setLanguage("fr")}
                >
                  Français
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6">
            <OpenAIKeySettings />
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">iManage Integration</h3>
              <p className="text-sm text-muted-foreground">
                Configure your connection to iManage Work document management system.
              </p>
              
              <div className="pt-2">
                <IManageConfigDialog />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="feedback" className="space-y-4">
            <FeedbackPanel />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
