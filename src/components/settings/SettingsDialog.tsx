
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceTab } from "./AppearanceTab";
import { IntegrationsTab } from "./IntegrationsTab";
import FeedbackPanel from "./FeedbackPanel";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: string;
  theme: string;
  language: string;
  onSaveSettings: (theme: string, language: string) => void;
}

export const SettingsDialog = ({
  open,
  onOpenChange,
  activeTab: initialTab,
  theme,
  language,
  onSaveSettings,
}: SettingsDialogProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Settings</DialogTitle>
          <DialogDescription>
            Customize your application experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <AppearanceTab
              initialTheme={theme}
              initialLanguage={language}
              onSave={onSaveSettings}
            />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackPanel />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
