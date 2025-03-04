
import { useState, useRef } from 'react';
import { usePrompts } from '@/hooks/use-prompts';
import PromptToolbar from '@/components/prompt/PromptToolbar';
import PromptSearch from '@/components/prompt/PromptSearch';
import PromptForm from '@/components/prompt/PromptForm';
import PromptList from '@/components/prompt/PromptList';

interface PromptManagerProps {
  onSelectPrompt: (promptText: string) => void;
}

const PromptManager = ({ onSelectPrompt }: PromptManagerProps) => {
  const { prompts, addPrompt, deletePrompt, importPrompts, exportPrompts } = usePrompts();
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        importPrompts(e.target.result);
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const handleExportClick = () => {
    const dataStr = exportPrompts();
    if (!dataStr) return;
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `legal-prompts-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleSelectPrompt = (promptText: string) => {
    onSelectPrompt(promptText);
  };

  // Filter prompts based on search query
  const filteredPrompts = prompts.filter(prompt => 
    prompt.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-2 p-3 border rounded-md shadow-sm bg-background">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Saved Prompts</h3>
        <PromptToolbar 
          onAddClick={() => setShowAddPrompt(!showAddPrompt)} 
          onImportClick={handleImportClick}
          onExportClick={handleExportClick}
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        id="import-prompts"
        className="hidden"
        accept=".json"
        onChange={handleImportPrompts}
      />

      <PromptSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {showAddPrompt && (
        <PromptForm 
          onAddPrompt={addPrompt} 
          onClose={() => setShowAddPrompt(false)} 
        />
      )}

      <PromptList 
        prompts={filteredPrompts} 
        onSelectPrompt={handleSelectPrompt} 
        onDeletePrompt={deletePrompt} 
      />
    </div>
  );
};

export default PromptManager;
