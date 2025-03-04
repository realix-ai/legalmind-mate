
import { useState, useRef } from 'react';
import { usePrompts } from '@/hooks/use-prompts';
import PromptToolbar from '@/components/prompt/PromptToolbar';
import PromptSearch from '@/components/prompt/PromptSearch';
import PromptForm from '@/components/prompt/PromptForm';
import PromptList from '@/components/prompt/PromptList';
import { toast } from 'sonner';

interface PromptManagerProps {
  onSelectPrompt: (promptText: string) => void;
}

const PromptManager = ({ onSelectPrompt }: PromptManagerProps) => {
  const { prompts, addPrompt, deletePrompt, exportPrompts } = usePrompts();
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  
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

  const handleSelectPrompt = (promptText: string, promptId: string) => {
    setSelectedPromptId(promptId);
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
          onExportClick={handleExportClick}
        />
      </div>

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
        selectedPromptId={selectedPromptId}
      />
    </div>
  );
};

export default PromptManager;
