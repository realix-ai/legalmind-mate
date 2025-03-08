
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { KeyRound, Save, CheckCircle, XCircle } from 'lucide-react';

export function OpenAIKeySettings() {
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('openai-api-key') || '');
  const [isEditing, setIsEditing] = useState<boolean>(!localStorage.getItem('openai-api-key'));
  const [isTesting, setIsTesting] = useState<boolean>(false);
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    // Store in localStorage (in a real app, this should be handled more securely)
    localStorage.setItem('openai-api-key', apiKey.trim());
    toast.success("API key saved");
    setIsEditing(false);
  };
  
  const testApiKey = async () => {
    const key = apiKey.trim();
    if (!key) {
      toast.error("Please enter an API key first");
      return;
    }
    
    setIsTesting(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      
      if (response.ok) {
        toast.success("API key is valid");
      } else {
        toast.error("Invalid API key");
      }
    } catch (error) {
      toast.error("Failed to verify API key");
      console.error("Error testing API key:", error);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">OpenAI API Key</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Enter your OpenAI API key to enable ChatGPT integration. Your key is stored locally in your browser.
        </p>
        
        {isEditing ? (
          <div className="space-y-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              className="font-mono"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveKey} 
                size="sm" 
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                Save Key
              </Button>
              <Button 
                onClick={testApiKey} 
                variant="outline" 
                size="sm" 
                disabled={isTesting || !apiKey.trim()}
                className="gap-1"
              >
                {isTesting ? (
                  <>Testing...</>
                ) : (
                  <>Test Key</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono bg-muted px-3 py-1.5 rounded text-sm">
                ••••••••{apiKey.slice(-4)}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">API key configured</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
