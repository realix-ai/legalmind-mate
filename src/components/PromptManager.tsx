
import { useState, useEffect } from 'react';
import { Plus, Minus, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Prompt {
  id: string;
  text: string;
}

interface PromptManagerProps {
  onSelectPrompt: (promptText: string) => void;
}

const PromptManager = ({ onSelectPrompt }: PromptManagerProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [newPromptText, setNewPromptText] = useState('');

  // Load prompts from localStorage on component mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem('userPrompts');
    if (savedPrompts) {
      try {
        setPrompts(JSON.parse(savedPrompts));
      } catch (error) {
        console.error('Error loading prompts:', error);
        toast.error('Failed to load saved prompts');
      }
    }
  }, []);

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPrompts', JSON.stringify(prompts));
  }, [prompts]);

  const handleAddPrompt = () => {
    if (!newPromptText.trim()) {
      toast.error('Prompt text cannot be empty');
      return;
    }

    const newPrompt: Prompt = {
      id: Date.now().toString(),
      text: newPromptText.trim()
    };

    setPrompts([...prompts, newPrompt]);
    setNewPromptText('');
    setShowAddPrompt(false);
    toast.success('Prompt saved successfully');
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
    toast.success('Prompt deleted');
  };

  const handleSelectPrompt = (promptText: string) => {
    onSelectPrompt(promptText);
    toast.success('Prompt loaded');
  };

  const handleImportPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPrompts = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedPrompts) && importedPrompts.every(p => p.id && p.text)) {
          setPrompts(importedPrompts);
          toast.success('Prompts imported successfully');
        } else {
          toast.error('Invalid prompts file format');
        }
      } catch (error) {
        console.error('Error importing prompts:', error);
        toast.error('Failed to import prompts');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const handleExportPrompts = () => {
    if (prompts.length === 0) {
      toast.error('No prompts to export');
      return;
    }
    
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `legal-prompts-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Prompts exported successfully');
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Saved Prompts</h3>
        <div className="flex gap-1">
          <input
            type="file"
            id="import-prompts"
            className="hidden"
            accept=".json"
            onChange={handleImportPrompts}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => document.getElementById('import-prompts')?.click()}
            title="Import prompts"
          >
            <Upload className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={handleExportPrompts}
            title="Export prompts"
          >
            <Save className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => setShowAddPrompt(!showAddPrompt)}
            title="Add new prompt"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {showAddPrompt && (
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={newPromptText}
            onChange={(e) => setNewPromptText(e.target.value)}
            placeholder="Enter your prompt template"
            className="flex-1 text-sm px-3 py-1 rounded-md border"
          />
          <Button 
            size="sm" 
            className="h-8"
            onClick={handleAddPrompt}
          >
            Save
          </Button>
        </div>
      )}

      {prompts.length > 0 ? (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {prompts.map((prompt) => (
            <div 
              key={prompt.id}
              className="flex group items-center text-sm border rounded-md p-2 hover:bg-accent transition-colors"
            >
              <p 
                className="flex-1 line-clamp-1 cursor-pointer" 
                onClick={() => handleSelectPrompt(prompt.text)}
                title={prompt.text}
              >
                {prompt.text}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeletePrompt(prompt.id)}
                title="Delete prompt"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">No saved prompts. Add one to get started.</p>
      )}
    </div>
  );
};

export default PromptManager;
