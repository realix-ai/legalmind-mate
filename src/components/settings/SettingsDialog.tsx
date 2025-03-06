
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { OpenAIKeySettings } from "./OpenAIKeySettings";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
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
                  className={`p-3 rounded-md border ${
                    language === "en" ? "border-primary bg-primary/10" : "border-input"
                  }`}
                  onClick={() => setLanguage("en")}
                >
                  English
                </button>
                
                <button
                  className={`p-3 rounded-md border ${
                    language === "es" ? "border-primary bg-primary/10" : "border-input"
                  }`}
                  onClick={() => setLanguage("es")}
                >
                  Español
                </button>
                
                <button
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
