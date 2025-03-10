
import { useEffect, useState } from 'react';
import { Cloud, Save, Lock, Unlock, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useIManageDocumentEditing } from '@/hooks/document/useIManageDocumentEditing';
import DocumentEditor from '@/components/document/DocumentEditor';
import { formatDistanceToNow } from 'date-fns';

interface DirectIManageEditorProps {
  externalId: string;
  onClose: () => void;
}

const DirectIManageEditor = ({ externalId, onClose }: DirectIManageEditorProps) => {
  const [isInitializing, setIsInitializing] = useState(true);
  
  const {
    isEditing,
    isLoading,
    isSaving,
    content,
    title,
    category,
    lastSaved,
    autoSaveEnabled,
    setContent,
    setTitle,
    setAutoSaveEnabled,
    startEditing,
    saveDocument,
    endEditing
  } = useIManageDocumentEditing({
    externalId
  });
  
  // Start editing when component mounts
  useEffect(() => {
    const initialize = async () => {
      const success = await startEditing();
      setIsInitializing(false);
      if (!success) {
        // If we couldn't start editing, close the editor
        onClose();
      }
    };
    
    initialize();
    
    // Clean up when component unmounts
    return () => {
      endEditing(true); // Save changes before closing
    };
  }, [startEditing, endEditing, onClose]);
  
  const handleSave = async () => {
    await saveDocument();
  };
  
  const handleClose = async () => {
    await endEditing(true);
    onClose();
  };
  
  if (isInitializing || isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Cloud className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-lg font-medium">Loading document from iManage...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-primary/5 border-b">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Editing iManage Document</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last saved {formatDistanceToNow(lastSaved)} ago</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="gap-1"
              onClick={handleClose}
            >
              <X className="h-3.5 w-3.5" />
              Close
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                placeholder="Document Title"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing && (
                <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Locked for editing</span>
                </div>
              )}
            </div>
          </div>
          
          <Card className="mb-4">
            <CardHeader className="py-2">
              <CardTitle className="text-sm">Document Settings</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-save"
                    checked={autoSaveEnabled}
                    onCheckedChange={setAutoSaveEnabled}
                  />
                  <Label htmlFor="auto-save">Auto-save</Label>
                </div>
                
                <span className="text-xs text-muted-foreground">
                  Category: {category}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Separator className="my-4" />
          
          <div className="min-h-[500px]">
            <DocumentEditor
              content={content}
              onChange={setContent}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectIManageEditor;
