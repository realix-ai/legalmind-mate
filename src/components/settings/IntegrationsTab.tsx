
import { KeyRound, Cloud, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OpenAIKeySettings } from "./OpenAIKeySettings";
import { OutlookIntegration } from "./OutlookIntegration";

export function IntegrationsTab() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">External Integrations</h2>
        <p className="text-sm text-muted-foreground">
          Connect your favorite services to enhance your workflow
        </p>
      </div>

      <div className="grid gap-6">
        <IntegrationSection 
          title="API Integrations" 
          icon={<KeyRound className="h-5 w-5 mr-2 text-primary" />}
        >
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="pt-4">
              <OpenAIKeySettings />
            </CardContent>
          </Card>
        </IntegrationSection>

        <IntegrationSection 
          title="Communication Tools" 
          icon={<Mail className="h-5 w-5 mr-2 text-primary" />}
        >
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="pt-4">
              <OutlookIntegration />
            </CardContent>
          </Card>
        </IntegrationSection>
      </div>
    </div>
  );
}

interface IntegrationSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const IntegrationSection = ({ title, icon, children }: IntegrationSectionProps) => {
  return (
    <div className="bg-primary/5 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        {icon}
        {title}
      </h3>
      <Separator className="mb-4" />
      {children}
    </div>
  );
};
