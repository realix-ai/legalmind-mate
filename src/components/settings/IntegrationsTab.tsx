
import { Separator } from "@/components/ui/separator";
import { OpenAIKeySettings } from "./OpenAIKeySettings";
import { OutlookIntegration } from "./OutlookIntegration";

export function IntegrationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Integrations</h2>
        <p className="text-sm text-muted-foreground">
          Configure connections to external services and APIs.
        </p>
      </div>
      
      <Separator />
      
      <OpenAIKeySettings />
      
      <Separator />
      
      <OutlookIntegration />
    </div>
  );
}
